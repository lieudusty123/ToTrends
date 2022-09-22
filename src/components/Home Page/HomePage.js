import { Fragment, useEffect, useContext, useState } from "react";
import context from "../../contextAPI/context";
import Header from "./Header/Header";
import classes from "./homePageStyling/homePage.module.css";
import { v4 as uuidv4 } from "uuid";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import axios from "axios";

const HomePage = () => {
  const [stateData, setStateData] = useState(null);
  const data = useContext(context);
  let mappedItems = [];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `/.netlify/functions/dailyTrends?country=${data.initials}`
      );
      setStateData(response.data);
    };
    fetchData();
  }, [data.initials]);

  if (stateData) {
    console.log(stateData);
    let targetArr = [];
    if (stateData.default.trendingSearchesDays[0].trendingSearches.length < 3) {
      targetArr = stateData.default.trendingSearchesDays[1].trendingSearches;
    } else {
      targetArr = stateData.default.trendingSearchesDays[0].trendingSearches;
    }
    for (let index = 0; index < 3; index++) {
      let trafficNumber = targetArr[index].formattedTraffic.slice(0, -1);
      mappedItems.push(
        <div id={classes.card} className="card mb-3" key={uuidv4()}>
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={targetArr[index].image.imageUrl}
                className="img-fluid rounded-start"
                style={{ width: "100%", height: "100%" }}
                alt={targetArr[index].title.query}
              />
            </div>
            <div className="col-md-8 d-flex flex-column">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{targetArr[index].title.query}</h5>
                <p className="card-text">
                  {targetArr[index].articles[0].title
                    .replace(/(&quot;)/g, '"')
                    .replace(/(&#39;)/g, "'")}
                </p>
              </div>
              <div className="card-footer">{trafficNumber}</div>
            </div>
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
