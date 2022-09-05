import app from "../../utils/firebase";
import { db } from "../../utils/firebase";

import { useState } from "react";
import {
  collection,
  setDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Wrapper = styled.div`
  border: solid 1px lightgrey;
  width: 1016px;
  min-height: 604px;
  display: flex;
  border-radius: 30px;
  // overflow: hidden;
`;

const storage = getStorage(app);

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<any>("");

  const post = async () => {
    try {
      const docRef = doc(collection(db, "posts"));
      const fileRef = ref(storage, `post-image/${docRef.id}`);
      if (!(title && description && file)) {
        alert("請確實輸入資訊");
        return;
      }
      uploadBytes(fileRef, file).then(() => {
        getDownloadURL(fileRef).then((url) => {
          const data = {
            post_id: docRef.id,
            title,
            description,
            created_time: serverTimestamp(),
            author_id: "RuJg8C2CyHSbGMUwxrMr",
            url,
          };
          setDoc(docRef, data);
        });
        // set post_id into users post array, record how many posts user post
        const setPost = async () => {
          interface user {
            user_avatar: string;
            user_collection: string[];
            user_id: string;
            user_name: string;
            user_post: string[];
          }
          const setPostDocRef = doc(db, "/users/RuJg8C2CyHSbGMUwxrMr");
          const docSnap = await getDoc(setPostDocRef);
          const userData = docSnap.data() as user;
          let rawUserPost = userData.user_post;
          let updateUserPost = [...rawUserPost, docRef.id];
          await updateDoc(setPostDocRef, { user_post: updateUserPost });
        };

        setPost();
        alert("上傳成功");
        setFile("");
        setTitle("");
        setDescription("");
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const previewUrl = file ? URL.createObjectURL(file) : "";

  return (
    <Wrapper>
      <div style={{ position: "relative", width: "300px", height: "300px" }}>
        <img
          style={{ width: "100%", height: "100%" }}
          src={previewUrl}
          alt="upload preview"
        ></img>
        {!file && (
          <label
            htmlFor="uploader"
            style={{
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "salmon",
              display: "inline-block",
              position: "absolute",
            }}
          >
            上傳
          </label>
        )}
        {file && (
          <FontAwesomeIcon
            icon={faTrash}
            style={{
              position: "absolute",
              top: "125px",
              left: "10px",
              color: "#ffffff",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
            }}
            onClick={() => {
              setFile("");
            }}
          />
        )}
        <input
          type="file"
          accept="image/png, image/jpeg, image/gif"
          id="uploader"
          style={{ display: "none" }}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            const file = (target.files as FileList)[0];
            setFile(file);
          }}
        />
      </div>

      <div
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: "red",
          borderRadius: "50%",
        }}
      ></div>
      <input
        type="text"
        placeholder="請輸入標題"
        value={title}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setTitle(target.value);
        }}
      />
      <h1>王小明</h1>
      <input
        type="text"
        placeholder="請輸入描述"
        value={description}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setDescription(target.value);
        }}
      />
      <button style={{ width: "50px", height: "30px" }} onClick={post}>
        發佈
      </button>
    </Wrapper>
  );
};
export default Upload;
export { Wrapper };
