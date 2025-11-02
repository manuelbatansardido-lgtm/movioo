document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const popularMoviesContainer = document.getElementById('popular-movies');
  const searchResultsContainer = document.getElementById('search-results');
  const searchResultsSection = document.getElementById('search-results-section');
  const playerSection = document.getElementById('player-section');
  const videoPlayerContainer = document.getElementById('video-player-container');
  const closePlayerButton = document.getElementById('close-player');

  const playerControls = document.getElementById('player-controls');
  const seasonLabel = document.getElementById('season-label');
  const seasonSelect = document.getElementById('season-select');
  const episodeLabel = document.getElementById('episode-label');
  const episodeSelect = document.getElementById('episode-select');
  const subdubLabel = document.getElementById('subdub-label');
  const subdubToggle = document.getElementById('subdub-toggle');

  let currentContent = null; // Store current movie/tv/anime data
  let currentType = 'movie'; // 'movie', 'tv', 'anime'

  // Load popular movies on page load
  loadPopularMovies();
  loadGenres();

  // Check for search query in URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery) {
    document.getElementById('search-input').value = searchQuery;
    performSearch(searchQuery);
  }

  // Search functionality
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      performSearch(query);
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        performSearch(query);
      }
    }
  });

  // Close player
  closePlayerButton.addEventListener('click', () => {
    playerSection.classList.add('hidden');
    videoPlayerContainer.innerHTML = '';
    playerControls.classList.add('hidden');
    hidePlayerControls();
  });

  // Player controls event listeners
  seasonSelect.addEventListener('change', updatePlayerEmbed);
  episodeSelect.addEventListener('change', updatePlayerEmbed);
  subdubToggle.addEventListener('change', updatePlayerEmbed);

  async function performSearch(query) {
    showLoader();
    const movies = await searchMovies(query);
    hideLoader();
    displayMovies(movies, searchResultsContainer);
    // Show search results section
    searchResultsSection.classList.remove('hidden');
    // Hide popular section
    document.getElementById('popular-section').style.display = 'none';
  }

  function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.remove('hidden');
    }
  }

  function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
    }
  }

  async function loadPopularMovies() {
    showLoader();
    const movies = await fetchPopularMovies();
    hideLoader();
    displayMovies(movies, popularMoviesContainer);
  }

  async function loadCategory(category) {
    showLoader();
    let movies = [];
    if (category === 'popular') {
      movies = await fetchPopularMovies();
    } else if (category === 'top_rated') {
      movies = await fetchTopRatedMovies();
    } else if (category === 'upcoming') {
      movies = await fetchUpcomingMovies();
    } else if (category === 'now_playing') {
      movies = await fetchNowPlayingMovies();
    }
    hideLoader();
    displayMovies(movies, popularMoviesContainer);
    const titles = {
      popular: 'Popular Movies',
      top_rated: 'Top Rated Movies',
      upcoming: 'Upcoming Movies',
      now_playing: 'Now Playing Movies'
    };
    document.querySelector('#popular-section h2').textContent = titles[category] || 'Movies';
    // Hide search results if visible
    searchResultsSection.classList.add('hidden');
    document.getElementById('popular-section').style.display = 'block';
  }

  async function loadGenre(genreId) {
    showLoader();
    const movies = await fetchMoviesByGenre(genreId);
    hideLoader();
    displayMovies(movies, popularMoviesContainer);
    // Update section title
    document.querySelector('#popular-section h2').textContent = 'Movies by Genre';
    // Hide search results if visible
    searchResultsSection.classList.add('hidden');
    document.getElementById('popular-section').style.display = 'block';
  }

  async function loadGenres() {
    const genresDropdown = document.getElementById('genres-dropdown');
    const genres = await fetchMovieGenres();
    genres.forEach(genre => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = genre.name;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        loadGenre(genre.id);
      });
      genresDropdown.appendChild(a);
    });
  }

  function updatePlayerEmbed() {
    let embedUrl = '';
    if (currentType === 'movie') {
      embedUrl = `https://player.videasy.net/movie/${currentContent.id}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&color=8B5CF6`;
    } else if (currentType === 'tv') {
      const season = seasonSelect.value || 1;
      const episode = episodeSelect.value || 1;
      embedUrl = `https://player.videasy.net/tv/${currentContent.id}/${season}/${episode}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&color=8B5CF6`;
    } else if (currentType === 'anime') {
      const episode = episodeSelect.value || 1;
      const dub = subdubToggle.value === 'dub' ? 'dub=true' : '';
      embedUrl = `https://player.videasy.net/anime/${currentContent.id}/${episode}?${dub}&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&color=8B5CF6`;
    } else {
      embedUrl = `https://player.videasy.net/movie/${currentContent.id}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&color=8B5CF6`;
    }
    videoPlayerContainer.innerHTML = `<iframe src="${embedUrl}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;
  }

  function displayMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
        <div class="movie-info">
          <h3 class="movie-title">${movie.title || movie.name}</h3>
          <p class="movie-rating">⭐ ${movie.vote_average}/10</p>
        </div>
      `;
      card.addEventListener('click', () => {
        // Navigate to player page with movie id and type
        window.location.href = `player.html?id=${movie.id}&type=movie`;
      });
      container.appendChild(card);
    });
  }

  function hidePlayerControls() {
    const seasonLabel = document.getElementById('season-label');
    const seasonSelect = document.getElementById('season-select');
    const episodeLabel = document.getElementById('episode-label');
    const episodeSelect = document.getElementById('episode-select');
    const subdubLabel = document.getElementById('subdub-label');
    const subdubToggle = document.getElementById('subdub-toggle');
    if (seasonLabel) seasonLabel.classList.add('hidden');
    if (seasonSelect) seasonSelect.classList.add('hidden');
    if (episodeLabel) episodeLabel.classList.add('hidden');
    if (episodeSelect) episodeLabel.classList.add('hidden');
    if (subdubLabel) subdubLabel.classList.add('hidden');
    if (subdubToggle) subdubToggle.classList.add('hidden');
  }

  // Make functions global
  window.loadCategory = loadCategory;
  window.loadGenre = loadGenre;
});
