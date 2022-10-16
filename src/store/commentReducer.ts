import { Message, Tags } from "../App";

export enum CommentActionKind {
  UPDATE_ALL_TAGS = "UPDATE_ALL_TAGS",
  UPDATE_MESSAGE = "UPDATE_MESSAGE",
  RESET_MESSAGE = "RESET_MESSAGE",
  LOG_OUT = "LOG_OUT",
}
export interface CommentState {
  message: Message[];
  allTags: Tags[];
}
export interface CommentAction {
  type: CommentActionKind;
  payload?: Message[] | Tags[];
}

export const commentReducer = (
  state: CommentState,
  action: CommentAction
): CommentState => {
  switch (action.type) {
    case CommentActionKind.UPDATE_ALL_TAGS: {
      return { ...state, allTags: action.payload as Tags[] };
    }
    case CommentActionKind.UPDATE_MESSAGE: {
      return { ...state, message: action.payload as Message[] };
    }
    case CommentActionKind.RESET_MESSAGE: {
      return { ...state, message: [] };
    }
    case CommentActionKind.LOG_OUT: {
      return { message: [], allTags: [] };
    }
    default:
      return state;
  }
};

export default commentReducer;
