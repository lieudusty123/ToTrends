import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import classes from "./HeaderStyling/header.module.css";
import homePageClasses from "../homePageStyling/homePage.module.css";
import SearchForm from "../../UI/SearchForm";
import ReactWordcloud from "react-wordcloud";
import arrowImage from "./HeaderStyling/sprites/up-arrow-svgrepo-com.svg";
import image1 from "./HeaderStyling/sprites/2308.jpg";

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
        let currentText = typeWriterEle.current.innerHTML;
        typeWriterEle.current.innerHTML = currentText.slice(
          0,
          currentText.length - 1
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
    colors: ["#F9D3AB", "#f4cc72", "#ffbe2d", "#ffb100", "gold"],
    enableTooltip: false,
    deterministic: true,
    fontFamily: "Tahoma",
    fontSizes: [20, 40],
    fontStyle: "normal",
    fontWeight: "900",
    padding: 2,
    rotations: 1,
    rotationAngles: [0],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000,
  };
  function scrollToCards() {
    document
      .querySelector(`#${homePageClasses["card-container"]}`)
      .scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header
      alt="art by pch.vector on Freepik"
      ref={headerRef}
      style={{
        backgroundImage: `url(${image1})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        boxShadow: "inset 0 4px 5px -5px rgba(0,0,72,255)",
      }}
    >
      <Nav />
      <div id={classes["header-content"]}>
        {props.wordCloud && (
          <div className={classes["word-cloud-wrapper"]}>
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

      {props.areCardsShown && displayArrow && (
        <button
          onClick={scrollToCards}
          id={classes["jump-to-section"]}
          style={{
            background: `url(${arrowImage}) rgba(116,153,241,255)`,
            backgroundSize: "30%",
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
