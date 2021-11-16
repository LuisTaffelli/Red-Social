import { LOGIN_ADMIN, LOGOUT_ADMIN } from "../actions/Admin";

import Cookie from "universal-cookie";
const cookie = new Cookie();

const initialState = cookie.get("codenet_admin") || {};

export default function root(state = initialState, action) {
  switch (action.type) {
    case LOGIN_ADMIN:
      cookie.set("codenet_admin", action.payload.data, { path: "/" });
      return cookie.get("codenet_admin");

    case LOGOUT_ADMIN:
      cookie.remove("codenet");
      cookie.remove("codenet_admin");
      return {};

    default:
      return state;
  }
}

