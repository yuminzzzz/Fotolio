import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Header from "./component/Header/Header";
import NotoSansTCBold from "./fonts/NotoSansTC-Bold.otf";
import NotoSansTCLight from "./fonts/NotoSansTC-Light.otf";
import NotoSansTCMedium from "./fonts/NotoSansTC-Medium.otf";
import NotoSansTCRegular from "./fonts/NotoSansTC-Regular.otf";
import { AuthActionKind } from "./store/authReducer";
import { CommentActionKind } from "./store/commentReducer";
import { Context, ContextType } from "./store/ContextProvider";
import { PostActionKind } from "./store/postReducer";
import { auth, db } from "./utils/firebase";

const GlobalStyle = createGlobalStyle`

 @font-face {
    font-family: NotoSansTC;
    src: url(${NotoSansTCLight}) format('opentype');
    font-weight: 300;
  }

  @font-face {
    font-family: NotoSansTC;
    src: url(${NotoSansTCRegular}) format('opentype');
    font-weight: 400;
  }

   @font-face {
    font-family: NotoSansTC;
    src: url(${NotoSansTCMedium}) format('opentype');
    font-weight: 500;
  }

   @font-face {
    font-family: NotoSansTC;
    src: url(${NotoSansTCBold}) format('opentype');
    font-weight: 700;
  }


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
    font-family: "NotoSansTC";
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
    font-family: "NotoSansTC";
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
  const { authState, authDispatch, postDispatch, commentDispatch } = useContext(
    Context
  ) as ContextType;
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        authDispatch({ type: AuthActionKind.TOGGLE_IS_LOGGED });
        const getUserInfo = async () => {
          const docSnap: DocumentData = await getDoc(
            doc(db, `users/${user.uid}`)
          );
          const data = docSnap.data();
          authDispatch({ type: AuthActionKind.GET_USER_INFO, payload: data });
        };
        getUserInfo();
      }
    });
  }, []);
  useEffect(() => {
    const getTags = async () => {
      const tags = await getDocs(collectionGroup(db, "user_posts"));
      let arr: { tag: string; post_id: string }[] = [];
      tags.forEach((item: DocumentData) => {
        if (item.data().tags !== undefined) {
          arr.push(...item.data().tags);
        }
      });
      commentDispatch({
        type: CommentActionKind.UPDATE_ALL_TAGS,
        payload: arr,
      });
    };
    getTags();
  }, [commentDispatch]);
  useEffect(() => {
    const getAllPost = async () => {
      const userPost = await getDocs(collectionGroup(db, "user_posts"));
      let arr: PostType[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      postDispatch({ type: PostActionKind.UPDATE_ALL_POST, payload: arr });
    };
    getAllPost();
  }, [postDispatch]);
  useEffect(() => {
    const getPost = async () => {
      const userPost = await getDocs(
        collection(db, `/users/${authState.userId}/user_posts`)
      );
      let arr: PostType[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      arr.sort(function (postA, postB) {
        return postA.created_time.seconds - postB.created_time.seconds;
      });
      postDispatch({ type: PostActionKind.UPDATE_USER_POST, payload: arr });
    };
    const getCollect = async () => {
      const userPost = await getDocs(
        collection(db, `/users/${authState.userId}/user_collections`)
      );
      let arr: PostType[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      postDispatch({
        type: PostActionKind.UPDATE_USER_COLLECTIONS,
        payload: arr,
      });
    };
    if (authState.userId) {
      getPost();
      getCollect();
    }
  }, [authState.userId, postDispatch]);
  
  return (
    <>
      <GlobalStyle />
      <Header />
      <Outlet />
    </>
  );
}

export default App;
