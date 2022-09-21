import React, { useContext, useEffect, useRef } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import context from "../../contextAPI/context";
import SearchForm from "../UI/SearchForm";
import { useLocation } from "react-router-dom";
import classes from "./TrendsPageStyling/trendsPage.module.css";

let chart = {};
const TrendsPage = (props) => {
  Chart.register(...registerables);
  const data = useContext(context);
  const location = useLocation();
  const pleaseWork = useRef();
  let searchTerm = "";
  getInfoFromUrl();
  function getInfoFromUrl() {
    const lastIndex = location.pathname.lastIndexOf("/");
    searchTerm = location.pathname.slice(lastIndex + 1);
    console.log(searchTerm);
    console.log(location);
  }
  getInfoFromUrl();

  useEffect(() => {
    const fetchInterestOverTime = async () => {
      if (chart.id !== undefined) {
        chart.destroy();
      }
      const response = await axios.get(
        `/.netlify/functions/interestOverTime?country=${data.initials}&term=${searchTerm}`
      );
      console.log(response);
      const responseData = await response.data;
      if (
        typeof responseData === "string" ||
        responseData.default.timelineData.length === 0
      ) {
        return console.log(
          "Oops! something went wrong! you might wanna double-check your query.."
        );
      } else {
        let chartData = {
          dates: [],
          data: [],
        };
        let index = 0;
        responseData.default.timelineData.forEach((date) => {
          if (date.value[0] > 50) {
            if (responseData.default.timelineData[index].value[0] < 10) {
              chartData.data.push(
                responseData.default.timelineData[index].value[0]
              );
            }
          }
          chartData.data.push(date.value[0]);
          chartData.dates.push(date.formattedTime);
          index++;
        });

        let targetElement = pleaseWork.current;
        let datas = {
          labels: chartData.dates,
          datasets: [
            {
              label: searchTerm,
              data: chartData.data,
              fill: false,
              borderColor: "rgb(46, 123, 255)",
              tension: 0.3,
            },
          ],
        };
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
          },
        };
        chart = new Chart(targetElement, config);
      }
    };
    fetchInterestOverTime();
  }, [searchTerm, data.initials]);
  return (
    <div className={classes.root}>
      <SearchForm />
      <div className={classes.graphContainer}>
        <canvas className={classes.graph} ref={pleaseWork}>
          {chart.id === undefined && <div>something is fucked</div>}
        </canvas>
      </div>
    </div>
  );
};

export default TrendsPage;
