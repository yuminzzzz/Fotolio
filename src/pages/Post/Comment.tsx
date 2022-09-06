import React, { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { db } from "../../utils/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  width: 100%;
  height: 44px;
  margin: 10px 0;
  display: flex;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border: solid 1px lightgrey;
  border-radius: 50%;
`;

const Message = styled.div`
  margin-left: 20px;
`;

const UserName = styled.p``;

const Ellipsis = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  padding: 6px;
  color: grey;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  &:hover {
    background-color: lightgrey;
  }
`;

const EditComment = styled.div`
  position: absolute;
  background-color: #ffffff;
  z-index: 2;
  width: 182px;
  top: 50px;
  left: -80px;
  border: solid 1px lightgrey;
  border-radius: 20px;
  padding: 8px;
`;

const EditButton = styled.button`
  width: 100%;
  height: 36px;
  font-weight: bold;
  font-size: 18px;
  background-color: #ffffff;
  background-color: white;
  padding: 0 8px;
  border-style: none;
  text-align: left;
  cursor: pointer;
  border-radius: 12px;
  &:hover {
    background-color: lightgrey;
  }
`;

const Comment = ({
  userName,
  message,
  authorId,
  commentId,
  typing,
  setTyping,
  setTargetComment,
}: {
  userName: string;
  message: string;
  authorId: string;
  commentId: string;
  typing: boolean;
  setTyping: Dispatch<SetStateAction<boolean>>;
  setTargetComment: Dispatch<SetStateAction<string>>;
}) => {
  const [EditOrDelete, setEditOrDelete] = useState(false);

  const deleteComment = async () => {
    await deleteDoc(
      doc(db, `/posts/SCaXBHGLZjkLeqhc32Kt/messages/${commentId}`)
    );
    setEditOrDelete(false);
  };

  return (
    <Wrapper>
      <>
        <Avatar></Avatar>
        <UserName>{userName}</UserName>
        <Message>{message}</Message>
        {/* authorId === userId ? <Ellipsis></Ellipsis>:"" */}
        <Ellipsis
          onClick={() => {
            if (EditOrDelete) {
              setEditOrDelete(false);
              return;
            }
            setEditOrDelete(true);
          }}
        >
          <FontAwesomeIcon
            icon={faEllipsis}
            style={{ pointerEvents: "none" }}
          />
          {EditOrDelete && (
            <EditComment
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <EditButton
                onClick={() => {
                  setTargetComment(commentId);
                }}
              >
                編輯
              </EditButton>
              <EditButton onClick={deleteComment}>刪除</EditButton>
            </EditComment>
          )}
        </Ellipsis>
      </>
    </Wrapper>
  );
};

export default Comment;
