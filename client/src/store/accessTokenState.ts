import { atom } from "recoil";
import { Nullable } from "../type/Nullable";
export const accessTokenState = atom<Nullable<string>>({
  key: "accessTokenState",
  default: null,
});
