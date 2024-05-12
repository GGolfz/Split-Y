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
    groupId: string | null
  ): Promise<LineProfile> {
    const cahceKey = `${userId}`;
    const cahceData = this.memberProfileCacheService.get(cahceKey);
    if (!!cahceData) {
      return cahceData;
    }
    if (groupId !== null) {
      const memberProfile = await this.getMemberProfileFromLineGroup(
        userId,
        groupId
      );
      this.memberProfileCacheService.set(cahceKey, memberProfile);
      return memberProfile;
    } else {
      const memberProfile = await this.getMemberProfileFromLineFriend(userId);
      this.memberProfileCacheService.set(cahceKey, memberProfile);
      return memberProfile;
    }
  }
  async getMemberProfileFromLineGroup(
    userId: string,
    groupId: string
  ): Promise<LineProfile> {
    try {
      const response = await axios.get<LineProfile>(
        `${BASE_URL}/bot/group/${groupId}/member/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
          },
        }
      );
      const memberProfile = response.data;
      return memberProfile;
    } catch (ex) {
      console.error("Failed to get group member profile due to: ", ex);
      return {
        userId: userId,
      };
    }
  }
  async getMemberProfileFromLineFriend(userId: string): Promise<LineProfile> {
    try {
      const response = await axios.get<LineProfile>(
        `${BASE_URL}/bot/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
          },
        }
      );
      const memberProfile = response.data;
      return memberProfile;
    } catch (ex) {
      console.error("Failed to get group member profile due to: ", ex);
      return {
        userId: userId,
      };
    }
  }
  async getGroupMembersProfile(
    userIds: Array<string>,
    groupId: string | null
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
