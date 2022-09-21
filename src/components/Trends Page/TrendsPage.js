import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import context from "../../contextAPI/context";
import SearchForm from "../UI/SearchForm";
import { useLocation } from "react-router-dom";

let chart = {};
const TrendsPage = (props) => {
  Chart.register(...registerables);
  const data = useContext(context);
  const location = useLocation();
  const pleaseWork = useRef();
  let searchTerm = "";
  getInfoFromUrl();
  function getInfoFromUrl() {
    console.log(location);
    const lastIndex = location.pathname.lastIndexOf("/");
    searchTerm = location.pathname.slice(lastIndex + 1);
    console.log(searchTerm);
  }
  getInfoFromUrl();

  useEffect(() => {
    const fetchInterestOverTime = async () => {
      if (chart.id !== undefined) {
        console.log("inside");
        chart.destroy();
        console.log("chart", chart);
      }
      console.log(chart);
      console.log(data.initials);
      console.log(searchTerm);
      const response = await axios.get(
        `/.netlify/functions/interestOverTime?country=${data.initials}&term=${searchTerm}`
      );
      const responseData = await response.data;

      let chartData = {
        dates: [],
        data: [],
      };
      let index = 0;
      console.log(responseData);
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
        },
      };
      chart = new Chart(targetElement, config);
      console.log(chart);
    };
    fetchInterestOverTime();
  }, [searchTerm, data.initials]);
  return (
    <Fragment>
      <SearchForm />
      <canvas ref={pleaseWork}></canvas>
    </Fragment>
  );
};

export default TrendsPage;
