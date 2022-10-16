import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PinterestLayout from "../../component/PinterestLayout";
import { Context, ContextType } from "../../store/ContextProvider";

const HomeLogged = () => {
  const { authState, postState } = useContext(Context) as ContextType;
  
  if (!authState.isLogged) {
    return <Navigate to="/" />;
  } else {
    return <PinterestLayout post={postState.allPost} />;
  }
};

export default HomeLogged;
