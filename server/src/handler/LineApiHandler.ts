import { Event, LineMessageEvent } from "../model/WebhookEvent";
import { PrismaClient } from "@prisma/client";
import { sendMessage } from "../client/LineApiClient";

const LINE_LIFF_URL = process.env.LINE_LIFF_URL
export const lineApiHandler = async (
  prismaClient: PrismaClient,
  request: LineMessageEvent
) => {
  try {
    request.events.map((event) => eventHandler(prismaClient, event));
  } catch (ex) {
    return {
      isSuccess: false,
      error: "Failed to handler request",
    };
  }
};

const eventHandler = async (prismaClient: PrismaClient, event: Event, ) => {
  if (event.message.type === "text" && event.message.text.startsWith("!")) {
    const command = event.message.text.split("!")[1];
    switch (command) {
      case "new":
        const group = await prismaClient.group.create({
          data: {
            lineGroupId: event.source.groupId,
          },
        });
        await sendMessage(
          {
            type: "text",
            text: `${LINE_LIFF_URL}/${group.groupId}`,
          },
          event.replyToken
        );
        return {
          isSuccess: true
        }
        break;
      case "list":
        const groupList = await prismaClient.group.findMany({
          where: {
            lineGroupId: event.source.groupId,
            isActive: true
          },
        });
        await sendMessage(
          {
            type: "text",
            text: `Group List:\n${groupList
              .map(
                (group) =>
                  `${group.createdAt.toDateString()}: ${LINE_LIFF_URL}/${group.groupId}`
              )
              .join("\n")}`,
          },
          event.replyToken
        );
        break;
    }
  }
};
