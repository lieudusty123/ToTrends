import React, { useEffect, useState } from "react";

const WordCloud = (props) => {
  const [mappedItems, setMappedItems] = useState([]);

  useEffect(() => {
    let map = [];
    function getHigh() {
      let highest = 0;
      for (const key in props.data) {
        if (props.data[key].value > highest) {
          highest = props.data[key].value;
        }
      }
      return highest;
    }

    let highestValue = getHigh();

    let colors = ["#F9D3AB", "#f4cc72", "#ffbe2d", "#ffb100", "gold"];

    for (const key in props.data) {
      let precentage = props.data[key].value / highestValue;
      let wordFontSize =
        50 * precentage > 15
          ? 50 * precentage
          : 15 + Math.floor(Math.random() * 3);

      map.push(
        <span
          style={{
            fontSize: `${wordFontSize}px`,
            padding: "5px",
            whiteSpace: "nowrap",
            textAlign: "center",
            fontWeight: "900",
            fontFamily: "Tahoma",
            color: `${colors[Math.floor(Math.random() * colors.length)]}`,
          }}
          key={props.data[key].name}
        >
          {props.data[key].name}
        </span>
      );
    }
    shuffle(map);
    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    }
    setMappedItems(map);
  }, [props.data]);

  return (
    <React.Fragment>
      <div
        style={{
          height: "100%",
          width: "100%",
          textAlign: "center",
          wordBreak: "break-all",
          wordWrap: "break-word",
          overflow: "hidden",
        }}
      >
        {mappedItems}
      </div>
    </React.Fragment>
  );
};
export default WordCloud;
