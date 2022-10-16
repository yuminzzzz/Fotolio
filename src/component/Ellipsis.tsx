import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import PopWindow from "./PopWindow";

interface Props {
  roundSize: string;
}

const Wrapper = styled.button<Props>`
  position: relative;
  width: ${(props) => (props.roundSize === "48px" ? "48px" : "24px")};
  height: ${(props) => (props.roundSize === "48px" ? "48px" : "24px")};
  padding: ${(props) => (props.roundSize === "48px" ? "14px" : "6px")};
  font-size: ${(props) => (props.roundSize === "48px" ? "20px" : "12px")};
  color: ${(props) => (props.roundSize === "48px" ? "black" : "grey")};
  background-color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-style: none;
  &:hover {
    background-color: #e9e9e9;
  }
`;

const Ellipsis = ({
  commentId,
  setTargetComment,
  roundSize,
  deleteTag,
  authorId,
}: {
  commentId?: string;
  setTargetComment?: Dispatch<SetStateAction<string>>;
  roundSize: string;
  deleteTag?: boolean;
  authorId?: string;
}) => {
  const [editOrDelete, setEditOrDelete] = useState(false);
  return (
    <Wrapper
      onClick={(e) => {
        e.stopPropagation();
        setEditOrDelete((pre) => !pre);
      }}
      roundSize={roundSize}
      onBlur={(e) => {
        if (
          e.relatedTarget?.innerHTML === "刪除貼文" ||
          e.relatedTarget?.innerHTML === "下載圖片" ||
          e.relatedTarget?.innerHTML === "編輯" ||
          e.relatedTarget?.innerHTML === "刪除"
        ) {
          return;
        }
        setEditOrDelete(false);
      }}
    >
      <FontAwesomeIcon icon={faEllipsis} style={{ pointerEvents: "none" }} />

      {roundSize === "48px" ? (
        editOrDelete ? (
          <PopWindow
            location="post"
            deleteTag={deleteTag}
            setEditOrDelete={setEditOrDelete}
          />
        ) : (
          ""
        )
      ) : roundSize === "24px" ? (
        editOrDelete ? (
          <PopWindow
            location="comment"
            commentId={commentId}
            setTargetComment={setTargetComment}
            setEditOrDelete={setEditOrDelete}
            authorId={authorId}
          />
        ) : (
          ""
        )
      ) : null}
    </Wrapper>
  );
};

export default Ellipsis;
