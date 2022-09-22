import { Dispatch, SetStateAction, useContext } from "react";
import { GlobalContext } from "../App";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../utils/firebase";
import {
  collection,
  setDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  collectionGroup,
  getDocs,
} from "firebase/firestore";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;
interface Props {
  cancel?: boolean;
  currentPage?: string;
}

const Button = styled.button<Props>`
  min-width: 60px;
  min-width: ${(props) => (props.currentPage ? "64px" : "60px")};
  height: 40px;
  height: ${(props) => (props.currentPage ? "48px" : "40px")};
  color: ${(props) => (props.cancel ? "black" : "lightgrey")};
  background-color: ${(props) => (props.currentPage ? "#fff" : "")};
  padding: 8px 12px;
  border-style: none;
  border-radius: 24px;
  font-size: 16px;
  margin-left: 8px;
  cursor: pointer;
`;

const ActiveButton = styled(Button)`
  background-color: ${(props) => {
    if (props.currentPage) {
      if (props.currentPage !== "/home") {
        return "";
      } else {
        return "black";
      }
    } else {
      return "orange";
    }
  }};
  color: ${(props) => {
    if (props.currentPage) {
      if (props.currentPage !== "/home") {
        return "black";
      } else {
        return "#fff";
      }
    } else {
      return "#fff";
    }
  }};
`;

const EditTextButton = ({
  response,
  setResponse,
  setTyping,
  setTargetComment,
  rawComment,
  comment,
  commentId,
  setModifyCheck,
  promptButton,
  buttonTag,
  authorId,
  setDeleteModifyCheck,
  setEditOrDelete,
}: {
  response?: string;
  rawComment?: string;
  comment?: string;
  commentId?: string;
  promptButton?: string;
  buttonTag: string;
  authorId?: string;
  setResponse?: Dispatch<SetStateAction<string>>;
  setTyping?: Dispatch<SetStateAction<boolean>>;
  setTargetComment?: Dispatch<SetStateAction<string>>;
  setModifyCheck?: Dispatch<SetStateAction<boolean>>;
  setDeleteModifyCheck?: Dispatch<SetStateAction<boolean>>;
  setEditOrDelete?: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const postId = useParams().id;
  const st: any = useContext(GlobalContext);
  let currentPage = useLocation().pathname;
  const postComment = () => {
    if (!response) return;
    if (!authorId) return;
    try {
      const docRef = doc(
        collection(db, `/users/${authorId}/user_posts/${postId}/messages`)
      );
      const data = {
        post_id: postId,
        comment_id: docRef.id,
        user_id: st.userData.user_id,
        user_name: st.userData.user_name,
        user_avatar: st.userData.user_avatar,
        message: response,
        uploaded_time: serverTimestamp(),
      };
      setDoc(
        doc(
          db,
          `/users/${authorId}/user_posts/${postId}/messages/${docRef.id}`
        ),
        data
      );
      setResponse && setResponse("");
      setTyping && setTyping(false);
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };
  const updateComment = async () => {
    if (!authorId) return;
    const docRef = doc(
      db,
      `/users/${authorId}/user_posts/${postId}/messages/${commentId}`
    );
    await updateDoc(docRef, { message: rawComment });
    setTargetComment && setTargetComment("");
  };
  const deletePost = async () => {
    st.setAllPost(st.updateState(st.allPost, postId));
    st.setUserPost(st.updateState(st.userPost, postId));
    st.setUserCollections(st.updateState(st.userCollections, postId));

    const docRef = doc(
      db,
      `/users/${st.userData.user_id}/user_posts/${postId}`
    );
    const querySnapshot = await getDocs(
      collectionGroup(db, "user_collections")
    );
    let deletePromise: any[] = [deleteDoc(docRef)];
    querySnapshot.forEach((item) => {
      const postDocRef = doc(db, item.ref.path);
      if (postId && item.ref.path.includes(postId)) {
        deletePromise.push(deleteDoc(postDocRef));
      }
    });
    Promise.all(deletePromise);
    navigate("/home");
  };
  return (
    <ButtonContainer>
      {buttonTag === "deleteCheck" ? (
        <>
          {promptButton === "確定要捨棄變更?" && (
            <>
              <Button
                cancel={true}
                onClick={() => {
                  setModifyCheck && setModifyCheck(false);
                }}
              >
                取消
              </Button>
              <ActiveButton
                onClick={() => {
                  setModifyCheck && setModifyCheck(false);
                  setTargetComment && setTargetComment("");
                }}
              >
                捨棄變更
              </ActiveButton>
            </>
          )}
          {promptButton === "確定要刪除貼文？" && (
            <>
              <Button
                cancel={true}
                onClick={() => {
                  setDeleteModifyCheck && setDeleteModifyCheck(false);
                }}
              >
                取消
              </Button>
              <ActiveButton
                onClick={() => {
                  deletePost();
                  setDeleteModifyCheck && setDeleteModifyCheck(false);
                  setEditOrDelete && setEditOrDelete(false);
                }}
              >
                刪除
              </ActiveButton>
            </>
          )}
        </>
      ) : buttonTag === "comment" ? (
        <>
          <Button
            cancel={true}
            onClick={() => {
              if (setTargetComment) {
                if (rawComment !== comment) {
                  setModifyCheck && setModifyCheck(true);
                } else setTargetComment("");
              }
            }}
          >
            取消
          </Button>
          {rawComment !== comment && rawComment !== "" ? (
            <ActiveButton onClick={updateComment}>儲存</ActiveButton>
          ) : (
            <Button>儲存</Button>
          )}
        </>
      ) : buttonTag === "message" ? (
        <>
          <Button
            cancel={true}
            onClick={() => {
              setTyping && setTyping(false);
              setResponse && setResponse("");
            }}
          >
            取消
          </Button>
          {response !== "" ? (
            <ActiveButton onClick={postComment}>完成</ActiveButton>
          ) : (
            <Button>完成</Button>
          )}
        </>
      ) : buttonTag === "login" ? (
        <>
          <ActiveButton onClick={() => st.setLogin(true)}>登入</ActiveButton>
          <Button
            cancel={true}
            onClick={() => {
              st.setLogin(true);
              st.setRegister(true);
            }}
          >
            註冊
          </Button>
        </>
      ) : buttonTag === "logged" ? (
        <>
          <ActiveButton
            currentPage={currentPage}
            onClick={() => navigate("/home")}
          >
            首頁
          </ActiveButton>
          <Button
            cancel={true}
            currentPage={currentPage}
            onClick={() => navigate("/upload")}
          >
            建立
          </Button>
        </>
      ) : null}
    </ButtonContainer>
  );
};

export default EditTextButton;
