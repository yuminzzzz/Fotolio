import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../App";
import Pin from "./Pin";
import styled from "styled-components";

const PinContainer = styled.div`
  margin: 0;
  padding: 0;
  width: 95vw;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-auto-rows: 10px;
  justify-content: center;
`;
let isMounted = true;
let arr: string[];
let random: number;
interface Post {
  author_avatar: string;
  author_id: string;
  author_name: string;
  created_time: { seconds: number; nanoseconds: number };
  description: string;
  post_id: string;
  title: string;
  url: string;
}
const PinterestLayout = ({ post }: { post: Post[] }) => {
  // const [post, setPost] = useState<Post[]>([]);
  const st: any = useContext(GlobalContext);
  // useEffect(() => {
  //   isMounted = true;
  //   switch (location) {
  //     case "home":
  //       setPost(st.allPost);
  //       break;
  //     case "build":
  //       setPost(st.userPost);
  //       break;
  //     case "saved":
  //       setPost(st.userCollections);
  //       break;
  //     default:
  //   }
  // }, [location]);

  return (
    <PinContainer>
      {post.map((item) => {
        if (isMounted) {
          arr = ["small", "medium", "large"];
          random = Math.floor(Math.random() * 3);
          isMounted = false;
        }
        const initStatus = st.userCollections.some(
          (doc: Post) => doc.post_id === item.post_id
        );
        return (
          <Pin
            size={arr[random]}
            key={item.post_id}
            postId={item.post_id}
            postSrc={item.url}
            initStatus={initStatus}
          />
        );
      })}
    </PinContainer>
  );
};

export default PinterestLayout;
