import { createContext, useReducer } from "react";
import authReducer, { authInitState } from "./authReducer";

export const Context = createContext<any>(null);

const ContextProvider = (props: any) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitState);

  const value = { authState: authState, authDispatch: authDispatch };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default ContextProvider;
