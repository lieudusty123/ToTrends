import { Fragment, useEffect, useContext, useState } from "react";
import context from "../../contextAPI/context";
import Header from "./Header/Header";
import classes from "./homePageStyling/homePage.module.scss";
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
    let targetArr = [];
    if (stateData.default.trendingSearchesDays[0].trendingSearches.length < 3) {
      targetArr = stateData.default.trendingSearchesDays[1].trendingSearches;
    } else {
      targetArr = stateData.default.trendingSearchesDays[0].trendingSearches;
    }
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
