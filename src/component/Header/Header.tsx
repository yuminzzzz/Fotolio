import { useState, useContext } from "react";
import { GlobalContext } from "../../App";
import styled from "styled-components";
import EditTextButton from "../EditTextButton";
import logo from "./pushed-brands.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "../PopWindow";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  height: 80px;
  z-index: 999;
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
  &:hover {
    background-color: lightgrey;
  }
`;

const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: grey;
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

const Header = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [toggle, setToggle] = useState(false);
  const toggleSwitch = () => {
    if (toggle) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  };
  const navigate = useNavigate();
  const st: any = useContext(GlobalContext);
  return (
    <Wrapper>
      <LogoWrapper>
        <Logo src={logo} onClick={() => navigate("/")}></Logo>
        {!isLogged && (
          <LogoName onClick={() => navigate("/")}>Fotolio</LogoName>
        )}
        {isLogged && (
          <div style={{ marginTop: "-10px" }}>
            <EditTextButton buttonTag={"logged"} />
          </div>
        )}
      </LogoWrapper>
      {!isLogged && (
        <>
          <EditTextButton buttonTag={"login"} />
          {st.login && (
            <LoginWrapper>
              <LoginContainer>
                <CloseIconWrapper onClick={() => st.setLogin(false)}>
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
                <input type="text" id="email" placeholder="電子郵件" />
                <label htmlFor="password">密碼</label>
                <input type="text" id="password" placeholder="密碼" />
                <label htmlFor="name">名字</label>
                <input type="text" id="name" placeholder="名字" />
                <button>登入</button>
                <button>註冊</button>
                <p>還未加入Fotolio? 註冊</p>
                <p>已經有帳號了？登入</p>
              </LoginContainer>
            </LoginWrapper>
          )}
        </>
      )}
      {isLogged && (
        <UserIconWrapper>
          <UserAvatarWrapper onClick={() => navigate("/profile")}>
            <UserAvatar src=""></UserAvatar>
          </UserAvatarWrapper>
          <UserInfoWrapper onClick={toggleSwitch}>
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{ pointerEvents: "none" }}
            />
            {toggle && <PopWindow location="userInfo" />}
          </UserInfoWrapper>
        </UserIconWrapper>
      )}
    </Wrapper>
  );
};

export default Header;
