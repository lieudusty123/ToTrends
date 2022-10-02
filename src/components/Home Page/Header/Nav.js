import CountrySelector from "./CountrySelector";
import classes from "./HeaderStyling/header.module.scss";

import { useContext } from "react";
import context from "../../../contextAPI/context";
import { useNavigate } from "react-router-dom";

const Nav = (props) => {
  const data = useContext(context);
  const navigate = useNavigate();
  function countrySelected(event) {
    if (event.target.value === "world") {
    }
    data.changeCountry({
      name: event.target.value.substring(event.target.value.indexOf(",") + 2),
      initials: event.target.value.substring(0, 2),
    });
  }
  return (
    <nav
      id={classes.nav}
      onClick={() => {
        navigate(`/`);
      }}
    >
      <div>Home</div>
      {!props.hideCountries && (
        <CountrySelector onCountrySelect={countrySelected} />
      )}
    </nav>
  );
};
export default Nav;
