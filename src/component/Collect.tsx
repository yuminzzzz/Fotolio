import { useState } from "react";
import styled from "styled-components";
import { db } from "../utils/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const CollectButton = styled.div`
  width: 64px;
  height: 48px;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  top: 0;
  left: 0;
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
  const [toggle, setToggle] = useState(false);
  // const userId = take users doc.id (which user will get when successfully sign up or sign in, doc.id also equals to user.id)

  const modifyCollect = async () => {
    interface user {
      user_avatar: string;
      user_collection: string[];
      user_id: string;
      user_name: string;
      user_post: string[];
    }
    const docRef = doc(db, "/users/RuJg8C2CyHSbGMUwxrMr");
    const docSnap = await getDoc(docRef);
    const userData = docSnap.data() as user;
    let rawUserCollection = userData.user_collection;
    let updateUserPost;

    if (toggle) {
      updateUserPost = rawUserCollection.filter(
        (item) => item !== "5lQX3seFSCJPSJu3igly"
      );
      await updateDoc(docRef, { user_collection: updateUserPost });
      setToggle(false);
    } else {
      updateUserPost = [...rawUserCollection, "5lQX3seFSCJPSJu3igly"];
      await updateDoc(docRef, { user_collection: updateUserPost });
      setToggle(true);
    }
  };

  return toggle ? (
    <CollectedButton onClick={modifyCollect}>已儲存</CollectedButton>
  ) : (
    <CollectButton onClick={modifyCollect}>儲存</CollectButton>
  );
};

export default Collect;
