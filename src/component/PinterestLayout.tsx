import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../App";

import Pin from "./Pin";
import { db } from "../utils/firebase";
import {
  getDocs,
  collection,
  DocumentData,
  collectionGroup,
} from "firebase/firestore";
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
const PinterestLayout = ({ location }: { location: string }) => {
  interface Post {
    author_id: string;
    created_time: { seconds: number; nanoseconds: number };
    description: string;
    post_id: string;
    title: string;
    url: string;
  }
  const [post, setPost] = useState<Post[]>([]);
  const st: any = useContext(GlobalContext);
  useEffect(() => {
    setPost([]);
    isMounted = true;;
    const getPost = async () => {
      if (location === "home") {
        const userPost = collectionGroup(db, "user_posts");
        const querySnapshot = await getDocs(userPost);
        let arr: Post[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          arr.push(doc.data());
        });
        arr.sort(() => Math.random() - 0.5);
        setPost((prev) => {
          return [...prev, ...arr];
        });
      } else if (location === "build") {
        const userPost = await getDocs(
          collection(db, `/users/${st.userData.user_id}/user_posts`)
        );
        let arr: Post[] = [];
        userPost.forEach((item: DocumentData) => {
          arr.push(item.data());
        });
        setPost(arr);
      } else if (location === "saved") {
        const userPost = await getDocs(
          collection(db, `/users/${st.userData.user_id}/user_collections`)
        );
        let arr: Post[] = [];
        userPost.forEach((item: DocumentData) => {
          arr.push(item.data());
        });
        setPost(arr);
      }
    };
    getPost();
  }, [location]);

  return (
    <PinContainer>
      {post.map((item) => {
        if (isMounted) {
          arr = ["small", "medium", "large"];
          random = Math.floor(Math.random() * 3);
          isMounted = false;
        }
        return (
          <Pin
            size={arr[random]}
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
