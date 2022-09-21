import React, { Fragment, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { Chart } from "chart.js";
import context from "../../contextAPI/context";
import SearchForm from "../UI/SearchForm";
import { useLocation } from "react-router-dom";

const TrendsPage = (props) => {
  const data = useContext(context);
  const location = useLocation();
  const passedData = location.state;
  const pleaseWork = useRef();
  useEffect(() => {
    const fetchInterestOverTime = async () => {
      const response = await axios.get(
        `/.netlify/functions/interestOverTime?country=${data.initials}&term=${passedData.searchTerm}`
      );
      const responseData = await response.data;
      const chartData = {
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

      const targetElement = pleaseWork.current;
      const datas = {
        labels: chartData.dates,
        datasets: [
          {
            label: passedData.searchTerm,
            data: chartData.data,
            fill: false,
            borderColor: "rgb(46, 123, 255)",
            tension: 0.3,
          },
        ],
      };
      const config = {
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
      new Chart(targetElement, config);
    };
    fetchInterestOverTime();
  }, [passedData.searchTerm, data.initials]);
  return (
    <Fragment>
      <SearchForm />
      <canvas ref={pleaseWork}></canvas>
    </Fragment>
  );
};

export default TrendsPage;
