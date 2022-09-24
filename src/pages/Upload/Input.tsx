import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction } from "react";
interface Prop {
  tag: string;
}
const TitleInput = styled.input<Prop>`
  height: 54px;
  font-size: ${(props) =>
    props.tag === "title" ? "40px" : props.tag === "description" ? "20px" : ""};
  line-height: normal;
  padding-bottom: ${(props) => (props.tag === "tags" ? "" : "10px")};
  border-bottom: ${(props) =>
    props.tag === "tags" ? "none" : "solid 1px #c8c8c8;"};
  border-top: 0;
  border-right: 0;
  border-left: 0;
  outline: medium;
  outline-color: orange;
  ::placeholder {
    color: #9197a3;
    font-size: ${(props) =>
      props.tag === "title"
        ? "35px"
        : props.tag === "description"
        ? "20px"
        : ""};
    padding-left: ${(props) => (props.tag === "description" ? "4px" : "")};
    font-weight: ${(props) => (props.tag === "description" ? "300" : "")};
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  margin-top: 34px;
  align-items: center;
  border-bottom: solid 1px #c8c8c8;
  overflow-x: scroll;
`;

const Tag = styled.li`
  height: 36px;
  padding: 8px;
  font-size: 18px;
  line-height: 18px;
  border-radius: 8px;
  margin-right: 8px;
  border: solid 1px orange;
  color: orange;
  font-weight: 300;
  display: flex;
  white-space: nowrap;
`;

const CloseIcon = styled.span`
  margin-left: 12px;
  cursor: pointer;
`;

const Input = ({
  tag,
  placeholder,
  value,
  onChange,
  localTags,
  setLocalTags,
}: {
  tag: string;
  placeholder: string;
  value?: string;
  onChange?: (e: { target: HTMLInputElement; key?: string }) => void;
  localTags?: string[];
  setLocalTags?: Dispatch<SetStateAction<string[]>>;
}) => {
  const deleteTag = (deleteIndex: number) => {
    setLocalTags &&
      setLocalTags((pre: string[]) => {
        return pre.filter((_, index) => index !== deleteIndex);
      });
  };
  const addTag = (e: { target: HTMLInputElement; key?: string }) => {
    if (e.target.value !== "") {
      setLocalTags && localTags && setLocalTags([...localTags, e.target.value]);
      e.target.value = "";
    }
  };
  if (tag === "tags") {
    return (
      <TagsWrapper>
        <ul style={{ display: "flex", alignItems: "center" }}>
          {localTags &&
            localTags.map((item: string, index: number) => {
              return (
                <Tag>
                  {item}
                  <CloseIcon
                    onClick={() => {
                      deleteTag(index);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      style={{ pointerEvents: "none" }}
                    />
                  </CloseIcon>
                </Tag>
              );
            })}
        </ul>
        <TitleInput
          tag={tag}
          placeholder={placeholder}
          onChange={onChange}
          onKeyUp={(e: any) => (e.key === "Enter" ? addTag(e) : null)}
        ></TitleInput>
      </TagsWrapper>
    );
  } else {
    return (
      <TitleInput
        tag={tag}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      ></TitleInput>
    );
  }
};

export default Input;
