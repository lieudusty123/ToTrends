import searchStyles from "./styling/searchForm.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import context from "../../contextAPI/context";
import { v4 as uuidv4 } from "uuid";
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
    let str = searchValue.replace(/\s+/g, " ").trim();
    if (str.length > 1) {
      navigate(`/interestOverTime/${searchValue}`, {
        state: { searchTerm: searchValue, country: data.initials },
      });
    }
  }
  function navigateToPage(e) {
    navigate(`/interestOverTime/${e.target.textContent}`, {
      state: { searchTerm: e.target.textContent, country: data.initials },
    });
  }
  function handleChange(e) {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
      if (
        e.target.value.length > 1 &&
        e.target.value !== lastCallValue &&
        e.target.value.length > searchValue.length
      ) {
        console.log("in");
        const fetchData = async () => {
          const response = await axios.get(
            `/.netlify/functions/autoComplete?term=${e.target.value}`
          );
          let termsArr = [];
          console.log(response.data.default);
          response.data.default.topics.forEach((term) => {
            if (
              termsArr.indexOf(term.title) < 0 &&
              mappedAutoComplete.length <= 5 &&
              term.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
            ) {
              termsArr.push(term.title);
              mappedAutoComplete.push(
                <li onClick={navigateToPage} key={uuidv4()}>
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
    }, 1000);
    e.preventDefault();
    setLastCallValue(e.target.value);
    setSearchValue(e.target.value);
  }
  return (
    <form
      className={searchStyles["form-content"]}
      onSubmit={(event) => handleSubmit(event)}
    >
      {props.children}

      <div id={searchStyles.form}>
        <div
          className={searchStyles["form-inputs"]}
          style={
            autoComplete.length === 0
              ? { borderRadius: "5px 5px 5px 5px" }
              : {
                  borderRadius: "5px 5px 0 0",
                }
          }
        >
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
