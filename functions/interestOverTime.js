const axios = require("axios");
const googleTrends = require("google-trends-api");

exports.handler = async (event, context) => {
  try {
    const country = event.queryStringParameters.country;
    const term = event.queryStringParameters.term;
    const data = await googleTrends.interestOverTime(
      {
        keyword: term,
        geo: country,
        startTime: new Date("2021-01-01"),
        endTime: new Date(Date.now()),
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
