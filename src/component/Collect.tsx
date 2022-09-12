import styled from "styled-components";
import { db } from "../utils/firebase";
import { doc, updateDoc, getDoc, DocumentData } from "firebase/firestore";
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

  // const userId = take users doc.id (which user will get when successfully sign up or sign in, doc.id also equals to user.id)
  const modifyCollect = async () => {
    const docRef = doc(db, "/users/RuJg8C2CyHSbGMUwxrMr");
    const docSnap: DocumentData = await getDoc(docRef);
    let rawUserCollection = docSnap.data().user_collection;
    let updateUserPost;

    if (st.isSaved) {
      updateUserPost = rawUserCollection.filter(
        (item: string) => item !== postId
      );
      await updateDoc(docRef, { user_collection: updateUserPost });
      st.setIsSaved(false);
    } else {
      updateUserPost = [...rawUserCollection, postId];
      await updateDoc(docRef, { user_collection: updateUserPost });
      st.setIsSaved(true);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(db, "users/RuJg8C2CyHSbGMUwxrMr");
      const docSnap: DocumentData = await getDoc(docRef);
      const userCollection = docSnap.data().user_collection;
      if (userCollection.includes(postId)) {
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
