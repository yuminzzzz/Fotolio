import app from "../../utils/firebase";
import { db } from "../../utils/firebase";
import { useState, useContext } from "react";
import { GlobalContext, Post } from "../../App";
import { collection, setDoc, serverTimestamp, doc } from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Input from "./Input";
import { Navigate } from "react-router-dom";
interface Props {
  isUploadPage?: boolean;
}

const OutsideWrapper = styled.div<Props>`
  display: flex;
  justify-content: center;
  height: calc(100vh - 80px);
  align-items: center;
  background-color: ${(props) => (props.isUploadPage ? "#e9e9e9" : "#fff")};
  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const Wrapper = styled.div<Props>`
  display: flex;
  border-radius: ${(props) => (props.isUploadPage ? "16px" : "32px")};
  box-shadow: rgb(0 0 0 / 10%) 0px 1px 20px 0px;
  overflow: hidden;
  background-color: #fff;
  padding: ${(props) => (props.isUploadPage ? "60px" : "")};
  @media (max-width: 768px) {
    flex-direction: column;
    padding: ${(props) => (props.isUploadPage ? "0" : "")};
  }
`;

const PreviewWrapper = styled.div<Props>`
  position: relative;
  width: 340px;
  height: 484px;
  border-radius: 6px;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  cursor: pointer;
  border-radius: 6px;
`;

const PreviewContainer = styled.div`
  background-color: #efefef;
  width: 100%;
  height: 100%;
  position: relative;
`;

const PreviewLabel = styled.label`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: inline-block;
  position: absolute;
  border-radius: 6px;
  z-index: 10;
`;

const PreviewOutline = styled.div`
  top: 16px;
  left: 16px;
  width: calc(100% - 32px);
  height: calc(100% - 32px);
  cursor: pointer;
  display: inline-block;
  position: absolute;
  border: dashed 3px lightgrey;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewPromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewPrompt = styled.p`
  font-weight: 300;
`;

const DeletePreview = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #fff;
  pointer: cursor;
  position: relative;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #efefef;
  }
`;

const ContentSection = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  position: relative;
  @media (max-width: 768px) {
    margin-top: 20px;
    margin-left: 0;
    padding: 0 16px;
    height: 400px;
  }
`;

const AuthorWrapper = styled.div`
  display: flex;
  margin: 34px 0;
`;

const AuthorAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

const AuthorName = styled.p`
  font-weight: 700;
  margin-left: 8px;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
  }
`;

const UploadButton = styled.button`
  width: 64px;
  height: 48px;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  color: lightgrey;
  font-size: 16px;
  padding: 12px 16px;
  border-style: none;
`;

const ActiveUploadButton = styled(UploadButton)`
  background-color: rgba(255, 165, 0, 1);
  color: #ffffff;
  &:hover {
    background-color: rgba(200, 133, 0, 1);
  }
`;

const Upload = () => {
  const [uploadData, setUploadData] = useState<{
    title: string;
    description: string;
    file: any;
  }>({
    title: "",
    description: "",
    file: "",
  });
  const [localTags, setLocalTags] = useState<string[]>([]);
  const isValid = Object.values(uploadData).every((item) => item !== "");
  const st: any = useContext(GlobalContext);
  const storage = getStorage(app);
  const post = async () => {
    try {
      const docRef = doc(
        collection(db, `users/${st.userData.user_id}/user_posts`)
      );
      const fileRef = ref(storage, `post-image/${docRef.id}`);
      uploadBytes(fileRef, uploadData.file).then(() => {
        getDownloadURL(fileRef).then((url) => {
          const data = {
            post_id: docRef.id,
            title: uploadData.title,
            description: uploadData.description,
            created_time: serverTimestamp(),
            author_id: st.userData.user_id,
            author_name: st.userData.user_name,
            author_avatar: st.userData.user_avatar,
            url,
            tags: localTags.map((item: string) => {
              return { tag: item, post_id: docRef.id };
            }),
          };

          st.setAllPost((pre: Post[]) => {
            return [...pre, data];
          });
          st.setUserPost((pre: Post[]) => {
            return [...pre, data];
          });

          if (localTags.length > 0) {
            localTags.forEach((item) => {
              st.setAllTags((pre: { tag: string; postId: string }[]) => {
                return [...pre, { tag: item, postId: docRef.id }];
              });
            });
          }
          const postDocRef = doc(
            db,
            `/users/${st.userData.user_id}/user_posts/${docRef.id}`
          );
          setDoc(postDocRef, data);
        });

        alert("上傳成功");

        setUploadData({
          file: "",
          title: "",
          description: "",
        });
        setLocalTags([]);
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const titleOnChange = (e: { target: HTMLInputElement }) => {
    setUploadData((pre) => {
      return {
        ...pre,
        title: e.target.value,
      };
    });
  };
  const descriptionOnChange = (e: { target: HTMLInputElement }) => {
    setUploadData((pre) => {
      return {
        ...pre,
        description: e.target.value,
      };
    });
  };
  const previewUrl = uploadData.file
    ? URL.createObjectURL(uploadData.file)
    : "";

  if (!st.isLogged) {
    return <Navigate to="/" />;
  } else {
    return (
      <OutsideWrapper>
        <Wrapper isUploadPage={true}>
          <PreviewWrapper>
            <PreviewImg src={previewUrl} alt="upload preview"></PreviewImg>
            {!uploadData.file && (
              <PreviewContainer>
                <PreviewLabel htmlFor="uploader"></PreviewLabel>
                <PreviewOutline>
                  <PreviewPromptContainer>
                    <FontAwesomeIcon
                      icon={faCircleUp}
                      style={{
                        fontSize: "30px",
                        color: "#767676",
                        marginBottom: "20px",
                      }}
                    />
                    <PreviewPrompt>按一下，已進行上傳</PreviewPrompt>
                  </PreviewPromptContainer>
                </PreviewOutline>
              </PreviewContainer>
            )}
            {uploadData.file && (
              <DeletePreview
                onClick={() => {
                  setUploadData((pre) => {
                    return {
                      ...pre,
                      file: "",
                    };
                  });
                }}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{
                    pointerEvents: "none",
                  }}
                />
              </DeletePreview>
            )}

            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              id="uploader"
              style={{ display: "none" }}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = (target.files as FileList)[0];
                setUploadData((pre) => {
                  return {
                    ...pre,
                    file: file,
                  };
                });
              }}
            />
          </PreviewWrapper>
          <ContentSection>
            <Input
              tag="title"
              placeholder="新增標題"
              value={uploadData.title}
              onChange={titleOnChange}
            />
            <AuthorWrapper>
              <AuthorAvatar
                src={st.userData.user_avatar}
                alt="user avatar"
              ></AuthorAvatar>
              <AuthorName>{st.userData.user_name}</AuthorName>
            </AuthorWrapper>
            <Input
              tag="description"
              placeholder="請輸入描述"
              value={uploadData.description}
              onChange={descriptionOnChange}
            />
            <Input
              tag="tags"
              placeholder="按下enter以建立標籤"
              localTags={localTags}
              setLocalTags={setLocalTags}
            />
            <ButtonWrapper>
              {isValid ? (
                <ActiveUploadButton onClick={post}>發佈</ActiveUploadButton>
              ) : (
                <UploadButton>發佈</UploadButton>
              )}
            </ButtonWrapper>
          </ContentSection>
        </Wrapper>
      </OutsideWrapper>
    );
  }
};
export default Upload;
export { Wrapper, OutsideWrapper };
