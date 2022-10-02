import { Fragment, useEffect, useContext, useState } from "react";
import context from "../../contextAPI/context";
import Header from "./Header/Header";
import classes from "./homePageStyling/homePage.module.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const HomePage = () => {
  const [stateData, setStateData] = useState(null);
  const data = useContext(context);
  console.log(data.initials);
  let mappedItems = [];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `/.netlify/functions/dailyTrends?country=${data.initials}`
      );
      setStateData(response.data);
      console.log(response.data);
    };
    fetchData();
  }, [data.initials]);

  if (stateData) {
    let targetArr = [];
    if (stateData.default.trendingSearchesDays[0].trendingSearches.length < 3) {
      targetArr = stateData.default.trendingSearchesDays[1].trendingSearches;
    } else {
      targetArr = stateData.default.trendingSearchesDays[0].trendingSearches;
    }
    for (let index = 0; index < 4; index++) {
      let trafficNumber = targetArr[index].formattedTraffic.slice(0, -1);
      mappedItems.push(
        <div id={classes.card} className={classes.card} key={uuidv4()}>
          <div className={classes["card-header"]}>
            <img
              src={targetArr[index].image.imageUrl}
              alt={targetArr[index].title.query}
            />
          </div>
          <div className={classes["card-body"]}>
            <div className={classes["card-content"]}>
              <h4 className={classes["card-title"]}>
                {targetArr[index].title.query}
              </h4>
              <p className={classes["card-text"]}>
                {targetArr[index].articles[0].title
                  .replace(/(&quot;)/g, '"')
                  .replace(/(&#39;)/g, "'")}
              </p>
            </div>
            <div className={classes["card-footer"]}>{trafficNumber}</div>
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
