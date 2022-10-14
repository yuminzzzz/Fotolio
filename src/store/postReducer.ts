import { Post } from "../App";

export const postInitState = {
  allPost: [],
  userPost: [],
  userCollections: [],
};

const actionType = {
  UPDATE_ALLPOST: "UPDATE_ALLPOST",
  UPDATE_USERPOST: "UPDATE_USERPOST",
  UPDATE_USERCOLLECTIONS: "UPDATE_USERCOLLECTIONS",
  LOGOUT: "LOGOUT",
};

type State = {
  allPost: Post[];
  userPost: Post[];
  userCollections: Post[];
};

const postReducer = (state: State, action: any) => {
  switch (action.type) {
    case actionType.UPDATE_ALLPOST: {
      return { ...state, allPost: action.payload };
    }
    case actionType.UPDATE_USERPOST: {
      return { ...state, userPost: action.payload };
    }
    case actionType.UPDATE_USERCOLLECTIONS: {
      return { ...state, userCollections: action.payload };
    }
    case actionType.LOGOUT: {
      return { allPost: [], userPost: [], userCollections: [] };
    }
    default:
      return state;
  }
};

export default postReducer;
