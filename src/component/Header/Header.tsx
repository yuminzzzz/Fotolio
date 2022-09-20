import { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GlobalContext } from "../../App";
import styled from "styled-components";
import EditTextButton from "../EditTextButton";
import logo from "./pushed-brands.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "../PopWindow";
import { auth, db } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc, getDoc, DocumentData } from "firebase/firestore";

interface Props {
  isProfile: boolean;
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

const LogoName = styled.h1`
  line-height: 24px;
  font-size: 24px;
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
  // object-fit: cover;
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
  const [isLogged, setIsLogged] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mouseDown, setMouseDown] = useState(false);
  const toggleSwitch = () => {
    if (st.toggle) {
      st.setToggle(false);
    } else {
      st.setToggle(true);
    }
  };
  const navigate = useNavigate();
  const st: any = useContext(GlobalContext);
  let isProfile = false;
  if (useLocation().pathname === "/profile") {
    isProfile = true;
  }

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
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
        //FIXBUG
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

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // get user data and store it into state
        const docSnap: DocumentData = await getDoc(
          doc(db, `users/${user.uid}`)
        );
        const data = docSnap.data();
        st.setUserData({
          user_avatar: data.user_avatar,
          user_email: data.user_email,
          user_id: data.user_id,
          user_name: data.user_name,
        });
        setIsLogged(true);
        navigate("/home");
      } else {
        st.setLogin(false);
        st.setRegister(false);
        setIsLogged(false);
        navigate("/");
      }
    });
  }, [isLogged]);

  return (
    <Wrapper>
      <LogoWrapper>
        {!isLogged && (
          <>
            <Logo src={logo} onClick={() => navigate("/")}></Logo>
            <LogoName onClick={() => navigate("/")}>Fotolio</LogoName>
          </>
        )}

        {isLogged && (
          <>
            <Logo
              src={logo}
              onClick={() => navigate("/home")}
            ></Logo>
            <div style={{ marginTop: "-10px" }}>
              <EditTextButton buttonTag={"logged"} />
            </div>
          </>
        )}
      </LogoWrapper>
      {!isLogged ? (
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
        <UserIconWrapper>
          <UserAvatarWrapper onClick={() => navigate("/profile")}>
            <UserAvatarActive isProfile={isProfile}>
              <UserAvatar src={st.userData.user_avatar}></UserAvatar>
            </UserAvatarActive>
          </UserAvatarWrapper>
          <UserInfoWrapper onClick={toggleSwitch}>
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{ pointerEvents: "none" }}
            />
            {st.toggle && <PopWindow location="userInfo" />}
          </UserInfoWrapper>
        </UserIconWrapper>
      )}
    </Wrapper>
  );
};

export default Header;
