import { Elysia, t } from "elysia";
import { LineMessageEvent, LineMessageEventType } from "./model/WebhookEvent";
import { lineApiHandler } from "./handler/LineApiHandler";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { getGroupHandler } from "./handler/GetGroupHandler";
import { extractAccessToken } from "./utils/accessToken";
import { cors } from "@elysiajs/cors";
import { joinGroupHandler } from "./handler/JoinGroupHandler";
dotenv.config();
const prismaClient = new PrismaClient();
prismaClient.$connect();
const app = new Elysia()
  .get("/api/healthcheck", () => {
    return {
      success: true,
    };
  })
  .get(
    "/api/group/:groupId",
    async (req) => {
      const accessToken = extractAccessToken(req.headers.authorization);
      if (accessToken != null) {
        return await getGroupHandler(
          prismaClient,
          accessToken,
          req.params.groupId
        );
      }
      return {
        success: false,
        error: "Unauthorize",
      };
    },
    {
      params: t.Object({
        groupId: t.String(),
      }),
      headers: t.Object({
        authorization: t.String(),
      }),
    }
  )
  .post(
    "/api/group/:groupId/join",
    async (req) => {
      const accessToken = extractAccessToken(req.headers.authorization);
      if (accessToken != null) {
        return await joinGroupHandler(
          prismaClient,
          accessToken,
          req.params.groupId
        );
      }
      return {
        success: false,
        error: "Unauthorize",
      };
    },
    {
      params: t.Object({
        groupId: t.String(),
      }),
      headers: t.Object({
        authorization: t.String(),
      }),
    }
  )
  .post(
    "/api/line",
    async (req) => lineApiHandler(prismaClient, req.body as LineMessageEvent),
    {
      body: LineMessageEventType,
    }
  )
  .use(cors())
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
