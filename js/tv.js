// TV Shows browsing page logic

document.addEventListener('DOMContentLoaded', () => {
  const tvShowsContainer = document.getElementById('tv-shows');

  loadPopularTVShows();

  // Make functions global
  window.loadCategory = loadCategory;
  window.loadGenre = loadGenre;

  async function loadPopularTVShows() {
    showLoader();
    const shows = await fetchPopularTVShows();
    hideLoader();
    displayTVShows(shows, tvShowsContainer);
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

  async function loadCategory(category) {
    showLoader();
    let shows = [];
    if (category === 'popular_tv') {
      shows = await fetchPopularTVShows();
    } else if (category === 'top_rated_tv') {
      shows = await fetchTopRatedTVShows();
    } else if (category === 'on_the_air') {
      shows = await fetchOnTheAirTVShows();
    } else if (category === 'airing_today') {
      shows = await fetchAiringTodayTVShows();
    }
    hideLoader();
    displayTVShows(shows, tvShowsContainer);
    // Update section title
    const titles = {
      popular_tv: 'Popular TV Shows',
      top_rated_tv: 'Top Rated TV Shows',
      on_the_air: 'TV Shows On The Air',
      airing_today: 'TV Shows Airing Today'
    };
    document.querySelector('#tv-shows-section h2').textContent = titles[category] || 'TV Shows';
  }

  async function loadGenre(genreId) {
    showLoader();
    const shows = await fetchTVShowsByGenre(genreId);
    hideLoader();
    displayTVShows(shows, tvShowsContainer);
    // Update section title
    document.querySelector('#tv-shows-section h2').textContent = 'TV Shows by Genre';
  }

  async function loadGenres() {
    const genresDropdown = document.getElementById('genres-dropdown');
    const genres = await fetchTVGenres();
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

  function displayTVShows(tvShows, container) {
    container.innerHTML = '';
    tvShows.forEach(show => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
        <div class="movie-info">
          <h3 class="movie-title">${show.name}</h3>
          <p class="movie-rating">⭐ ${show.vote_average}/10</p>
        </div>
      `;
      card.addEventListener('click', () => {
        // Navigate to player page with TV show id and type
        window.location.href = `player.html?id=${show.id}&type=tv`;
      });
      container.appendChild(card);
    });
  }
});
