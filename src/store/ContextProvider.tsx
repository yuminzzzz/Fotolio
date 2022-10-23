import React, { createContext, useReducer } from "react";
import authReducer, { AuthAction, AuthState } from "./authReducer";
import commentReducer, { CommentAction, CommentState } from "./commentReducer";
import postReducer, { PostAction, PostState } from "./postReducer";

export const Context = createContext<ContextType | null>(null);

export type ContextType = {
  authState: AuthState;
  authDispatch: React.Dispatch<AuthAction>;
  postState: PostState;
  postDispatch: React.Dispatch<PostAction>;
  commentState: CommentState;
  commentDispatch: React.Dispatch<CommentAction>;
};
interface Props {
  children: React.ReactNode;
}

const ContextProvider: React.FC<Props> = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    login: false,
    register: false,
    isLogged: null,
    userAvatar: "",
    userEmail: "",
    userId: "",
    userName: "",
  });
  const [postState, postDispatch] = useReducer(postReducer, {
    allPost: [],
    userPost: [],
    userCollections: [],
  });
  const [commentState, commentDispatch] = useReducer(commentReducer, {
    message: [],
    allTags: [],
  });

  const value = {
    authState: authState,
    authDispatch: authDispatch,
    postState: postState,
    postDispatch: postDispatch,
    commentState: commentState,
    commentDispatch: commentDispatch,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ContextProvider;
