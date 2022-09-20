import React, { Dispatch, SetStateAction, useContext } from "react";
import styled from "styled-components";
import { GlobalContext } from "../../App";
import Ellipsis from "../../component/Ellipsis";

const Wrapper = styled.div`
  width: 100%;
  height: 44px;
  margin: 10px 0;
  display: flex;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const Message = styled.div`
  margin-left: 20px;
`;

const UserName = styled.p``;

const Comment = ({
  userName,
  message,
  commentId,
  setTargetComment,
  isAuthor,
  authorId,
}: {
  userName: string;
  message: string;
  commentId: string;
  isAuthor: boolean;
  authorId: string;
  setTargetComment: Dispatch<SetStateAction<string>>;
}) => {
  const st: any = useContext(GlobalContext);
  return (
    <Wrapper>
      <>
        <Avatar src={st.userData.user_avatar}></Avatar>
        <UserName>{userName}</UserName>
        <Message>{message}</Message>
        {isAuthor ? (
          <Ellipsis
            commentId={commentId}
            setTargetComment={setTargetComment}
            roundSize={"24px"}
            authorId={authorId}
          />
        ) : (
          ""
        )}
      </>
    </Wrapper>
  );
};

export default Comment;
