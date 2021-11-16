import { getLocal } from "./storage";

export function isLogin() {
  return !!getLocal("codenet_user").username;
}
