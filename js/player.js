// Player page logic for Movioo

document.addEventListener('DOMContentLoaded', () => {
  const videoPlayerContainer = document.getElementById('video-player-container');
  const playerControls = document.getElementById('player-controls');
  const seasonLabel = document.getElementById('season-label');
  const seasonSelect = document.getElementById('season-select');
  const episodeLabel = document.getElementById('episode-label');
  const episodeSelect = document.getElementById('episode-select');
  const subdubLabel = document.getElementById('subdub-label');
  const subdubToggle = document.getElementById('subdub-toggle');
  const closePlayerButton = document.getElementById('close-player');
  const videoTitle = document.getElementById('video-title');

  let currentContent = null;
  let currentType = 'movie';

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

  // Parse URL parameters to get content info
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const type = urlParams.get('type') || 'movie';

  if (!id) {
    alert('No content specified');
    window.location.href = 'index.html';
    return;
  }

  currentType = type;

  // Fetch content details if needed
  showLoader();
  fetchContentDetails(id, type).then(details => {
    hideLoader();
    currentContent = details || { id: id };
    if (type === 'tv') {
      setupTVControls(currentContent);
    } else if (type === 'anime') {
      setupAnimeControls();
    } else {
      hidePlayerControls();
    }
    updatePlayerEmbed();
  });

  // Event listeners for controls
  seasonSelect.addEventListener('change', updatePlayerEmbed);
  episodeSelect.addEventListener('change', updatePlayerEmbed);
  subdubToggle.addEventListener('change', updatePlayerEmbed);

  closePlayerButton.addEventListener('click', () => {
    window.history.back();
  });

  async function fetchContentDetails(id, type) {
    try {
      let endpoint = 'details';
      if (type === 'tv') {
        endpoint = 'details_tv';
      } else if (type === 'anime') {
        return await fetchAnimeDetails(id);
      }
      const response = await fetch(`${API_BASE_URL}?endpoint=${endpoint}&id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch content details');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching content details:', error);
      return null;
    }
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
    const season = currentContent.seasons.find(s => s.season_number == seasonNumber);
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

    // Update movie info section
    if (currentContent.title || currentContent.name) {
      videoTitle.textContent = currentContent.title || currentContent.name;
    } else {
      videoTitle.textContent = 'Watch';
    }
    if (currentContent.overview) {
      document.getElementById('movie-overview').textContent = currentContent.overview;
    } else {
      document.getElementById('movie-overview').textContent = '';
    }
    if (currentContent.vote_average) {
      document.getElementById('movie-rating').textContent = `${currentContent.vote_average}/10`;
    } else {
      document.getElementById('movie-rating').textContent = '';
    }

    // Fetch and display recommended movies
    fetchRecommended(currentContent.id, currentType);
  }

  async function fetchRecommended(id, type) {
    try {
      const response = await fetch(`${API_BASE_URL}?endpoint=popular`);
      if (!response.ok) {
        throw new Error('Failed to fetch popular recommendations');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data.results)) {
        throw new Error('Invalid response format');
      }
      // Filter out the current content from recommendations
      const recommendations = data.results.filter(item => item.id !== parseInt(id));
      displayRecommended(recommendations);
    } catch (error) {
      console.error('Error fetching popular recommendations:', error);
      document.getElementById('recommended-movies').innerHTML = '<p>Failed to load recommendations.</p>';
    }
  }

  function displayRecommended(movies) {
    const container = document.getElementById('recommended-movies');
    container.innerHTML = '';
    if (!Array.isArray(movies) || movies.length === 0) {
      container.innerHTML = '<p>No recommendations available.</p>';
      return;
    }
    movies.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
        <div class="movie-info">
          <h4 class="movie-title">${movie.title || movie.name}</h4>
          <p class="movie-rating">⭐ ${movie.vote_average}/10</p>
        </div>
      `;
      card.addEventListener('click', () => {
        // Navigate to player page for selected recommended movie
        window.location.href = `player.html?id=${movie.id}&type=${movie.media_type || 'movie'}`;
      });
      container.appendChild(card);
    });
  }

  // Make functions global for nav
  window.loadCategory = function(category) {
    window.location.href = 'index.html';
  };

  window.loadGenre = function(genreId) {
    window.location.href = 'index.html';
  };
});
