import { Outlet } from "react-router-dom";

// import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      <Outlet />
    </div>
  );
}

export default App;
