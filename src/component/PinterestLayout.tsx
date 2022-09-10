import React, { useEffect, useState } from "react";
import Pin from "./Pin";
import { db } from "../utils/firebase";
import { getDocs, collection } from "firebase/firestore";
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

const PinterestLayout = () => {
  interface DocData {
    created_time: {
      seconds: number;
      nanoseconds: number;
    };
    description: string;
    post_id: string;
    title: string;
    url: string;
  }
  const [post, setPost] = useState<DocData[]>([]);

  useEffect(() => {
    const getPost = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const arr: any[] = [];
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      arr.sort(() => Math.random() - 0.5);
      setPost(arr);
    };
    getPost();
  }, []);
  return (
    <PinContainer>
      {post.map((item) => {
        let arr = ["small", "medium", "large"];
        let random = Math.floor(Math.random() * 3);
        return (
          <Pin size={arr[random]} postId={item.post_id} postSrc={item.url} />
        );
      })}
    </PinContainer>
  );
};

export default PinterestLayout;
