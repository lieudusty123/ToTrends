import { Fragment, useEffect, useContext, useState } from "react";
import context from "../../contextAPI/context";
import Header from "./Header/Header";
import classes from "./homePageStyling/homePage.module.scss";
import { v4 as uuidv4 } from "uuid";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
// import Chart from "chart.js/auto";
const HomePage = () => {
  const [stateData, setStateData] = useState(null);
  const data = useContext(context);
  let mappedItems = [];
  // useEffect(() => {
  // const chartData = {
  //   dates: [],
  //   data: [],
  // };
  //   fetch(`http://localhost:4000/interestOverTime`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data.default);
  //       let index = 0;
  //       data.default.timelineData.forEach((date) => {
  //         if (date.value[0] > 50) {
  //           if (data.default.timelineData[index].value[0] < 10) {
  //             chartData.data.push(data.default.timelineData[index].value[0]);
  //           }
  //         }
  //         chartData.data.push(date.value[0]);
  //         chartData.dates.push(date.formattedTime);
  //         index++;
  //       });
  //     })
  //     .then(() => {
  //       const targetElement = document.querySelector("#here");
  //       console.log(chartData);
  //       const datas = {
  //         labels: chartData.dates,
  //         datasets: [
  //           {
  //             label: "My First Dataset",
  //             data: chartData.data,
  //             fill: false,
  //             borderColor: "rgb(75, 192, 192)",
  //             tension: 0.1,
  //           },
  //         ],
  //       };

  //       const config = {
  //         type: "line",
  //         data: datas,
  //         options: {
  //           scales: {
  //             y: {
  //               max: 100,
  //               min: 0,
  //               ticks: {
  //                 stepSize: 25,
  //               },
  //             },
  //             x: {
  //               ticks: {
  //                 autoSkip: true,
  //                 maxTicksLimit: 5,
  //               },
  //             },
  //           },
  //         },
  //       };
  //       const chart = new Chart(targetElement, config);
  //     });
  // }, []);

  useEffect(() => {
    const initials = data.initials;
    fetch(`http://localhost:4000/dailyTrends/?country=${initials}`)
      .then((res) => res.json())
      .then((data) => {
        setStateData(data);
      });
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
