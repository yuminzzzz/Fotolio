import { EmailAuthCredential } from "firebase/auth";
import { stringify } from "querystring";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { idText } from "typescript";
import Header from "./component/Header/Header";

const GlobalStyle = createGlobalStyle`
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
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
