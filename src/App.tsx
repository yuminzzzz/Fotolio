import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Header from "./component/Header/Header";
import NotoSansTCLight from "./fonts/NotoSansTC-Light.otf";
import NotoSansTCRegular from "./fonts/NotoSansTC-Regular.otf";
import NotoSansTCMedium from "./fonts/NotoSansTC-Medium.otf";
import NotoSansTCBold from "./fonts/NotoSansTC-Bold.otf";

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
  }

  body {
    font-family: "NotoSansTC";
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

`;
export const GlobalContext = React.createContext(null);

function App() {
  const [isSaved, setIsSaved] = useState(false);
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [toggle, setToggle] = useState(false);
  
  const [userData, setUserData] = useState({
    user_avatar: "",
    user_email: "",
    user_id: "",
    user_name: "",
  });
  const initialState: any =
    // : {
    //   isSaved: boolean;
    //   setIsSaved: Dispatch<SetStateAction<boolean>>;
    //   login: boolean;
    //   setLogin: Dispatch<SetStateAction<boolean>>;
    // }
    {
      isSaved,
      setIsSaved,
      login,
      setLogin,
      register,
      setRegister,
      toggle,
      setToggle,
      userData,
      setUserData,
    };

  return (
    <GlobalContext.Provider value={initialState}>
      <GlobalStyle />
      <Header />
      <Outlet />
    </GlobalContext.Provider>
  );
}

export default App;
