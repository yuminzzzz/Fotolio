import { useContext, useMemo } from "react";
import { GlobalContext, initialValue, Post } from "../App";
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

const PinterestLayout = ({ post }: { post: Post[] }) => {
  const st = useContext(GlobalContext) as initialValue;
  const random = useMemo(() => {
    return Array(post.length)
      .fill(null)
      .map((item) => Math.floor(Math.random() * 3));
  }, [post]);
  return (
    <PinContainer>
      {post.map((item, index) => {
        const initStatus = st.userCollections.some(
          (doc: Post) => doc.post_id === item.post_id
        );
        return (
          <Pin
            size={arr[random[index]]}
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
