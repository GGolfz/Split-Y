import GroupInfoResponse from "../model/GroupInfoResponse";

export const buildFlexMessage = (group: GroupInfoResponse) => {
  const LIFF_BASE_URL = "https://liff.line.me/2004547506-w5WkPoXz";
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
                  text: group.createdAt,
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
            uri: `${LIFF_BASE_URL}/${group.groupId}`,
          },
        },
        {
          type: "button",
          style: "secondary",
          height: "sm",
          action: {
            type: "uri",
            label: "Share",
            uri: `${LIFF_BASE_URL}/${group.groupId}/share`,
          },
        },
      ],
      flex: 0,
    },
  };
};
