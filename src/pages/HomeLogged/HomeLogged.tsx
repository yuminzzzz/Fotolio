import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../../App";
import PinterestLayout from "../../component/PinterestLayout";

const HomeLogged = () => {
  const st: any = useContext(GlobalContext);
  if (!st.isLogged) {
    return <Navigate to="/" />;
  } else {
    return <PinterestLayout post={st.allPost} />;
  }
};

export default HomeLogged;
