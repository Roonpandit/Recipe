import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect for login/register endpoints when they return 401
    const isAuthEndpoint = 
      error.config && 
      (error.config.url.includes('/auth/login') || 
       error.config.url.includes('/auth/register'));
    
    if (error.response && error.response.status === 401 && !isAuthEndpoint) {
      console.log('Session expired, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  try {
    console.log('Attempting login with:', { email: credentials.email });
    const response = await api.post('/auth/login', credentials);
    console.log('Login response received:', response.status);
    return response.data;
  } catch (error) {
    console.error('Login API error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await api.get('/auth/me');
    console.log('User data received from API:', response.data);
    
    if (!response.data || !response.data.user) {
      console.error('Invalid user data received:', response.data);
      throw new Error('Invalid user data received');
    }

    if (!response.data.user.username) {
      console.warn('Username missing in user data:', response.data.user);
    }
    
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Recipes
export const searchRecipes = async (params) => {
  const response = await api.get('/recipes/search', { params });
  return response.data;
};

export const getRecipeById = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data.recipe;
};

export const getRandomRecipes = async (params) => {
  const response = await api.get('/recipes/random', { params });
  return response.data.recipes;
};

// User Recipes
export const getSavedRecipes = async () => {
  const response = await api.get('/users/recipes');
  return response.data.savedRecipes;
};

export const saveRecipe = async (recipeData) => {
  const response = await api.post('/users/recipes', recipeData);
  return response.data;
};

export const removeRecipe = async (recipeId) => {
  const response = await api.delete(`/users/recipes/${recipeId}`);
  return response.data;
};

export const updateRecipeOrder = async (recipes) => {
  try {
    // Validate recipes array
    if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
      throw new Error('Invalid recipes data for reordering');
    }
    
    // Ensure all recipes have recipeId and order
    const validRecipes = recipes.filter(r => r.recipeId && r.order !== undefined);
    
    if (validRecipes.length !== recipes.length) {
      console.warn('Some recipes were filtered out due to missing data', {
        original: recipes.length,
        valid: validRecipes.length
      });
    }
    
    if (validRecipes.length === 0) {
      throw new Error('No valid recipes to reorder');
    }
    
    const response = await api.put('/users/recipes/order', { 
      recipes: validRecipes 
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating recipe order:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}; 