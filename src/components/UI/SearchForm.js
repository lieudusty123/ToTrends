import searchStyles from "./styling/searchForm.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import context from "../../contextAPI/context";
import axios from "axios";
let myInterval = setInterval(() => {}, 1000);
const SearchForm = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [lastCallValue, setLastCallValue] = useState("");
  const [autoComplete, setAutoComplete] = useState([]);
  let mappedAutoComplete = [];
  const data = useContext(context);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate(`/interestOverTime/${searchValue}`, {
      state: { searchTerm: searchValue, country: data.initials },
    });
  }
  function navigateToPage(e) {
    if (e.target.textContent !== "") {
      navigate(`/interestOverTime/${e.target.textContent}`, {
        state: { searchTerm: e.target.textContent, country: data.initials },
      });
    }
  }
  function handleChange(e) {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
      if (
        e.target.value.length > 1 &&
        e.target.value !== lastCallValue &&
        e.target.value.length > searchValue.length
      ) {
        const fetchData = async () => {
          const response = await axios.get(
            `/.netlify/functions/autoComplete?term=${e.target.value}`
          );
          let termsArr = [];
          response.data.default.topics.forEach((term) => {
            if (
              termsArr.indexOf(term.title) < 0 &&
              mappedAutoComplete.length <= 5
            ) {
              termsArr.push(term.title);
              mappedAutoComplete.push(
                <li onClick={navigateToPage} key={term.title}>
                  {term.title}
                </li>
              );
            }
          });
          setAutoComplete(mappedAutoComplete);
          clearInterval(myInterval);
        };
        fetchData();
      } else if (e.target.value.length === 0) {
        setAutoComplete([]);
      }
    }, 500);
    e.preventDefault();
    setLastCallValue(e.target.value);
    setSearchValue(e.target.value);
  }
  return (
    <form
      className={searchStyles["form-content"]}
      onSubmit={(event) => handleSubmit(event) & props.handleSearch}
    >
      {props.children}

      <div id={searchStyles.form}>
        <div className={searchStyles["form-inputs"]}>
          <input type="text" value={searchValue} onChange={handleChange} />
          <button>Submit</button>
        </div>
        <ul
          style={
            autoComplete.length === 0
              ? { border: "none" }
              : {
                  borderRight: "2px solid rgb(212, 212, 212)",
                  borderLeft: "2px solid rgb(212, 212, 212)",
                }
          }
        >
          {autoComplete}
        </ul>
      </div>
    </form>
  );
};
export default SearchForm;
