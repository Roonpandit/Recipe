import { useState } from "react";
import "../styles/SearchForm.css";

const cuisineOptions = [
  "African",
  "American",
  "British",
  "Cajun",
  "Caribbean",
  "Chinese",
  "Eastern European",
  "European",
  "French",
  "German",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Japanese",
  "Jewish",
  "Korean",
  "Latin American",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "Southern",
  "Spanish",
  "Thai",
  "Vietnamese",
];

const dietOptions = [
  "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Vegan",
  "Pescetarian",
  "Paleo",
  "Primal",
  "Low FODMAP",
  "Whole30",
];

const typeOptions = [
  "main course",
  "side dish",
  "dessert",
  "appetizer",
  "salad",
  "bread",
  "breakfast",
  "soup",
  "beverage",
  "sauce",
  "marinade",
  "fingerfood",
  "snack",
  "drink",
];

const SearchForm = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ cuisine: "", diet: "", type: "" });
  const [searchResults, setSearchResults] = useState(null);

  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ query: searchQuery });
  };

  const handleApplyFilters = () => {
    onSearch({ query: searchQuery, ...filters });
  };

  const handleClear = () => {
    setFilters({ cuisine: "", diet: "", type: "" });
    onSearch({ query: searchQuery, cuisine: "", diet: "", type: "" });
  };

  return (
    <div className="search-form-container">
      <h2>Find a Recipe</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-main">
          <input
            type="text"
            name="query"
            value={searchQuery}
            onChange={handleQueryChange}
            placeholder="Search recipes..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </div>

        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="cuisine">Cuisine:</label>
            <select
              id="cuisine"
              name="cuisine"
              value={filters.cuisine}
              onChange={handleFilterChange}
            >
              <option value="">Any Cuisine</option>
              {cuisineOptions.map((cuisine) => (
                <option key={cuisine} value={cuisine.toLowerCase()}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="diet">Diet:</label>
            <select
              id="diet"
              name="diet"
              value={filters.diet}
              onChange={handleFilterChange}
            >
              <option value="">Any Diet</option>
              {dietOptions.map((diet) => (
                <option key={diet} value={diet.toLowerCase()}>
                  {diet}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Any Type</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="clear-btn"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
          <button type="button" className="clear-btn" onClick={handleClear}>
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
