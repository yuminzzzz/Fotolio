import {
  faCircleUp,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useContext, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import styled, { css, keyframes } from "styled-components";
import { LoadingWrapper } from "../../component/Header/Header";
import { CommentActionKind } from "../../store/commentReducer";
import { Context, ContextType } from "../../store/ContextProvider";
import { PostActionKind } from "../../store/postReducer";
import app, { db } from "../../utils/firebase";

interface Props {
  isUploadPage?: boolean;
  isUploaded?: boolean;
  tag?: string;
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
  position: relative;
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

const TitleInput = styled.input<Props>`
  height: 54px;
  font-size: ${(props) =>
    props.tag === "title" ? "40px" : props.tag === "description" ? "20px" : ""};
  line-height: normal;
  padding-bottom: ${(props) => (props.tag === "tags" ? "" : "10px")};
  border-bottom: ${(props) =>
    props.tag === "tags" ? "none" : "solid 1px #c8c8c8;"};
  border-top: 0;
  border-right: 0;
  border-left: 0;
  outline: medium;
  outline-color: orange;
  ::placeholder {
    color: #9197a3;
    font-size: ${(props) =>
      props.tag === "title"
        ? "35px"
        : props.tag === "description"
        ? "20px"
        : ""};
    padding-left: ${(props) => (props.tag === "description" ? "4px" : "")};
    font-weight: ${(props) => (props.tag === "description" ? "300" : "")};
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  margin-top: 34px;
  align-items: center;
  border-bottom: solid 1px #c8c8c8;
  overflow-x: scroll;
`;

const TagWrapper = styled.ul`
  display: flex;
  align-items: center;
`;

const Tag = styled.li`
  height: 36px;
  padding: 8px;
  font-size: 18px;
  line-height: 18px;
  border-radius: 8px;
  margin-right: 8px;
  border: solid 1px orange;
  color: orange;
  font-weight: 300;
  display: flex;
  white-space: nowrap;
`;

const CloseIcon = styled.span`
  margin-left: 12px;
  cursor: pointer;
`;

const AuthorWrapper = styled.div`
  display: flex;
  margin: 34px 0;
`;

const AuthorAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #e9e9e9;
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

const test = keyframes`
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  20% {
    opacity: 1;
    transform: translateY(0px);
  }
  85% {
    opacity: 1;
    transform: translateY(0px);
  }
  100% {
    opacity: 0;
    transform: translateY(0px);
  }
`;

const animate = css`
  animation: ${test} 3s ease-in;
`;

const PromptButton = styled.button<Props>`
  background-color: black;
  padding: 16px;
  color: #fff;
  border-radius: 32px;
  border: none;
  font-weight: 300;
  position: absolute;
  bottom: 60px;
  ${(props) => (props.isUploaded ? animate : "")};
`;
const Upload = () => {
  const [uploadData, setUploadData] = useState<{
    title: string;
    description: string;
    file: File | string;
  }>({
    title: "",
    description: "",
    file: "",
  });
  const [localTags, setLocalTags] = useState<string[]>([]);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const tagRef = useRef<HTMLInputElement | null>(null);
  const isValid = () => {
    if (uploadData.description.trim() === "" || uploadData.title.trim() === "")
      return false;
    return Object.values(uploadData).every((item) => item !== "");
  };
  const { authState, postDispatch, postState, commentState, commentDispatch } =
    useContext(Context) as ContextType;
  const previewUrl = uploadData.file
    ? URL.createObjectURL(uploadData.file as File)
    : "";
  const storage = getStorage(app);
  const post = async () => {
    setLoading(true);
    const docRef = doc(collection(db, `users/${authState.userId}/user_posts`));
    const fileRef = ref(storage, docRef.id);
    const resizeRef = ref(storage, `post-image/${docRef.id}_1000x1000`);
    try {
      uploadBytes(fileRef, uploadData.file as File).then(() => {
        setTimeout(() => {
          getDownloadURL(resizeRef)
            .then((url) => {
              const data = {
                post_id: docRef.id,
                title: uploadData.title,
                description: uploadData.description,
                created_time: Timestamp.now(),
                author_id: authState.userId,
                author_name: authState.userName,
                author_avatar: authState.userAvatar,
                url,
                tags: localTags.map((item: string) => {
                  return { tag: item, post_id: docRef.id };
                }),
              };
              postDispatch({
                type: PostActionKind.UPDATE_ALL_POST,
                payload: [...postState.allPost, data],
              });
              postDispatch({
                type: PostActionKind.UPDATE_USER_POST,
                payload: [...postState.userPost, data],
              });
              if (localTags.length > 0) {
                let tags = commentState.allTags;
                localTags.forEach((item) => {
                  tags = [...tags, { tag: item, post_id: docRef.id }];
                });
                commentDispatch({
                  type: CommentActionKind.UPDATE_ALL_TAGS,
                  payload: tags,
                });
              }
              const postDocRef = doc(
                db,
                `/users/${authState.userId}/user_posts/${docRef.id}`
              );
              setDoc(postDocRef, data);
              setLoading(false);
              setAnimate(true);
              setTimeout(() => {
                setAnimate(false);
              }, 2900);
            })
            .catch((e) => {
              setLoading(false);
              console.log(e);
            });
          setUploadData({
            file: "",
            title: "",
            description: "",
          });
          setLocalTags([]);
        }, 3000);
      });
    } catch (e) {
      setLoading(false);
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
  const deleteTag = (deleteIndex: number) => {
    setLocalTags((pre: string[]) => {
      return pre.filter((_, index) => index !== deleteIndex);
    });
  };
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagRef.current) {
      if (tagRef.current.value.trim() !== "") {
        setLocalTags([...localTags, tagRef.current.value]);
        tagRef.current.value = "";
      }
    } else {
      return;
    }
  };

  return (
    <>
      {authState.isLogged && (
        <OutsideWrapper>
          <Wrapper isUploadPage={true}>
            {loading && (
              <LoadingWrapper>
                <ClipLoader color="orange" loading={loading} size={30} />
              </LoadingWrapper>
            )}
            <PreviewWrapper>
              <PreviewImg src={previewUrl} alt="upload preview"></PreviewImg>
              {!uploadData.file && (
                <PreviewContainer>
                  <PreviewLabel htmlFor="uploader"></PreviewLabel>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    id="uploader"
                    style={{ display: "none" }}
                    placeholder="file upload"
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
            </PreviewWrapper>
            <ContentSection>
              <TitleInput
                tag="title"
                placeholder="新增標題"
                value={uploadData.title}
                onChange={titleOnChange}
              ></TitleInput>
              <AuthorWrapper>
                <AuthorAvatar
                  src={authState.userAvatar}
                  alt="user avatar"
                ></AuthorAvatar>
                <AuthorName>{authState.userName}</AuthorName>
              </AuthorWrapper>
              <TitleInput
                tag="description"
                placeholder="請輸入描述"
                value={uploadData.description}
                onChange={descriptionOnChange}
              ></TitleInput>
              <TagsWrapper>
                <TagWrapper>
                  {localTags &&
                    localTags.map((item: string, index: number) => {
                      return (
                        <Tag key={index}>
                          {item}
                          <CloseIcon onClick={() => deleteTag(index)}>
                            <FontAwesomeIcon
                              icon={faXmark}
                              style={{ pointerEvents: "none" }}
                            />
                          </CloseIcon>
                        </Tag>
                      );
                    })}
                </TagWrapper>
                <TitleInput
                  tag="tags"
                  placeholder={"按下enter以建立標籤"}
                  ref={tagRef}
                  onKeyUp={(e) => addTag(e)}
                ></TitleInput>
              </TagsWrapper>
              <ButtonWrapper>
                {isValid() ? (
                  <ActiveUploadButton onClick={post}>發佈</ActiveUploadButton>
                ) : (
                  <UploadButton>發佈</UploadButton>
                )}
              </ButtonWrapper>
            </ContentSection>
          </Wrapper>
          {animate && <PromptButton isUploaded={true}>已成功上傳</PromptButton>}
        </OutsideWrapper>
      )}
    </>
  );
};
export default Upload;
export { Wrapper, OutsideWrapper, Tag, TagWrapper };
