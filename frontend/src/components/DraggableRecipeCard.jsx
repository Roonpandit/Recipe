import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/DraggableRecipeCard.css";

const DraggableRecipeCard = ({
  recipe,
  index,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const { recipeId, title, image, summary } = recipe;
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const cleanSummary = summary ? summary.replace(/<\/?[^>]+(>|$)/g, "") : "";

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setIsDragging(true);
    onDragStart(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    onDragOver(index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onDrop();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="drag">
      <div
        className={`draggable-recipe-card ${isDragging ? "dragging" : ""}`}
        ref={dragRef}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        <div className="drag-handle">
          <span className="drag-icon">☰</span>
        </div>
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
            <Link to={`/recipe/${recipeId}`} className="view-btn">
              View Details
            </Link>
            <button className="remove-btn" onClick={() => onRemove(recipeId)}>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableRecipeCard;
