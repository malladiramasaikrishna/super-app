import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import CategoryCard from '../components/CategoryCard';

const CATEGORIES_LIST = [
  'Action', 'Drama', 'Romance',
  'Thriller', 'Western', 'Horror',
  'Fantasy', 'Music', 'Fiction'
];

const Categories = () => {
  const navigate = useNavigate();
  const { selectedCategories, toggleCategory, removeCategory } = useStore();
  const [showError, setShowError] = useState(false);

  const handleToggle = (category) => {
    toggleCategory(category);
    // If we select a new category and now we have >= 3, clear error
    setShowError(false);
  };

  const handleRemove = (category) => {
    removeCategory(category);
  };

  const handleNext = () => {
    if (selectedCategories.length < 3) {
      setShowError(true);
    } else {
      setShowError(false);
      navigate('/dashboard');
    }
  };

  return (
    <div className="categories-page">
      {/* Left Column - Details & Selection Pills */}
      <div className="categories-left">
        <div className="categories-left-header">
          <h1 className="app-logo">Super app</h1>
          <h2 className="categories-title">Choose your entertainment category</h2>
          
          <div className="selected-tags-container">
            {selectedCategories.map((category) => (
              <div key={category} className="selected-tag">
                {category}
                <button onClick={() => handleRemove(category)}>X</button>
              </div>
            ))}
          </div>
        </div>

        {selectedCategories.length < 3 && showError && (
          <div className="categories-error-container">
            <AlertTriangle className="categories-error-icon" />
            <span>Minimum 3 category required</span>
          </div>
        )}
      </div>

      {/* Right Column - 3x3 Grid of Categories */}
      <div className="categories-right">
        <div className="categories-grid">
          {CATEGORIES_LIST.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              isSelected={selectedCategories.includes(category)}
              onToggle={handleToggle}
            />
          ))}
        </div>
        
        <button className="next-page-btn" onClick={handleNext}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Categories;
export { CATEGORIES_LIST };
