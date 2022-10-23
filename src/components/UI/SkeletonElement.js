import React from "react";
import classes from "./styling/skeleton.module.css";
import { v4 as uuidv4 } from "uuid";

const SkeletonElement = () => {
  const firstRow = [];
  const secondRow = [];
  const thirdRow = [];
  let colors = ["#F9D3AB", "#f4cc72", "#ffbe2d", "#ffb100", "gold"];
  let nums = [2, 3, 4];
  for (let index = 0; index <= 23; index++) {
    if (index < 7) {
      firstRow.push(
        <div
          key={uuidv4()}
          className={classes.wordCloudItem}
          style={{
            width: `${nums[Math.floor(Math.random() * nums.length)]}vw`,
            backgroundColor: `${
              colors[Math.floor(Math.random() * colors.length)]
            }`,
          }}
        ></div>
      );
    } else if (index < 17) {
      secondRow.push(
        <div
          key={uuidv4()}
          className={classes.wordCloudItem}
          style={{
            width: `${nums[Math.floor(Math.random() * nums.length)]}vw`,
            backgroundColor: `${
              colors[Math.floor(Math.random() * colors.length)]
            }`,
          }}
        ></div>
      );
    } else {
      thirdRow.push(
        <div
          key={uuidv4()}
          className={classes.wordCloudItem}
          style={{
            width: `${nums[Math.floor(Math.random() * nums.length)]}vw`,
            backgroundColor: `${
              colors[Math.floor(Math.random() * colors.length)]
            }`,
          }}
        ></div>
      );
    }
  }
  return (
    <div className={classes.wordCloud}>
      <div className={classes.wordCloudRow}>{firstRow}</div>
      <div className={classes.wordCloudRow}>{secondRow}</div>
      <div className={classes.wordCloudRow}>{thirdRow}</div>
    </div>
  );
};
export default SkeletonElement;
