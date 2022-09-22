import { useContext } from "react";
import { GlobalContext } from "../../App";
import PinterestLayout from "../../component/PinterestLayout";

const HomeLogged = () => {
  const st: any = useContext(GlobalContext);
  return <PinterestLayout post={st.allPost} />;
};

export default HomeLogged;
