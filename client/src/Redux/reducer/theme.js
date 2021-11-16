import { getLocal, saveLocal } from "../../utils/storage";
import { CHANGE_THEME } from "../actions/Theme";

const initialState = getLocal("codenet_theme");

export default function root(state = initialState, action) {
  switch (action.type) {
    case CHANGE_THEME:
      return saveLocal("codenet_theme", { theme: !state.theme });

    default:
      return state;
  }
}
