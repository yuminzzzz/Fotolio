import { PostType } from "../App";

export enum PostActionKind {
  UPDATE_ALL_POST = "UPDATE_ALL_POST",
  UPDATE_USER_POST = "UPDATE_USER_POST",
  UPDATE_USER_COLLECTIONS = "UPDATE_USER_COLLECTIONS",
  LOG_OUT = "LOG_OUT",
}
export interface PostState {
  allPost: PostType[];
  userPost: PostType[];
  userCollections: PostType[];
}

export interface PostAction {
  type: PostActionKind;
  payload?: PostType[];
}

const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case PostActionKind.UPDATE_ALL_POST: {
      return { ...state, allPost: action.payload as PostType[] };
    }
    case PostActionKind.UPDATE_USER_POST: {
      return { ...state, userPost: action.payload as PostType[] };
    }
    case PostActionKind.UPDATE_USER_COLLECTIONS: {
      return { ...state, userCollections: action.payload as PostType[] };
    }
    case PostActionKind.LOG_OUT: {
      return { ...state, userPost: [], userCollections: [] };
    }
    default:
      return state;
  }
};

export default postReducer;
