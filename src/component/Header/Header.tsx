import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { GlobalContext } from "../../App";
import styled from "styled-components";
import EditTextButton from "../EditTextButton";
import logo from "./pushed-brands.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "../PopWindow";
import { auth, db } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { setDoc, doc } from "firebase/firestore";

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
  z-index: 10;
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
  transform: translate(-51%, -51%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  z-index: 998;
`;

const UserInfoWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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

const Header = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState(false);
  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const st: any = useContext(GlobalContext);
  let isProfile = false;
  if (useLocation().pathname === "/profile") {
    isProfile = true;
  }

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;
        const docRef = doc(db, `users/${userId}`);
        const data = {
          user_id: userId,
          user_name: name,
          user_email: email,
          user_avatar:
            "https://firebasestorage.googleapis.com/v0/b/fotolio-799f4.appspot.com/o/pexels-magda-ehlers-1345814.jpg?alt=media&token=b389054f-0e1a-4840-85e2-3a534d62a978",
        };
        setDoc(docRef, data);
        navigate("/home");
        setEmail("");
        setPassword("");
        setName("");
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        switch (error.code) {
          case "auth/email-already-in-use":
            break;
          case "auth/invalid-email":
            break;
          case "auth/weak-password":
            break;
          default:
        }
      });
  };

  const login = () => {
    if (email === "" && password === "") return;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/home");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        //FIXBUG
        switch (error.code) {
          case "auth/invalid-email":
            break;
          case "auth/user-not-found":
            break;
          case "auth/wrong-password":
            break;
          default:
        }
      });
  };

  return (
    <Wrapper>
      <LogoWrapper>
        {!st.isLogged && (
          <>
            <Logo src={logo} onClick={() => navigate("/")}></Logo>
            <LogoName onClick={() => navigate("/")}>Fotolio</LogoName>
          </>
        )}
        {st.isLogged && (
          <>
            <Logo src={logo} onClick={() => navigate("/home")}></Logo>
            <div style={{ marginTop: "-10px" }}>
              <EditTextButton buttonTag={"logged"} />
            </div>
          </>
        )}
      </LogoWrapper>
      {!st.isLogged ? (
        <>
          <div style={{ marginTop: "-10px" }}>
            <EditTextButton buttonTag={"login"} />
          </div>
          {st.login && (
            <LoginWrapper>
              <LoginContainer>
                <CloseIconWrapper
                  onClick={() => {
                    st.setLogin(false);
                    st.setRegister(false);
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
                  歡迎使用<span style={{ fontWeight: "500" }}>Fotolio</span>
                </LoginTitle>
                <LoginForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (st.login) {
                      login();
                    } else {
                      register();
                    }
                  }}
                >
                  <LoginLabel htmlFor="email">電子郵件</LoginLabel>
                  <LoginInput
                    id="email"
                    placeholder="電子郵件"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    autoFocus
                  />
                  <LoginLabel htmlFor="password">密碼</LoginLabel>
                  <LoginInput
                    type="password"
                    id="password"
                    placeholder="密碼"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  {st.register ? (
                    <>
                      <LoginLabel htmlFor="name">名字</LoginLabel>
                      <LoginInput
                        id="name"
                        placeholder="名字"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                      <LoginButton onClick={register}>繼續</LoginButton>
                      <RegisterPrompt onClick={() => st.setRegister(false)}>
                        已經有帳號了? 登入
                      </RegisterPrompt>
                    </>
                  ) : (
                    <>
                      <LoginButton onClick={login}>登入</LoginButton>
                      <RegisterPrompt onClick={() => st.setRegister(true)}>
                        還未加入Fotolio? 註冊
                      </RegisterPrompt>
                    </>
                  )}
                </LoginForm>
              </LoginContainer>
            </LoginWrapper>
          )}
        </>
      ) : (
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
                navigate(`/search/${search}`);
              }}
            >
              <SearchInput
                placeholder="搜尋"
                isFocus={focus}
                onFocus={() => {
                  setFocus(true);
                }}
                onBlur={(e) => {
                  setFocus(false);
                  e.target.value = "";
                }}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
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
                <UserAvatar src={st.userData.user_avatar}></UserAvatar>
              </UserAvatarActive>
            </UserAvatarWrapper>
            <UserInfoWrapper onClick={() => setToggle(!toggle)}>
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
};

export default Header;
