import { Dispatch, SetStateAction } from "react";
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

  const deletePost = async () => {
    interface user {
      user_avatar: string;
      user_collection: string[];
      user_id: string;
      user_name: string;
      user_post: string[];
    }
    const docRef = doc(db, "/users/RuJg8C2CyHSbGMUwxrMr");
    const docSnap = await getDoc(docRef);
    const userData = docSnap.data() as user;
    let rawUserPost = userData.user_post;
    // let rawUserCollection = userData.user_collection;
    let updateUserPost;

    // updateUserPost = rawUserPost.filter(
    //   (item) => item !== "SCaXBHGLZjkLeqhc32Kt"
    // );
    // await updateDoc(docRef, { user_post: updateUserPost });

    await deleteDoc(doc(db, "posts/2VWJd1ulDWUogRYteuQy"));
  };
  console.log(promptButton);
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
