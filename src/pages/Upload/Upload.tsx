import app from "../../utils/firebase";
import { db } from "../../utils/firebase";
import { useState, useContext } from "react";
import { GlobalContext } from "../../App";
import {
  collection,
  setDoc,
  serverTimestamp,
  doc,
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
  const st: any = useContext(GlobalContext);

  const post = async () => {
    try {
      const docRef = doc(
        collection(db, `users/${st.userData.user_id}/user_posts`)
      );
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
            author_id: st.userData.user_id,
            author_name: st.userData.user_name,
            author_avatar: st.userData.user_avatar,
            url,
          };
          const postDocRef = doc(
            db,
            `/users/${st.userData.user_id}/user_posts/${docRef.id}`
          );
          setDoc(postDocRef, data);
        });

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
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            cursor: "pointer",
          }}
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
              cursor: "pointer",
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
              cursor: "pointer",
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

      <img
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
        }}
        src={st.userData.user_avatar}
        alt="user avatar"
      ></img>
      <input
        type="text"
        placeholder="請輸入標題"
        value={title}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setTitle(target.value);
        }}
      />
      <h1>{st.userData.user_name}</h1>
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
