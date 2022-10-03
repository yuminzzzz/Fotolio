import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  position: fixed;
  top: 80px;
  left: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: lightgrey;
  }
`;

const LastPageButton = () => {
  const navigate = useNavigate();
  return (
    <Wrapper onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faArrowLeft} style={{ pointerEvents: "none" }} />
    </Wrapper>
  );
};

export default LastPageButton;
