import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Wrapper } from "./Upload";

// interface PostData {
//   author_id: string;
//   created_time: { seconds: number; nanoseconds: number };
//   description: string;
//   post_id: string;
//   title: string;
//   url: string;
// }

const Post = () => {
  const [post, setPost] = useState<any>("");

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(db, "posts", "SCaXBHGLZjkLeqhc32Kt");
      const docSnap = await getDoc(docRef);
      setPost(docSnap.data());
    };
    getData();
  }, []);

  return (
    <Wrapper>
      <img
        src={post.url}
        alt="post"
        style={{
          width: "508px",
          height: "100%",
          objectFit: "cover",
          backgroundColor: "lightgrey",
        }}
      ></img>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1 style={{ fontSize: "32px" }}>{post.title}</h1>
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: "lightgrey",
          }}
        ></div>
        <h1>{post.author_id}</h1>
        
      </div>
    </Wrapper>
  );
};

export default Post;
