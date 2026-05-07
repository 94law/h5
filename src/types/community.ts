/** 服务端原始返回格式 */
export interface CommunityPostRaw {
  id: number;
  userId: number;
  nickname: string;
  avatar: string | null;
  gender: number | null;
  lawyerName: string | null;
  title: string;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  liked: boolean;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

/** 前端使用的格式 */
export interface CommunityPost {
  id: string;
  userId: number;
  nickname: string;
  avatar: string;
  gender: number | null;
  lawyerName: string;
  createTime: string;
  title: string;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  liked: boolean;
  reviewStatus: 'pending' | 'approved' | 'rejected';
}

/** 将服务端数据转为前端格式 */
export function toCommunityPost(raw: CommunityPostRaw): CommunityPost {
  return {
    id: String(raw.id),
    userId: raw.userId,
    nickname: raw.nickname,
    avatar: raw.avatar ?? '',
    gender: raw.gender ?? null,
    lawyerName: raw.lawyerName ?? '',
    createTime: raw.createdAt?.split('T')[0] ?? '',
    title: raw.title,
    content: raw.content,
    images: raw.images ?? [],
    likeCount: raw.likeCount,
    commentCount: raw.commentCount,
    liked: raw.liked ?? false,
    reviewStatus: raw.reviewStatus,
  };
}

/** 用于 mock 降级数据（API 不可用时使用） */
export const mockPosts: CommunityPost[] = [
  {
    id: '1',
    userId: 1,
    avatar: '',
    gender: 1,
    nickname: '张律师',
    lawyerName: '张律师',
    createTime: '2026-04-25',
    title: '一起劳动争议案件的胜诉分享',
    content: '近日代理了一起劳动争议案件，劳动者因公司未签订劳动合同要求双倍工资赔偿，最终仲裁委支持了我方全部诉求。\n\n这个案例的关键在于证据链的完整性...',
    images: [],
    likeCount: 128,
    liked: false,
    reviewStatus: 'approved',
    commentCount: 0,
  },
  {
    id: '2',
    userId: 2,
    avatar: '',
    gender: 0,
    nickname: '李律师',
    lawyerName: '李律师',
    createTime: '2026-04-24',
    title: '合同纠纷调解成功案例',
    content: '通过诉前调解方式，成功帮助当事人追回货款50万元。调解相比诉讼，时间更短、成本更低，是解决商业纠纷的优选方案...',
    images: [],
    likeCount: 96,
    liked: false,
    reviewStatus: 'approved',
    commentCount: 0,
  },
  {
    id: '3',
    userId: 3,
    avatar: '',
    gender: 1,
    nickname: '王律师',
    lawyerName: '王律师',
    createTime: '2026-04-23',
    title: '知识产权侵权案办案心得',
    content: '最近处理的一个商标侵权案件非常有代表性，涉及跨境电商平台的商标权保护问题，分享一些实务经验供同行参考...',
    images: [],
    likeCount: 205,
    liked: false,
    reviewStatus: 'approved',
    commentCount: 0,
  },
];

export function getMockPostById(id: string): CommunityPost | undefined {
  return mockPosts.find((post) => post.id === id);
}

/** 评论 - 服务端原始返回格式 */
export interface CommentRaw {
  id: number;
  postId: number;
  userId: number;
  nickname: string;
  avatar: string | null;
  gender: number | null;
  content: string;
  createdAt: string;
}

/** 评论 - 前端使用的格式 */
export interface CommentItem {
  id: string;
  postId: number;
  userId: number;
  nickname: string;
  avatar: string;
  gender: number | null;
  createTime: string;
  content: string;
}

/** 将服务端评论数据转为前端格式 */
export function toCommentItem(raw: CommentRaw): CommentItem {
  return {
    id: String(raw.id),
    postId: raw.postId,
    userId: raw.userId,
    nickname: raw.nickname,
    avatar: raw.avatar ?? '',
    gender: raw.gender ?? null,
    createTime: raw.createdAt?.split('T')[0] ?? '',
    content: raw.content,
  };
}
