import React, { useEffect, useRef } from "react";
import Nav from "./Nav";
import classes from "./HeaderStyling/header.module.css";
import SearchForm from "../../UI/SearchForm";

import image from "./HeaderStyling/sprites/main_page_bg.png";

const Header = () => {
  const typeWriterEle = useRef();

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
  return (
    <header
      style={{
        background: `url(${image}) rgba(234,243,250,255)`,
        backgroundPosition: "top right",
        backgroundSize: "70%",
        backgroundRepeat: "no-repeat",
      }}
      alt="art by pch.vector on Freepik"
    >
      <Nav />
      <SearchForm>
        <div className={classes["type-writer-container"]}>
          Explore the worlds current{" "}
          <span ref={typeWriterEle} className={classes["type-writer"]}></span>
          <span className={classes["flicker"]}></span>
        </div>
      </SearchForm>
    </header>
  );
};
export default Header;
