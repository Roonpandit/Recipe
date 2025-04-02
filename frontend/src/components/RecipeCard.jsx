import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/RecipeCard.css";

const RecipeCard = ({ recipe, onSave, isSaved }) => {
  const { id, title, image, summary } = recipe;
  const [isLoading, setIsLoading] = useState(true);

  const cleanSummary = summary ? summary.replace(/<\/?[^>]+(>|$)/g, "") : "";

  return (
    <div className="recipe-card">
      <div className="recipe-image">
        {isLoading && <div className="skeleton-loader"></div>}
        <img
          src={image}
          alt={title}
          onLoad={() => setIsLoading(false)}
          style={{ display: isLoading ? "none" : "block" }}
        />
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{title}</h3>
        <p className="recipe-summary">
          {cleanSummary.length > 150
            ? `${cleanSummary.substring(0, 150)}...`
            : cleanSummary}
        </p>
        <div className="recipe-actions">
          <Link to={`/recipe/${id}`} className="view-btn">
            View Details
          </Link>
          {onSave && (
            <button
              className={`save-btn ${isSaved ? "saved" : ""}`}
              onClick={() => onSave(recipe)}
              disabled={isSaved}
            >
              {isSaved ? "Saved" : "Save Recipe"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
