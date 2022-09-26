import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext, Post } from "../../App";
import PinterestLayout from "../../component/PinterestLayout";

const HomeLogged = () => {
  const st: any = useContext(GlobalContext);
  const [homePost, setHomePost] = useState<Post[]>([]);
  const copyPost = st.allPost.map((item: Post) => item);
  useEffect(() => {
    copyPost.sort(function () {
      return Math.random() > 0.5 ? -1 : 1;
    });
    setHomePost(copyPost);
  }, []);

  if (!st.isLogged) {
    return <Navigate to="/" />;
  } else {
    return <PinterestLayout post={homePost} />;
  }
};

export default HomeLogged;
