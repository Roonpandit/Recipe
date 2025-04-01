import { useState } from 'react';
import '../styles/SearchForm.css';

const cuisineOptions = [
  'African', 'American', 'British', 'Cajun', 'Caribbean', 
  'Chinese', 'Eastern European', 'European', 'French', 'German', 
  'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 
  'Korean', 'Latin American', 'Mediterranean', 'Mexican', 
  'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 
  'Vietnamese'
];

const dietOptions = [
  'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
  'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal',
  'Low FODMAP', 'Whole30'
];

const typeOptions = [
  'main course', 'side dish', 'dessert', 'appetizer',
  'salad', 'bread', 'breakfast', 'soup', 'beverage',
  'sauce', 'marinade', 'fingerfood', 'snack', 'drink'
];

const SearchForm = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    cuisine: '',
    diet: '',
    type: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleClear = () => {
    setSearchParams({
      query: '',
      cuisine: '',
      diet: '',
      type: ''
    });
    onSearch({ query: '' });
  };

  return (
    <div className="search-form-container">
      <h2>Find a Recipe</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-main">
          <input
            type="text"
            name="query"
            value={searchParams.query}
            onChange={handleChange}
            placeholder="Search recipes..."
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </div>
        
        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="cuisine">Cuisine:</label>
            <select
              id="cuisine"
              name="cuisine"
              value={searchParams.cuisine}
              onChange={handleChange}
            >
              <option value="">Any Cuisine</option>
              {cuisineOptions.map(cuisine => (
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
              value={searchParams.diet}
              onChange={handleChange}
            >
              <option value="">Any Diet</option>
              {dietOptions.map(diet => (
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
              value={searchParams.type}
              onChange={handleChange}
            >
              <option value="">Any Type</option>
              {typeOptions.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            type="button" 
            className="clear-btn"
            onClick={handleClear}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm; 