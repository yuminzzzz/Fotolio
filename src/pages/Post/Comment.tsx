import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import Ellipsis from "../../component/Ellipsis";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 30px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  line-height: 16px;
`;

const Message = styled.div`
  margin-left: 5px;
`;

const UserName = styled.p`
  font-weight: 700;
  margin-left: 8px;
  cursor: pointer;
`;

const SubMessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 8px;
  line-height: 16px;
  align-items: center;
`;

const MessageTime = styled.p`
  color: grey;
  font-weight: 300;
  font-size: 12px;
`;

const Comment = ({
  userName,
  message,
  commentId,
  setTargetComment,
  isAuthor,
  authorId,
  userAvatar,
  uploadedTime,
}: {
  userName: string;
  message: string;
  commentId: string;
  isAuthor: boolean;
  authorId: string;
  userAvatar: string;
  setTargetComment: Dispatch<SetStateAction<string>>;
  uploadedTime: number;
}) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const commentTime = new Date(uploadedTime);
    const nowTime = new Date();

    let commentYear = commentTime.getFullYear();
    let commentMonth = commentTime.getMonth() + 1;
    let commentDay = commentTime.getDate();
    let commentHour = commentTime.getHours();
    let commentMin = commentTime.getMinutes();
    let commentSec = commentTime.getSeconds();

    let year = nowTime.getFullYear();
    let month = nowTime.getMonth() + 1;
    let day = nowTime.getDate();
    let hour = nowTime.getHours();
    let min = nowTime.getMinutes();
    let sec = nowTime.getSeconds();

    if (commentYear === year) {
      if (commentMonth === month) {
        if (commentDay === day) {
          if (commentHour === hour) {
            if (commentMin === min) {
              if (commentSec === sec) {
                setTime("1s");
              } else {
                let currentTime = sec - commentSec;
                setTime(`${currentTime}s`);
              }
            } else {
              let currentTime = min - commentMin;
              setTime(`${currentTime}m`);
            }
          } else {
            let currentTime = hour - commentHour;
            setTime(`${currentTime}h`);
          }
        } else {
          let currentTime = day - commentDay;
          setTime(`${currentTime}d`);
        }
      } else {
        let currentTime = month - commentMonth;
        setTime(`${currentTime}mon`);
      }
    } else {
      let currentTime = year - commentYear;
      setTime(`${currentTime}y`);
    }
  }, []);

  return (
    <Wrapper>
      <Avatar src={userAvatar}></Avatar>
      <MessageWrapper>
        <MessageContainer>
          <UserName>{userName}</UserName>
          <Message>{message}</Message>
        </MessageContainer>

        <SubMessageContainer>
          <MessageTime>{time}</MessageTime>
          {isAuthor && (
            <Ellipsis
              commentId={commentId}
              setTargetComment={setTargetComment}
              roundSize={"24px"}
              authorId={authorId}
            />
          )}
        </SubMessageContainer>
      </MessageWrapper>
    </Wrapper>
  );
};

export default Comment;
