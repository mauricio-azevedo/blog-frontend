export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message: string;
  details: string[];
}

export interface Record {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
}
