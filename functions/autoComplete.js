const axios = require("axios");
const googleTrends = require("google-trends-api");

exports.handler = async (event, context) => {
  try {
    const passedKeyword = event.queryStringParameters.term;
    const data = await googleTrends.autoComplete(
      { keyword: passedKeyword },
      function (err, results) {
        if (err) {
          return err;
        } else {
          return results;
        }
      }
    );
    console.log(data);
    return {
      statusCode: 200,
      body: data,
    };
  } catch (error) {
    console.log("err", error);
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
