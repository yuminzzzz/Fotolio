import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
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
  border: solid 1px lightgrey;
  border-radius: 50%;
`;

const Message = styled.div`
  margin-left: 20px;
`;

const UserName = styled.p``;

const Comment = ({
  userName,
  message,
  authorId,
  commentId,
  setTargetComment,
}: {
  userName: string;
  message: string;
  authorId: string;
  commentId: string;
  setTargetComment: Dispatch<SetStateAction<string>>;
}) => {

  return (
    <Wrapper>
      <>
        <Avatar></Avatar>
        <UserName>{userName}</UserName>
        <Message>{message}</Message>
        {/* authorId === userId ? <Ellipsis></Ellipsis>:"" */}
        <Ellipsis
          commentId={commentId}
          setTargetComment={setTargetComment}
          roundSize={"24px"}
        />
      </>
    </Wrapper>
  );
};

export default Comment;
