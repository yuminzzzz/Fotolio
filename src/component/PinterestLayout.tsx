import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { PostType } from "../App";
import Pin from "./Pin";

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

const PinterestLayout = ({ post }: { post: PostType[] }) => {
  const random = useMemo(() => {
    return Array(post.length)
      .fill(null)
      .map((item) => Math.floor(Math.random() * 3));
  }, [post]);
  useEffect(() => {
    const images = document.querySelectorAll("[data-src]");
    const preloadImage = (img: HTMLImageElement) => {
      const src = img.getAttribute("data-src");
      if (!src) {
        return;
      }
      img.src = src;
      img.removeAttribute("data-src");
    };
    const imgObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        } else {
          preloadImage(entry.target as HTMLImageElement);
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
