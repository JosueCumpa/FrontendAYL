import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { Outlet, useLocation } from "react-router-dom";
import MySidebar from "./MySidebar";

const MainContent = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`flex ${darkMode ? "dark" : ""} bg-background w-full`}>
      <MySidebar setDarkMode={setDarkMode} />
      <Outlet />
    </div>
  );
};

export default MainContent;
