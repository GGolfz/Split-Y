import { Group, PrismaClient } from "@prisma/client";
import { LineApiService } from "../plugin/LineApiPlugin";
import GroupResponse from "../model/Group";
import { ApiResponse, BaseResponse } from "../model/BaseResponse";
import { withExceptionWrapper } from "../utils/exceptionWrapper";
import { LineProfile } from "../model/LineProfile";
import { ExpenseRequest } from "../model/ExpenseRequest";

abstract class WebApiService {
  private static async getGroupFromDB(
    prismaClient: PrismaClient,
    groupId: string
  ): Promise<Group> {
    const group = await prismaClient.group.findUnique({
      where: {
        groupId: groupId,
        isActive: true,
      },
    });
    if (group === null) {
      throw new Error("Group is not exist");
    }
    return group;
  }
  private static async isUserInGroup(
    prismaClient: PrismaClient,
    userProfile: LineProfile,
    groupId: string
  ): Promise<Group> {
    const group = await WebApiService.getGroupFromDB(prismaClient, groupId);
    const isUserInGroup = group.members.includes(userProfile.userId);
    if (!isUserInGroup) {
      throw new Error("User is not in the group");
    }
    return group;
  }
  static async getGroup(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    accessToken: string,
    groupId: string
  ): Promise<ApiResponse<GroupResponse>> {
    return withExceptionWrapper(async () => {
      const userProfile = await lineApiService.getUserProfile(accessToken);
      const group = await WebApiService.isUserInGroup(
        prismaClient,
        userProfile,
        groupId
      );
      const memberProfiles = await lineApiService.getGroupMembersProfile(
        group.members,
        group.lineGroupId
      );
      return {
        isSuccess: true,
        data: {
          groupId: group.groupId,
          members: memberProfiles,
        },
      };
    }, "Failed to get group");
  }
  static async joinGroup(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    accessToken: string,
    groupId: string
  ): Promise<BaseResponse> {
    return withExceptionWrapper(async () => {
      const group = await WebApiService.getGroupFromDB(prismaClient, groupId);
      const userProfile = await lineApiService.getUserProfile(accessToken);
      const isUserInGroup = group.members.includes(userProfile.userId);
      if (isUserInGroup) {
        throw new Error("User is already in group");
      }
      await prismaClient.group.update({
        data: {
          members: [...group.members, userProfile.userId],
        },
        where: {
          groupId: groupId,
        },
      });
      return {
        isSuccess: true,
      };
    }, "Failed to join group");
  }
  static async createExpense(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    accessToken: string,
    groupId: string,
    request: ExpenseRequest
  ): Promise<BaseResponse> {
    return withExceptionWrapper(async () => {
      const userProfile = await lineApiService.getUserProfile(accessToken);
      await WebApiService.isUserInGroup(prismaClient, userProfile, groupId);
      await prismaClient.expense.create({
        data: {
          groupId: groupId,
          name: request.name,
          amount: request.amount,
          payerId: request.payerId,
          debtorIds: request.debtorIds,
          createdBy: userProfile.userId,
        },
      });
      return {
        isSuccess: true,
      };
    }, "failed to create expense");
  }
  static async updateExpense(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    accessToken: string,
    groupId: string,
    request: ExpenseRequest,
    expenseId: string
  ): Promise<BaseResponse> {
    return withExceptionWrapper(async () => {
      const userProfile = await lineApiService.getUserProfile(accessToken);
      await WebApiService.isUserInGroup(prismaClient, userProfile, groupId);
      await prismaClient.expense.update({
        data: {
          groupId: groupId,
          name: request.name,
          amount: request.amount,
          payerId: request.payerId,
          debtorIds: request.debtorIds,
          updatedAt: new Date(),
          updatedBy: userProfile.userId,
        },
        where: {
          id: expenseId,
        },
      });
      return {
        isSuccess: true,
      };
    }, "failed to update expense");
  }
  static async deleteExpense(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    accessToken: string,
    groupId: string,
    expenseId: string
  ): Promise<BaseResponse> {
    return withExceptionWrapper(async () => {
      const userProfile = await lineApiService.getUserProfile(accessToken);
      await WebApiService.isUserInGroup(prismaClient, userProfile, groupId);
      await prismaClient.expense.update({
        data: {
          isActive: false,
          updatedAt: new Date(),
          updatedBy: userProfile.userId,
        },
        where: {
          id: expenseId,
        },
      });
      return {
        isSuccess: true,
      };
    }, "failed to delete expense");
  }
}

export default WebApiService;
