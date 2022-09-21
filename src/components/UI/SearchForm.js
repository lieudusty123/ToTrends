import classes from "../Home Page/Header/HeaderStyling/header.module.scss";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import context from "../../contextAPI/context";

const SearchForm = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const data = useContext(context);
  function handleSubmit(event) {
    event.preventDefault();
    console.log(searchValue);
  }
  return (
    <form onSubmit={handleSubmit}>
      {props.children}
      <div id={classes.form}>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <Link
          to={{ pathname: `/interestOverTime/${searchValue}` }}
          state={{ searchTerm: searchValue, country: data.initials }}
        >
          <button>Submit</button>
        </Link>
      </div>
    </form>
  );
};
export default SearchForm;
