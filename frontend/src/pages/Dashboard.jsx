import { useState, useEffect } from "react";
import {
  searchRecipes,
  getRandomRecipes,
  saveRecipe,
  getSavedRecipes,
} from "../utils/api";
import SearchForm from "../components/SearchForm";
import RecipeCard from "../components/RecipeCard";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    number: 12,
    totalResults: 0,
  });

  useEffect(() => {
    fetchRandomRecipes();
    fetchSavedRecipes();
  }, []);

  const fetchRandomRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const randomRecipes = await getRandomRecipes({ number: 12 });
      setRecipes(randomRecipes);
      setSearchPerformed(false);
    } catch (error) {
      setError("Failed to fetch recipes. Please try again later.");
      console.error("Error fetching random recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const savedRecipes = await getSavedRecipes();
      const ids = savedRecipes.map((recipe) => recipe.recipeId);
      setSavedRecipeIds(ids);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    }
  };

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError("");
    try {
      const params = {
        ...searchParams,
        offset: 0,
        number: 10,
      };

      const result = await searchRecipes(params);
      setRecipes(result.results);
      setPagination({
        offset: result.offset,
        number: result.number,
        totalResults: result.totalResults,
      });
      setSearchPerformed(true);
    } catch (error) {
      setError("Failed to search recipes. Please try again later.");
      console.error("Error searching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      await saveRecipe({
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
      });

      setSavedRecipeIds((prev) => [...prev, recipe.id.toString()]);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const handleLoadMore = async () => {
    if (loading || !searchPerformed) return;

    setLoading(true);
    try {
      const newOffset = pagination.offset + pagination.number;
      const params = {
        query: recipes.length > 0 ? recipes[0].query : "",
        cuisine: recipes.length > 0 ? recipes[0].cuisine : "",
        diet: recipes.length > 0 ? recipes[0].diet : "",
        type: recipes.length > 0 ? recipes[0].type : "",
        offset: newOffset,
        number: pagination.number,
      };

      const result = await searchRecipes(params);
      setRecipes((prev) => [...prev, ...result.results]);
      setPagination({
        offset: newOffset,
        number: result.number,
        totalResults: result.totalResults,
      });
    } catch (error) {
      setError("Failed to load more recipes. Please try again later.");
      console.error("Error loading more recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <SearchForm onSearch={handleSearch} />

      <div className="recipes-container">
        <h2>{searchPerformed ? "Search Results" : "Popular Recipes"}</h2>

        {error && <div className="error-message">{error}</div>}

        {loading && recipes.length === 0 ? (
          <div className="recipe-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton-recipe-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-button"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {recipes.length === 0 ? (
              <div className="no-recipes">
                No recipes found. Try different search criteria.
              </div>
            ) : (
              <div className="recipe-grid">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSave={handleSaveRecipe}
                    isSaved={savedRecipeIds.includes(recipe.id.toString())}
                  />
                ))}
              </div>
            )}

            {searchPerformed &&
              pagination.offset + pagination.number <
                pagination.totalResults && (
                <div className="load-more">
                  <button
                    className="load-more-btn"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
