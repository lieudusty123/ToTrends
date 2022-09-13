import { createContext } from "react";

const context = createContext({
  name: "United States",
  initials: "US",
  changeCountry: () => {},
});

export default context;
