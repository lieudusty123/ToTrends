import { useContext } from "react";
import context from "../../../contextAPI/context";
import classes from "./HeaderStyling/header.module.scss";
import logo from "./HeaderStyling/sprites/AA012.jpg";

const Nav = () => {
  const data = useContext(context);
  function countrySelected(event) {
    data.changeCountry({
      name: event.target.value.substring(event.target.value.indexOf(",") + 2),
      initials: event.target.value.substring(0, 2),
    });
  }
  return (
    <nav id={classes.nav}>
      <img src={logo} alt="logo" />
      <select onInput={countrySelected}>
        <option value="AR, Argentina">Argentina</option>
        <option value="AU, Australia">Australia</option>
        <option value="AT, Austria">Austria</option>
        <option value="BE, Belgium">Belgium</option>
        <option value="BR, Brazil">Brazil</option>
        <option value="CA, Canada">Canada</option>
        <option value="DK, Denmark">Denmark</option>
        <option value="FI, Finland">Finland</option>
        <option value="FR, France">France</option>
        <option value="DE, Germany">Germany</option>
        <option value="GR, Greece">Greece</option>
        <option value="HU, Hungary">Hungary</option>
        <option value="IS, Iceland">Iceland</option>
        <option value="IE, Ireland">Ireland</option>
        <option value="IL, Israel">Israel</option>
        <option value="IT, Italy">Italy</option>
        <option value="JP, Japan">Japan</option>
        <option value="KR, Korea">Korea</option>
        <option value="MX, Mexico">Mexico</option>
        <option value="NL, Netherlands">Netherlands</option>
        <option value="NZ, New Zealand">New Zealand</option>
        <option value="NO, Norway">Norway</option>
        <option value="PL, Poland">Poland</option>
        <option value="PT, Portugal">Portugal</option>
        <option value="RO, Romania">Romania</option>
        <option value="RU, Russia">Russia</option>
        <option value="SA, Saudi Arabia">Saudi Arabia</option>
        <option value="SG, Singapore">Singapore</option>
        <option value="SE, Sweden">Sweden</option>
        <option value="CH, Switzerland">Switzerland</option>
        <option value="TH, Thailand">Thailand</option>
        <option value="TR, Turkey">Turkey</option>
        <option value="UA, Ukraine">Ukraine</option>
        <option value="AE, United Arab Emirates">United Arab Emirates</option>
        <option value="GB, United Kingdom">United Kingdom</option>
        <option value="US, United States" selected>
          United States
        </option>
      </select>
    </nav>
  );
};
export default Nav;
