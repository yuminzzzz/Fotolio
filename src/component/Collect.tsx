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
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
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
  setInitStatus,
}: {
  postId: string;
  initStatus: boolean;
  setInitStatus: Dispatch<SetStateAction<boolean>>;
}) => {
  const st: any = useContext(GlobalContext);
  const [isSaved, setIsSaved] = useState(initStatus);

  const modifyCollect = async () => {
    const collectionRef = doc(
      db,
      `/users/${st.userData.user_id}/user_collections/${postId}`
    );
    if (isSaved) {
      deleteDoc(collectionRef);
      setIsSaved(false);
      setInitStatus(false);
    } else {
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
      setInitStatus(true);
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
