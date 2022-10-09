import mainPageClasses from "../Home Page/Header/HeaderStyling/header.module.css";
import TrendsPageClasses from "../Trends Page/TrendsPageStyling/trendsPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import context from "../../contextAPI/context";
import axios from "axios";
let myInterval = setInterval(() => {}, 1000);
const SearchForm = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [lastCallValue, setLastCallValue] = useState("");
  const [autoComplete, setAutoComplete] = useState();
  let mappedAutoComplete = [];
  const data = useContext(context);
  const navigate = useNavigate();
  const location = useLocation();

  function handleSubmit(event) {
    event.preventDefault();
    navigate(`/interestOverTime/${searchValue}`, {
      state: { searchTerm: searchValue, country: data.initials },
    });
  }
  function handleChange(e) {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
      if (e.target.value.length > 1 && e.target.value !== lastCallValue) {
        const fetchData = async () => {
          const response = await axios.get(
            `/.netlify/functions/autoComplete?term=${e.target.value}`
          );
          response.data.default.topics.forEach((term) => {
            console.log(term.title);
            mappedAutoComplete.push(<div key={term.title}>{term.title}</div>);
          });
          setAutoComplete(mappedAutoComplete);
          clearInterval(myInterval);
        };
        fetchData();
      }
    }, 1000);
    e.preventDefault();
    setLastCallValue(e.target.value);
    setSearchValue(e.target.value);
  }
  return (
    <form
      className={
        location.pathname === "/"
          ? mainPageClasses["form-content"]
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
        <input type="text" value={searchValue} onChange={handleChange} />
        <button>Submit</button>
      </div>
      {autoComplete}
    </form>
  );
};
export default SearchForm;
