import { Elysia, t } from "elysia";
import { LineMessageEvent, LineMessageEventType } from "./model/WebhookEvent";
import { lineApiHandler } from "./handler/LineApiHandler";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { getGroupHandler } from "./handler/GetGroupHandler";
import { extractAccessToken } from "./utils/accessToken";
import { cors } from "@elysiajs/cors";
import { joinGroupHandler } from "./handler/JoinGroupHandler";
import LineApiPlugin from "./plugin/LineApiPlugin";
import HealthCheckRoute from "./routes/HealthCheckRoute";
import WebHookRoute from "./routes/WebHookRoute";
dotenv.config();
const app = new Elysia()
  .group("/api", (app) => app.use(HealthCheckRoute).use(WebHookRoute))
  // .get(
  //   "/api/group/:groupId",
  //   async ({ bearer, body, prismaClient, lineApiService }) => {
  //     const accessToken = extractAccessToken(req.headers.authorization);
  //     if (accessToken != null) {
  //       return await getGroupHandler(
  //         prismaClient,
  //         accessToken,
  //         req.params.groupId
  //       );
  //     }
  //     return {
  //       success: false,
  //       error: "Unauthorize",
  //     };
  //   },
  //   {
  //     params: t.Object({
  //       groupId: t.String(),
  //     }),
  //     headers: t.Object({
  //       authorization: t.String(),
  //     }),
  //   }
  // )
  // .post(
  //   "/api/group/:groupId/join",
  //   async (req) => {
  //     const accessToken = extractAccessToken(req.headers.authorization);
  //     if (accessToken != null) {
  //       return await joinGroupHandler(
  //         prismaClient,
  //         accessToken,
  //         req.params.groupId
  //       );
  //     }
  //     return {
  //       success: false,
  //       error: "Unauthorize",
  //     };
  //   },
  //   {
  //     params: t.Object({
  //       groupId: t.String(),
  //     }),
  //     headers: t.Object({
  //       authorization: t.String(),
  //     }),
  //   }
  // )
  .use(cors())
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
