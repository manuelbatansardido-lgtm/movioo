// Anime browsing page logic using AniList API

document.addEventListener('DOMContentLoaded', () => {
  const animeContainer = document.getElementById('anime-list');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');

  loadPopularAnime();

  // Search functionality
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      searchAnime(query);
    } else {
      loadPopularAnime();
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        searchAnime(query);
      } else {
        loadPopularAnime();
      }
    }
  });

  async function loadPopularAnime() {
    try {
      const query = `
        query {
          Page(page: 1, perPage: 20) {
            media(type: ANIME, sort: POPULARITY_DESC) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              averageScore
              description
            }
          }
        }
      `;

      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch popular anime');
      }

      const data = await response.json();
      displayAnime(data.data.Page.media);
    } catch (error) {
      console.error('Error fetching popular anime:', error);
      animeContainer.innerHTML = '<p>Failed to load anime.</p>';
    }
  }

  async function searchAnime(query) {
    try {
      const searchQuery = `
        query ($search: String) {
          Page(page: 1, perPage: 20) {
            media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              averageScore
              description
            }
          }
        }
      `;

      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          variables: { search: query }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to search anime');
      }

      const data = await response.json();
      displayAnime(data.data.Page.media);
    } catch (error) {
      console.error('Error searching anime:', error);
      animeContainer.innerHTML = '<p>Failed to search anime.</p>';
    }
  }

  function displayAnime(animeList) {
    animeContainer.innerHTML = '';
    animeList.forEach(anime => {
      const title = anime.title.english || anime.title.romaji;
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="${anime.coverImage.large}" alt="${title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
        <div class="movie-info">
          <h3 class="movie-title">${title}</h3>
          <p class="movie-rating">⭐ ${anime.averageScore ? anime.averageScore / 10 : 'N/A'}/10</p>
        </div>
      `;
      card.addEventListener('click', () => {
        // Navigate to player page with anime id and type
        window.location.href = `player.html?id=${anime.id}&type=anime`;
      });
      animeContainer.appendChild(card);
    });
  }

  // Make functions global for nav
  window.loadCategory = function(category) {
    loadPopularAnime();
  };

  window.loadGenre = function(genreId) {
    loadPopularAnime();
  };
});
