import React, { useEffect } from 'react';
import { X, Star, Calendar, Clock } from 'lucide-react';

const MovieModal = ({ movie, onClose }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Backdrop Section */}
        <div className="modal-backdrop-container">
          <img src={movie.backdrop} alt="" className="modal-backdrop" />
          <div className="modal-backdrop-fade" />
        </div>

        {/* Details Body Section */}
        <div className="modal-details-body">
          <div className="modal-poster-col">
            <img src={movie.poster} alt={movie.title} className="modal-poster" />
          </div>
          
          <div className="modal-info-col">
            <h2 className="modal-movie-title">{movie.title}</h2>
            
            <div className="modal-meta-row">
              <span className="modal-rating-badge">
                <Star size={14} style={{ display: 'inline', marginRight: '4px', fill: 'currentColor' }} />
                {movie.rating} / 10
              </span>
              
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={15} />
                {movie.releaseYear}
              </span>

              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={15} />
                {movie.duration}
              </span>
            </div>

            <h3 className="modal-overview-header">Overview</h3>
            <p className="modal-overview-text">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
