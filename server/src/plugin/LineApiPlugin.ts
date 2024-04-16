import Elysia from "elysia";
import { LineMessage } from "../model/LineMessage";
import axios from "axios";
import { LineProfile } from "../model/LineProfile";
import CacheService from "../services/CacheService";

const BASE_URL = "https://api.line.me/v2";
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

class LineApiService {
  private memberProfileCacheService: CacheService<LineProfile>;

  constructor(memberProfileCacheService: CacheService<LineProfile>) {
    this.memberProfileCacheService = memberProfileCacheService;
  }

  async sendMessage(message: LineMessage, replyToken: string): Promise<void> {
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
      throw ex;
    }
  }
  async getUserProfile(accessToken: string): Promise<LineProfile> {
    try {
      const response = await axios.get<LineProfile>(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (ex) {
      console.error("Failed to get user profile due to: ", ex);
      throw ex;
    }
  }
  async getGroupMemberProfile(
    userId: string,
    groupId: string
  ): Promise<LineProfile> {
    const cahceKey = `${groupId}-${userId}`
    const cahceData = this.memberProfileCacheService.get(cahceKey
    );
    if (!!cahceData) {
      return cahceData;
    }
    try {
      const response = await axios.get<LineProfile>(
        `${BASE_URL}/bot/group/${groupId}/member/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
          },
        }
      );
      const memberProfile = response.data
      this.memberProfileCacheService.set(cahceKey, memberProfile)
      return memberProfile;
    } catch (ex) {
      console.error("Failed to get group member profile due to: ", ex);
      throw ex;
    }
  }
  async getGroupMembersProfile(
    userIds: Array<string>,
    groupId: string
  ): Promise<Array<LineProfile>> {
    return Promise.all(
      userIds.map((userId) => this.getGroupMemberProfile(userId, groupId))
    );
  }
}

const LineApiPlugin = new Elysia().decorate(
  "lineApiService",
  new LineApiService(new CacheService<LineProfile>())
);

export default LineApiPlugin;

export { LineApiService };
