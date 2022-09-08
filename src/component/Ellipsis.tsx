import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { db } from "../utils/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import DeleteCheck from "./DeleteCheck";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

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
      ? "grey"
      : "grey"};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  &:hover {
    background-color: lightgrey;
  }
`;

const EditWrapper = styled.div`
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

const Ellipsis = ({
  commentId,
  setTargetComment,
  roundSize,
  deleteTag,
}: {
  commentId?: string;
  setTargetComment?: Dispatch<SetStateAction<string>>;
  roundSize: string;
  deleteTag?: boolean;
  setModifyCheck?: Dispatch<SetStateAction<boolean>>;
  modifyCheck?: boolean;
}) => {
  const [editOrDelete, setEditOrDelete] = useState(false);
  const [deleteModifyCheck, setDeleteModifyCheck] = useState(false);
  const storage = getStorage();
  const deleteComment = async () => {
    await deleteDoc(
      doc(db, `/posts/SCaXBHGLZjkLeqhc32Kt/messages/${commentId}`)
    );
    setEditOrDelete(false);
  };
  const downloadImg = async () => {
    const gsReference = ref(
      storage,
      "gs://fotolio-799f4.appspot.com/post-image/SCaXBHGLZjkLeqhc32Kt"
    );
    getDownloadURL(gsReference)
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
          var a = document.createElement("a");
          a.setAttribute("download", "");
          a.href = URL.createObjectURL(blob);
          a.click();
        };
        xhr.open("GET", url);
        xhr.send();
        setEditOrDelete(false);
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            break;
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      });
  };

  return (
    <Wrapper
      onClick={() => {
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
          <EditWrapper
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EditButton onClick={downloadImg} id="download">
              下載圖片
            </EditButton>
            {deleteTag && (
              <EditButton
                onClick={() => {
                  setDeleteModifyCheck(true);
                  // BUGFIX
                  // navigate to main page
                }}
              >
                刪除貼文
              </EditButton>
            )}
            {deleteModifyCheck && (
              <DeleteCheck
                promptTitle={"確定要刪除貼文？"}
                setDeleteModifyCheck={setDeleteModifyCheck}
                setEditOrDelete={setEditOrDelete}
              />
            )}
          </EditWrapper>
        ) : (
          ""
        )
      ) : roundSize === "32px" ? (
        <EditWrapper
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <EditButton>下載圖片</EditButton>
        </EditWrapper>
      ) : roundSize === "24px" ? (
        editOrDelete ? (
          <EditWrapper
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EditButton
              onClick={() => {
                setTargetComment && commentId && setTargetComment(commentId);
              }}
            >
              編輯
            </EditButton>
            <EditButton onClick={deleteComment}>刪除</EditButton>
          </EditWrapper>
        ) : (
          ""
        )
      ) : null}
    </Wrapper>
  );
};

export default Ellipsis;
