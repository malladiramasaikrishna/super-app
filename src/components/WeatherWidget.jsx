import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, Wind, Droplets, Gauge } from 'lucide-react';
import { fetchWeather } from '../services/weatherApi';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateTime, setDateTime] = useState(new Date());

  // Clock Effect (Update every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Weather based on Geolocation or default location
  useEffect(() => {
    const getWeather = async (lat, lon) => {
      setLoading(true);
      const data = await fetchWeather(lat, lon);
      setWeather(data);
      setLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use user's real location
          getWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocation blocked or error, using default New Delhi coordinates:', error);
          getWeather(); // Fallback to default
        }
      );
    } else {
      getWeather(); // Fallback to default if Geolocation not supported
    }
  }, []);

  const formatDateTimeStr = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const strTime = `${hours}:${minutes} ${ampm}`;
    
    return {
      date: `${month}-${day}-${year}`,
      time: strTime
    };
  };

  const { date: formattedDate, time: formattedTime } = formatDateTimeStr(dateTime);

  const getWeatherIcon = (type) => {
    const props = { strokeWidth: 1.5 };
    switch (type) {
      case 'sunny':
        return <Sun {...props} />;
      case 'cloudy':
        return <Cloud {...props} />;
      case 'rainy':
        return <CloudRain {...props} />;
      case 'windy':
        return <Wind {...props} />;
      case 'thunder':
        return <CloudRain {...props} color="#FFD700" />;
      default:
        return <Sun {...props} />;
    }
  };

  if (loading || !weather) {
    return (
      <div className="weather-widget skeleton" style={{ minHeight: '160px' }}>
        {/* Skeleton UI placeholder */}
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>
      <div className="weather-body">
        {/* Condition details */}
        <div className="weather-condition-col">
          <div className="weather-icon-wrapper">
            {getWeatherIcon(weather.type)}
          </div>
          <p className="weather-desc">{weather.condition}</p>
        </div>

        {/* Temperature & Pressure details */}
        <div className="weather-temp-col">
          <p className="weather-temp">{weather.temp}°C</p>
          <div className="weather-pressure-row">
            <Gauge size={16} />
            <span>{weather.pressure} mbar<br />Pressure</span>
          </div>
        </div>

        {/* Wind & Humidity details */}
        <div className="weather-stats-col">
          <div className="weather-stat-item">
            <Wind size={20} />
            <div className="weather-stat-details">
              <span className="weather-stat-val">{weather.wind} km/h</span>
              <span className="weather-stat-lbl">Wind</span>
            </div>
          </div>
          <div className="weather-stat-item">
            <Droplets size={20} />
            <div className="weather-stat-details">
              <span className="weather-stat-val">{weather.humidity}%</span>
              <span className="weather-stat-lbl">Humidity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
