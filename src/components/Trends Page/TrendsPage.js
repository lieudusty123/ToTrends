import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import context from "../../contextAPI/context";
import SearchForm from "../UI/SearchForm";
import { useLocation } from "react-router-dom";
import classes from "./TrendsPageStyling/trendsPage.module.css";
import DateRange from "./DateRange";
import CountrySelector from "../Home Page/Header/CountrySelector";
import Nav from "../Home Page/Header/Nav";
import image from "../Home Page/Header/HeaderStyling/sprites/2308.jpg";
import Footer from "../UI/Footer";
import { v4 as uuidv4 } from "uuid";
import OverTimeGraph from "./OverTimeGraph";

const TrendsPage = () => {
  const [compareInput, setCompareInput] = useState("");
  const location = useLocation();
  const data = useContext(context);
  const [graphTerms, setGraphTerms] = useState({
    country: data.initials,
    date: "month",
  });
  useEffect(() => {
    function getInfoFromUrl() {
      const lastIndex = location.pathname.lastIndexOf("/");
      let searchTerm = location.pathname.slice(lastIndex + 1);
      if (graphTerms.term !== searchTerm)
        return setGraphTerms((oldTerms) => ({
          ...oldTerms,
          term: searchTerm.split("&"),
        }));
    }
    getInfoFromUrl();
  }, [location.pathname]);
  //Auto complete ---> START
  const [autoComplete, setAutoComplete] = useState([]);
  useEffect(() => {
    let mappedAutoComplete = [];
    if (compareInput.length > 1) {
      const fetchData = async () => {
        const response = await axios.get(
          `/.netlify/functions/autoComplete?term=${compareInput}`
        );
        let termsArr = [];
        response.data.default.topics.forEach((term) => {
          if (
            termsArr.indexOf(term.title) < 0 &&
            mappedAutoComplete.length <= 5 &&
            term.title.toLowerCase().indexOf(compareInput.toLowerCase()) > -1
          ) {
            termsArr.push(term.title);
            mappedAutoComplete.push(
              <li
                onClick={() => {
                  setAutoComplete([]);
                  setCompareInput(term.title);
                  setGraphTerms((oldTerms) => ({
                    ...oldTerms,
                    term: [...graphTerms.term, term.title],
                  }));
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
    } else if (compareInput.length <= 1) {
      setAutoComplete([]);
    }
  }, [compareInput]);
  //Auto complete ---> END

  function dateSelected(e) {
    setGraphTerms((oldTerms) => ({
      ...oldTerms,
      date: e.target.value,
    }));
  }

  function countrySelected(event) {
    if (
      event.target.value.substring(event.target.value.indexOf(","), -2) ===
      "world"
    ) {
      setGraphTerms((oldTerms) => ({
        ...oldTerms,
        country: event.target.value.substring(
          event.target.value.indexOf(","),
          -2
        ),
      }));
    } else {
      setGraphTerms((oldTerms) => ({
        ...oldTerms,
        country: event.target.value.substring(0, 2),
      }));
    }
  }

  function handleCompare(e) {
    e.preventDefault();
    if (compareInput.length > 0) {
      setGraphTerms((oldTerms) => ({
        ...oldTerms,
        term: [...graphTerms.term, compareInput],
      }));
      setAutoComplete([]);
    }
  }

  return (
    <div
      className={classes.root}
      style={{
        background: `url(${image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Nav hideCountries={true} />
      <div className={classes.formContainer}>
        <SearchForm buttonLabel="Search" />
        <div className={classes["selectors-container"]}>
          <div className={classes.selectors}>
            <DateRange inputHandler={dateSelected} />
            <CountrySelector
              className={classes.inputs}
              onCountrySelect={countrySelected}
            />
          </div>
          <form onSubmit={handleCompare} className={classes["inner-form"]}>
            <input
              placeholder="Compare with..."
              className={classes.inputs}
              onChange={(e) => {
                setCompareInput(e.target.value);
              }}
              value={compareInput}
            />
            <button className={classes.inputs}>Compare!</button>
            <ul>{autoComplete}</ul>
          </form>
        </div>
      </div>
      <OverTimeGraph graphTerms={graphTerms} />
      {/* <Footer /> */}
    </div>
  );
};

export default TrendsPage;
