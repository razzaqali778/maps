import { ADD_INPUT_SEARCH } from "./actionTypes";

let nextHistoryId = 0;

export const addInputSearch = content => ({
  type: ADD_INPUT_SEARCH,
  payload: {
    id: ++nextHistoryId,
    content
  }
});
