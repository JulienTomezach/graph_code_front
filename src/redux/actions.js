import { ADD_ERROR, CLOSE_ERROR } from "./actionTypes";

let nextErrorId = 0

export const addError = message => ({
  type: ADD_ERROR,
  payload: {
    id: ++nextErrorId,
    message
  }
})

export const closeError = id => ({
  type: CLOSE_ERROR,
  payload: {
    id
  }
})
