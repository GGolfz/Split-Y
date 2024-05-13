import { Group } from "@prisma/client";
import { LineMessage } from "../model/LineMessage";

export const buildGroupListCarousel = (
  groupList: Array<Group>
): LineMessage => {
  return {
    type: "flex",
    altText: "list group",
    contents: {
      type: "carousel",
      contents: groupList.map(buildGroupBubble),
    },
  };
};

const buildGroupBubble = (group: Group) => {
  const LINE_LIFF_URL = process.env.LINE_LIFF_URL;
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: group.name,
          weight: "bold",
          size: "xl",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "lg",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "Created At",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: group.createdAt.toDateString(),
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
          ],
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "primary",
          height: "sm",
          action: {
            type: "uri",
            label: "Open",
            uri: `${LINE_LIFF_URL}/${group.groupId}`,
          },
        },
      ],
      flex: 0,
    },
  };
};
