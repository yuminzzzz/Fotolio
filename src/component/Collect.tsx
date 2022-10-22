import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useContext } from "react";
import styled from "styled-components";
import { PostType } from "../App";
import { Context, ContextType } from "../store/ContextProvider";
import { PostActionKind } from "../store/postReducer";
import { db } from "../utils/firebase";

const CollectButton = styled.div`
  width: 64px;
  height: 48px;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  background-color: rgba(255, 165, 0, 1);
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 16px;
  border-style: none;
  &:hover {
    background-color: rgba(200, 133, 0, 1);
  }
`;

const CollectedButton = styled(CollectButton)`
  background-color: black;
  white-space: nowrap;
  width: 80px;
  &: hover {
    background-color: black;
  }
`;
const updateState = (data: PostType[], postId: string) => {
  return data.filter((item) => item.post_id !== postId);
};

const Collect = ({ postId }: { postId: string }) => {
  const { authState, postState, postDispatch } = useContext(
    Context
  ) as ContextType;
  const isSaved = postState.userCollections.some(
    (doc) => doc.post_id === postId
  );
  const modifyCollect = () => {
    const collectionRef = doc(
      db,
      `/users/${authState.userId}/user_collections/${postId}`
    );
    const newCollect = postState.allPost.find(
      (item) => item.post_id === postId
    );
    if (isSaved) {
      postDispatch({
        type: PostActionKind.UPDATE_USER_COLLECTIONS,
        payload: updateState(postState.userCollections, postId),
      });
      deleteDoc(collectionRef);
    } else {
      postDispatch({
        type: PostActionKind.UPDATE_USER_COLLECTIONS,
        payload: [...postState.userCollections, newCollect] as PostType[],
      });
      setDoc(collectionRef, newCollect);
    }
  };
  return isSaved ? (
    <CollectedButton
      onClick={(e) => {
        e.stopPropagation();
        modifyCollect();
      }}
    >
      已儲存
    </CollectedButton>
  ) : (
    <CollectButton
      onClick={(e) => {
        e.stopPropagation();
        modifyCollect();
      }}
    >
      儲存
    </CollectButton>
  );
};

export default Collect;
