import {
  faAngleDown,
  faCircleXmark,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import styled from "styled-components";
import { PostType } from "../../App";
import { AuthActionKind } from "../../store/authReducer";
import { CommentActionKind } from "../../store/commentReducer";
import { Context, ContextType } from "../../store/ContextProvider";
import { PostActionKind } from "../../store/postReducer";
import { auth, db } from "../../utils/firebase";
import EditTextButton from "../EditTextButton";
import PopWindow from "../PopWindow";
import logo from "./fotolio.png";

interface Props {
  isProfile?: boolean;
  isFocus?: boolean;
}

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
  z-index: 11;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 12px;
  &:hover {
    background-color: #efefef;
  }
`;

const LogoName = styled.h2`
  line-height: 23px;
  font-size: 23px;
  font-weight: 500;
  margin-left: 8px;
  color: orange;
`;

const UserIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatarWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #efefef;
  }
`;

const UserAvatarActive = styled.div<Props>`
  width: 30px;
  height: 30px;
  border: ${(props) => (props.isProfile ? "solid 2px black" : "")};
  border-radius: 50%;
  position: relative;
`;

const UserAvatar = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  z-index: 998;
  background-color: #e9e9e9;
`;

const UserInfoWrapper = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-style: none;
  &:hover {
    background-color: #efefef;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #e9e9e9;
  border: none;
  border-radius: 24px;
  margin: 0 8px;
  padding-left: 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  overflow: hidden;
  &:hover {
    background-color: rgb(225, 225, 225);
  }
`;

const SearchInputForm = styled.form`
  width: 100%;
  height: 100%;
`;

const SearchInput = styled.input<Props>`
  position: ${(props) => (props.isFocus ? "absolute" : "")};
  padding-left: ${(props) => (props.isFocus ? "16px" : "0")};
  left: 0;
  top: 0;
  border-radius: 24px;
  background-color: inherit;
  font-size: 16px;
  width: 100%;
  height: 100%;
  border: none;
  font-weight: 300;
  ::placeholder {
    font-weight: 300;
    height: 100%;
    line-height: 100%;
  }
`;

const DeleteSearchIcon = styled.div`
  position: absolute;
  right: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  cursor: pointer;
  &:hover {
    background-color: lightgrey;
  }
`;

const LoginWrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(51, 51, 51, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginContainer = styled.div`
  width: 484px;
  position: relative;
  padding: 20px 10px 24px;
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 24px;
  overflow: hidden;
`;

const LoadingWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(255, 252, 247, 0.4);
`;

const LoginLogo = styled(Logo)`
  margin: 8px auto 6px;
`;

const LoginTitle = styled.h1`
  line-height: 38px;
  font-size: 32px;
  font-weight: 300;
  margin: 0 auto 22px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 268px;
`;

const LoginInput = styled.input`
  height: 48px;
  padding: 8px 16px;
  border-radius: 16px;
  border-style: solid;
  margin-bottom: 10px;
  border: solid 1px #c0c0c0;
  ::placeholder {
    color: #c0c0c0;
  }
`;

const LoginLabel = styled.label`
  font-size: 12px;
  font-weight: 300;
  margin: 0 0 4px 8px;
`;

const LoginPrompt = styled.p`
  color: red;
  font-size: 12px;
  margin: -10px 0 0 8px;
`;

const AccountPrompt = styled(LoginPrompt)``;

const PasswordPrompt = styled(LoginPrompt)``;

const NamePrompt = styled(LoginPrompt)``;

const CloseIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  border-radius: 50%;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #efefef;
  }
`;

const LoginButton = styled.button`
  cursor: pointer;
  height: 40px;
  background-color: orange;
  border-style: none;
  border-radius: 20px;
  color: #fff;
  margin-top: 16px;
`;

const RegisterPrompt = styled.p`
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  margin-top: 10px;
`;

const Header = memo(() => {
  const { authState, authDispatch, postDispatch, commentDispatch } = useContext(
    Context
  ) as ContextType;
  const [loginInfo, setLoginInfo] = useState({
    name: "",
    email: "test@test.com",
    password: "Aaa123",
  });
  const [focus, setFocus] = useState(false);
  const keyWordRef = useRef<HTMLInputElement | null>(null);
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState({ acctPWT: "", name: "" });
  const navigate = useNavigate();
  let isProfile = false;
  if (useLocation().pathname === "/profile") {
    isProfile = true;
  }
  const register = () => {
    if (
      loginInfo.email === "" &&
      loginInfo.password === "" &&
      loginInfo.name === ""
    ) {
      setErrorPrompt({
        acctPWT: "???????????????????????????",
        name: "???????????????????????????",
      });
      return;
    }
    setLoading(true);
    createUserWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;
        const docRef = doc(db, `users/${userId}`);
        const data = {
          user_id: userId,
          user_name: loginInfo.name,
          user_email: loginInfo.email,
          user_avatar:
            "https://firebasestorage.googleapis.com/v0/b/fotolio-799f4.appspot.com/o/fotolio.png?alt=media&token=a4f66b86-4ac4-4e09-a473-df89428eb80f",
        };
        setDoc(docRef, data);
        authDispatch({ type: AuthActionKind.TOGGLE_REGISTER });
        setLoading(false);
        setLoginInfo({ name: "", email: "", password: "" });
      })
      .catch((error) => {
        setLoading(false);
        if (loginInfo.name === "") {
          setErrorPrompt((pre) => {
            return { ...pre, name: "???????????????????????????" };
          });
        }
        const errorCode = error.code;
        console.log(errorCode);
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorPrompt((pre) => {
              return { ...pre, acctPWT: "?????????????????????" };
            });
            break;
          case "auth/invalid-email":
            setErrorPrompt((pre) => {
              return { ...pre, acctPWT: "?????????????????????" };
            });
            break;
          case "auth/weak-password":
            setErrorPrompt((pre) => {
              return { ...pre, acctPWT: "??????????????????" };
            });
            break;
          default:
        }
      });
  };
  const login = () => {
    if (loginInfo.email === "" && loginInfo.password === "") {
      setErrorPrompt((pre) => {
        return { ...pre, acctPWT: "???????????????????????????" };
      });
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
      .then((userCredential) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        console.log(errorCode);
        switch (error.code) {
          case "auth/invalid-email":
            setErrorPrompt((pre) => {
              return { ...pre, acctPWT: "?????????????????????" };
            });
            break;
          case "auth/user-not-found":
            setErrorPrompt((pre) => {
              return { ...pre, acctPWT: "???????????????" };
            });
            break;
          case "auth/internal-error":
            setErrorPrompt((pre) => {
              return { ...pre, acctPWT: "???????????????" };
            });
            break;
          case "auth/wrong-password":
            setErrorPrompt((pre) => {
              return { ...pre, acctPWT: "??????????????????" };
            });
            break;
          default:
        }
      });
  };
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        authDispatch({ type: AuthActionKind.IS_LOGGED_TRUE });
        const getUserInfo = async () => {
          const docSnap: DocumentData = await getDoc(
            doc(db, `users/${user.uid}`)
          );
          const data = docSnap.data();
          authDispatch({ type: AuthActionKind.GET_USER_INFO, payload: data });
          authDispatch({ type: AuthActionKind.IS_LOGGED_TRUE });
        };
        getUserInfo();
      } else {
        authDispatch({ type: AuthActionKind.IS_LOGGED_FALSE });
      }
    });
  }, [authDispatch]);
  useEffect(() => {
    const getTags = async () => {
      const tags = await getDocs(collectionGroup(db, "user_posts"));
      let arr: { tag: string; post_id: string }[] = [];
      tags.forEach((item: DocumentData) => {
        if (item.data().tags !== undefined) {
          arr.push(...item.data().tags);
        }
      });
      commentDispatch({
        type: CommentActionKind.UPDATE_ALL_TAGS,
        payload: arr,
      });
    };
    getTags();
  }, [commentDispatch]);
  useEffect(() => {
    const getAllPost = async () => {
      const userPost = await getDocs(collectionGroup(db, "user_posts"));
      let arr: PostType[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      postDispatch({ type: PostActionKind.UPDATE_ALL_POST, payload: arr });
    };
    getAllPost();
  }, [postDispatch]);
  useEffect(() => {
    const getPost = async () => {
      const userPost = await getDocs(
        collection(db, `/users/${authState.userId}/user_posts`)
      );
      let arr: PostType[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      arr.sort(function (postA, postB) {
        return postA.created_time.seconds - postB.created_time.seconds;
      });
      postDispatch({ type: PostActionKind.UPDATE_USER_POST, payload: arr });
    };
    const getCollect = async () => {
      const userPost = await getDocs(
        collection(db, `/users/${authState.userId}/user_collections`)
      );
      let arr: PostType[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      postDispatch({
        type: PostActionKind.UPDATE_USER_COLLECTIONS,
        payload: arr,
      });
    };
    if (authState.userId) {
      getPost();
      getCollect();
    }
  }, [authState.userId, postDispatch]);
  return (
    <Wrapper>
      <LogoWrapper>
        {authState.isLogged === false && (
          <>
            <Logo src={logo}></Logo>
            <LogoName>Fotolio</LogoName>
          </>
        )}
        {authState.isLogged === true && (
          <>
            <Logo src={logo} onClick={() => navigate("/home")}></Logo>
            <div style={{ marginTop: "-10px" }}>
              <EditTextButton buttonTag={"logged"} />
            </div>
          </>
        )}
      </LogoWrapper>
      {authState.isLogged === false && (
        <>
          <div style={{ marginTop: "-10px" }}>
            <EditTextButton buttonTag={"login"} />
          </div>
          {(authState.login || authState.register) && (
            <LoginWrapper
              id="background"
              onClick={(e) => {
                const target = e.target as HTMLDivElement;
                if (target.id === "background") {
                  authDispatch({ type: AuthActionKind.CLOSE_POP_WINDOW });
                }
              }}
            >
              <LoginContainer>
                {loading && (
                  <LoadingWrapper>
                    <ClipLoader color="orange" loading={loading} size={30} />
                  </LoadingWrapper>
                )}
                <CloseIconWrapper
                  onClick={() => {
                    authDispatch({ type: AuthActionKind.CLOSE_POP_WINDOW });
                  }}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    style={{
                      width: "18px",
                      height: "18px",
                      pointerEvents: "none",
                    }}
                  />
                </CloseIconWrapper>
                <LoginLogo src={logo}></LoginLogo>
                <LoginTitle>
                  ????????????<span style={{ fontWeight: "500" }}>Fotolio</span>
                </LoginTitle>
                <LoginForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (authState.login) {
                      login();
                    } else {
                      register();
                    }
                  }}
                >
                  <LoginLabel htmlFor="email">????????????</LoginLabel>
                  <LoginInput
                    id="email"
                    placeholder="????????????"
                    value={loginInfo.email}
                    onFocus={() => {
                      setErrorPrompt({ acctPWT: "", name: "" });
                    }}
                    onChange={(e) => {
                      setLoginInfo((pre) => {
                        return { ...pre, email: e.target.value };
                      });
                    }}
                    autoFocus
                  />
                  {(errorPrompt.acctPWT === "?????????????????????" ||
                    errorPrompt.acctPWT === "???????????????" ||
                    errorPrompt.acctPWT === "?????????????????????" ||
                    errorPrompt.acctPWT === "???????????????????????????") && (
                    <AccountPrompt>{errorPrompt.acctPWT}</AccountPrompt>
                  )}

                  <LoginLabel htmlFor="password">??????</LoginLabel>
                  <LoginInput
                    type="password"
                    id="password"
                    placeholder="??????"
                    value={loginInfo.password}
                    onFocus={() => {
                      setErrorPrompt({ acctPWT: "", name: "" });
                    }}
                    onChange={(e) => {
                      setLoginInfo((pre) => {
                        return { ...pre, password: e.target.value };
                      });
                    }}
                  />
                  {(errorPrompt.acctPWT === "???????????????" ||
                    errorPrompt.acctPWT === "??????????????????" ||
                    errorPrompt.acctPWT === "??????????????????" ||
                    errorPrompt.acctPWT === "???????????????????????????") && (
                    <PasswordPrompt>{errorPrompt.acctPWT}</PasswordPrompt>
                  )}

                  {authState.register ? (
                    <>
                      <LoginLabel htmlFor="name">??????</LoginLabel>
                      <LoginInput
                        id="name"
                        placeholder="??????"
                        value={loginInfo.name}
                        onFocus={() => {
                          setErrorPrompt({ acctPWT: "", name: "" });
                        }}
                        onChange={(e) => {
                          setLoginInfo((pre) => {
                            return { ...pre, name: e.target.value };
                          });
                        }}
                      />
                      {errorPrompt.name === "???????????????????????????" && (
                        <NamePrompt>{errorPrompt.name}</NamePrompt>
                      )}
                      <LoginButton onClick={register}>??????</LoginButton>
                      <RegisterPrompt
                        onClick={() => {
                          authDispatch({
                            type: AuthActionKind.TOGGLE_REGISTER,
                          });
                          authDispatch({ type: AuthActionKind.TOGGLE_LOGIN });
                        }}
                      >
                        ??????????????????? ??????
                      </RegisterPrompt>
                    </>
                  ) : (
                    <>
                      <LoginButton onClick={login}>??????</LoginButton>
                      <RegisterPrompt
                        onClick={() => {
                          authDispatch({
                            type: AuthActionKind.TOGGLE_REGISTER,
                          });
                          authDispatch({ type: AuthActionKind.TOGGLE_LOGIN });
                        }}
                      >
                        ????????????Fotolio? ??????
                      </RegisterPrompt>
                    </>
                  )}
                </LoginForm>
              </LoginContainer>
            </LoginWrapper>
          )}
        </>
      )}
      {authState.isLogged === true && (
        <>
          <SearchWrapper>
            {!focus && (
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ color: "767676", zIndex: "1", marginRight: "8px" }}
              />
            )}
            <SearchInputForm
              onSubmit={(e) => {
                e.preventDefault();
                if (keyWordRef.current) {
                  if (keyWordRef.current.value.trim() !== "") {
                    navigate(`/search/${keyWordRef.current.value}`);
                    keyWordRef.current.value = "";
                  }
                }
              }}
            >
              <SearchInput
                placeholder="??????"
                isFocus={focus}
                onFocus={() => {
                  setFocus(true);
                }}
                onBlur={(e) => {
                  setFocus(false);
                  e.target.value = "";
                }}
                ref={keyWordRef}
              ></SearchInput>
            </SearchInputForm>
            {focus && (
              <DeleteSearchIcon>
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{
                    pointerEvents: "none",
                    zIndex: "3",
                    fontSize: "20px",
                  }}
                />
              </DeleteSearchIcon>
            )}
          </SearchWrapper>
          <UserIconWrapper>
            <UserAvatarWrapper onClick={() => navigate("/profile")}>
              <UserAvatarActive isProfile={isProfile}>
                <UserAvatar src={authState.userAvatar}></UserAvatar>
              </UserAvatarActive>
            </UserAvatarWrapper>
            <UserInfoWrapper
              onClick={(e) => {
                setToggle(!toggle);
              }}
              onBlur={(e) => {
                if (
                  e.relatedTarget?.innerHTML.includes("@") ||
                  e.relatedTarget?.innerHTML === "??????"
                ) {
                  return;
                }
                setToggle(false);
              }}
            >
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{ pointerEvents: "none" }}
              />
              {toggle && (
                <PopWindow location="userInfo" setToggle={setToggle} />
              )}
            </UserInfoWrapper>
          </UserIconWrapper>
        </>
      )}
    </Wrapper>
  );
});

export default Header;

export { LoadingWrapper };
