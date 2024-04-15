import { LineMessageEvent, Event } from "../model/WebhookEvent";
import { PrismaClient } from "@prisma/client";
import { LineApiService } from "../plugin/LineApiPlugin";
import { BaseResponse } from "../model/BaseResponse";
abstract class WebHookService {
  static async handleLineWebHook(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    request: LineMessageEvent
  ): Promise<BaseResponse> {
    try {
      Promise.all(
        request.events.map((event) =>
          WebHookService.eventHandler(prismaClient, lineApiService, event)
        )
      );
    } catch (ex) {
      return {
        isSuccess: false,
        error: "Failed to handler request",
      };
    }
    return {
      isSuccess: true,
    };
  }
  private static async eventHandler(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    event: Event
  ): Promise<void> {
    if (event.message.type === "text" && event.message.text.startsWith("!")) {
      const command = event.message.text.split("!")[1];
      switch (command) {
        case "new":
          this.createNewGroup(
            prismaClient,
            lineApiService,
            event.source.groupId,
            event.replyToken
          );
          break;
        case "list":
          this.listGroups(
            prismaClient,
            lineApiService,
            event.source.groupId,
            event.replyToken
          );
          break;
      }
    }
  }
  private static async createNewGroup(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    groupId: string,
    replyToken: string
  ): Promise<void> {
    const LINE_LIFF_URL = process.env.LINE_LIFF_URL;
    const group = await prismaClient.group.create({
      data: {
        lineGroupId: groupId,
      },
    });
    await lineApiService.sendMessage(
      {
        type: "text",
        text: `${LINE_LIFF_URL}/${group.groupId}`,
      },
      replyToken
    );
  }
  private static async listGroups(
    prismaClient: PrismaClient,
    lineApiService: LineApiService,
    groupId: string,
    replyToken: string
  ): Promise<void> {
    const LINE_LIFF_URL = process.env.LINE_LIFF_URL;

    const groupList = await prismaClient.group.findMany({
      where: {
        lineGroupId: groupId,
        isActive: true,
      },
    });
    await lineApiService.sendMessage(
      {
        type: "text",
        text: `Group List:\n${groupList
          .map(
            (group) =>
              `${group.createdAt.toDateString()}: ${LINE_LIFF_URL}/${
                group.groupId
              }`
          )
          .join("\n")}`,
      },
      replyToken
    );
  }
}

export default WebHookService;
