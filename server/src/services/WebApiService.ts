import { Group, PrismaClient } from "@prisma/client";
import { LineApiService } from "../plugin/LineApiPlugin";
import GroupResponse from "../model/GroupResponse";
import { ApiResponse, BaseResponse } from "../model/BaseResponse";
import { withExceptionWrapper } from "../utils/exceptionWrapper";
import { LineProfile } from "../model/LineProfile";
import { ExpenseRequest } from "../model/ExpenseRequest";
import { Debtor, Expense, ExpenseResponse } from "../model/ExpenseResponse";
import { calculateAmountPerPerson } from "../utils/calculate";
import { ExpenseMapper } from "../mapper/ExpenseMapper";
import { SummaryResponse } from "../model/SummaryResponse";
import {
  getSimplifyTransactions,
  getTotalTransactions,
} from "../utils/summary";

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
        prismaClient,
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
      await prismaClient.user.upsert({
        create: {
          userId: userProfile.userId,
          displayName: userProfile.displayName ?? userProfile.userId,
          pictureUrl: userProfile.pictureUrl,
        },
        update: {
          displayName: userProfile.displayName ?? userProfile.userId,
          pictureUrl: userProfile.pictureUrl,
        },
        where: {
          userId: userProfile.userId,
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
    }, "Failed to create expense");
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
    }, "Failed to update expense");
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
    }, "Failed to delete expense");
  }
  static async getExpenses(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    accessToken: string,
    groupId: string
  ): Promise<ApiResponse<ExpenseResponse>> {
    return withExceptionWrapper(async () => {
      const userProfile = await lineApiService.getUserProfile(accessToken);
      const group = await WebApiService.isUserInGroup(
        prismaClient,
        userProfile,
        groupId
      );
      const expenses = await prismaClient.expense.findMany({
        where: {
          groupId: groupId,
          isActive: true,
        },
      });
      const memberProfilesMap = new Map<string, LineProfile>(
        (
          await lineApiService.getGroupMembersProfile(
            prismaClient,
            group.members,
            group.lineGroupId
          )
        ).map((profile) => [profile.userId, profile])
      );
      const modifiedExpense: Array<Expense> = expenses.map((expense) =>
        ExpenseMapper.fromPrismaModel(expense, memberProfilesMap)
      );
      return {
        isSuccess: true,
        data: {
          expenses: modifiedExpense,
        },
      };
    }, "Failed to get expenses");
  }
  static async getExpenseById(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    accessToken: string,
    groupId: string,
    expenseId: string
  ): Promise<ApiResponse<Expense>> {
    return withExceptionWrapper(async () => {
      const userProfile = await lineApiService.getUserProfile(accessToken);
      const group = await WebApiService.isUserInGroup(
        prismaClient,
        userProfile,
        groupId
      );
      const expense = await prismaClient.expense.findUnique({
        where: {
          groupId: groupId,
          id: expenseId,
          isActive: true,
        },
      });
      if (expense === null) throw new Error("Expense is not exist");
      const memberProfilesMap = new Map<string, LineProfile>(
        (
          await lineApiService.getGroupMembersProfile(
            prismaClient,
            group.members,
            group.lineGroupId
          )
        ).map((profile) => [profile.userId, profile])
      );
      return {
        isSuccess: true,
        data: ExpenseMapper.fromPrismaModel(expense, memberProfilesMap),
      };
    }, "Failed to get expense by id");
  }
  static async summaryExpenses(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    accessToken: string,
    groupId: string
  ): Promise<ApiResponse<SummaryResponse>> {
    return withExceptionWrapper(async () => {
      const userProfile = await lineApiService.getUserProfile(accessToken);
      const group = await WebApiService.isUserInGroup(
        prismaClient,
        userProfile,
        groupId
      );
      const expenses = await prismaClient.expense.findMany({
        where: {
          groupId: groupId,
          isActive: true,
        },
      });
      const memberProfilesMap = new Map<string, LineProfile>(
        (
          await lineApiService.getGroupMembersProfile(
            prismaClient,
            group.members,
            group.lineGroupId
          )
        ).map((profile) => [profile.userId, profile])
      );
      const modifiedExpense: Array<Expense> = expenses.map((expense) =>
        ExpenseMapper.fromPrismaModel(expense, memberProfilesMap)
      );
      return {
        isSuccess: true,
        data: {
          total: getTotalTransactions(modifiedExpense, memberProfilesMap),
          simplify: getSimplifyTransactions(modifiedExpense, memberProfilesMap),
        },
      };
    }, "Failed to summary expense");
  }
}

export default WebApiService;
