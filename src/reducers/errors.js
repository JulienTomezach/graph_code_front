import _ from "lodash";
import { ADD_ERROR, CLOSE_ERROR } from "../redux/actionTypes";

const initialState = {
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_ERROR: {
      const { id, message, type } = action.payload;
      return {
          ...state,
          [id]: {
            message,
            type
          }
      };
    }
    case CLOSE_ERROR: {
      const { id } = action.payload;
      return _.omit(state, id);
    }
    default:
      return state;
  }
}
