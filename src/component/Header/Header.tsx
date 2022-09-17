import { useState, useContext, useEffect } from "react";
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
import {
  setDoc,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";

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
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
`;

const LogoName = styled.h1`
  font-size: 24px;
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
    background-color: lightgrey;
  }
`;

const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
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
`;

const LoginTitle = styled.h1`
  line-height: 48px;
`;

const CloseIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  border: solid 1px red;
  border-radius: 50%;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const LoginButton = styled.button`
  cursor: pointer;
`;

const RegisterPrompt = styled.p`
  cursor: pointer;
`;

const Header = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toggleSwitch = () => {
    if (st.toggle) {
      st.setToggle(false);
    } else {
      st.setToggle(true);
    }
  };
  const navigate = useNavigate();
  const st: any = useContext(GlobalContext);

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
            "https://firebasestorage.googleapis.com/v0/b/fotolio-799f4.appspot.com/o/pushed-brands.png?alt=media&token=a4dc7827-4de6-4d08-84a6-dc4952a92133",
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
            <Logo src={logo} onClick={() => navigate("/home")}></Logo>
            <div style={{ marginTop: "-10px" }}>
              <EditTextButton buttonTag={"logged"} />
            </div>
          </>
        )}
      </LogoWrapper>
      {!isLogged && (
        <>
          <EditTextButton buttonTag={"login"} />
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
                      position: "absolute",
                      width: "18px",
                      height: "18px",
                      pointerEvents: "none",
                    }}
                  />
                </CloseIconWrapper>
                <Logo src={logo}></Logo>
                <LoginTitle>歡迎使用 Fotolio</LoginTitle>
                <label htmlFor="email">電子郵件</label>
                <input
                  id="email"
                  placeholder="電子郵件"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <label htmlFor="password">密碼</label>
                <input
                  type="password"
                  id="password"
                  placeholder="密碼"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                {st.register && (
                  <>
                    <label htmlFor="name">名字</label>
                    <input
                      id="name"
                      placeholder="名字"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </>
                )}
                {st.register ? (
                  <LoginButton onClick={register}>繼續</LoginButton>
                ) : (
                  <LoginButton onClick={login}>登入</LoginButton>
                )}
                {st.register ? (
                  <RegisterPrompt onClick={() => st.setRegister(false)}>
                    已經有帳號了？登入
                  </RegisterPrompt>
                ) : (
                  <RegisterPrompt onClick={() => st.setRegister(true)}>
                    還未加入Fotolio? 註冊
                  </RegisterPrompt>
                )}
              </LoginContainer>
            </LoginWrapper>
          )}
        </>
      )}
      {isLogged && (
        <UserIconWrapper>
          <UserAvatarWrapper onClick={() => navigate("/profile")}>
            <UserAvatar src={st.userData.user_avatar}></UserAvatar>
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
