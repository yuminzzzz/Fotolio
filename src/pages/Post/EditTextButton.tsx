import { Dispatch, SetStateAction } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../utils/firebase";
import {
  collection,
  setDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";

const ButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
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

const CompleteButton = styled(Button)`
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
  setDeleteModifyCheck,
  setEditOrDelete,
}: {
  response?: string;
  rawComment?: string;
  comment?: string;
  commentId?: string;
  promptButton?: string;
  buttonTag: string;
  setResponse?: Dispatch<SetStateAction<string>>;
  setTyping?: Dispatch<SetStateAction<boolean>>;
  setTargetComment?: Dispatch<SetStateAction<string>>;
  setModifyCheck?: Dispatch<SetStateAction<boolean>>;
  setDeleteModifyCheck?: Dispatch<SetStateAction<boolean>>;
  setEditOrDelete?: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const postId = useParams().id;
  const postComment = () => {
    if (!response) return;
    try {
      const docRef = doc(collection(db, `/posts/${postId}/messages`));
      const data = {
        comment_id: docRef.id,
        user_id: "dfsdafds",
        user_name: "王小明",
        user_avatar: "image url",
        message: response,
        uploaded_time: serverTimestamp(),
      };
      setDoc(docRef, data);
      setResponse && setResponse("");
      setTyping && setTyping(false);
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };

  const updateComment = async () => {
    const docRef = doc(db, `/posts/${postId}/messages/${commentId}`);
    await updateDoc(docRef, { message: rawComment });
    setTargetComment && setTargetComment("");
  };

  const deletePost = async () => {
    const docRef = doc(db, "/users/RuJg8C2CyHSbGMUwxrMr");
    const docSnap: DocumentData = await getDoc(docRef);
    let rawUserPost = docSnap.data().user_post;
    let updateUserPost = rawUserPost.filter((item: string) => item !== postId);
    await updateDoc(docRef, { user_post: updateUserPost });
    await deleteDoc(doc(db, `posts/${postId}`));
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
              <CompleteButton
                cancel={false}
                onClick={() => {
                  setModifyCheck && setModifyCheck(false);
                  setTargetComment && setTargetComment("");
                }}
              >
                捨棄變更
              </CompleteButton>
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
              <CompleteButton
                cancel={false}
                onClick={() => {
                  deletePost();
                  setDeleteModifyCheck && setDeleteModifyCheck(false);
                  setEditOrDelete && setEditOrDelete(false);
                  navigate("/");
                }}
              >
                刪除
              </CompleteButton>
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
            <CompleteButton cancel={false} onClick={updateComment}>
              儲存
            </CompleteButton>
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
            <CompleteButton cancel={false} onClick={postComment}>
              完成
            </CompleteButton>
          ) : (
            <Button cancel={false}>完成</Button>
          )}
        </>
      ) : null}
    </ButtonContainer>
  );
};

export default EditTextButton;
