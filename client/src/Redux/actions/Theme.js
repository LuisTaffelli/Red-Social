export const CHANGE_THEME = "CHANGE_THEME";
export const CHANGE_COLOR = "CHANGE_THEME";

export function changeTheme(theme) {
  return { type: CHANGE_THEME, payload: theme };
}

export function changeColor(newColor) {
  return { type: CHANGE_THEME, payload: newColor };
}
