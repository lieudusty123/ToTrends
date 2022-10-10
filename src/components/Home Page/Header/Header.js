import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import classes from "./HeaderStyling/header.module.css";
import SearchForm from "../../UI/SearchForm";
import ReactWordcloud from "react-wordcloud";
import arrowImage from "./HeaderStyling/sprites/up-arrow-svgrepo-com.svg";

const Header = (props) => {
  const typeWriterEle = useRef();
  const headerRef = useRef();
  const [displayArrow, setDisplayArrow] = useState(true);
  if (displayArrow) {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setDisplayArrow(false);
      }
    });
  }
  useEffect(() => {
    let i = 0;
    var txtArr = ["trends", "events", "searches", "stories"]; /* The text */
    let currentWord = 0;
    var speed = 100;

    async function typeWriter() {
      if (i < txtArr[currentWord].length) {
        typeWriterEle.current.innerHTML += txtArr[currentWord].charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else if (currentWord < txtArr.length - 1) {
        await sleep(1000);
        setTimeout(removeTypeWriter, speed);
      } else {
        await sleep(1000);
        setTimeout(removeTypeWriter, speed);
      }
    }
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    function removeTypeWriter() {
      if (i > 0) {
        let pleaseWork = typeWriterEle.current.innerHTML;
        typeWriterEle.current.innerHTML = pleaseWork.slice(
          0,
          pleaseWork.length - 1
        );
        i--;
        setTimeout(removeTypeWriter, speed);
      } else {
        if (txtArr[currentWord] === txtArr[txtArr.length - 1]) {
          setTimeout(typeWriter, speed);
          currentWord = 0;
          i = 0;
        } else {
          setTimeout(typeWriter, speed);
          currentWord++;
          i = 0;
        }
      }
    }
    typeWriter();
  }, []);

  const options = {
    colors: ["#FFF7E5", "#F9D3AB", "#f4cc72", "#ffbe2d", "#ffb100"],
    enableTooltip: false,
    deterministic: true,
    fontFamily: "impact",
    fontSizes: [40, 80],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 2,
    rotations: 1,
    rotationAngles: [0],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000,
  };
  function please() {
    document
      .querySelector("#homePage_card-container__qfB3e")
      .scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header alt="art by pch.vector on Freepik" ref={headerRef}>
      <Nav />
      <div id={classes["header-content"]}>
        {props.wordCloud && (
          <div
            className={classes["word-cloud-wrapper"]}
            style={{ width: "80%", height: "100%" }}
          >
            <ReactWordcloud options={options} words={props.wordCloud} />
          </div>
        )}

        <SearchForm>
          <div className={classes["type-writer-container"]}>
            Explore the current{" "}
            <span ref={typeWriterEle} className={classes["type-writer"]}></span>
            <span className={classes["flicker"]}></span>
          </div>
        </SearchForm>
      </div>

      {displayArrow && (
        <button
          onClick={please}
          id={classes["jump-to-section"]}
          style={{
            background: `url(${arrowImage}) #0b6783`,
            backgroundSize: "50%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            transform: "rotate(180deg)",
          }}
        />
      )}
    </header>
  );
};
export default Header;
