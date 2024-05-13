import axios, { AxiosRequestConfig } from "axios";
import GroupResponse from "../model/GroupResponse";
import { ApiResponse, BaseResponse } from "../model/BaseResponse";
import { ExpenseResponse } from "../model/ExpenseResponse";
import { SummaryResponse } from "../model/SummaryResponse";
import { ExpenseRequest } from "../model/ExpenseRequest";
import GroupInfoResponse from "../model/GroupInfoResponse";

export const ApiService = {
  BASE_URL: `/api/group`,
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
  getGroupInformation: async (
    groupId: string
  ): Promise<ApiResponse<GroupInfoResponse>> => {
    const response = await axios.get<ApiResponse<GroupInfoResponse>>(
      `${ApiService.BASE_URL}/${groupId}`
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
  },
  createExpense: async (
    groupId: string,
    accessToken: string,
    request: ExpenseRequest
  ): Promise<BaseResponse> => {
    const response = await axios.post<BaseResponse>(
      `${ApiService.BASE_URL}/${groupId}/expense/create`,
      request,
      ApiService.getHeader(accessToken)
    );
    return response.data;
  },
  updateExpense: async (
    groupId: string,
    accessToken: string,
    expenseId: string,
    request: ExpenseRequest
  ): Promise<BaseResponse> => {
    const response = await axios.post<BaseResponse>(
      `${ApiService.BASE_URL}/${groupId}/expense/${expenseId}/update`,
      request,
      ApiService.getHeader(accessToken)
    );
    return response.data;
  },
  deleteExpense: async (
    groupId: string,
    accessToken: string,
    expenseId: string
  ): Promise<BaseResponse> => {
    const response = await axios.post<BaseResponse>(
      `${ApiService.BASE_URL}/${groupId}/expense/${expenseId}/delete`,
      null,
      ApiService.getHeader(accessToken)
    );
    return response.data;
  },
};
