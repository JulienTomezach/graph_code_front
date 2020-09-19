import { ADD_ERROR, CLOSE_ERROR } from "./actionTypes";

let nextErrorId = 0

export const addError = (message, type) => ({
  type: ADD_ERROR,
  payload: {
    id: ++nextErrorId,
    message,
    type
  }
})

export const closeError = id => ({
  type: CLOSE_ERROR,
  payload: {
    id
  }
})
