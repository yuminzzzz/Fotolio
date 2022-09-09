import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "./App";
import Upload from "./pages/Upload/Upload";
import Post from "./pages/Post/Post";
import Home from "./pages/Home/Home";
import HomeLogged from "./pages/HomeLogged/HomeLogged";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="home" element={<HomeLogged />} />
        <Route path="upload" element={<Upload />} />
        <Route path="posts" element={<Post />} />
        {/* <Route path="profile" element={<Profile />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
