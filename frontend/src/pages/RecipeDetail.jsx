import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, saveRecipe, getSavedRecipes } from "../utils/api";
import "../styles/RecipeDetail.css";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const recipeData = await getRecipeById(id);
        setRecipe(recipeData);

        // Check if recipe is saved
        const savedRecipes = await getSavedRecipes();
        const foundInSaved = savedRecipes.some((r) => r.recipeId === id);
        setIsSaved(foundInSaved);
      } catch (error) {
        setError("Failed to fetch recipe details. Please try again later.");
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSaveRecipe = async () => {
    if (isSaved || saving) return;

    setSaving(true);
    try {
      await saveRecipe({
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving recipe:", error);
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    navigate(isSaved ? "/saved-recipes" : "/");
  };

  if (loading) {
    return (
      <div className="skeleton-loader">
        <div className="skeleton-title"></div>
        <div className="skeleton-image"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const cleanSummary = recipe.summary?.replace(/<\/?[^>]+(>|$)/g, "");
  const cleanInstructions = recipe.instructions?.replace(/<\/?[^>]+(>|$)/g, "");

  return (
    <div className="recipe-detail">
      <button className="back-btn" onClick={goBack}>
        Back
      </button>

      <div className="recipe-header">
        <h1>{recipe.title}</h1>
        <div className="recipe-actions">
          <button
            className={`save-btn ${isSaved ? "saved" : ""}`}
            onClick={handleSaveRecipe}
            disabled={isSaved || saving}
          >
            {saving ? "Saving..." : isSaved ? "Saved" : "Save Recipe"}
          </button>
        </div>
      </div>

      <div className="recipe-info">
        <div className="recipe-image">
          <img src={recipe.image} alt={recipe.title} />
          <div className="recipe-meta">
            <p>
              <strong>Ready in:</strong> {recipe.readyInMinutes} minutes
            </p>
            <p>
              <strong>Servings:</strong> {recipe.servings}
            </p>
            {recipe.dishTypes?.length > 0 && (
              <p>
                <strong>Dish Type:</strong> {recipe.dishTypes.join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="recipe-summary">
          <h2>Summary</h2>
          <p>{cleanSummary}</p>
        </div>
      </div>

      <div className="recipe-content">
        <div className="ingredients">
          <h2>Ingredients</h2>
          <ul>
            {recipe.extendedIngredients?.map((ingredient, index) => (
              <li key={`${ingredient.id}-${index}`}>{ingredient.original}</li>
            ))}
          </ul>
        </div>

        {cleanInstructions && (
          <div className="instructions">
            <h2>Instructions</h2>
            <p>{cleanInstructions}</p>
          </div>
        )}

        {recipe.analyzedInstructions?.length > 0 && (
          <div className="step-by-step">
            <h2>Step by Step</h2>
            <ol>
              {recipe.analyzedInstructions[0].steps.map((step) => (
                <li key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <span className="step-description">{step.step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {recipe.nutrition && (
          <div className="nutrition">
            <h2>Nutrition</h2>
            <div className="nutrition-facts">
              {recipe.nutrition.nutrients.slice(0, 8).map((nutrient) => (
                <div key={nutrient.name} className="nutrient">
                  <span className="nutrient-name">{nutrient.name}</span>
                  <span className="nutrient-value">
                    {nutrient.amount} {nutrient.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
