import { useState, useEffect, useContext } from "react";
import { Message, Tags } from "../../App";
import { Context } from "../../store/ContextProvider";
import { useParams } from "react-router-dom";
import { db } from "../../utils/firebase";
import { DocumentData, collectionGroup, getDocs } from "firebase/firestore";
import { Wrapper, OutsideWrapper } from "../Upload/Upload";
import styled from "styled-components";
import Comment from "./Comment";
import MyComment from "./MyComment";
import EditTextButton from "../../component/EditTextButton";
import DeleteCheck from "../../component/DeleteCheck";
import Collect from "../../component/Collect";
import LastPageButton from "./LastPageButton";
import Ellipsis from "../../component/Ellipsis";
import { Tag, TagWrapper } from "../Upload/Input";

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
  width: 100%;
  margin-top: 16px;
  display: flex;
  white-space: nowrap;
  overflow-x: scroll;
`;

const PostDescription = styled.p``;

const AuthorWrapper = styled.div`
  display: flex;
  margin: 30px 0;
  justify-content: space-between;
`;

const AuthorAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #e9e9e9;
`;

const AuthorName = styled.p`
  font-weight: 500;
  margin-left: 8px;
`;

const TagContainer = styled.div`
  overflow-x: scroll;
  display: flex;
  align-items: center;
  max-width: 200px;
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
  background-color: #e9e9e9;
`;

const Post = () => {
  const [post, setPost] = useState<DocumentData | PostData | undefined>(
    undefined
  );
  const [targetComment, setTargetComment] = useState("");
  const [typing, setTyping] = useState(false);
  const [response, setResponse] = useState("");
  const [rawComment, setRawComment] = useState("");
  const [modifyCheck, setModifyCheck] = useState(false);
  const [deleteTag, setDeleteTag] = useState(false);
  const [comment, setComment] = useState(0);
  const [postTags, setPostTags] = useState<string[]>([]);
  const postId = useParams().id;
  const { authState, postState, commentState, commentDispatch } =
    useContext(Context);

  interface Post {
    author_avatar: string;
    author_id: string;
    author_name: string;
    created_time: { seconds: number; nanoseconds: number };
    description: string;
    post_id: string;
    title: string;
    url: string;
  }

  useEffect(() => {
    const isAuthor = postState.userPost.some(
      (item: Post) => item.post_id === postId
    );
    if (isAuthor) setDeleteTag(true);
    const postData = postState.allPost.find(
      (item: Post) => item.post_id === postId
    );
    setPost(postData);
  }, [postId, postState.allPost, postState.userPost]);

  useEffect(() => {
    const getMessage = async () => {
      commentDispatch({ type: "RESET_MESSAGE" });
      const userMessageRef = collectionGroup(db, "messages");
      const querySnapshot = await getDocs(userMessageRef);
      let arr: Message[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        if (doc.data().post_id === postId) {
          arr.push(doc.data());
        }
      });
      let sortArr = arr.sort(function (arrA, arrB) {
        return arrA.uploaded_time - arrB.uploaded_time;
      });
      commentDispatch({ type: "UPDATE_MESSAGE", payload: sortArr });
    };
    getMessage();
  }, [commentDispatch, postId]);

  useEffect(() => {
    setComment(commentState.message.length);
  }, [commentState.message.length]);

  useEffect(() => {
    let arr: string[] = [];
    commentState.allTags.forEach((item: Tags) => {
      if (item.post_id === postId) {
        arr = [...arr, item.tag];
      }
    });
    setPostTags(arr);
  }, [commentState.allTags, postId]);

  const initStatus = postState.userCollections.some(
    (item: Post) => item.post_id === postId
  );
  return (
    <>
      {authState.isLogged && (
        <OutsideWrapper>
          <LastPageButton />
          <Wrapper>
            <CoverImgWrapper>
              <CoverImg src={post?.url} alt="post"></CoverImg>
            </CoverImgWrapper>
            <CommentSection>
              <ButtonWrapper>
                <Ellipsis roundSize={"48px"} deleteTag={deleteTag} />
                <Collect postId={postId!} initStatus={initStatus} />
              </ButtonWrapper>

              <PostTitle>{post?.title}</PostTitle>
              <PostDescription>{post?.description}</PostDescription>
              <AuthorWrapper>
                <div style={{ display: "flex" }}>
                  <AuthorAvatar src={post?.author_avatar}></AuthorAvatar>
                  <AuthorName>{post?.author_name}</AuthorName>
                </div>
                <TagContainer>
                  <TagWrapper>
                    {postTags !== undefined &&
                      postTags.map((item: string, index: number) => {
                        return <Tag key={index}>{item}</Tag>;
                      })}
                  </TagWrapper>
                </TagContainer>
              </AuthorWrapper>
              <p style={{ fontSize: "20px", fontWeight: "500" }}>
                {comment}則回應
              </p>
              <CommentWrapper>
                {commentState.message.map((item: any, index: number) => {
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
                          authorId={post?.author_id}
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
                        isAuthor={item.user_id === authState.userId}
                        commentId={item.comment_id}
                        setTargetComment={setTargetComment}
                        authorId={post?.author_id}
                      />
                    );
                  }
                })}
              </CommentWrapper>
              <MyCommentWrapper>
                <UserAvatar src={authState.Avatar}></UserAvatar>
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
                  authorId={post?.author_id}
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
      )}
    </>
  );
};

export default Post;
