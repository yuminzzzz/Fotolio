import React, { useState, useEffect } from "react";
import { db } from "../../utils/firebase";
import {
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { Wrapper } from "../Upload/Upload";
import styled from "styled-components";
import Comment from "./Comment";
import MyComment from "./MyComment";
import EditTextButton from "./EditTextButton";
import DeleteCheck from "../../component/DeleteCheck";

interface PostData {
  author_id: string;
  created_time: { seconds: number; nanoseconds: number };
  description: string;
  post_id: string;
  title: string;
  url: string;
}

// interface Message {
//   author_avatar: string;
//   author_id: string;
//   author_name: string;
//   comment_id: string;
//   message: string;
//   uploaded_time: {
//     seconds: number;
//     nanoseconds: number;
//   };
// }

const CommentSection = styled.div`
  width: 508px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 32px 108px;
`;

const PostTitle = styled.h1`
  fontsize: 32px;
`;

const PostDescription = styled.p``;

const AuthorAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: lightgrey;
`;

const AuthorName = styled.p``;

const AuthorWrapper = styled.div`
  display: flex;
`;

const CommentWrapper = styled.div`
  width: 100%;
  min-height: 200px;
  border: solid 1px red;
  margin-top: 40px;
`;

const MyCommentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  position: relative;
  margin-top: 51px;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  background-color: #efefef;
  border-radius: 50%;
`;

const Post: React.FC = () => {
  const [post, setPost] = useState<DocumentData | PostData | undefined>(
    undefined
  );
  const [message, setMessage] = useState<any>([]);
  const [targetComment, setTargetComment] = useState("");
  const [typing, setTyping] = useState(false);
  const [response, setResponse] = useState("");
  const [rawComment, setRawComment] = useState("");
  const [modifyCheck, setModifyCheck] = useState(false);

  useEffect(() => {
    const q = collection(db, "/posts/SCaXBHGLZjkLeqhc32Kt/messages");
    const unsub = onSnapshot(q, (querySnapshot) => {
      const fake: any = [];
      querySnapshot.forEach((doc: { data: () => any }) => {
        fake.push(doc.data());
      });
      setMessage(fake);
    });
  }, []);

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(db, "posts/SCaXBHGLZjkLeqhc32Kt");
      const docSnap = await getDoc(docRef);
      setPost(docSnap.data());
    };
    getData();
  }, []);
  return (
    <>
      <Wrapper>
        <img
          src={post?.url}
          alt="post"
          style={{
            width: "508px",
            height: "100%",
            objectFit: "cover",
            color: "lightgrey",
            backgroundColor: "lightgrey",
            borderTopLeftRadius: "30px",
            borderBottomLeftRadius: "30px",
          }}
        ></img>

        <CommentSection>
          <PostTitle>{post?.title}</PostTitle>
          <PostDescription>{post?.description}</PostDescription>
          <AuthorWrapper>
            <AuthorAvatar></AuthorAvatar>
            <AuthorName>{post?.author_id}</AuthorName>
          </AuthorWrapper>

          <CommentWrapper>
            {message.map(
              (
                item: {
                  author_name: string;
                  message: string;
                  author_id: string;
                  comment_id: string;
                },
                index: number
              ) => {
                if (targetComment === item.comment_id) {
                  return (
                    <>
                      <MyComment
                        comment={item.message}
                        rawComment={rawComment}
                        setRawComment={setRawComment}
                      />
                      <EditTextButton
                        setTargetComment={setTargetComment}
                        rawComment={rawComment}
                        comment={item.message}
                        commentId={item.comment_id}
                        setModifyCheck={setModifyCheck}
                      />
                    </>
                  );
                } else {
                  return (
                    <Comment
                      key={index}
                      userName={item.author_name}
                      message={item.message}
                      authorId={item.author_id}
                      commentId={item.comment_id}
                      typing={typing}
                      setTyping={setTyping}
                      setTargetComment={setTargetComment}
                    />
                  );
                }
              }
            )}
          </CommentWrapper>
          <MyCommentWrapper>
            <UserAvatar></UserAvatar>

            <MyComment
              response={response}
              setResponse={setResponse}
              typing={typing}
              setTyping={setTyping}
            />
          </MyCommentWrapper>
          {typing && (
            <EditTextButton
              response={response}
              setResponse={setResponse}
              setTyping={setTyping}
            />
          )}
        </CommentSection>
      </Wrapper>
      {modifyCheck && (
        <DeleteCheck
          setModifyCheck={setModifyCheck}
          setTargetComment={setTargetComment}
          prompt={"確定要捨棄嗎?"}
        />
      )}
    </>
  );
};

export default Post;
