const axios = require('axios');
const User = require('../models/User');

// Search recipes
exports.searchRecipes = async (req, res) => {
  try {
    const { query, cuisine, diet, type, number = 10, offset = 0 } = req.query;
    
    // Build API URL with parameters
    const url = `https://api.spoonacular.com/recipes/complexSearch`;
    
    // Set up query parameters
    const params = {
      apiKey: process.env.SPOONACULAR_API_KEY,
      query,
      cuisine,
      diet,
      type,
      number,
      offset,
      addRecipeInformation: true,
      fillIngredients: true
    };

    // Remove any undefined parameters
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) delete params[key];
    });

    // Make request to Spoonacular API
    const response = await axios.get(url, { params });
    
    res.status(200).json({
      success: true,
      results: response.data.results,
      totalResults: response.data.totalResults,
      offset: parseInt(offset),
      number: parseInt(number)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Build API URL
    const url = `https://api.spoonacular.com/recipes/${id}/information`;
    
    // Set up query parameters
    const params = {
      apiKey: process.env.SPOONACULAR_API_KEY,
      includeNutrition: true
    };

    // Make request to Spoonacular API
    const response = await axios.get(url, { params });
    
    res.status(200).json({
      success: true,
      recipe: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
};

// Get random recipes
exports.getRandomRecipes = async (req, res) => {
  try {
    const { number = 10, tags } = req.query;
    
    // Build API URL
    const url = `https://api.spoonacular.com/recipes/random`;
    
    // Set up query parameters
    const params = {
      apiKey: process.env.SPOONACULAR_API_KEY,
      number,
      tags
    };

    // Remove any undefined parameters
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) delete params[key];
    });

    // Make request to Spoonacular API
    const response = await axios.get(url, { params });
    
    res.status(200).json({
      success: true,
      recipes: response.data.recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
}; 