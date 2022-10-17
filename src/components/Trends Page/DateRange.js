import TrendsPageClasses from "./TrendsPageStyling/trendsPage.module.css";

const DateRange = (props) => {
  return (
    <select
      className={TrendsPageClasses.inputs}
      onInput={(e) => props.inputHandler(e)}
      defaultValue="month"
    >
      <option value="week">Week</option>
      <option value="month">Month</option>
      <option value="year">Year</option>
      <option value="10-years">10 - years</option>
      <option value="2004-present">2004 - present</option>
    </select>
  );
};
export default DateRange;
