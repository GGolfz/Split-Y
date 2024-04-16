import { atom } from "recoil";
import { LineProfile } from "../model/LineProfile";
import { Nullable } from "../type/Nullable";
export const userState = atom<Nullable<LineProfile>>({
  key: "userState",
  default: null,
});
