const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const { PassThrough } = require("stream");
const googleTrends = require("../../node_modules/google-trends-api");

app.use(cors());

app.listen(4000, () => {
  console.log(`Server is up and running on 4000 ...`);
});

app.get("/query", (req, res) => {
  async function getSentence() {
    let sentence = "";
    let rawdata = await fs.readFileSync("searches.json");
    let parsedData = await JSON.parse(rawdata);

    const num = await Math.floor(Math.random() * parsedData.sentences.length);
    console.log(parsedData);
    console.log(num);
    sentence = await parsedData.sentences[num];
    console.log(sentence);
    await kj(sentence);
  }
  getSentence();
  async function kj(sentence) {
    googleTrends.relatedQueries(
      {
        keyword: `${sentence}`,
      },
      function (err, results) {
        if (err) {
          console.log("if");
          console.log(err);
        } else {
          res.status(200).send(results);
        }
      }
    );
  }
});

app.get("/dailyTrends", (req, res) => {
  const currentDate = new Date();
  let desiredCountry = req.query.country;
  console.log(desiredCountry);
  console.log(
    new Date(
      `${currentDate.getFullYear()}-${currentDate.getUTCDate()}-${currentDate.getMonth()}`
    )
  );
  async function callAPI() {
    googleTrends.dailyTrends(
      {
        trendDate: `${currentDate.getFullYear()}-${currentDate.getUTCDate()}-${currentDate.getMonth()}`,
        geo: desiredCountry,
      },
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          console.log("inside", results);
          res.status(200).send(results);
        }
      }
    );
  }
  callAPI();
});

app.get("/interestOverTime", (req, res) => {
  googleTrends.interestOverTime(
    {
      keyword: "christmas",
      geo: "US",
      startTime: new Date("2004-01-01"),
      endTime: new Date("2022-01-01"),
      // endTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    function (err, results) {
      if (err) console.log("oh no error!", err);
      else res.status(200).send(results);
    }
  );
});
