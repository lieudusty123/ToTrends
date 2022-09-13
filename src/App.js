import React from "react";
import HomePage from "./components/Home Page/HomePage";
import ContextProvider from "./contextAPI/ContextProvider";

function App() {
  return (
    <ContextProvider>
      <HomePage />
    </ContextProvider>
  );
}
export default App;
