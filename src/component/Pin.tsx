import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Collect from "./Collect";
import Ellipsis from "./Ellipsis";

interface Props {
  card: string;
  postSrc: string;
}

const PinCard = styled.div<Props>`
  margin: 15px 10px;
  padding: 0;
  border-radius: 16px;
  background-color: lightgrey;
  background-image: url(${(props) => props.postSrc});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
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

const HoverBackground = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const CollectPosition = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
`;

const EllipsisPosition = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
`;

const Pin = ({
  size,
  postId,
  postSrc,
}: {
  size: string;
  postId: string;
  postSrc: string;
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
      postSrc={postSrc}
    >
      {isHover && (
        <HoverBackground>
          <CollectPosition>
            <Collect postId={postId} />
          </CollectPosition>
          <EllipsisPosition>
            <Ellipsis roundSize={"32px"} />
          </EllipsisPosition>
        </HoverBackground>
      )}
    </PinCard>
  );
};

export default Pin;
