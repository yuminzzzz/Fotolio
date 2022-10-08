import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Collect from "./Collect";

interface Props {
  card: string;
}

const PinCard = styled.div<Props>`
  width: 230px;
  height: ${(props) =>
    props.card === "small"
      ? "230px"
      : props.card === "medium"
      ? "300px"
      : props.card === "large"
      ? "420px"
      : null};
  margin: 15px 10px;
  padding: 0;
  border-radius: 16px;
  background-color: lightgrey;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  grid-row-end: ${(props) =>
    props.card === "small"
      ? "span 26"
      : props.card === "medium"
      ? "span 33"
      : props.card === "large"
      ? "span 45"
      : null};
`;

const PinImg = styled.img`
  object-fit: cover;
  object-position: cover;
  position: absolute;
  width: inherit;
  height: inherit;
  top: 0;
  left: 0;
`;

const HoverBackground = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
`;

const CollectPosition = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
`;

const Pin = ({
  size,
  postId,
  postSrc,
  initStatus,
}: {
  size: string;
  postId: string;
  postSrc: string;
  initStatus: boolean;
}) => {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();

  return (
    <PinCard
      card={size}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => {
        navigate(`/posts/${postId}`);
      }}
    >
      <PinImg data-src={postSrc}></PinImg>
      {isHover && (
        <HoverBackground>
          <CollectPosition>
            <Collect postId={postId} initStatus={initStatus} />
          </CollectPosition>
        </HoverBackground>
      )}
    </PinCard>
  );
};

export default Pin;
