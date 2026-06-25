export const fetchWeather = async (lat = 28.6139, lon = 77.2090) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API request failed');
    const data = await response.json();
    
    const codeMap = {
      0: { text: 'Sunny', type: 'sunny' },
      1: { text: 'Partly Cloudy', type: 'cloudy' },
      2: { text: 'Partly Cloudy', type: 'cloudy' },
      3: { text: 'Overcast', type: 'cloudy' },
      45: { text: 'Foggy', type: 'windy' },
      48: { text: 'Depositing Fog', type: 'windy' },
      51: { text: 'Light Drizzle', type: 'rainy' },
      53: { text: 'Drizzle', type: 'rainy' },
      55: { text: 'Heavy Drizzle', type: 'rainy' },
      61: { text: 'Light Rain', type: 'rainy' },
      63: { text: 'Moderate Rain', type: 'rainy' },
      65: { text: 'Heavy rain', type: 'rainy' },
      71: { text: 'Light Snow', type: 'snowy' },
      73: { text: 'Snow', type: 'snowy' },
      75: { text: 'Heavy Snow', type: 'snowy' },
      80: { text: 'Light Showers', type: 'rainy' },
      81: { text: 'Rain Showers', type: 'rainy' },
      82: { text: 'Violent Showers', type: 'rainy' },
      95: { text: 'Thunderstorm', type: 'thunder' },
      96: { text: 'Thunderstorm with Hail', type: 'thunder' },
      99: { text: 'Thunderstorm with Heavy Hail', type: 'thunder' },
    };

    const current = data.current;
    const weatherInfo = codeMap[current.weather_code] || { text: 'Clear', type: 'sunny' };

    return {
      temp: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      wind: current.wind_speed_10m,
      pressure: Math.round(current.pressure_msl),
      condition: weatherInfo.text,
      type: weatherInfo.type,
    };
  } catch (error) {
    console.warn('Failed to fetch real-time weather, using mock data:', error);
    // mock data for testing 
    return {
      temp: 24,
      humidity: 83,
      wind: 3.7,
      pressure: 1010,
      condition: 'Heavy rain',
      type: 'rainy',
    };
  }
};
