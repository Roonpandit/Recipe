# Interactive Recipe Application

A full-stack web application that allows users to search for recipes, view details, and save their favorite recipes with drag-and-drop reordering functionality.

## Features

- User authentication (register, login, logout)
- Search for recipes with filters (cuisine, diet, type)
- View detailed recipe information (ingredients, instructions, nutrition)
- Save favorite recipes
- Drag and drop interface for reordering saved recipes
- Responsive design for all screen sizes

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Axios for API calls
- RESTful API design

### Frontend
- React.js with React Router
- CSS for styling (no frameworks)
- Axios for API calls
- Drag and drop functionality

## API Integration
- Integrates with Spoonacular API for recipe data

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB database
- Spoonacular API key

### Installation

1. Clone the repository
```
git clone https://github.com/your-username/recipe-app.git
cd recipe-app
```

2. Install dependencies
```
npm run setup
```

4. Run the application
```
# Start backend
npm run start:backend

# In a separate terminal, start frontend
npm run start:frontend
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── backend/               # Backend source code
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   └── routes/        # API routes
│   ├── .env               # Environment variables
│   └── server.js          # Main server file
│
├── frontend/              # Frontend source code
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # CSS styles
│   │   └── utils/         # Utility functions
│   ├── .env               # Frontend environment variables
│   └── vite.config.js     # Vite configuration
│
└── package.json           # Root package.json with scripts
```

## Features

1. **User Authentication**
   - Register, login, and logout functionality
   - JWT-based authentication
   - Protected routes

2. **Recipe Search**
   - Search by keywords, cuisine, diet, and meal type
   - View recipe details including ingredients, instructions, and nutrition information

3. **Recipe Management**
   - Save favorite recipes
   - Remove saved recipes
   - Drag and drop to reorder saved recipes
   - Order is persisted in database

## License
This project is licensed under the MIT License 