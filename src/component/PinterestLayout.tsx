import { useContext } from "react";
import { GlobalContext, Post } from "../App";
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

let arr: string[] = ["small", "medium", "large"];
let random: number;

const PinterestLayout = ({ post }: { post: Post[] }) => {
  const st: any = useContext(GlobalContext);
  return (
    <PinContainer>
      {post.map((item) => {
        random = Math.floor(Math.random() * 3);
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
