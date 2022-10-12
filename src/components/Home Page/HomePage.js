import { Fragment, useEffect, useContext, useState } from "react";
import context from "../../contextAPI/context";
import Header from "./Header/Header";
import classes from "./homePageStyling/homePage.module.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import placeHolderImage from "./homePageStyling/sprites/placeholder.png";

const HomePage = () => {
  const data = useContext(context);
  const [stateData, setStateData] = useState(null);
  const [wordCloudData, setWordCloudData] = useState([]);
  const [mappedItems, setMappedItems] = useState([]);

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

  useEffect(() => {
    if (stateData) {
      createCards();
    }
    function createCards() {
      let todayArr = stateData.default.trendingSearchesDays[0].trendingSearches;
      let yesterdayArr;
      stateData.default.trendingSearchesDays.length > 1
        ? (yesterdayArr =
            stateData.default.trendingSearchesDays[1].trendingSearches)
        : (yesterdayArr = []);
      let targetArr = [];
      if (todayArr.length < 8 && todayArr.length < yesterdayArr.length) {
        targetArr = yesterdayArr;
      } else {
        targetArr = todayArr;
      }

      let wordCloudDataObj = [];
      targetArr.forEach((element) => {
        let traffic;
        if (
          element.formattedTraffic[element.formattedTraffic.length - 2] === "M"
        )
          traffic = +element.formattedTraffic.slice(0, -2) * 1000000;
        else if (
          element.formattedTraffic[element.formattedTraffic.length - 2] === "K"
        )
          traffic = +element.formattedTraffic.slice(0, -2) * 1000;
        else traffic = +element.formattedTraffic.slice(0, -2);
        wordCloudDataObj.push({
          text: element.title.query,
          value: traffic,
        });
      });
      setWordCloudData(wordCloudDataObj);

      let mapTemp = [];
      for (let index = 0; index <= targetArr.length - 1; index++) {
        let trafficNumber = targetArr[index].formattedTraffic.slice(0, -1);

        mapTemp.push(
          <div id={classes.card} className={classes.card} key={uuidv4()}>
            <div className={classes["card-header"]}>
              <img
                src={
                  targetArr[index].image.imageUrl
                    ? targetArr[index].image.imageUrl
                    : placeHolderImage
                }
                alt={targetArr[index].title.query}
              />
            </div>
            <div className={classes["card-body"]}>
              <div className={classes["card-content"]}>
                <h4 className={classes["card-title"]}>
                  {targetArr[index].title.query}
                </h4>
                <p
                  className={classes["card-text"]}
                  style={{
                    textAlign: data.initials === "IL" ? "right" : "left",
                  }}
                >
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
      setMappedItems(mapTemp);
    }
  }, [stateData, data.initials]);

  return (
    <Fragment>
      <Header wordCloud={wordCloudData} />
      <div id={classes["card-container"]}>
        {mappedItems.length === 0 ? "Loading..." : mappedItems}
      </div>
    </Fragment>
  );
};
export default HomePage;
