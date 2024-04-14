import axios from "axios";
import { LineMessage } from "../model/LineMessage";
import { LineProfile } from "../model/LineProfile";

const BASE_URL = "https://api.line.me/v2";
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

export const sendMessage = async (message: LineMessage, replyToken: string) => {
  try {
    await axios.post(
      `${BASE_URL}/bot/message/reply`,
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
    console.error(ex);
  }
};

export const getUserProfile = async (accessToken: string) => {
  try {
    return await axios.get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (ex) {
    console.error(ex);
  }
};

export const getGroupMemberProfile = async (groupId: string, userId: string) => {
  try {
    return await axios.get(`${BASE_URL}/bot/group/${groupId}/member/${userId}`, {
      headers: {
        Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
      }
    })
  } catch (ex) {
    console.error(ex)
  }
}

export const getGroupMemberProfiles = async(groupId: string, userIds: Array<string>): Promise<Array<LineProfile>> => {
  const responses = await Promise.all(
    userIds.map(userId => getGroupMemberProfile(groupId, userId))
  )
  const groupMemberProfiles = responses.map(r => r?.data as LineProfile)
  return groupMemberProfiles;
}