import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { db } from "../../utils/firebase";
import {
  collection,
  setDoc,
  serverTimestamp,
  doc,
  updateDoc,
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
  width: 60px;
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
}: {
  response?: string;
  rawComment?: string;
  comment?: string;
  commentId?: string;
  setResponse?: Dispatch<SetStateAction<string>>;
  setTyping?: Dispatch<SetStateAction<boolean>>;
  setTargetComment?: Dispatch<SetStateAction<string>>;
}) => {
  const postComment = () => {
    if (!response) return;
    try {
      const docRef = doc(
        collection(db, "/posts/SCaXBHGLZjkLeqhc32Kt/messages")
      );
      const data = {
        comment_id: docRef.id,
        author_id: "dfsdafds",
        author_name: "王小明",
        author_avatar: "image url",
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
    const docRef = doc(db, `/posts/SCaXBHGLZjkLeqhc32Kt/messages/${commentId}`);
    await updateDoc(docRef, { message: rawComment });
    setTargetComment && setTargetComment("");
  };
  return (
    <ButtonContainer>
      <Button
        cancel={true}
        onClick={() => {
          if (setTargetComment) {
            setTargetComment("");
            return;
          }
          setTyping && setTyping(false);
          setResponse && setResponse("");
        }}
      >
        取消
      </Button>
      {setResponse ? (
        response !== "" ? (
          <CompleteButton cancel={false} onClick={postComment}>
            完成
          </CompleteButton>
        ) : (
          <Button cancel={false}>完成</Button>
        )
      ) : rawComment !== comment && rawComment !== "" ? (
        <CompleteButton cancel={false} onClick={updateComment}>
          儲存
        </CompleteButton>
      ) : (
        <Button cancel={false}>儲存</Button>
      )}
    </ButtonContainer>
  );
};

export default EditTextButton;
