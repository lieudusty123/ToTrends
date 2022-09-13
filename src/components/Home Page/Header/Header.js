import React from "react";
import Nav from "./Nav";
import classes from "./HeaderStyling/header.module.scss";
import SearchForm from "../../UI/SearchForm";

const Header = () => {
  return (
    <header>
      <Nav />
      <SearchForm>
        <div className={classes["type-writer-container"]}>
          Explore the worlds current{" "}
          <span className={classes["type-writer"]}></span>
        </div>
      </SearchForm>
    </header>
  );
};
export default Header;
