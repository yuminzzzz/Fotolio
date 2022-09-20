import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "./PopWindow";

interface Props {
  roundSize: string;
}

const Wrapper = styled.div<Props>`
  position: relative;
  width: ${(props) =>
    props.roundSize === "48px"
      ? "48px"
      : props.roundSize === "32px"
      ? "32px"
      : "24px"};

  height: ${(props) =>
    props.roundSize === "48px"
      ? "48px"
      : props.roundSize === "32px"
      ? "32px"
      : "24px"};
  padding: ${(props) =>
    props.roundSize === "48px"
      ? "14px"
      : props.roundSize === "32px"
      ? "8px"
      : "6px"};

  font-size: ${(props) =>
    props.roundSize === "48px"
      ? "20px"
      : props.roundSize === "32px"
      ? "16px"
      : "12px"};
  color: ${(props) =>
    props.roundSize === "48px"
      ? "black"
      : props.roundSize === "32px"
      ? "black"
      : "grey"};
  background-color: ${(props) =>
    props.roundSize === "48px"
      ? "#fff"
      : props.roundSize === "32px"
      ? "lightgrey"
      : "#fff"};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  &:hover {
    background-color: ${(props) =>
      props.roundSize === "48px"
        ? "lightgrey"
        : props.roundSize === "32px"
        ? "white"
        : "lightgrey"};
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
        if (editOrDelete) {
          setEditOrDelete(false);
          return;
        }
        setEditOrDelete(true);
      }}
      roundSize={roundSize}
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
      ) : roundSize === "32px" ? (
        editOrDelete ? (
          <PopWindow location="pin" setEditOrDelete={setEditOrDelete} />
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
