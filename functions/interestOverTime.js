const axios = require("axios");
const googleTrends = require("google-trends-api");

exports.handler = async (event, context) => {
  try {
    const country = event.queryStringParameters.country;
    const term = event.queryStringParameters.term;
    const compare = event.queryStringParameters.compare;
    let currentDate = new Date();
    let date;
    let searchQuery = term;
    if (typeof compare === "string") {
      searchQuery = [term, compare];
    }
    switch (event.queryStringParameters.date) {
      case "week":
        date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getUTCDate() - 7
        );
        break;
      case "month":
        date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          currentDate.getUTCDate()
        );
        break;
      case "year":
        date = new Date(
          currentDate.getFullYear() - 1,
          currentDate.getMonth(),
          currentDate.getUTCDate()
        );
        break;
      case "10-years":
        date = new Date(
          currentDate.getFullYear() - 10,
          currentDate.getMonth(),
          currentDate.getUTCDate()
        );
      case "2004-present":
        date = new Date("2004-01-01");
        break;
    }
    let obj = {};
    if (country === "world") {
      obj = {
        keyword: searchQuery,
        startTime: date,
        endTime: currentDate,
      };
    } else {
      obj = {
        keyword: searchQuery,
        startTime: date,
        endTime: currentDate,
        ...(country && { geo: country }),
      };
    }

    console.log("date", date);
    console.log("currentDate", currentDate);
    console.log(obj);
    const data = await googleTrends.interestOverTime(
      obj,
      function (err, results) {
        if (err) {
          console.log(err);
          return err;
        } else {
          console.log("resultsresultsresultsresults", results);
          return results;
        }
      }
    );
    return {
      statusCode: 200,
      body: data,
    };
  } catch (error) {
    console.log("err", error);
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
