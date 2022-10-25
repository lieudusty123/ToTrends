import React, { useEffect, useState } from "react";

const WordCloud = (props) => {
  const [mappedItems, setMappedItems] = useState([]);

  useEffect(() => {
    let map = [];
    function getHigh() {
      let highest = 0;
      let items;
      for (const key in props.data) {
        if (props.data[key].value > highest) {
          highest = props.data[key].value;
          items = props.data[key];
        }
      }
      return { highestValue: highest, item: items };
    }

    let { highestValue } = getHigh();
    let { item } = getHigh();

    let colors = ["#F9D3AB", "#f4cc72", "#ffbe2d", "#ffb100", "gold"];
    let highestDiv;
    for (const key in props.data) {
      let precentage = props.data[key].value / highestValue;
      let wordFontSize =
        30 * precentage > 10
          ? 30 * precentage
          : 10 + Math.floor(Math.random() * 10);
      if (props.data[key] !== item) {
        map.push(
          <span
            style={{
              fontSize: `${wordFontSize}px`,
              paddingInline: "10px",
              paddingBlock: `${Math.floor(Math.random() * 10)}px)`,
              display: "inline-block",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontWeight: "900",
              fontFamily: "Tahoma",
              color: `${colors[Math.floor(Math.random() * colors.length)]}`,
              transform: `translate(${Math.floor(
                Math.random() * 10
              )}px, ${Math.floor(Math.random() * 10)}px)`,
            }}
            key={props.data[key].name}
          >
            {props.data[key].name}
          </span>
        );
      } else {
        highestDiv = (
          <span
            style={{
              fontSize: `${wordFontSize}px`,
              paddingInline: "10px",
              paddingBlock: `${Math.floor(Math.random() * 10)}px)`,
              display: "inline-block",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontWeight: "900",
              fontFamily: "Tahoma",
              color: `gold`,
              transform: `translate(${Math.floor(
                Math.random() * 10
              )}px, ${Math.floor(Math.random() * 10)}px)`,
            }}
            key={props.data[key].name}
          >
            {props.data[key].name}
          </span>
        );
      }
    }

    let middleIndex = map.indexOf(map[Math.round((map.length - 1) / 2)]);
    map.splice(middleIndex, 0, highestDiv);
    setMappedItems(map);
  }, [props.data]);

  return (
    <React.Fragment>
      <div
        style={{
          maxHeight: "100%",
          maxWidth: "100%",
          textAlign: "center",
          wordBreak: "break-all",
          wordWrap: "break-word",
          overflow: "visible",
        }}
      >
        {mappedItems}
      </div>
    </React.Fragment>
  );
};
export default WordCloud;
