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
