import axios from "axios";
import { Elysia, t } from "elysia";
import { LineMessageEvent, LineMessageEventType } from "./model/WebhookEvent";
import { lineApiHandler } from "./handler/LineApiHandler";
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()
console.log(process.env)
const prismaClient = new PrismaClient()
prismaClient.$connect()
const app = new Elysia()
  .get("/api/healthcheck", () => {
    return {
      success: true,
    };
  })
  .post(
    "/api/line",
    async (req) => lineApiHandler(req.body as LineMessageEvent, prismaClient),
    {
      body: LineMessageEventType,
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
