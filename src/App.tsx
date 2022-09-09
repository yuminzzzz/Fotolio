import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

// import logo from './logo.svg';

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

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Outlet />
    </div>
  );
}

export default App;
