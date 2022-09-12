import React, { useState } from "react";
import styled from "styled-components";
import EditTextButton from "../EditTextButton";
import logo from "./pushed-brands.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  height: 80px;
  border: solid 2px red;
  z-index: 999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
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

const Header = () => {
  const [isLogged, setIsLogged] = useState(true);
  const navigate = useNavigate();
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
      {!isLogged && <EditTextButton buttonTag={"login"} />}
      {isLogged && (
        <UserIconWrapper>
          <UserAvatarWrapper onClick={() => navigate("/profile")}>
            <UserAvatar src=""></UserAvatar>
          </UserAvatarWrapper>

          <UserInfoWrapper>
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{ pointerEvents: "none" }}
            />
          </UserInfoWrapper>
        </UserIconWrapper>
      )}
    </Wrapper>
  );
};

export default Header;
