import { atom } from "recoil";
export enum PageState {
  MAIN,
  EXPENSE,
  MEMBERS,
  SUMMARY,
  ERROR,
  NOT_IN_GROUP,
}
export const pageState = atom({
  key: "pageSate",
  default: PageState.MAIN,
});
