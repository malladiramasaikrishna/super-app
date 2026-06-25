import React, { useState, useEffect } from 'react';
import { fetchNews } from '../services/newsApi';

const NewsWidget = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      const data = await fetchNews();
      setNews(data);
      setLoading(false);
    };

    getNews();
  }, []);

  if (loading || !news) {
    return (
      <div className="news-widget skeleton" style={{ height: '100%', minHeight: '300px' }}>
      
      </div>
    );
  }

  return (
    <div className="news-widget">
      <div className="news-image-container">
        <img src={news.imageUrl} alt={news.title} className="news-image" />
        <div className="news-headline-overlay">
          <h2 className="news-title">{news.title}</h2>
          <span className="news-date">{news.publishedAt}</span>
        </div>
      </div>
      <div className="news-body-container">
        <p className="news-body-text">{news.description}</p>
      </div>
    </div>
  );
};

export default NewsWidget;
