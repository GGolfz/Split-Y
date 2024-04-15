interface BaseResponse {
  isSuccess: boolean;
  error?: string;
}

interface ApiResponse<T> extends BaseResponse {
  data?: T;
}

export type { BaseResponse, ApiResponse };
