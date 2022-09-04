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
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    position: relative;
    width: 100%;
    max-width: 1920px;
    margin: 0 auto;
  }

  a {
    text-decoration: none;
  }

`;

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      <Outlet />
    </div>
  );
}

export default App;
