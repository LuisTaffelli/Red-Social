import { ERROR, REMOVE_ERROR } from "../actions/Errors";

const initialState = [];

let id = 0;

export default function root(state = initialState, action) {
  switch (action.type) {
    case ERROR:
      if (action.payload.response) {
        return [...state, { id: ++id, ...action.payload.response.data }];
      }
    case REMOVE_ERROR:
      return [...state.filter((error) => error.id !== action.payload)];

    default:
      return state;
  }
}
