import axios from "axios";

const BASE_URL = "https://api.line.me/v2/bot";
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
interface LineMessage {
  type: string;
  text: string;
}
export const sendMessage = async (message: LineMessage, replyToken: string) => {
  try {
    await axios.post(
      `${BASE_URL}/message/reply`,
      {
        messages: [message],
        replyToken,
      },
      {
        headers: {
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );
  } catch (ex) {
    console.log(ex);
  }
};
