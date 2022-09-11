import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../App";
import { useParams } from "react-router-dom";
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
import Collect from "../../component/Collect";
import LastPageButton from "./LastPageButton";
import Ellipsis from "../../component/Ellipsis";

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
  padding: 32px 32px 108px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
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

const Post = () => {
  const [post, setPost] = useState<DocumentData | PostData | undefined>(
    undefined
  );
  const [message, setMessage] = useState<any>([]);
  const [targetComment, setTargetComment] = useState("");
  const [typing, setTyping] = useState(false);
  const [response, setResponse] = useState("");
  const [rawComment, setRawComment] = useState("");
  const [modifyCheck, setModifyCheck] = useState(false);
  const [deleteTag, setDeleteTag] = useState(true);
  const { id } = useParams();
  const st: any = useContext(GlobalContext);

  useEffect(() => {
    const q = collection(db, "/posts/SCaXBHGLZjkLeqhc32Kt/messages");
    const unsub = onSnapshot(q, (querySnapshot) => {
      const fake: object[] = [];
      querySnapshot.forEach((doc: { data: () => any }) => {
        fake.push(doc.data());
      });
      setMessage(fake);
    });
  }, []);

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(db, `posts/${id}`);
      const docSnap = await getDoc(docRef);
      setPost(docSnap.data());
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(db, "users/RuJg8C2CyHSbGMUwxrMr");
      const docSnap: DocumentData = await getDoc(docRef);
      const userCollection = docSnap.data().user_collection;
      if (userCollection.includes(id)) {
        st.setIsSaved(true);
        setDeleteTag(true);
      } else {
        st.setIsSaved(false);
      }
    };
    getData();
  }, []);
  return (
    <>
      <LastPageButton />
      <Wrapper>
        <img
          src={post?.url}
          alt="post"
          style={{
            width: "508px",
            height: "604px",
            objectFit: "cover",
            color: "lightgrey",
            backgroundColor: "lightgrey",
            borderTopLeftRadius: "30px",
            borderBottomLeftRadius: "30px",
          }}
        ></img>

        <CommentSection>
          <ButtonWrapper>
            <Ellipsis
              roundSize={"48px"}
              deleteTag={deleteTag}
              setModifyCheck={setModifyCheck}
              modifyCheck={modifyCheck}
            />
            <Collect postId={id!} />
          </ButtonWrapper>

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
                    <div key={item.comment_id}>
                      <MyComment
                        comment={item.message}
                        rawComment={rawComment}
                        setRawComment={setRawComment}
                      />
                      <EditTextButton
                        buttonTag="comment"
                        setTargetComment={setTargetComment}
                        rawComment={rawComment}
                        comment={item.message}
                        commentId={item.comment_id}
                        setModifyCheck={setModifyCheck}
                      />
                    </div>
                  );
                } else {
                  return (
                    <Comment
                      key={index}
                      userName={item.author_name}
                      message={item.message}
                      authorId={item.author_id}
                      commentId={item.comment_id}
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
              buttonTag="message"
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
          promptTitle={"確定要捨棄變更?"}
        />
      )}
    </>
  );
};

export default Post;
