import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
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
  const initialState: any = {
    isSaved,
    setIsSaved,
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
