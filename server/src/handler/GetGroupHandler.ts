import {
  getGroupMemberProfile,
  getGroupMemberProfiles,
  getUserProfile,
} from "../client/LineApiClient";
import { PrismaClient } from "@prisma/client";
import { LineProfile } from "../model/LineProfile";

export const getGroupHandler = async (
  prismaClient: PrismaClient,
  accessToken: string,
  groupId: string
) => {
  const response = await getUserProfile(accessToken);
  const userProfile = response?.data as LineProfile;
  const group = await prismaClient.group.findUnique({
    where: {
      groupId: groupId,
      isActive: true,
    },
  });

  if (group === null)
    return {
      success: false,
      error: "Group is not exist",
    };
  const isUserInGroup = group.members.includes(userProfile.userId);
  if (!isUserInGroup) {
    return {
      success: true,
    };
  } else {
    const memberProfiles = await getGroupMemberProfiles(group.lineGroupId, group.members);
    return {
      success: true,
      group: {
        groupId: group.groupId,
        members: memberProfiles,
      },
    };
  }
};
