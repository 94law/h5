import axios from '@/shared/axios';
import type {
  LawyerDetail,
  LawyerListItem,
  LawyerListResult,
  LawyerQueryParams,
} from '@/types/lawyer';

const LAWYER_LIST_PATH = '/api/lawyers';
const UNWRAP_MAX = 6;
const LIST_ARRAY_KEYS = ['list', 'records', 'rows', 'items', 'content'] as const;

interface LawyerDetailResponse extends Record<string, unknown> {}

function getRequestPath(path: string): string {
  const baseURL = String(axios.defaults.baseURL ?? '');
  const hasApiPrefixInBaseURL = /\/api\/?$/.test(baseURL);

  if (hasApiPrefixInBaseURL && path.startsWith('/api/')) {
    return path.replace(/^\/api/, '');
  }

  return path;
}

function toStringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function toNumberValue(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

/** 0 女 1 男，其它值不展示 */
function normalizeGender(value: unknown): 0 | 1 | null {
  const n = toNumberValue(value, Number.NaN);
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return null;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === 'object' && !Array.isArray(v);
}

/**
 * 从分页对象中取出律师数组（兼容 list / records / MyBatis-Plus 等）
 */
function extractListArrayFromPayload(o: Record<string, unknown>): {
  rows: Array<Record<string, unknown>>;
  keyUsed: (typeof LIST_ARRAY_KEYS)[number] | null;
} {
  for (const key of LIST_ARRAY_KEYS) {
    const v = o[key];
    if (Array.isArray(v)) {
      return { rows: v as Array<Record<string, unknown>>, keyUsed: key };
    }
  }
  return { rows: [], keyUsed: null };
}

/**
 * 对 axios 已解出的一层业务 data 继续向下解包，直到能拿到 list 或到达数组/叶子
 */
function unwrapListPayload(value: unknown): {
  payload: Record<string, unknown>;
  list: Array<Record<string, unknown>>;
} {
  let current: unknown = value;
  for (let depth = 0; depth < UNWRAP_MAX; depth++) {
    if (current == null) {
      return { payload: {}, list: [] };
    }

    if (Array.isArray(current)) {
      return {
        payload: { list: current } as unknown as Record<string, unknown>,
        list: current as Array<Record<string, unknown>>,
      };
    }

    if (!isPlainObject(current)) {
      return { payload: {}, list: [] };
    }

    const o = current;
    const { rows, keyUsed } = extractListArrayFromPayload(o);

    if (keyUsed != null) {
      return { payload: o, list: rows };
    }

    if (o.data != null) {
      current = o.data;
      continue;
    }
    return { payload: o, list: [] };
  }

  if (isPlainObject(current)) {
    const { rows } = extractListArrayFromPayload(current);
    return { payload: current, list: rows };
  }

  return { payload: {}, list: [] };
}

/**
 * 详情接口可能多包一层 data
 */
function unwrapDetailPayload(value: unknown): Record<string, unknown> {
  let current: unknown = value;
  for (let depth = 0; depth < UNWRAP_MAX; depth++) {
    if (current == null) {
      return {};
    }
    if (Array.isArray(current)) {
      return (current[0] as Record<string, unknown>) ?? {};
    }
    if (!isPlainObject(current)) {
      return {};
    }
    const o = current;
    if (o.data != null && (isPlainObject(o.data) || Array.isArray(o.data))) {
      if (Array.isArray(o.data)) {
        return (o.data[0] as Record<string, unknown>) ?? o;
      }
      current = o.data;
      continue;
    }
    return o;
  }
  return isPlainObject(current) ? current : {};
}

function buildListResult(
  rawPayload: Record<string, unknown>,
  list: Array<Record<string, unknown>>,
  params: LawyerQueryParams,
): LawyerListResult {
  const page = toNumberValue(rawPayload.page ?? rawPayload.current, params.page);
  const pageSize = toNumberValue(rawPayload.pageSize ?? rawPayload.size, params.pageSize);
  const total = toNumberValue(rawPayload.total, 0);

  let hasMore: boolean;
  if (typeof rawPayload.hasMore === 'boolean') {
    hasMore = rawPayload.hasMore;
  } else if (typeof rawPayload.hasNext === 'boolean') {
    hasMore = rawPayload.hasNext;
  } else if (total > 0) {
    hasMore = page * pageSize < total;
  } else {
    hasMore = list.length > 0 && list.length === pageSize;
  }

  if (list.length < pageSize) {
    hasMore = false;
  }

  return {
    list: list.map((item) => normalizeLawyer((item ?? {}) as Record<string, unknown>)),
    page,
    pageSize,
    total,
    hasMore,
  };
}

function normalizeLawyer(rawItem: Record<string, unknown>): LawyerListItem {
  return {
    id: toStringValue(rawItem.id, String(toNumberValue(rawItem.id))),
    name: toStringValue(rawItem.name),
    gender: normalizeGender(rawItem.gender),
    avatarUrl: toStringValue(rawItem.avatarUrl),
    title: toStringValue(rawItem.title),
    city: toStringValue(rawItem.city),
    lawFirm: toStringValue(rawItem.lawFirm),
    yearsOfPractice: toNumberValue(rawItem.yearsOfPractice),
    expertise: toStringValue(rawItem.expertise),
    consultationCount: toNumberValue(rawItem.consultationCount),
    rating: toStringValue(rawItem.rating),
    priceText: toStringValue(rawItem.priceText),
  };
}

export async function getLawyerList(params: LawyerQueryParams): Promise<LawyerListResult> {
  const response = await axios.get(getRequestPath(LAWYER_LIST_PATH), {
    params,
    __interceptorOptions__: {
      security: false,
      redirectToLogin: false,
    },
  });
  const { payload, list } = unwrapListPayload(response as unknown);
  return buildListResult(payload, list, params);
}

export async function getLawyerDetail(id: string): Promise<LawyerDetail> {
  const response = await axios.get(getRequestPath(`${LAWYER_LIST_PATH}/${id}`), {
    __interceptorOptions__: {
      security: false,
      redirectToLogin: false,
    },
  });
  const data = unwrapDetailPayload(response) as LawyerDetailResponse;
  const base = normalizeLawyer(data);

  return {
    ...base,
    contactPhone: toStringValue(data.contactPhone),
    contactWechat: toStringValue(data.contactWechat),
    contactEmail: toStringValue(data.contactEmail),
    bio: toStringValue(data.bio),
    education: toStringValue(data.education),
    languages: toStringValue(data.languages),
    serviceTime: toStringValue(data.serviceTime),
    successCases: toStringValue(data.successCases),
    honors: toStringValue(data.honors),
  };
}
