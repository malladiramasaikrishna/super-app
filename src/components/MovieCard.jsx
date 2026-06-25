import React from 'react';

const PLACEHOLDER = 'https://via.placeholder.com/300x450/1a1a2e/e0e0e0?text=No+Poster';

const MovieCard = ({ movie, onClick }) => {
  const handleImageError = (e) => {
    e.target.onerror = null; // prevent infinite loop
    e.target.src = PLACEHOLDER;
  };

  return (
    <div className="movie-card-wrapper" onClick={() => onClick(movie)}>
      <img 
        src={movie.poster || PLACEHOLDER} 
        alt={movie.title} 
        className="movie-card-poster" 
        loading="lazy"
        onError={handleImageError}
      />
      <div className="movie-card-title-overlay">
        <span className="movie-card-title-text">{movie.title}</span>
      </div>
    </div>
  );
};

export default MovieCard;
