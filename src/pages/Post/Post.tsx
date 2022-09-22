import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../App";
import { useParams } from "react-router-dom";
import { db } from "../../utils/firebase";
import {
  doc,
  DocumentData,
  getDoc,
  collectionGroup,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { Wrapper, OutsideWrapper } from "../Upload/Upload";
import styled from "styled-components";
import Comment from "./Comment";
import MyComment from "./MyComment";
import EditTextButton from "../../component/EditTextButton";
import DeleteCheck from "../../component/DeleteCheck";
import Collect from "../../component/Collect";
import LastPageButton from "./LastPageButton";
import Ellipsis from "../../component/Ellipsis";

interface PostData {
  author_avatar: string;
  author_id: string;
  author_name: string;
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
const CoverImgWrapper = styled.div`
  background-color: lightgrey;
  width: 508px;
  height: 640px;
`;

const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  color: lightgrey;
  background-color: lightgrey;
  border-topleft-radius: 30px;
  border-bottomleft-radius: 30px;
`;

const CommentSection = styled.div`
  width: 508px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 32px;
  z-index: 20;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PostTitle = styled.h1`
  fontsize: 32px;
  margin-top: 16px;
`;

const PostDescription = styled.p``;

const AuthorWrapper = styled.div`
  display: flex;
  margin: 30px 0;
`;

const AuthorAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #fff;
`;

const AuthorName = styled.p`
  font-weight: 500;
  margin-left: 8px;
`;

const CommentWrapper = styled.div`
  width: 100%;
  height: 132px;
  margin-top: 24px;
  overflow: scroll;
`;

const MyCommentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  position: relative;
  margin-top: 51px;
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  background-color: #fff;
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
  const [deleteTag, setDeleteTag] = useState(false);
  const [authorData, setAuthorData] = useState({
    author_avatar: "",
    author_id: "",
    author_name: "",
  });
  const [initStatus, setInitStatus] = useState(false);
  const [comment, setComment] = useState(0);

  const postId = useParams().id;
  const st: any = useContext(GlobalContext);

  // const q = collection(db, `users/${st.userData.user_id}/user_collections`);
  // const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //   querySnapshot.forEach((doc: DocumentData) => {
  //     if (doc.ref.path.includes(postId)) {
  //       setInitStatus(true);
  //     }
  //   });
  // });

  useEffect(() => {
    const checkAuthor = async () => {
      if (!st.userData.user_id) return;
      const userPost: DocumentData = await getDoc(
        doc(db, `users/${st.userData.user_id}/user_posts/${postId}`)
      );
      if (userPost.data()) {
        setDeleteTag(true);
      }
    };
    const getPost = async () => {
      const userPost = collectionGroup(db, "user_posts");
      const querySnapshot = await getDocs(userPost);
      let postData;
      // let authorDATA: {
      //   author_avatar: string;
      //   author_id: string;
      //   author_name: string;
      // };
      let authorDATA: any;

      querySnapshot.forEach((doc: DocumentData) => {
        if (doc.data().post_id === postId) {
          postData = doc.data();
          authorDATA = {
            author_avatar: doc.data().author_avatar,
            author_id: doc.data().author_id,
            author_name: doc.data().author_name,
          };
        }
      });
      setPost(postData);
      setAuthorData(authorDATA);
    };
    const getMessage = async () => {
      const userMessageRef = collectionGroup(db, "messages");
      const querySnapshot = await getDocs(userMessageRef);
      let arr: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().post_id === postId) {
          arr.push(doc.data());
        }
      });

      let sortArr = arr.sort(function (arrA, arrB) {
        return arrA.uploaded_time.seconds - arrB.uploaded_time.seconds;
      });
      setMessage(sortArr);
    };
    checkAuthor();
    getPost();
    getMessage();
  }, [postId]);

  useEffect(() => {
    setComment(message.length);
  }, [message]);

  // useEffect(() => {
  //   if (authorData.author_id) {
  //     const q = collection(
  //       db,
  //       `users/${authorData.author_id}/user_posts/${postId}/messages`
  //     );
  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //       let arr: DocumentData[] = [];
  //       querySnapshot.forEach((doc) => {
  //         arr.push(doc.data());
  //       });
  //       let sortArr = arr.sort(function (arrA, arrB) {
  //         return arrA.uploaded_time.seconds - arrB.uploaded_time.seconds;
  //       });
  //       setMessage(sortArr);
  //     });
  //   }
  // }, [message]);

  return (
    <OutsideWrapper>
      <LastPageButton />
      <Wrapper>
        <CoverImgWrapper>
          <CoverImg src={post?.url} alt="post"></CoverImg>
        </CoverImgWrapper>
        <CommentSection>
          <ButtonWrapper>
            <Ellipsis roundSize={"48px"} deleteTag={deleteTag} />
            <Collect
              postId={postId!}
              initStatus={initStatus}
              setInitStatus={setInitStatus}
            />
          </ButtonWrapper>

          <PostTitle>{post?.title}</PostTitle>
          <PostDescription>{post?.description}</PostDescription>
          <AuthorWrapper>
            <AuthorAvatar src={post?.author_avatar}></AuthorAvatar>
            <AuthorName>{post?.author_name}</AuthorName>
          </AuthorWrapper>
          <p style={{ fontSize: "20px", fontWeight: "500" }}>{comment}則回應</p>
          <CommentWrapper>
            {message.map(
              (
                item: {
                  comment_id: string;
                  message: string;
                  post_id: string;
                  uploaded_time: { seconds: number; nanoseconds: number };
                  user_avatar: string;
                  user_id: string;
                  user_name: string;
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
                        authorId={authorData.author_id}
                        setModifyCheck={setModifyCheck}
                      />
                    </div>
                  );
                } else {
                  return (
                    <Comment
                      key={index}
                      userName={item.user_name}
                      userAvatar={item.user_avatar}
                      message={item.message}
                      uploadedTime={item.uploaded_time}
                      isAuthor={item.user_id === st.userData.user_id}
                      commentId={item.comment_id}
                      setTargetComment={setTargetComment}
                      authorId={authorData.author_id}
                    />
                  );
                }
              }
            )}
          </CommentWrapper>
          <MyCommentWrapper>
            <UserAvatar src={st.userData.user_avatar}></UserAvatar>
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
              authorId={authorData.author_id}
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
    </OutsideWrapper>
  );
};

export default Post;
