import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../../App";
import PinterestLayout from "../../component/PinterestLayout";
import { Context } from "../../store/ContextProvider";

const HomeLogged = () => {
  const st: any = useContext(GlobalContext);
  const { authState } = useContext(Context);
  const { postState } = useContext(Context);
  if (!authState.isLogged) {
    return <Navigate to="/" />;
  } else {
    return <PinterestLayout post={postState.allPost} />;
  }
};

export default HomeLogged;
