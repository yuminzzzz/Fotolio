import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import EditTextButton from "./EditTextButton";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(51, 51, 51, 0.9);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Prompt = styled.div`
  background-color: #ffffff;
  width: 400px;
  border-radius: 30px;
`;

const PromptTitle = styled.div`
  font-size: 34px;
  text-align: center;
  font-weight: bold;
  line-height: 34px;
  padding: 32px;
  height: 98px;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  margin: 0 10px 10px 0;
`;

const DeleteCheck = ({
  promptTitle,
  setModifyCheck,
  setTargetComment,
  setDeleteModifyCheck,
  setEditOrDelete,
}: {
  promptTitle: string;
  setModifyCheck?: Dispatch<SetStateAction<boolean>>;
  setTargetComment?: Dispatch<SetStateAction<string>>;
  setDeleteModifyCheck?: Dispatch<SetStateAction<boolean>>;
  setEditOrDelete?: Dispatch<SetStateAction<boolean>>;
}) => {
  console.log(promptTitle);
  return (
    <Wrapper>
      <Prompt>
        <PromptTitle>{promptTitle}</PromptTitle>
        <ButtonWrapper>
          <EditTextButton
            buttonTag="deleteCheck"
            promptButton={promptTitle}
            setModifyCheck={setModifyCheck}
            setTargetComment={setTargetComment}
            setDeleteModifyCheck={setDeleteModifyCheck}
            setEditOrDelete={setEditOrDelete}
          ></EditTextButton>
        </ButtonWrapper>
      </Prompt>
    </Wrapper>
  );
};

export default DeleteCheck;
