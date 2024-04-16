import { atom } from "recoil";
import { Nullable } from "../type/Nullable";
export const webSocketState = atom<Nullable<WebSocket>>({
  key: "websocketState",
  default: null,
});
