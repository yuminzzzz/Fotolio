import React, { useState } from "react";
import styled from "styled-components";
import PinterestLayout from "../../component/PinterestLayout";

const Wrapper = styled.div`
  padding: 0 27px;
  // border: solid 1px red;
`;

const UserInfoWrapper = styled.div`
  margin: 0 auto;
  width: 488px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserAvatar = styled.img`
  width: 120px;
  height: 120px;
  border: solid 1px red;
  border-radius: 50%;
  margin-top: 10px;
  display: inline-block;
`;

const UserName = styled.h1`
  font-weight: bold;
  line-height: 43px;
  margin-top: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0 10px;
`;

interface Props {
  active: boolean;
}

const Button = styled.button<Props>`
  cursor: pointer;
  background-color: #fff;
  margin: 0 5px;
  border-style: none;
  font-size: 16px;
  font-weight: bold;
  padding: 8px;
  border-radius: ${(props) => (props.active ? "6px 6px 0px 0px" : "6px")};
  border-bottom: ${(props) => (props.active ? "solid 2px black" : "")};

  &:hover {
    background-color: ${(props) => (props.active ? "#fff" : "lightgrey")};
  }
  display: flex;
  flex-direction: column;
`;

const Profile = () => {
  const [status, setStatus] = useState(false);
  const isActive = () => {
    if (status) {
      setStatus(false);
    } else {
      setStatus(true);
    }
  };

  return (
    <Wrapper>
      <UserInfoWrapper>
        <UserAvatar></UserAvatar>
        <UserName>王小明</UserName>
      </UserInfoWrapper>
      <ButtonWrapper>
        <Button active={!status} onClick={isActive}>
          已建立
        </Button>
        <Button active={status} onClick={isActive}>
          已儲存
        </Button>
      </ButtonWrapper>
      {!status ? (
        <PinterestLayout location="build" />
      ) : (
        <PinterestLayout location="saved" />
      )}
    </Wrapper>
  );
};

export default Profile;
