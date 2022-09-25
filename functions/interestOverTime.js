const axios = require("axios");
const googleTrends = require("google-trends-api");

exports.handler = async (event, context) => {
  try {
    const country = event.queryStringParameters.country;
    const term = event.queryStringParameters.term;
    let currentDate = new Date();
    let date;
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
        break;
    }
    console.log("date", date);
    console.log("currentDate", currentDate);
    const data = await googleTrends.interestOverTime(
      {
        keyword: term,
        geo: country,
        startTime: date,
        endTime: currentDate,
      },
      function (err, results) {
        if (err) {
          returnedObj = {
            statusCode: 500,
            body: JSON.stringify(err),
          };
          return err;
        } else {
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
