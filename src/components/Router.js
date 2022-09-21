import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "../App";
import TrendsPage from "./Trends Page/TrendsPage";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/interestOverTime/:id" element={<TrendsPage />} />
    </Routes>
  </BrowserRouter>
);
export default Router;
