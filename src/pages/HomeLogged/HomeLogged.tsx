import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext, initialValue } from "../../App";
import PinterestLayout from "../../component/PinterestLayout";

const HomeLogged = () => {
  const st = useContext(GlobalContext) as initialValue;

  if (!st.isLogged) {
    return <Navigate to="/" />;
  } else {
    return <PinterestLayout post={st.allPost} />;
  }
};

export default HomeLogged;
