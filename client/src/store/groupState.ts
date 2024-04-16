import {
  atom,
  SetterOrUpdater,
} from "recoil";
import { LineProfile } from "../model/LineProfile";
import GroupResponse from "../model/GroupResponse";
import { ApiService } from "../service/ApiService";
import { PageState } from "./pageState";
import { Nullable } from "../type/Nullable";
export const groupState = atom<GroupResponse>({
  key: "groupState",
  default: {
    groupId: new URLSearchParams(window.location.search)?.get("liff.state") ??
    window.location.pathname.split("/")[1],
    members: Array<LineProfile>(),
  },
});

export const fetchGroupState = async (
  accessToken: Nullable<string>,
  group: GroupResponse,
  setGroup: SetterOrUpdater<GroupResponse>,
  setPage: SetterOrUpdater<PageState>
) => {
  if (accessToken !== null) {
    try {
      const response = await ApiService.getGroup(group.groupId, accessToken);
      if (response.isSuccess && response.data) {
        setGroup(response.data);
      } else {
        if (response.error && response.error === "User is not in the group") {
          setPage(PageState.NOT_IN_GROUP);
        } else {
          setPage(PageState.ERROR);
        }
      }
    } catch (exception) {
      console.error("ex:", exception);
      setPage(PageState.ERROR);
    }
  }
};
