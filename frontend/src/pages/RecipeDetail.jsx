import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, saveRecipe, getSavedRecipes } from '../utils/api';
import '../styles/RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecipeDetails();
    checkIfSaved();
  }, [id]);

  const fetchRecipeDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const recipeData = await getRecipeById(id);
      setRecipe(recipeData);
    } catch (error) {
      setError('Failed to fetch recipe details. Please try again later.');
      console.error('Error fetching recipe details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const savedRecipes = await getSavedRecipes();
      const isSavedRecipe = savedRecipes.some(recipe => recipe.recipeId === id);
      setIsSaved(isSavedRecipe);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveRecipe = async () => {
    if (isSaved || saving) return;

    setSaving(true);
    try {
      await saveRecipe({
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary
      });
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="loading">Loading recipe details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  // Create clean summary and instructions by removing HTML tags
  const cleanSummary = recipe.summary?.replace(/<\/?[^>]+(>|$)/g, "");
  const cleanInstructions = recipe.instructions?.replace(/<\/?[^>]+(>|$)/g, "");

  return (
    <div className="recipe-detail">
      <button className="back-btn" onClick={goBack}>Back</button>
      
      <div className="recipe-header">
        <h1>{recipe.title}</h1>
        <div className="recipe-actions">
          <button 
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveRecipe}
            disabled={isSaved || saving}
          >
            {saving ? 'Saving...' : isSaved ? 'Saved' : 'Save Recipe'}
          </button>
        </div>
      </div>
      
      <div className="recipe-info">
        <div className="recipe-image">
          <img src={recipe.image} alt={recipe.title} />
          <div className="recipe-meta">
            <p><strong>Ready in:</strong> {recipe.readyInMinutes} minutes</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>
            {recipe.dishTypes && recipe.dishTypes.length > 0 && (
              <p><strong>Dish Type:</strong> {recipe.dishTypes.join(', ')}</p>
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
            {recipe.extendedIngredients && recipe.extendedIngredients.map(ingredient => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
        </div>
        
        {cleanInstructions && (
          <div className="instructions">
            <h2>Instructions</h2>
            <p>{cleanInstructions}</p>
          </div>
        )}
        
        {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 && (
          <div className="step-by-step">
            <h2>Step by Step</h2>
            <ol>
              {recipe.analyzedInstructions[0].steps.map(step => (
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
              {recipe.nutrition.nutrients.slice(0, 8).map(nutrient => (
                <div key={nutrient.name} className="nutrient">
                  <span className="nutrient-name">{nutrient.name}</span>
                  <span className="nutrient-value">{nutrient.amount} {nutrient.unit}</span>
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