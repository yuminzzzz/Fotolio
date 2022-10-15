import { Post } from "../App";

export const postInitState = {
  allPost: [],
  userPost: [],
  userCollections: [],
};

const actionType = {
  UPDATE_ALL_POST: "UPDATE_ALL_POST",
  UPDATE_USER_POST: "UPDATE_USER_POST",
  UPDATE_USER_COLLECTIONS: "UPDATE_USER_COLLECTIONS",
  LOG_OUT: "LOG_OUT",
};

type State = {
  allPost: Post[];
  userPost: Post[];
  userCollections: Post[];
};

const postReducer = (state: State, action: any) => {
  switch (action.type) {
    case actionType.UPDATE_ALL_POST: {
      return { ...state, allPost: action.payload };
    }
    case actionType.UPDATE_USER_POST: {
      return { ...state, userPost: action.payload };
    }
    case actionType.UPDATE_USER_COLLECTIONS: {
      return { ...state, userCollections: action.payload };
    }
    case actionType.LOG_OUT: {
      return { allPost: [], userPost: [], userCollections: [] };
    }
    default:
      return state;
  }
};

export default postReducer;
