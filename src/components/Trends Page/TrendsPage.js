import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import context from "../../contextAPI/context";
import SearchForm from "../UI/SearchForm";
import { useLocation } from "react-router-dom";
import classes from "./TrendsPageStyling/trendsPage.module.css";
import DateRange from "./DateRange";

let chart = {};
const TrendsPage = (props) => {
  Chart.register(...registerables);
  const data = useContext(context);
  const location = useLocation();
  const pleaseWork = useRef();
  const [graphState, setGraphState] = useState("loading");
  // const [graphData, setGraphData] = useState();
  const [dataRange, setDataRange] = useState("week");
  let searchTerm = "";
  function getInfoFromUrl() {
    const lastIndex = location.pathname.lastIndexOf("/");
    searchTerm = location.pathname.slice(lastIndex + 1);
  }
  getInfoFromUrl();
  useEffect(() => {
    const fetchInterestOverTime = async () => {
      if (chart.id !== undefined) {
        chart.destroy();
      }
      const response = await axios.get(
        `/.netlify/functions/interestOverTime?country=${data.initials}&term=${searchTerm}&date=${dataRange}`
      );

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
        // when reciving valid response
        setGraphState("success");
        let chartData = {
          dates: [],
          data: [],
        };

        console.log(responseData.default.timelineData);
        responseData.default.timelineData.forEach((date) => {
          chartData.data.push(date.value[0]);
          chartData.dates.push(date.formattedTime);
        });
        let targetElement = pleaseWork.current;
        let datas = {
          labels: chartData.dates,
          datasets: [
            {
              label: searchTerm,
              data: chartData.data,
              fill: true,
              borderColor: "rgb(46, 123, 255)",
              tension: 0.3,
              backgroundColor: "rgba(56, 97, 223, 0.39)",
            },
          ],
        };
        let config = {
          type: "line",
          data: datas,
          options: {
            plugins: {
              legend: {
                display: false,
              },
            },
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
        // setGraphData(config);
        chart = new Chart(targetElement, config);
      }
    };
    fetchInterestOverTime();
  }, [searchTerm, data.initials, dataRange]);
  function dateSelected(e) {
    setDataRange(e.target.value);
  }
  return (
    <div className={classes.root}>
      <SearchForm />
      <div className={classes.graphContainer}>
        {(graphState === "loading" && <div>Loading...</div>) ||
          (graphState === "failed" && <div>Oops! Something went wrong</div>)}
        <canvas className={classes.graph} ref={pleaseWork}></canvas>
      </div>
      <DateRange inputHandler={dateSelected} />
    </div>
  );
};

export default TrendsPage;
