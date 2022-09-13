import classes from "../Home Page/Header/HeaderStyling/header.module.scss";
const SearchForm = (props) => {
  function handleSubmit(event) {
    event.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      {props.children}
      <div id={classes.form}>
        <input type="text" />
        <button>Submit</button>
      </div>
    </form>
  );
};
export default SearchForm;
