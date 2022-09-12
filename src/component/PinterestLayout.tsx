import { useEffect, useState } from "react";
import Pin from "./Pin";
import { db } from "../utils/firebase";
import {
  getDocs,
  collection,
  getDoc,
  doc,
  DocumentData,
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

const PinterestLayout = ({ location }: { location: string }) => {
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
    setPost([]);
    const getPost = async () => {
      const userData: DocumentData = await getDoc(
        doc(db, "users/RuJg8C2CyHSbGMUwxrMr")
      );
      if (location === "home") {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const arr: any[] = [];
        querySnapshot.forEach((doc) => {
          arr.push(doc.data());
        });
        arr.sort(() => Math.random() - 0.5);
        setPost(arr);
      } else if (location === "build") {
        const userPost = userData.data().user_post;
        let arr: any[] = [];
        for (let i = 0; i < userPost.length; i++) {
          const docRef = await getDoc(doc(db, `posts/${userPost[i]}`));
          arr.push(docRef.data());
        }
        setPost(arr);
      } else if (location === "saved") {
        const userCollection = userData.data().user_collection;
        let arr: any[] = [];
        for (let i = 0; i < userCollection.length; i++) {
          const docRef = await getDoc(doc(db, `posts/${userCollection[i]}`));
          arr.push(docRef.data());
        }
        setPost(arr);
      }
    };
    getPost();
  }, [location]);
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
