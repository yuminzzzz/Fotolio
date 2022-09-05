import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const LastPageButton = () => {
  const [isHover, setIsHover] = useState(false);

  const navigate = useNavigate();

  const lastPage = {
    padding: "10px",
    cursor: "pointer",
    borderRadius: "50%",
    fontSize: "20px",
    backgroundColor: isHover ? "lightgrey" : "white",
  };

  return (
    <Wrapper>
      <div
        style={{
          position: "absolute",
          top: "88px",
          left: "16px",
        }}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={lastPage}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={() => navigate("/upload")}
        />
      </div>
    </Wrapper>
  );
};

export default LastPageButton;
