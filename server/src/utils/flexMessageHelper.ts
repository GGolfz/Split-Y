import { Group } from "@prisma/client";
import { LineMessage } from "../model/LineMessage";

export const buildGroupListCarousel = (
  groupList: Array<Group>
): LineMessage => {
  return {
    type: "flex",
    altText: "กลุ่มทั้งหมด",
    contents: {
      type: "carousel",
      contents: groupList.map(buildGroupBubble),
    },
  };
};

export const buildGroupResponse = (group: Group): LineMessage => {
  return {
    type: "flex",
    altText: `กลุ่ม ${group.name} ได้ถูกสร้างขึ้น`,
    contents: buildGroupBubble(group),
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
        {
          type: "button",
          style: "secondary",
          height: "sm",
          action: {
            type: "uri",
            label: "Share",
            uri: `${LINE_LIFF_URL}/${group.groupId}/share`,
          },
        },
      ],
      flex: 0,
    },
  };
};
