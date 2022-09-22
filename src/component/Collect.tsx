import styled from "styled-components";
import { db } from "../utils/firebase";
import {
  doc,
  DocumentData,
  setDoc,
  deleteDoc,
  getDocs,
  collectionGroup,
} from "firebase/firestore";
import { useContext, useState } from "react";
import { GlobalContext } from "../App";

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

const Collect = ({
  postId,
  initStatus,
}: {
  postId: string;
  initStatus: boolean;
}) => {
  const st: any = useContext(GlobalContext);
  const [isSaved, setIsSaved] = useState(initStatus);
  interface Post {
    author_avatar: string;
    author_id: string;
    author_name: string;
    created_time: { seconds: number; nanoseconds: number };
    description: string;
    post_id: string;
    title: string;
    url: string;
  }
  const modifyCollect = async () => {
    const collectionRef = doc(
      db,
      `/users/${st.userData.user_id}/user_collections/${postId}`
    );
    if (isSaved) {
      st.setUserCollections(st.updateState(st.userCollections, postId));
      deleteDoc(collectionRef);
      setIsSaved(false);
    } else {
      const newCollect = st.allPost.find(
        (item: Post) => item.post_id === postId
      );
      st.setUserCollections((pre: Post[]) => {
        return [...pre, newCollect];
      });
      const userPost = collectionGroup(db, "user_posts");
      const querySnapshot = await getDocs(userPost);
      let postData;
      querySnapshot.forEach((doc: DocumentData) => {
        if (doc.ref.path.includes(postId)) {
          postData = doc.data();
        }
      });
      setDoc(collectionRef, postData);
      setIsSaved(true);
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
