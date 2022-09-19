import { Fragment, useEffect, useContext, useState } from "react";
import context from "../../contextAPI/context";
import Header from "./Header/Header";
import classes from "./homePageStyling/homePage.module.scss";
import { v4 as uuidv4 } from "uuid";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import Chart from "chart.js/auto";
const HomePage = () => {
  const [stateData, setStateData] = useState(null);
  const data = useContext(context);
  let mappedItems = [];
  const fetchInterestOverTime = async () => {
    const response = await axios.get(
      `/.netlify/functions/interestOverTime?country=${data.initials}`
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

    const targetElement = document.querySelector("#here");
    console.log(chartData);
    const datas = {
      labels: chartData.dates,
      datasets: [
        {
          label: "My First Dataset",
          data: chartData.data,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
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
    const chart = new Chart(targetElement, config);
  };
  useEffect(() => {
    fetchInterestOverTime();
  }, []);
  const fetchData = async () => {
    const response = await axios.get(
      `/.netlify/functions/dailyTrends?country=${data.initials}`
    );
    setStateData(response.data);
  };
  useEffect(() => {
    fetchData();
  }, [data]);

  if (stateData) {
    let targetArr = [];
    if (stateData.default.trendingSearchesDays[0].trendingSearches.length < 3) {
      targetArr = stateData.default.trendingSearchesDays[1].trendingSearches;
    } else {
      targetArr = stateData.default.trendingSearchesDays[0].trendingSearches;
    }
    console.log(stateData);
    console.log(targetArr);
    for (let index = 0; index < 3; index++) {
      mappedItems.push(
        <div className="card" style={{ width: 18 + "rem" }} key={uuidv4()}>
          <img
            src={targetArr[index].image.imageUrl}
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">{targetArr[index].title.query}</h5>
            <p className="card-text">{targetArr[index].formattedTraffic}</p>
          </div>
        </div>
      );
    }
  }

  return (
    <Fragment>
      <Header />
      <div id={classes["card-container"]}>
        {mappedItems.length === 0 ? "Loading..." : mappedItems}
      </div>
    </Fragment>
  );
};
export default HomePage;
