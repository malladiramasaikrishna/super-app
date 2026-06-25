import React from 'react';

const categoryDetails = {
  Action: {
    color: 'var(--cat-action)',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80'
  },
  Drama: {
    color: 'var(--cat-drama)',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80'
  },
  Romance: {
    color: 'var(--cat-romance)',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80'
  },
  Thriller: {
    color: 'var(--cat-thriller)',
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80'
  },
  Western: {
    color: 'var(--cat-western)',
    image: 'https://images.unsplash.com/photo-1485125639709-a60c3a500bf1?auto=format&fit=crop&w=400&q=80'
  },
  Horror: {
    color: 'var(--cat-horror)',
    image: 'https://images.unsplash.com/photo-1505635339358-314175a4c330?auto=format&fit=crop&w=400&q=80'
  },
  Fantasy: {
    color: 'var(--cat-fantasy)',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'
  },
  Music: {
    color: 'var(--cat-music)',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'
  },
  Fiction: {
    color: 'var(--cat-fiction)',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
  }
};

const CategoryCard = ({ category, isSelected, onToggle }) => {
  const details = categoryDetails[category] || { color: '#333', image: '' };

  return (
    <div
      className={`category-card ${isSelected ? 'selected' : ''}`}
      style={{ backgroundColor: details.color }}
      onClick={() => onToggle(category)}
    >
      <h3 className="category-title">{category}</h3>
      <div className="category-img-container">
        {details.image && (
          <img src={details.image} alt={category} className="category-img" />
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
export { categoryDetails };
