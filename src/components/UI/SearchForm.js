import classes from "../Home Page/Header/HeaderStyling/header.module.scss";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import context from "../../contextAPI/context";

const SearchForm = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const data = useContext(context);
  const navigate = useNavigate();
  function handleSubmit(event) {
    event.preventDefault();
    navigate(`/interestOverTime/${searchValue}`, {
      state: { searchTerm: searchValue, country: data.initials },
    });
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
        <button>Submit</button>
      </div>
    </form>
  );
};
export default SearchForm;
