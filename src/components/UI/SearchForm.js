import searchStyles from "./styling/searchForm.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import context from "../../contextAPI/context";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const SearchForm = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [autoComplete, setAutoComplete] = useState([]);
  const formRef = useRef();
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

  useEffect(() => {
    let mappedAutoComplete = [];
    function navigateToPage(e) {
      navigate(`/interestOverTime/${e.target.textContent}`, {
        state: { searchTerm: e.target.textContent, country: data.initials },
      });
    }
    if (searchValue.length > 1) {
      const fetchData = async () => {
        const response = await axios.get(
          `/.netlify/functions/autoComplete?term=${searchValue}`
        );
        let termsArr = [];
        response.data.default.topics.forEach((term) => {
          if (
            termsArr.indexOf(term.title) < 0 &&
            mappedAutoComplete.length <= 5 &&
            term.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
          ) {
            termsArr.push(term.title);
            mappedAutoComplete.push(
              <li
                onClick={(e) => {
                  setSearchValue("");
                  navigateToPage(e);
                }}
                key={uuidv4()}
              >
                {term.title}
              </li>
            );
          }
        });
        setAutoComplete(mappedAutoComplete);
      };
      fetchData();
    } else if (searchValue.length <= 1) {
      setAutoComplete([]);
    }
  }, [searchValue, navigate, data.initials]);
  function handleChange(e) {
    setSearchValue(e.target.value);
  }

  if (searchValue.length <= 1 && autoComplete.length > 0) {
    setAutoComplete([]);
  }
  return (
    <form
      ref={formRef}
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
          <button>{props.buttonLabel}</button>
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
      </div>
    </form>
  );
};
export default SearchForm;
