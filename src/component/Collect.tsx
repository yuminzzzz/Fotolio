import styled from "styled-components";
import { db } from "../utils/firebase";
import {
  doc,
  getDoc,
  DocumentData,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  collectionGroup,
} from "firebase/firestore";
import { useContext, useEffect } from "react";
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

const Collect = ({ postId }: { postId: string }) => {
  const st: any = useContext(GlobalContext);
  const modifyCollect = async () => {
    const collectionRef = doc(
      db,
      `/users/${st.userData.user_id}/user_collections/${postId}`
    );
    if (st.isSaved) {
      deleteDoc(collectionRef);
      st.setIsSaved(false);
    } else {
      const userPost = collectionGroup(db, "user_posts");
      const querySnapshot = await getDocs(userPost);
      let postData;
      querySnapshot.forEach((doc: DocumentData) => {
        if (doc.data().post_id === postId) {
          postData = doc.data();
        }
      });
      setDoc(collectionRef, postData);
      st.setIsSaved(true);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const userCollection: DocumentData = await getDocs(
        collection(db, `users/${st.userData.user_id}/user_collections`)
      );
      if (!userCollection) return;
      let isPostCollected = false;
      // const isPostCollected = userCollection.some(
      //   (item: DocumentData) => item.data().postId === postId
      // );
      userCollection.forEach((doc: DocumentData) => {
        if (doc.data().postId === postId) {
          isPostCollected = true;
        }
      });
      if (isPostCollected) {
        st.setIsSaved(true);
      } else {
        st.setIsSaved(false);
      }
    };
    getData();
  }, []);

  return st.isSaved ? (
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
