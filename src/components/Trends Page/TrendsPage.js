import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import context from "../../contextAPI/context";
import SearchForm from "../UI/SearchForm";
import { useLocation } from "react-router-dom";
import classes from "./TrendsPageStyling/trendsPage.module.css";
import DateRange from "./DateRange";
import CountrySelector from "../Home Page/Header/CountrySelector";
import errorImage from "./TrendsPageStyling/sprites/site_support.png";
import Nav from "../Home Page/Header/Nav";

let chart = {};
const TrendsPage = () => {
  const [compareInput, setCompareInput] = useState("");
  Chart.register(...registerables);
  const data = useContext(context);
  const location = useLocation();
  const pleaseWork = useRef();
  const [graphState, setGraphState] = useState("loading");
  const [graphTerms, setGraphTerms] = useState({
    country: data.initials,
    date: "month",
  });

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
      console.log(responseData);
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
          console.log(responseData.default);
          responseData.default.timelineData.forEach((date) => {
            chartData.data.push(date.value[0]);
            chartData.dates.push(date.formattedTime);
          });
          datas = {
            labels: chartData.dates,
            datasets: [
              {
                label: chartData.dates,
                data: chartData.data,
                fill: true,
                borderColor: "rgb(46, 123, 255)",
                tension: 0.3,
                backgroundColor: "rgba(56, 97, 223, 0.39)",
              },
            ],
          };
        }

        let targetElement = pleaseWork.current;
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
            responsive: true,
            elements: {
              point: {
                radius: 0,
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
    console.log(event.target.value);
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
    setGraphTerms((oldTerms) => ({
      ...oldTerms,
      compare: compareInput,
    }));
    console.log(compareInput);
  }
  return (
    <div className={classes.root}>
      <Nav hideCountries={true} />
      <SearchForm />
      <div className={classes["selectors-container"]}>
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
        </form>
        <div className={classes.selectors}>
          <DateRange inputHandler={dateSelected} />
          <CountrySelector
            className={classes.inputs}
            onCountrySelect={countrySelected}
          />
        </div>
      </div>
      <div className={classes.graphContainer}>
        {(graphState === "loading" && <div>Loading...</div>) ||
          (graphState === "failed" && (
            <div className={classes["error-container"]}>
              <div>Oops! Something went wrong</div>
              <img
                className={classes["error-image"]}
                src={errorImage}
                alt="art by pch.vector on Freepik"
              />
            </div>
          ))}
        <canvas className={classes.graph} ref={pleaseWork}></canvas>
      </div>
    </div>
  );
};

export default TrendsPage;
