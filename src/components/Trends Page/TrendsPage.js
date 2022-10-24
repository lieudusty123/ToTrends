import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
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

let chart = {};
const TrendsPage = () => {
  const [compareInput, setCompareInput] = useState("");
  Chart.register(...registerables);
  const data = useContext(context);
  const location = useLocation();
  const graphRef = useRef();
  const [graphState, setGraphState] = useState("loading");
  const [graphTerms, setGraphTerms] = useState({
    country: data.initials,
    date: "month",
  });

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
                  // if (term.title.length > 0) {
                  setGraphTerms((oldTerms) => ({
                    ...oldTerms,
                    compare: term.title,
                  }));
                  // }
                  setGraphState("loading");
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
  function getInfoFromUrl() {
    const lastIndex = location.pathname.lastIndexOf("/");
    let searchTerm = location.pathname.slice(lastIndex + 1);
    if (graphTerms.term !== searchTerm)
      return setGraphTerms((oldTerms) => ({
        ...oldTerms,
        term: searchTerm,
      }));
  }
  getInfoFromUrl();

  // gets data and print to graph
  useEffect(() => {
    const fetchInterestOverTime = async () => {
      if (chart.id !== undefined) {
        chart.destroy();
      }
      let fetchCallStr = "/.netlify/functions/interestOverTime?";
      let i = 0;
      for (const key in graphTerms) {
        if (i === 0) fetchCallStr += `${key}=${graphTerms[key]}`;
        else fetchCallStr += `&${key}=${graphTerms[key]}`;
        i++;
      }
      const response = await axios.get(fetchCallStr);

      const responseData = await response.data;
      // checks if got invalid response
      if (
        typeof responseData === "string" ||
        responseData.default.timelineData.length === 0
      ) {
        chart = {};
        setGraphState("failed");
        return console.log(
          "Oops! something went wrong! you might wanna double-check your query.."
        );
      } else {
        // when receiving valid response
        setGraphState("success");
        let chartData = {};
        let datas = {};
        if (responseData.default.timelineData[0].formattedValue.length > 1) {
          chartData = {
            dates: [],
            data: [],
            compareData: [],
          };
          responseData.default.timelineData.forEach((date) => {
            chartData.data.push(date.value[0]);
            chartData.compareData.push(date.value[1]);
            chartData.dates.push(date.formattedTime);
          });

          datas = {
            labels: chartData.dates,
            datasets: [
              {
                label: graphTerms.term,
                data: chartData.data,
                fill: true,
                borderColor: "rgb(46, 123, 255)",
                tension: 0.3,
                backgroundColor: "rgba(56, 97, 223, 0.39)",
              },
              {
                label: graphTerms.compare,
                data: chartData.compareData,
                fill: true,
                borderColor: "rgb(220,20,60)",
                tension: 0.3,
                backgroundColor: "rgb(220,20,60,0.39)",
              },
            ],
          };
        } else {
          chartData = {
            dates: [],
            data: [],
          };
          responseData.default.timelineData.forEach((date) => {
            chartData.data.push(date.value[0]);
            chartData.dates.push(date.formattedTime);
          });
          datas = {
            labels: chartData.dates,
            datasets: [
              {
                label: graphTerms.term,
                data: chartData.data,
                fill: true,
                borderColor: "rgb(255, 255, 255)",
                defaultFontColor: "#FFFFFF",
                tension: 0.1,
                backgroundColor: "rgba(255, 255, 255, .5)",
              },
            ],
          };
        }

        let targetElement = graphRef.current;
        let config = {
          type: "line",
          data: datas,
          options: {
            scales: {
              y: {
                max: 100,
                min: 0,
                ticks: {
                  stepSize: 25,
                },
              },
              x: {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 5,
                },
              },
            },
            labels: {
              labelTextColor: "#FFFFFF",
            },
            maintainAspectRatio: false,
            responsive: true,
            elements: {
              point: {
                radius: 3,
              },
            },
          },
        };
        if (chartData.compareData === undefined) {
          config = {
            ...config,
            legend: {
              display: false,
            },
          };
        }
        Chart.defaults.color = () => "#FFF";
        chart = new Chart(targetElement, config);
      }
    };
    fetchInterestOverTime();
  }, [graphTerms]);

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
        compare: compareInput,
      }));
      setGraphState("loading");
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

      <div className={classes.graphContainer}>
        {(graphState === "loading" && <div>Loading...</div>) ||
          (graphState === "failed" && (
            <div className={classes["error-container"]}>
              <div style={{ color: "white" }}>
                Oops! Something went wrong...
              </div>
            </div>
          ))}
        <canvas
          className={classes.graph}
          ref={graphRef}
          style={{
            backgroundColor:
              graphState === "success" ? "rgba(0, 0, 0, 0.295)" : "transparent",
          }}
        ></canvas>
      </div>
      <Footer />
    </div>
  );
};

export default TrendsPage;
