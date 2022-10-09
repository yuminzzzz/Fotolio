import { useContext, useEffect, useMemo } from "react";
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
  const random = useMemo(() => {
    return Array(post.length)
      .fill(null)
      .map((item) => Math.floor(Math.random() * 3));
  }, [post]);

  useEffect(() => {
    const images = document.querySelectorAll("[data-src]");
    const preloadImage = (img: any) => {
      const src = img.getAttribute("data-src");
      if (!src) {
        return;
      }
      img.src = src;
    };

    const imgObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        } else {
          preloadImage(entry.target);
          imgObserver.unobserve(entry.target);
        }
      });
    }, {});

    images.forEach((image) => {
      imgObserver.observe(image);
    });
  }, [post]);

  return (
    <PinContainer>
      {post.map((item, index) => {
        return (
          <Pin
            size={arr[random[index]]}
            key={item.post_id}
            postId={item.post_id}
            postSrc={item.url}
          />
        );
      })}
    </PinContainer>
  );
};

export default PinterestLayout;
