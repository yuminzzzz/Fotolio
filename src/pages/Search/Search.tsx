import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Post } from "../../App";
import PinterestLayout from "../../component/PinterestLayout";
import { Context } from "../../store/ContextProvider";

interface Props {
  backgroundColor: string;
}
const TagButtonWrapper = styled.div`
  width: 100%;
  padding: 12px 24px;
  overflow-x: scroll;
  display: flex;
  height: 73px;
`;

const TagButton = styled.button<Props>`
  background-color: ${(props) => props.backgroundColor};
  padding: 16px;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  margin: 0 4px;
  cursor: pointer;
  white-space: nowrap;
`;

const PromptWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 48px 0 16px;
`;

const Search = () => {
  const { authState, postState, commentState } = useContext(Context);
  const keyword = useParams().search;
  const navigate = useNavigate();
  const [post, setPost] = useState<Post[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const backgroundColor = () => {
    const color = [
      "rgb(66,53,51)",
      "rgb(167,148,145)",
      "rgb(115,115,115)",
      "rgb(71,8,59)",
      "rgb(177,165,150)",
      "rgb(229,119,86)",
      "rgb(113,113,113)",
      "rgb(27,29,42)",
      "rgb(120,113,92)",
      "rgb(112,93,75)",
      "rgb(31,40,51)",
      "rgb(174,148,76)",
      "rgb(179,166,151)",
      "rgb(87,99,101)",
      "rgb(140,99,69)",
      "rgb(178,168,151)",
      "rgb(84,75,32)",
      "rgb(172,160,145)",
      "rgb(44,88,102)",
      "rgb(200,108,57)",
      "rgb(171,156,145)",
      "rgb(175,163,162)",
      "rgb(140,99,69)",
      "rgb(34,32,35)",
      "rgb(182,84,83)",
      "rgb(107,117,115)",
      "rgb(218,205,174)",
      "rgb(172,164,162)",
      "rgb(167,137,107)",
      "rgb(229,119,86)",
    ];
    const randomColor = color[Math.floor(Math.random() * color.length)];
    return randomColor;
  };
  useEffect(() => {
    let arr: Post[] = [];
    if (keyword) {
      postState.allPost.forEach((item: Post) => {
        if (
          item.author_name === keyword ||
          item.title === keyword ||
          item.description === keyword ||
          (item.tags && item.tags.map((tag: any) => tag.tag).includes(keyword))
        ) {
          arr = [...arr, item];
        }
      });
      setPost(arr);
    }
    let rawTags = commentState.allTags.map(
      (item: { tag: string; post_id: string }) => item.tag
    );
    rawTags.sort(function () {
      return Math.random() > 0.5 ? -1 : 1;
    });
    setTags(rawTags);
  }, [commentState.allTags, keyword, postState.allPost]);

  return (
    <>
      {authState.isLogged && (
        <>
          <TagButtonWrapper>
            {tags.map((tag: string, index: number) => {
              return (
                <TagButton
                  key={index}
                  backgroundColor={backgroundColor()}
                  onClick={() => navigate(`/search/${tag}`)}
                >
                  {tag}
                </TagButton>
              );
            })}
          </TagButtonWrapper>
          {post.length > 0 ? (
            <PinterestLayout post={post}></PinterestLayout>
          ) : (
            <>
              <p style={{ textAlign: "center", margin: "32px auto" }}>
                找不到有關{keyword}的貼圖
              </p>
              <div
                style={{
                  width: "100%",
                  border: "solid 1px #cdcdcd",
                  height: "1px",
                }}
              ></div>
              <PromptWrapper>
                <h2 style={{ fontWeight: "500" }}>更多點子</h2>
                <div style={{ padding: "8px 0" }}>
                  <div style={{ fontWeight: "300" }}>
                    這裡是一些你可能會喜歡的點子。
                  </div>
                </div>
              </PromptWrapper>
              <PinterestLayout post={postState.allPost}></PinterestLayout>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Search;
