export interface LawyerQueryParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

export interface LawyerListItem {
  id: string;
  name: string;
  /**
   * 0 女 1 男；其它值在 UI 不展示
   */
  gender: 0 | 1 | null;
  avatarUrl: string;
  title: string;
  city: string;
  lawFirm: string;
  yearsOfPractice: number;
  expertise: string;
  consultationCount: number;
  rating: string;
  priceText: string;
}

export interface LawyerDetail extends LawyerListItem {
  contactPhone: string;
  contactWechat: string;
  contactEmail: string;
  bio: string;
  education: string;
  languages: string;
  serviceTime: string;
  successCases: string;
  honors: string;
}

export interface LawyerListResult {
  list: LawyerListItem[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
