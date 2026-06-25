import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import WeatherWidget from '../components/WeatherWidget';
import NewsWidget from '../components/NewsWidget';
import NotesWidget from '../components/NotesWidget';
import TimerWidget from '../components/TimerWidget';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, selectedCategories } = useStore();

  const handleBrowseMovies = () => {
    navigate('/movies');
  };

  // Safe check if user is not loaded yet
  const displayUser = user || {
    name: 'KK Vinay',
    username: 'vinay060',
    email: 'Vinay090@gmail.com',
    mobile: '1234567890'
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-grid">
        
        {/* Left Area (User Details & Weather) */}
        <div className="dashboard-left-col">
          {/* User Profile Widget */}
          <div className="user-widget">
            <div className="user-avatar-container">
              <img 
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&q=80" 
                alt="User Avatar" 
                className="user-avatar"
              />
            </div>
            <div className="user-info">
              <p className="user-fullname">{displayUser.name}</p>
              <p className="user-email">{displayUser.email}</p>
              <h2 className="user-username">{displayUser.username}</h2>
              <div className="user-tags-grid">
                {selectedCategories.map((category) => (
                  <span key={category} className="user-tag">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <WeatherWidget />
        </div>

        {/* Middle Area (Notes) */}
        <div className="dashboard-middle-col">
          <NotesWidget />
        </div>

        {/* Right Area (News) */}
        <div className="dashboard-right-col">
          <NewsWidget />
        </div>

        {/* Timer Area (Stretches across Left and Middle) */}
        <div style={{ gridColumn: '1 / span 2' }}>
          <TimerWidget />
        </div>

      </div>

      {/* Footer / Browse Button */}
      <div className="dashboard-footer">
        <button className="browse-movies-btn" onClick={handleBrowseMovies}>
          Browse
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
