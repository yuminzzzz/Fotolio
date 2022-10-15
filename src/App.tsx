import { useContext, useEffect, useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Header from "./component/Header/Header";
import NotoSansTCLight from "./fonts/NotoSansTC-Light.otf";
import NotoSansTCRegular from "./fonts/NotoSansTC-Regular.otf";
import NotoSansTCMedium from "./fonts/NotoSansTC-Medium.otf";
import NotoSansTCBold from "./fonts/NotoSansTC-Bold.otf";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./utils/firebase";
import {
  collection,
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { Context } from "./store/ContextProvider";

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
export type Post = {
  author_avatar: string;
  author_id: string;
  author_name: string;
  created_time: Timestamp;
  description: string;
  post_id: string;
  title: string;
  url: string;
  tags: { post_id: string; tag: string }[];
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
let isMounted = true;

function App() {
  const {
    authState,
    authDispatch,
    postDispatch,
    commentDispatch,
  } = useContext(Context);

  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          authDispatch({ type: "TOGGLE_IS_LOGGED" });
          const getUserInfo = async () => {
            const docSnap: DocumentData = await getDoc(
              doc(db, `users/${user.uid}`)
            );
            const data = docSnap.data();
            authDispatch({ type: "GET_USER_INFO", payload: data });
          };
          getUserInfo();
        } else {
          navigate("/");
        }
      });
      isMounted = false;
    }
  }, [authDispatch, navigate]);

  useEffect(() => {
    const getTags = async () => {
      const tags = await getDocs(collectionGroup(db, "user_posts"));
      let arr: { tag: string; post_id: string }[] = [];
      tags.forEach((item: DocumentData) => {
        if (item.data().tags !== undefined) {
          arr.push(...item.data().tags);
        }
      });
      commentDispatch({ type: "UPDATE_ALL_TAGS", payload: arr });
    };
    getTags();
  }, [commentDispatch]);

  useEffect(() => {
    const getAllPost = async () => {
      const userPost = await getDocs(collectionGroup(db, "user_posts"));
      let arr: Post[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      arr.sort(function () {
        return Math.random() > 0.5 ? -1 : 1;
      });
      postDispatch({ type: "UPDATE_ALL_POST", payload: arr });
    };
    getAllPost();
  }, [postDispatch]);

  useEffect(() => {
    const getPost = async () => {
      const userPost = await getDocs(
        collection(db, `/users/${authState.userId}/user_posts`)
      );
      let arr: Post[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      arr.sort(function (postA, postB) {
        return postA.created_time.seconds - postB.created_time.seconds;
      });
      postDispatch({ type: "UPDATE_USER_POST", payload: arr });
    };
    const getCollect = async () => {
      const userPost = await getDocs(
        collection(db, `/users/${authState.userId}/user_collections`)
      );
      let arr: Post[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      postDispatch({ type: "UPDATE_USER_COLLECTIONS", payload: arr });
    };

    if (authState.userId) {
      getPost();
      getCollect();
    }
  }, [authState.isLogged, authState.userId, postDispatch]);
  return (
    <>
      <GlobalStyle />
      <Header />
      <Outlet />
    </>
  );
}

export default App;
