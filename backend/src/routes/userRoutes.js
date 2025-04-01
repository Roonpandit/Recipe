const express = require('express');
const { 
  saveRecipe, 
  removeRecipe, 
  getSavedRecipes, 
  updateRecipeOrder,
  updateProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// User profile routes
router.put('/profile', updateProfile);

// Save recipe route
router.post('/recipes', saveRecipe);

// Get saved recipes route
router.get('/recipes', getSavedRecipes);

// Remove recipe route
router.delete('/recipes/:recipeId', removeRecipe);

// Update recipe order route
router.put('/recipes/order', updateRecipeOrder);

module.exports = router; 