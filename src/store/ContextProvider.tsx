import { createContext, useReducer } from "react";
import authReducer, { authInitState } from "./authReducer";
import postReducer, { postInitState } from "./postReducer";

export const Context = createContext<any>(null);

const ContextProvider = (props: any) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitState);
  const [postState, postDispatch] = useReducer(postReducer, postInitState);

  const value = {
    authState: authState,
    authDispatch: authDispatch,
    postState: postState,
    postDispatch: postDispatch,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default ContextProvider;
