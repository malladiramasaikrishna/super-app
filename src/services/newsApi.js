export const fetchNews = async () => {
  try {
    // Fetching from Saurav.tech NewsAPI mirror for general Indian/Global top headlines
    const url = 'https://saurav.tech/NewsAPI/top-headlines/category/general/us.json';
    const response = await fetch(url);
    if (!response.ok) throw new Error('News API request failed');
    const data = await response.json();
    
    if (data.articles && data.articles.length > 0) {
      // Pick a random article or the first article with an image and description
      const article = data.articles.find(a => a.urlToImage && a.description && a.title) || data.articles[0];
      return {
        title: article.title,
        description: article.description || article.content || 'No details available.',
        imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toLocaleString() : new Date().toLocaleString(),
      };
    }
    throw new Error('No articles found');
  } catch (error) {
    console.warn('Failed to fetch real-time news, using mock data:', error);
    // Return high quality mock data matching user screenshots (Image 3)
    return {
      title: 'Want to climb Mount Everest?',
      publishedAt: '2-20-2023 | 07:35 PM',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      description: 'In the years since human beings first reached the summit of Mount Everest in 1953, climbing the world\'s highest mountain has changed dramatically. Today, hundreds of mountaineers manage the feat each year thanks to improvements in knowledge, technology, and the significant infrastructure provided by commercially guided expeditions that provide a veritable highway up the mountain for those willing to accept both the risks and the cost.'
    };
  }
};
