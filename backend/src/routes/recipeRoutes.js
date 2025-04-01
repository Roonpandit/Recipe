const express = require('express');
const { searchRecipes, getRecipeById, getRandomRecipes } = require('../controllers/recipeController');

const router = express.Router();

// Search recipes route
router.get('/search', searchRecipes);

// Get random recipes route
router.get('/random', getRandomRecipes);

// Get recipe by ID route
router.get('/:id', getRecipeById);

module.exports = router; 