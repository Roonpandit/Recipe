import { useState, useEffect } from "react";
import { getSavedRecipes, removeRecipe, updateRecipeOrder } from "../utils/api";
import DraggableRecipeCard from "../components/DraggableRecipeCard";
import "../styles/SavedRecipes.css";

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const savedRecipes = await getSavedRecipes();
      setRecipes(savedRecipes.sort((a, b) => a.order - b.order));
    } catch (error) {
      setError("Failed to fetch saved recipes. Please try again later.");
      console.error("Error fetching saved recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRecipe = async (recipeId) => {
    try {
      await removeRecipe(recipeId);
      setRecipes(recipes.filter((recipe) => recipe.recipeId !== recipeId));
    } catch (error) {
      console.error("Error removing recipe:", error);
      setError("Failed to remove recipe. Please try again.");
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => {
    setTargetIndex(index);
  };

  const handleDrop = async () => {
    if (
      draggedIndex === null ||
      targetIndex === null ||
      draggedIndex === targetIndex
    ) {
      setDraggedIndex(null);
      setTargetIndex(null);
      return;
    }

    const newRecipes = [...recipes];

    const draggedRecipe = newRecipes[draggedIndex];

    newRecipes.splice(draggedIndex, 1);

    newRecipes.splice(targetIndex, 0, draggedRecipe);

    const reorderedRecipes = newRecipes.map((recipe, index) => ({
      ...recipe,
      order: index,
    }));

    setRecipes(reorderedRecipes);

    setDraggedIndex(null);
    setTargetIndex(null);

    const orderData = reorderedRecipes.map((recipe) => ({
      recipeId: recipe.recipeId.toString(),
      order: parseInt(recipe.order, 10),
    }));

    console.log("Sending recipe order data:", orderData);

    try {
      setSavingOrder(true);
      await updateRecipeOrder(orderData);
      setSavingOrder(false);
    } catch (error) {
      console.error("Error updating recipe order:", error);
      setError(
        "Failed to save the new order. Your changes will be lost on refresh."
      );
      setSavingOrder(false);
    }
  };

  return (
    <div className="saved-recipes">
      <h1>My Saved Recipes</h1>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading saved recipes...</div>
      ) : (
        <>
          {recipes.length === 0 ? (
            <div className="no-saved-recipes">
              <p>You haven't saved any recipes yet.</p>
              <p>Search for recipes and save them to see them here.</p>
            </div>
          ) : (
            <>
              <div className="drag-instructions">
                <p>Drag and drop recipes to reorder them.</p>
              </div>
              {savingOrder && (
                <div className="saving-message">Saving new order...</div>
              )}
            </>
          )}

          <div className="saved-recipes-list">
            {recipes.map((recipe, index) => (
              <DraggableRecipeCard
                key={recipe.recipeId}
                recipe={recipe}
                index={index}
                onRemove={handleRemoveRecipe}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SavedRecipes;
