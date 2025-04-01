import { useState, useEffect } from 'react';
import { getSavedRecipes, removeRecipe, updateRecipeOrder } from '../utils/api';
import DraggableRecipeCard from '../components/DraggableRecipeCard';
import '../styles/SavedRecipes.css';

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const savedRecipes = await getSavedRecipes();
      setRecipes(savedRecipes.sort((a, b) => a.order - b.order));
    } catch (error) {
      setError('Failed to fetch saved recipes. Please try again later.');
      console.error('Error fetching saved recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRecipe = async (recipeId) => {
    try {
      await removeRecipe(recipeId);
      // Update local state
      setRecipes(recipes.filter(recipe => recipe.recipeId !== recipeId));
    } catch (error) {
      console.error('Error removing recipe:', error);
      setError('Failed to remove recipe. Please try again.');
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => {
    setTargetIndex(index);
  };

  const handleDrop = async () => {
    if (draggedIndex === null || targetIndex === null || draggedIndex === targetIndex) {
      // Reset drag state
      setDraggedIndex(null);
      setTargetIndex(null);
      return;
    }

    // Create a copy of the recipes array
    const newRecipes = [...recipes];
    
    // Get the recipe that was dragged
    const draggedRecipe = newRecipes[draggedIndex];
    
    // Remove the dragged recipe from the array
    newRecipes.splice(draggedIndex, 1);
    
    // Insert the dragged recipe at the target index
    newRecipes.splice(targetIndex, 0, draggedRecipe);
    
    // Update the order property for each recipe
    const reorderedRecipes = newRecipes.map((recipe, index) => ({
      ...recipe,
      order: index
    }));
    
    // Update local state
    setRecipes(reorderedRecipes);
    
    // Reset drag state
    setDraggedIndex(null);
    setTargetIndex(null);
    
    // Prepare data for API call
    const orderData = reorderedRecipes.map(recipe => ({
      recipeId: recipe.recipeId.toString(),
      order: parseInt(recipe.order, 10)
    }));
    
    console.log("Sending recipe order data:", orderData);
    
    // Update order in the backend
    try {
      setSavingOrder(true);
      await updateRecipeOrder(orderData);
      setSavingOrder(false);
    } catch (error) {
      console.error('Error updating recipe order:', error);
      setError('Failed to save the new order. Your changes will be lost on refresh.');
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
