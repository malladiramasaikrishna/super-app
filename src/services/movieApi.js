
const MY_OMDB_API_KEY = 'YOUR_API_KEY_HERE'; 

const SEARCH_MAP = {
  Action: 'avengers',
  Drama: 'godfather',
  Romance: 'romance',
  Thriller: 'thriller',
  Western: 'western',
  Horror: 'horror',
  Fantasy: 'fantasy',
  Music: 'music',
  Fiction: 'space'
};

// A reliable placeholder for any movie that has no poster
const FALLBACK_POSTER = 'https://via.placeholder.com/300x450/1a1a2e/e0e0e0?text=No+Poster';
const FALLBACK_BACKDROP = 'https://via.placeholder.com/1280x720/1a1a2e/e0e0e0?text=No+Backdrop';

// fetching movies from OMBD API based

export const fetchMoviesByCategory = async (category, customApiKey) => {
  // Priority: 1. UI custom input key -> 2. MY_OMDB_API_KEY defined above -> 3. .env environment variable
  const hardcodedKey = MY_OMDB_API_KEY !== 'YOUR_API_KEY_HERE' ? MY_OMDB_API_KEY : '';
  const apiKey = 
    customApiKey || 
    hardcodedKey || 
    import.meta.env.VITE_OMDB_API_KEY || 
    '';

  // If no API key is specified, load the static local database catalog immediately
  if (!apiKey) {
    return movieCatalog[category] || [];
  }

  const searchTerm = SEARCH_MAP[category] || category.toLowerCase();

  try {
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}&type=movie`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OMDb responded with status ${response.status}`);
    const data = await response.json();

    if (data.Response === 'True' && data.Search && data.Search.length > 0) {
      // Pick first 4 movies from search results
      const moviesList = data.Search.slice(0, 4);

      // Fetch plot details
      const detailedMovies = await Promise.all(
        moviesList.map(async (movie) => {
          try {
            const detailsUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=short`;
            const detailsRes = await fetch(detailsUrl);
            if (!detailsRes.ok) return null;
            const details = await detailsRes.json();

            const rating = details.imdbRating && details.imdbRating !== 'N/A'
              ? parseFloat(details.imdbRating)
              : 6.5;

            return {
              id: movie.imdbID,
              title: movie.Title,
              rating: rating,
              releaseYear: movie.Year,
              duration: details.Runtime && details.Runtime !== 'N/A' ? details.Runtime : 'N/A',
              overview: details.Plot && details.Plot !== 'N/A' ? details.Plot : 'No details available.',
              poster: movie.Poster && movie.Poster !== 'N/A'
                ? movie.Poster
                : FALLBACK_POSTER,
              backdrop: FALLBACK_BACKDROP
            };
          } catch (e) {
            return {
              id: movie.imdbID,
              title: movie.Title,
              rating: 6.5,
              releaseYear: movie.Year,
              duration: 'N/A',
              overview: 'No details available.',
              poster: movie.Poster && movie.Poster !== 'N/A'
                ? movie.Poster
                : FALLBACK_POSTER,
              backdrop: FALLBACK_BACKDROP
            };
          }
        })
      );

      return detailedMovies.filter((m) => m !== null);
    }
    throw new Error(data.Error || 'No search results returned');
  } catch (error) {
    console.warn(`Failed to fetch OMDb movies for category "${category}", using local catalog:`, error);
    return movieCatalog[category] || [];
  }
};

export const getMoviesByCategory = (category) => {
  return movieCatalog[category] || [];
};

export const getAllMovies = () => {
  return Object.values(movieCatalog).flat();
};


export const movieCatalog = {
  Action: [
    {
      id: 'a1',
      title: 'Black Adam',
      rating: 7.2,
      releaseYear: 2022,
      duration: '2h 5m',
      overview: 'Nearly 5,000 years after he was bestowed with the almighty powers of the ancient gods—and imprisoned just as quickly—Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.',
      poster: 'https://m.media-amazon.com/images/M/MV5BYzZkOGUwMzMtMTgyNS00YjFlLTg5NzYtZTE3Y2Q0MWIxZTYwXkEyXkFqcGdeQXVyMjkwNTAyOTM@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'a2',
      title: 'Eternals',
      rating: 6.8,
      releaseYear: 2021,
      duration: '2h 36m',
      overview: 'With the return of the Deviants, the ancient and powerful Eternals who have lived on Earth in secret for thousands of years must reunite to defend humanity once more.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTExZmVjY2ItYTAzYi00MDdlLWFlOWItNTJhMDRjMzQ5ZGI0XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'a3',
      title: 'Top Gun: Maverick',
      rating: 8.3,
      releaseYear: 2022,
      duration: '2h 10m',
      overview: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
      poster: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwNTAyOTM@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'a4',
      title: 'Tenet',
      rating: 7.8,
      releaseYear: 2020,
      duration: '2h 30m',
      overview: 'Armed with only one word - Tenet - and fighting for the survival of the entire world, the Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.',
      poster: 'https://m.media-amazon.com/images/M/MV5BYzg0NGM2NjAtNmIxOC00MDJmLTg5ZmYtYzM0MTE4NWE2NzlhXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    }
  ],
  Drama: [
    {
      id: 'd1',
      title: 'The Shawshank Redemption',
      rating: 9.3,
      releaseYear: 1994,
      duration: '2h 22m',
      overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'd2',
      title: 'The Godfather',
      rating: 9.2,
      releaseYear: 1972,
      duration: '2h 55m',
      overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone, survives an attempt on his life, his youngest son steps in to take control.',
      poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'd3',
      title: 'Forrest Gump',
      rating: 8.8,
      releaseYear: 1994,
      duration: '2h 22m',
      overview: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.',
      poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMwXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'd4',
      title: 'The Dark Knight',
      rating: 9.0,
      releaseYear: 2008,
      duration: '2h 32m',
      overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    }
  ],
  Romance: [
    {
      id: 'r1',
      title: 'The Fault in Our Stars',
      rating: 7.7,
      releaseYear: 2014,
      duration: '2h 13m',
      overview: 'Hazel and Gus are two extraordinary teenagers who share an acerbic wit, a disdain for the conventional, and a love that sweeps them on an unforgettable journey.',
      poster: 'https://m.media-amazon.com/images/M/MV5BNTVkMTFiZWItOTFkOC00YzE3LWIzNDktZjMzODY0OTdlZTJiXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'r2',
      title: 'La La Land',
      rating: 8.0,
      releaseYear: 2016,
      duration: '2h 8m',
      overview: 'Mia, an aspiring actress, and Sebastian, a dedicated jazz musician, are struggling to make ends meet in a city known for crushing hopes and breaking hearts.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'r3',
      title: 'Pride & Prejudice',
      rating: 7.8,
      releaseYear: 2005,
      duration: '2h 9m',
      overview: 'Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTA2NDc3Njg5NDVeQTJeQWpwZ15BbWU4MDcxNTczMTkx._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'r4',
      title: 'About Time',
      rating: 7.8,
      releaseYear: 2013,
      duration: '2h 3m',
      overview: 'At the age of 21, Tim discovers he can travel in time and change what happens and has happened in his own life. His decision to make his world a better place by getting a girlfriend turns out to be not as easy as you might think.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTQxMDE3NjM1Ml5BMl5BanBnXkFtZTcwMDE5NTMzOQ@@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    }
  ],
  Thriller: [
    {
      id: 't1',
      title: 'Oxygen',
      rating: 6.5,
      releaseYear: 2021,
      duration: '1h 41m',
      overview: 'A woman wakes up in a cryogenic chamber with no memory of who she is or how she got there. As her oxygen level begins to deplete, she must rebuild her memories to find a way out.',
      poster: 'https://m.media-amazon.com/images/M/MV5BOGJhNzZlOWUtYjQ2NS00YTkwLTk3ZDUtNTRmMjNhNjYzNWY3XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 't2',
      title: 'Smile',
      rating: 6.7,
      releaseYear: 2022,
      duration: '1h 55m',
      overview: "After witnessing a bizarre, traumatic incident involving a patient, Dr. Rose Cotter starts experiencing frightening occurrences that she can't explain.",
      poster: 'https://m.media-amazon.com/images/M/MV5BZjE2ZWIwMWEtNGFlMy00ZjYzLWEzOWEtYzQ0MDAwZDRhNWNmXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 't3',
      title: 'The Gray Man',
      rating: 6.5,
      releaseYear: 2022,
      duration: '2h 2m',
      overview: "When the CIA's most skilled mercenary known as Court Gentry accidentally uncovers dark agency secrets, he becomes a primary target and is hunted around the world.",
      poster: 'https://m.media-amazon.com/images/M/MV5BOWY4MmFiY2QtMzE1YS00NTg1LWIwOTQtYTI4ZGZhZGQ0MzUzXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 't4',
      title: 'The Menu',
      rating: 7.2,
      releaseYear: 2022,
      duration: '1h 47m',
      overview: 'A young couple travels to a remote island to eat at an exclusive restaurant where the chef has prepared a lavish menu, with some shocking surprises.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMzdjNjI5MmYtODhiNS00NTcyLWEzZmUtYzVmODM5YzExNDE3XkEyXkFqcGdeQXVyMTAyMjQ3NzQ1._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    }
  ],
  Western: [
    {
      id: 'w1',
      title: 'Django Unchained',
      rating: 8.4,
      releaseYear: 2012,
      duration: '2h 45m',
      overview: 'With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'w2',
      title: 'The Good, the Bad and the Ugly',
      rating: 8.8,
      releaseYear: 1966,
      duration: '2h 58m',
      overview: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
      poster: 'https://m.media-amazon.com/images/M/MV5BNjJlYmNkZGItM2NhYy00MjlmLTk5NmQtNjg1NmM2ODU4OTMwXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'w3',
      title: 'True Grit',
      rating: 7.6,
      releaseYear: 2010,
      duration: '1h 50m',
      overview: "A stubborn teenager enlists the help of a tough U.S. Marshal to track down her father's killer.",
      poster: 'https://m.media-amazon.com/images/M/MV5BODhkZDIlMGQtNS05OS00ZmI3LTkwYjUtNzFkNTY3MTIzODQxXkEyXkFqcGc@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'w4',
      title: 'Unforgiven',
      rating: 8.2,
      releaseYear: 1992,
      duration: '2h 10m',
      overview: 'Retired Old West gunslinger William Munny reluctantly takes on one last job, with the help of his old partner Ned Logan and a young man, the "Schofield Kid."',
      poster: 'https://m.media-amazon.com/images/M/MV5BODM3YWY4NmQtN2Y3NmQtMjkzNS00MDUyLTk2ZDUtOGE0ZDkzNjgzZTgxXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    }
  ],
  Horror: [
    {
      id: 'h1',
      title: 'M3GAN',
      rating: 6.4,
      releaseYear: 2022,
      duration: '1h 42m',
      overview: 'A toy-company roboticist builds a life-like doll that begins to take on a life of its own, leading to terrifying consequences.',
      poster: 'https://m.media-amazon.com/images/M/MV5BNmRlYjgyOTUtZTRhOS00NzA0LWEzMjctODY1YjQ0NmRjZGRhXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'h2',
      title: 'The Invitation',
      rating: 5.3,
      releaseYear: 2022,
      duration: '1h 45m',
      overview: 'After the death of her mother and having no other known relatives, Evie takes a DNA test... and discovers a long-lost cousin she never knew she had.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMmZiN2VmMjktZDE5OC00ZWRmLWFlMmEtYWViMTY0MWE2MmE2XkEyXkFqcGdeQXVyMTI2MTc2ODM3._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'h3',
      title: 'Orphan: First Kill',
      rating: 5.9,
      releaseYear: 2022,
      duration: '1h 39m',
      overview: 'After orchestrating a brilliant escape from an Estonian psychiatric facility, Esther travels to America by impersonating the missing daughter of a wealthy family.',
      poster: 'https://m.media-amazon.com/images/M/MV5BN2Q1NWExNzEtM2EwNC00ZjUxLTg1MzMtNDdmNGY1MjIwMjkzXkEyXkFqcGdeQXVyMTAxNzQ1NzI@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'h4',
      title: 'Ouija: Origin of Evil',
      rating: 6.2,
      releaseYear: 2016,
      duration: '1h 39m',
      overview: 'In 1967 Los Angeles, a widowed mother and her two daughters add a new stunt to bolster their seance scam business, inviting an authentic evil into their home.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMjMzMzg0OTkzMl5BMl5BanBnXkFtZTgwNjMwNjIyMDI@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    }
  ],
  Fantasy: [
    {
      id: 'f1',
      title: 'Avatar: The Way of Water',
      rating: 7.6,
      releaseYear: 2022,
      duration: '3h 12m',
      overview: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
      poster: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'f2',
      title: 'Harry Potter and the Deathly Hallows: Part 2',
      rating: 8.1,
      releaseYear: 2011,
      duration: '2h 10m',
      overview: "Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their effort to destroy the Dark Lord as the final battle rages on at Hogwarts.",
      poster: 'https://m.media-amazon.com/images/M/MV5BMGVmMWNiMDktYjQ0Mi00MWIxLTk0N2UtN2ZlYTdkN2IzNDlmXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'f3',
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      rating: 8.8,
      releaseYear: 2001,
      duration: '2h 58m',
      overview: 'Young hobbit Frodo Baggins, after inheriting a mysterious ring, must leave his home and journey to the Land of Mordor to destroy it.',
      poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'f4',
      title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe',
      rating: 6.9,
      releaseYear: 2005,
      duration: '2h 23m',
      overview: 'Four kids travel through a wardrobe to the land of Narnia and learn of their destiny to free it with the guidance of a mystical lion.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTc0NTUwMTU5OV5BMl5BanBnXkFtZTcwNjAwNzQzMw@@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    }
  ],
  Music: [
    {
      id: 'm1',
      title: 'Whiplash',
      rating: 8.5,
      releaseYear: 2014,
      duration: '1h 47m',
      overview: 'Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.',
      poster: 'https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRhLWJjOWItOTMzNjlkMjliMWVkXkEyXkFqcGc@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'm2',
      title: 'Bohemian Rhapsody',
      rating: 7.9,
      releaseYear: 2018,
      duration: '2h 14m',
      overview: 'The story of the legendary British rock band Queen and their lead singer Freddie Mercury, leading up to their famous performance at Live Aid.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTA2NDc3Njg5NDVeQTJeQWpwZ15BbWU4MDc1NDcxNTUz._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'm3',
      title: 'A Star Is Born',
      rating: 7.6,
      releaseYear: 2018,
      duration: '2h 16m',
      overview: 'A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.',
      poster: 'https://m.media-amazon.com/images/M/MV5BNmE5ZmE3OGItNTdlNC00YmMxLWEzNjctYzAwOGQ5ODg0OTI0XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 'm4',
      title: 'Rocketman',
      rating: 7.3,
      releaseYear: 2019,
      duration: '2h 1m',
      overview: "A musical fantasy about the fantastical human story of Elton John's breakthrough years.",
      poster: 'https://m.media-amazon.com/images/M/MV5BNjIxOWQ5MTctNWMzMS00YjEzLWIzODItOTc5Njk4NjUzNWY2XkEyXkFqcGc@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    }
  ],
  Fiction: [
    {
      id: 's1',
      title: 'Interstellar',
      rating: 8.6,
      releaseYear: 2014,
      duration: '2h 49m',
      overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      poster: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 's2',
      title: 'Inception',
      rating: 8.8,
      releaseYear: 2010,
      duration: '2h 28m',
      overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 's3',
      title: 'The Matrix',
      rating: 8.7,
      releaseYear: 1999,
      duration: '2h 16m',
      overview: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
      poster: 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZDYxZjlhYmI0XkEyXkFqcGc@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    },
    {
      id: 's4',
      title: 'Blade Runner 2049',
      rating: 8.0,
      releaseYear: 2017,
      duration: '2h 44m',
      overview: "A new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
      poster: 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg',
      backdrop: FALLBACK_BACKDROP
    }
  ]
};
