import { Dispatch, SetStateAction, useEffect } from "react";
import styled from "styled-components";

const CommentInput = styled.div`
  width: 100%;
  border-radius: 26px;
  border: solid 1px lightgrey;
  padding: 15px 12px;
  height: 48px;
`;

const Textarea = styled.textarea`
  height: 22px;
  width: 360px;
  border: 0;
  resize: none;
  &:focus {
    outline: 0;
  }
`;

const MyComment = ({
  response,
  setResponse,
  typing,
  setTyping,
  comment,
  rawComment,
  setRawComment,
}: {
  response?: string;
  setResponse?: Dispatch<SetStateAction<string>>;
  typing?: boolean;
  setTyping?: Dispatch<SetStateAction<boolean>>;
  comment?: string;
  rawComment?: string;
  setRawComment?: Dispatch<SetStateAction<string>>;
}) => {
  useEffect(() => {
    if (setRawComment && comment) {
      setRawComment(comment);
    }
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <CommentInput>
        <Textarea
          name="comment"
          id="comment"
          placeholder={setTyping ? "新增回應" : ""}
          value={rawComment ? rawComment : response}
          onChange={(e) => {
            setRawComment && setRawComment(e.target.value);
            setResponse && setResponse(e.target.value);
          }}
          onFocus={() => {
            setTyping && setTyping(true);
          }}
        ></Textarea>
      </CommentInput>
    </div>
  );
};

export default MyComment;
