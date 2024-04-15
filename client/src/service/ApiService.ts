import axios, { AxiosRequestConfig } from "axios";
import GroupResponse from "../model/GroupResponse";
import { ApiResponse, BaseResponse } from "../model/BaseResponse";
import { ExpenseResponse } from "../model/ExpenseResponse";
import { SummaryResponse } from "../model/SummaryResponse";

export const ApiService = {
  BASE_URL: "http://localhost:3000/api/group",
  getHeader: (accessToken: string): AxiosRequestConfig => {
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  },
  getGroup: async (
    groupId: string,
    accessToken: string
  ): Promise<ApiResponse<GroupResponse>> => {
    const response = await axios.get<ApiResponse<GroupResponse>>(
      `${ApiService.BASE_URL}/${groupId}`,
      ApiService.getHeader(accessToken)
    );
    return response.data;
  },
  joinGroup: async (
    groupId: string,
    accessToken: string
  ): Promise<BaseResponse> => {
    const response = await axios.post<BaseResponse>(
      `${ApiService.BASE_URL}/${groupId}/join`,
      null,
      ApiService.getHeader(accessToken)
    );
    return response.data;
  },
  getExpenses: async (
    groupId: string,
    accessToken: string
  ): Promise<ApiResponse<ExpenseResponse>> => {
    const response = await axios.get<ApiResponse<ExpenseResponse>>(
      `${ApiService.BASE_URL}/${groupId}/expense`,
      ApiService.getHeader(accessToken)
    );
    return response.data;
  },
  getSummary: async (
    groupId: string,
    accessToken: string
  ): Promise<ApiResponse<SummaryResponse>> => {
    const response = await axios.get<ApiResponse<SummaryResponse>>(
      `${ApiService.BASE_URL}/${groupId}/expense/summary`,
      ApiService.getHeader(accessToken)
    );
    return response.data;
  }
};
