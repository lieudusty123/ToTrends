const DateRange = (props) => {
  return (
    <select onInput={(e) => props.inputHandler(e)}>
      <option value="week">Week</option>
      <option value="month" selected>
        Month
      </option>
      <option value="year">Year</option>
      <option value="10-years">10 - years</option>
      <option value="2004-present">2004 - present</option>
    </select>
  );
};
export default DateRange;
