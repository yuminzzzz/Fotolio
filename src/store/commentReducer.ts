import { Message, Tags } from "../App";

export const commentInitState = {
  message: [],
  allTags: [],
};

const actionType = {
  UPDATE_ALLTAGS: "UPDATE_ALLTAGS",
  UPDATE_MESSAGE: "UPDATE_MESSAGE",
  RESET_MESSAGE: "RESET_MESSAGE",
  LOG_OUT: "LOG_OUT",
};

type State = {
  message: Message[];
  allTags: Tags[];
};

const commentReducer = (state: State, action: any) => {
  switch (action.type) {
    case actionType.UPDATE_ALLTAGS: {
      return { ...state, allTags: action.payload };
    }
    case actionType.UPDATE_MESSAGE: {
      return { ...state, message: action.payload };
    }
    case actionType.RESET_MESSAGE: {
      return { ...state, message: [] };
    }
    case actionType.LOG_OUT: {
      return { message: [], allTags: [] };
    }
    default:
      return state;
  }
};

export default commentReducer;
