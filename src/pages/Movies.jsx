import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fetchMoviesByCategory } from '../services/movieApi';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';

const Movies = () => {
  const navigate = useNavigate();
  const { selectedCategories, omdbApiKey, setOmdbApiKey } = useStore();
  
  const [moviesMap, setMoviesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeMovie, setActiveMovie] = useState(null);
  
  // Custom API key configs
  const [apiKeyInput, setApiKeyInput] = useState(omdbApiKey || '');
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Sync state if omdbApiKey changes elsewhere
  useEffect(() => {
    setApiKeyInput(omdbApiKey || '');
  }, [omdbApiKey]);

  // Load movies from live API (reacts dynamically to category changes and API key changes!)
  useEffect(() => {
    const loadAllMovies = async () => {
      setLoading(true);
      const results = {};
      try {
        const fetchPromises = selectedCategories.map(async (category) => {
          // Pass user OMDb key dynamically
          const data = await fetchMoviesByCategory(category, omdbApiKey);
          return { category, data };
        });

        const responses = await Promise.all(fetchPromises);
        responses.forEach(({ category, data }) => {
          results[category] = data;
        });

        setMoviesMap(results);
      } catch (error) {
        console.error('Error loading live movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategories.length > 0) {
      loadAllMovies();
    }
  }, [selectedCategories, omdbApiKey]);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleMovieClick = (movie) => {
    setActiveMovie(movie);
  };

  const handleCloseModal = () => {
    setActiveMovie(null);
  };

  return (
    <div className="movies-page">
      {/* Header bar */}
      <header className="movies-header">
        <h1 className="movies-header-logo" onClick={handleLogoClick}>Super app</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Dynamic OMDb API Key Input Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowKeyInput(!showKeyInput)}
              style={{
                backgroundColor: omdbApiKey ? 'rgba(114, 219, 115, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                border: omdbApiKey ? '1px solid var(--color-green)' : '1px solid rgba(255, 255, 255, 0.15)',
                color: omdbApiKey ? 'var(--color-green)' : 'var(--color-white)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              🔑 {omdbApiKey ? 'Live OMDb Active' : 'Set Custom OMDb Key'}
            </button>
            
            {showKeyInput && (
              <div style={{
                position: 'absolute',
                top: '45px',
                right: '0',
                backgroundColor: '#1f1f1f',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '1rem',
                zIndex: '100',
                width: '280px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                  OMDb API KEY
                </span>
                <input
                  type="text"
                  placeholder="Paste your OMDb API Key"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  style={{
                    backgroundColor: '#111',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    padding: '0.55rem',
                    color: 'white',
                    fontSize: '0.85rem',
                    outline: 'none',
                    width: '100%'
                  }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setOmdbApiKey(apiKeyInput.trim());
                      setShowKeyInput(false);
                    }}
                    style={{
                      flex: '1',
                      backgroundColor: 'var(--color-green)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Save Key
                  </button>
                  <button
                    onClick={() => {
                      setApiKeyInput('');
                      setOmdbApiKey('');
                      setShowKeyInput(false);
                    }}
                    style={{
                      backgroundColor: '#555',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 0.75rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="movies-header-avatar-container" onClick={handleLogoClick} title="Go to Dashboard">
            <img 
              src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&q=80" 
              alt="Profile Avatar" 
              className="movies-header-avatar"
            />
          </div>
        </div>
      </header>

      {/* Main content subtitle */}
      <h2 className="movies-subtitle">Entertainment according to your choice</h2>

      {/* Movies Rows */}
      <div className="movies-content-container">
        {selectedCategories.map((category) => {
          const movies = moviesMap[category] || [];

          return (
            <div key={category} className="movies-row">
              <h3 className="movies-row-category-title">{category}</h3>
              <div className="movies-grid-row">
                {loading ? (
                  // Render 4 skeleton placeholder cards per row
                  Array.from({ length: 4 }).map((_, index) => (
                    <div 
                      key={index} 
                      className="movie-card-wrapper skeleton" 
                      style={{ border: 'none' }}
                    />
                  ))
                ) : movies.length > 0 ? (
                  movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={handleMovieClick}
                    />
                  ))
                ) : (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    No movies found in this category.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Movie Detail Modal Overlay */}
      {activeMovie && (
        <MovieModal
          movie={activeMovie}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Movies;
