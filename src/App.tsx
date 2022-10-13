import React, {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
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
export interface Post {
  author_avatar: string;
  author_id: string;
  author_name: string;
  created_time: Timestamp;
  description: string;
  post_id: string;
  title: string;
  url: string;
  tags: { post_id: string; tag: string }[];
}
export interface Message {
  comment_id: string;
  message: string;
  post_id: string;
  uploaded_time: number;
  user_avatar: string;
  user_id: string;
  user_name: string;
}

export interface initialValue {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  register: boolean;
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
  userData: {
    user_avatar: string;
    user_email: string;
    user_id: string;
    user_name: string;
  };
  setUserData: React.Dispatch<
    React.SetStateAction<{
      user_avatar: string;
      user_email: string;
      user_id: string;
      user_name: string;
    }>
  >;
  isLogged: boolean | null;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean | null>>;
  allPost: Post[];
  setAllPost: React.Dispatch<React.SetStateAction<Post[]>>;
  userPost: Post[];
  setUserPost: React.Dispatch<React.SetStateAction<Post[]>>;
  userCollections: Post[];
  setUserCollections: React.Dispatch<React.SetStateAction<Post[]>>;
  updateState: (data: Post[], postId: string) => Post[];
  message: Message[];
  setMessage: React.Dispatch<React.SetStateAction<Message[]>>;
  allTags: { tag: string; post_id: string }[];
  setAllTags: React.Dispatch<
    React.SetStateAction<{ tag: string; post_id: string }[]>
  >;
}

export const GlobalContext = createContext<initialValue | null>(null);

function App() {
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [isLogged, setIsLogged] = useState<boolean | null>(false);
  const [userData, setUserData] = useState({
    user_avatar: "",
    user_email: "",
    user_id: "",
    user_name: "",
  });

  const [allPost, setAllPost] = useState<Post[]>([]);
  const [userPost, setUserPost] = useState<Post[]>([]);
  const [userCollections, setUserCollections] = useState<Post[]>([]);
  const updateState = useCallback((data: Post[], postId: string) => {
    return data.filter((item) => item.post_id !== postId);
  }, []);


  const [message, setMessage] = useState<Message[]>([]);
  const [allTags, setAllTags] = useState<{ tag: string; post_id: string }[]>(
    []
  );
  

  const navigate = useNavigate();

  const initialState = {
    login,
    setLogin,
    register,
    setRegister,
    userData,
    setUserData,
    isLogged,
    setIsLogged,
    allPost,
    setAllPost,
    userPost,
    setUserPost,
    userCollections,
    setUserCollections,
    updateState,
    message,
    setMessage,
    allTags,
    setAllTags,
  };

  useEffect(() => {
    const getTags = async () => {
      const tags = await getDocs(collectionGroup(db, "user_posts"));
      let arr: { tag: string; post_id: string }[] = [];
      tags.forEach((item: DocumentData) => {
        if (item.data().tags !== undefined) {
          arr.push(...item.data().tags);
        }
      });
      setAllTags(arr);
    };
    getTags();
  }, [isLogged]);

  useLayoutEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLogged(true);
        const getUserInfo = async () => {
          const docSnap: DocumentData = await getDoc(
            doc(db, `users/${user.uid}`)
          );
          const data = docSnap.data();
          setUserData({
            user_avatar: data.user_avatar,
            user_email: data.user_email,
            user_id: data.user_id,
            user_name: data.user_name,
          });
        };
        getUserInfo();
      } else {
        setLogin(false);
        setRegister(false);
        setIsLogged(false);
        setUserPost([]);
        setUserCollections([]);
        navigate("/");
      }
    });
  }, [navigate]);

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
      setAllPost(arr);
    };
    getAllPost();
  }, []);
  useEffect(() => {
    const getPost = async () => {
      if (!userData.user_id) return;
      const userPost = await getDocs(
        collection(db, `/users/${userData.user_id}/user_posts`)
      );
      let arr: Post[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      arr.sort(function (postA, postB) {
        return postA.created_time.seconds - postB.created_time.seconds;
      });
      setUserPost(arr);
    };
    const getCollect = async () => {
      if (!userData.user_id) return;
      const userPost = await getDocs(
        collection(db, `/users/${userData.user_id}/user_collections`)
      );
      let arr: Post[] = [];
      userPost.forEach((item: DocumentData) => {
        arr.push(item.data());
      });
      setUserCollections(arr);
    };
    getPost();
    getCollect();
  }, [userData]);
  return (
    <GlobalContext.Provider value={initialState}>
      <GlobalStyle />
      <Header />
      <Outlet />
    </GlobalContext.Provider>
  );
}

export default App;
