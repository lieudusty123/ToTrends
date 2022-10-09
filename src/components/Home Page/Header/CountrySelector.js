import TrendsPageClasses from "../../Trends Page/TrendsPageStyling/trendsPage.module.css";
import mainPageClasses from "./HeaderStyling/header.module.css";
import { useLocation } from "react-router-dom";

const CountrySelector = (props) => {
  const location = useLocation();
  return (
    <select
      className={
        location.pathname === "/"
          ? mainPageClasses["date-selector"]
          : TrendsPageClasses.inputs
      }
      onInput={(event) => props.onCountrySelect(event)}
      // defaultValue="world, World Wide"
    >
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
      <option value="GB, United Kingdom">United Kingdom</option>
      <option value="US, United States">United States</option>
      {/* <option value="world, World Wide">World Wide</option> */}
    </select>
  );
};
export default CountrySelector;
