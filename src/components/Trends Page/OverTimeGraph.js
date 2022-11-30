import React, { useEffect, useState, useContext, useRef } from "react";
import classes from "./TrendsPageStyling/trendsPage.module.css";
import axios from "axios";
import context from "../../contextAPI/context";
import { Chart, registerables } from "chart.js";
let overTimeChart = {};
let avgGraphChart = {};

const OverTimeGraph = (props) => {
  Chart.register(...registerables);

  const [graphState, setGraphState] = useState("loading");
  const data = useContext(context);
  const graphRef = useRef();
  const avgRef = useRef();
  const graphTerms = props.graphTerms;

  // gets data and print to main graph
  useEffect(() => {
    let colorsOptions = [
      "#dc3912",
      "#ff9900",
      "#109618",
      "#990099",
      "#0099c6",
      "#dd4477",
      "#66aa00",
      "#b82e2e",
      "#316395",
      "#3366cc",
      "#994499",
      "#22aa99",
      "#aaaa11",
      "#6633cc",
      "#e67300",
      "#8b0707",
      "#651067",
      "#329262",
      "#5574a6",
      "#3b3eac",
      "#b77322",
      "#16d620",
      "#b91383",
      "#f4359e",
      "#9c5935",
      "#a9c413",
      "#2a778d",
      "#668d1c",
      "#bea413",
      "#0c5922",
      "#743411",
    ];
    let data = {};
    if (graphTerms.term) {
      async function fetchInterestOverTime() {
        if (overTimeChart.id !== undefined) {
          overTimeChart.destroy();
        }
        let fetchCallStr = "/.netlify/functions/interestOverTime?";
        let i = 0;
        for (let key in graphTerms) {
          if (i === 0) fetchCallStr += `${key}=${graphTerms[key]}`;
          else {
            fetchCallStr += `&${key}=${graphTerms[key]}`;
          }
          i++;
        }
        let response = await axios.get(fetchCallStr);
        data = await response.data;
        drawGraph(data);
        drawAvgGraph(data);
      }
      fetchInterestOverTime();
    }
    function drawGraph(responseData) {
      if (typeof responseData === "string") {
        overTimeChart = {};
        setGraphState("failed - unknown");
        return console.log(
          "Oops! something went wrong! you might wanna double-check your query.."
        );
      } else if (responseData.default.timelineData.length === 0) {
        overTimeChart = {};
        setGraphState("failed - no data");
        return console.log(responseData, "Not Enough Data ?");
      } else {
        setGraphState("success");
        let datas = {};
        let chartData = {
          dates: [],
          data: [],
        };
        let amountOfArrays = responseData.default.timelineData[0].value.length;
        for (let index = 1; index <= amountOfArrays; index++) {
          chartData.data.push([]);
        }
        responseData.default.timelineData.forEach((date) => {
          chartData.dates.push(date.formattedTime);
        });
        responseData.default.timelineData.forEach((date) => {
          date.value.forEach((innerValue, index) => {
            chartData.data[index].push(innerValue);
          });
        });
        let chartDatasets = [];
        chartData.data.forEach((data, index) => {
          chartDatasets.push({
            label: graphTerms.term[index],
            data: chartData.data[index],
            fill: true,
            borderColor: colorsOptions[index],
            tension: 0.3,
            backgroundColor: colorsOptions[index].concat("66"),
          });
        });
        datas = {
          labels: chartData.dates,
          datasets: chartDatasets,
        };

        let targetElement = graphRef.current;
        let config = {
          type: "line",
          data: datas,
          options: {
            scales: {
              y: {
                max: 100,
                min: 0,
                ticks: {
                  stepSize: 25,
                },
                grid: {
                  display: true,
                  color: "#FFFFFF",
                },
              },
              x: {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 5,
                },
                grid: {
                  display: true,
                  color: "#FFFFFF",
                },
              },
            },
            labels: {
              labelTextColor: "#FFFFFF",
            },
            maintainAspectRatio: false,
            responsive: true,
            elements: {
              point: {
                radius: 3,
              },
            },
          },
        };
        if (chartData.compareData === undefined) {
          config = {
            ...config,
            legend: {
              display: false,
            },
          };
        }
        Chart.defaults.color = () => "#FFF";
        overTimeChart = new Chart(targetElement, config);
      }
    }
    function drawAvgGraph(responseData) {
      if (avgGraphChart.id !== undefined) {
        avgGraphChart.destroy();
      }
      let values = [...responseData.default.averages];
      let colors = [];
      for (let index = 0; index < values.length; index++) {
        colors.push(colorsOptions[index]);
      }
      const data = {
        labels: graphTerms.term,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 1,
          },
        ],
      };
      const config = {
        type: "bar",
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          maintainAspectRatio: true,
          responsive: true,
        },
      };
      avgGraphChart = new Chart(avgRef.current, config);
    }
  }, [graphTerms]);

  return (
    <div className={classes.graphContainer}>
      {(graphState === "loading" && <div>Loading...</div>) ||
        (graphState.includes("failed") && (
          <div className={classes["error-container"]}>
            {graphState === "failed - unknown" && (
              <div style={{ color: "white" }}>
                Oops! Something went wrong...
              </div>
            )}
            {graphState === "failed - no data" && (
              <div style={{ color: "white" }}>
                There is not enough data collected on this term :(
              </div>
            )}
          </div>
        ))}
      {/* <canvas
        ref={avgRef}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.295)" }}
        id={classes["averages-graph"]}
      ></canvas> */}
      <canvas
        // className={classes.graph}
        ref={graphRef}
        id={classes["over-time-graph"]}
        style={{
          backgroundColor:
            graphState === "success" ? "rgba(0, 0, 0, 0.295)" : "transparent",
        }}
      ></canvas>
    </div>
  );
};

export default OverTimeGraph;
