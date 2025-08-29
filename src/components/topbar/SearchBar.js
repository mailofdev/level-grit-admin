const SearchBar = () => (
  <form className="d-flex me-lg-3 my-2 my-lg-0" role="search">
    <input
      className="form-control me-2"
      type="search"
      placeholder="Search"
      aria-label="Search"
    />
    <button className="btn btn-outline-light" type="submit">
      Search
    </button>
  </form>
);

export default SearchBar;
