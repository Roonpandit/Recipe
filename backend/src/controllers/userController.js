const User = require('../models/User');

// Save recipe to user's saved recipes
exports.saveRecipe = async (req, res) => {
  try {
    const { recipeId, title, image, summary } = req.body;
    const userId = req.user._id;

    // Check if recipe is already saved
    const user = await User.findById(userId);
    const alreadySaved = user.savedRecipes.some(recipe => recipe.recipeId === recipeId);

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already saved'
      });
    }

    // Get the highest order number from saved recipes
    const highestOrder = user.savedRecipes.length > 0 
      ? Math.max(...user.savedRecipes.map(recipe => recipe.order)) 
      : -1;
    
    // Add recipe to saved recipes with incremented order
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          savedRecipes: {
            recipeId,
            title,
            image,
            summary,
            order: highestOrder + 1
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove recipe from user's saved recipes
exports.removeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user._id;

    // First, pull the recipe to be removed
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          savedRecipes: { recipeId }
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Reorder remaining recipes
    const updatedRecipes = [...user.savedRecipes]
      .sort((a, b) => a.order - b.order)
      .map((recipe, index) => {
        const recipeObj = recipe.toObject ? recipe.toObject() : {...recipe};
        recipeObj.order = index;
        return recipeObj;
      });

    // Update with reordered recipes
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { savedRecipes: updatedRecipes } },
      { new: true, runValidators: false }
    );

    console.log("Successfully removed recipe and reordered remaining recipes");

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error removing recipe:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing recipe'
    });
  }
};

// Get user's saved recipes
exports.getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    const savedRecipes = user.savedRecipes.sort((a, b) => a.order - b.order);

    res.status(200).json({
      success: true,
      savedRecipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update recipe order
exports.updateRecipeOrder = async (req, res) => {
  try {
    const { recipes } = req.body;
    
    console.log("Received update order request:", {
      body: req.body,
      userPresent: !!req.user,
      recipesArray: Array.isArray(recipes),
      recipesLength: recipes?.length
    });

    // Validate recipes array
    if (!recipes || !Array.isArray(recipes)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected an array of recipes.'
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const userId = req.user._id;
    console.log("Finding user with ID:", userId);

    // Get the user's current saved recipes
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log("User found, saved recipes count:", user.savedRecipes.length);

    // Create a map of recipeId to order for quick lookup
    const orderMap = new Map();
    recipes.forEach(recipe => {
      if (!recipe.recipeId) {
        console.warn("Recipe without recipeId detected:", recipe);
      } else {
        orderMap.set(recipe.recipeId.toString(), parseInt(recipe.order, 10));
      }
    });

    // Create a copy of the saved recipes with updated orders
    const updatedRecipes = user.savedRecipes.map(recipe => {
      const recipeObj = recipe.toObject ? recipe.toObject() : recipe;
      const recipeId = recipeObj.recipeId.toString();
      
      if (orderMap.has(recipeId)) {
        recipeObj.order = orderMap.get(recipeId);
      }
      
      return recipeObj;
    });

    // Use findByIdAndUpdate to avoid validation issues with required fields
    const result = await User.findByIdAndUpdate(
      userId,
      { $set: { savedRecipes: updatedRecipes } },
      { new: true, runValidators: false }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update user'
      });
    }

    console.log("Successfully updated recipe order");
    
    res.status(200).json({
      success: true,
      savedRecipes: result.savedRecipes.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    console.error('Error updating recipe order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating recipe order'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user._id;
    
    // Check if username is provided
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if username already exists (for another user)
    const existingUser = await User.findOne({ 
      $or: [
        { username, _id: { $ne: userId } },
        { name: username, _id: { $ne: userId } }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    // Update user profile with both fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        username,
        name: username, // Update name field as well for backward compatibility
        email 
      },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Convert to plain object for response
    const userResponse = updatedUser.toObject();

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
}; 