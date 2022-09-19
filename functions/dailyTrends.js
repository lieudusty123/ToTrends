const axios = require("axios");
const googleTrends = require("google-trends-api");

exports.handler = async (event, context) => {
  try {
    const country = event.queryStringParameters.country;
    console.log("inside if");
    const currentDate = new Date();
    const data = await googleTrends.dailyTrends(
      {
        trendDate: `${currentDate.getFullYear()}-${currentDate.getUTCDate()}-${currentDate.getMonth()}`,
        geo: country,
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
