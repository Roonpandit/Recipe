const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use. Please use a different email or login'
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ 
      $or: [{ username }, { name: username }]
    });
    
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken. Please choose a different username'
      });
    }

    // Use username for both fields for new users
    const userData = {
      username,
      name: username, // Add name field as well for backward compatibility
      email,
      password
    };

    // Create new user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    // Convert to plain object for response
    const userResponse = user.toObject();

    console.log('Registration successful for:', {
      email,
      username
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please login with your credentials',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different ${field}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please check your email or register a new account'
      });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Failed login attempt for email: ${email} - Invalid password`);
      return res.status(401).json({
        success: false,
        message: 'Wrong password. Please try again with the correct password.'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;
    
    // Convert to plain object for field normalization
    const userResponse = user.toObject();
    
    // Handle old database with name instead of username
    if (!userResponse.username && userResponse.name) {
      userResponse.username = userResponse.name;
    }

    console.log('Login successful, sending user data:', {
      id: userResponse._id,
      username: userResponse.username,
      name: userResponse.name
    });

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later'
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    // Ensure we get all user fields by explicitly selecting them
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create response user object with normalized fields
    const userResponse = user.toObject();
    
    // If the document has name but not username, use name as username
    if (!userResponse.username && userResponse.name) {
      userResponse.username = userResponse.name;
    }

    console.log('User data being sent:', {
      id: userResponse._id,
      username: userResponse.username,
      name: userResponse.name,
      savedRecipesCount: userResponse.savedRecipes?.length || 0
    });

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving user data'
    });
  }
}; 