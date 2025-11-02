const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbzjCaSBUd_oFbUSPB5HcVk8BalaFVaYkWM_N5V3zZcVVJSl4By3FTVxI6CINVR8hr0s/exec'

// Function to fetch popular movies
async function fetchPopularMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=popular`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular movies');
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.results)) {
      console.error('Invalid response for popular movies:', data);
      return [];
    }
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

// Function to search movies
async function searchMovies(query) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=search&query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

// Function to fetch top rated movies
async function fetchTopRatedMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=top_rated`);
    if (!response.ok) {
      throw new Error('Failed to fetch top rated movies');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
}

// Function to fetch upcoming movies
async function fetchUpcomingMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=upcoming`);
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming movies');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return [];
  }
}

// Function to fetch now playing movies
async function fetchNowPlayingMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=now_playing`);
    if (!response.ok) {
      throw new Error('Failed to fetch now playing movies');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return [];
  }
}

// Function to get movie details (for video player, if needed)
async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=details&id=${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

// Function to get TV details
async function fetchTVDetails(tvId) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=details_tv&id=${tvId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch TV details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching TV details:', error);
    return null;
  }
}

// Function to get anime details (placeholder, as AniList API is different)
async function fetchAnimeDetails(animeId) {
  // Placeholder: AniList API integration would be needed here
  console.warn('Anime details not implemented');
  return null;
}

// Function to fetch movies by genre
async function fetchMoviesByGenre(genreId) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=genre&genreId=${genreId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies by genre');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
}

// Function to fetch popular TV shows
async function fetchPopularTVShows() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=popular_tv`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular TV shows');
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.results)) {
      console.error('Invalid response for popular TV shows:', data);
      return [];
    }
    return data.results;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return [];
  }
}

// Function to fetch top rated TV shows
async function fetchTopRatedTVShows() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=top_rated_tv`);
    if (!response.ok) {
      throw new Error('Failed to fetch top rated TV shows');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error);
    return [];
  }
}

// Function to fetch TV shows on the air
async function fetchOnTheAirTVShows() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=on_the_air`);
    if (!response.ok) {
      throw new Error('Failed to fetch TV shows on the air');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching TV shows on the air:', error);
    return [];
  }
}

// Function to fetch TV shows airing today
async function fetchAiringTodayTVShows() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=airing_today`);
    if (!response.ok) {
      throw new Error('Failed to fetch TV shows airing today');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching TV shows airing today:', error);
    return [];
  }
}

// Function to fetch TV shows by genre
async function fetchTVShowsByGenre(genreId) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=tv_genre&genreId=${genreId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch TV shows by genre');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching TV shows by genre:', error);
    return [];
  }
}

// Function to fetch movie genres
async function fetchMovieGenres() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=genres`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie genres');
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.genres)) {
      console.error('Invalid response for movie genres:', data);
      return [];
    }
    return data.genres;
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    return [];
  }
}

// Function to fetch TV genres
async function fetchTVGenres() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=tv_genres`);
    if (!response.ok) {
      throw new Error('Failed to fetch TV genres');
    }
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Error fetching TV genres:', error);
    return [];
  }
}
