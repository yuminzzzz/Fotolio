import { Dispatch, SetStateAction, useContext } from "react";
import { GlobalContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
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
  getDoc,
  DocumentData,
} from "firebase/firestore";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;
interface Props {
  cancel: boolean;
}

const Button = styled.button<Props>`
  min-width: 60px;
  height: 40px;
  color: ${(props) => (props.cancel ? "black" : "lightgrey")};
  padding: 8px 12px;
  border-style: none;
  border-radius: 24px;
  font-size: 16px;
  margin-left: 5px;
  cursor: pointer;
`;

const ActiveButton = styled(Button)`
  background-color: orange;
  color: #ffffff;
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
                cancel={false}
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
                cancel={false}
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
            <ActiveButton cancel={false} onClick={updateComment}>
              儲存
            </ActiveButton>
          ) : (
            <Button cancel={false}>儲存</Button>
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
            <ActiveButton cancel={false} onClick={postComment}>
              完成
            </ActiveButton>
          ) : (
            <Button cancel={false}>完成</Button>
          )}
        </>
      ) : buttonTag === "login" ? (
        <>
          <ActiveButton cancel={false} onClick={() => st.setLogin(true)}>
            登入
          </ActiveButton>
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
          <ActiveButton cancel={false} onClick={() => navigate("/home")}>
            首頁
          </ActiveButton>
          <Button cancel={true} onClick={() => navigate("/upload")}>
            建立
          </Button>
        </>
      ) : null}
    </ButtonContainer>
  );
};

export default EditTextButton;
