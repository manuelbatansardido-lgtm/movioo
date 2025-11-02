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

  // Make functions global
  window.loadCategory = loadCategory;
  window.loadGenre = loadGenre;

  // Search functionality
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      performSearch(query);
    }
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length > 1) {
      showSearchSuggestions(query);
    } else {
      clearSearchSuggestions();
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        performSearch(query);
        clearSearchSuggestions();
      }
    }
  });

  function showSearchSuggestions(query) {
    fetch(`${API_BASE_URL}?endpoint=search&query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        const suggestionsContainer = document.getElementById('search-suggestions');
        suggestionsContainer.innerHTML = '';
        if (data && Array.isArray(data.results)) {
          data.results.slice(0, 3).forEach(item => {
            const div = document.createElement('div');
            div.className = 'search-suggestion';
            div.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w92${item.poster_path}" alt="${item.title || item.name}" class="suggestion-thumb" onerror="this.src='https://via.placeholder.com/30x45?text=No+Image'">
              <span>${item.title || item.name}</span>
            `;
            div.addEventListener('click', () => {
              window.location.href = `player.html?id=${item.id}&type=movie`;
            });
            suggestionsContainer.appendChild(div);
          });
          suggestionsContainer.style.display = 'block';
        } else {
          suggestionsContainer.style.display = 'none';
        }
      })
      .catch(error => {
        console.error('Error fetching search suggestions:', error);
      });
  }

  function clearSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';
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

  async function performSearch(query) {
    showLoader();
    const movies = await searchMovies(query);
    hideLoader();
    displayMovies(movies, searchResultsContainer);
    searchResultsSection.classList.remove('hidden');
    // Hide popular if searching
    document.getElementById('popular-section').style.display = 'none';
  }

  function displayMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
      const movieCard = createMovieCard(movie);
      container.appendChild(movieCard);
    });
  }

  function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <p class="movie-rating">⭐ ${movie.vote_average}/10</p>
      </div>
    `;
    card.addEventListener('click', () => {
      playContent(movie);
    });
    return card;
  }

  function playContent(content) {
    // Navigate to player page with content id and type
    const type = content.media_type || 'movie';
    window.location.href = `player.html?id=${content.id}&type=${type}`;
  }

  function setupTVControls(details) {
    if (!details || !details.seasons) {
      hidePlayerControls();
      return;
    }
    playerControls.classList.remove('hidden');
    seasonLabel.classList.remove('hidden');
    seasonSelect.classList.remove('hidden');
    episodeLabel.classList.remove('hidden');
    episodeSelect.classList.remove('hidden');
    subdubLabel.classList.add('hidden');
    subdubToggle.classList.add('hidden');

    // Populate seasons
    seasonSelect.innerHTML = '';
    details.seasons.forEach(season => {
      const option = document.createElement('option');
      option.value = season.season_number;
      option.textContent = `Season ${season.season_number}`;
      seasonSelect.appendChild(option);
    });

    // Populate episodes for first season by default
    populateEpisodes(details.seasons[0].season_number);
  }

  function populateEpisodes(seasonNumber) {
    const season = currentContent.details.seasons.find(s => s.season_number == seasonNumber);
    episodeSelect.innerHTML = '';
    if (!season || !season.episode_count) {
      episodeSelect.disabled = true;
      return;
    }
    episodeSelect.disabled = false;
    for (let i = 1; i <= season.episode_count; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `Episode ${i}`;
      episodeSelect.appendChild(option);
    }
  }

  function setupAnimeControls() {
    // Placeholder for anime controls setup
    playerControls.classList.remove('hidden');
    seasonLabel.classList.add('hidden');
    seasonSelect.classList.add('hidden');
    episodeLabel.classList.remove('hidden');
    episodeSelect.classList.remove('hidden');
    subdubLabel.classList.remove('hidden');
    subdubToggle.classList.remove('hidden');

    // Populate episodes for anime (not implemented)
  }

  function hidePlayerControls() {
    playerControls.classList.add('hidden');
    seasonLabel.classList.add('hidden');
    seasonSelect.classList.add('hidden');
    episodeLabel.classList.add('hidden');
    episodeSelect.classList.add('hidden');
    subdubLabel.classList.add('hidden');
    subdubToggle.classList.add('hidden');
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
    // Update section title
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
    const genresDropdown = document.querySelectorAll('.dropdown-content')[1];
    if (!genresDropdown) return;
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
});
