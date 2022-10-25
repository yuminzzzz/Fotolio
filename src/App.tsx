import { Timestamp } from "firebase/firestore";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Header from "./component/Header/Header";

const GlobalStyle = createGlobalStyle`

* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }
  }

  @-moz-document url-prefix() { 
    html{
      scrollbar-width: none;
    }
  }

  body {
    font-family: "Noto Sans TC", sans-serif;
    margin: 0; 
    scrollbar-width: none;
  }

  #root {
    min-height: 100vh;
    position: relative;
    width: 100%;
    max-width: 1920px;
    margin: 0 auto;
    padding-top: 80px;
  }

  a {
    text-decoration: none;
  }

  textarea {
    font-family: "Noto Sans TC";
  }

  li {
    list-style: none;
  }

`;
export type PostType = {
  author_avatar: string;
  author_id: string;
  author_name: string;
  created_time: Timestamp;
  description: string;
  post_id: string;
  title: string;
  url: string;
  tags: Tags[];
};
export type Message = {
  comment_id: string;
  message: string;
  post_id: string;
  uploaded_time: number;
  user_avatar: string;
  user_id: string;
  user_name: string;
};
export type Tags = {
  tag: string;
  post_id: string;
};

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Outlet />
    </>
  );
}

export default App;
