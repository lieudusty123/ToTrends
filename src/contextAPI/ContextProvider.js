import React, { useReducer } from "react";
import context from "./context";

const initialValues = {
  name: "United States",
  initials: "US",
};

function reducerFunc(state, action) {
  switch (action.type) {
    case "CHANGECOUNTRY":
      return {
        name: action.values.name,
        initials: action.values.initials,
      };
    default:
      break;
  }
}

const ContextProvider = (props) => {
  const [reducerData, setReducerData] = useReducer(reducerFunc, initialValues);

  function dispatchCountry(values) {
    setReducerData({ type: "CHANGECOUNTRY", values: values });
  }
  const passingValues = {
    name: reducerData.name,
    initials: reducerData.initials,
    changeCountry: dispatchCountry,
  };
  return (
    <context.Provider value={passingValues}>{props.children}</context.Provider>
  );
};

export default ContextProvider;
