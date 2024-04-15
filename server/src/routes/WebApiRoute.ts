import Elysia, { t } from "elysia";
import PrismaPlugin from "../plugin/PrismaPlugin";
import LineApiPlugin, { LineApiService } from "../plugin/LineApiPlugin";
import WebApiService from "../services/WebApiService";
import {
  GroupIdParamType,
  GroupIdWithExpenseIdParamType,
} from "../model/ParamType";
import { ExpenseRequestType } from "../model/ExpenseRequest";

const WebApiRoute = new Elysia()
  .use(PrismaPlugin)
  .use(LineApiPlugin)
  .group("/group/:groupId", (app) =>
    app.guard(
      {
        headers: t.Object({
          authorization: t.TemplateLiteral("Bearer ${string}"),
        }),
      },
      (guardedApp) =>
        guardedApp
          .derive(({ headers }) => {
            return {
              accessToken: headers.authorization.slice(7),
            };
          })
          .get(
            "/",
            ({
              prismaClient,
              lineApiService,
              accessToken,
              params: { groupId },
            }) =>
              WebApiService.getGroup(
                prismaClient,
                lineApiService,
                accessToken,
                groupId
              ),
            {
              params: GroupIdParamType,
            }
          )
          .post(
            "/join",
            ({
              prismaClient,
              lineApiService,
              accessToken,
              params: { groupId },
            }) =>
              WebApiService.joinGroup(
                prismaClient,
                lineApiService,
                accessToken,
                groupId
              ),
            {
              params: GroupIdParamType,
            }
          )
          .group("/expense", (expenseRoute) =>
            expenseRoute
              .get(
                "/",
                ({
                  prismaClient,
                  lineApiService,
                  accessToken,
                  params: { groupId },
                }) =>
                  WebApiService.getExpenses(
                    prismaClient,
                    lineApiService,
                    accessToken,
                    groupId
                  ),
                {
                  params: GroupIdParamType,
                }
              )
              .post(
                "/create",
                ({
                  prismaClient,
                  lineApiService,
                  accessToken,
                  params: { groupId },
                  body,
                }) =>
                  WebApiService.createExpense(
                    prismaClient,
                    lineApiService,
                    accessToken,
                    groupId,
                    body
                  ),
                {
                  params: GroupIdParamType,
                  body: ExpenseRequestType,
                }
              )
              .get("/summary", ({
                prismaClient,
                lineApiService,
                accessToken,
                params: { groupId },
              }) =>
                WebApiService.summaryExpenses(
                  prismaClient,
                  lineApiService,
                  accessToken,
                  groupId
                ),
              {
                params: GroupIdParamType,
              })
              .group("/:expenseId", (expenseWithIdRoute) =>
                expenseWithIdRoute
                  .get(
                    "/",
                    ({
                      prismaClient,
                      lineApiService,
                      accessToken,
                      params: { groupId, expenseId },
                    }) =>
                      WebApiService.getExpenseById(
                        prismaClient,
                        lineApiService,
                        accessToken,
                        groupId,
                        expenseId
                      ),
                    {
                      params: GroupIdWithExpenseIdParamType,
                    }
                  )
                  .post(
                    "/update",
                    ({
                      prismaClient,
                      lineApiService,
                      accessToken,
                      params: { groupId, expenseId },
                      body,
                    }) =>
                      WebApiService.updateExpense(
                        prismaClient,
                        lineApiService,
                        accessToken,
                        groupId,
                        body,
                        expenseId
                      ),
                    {
                      params: GroupIdWithExpenseIdParamType,
                      body: ExpenseRequestType,
                    }
                  )
                  .post(
                    "/delete",
                    ({
                      prismaClient,
                      lineApiService,
                      accessToken,
                      params: { groupId, expenseId },
                    }) =>
                      WebApiService.deleteExpense(
                        prismaClient,
                        lineApiService,
                        accessToken,
                        groupId,
                        expenseId
                      ),
                    {
                      params: GroupIdWithExpenseIdParamType,
                    }
                  )
              )
          )
    )
  );

export default WebApiRoute;
