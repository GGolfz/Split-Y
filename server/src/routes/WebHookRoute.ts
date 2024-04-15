import Elysia from "elysia";
import LineApiPlugin from "../plugin/LineApiPlugin";
import PrismaPlugin from "../plugin/PrismaPlugin";
import WebHookService from "../services/WebHookService";
import { LineMessageEvent, LineMessageEventType } from "../model/WebhookEvent";

const WebHookRoute = new Elysia()
  .use(LineApiPlugin)
  .use(PrismaPlugin)
  .post(
    "/line",
    ({ prismaClient, lineApiService, body }) =>
      WebHookService.handleLineWebHook(
        prismaClient,
        lineApiService,
        body as LineMessageEvent
      ),
    {
      body: LineMessageEventType,
    }
  );

export default WebHookRoute;
