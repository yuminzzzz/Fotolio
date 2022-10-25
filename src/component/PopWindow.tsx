import { signOut } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Message } from "../App";
import { AuthActionKind } from "../store/authReducer";
import { CommentActionKind } from "../store/commentReducer";
import { Context, ContextType } from "../store/ContextProvider";
import { PostActionKind } from "../store/postReducer";
import { auth, db } from "../utils/firebase";
import DeleteCheck from "./DeleteCheck";

interface Props {
  userInfo: boolean;
}

const EditWrapper = styled.div<Props>`
  position: absolute;
  background-color: #ffffff;
  z-index: 2;
  min-width: 182px;
  top: ${(props) => (props.userInfo ? "30px" : "0px")};
  left: ${(props) => (props.userInfo ? "" : "70px")};
  right: ${(props) => (props.userInfo ? "-18px" : "")};
  border: solid 1px lightgrey;
  border-radius: 20px;
  padding: 8px;
`;

const EditButton = styled.button`
  width: 100%;
  min-height: 36px;
  font-weight: 700;
  font-size: 18px;
  background-color: #ffffff;
  background-color: white;
  padding: 0 8px;
  border-style: none;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  &:hover {
    background-color: #e9e9e9;
  }
`;

const UserAccountWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UserAccountAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e9e9e9;
`;

const UserAccountName = styled.p`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const UserAccountEmail = styled.p`
  font-size: 12px;
  font-weight: 300;
  color: #767676;
`;

const PopWindow = ({
  location,
  commentId,
  setEditOrDelete,
  deleteTag,
  setTargetComment,
  authorId,
  setToggle,
}: {
  location: string;
  commentId?: string;
  setEditOrDelete?: Dispatch<SetStateAction<boolean>>;
  deleteTag?: boolean;
  setTargetComment?: Dispatch<SetStateAction<string>>;
  authorId?: string;
  setToggle?: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    authState,
    authDispatch,
    postDispatch,
    commentState,
    commentDispatch,
  } = useContext(Context) as ContextType;
  const [deleteModifyCheck, setDeleteModifyCheck] = useState(false);
  const navigate = useNavigate();
  const storage = getStorage();
  const postId = useParams().id;
  const deleteComment = async () => {
    setEditOrDelete && setEditOrDelete(false);
    const updatedComment = commentState.message.filter(
      (item: Message) => item.comment_id !== commentId
    );
    commentDispatch({
      type: CommentActionKind.UPDATE_MESSAGE,
      payload: updatedComment,
    });
    await deleteDoc(
      doc(db, `/users/${authorId}/user_posts/${postId}/messages/${commentId}`)
    );
  };
  const downloadImg = async () => {
    const gsReference = ref(
      storage,
      `gs://fotolio-799f4.appspot.com/post-image/${postId}_1000x1000`
    );
    getDownloadURL(gsReference)
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
          var a = document.createElement("a");
          a.setAttribute("download", "");
          a.href = URL.createObjectURL(blob);
          a.click();
        };
        xhr.open("GET", url);
        xhr.send();
        setEditOrDelete && setEditOrDelete(false);
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            break;
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      });
  };
  const logout = () => {
    signOut(auth)
      .then(() => {
        authDispatch({ type: AuthActionKind.LOG_OUT });
        postDispatch({ type: PostActionKind.LOG_OUT });
        commentDispatch({ type: CommentActionKind.LOG_OUT });
      })
      .catch((error) => {});
    navigate("/")
  };
  
  if (location === "post") {
    return (
      <EditWrapper
        userInfo={false}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <EditButton onClick={downloadImg} id="download">
          下載圖片
        </EditButton>
        {deleteTag && (
          <EditButton
            onClick={() => {
              setDeleteModifyCheck(true);
            }}
          >
            刪除貼文
          </EditButton>
        )}
        {deleteModifyCheck && (
          <DeleteCheck
            promptTitle={"確定要刪除貼文？"}
            setDeleteModifyCheck={setDeleteModifyCheck}
            setEditOrDelete={setEditOrDelete}
          />
        )}
      </EditWrapper>
    );
  } else if (location === "comment") {
    return (
      <EditWrapper
        userInfo={false}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <EditButton
          onClick={() => {
            setTargetComment && commentId && setTargetComment(commentId);
          }}
        >
          編輯
        </EditButton>
        <EditButton onClick={deleteComment}>刪除</EditButton>
      </EditWrapper>
    );
  } else if (location === "userInfo") {
    return (
      <EditWrapper
        userInfo={true}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <EditButton
          onClick={() => {
            setToggle && setToggle(false);
            navigate("/profile");
          }}
        >
          <UserAccountWrapper>
            <UserAccountAvatar src={authState.userAvatar}></UserAccountAvatar>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "5px",
              }}
            >
              <UserAccountName>{authState.userName}</UserAccountName>
              <UserAccountEmail>{authState.userEmail}</UserAccountEmail>
            </div>
          </UserAccountWrapper>
        </EditButton>
        <EditButton
          onClick={() => {
            setToggle && setToggle(false);
            logout();
          }}
        >
          登出
        </EditButton>
      </EditWrapper>
    );
  } else {
    return null;
  }
};

export default PopWindow;
