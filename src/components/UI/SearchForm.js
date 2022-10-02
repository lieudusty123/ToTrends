import mainPageClasses from "../Home Page/Header/HeaderStyling/header.module.css";
import TrendsPageClasses from "../Trends Page/TrendsPageStyling/trendsPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import context from "../../contextAPI/context";

const SearchForm = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const data = useContext(context);
  const navigate = useNavigate();
  const location = useLocation();
  function handleSubmit(event) {
    event.preventDefault();
    navigate(`/interestOverTime/${searchValue}`, {
      state: { searchTerm: searchValue, country: data.initials },
    });
  }
  return (
    <form
      className={
        location.pathname === "/"
          ? mainPageClasses["headerContent"]
          : TrendsPageClasses["search-form-container"]
      }
      onSubmit={(event) => handleSubmit(event) & props.handleSearch}
    >
      {props.children}
      <div
        id={
          location.pathname === "/"
            ? mainPageClasses.form
            : TrendsPageClasses["search-form"]
        }
      >
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
