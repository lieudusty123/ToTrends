const axios = require("axios");
const googleTrends = require("google-trends-api");

exports.handler = async (event, context) => {
  try {
    const country = event.queryStringParameters.country;
    const data = await googleTrends.interestOverTime(
      {
        keyword: "christmas",
        geo: country,
        startTime: new Date("2004-01-01"),
        endTime: new Date("2022-01-01"),
        // endTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
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
