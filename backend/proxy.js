// Google Apps Script code for TMDb API proxy
// Deploy as web app with "Execute the app as: Me" and "Who has access to the app: Anyone"

const API_KEY = '0bebdcdf0c33290a7a25426ffdb559d7';
const BASE_URL = 'https://api.themoviedb.org/3';

function doGet(e) {
  const params = e.parameter;
  let url = '';

  if (params.endpoint === 'popular') {
    url = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
  } else if (params.endpoint === 'top_rated') {
    url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`;
  } else if (params.endpoint === 'upcoming') {
    url = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`;
  } else if (params.endpoint === 'now_playing') {
    url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`;
  } else if (params.endpoint === 'genre') {
    const genreId = params.genreId;
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
  } else if (params.endpoint === 'popular_tv') {
    url = `${BASE_URL}/tv/popular?api_key=${API_KEY}`;
  } else if (params.endpoint === 'search') {
    const query = params.query;
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
  } else if (params.endpoint === 'details') {
    const id = params.id;
    url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;
  } else if (params.endpoint === 'details_tv') {
    const id = params.id;
    url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}`;
  } else {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Invalid endpoint' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const response = UrlFetchApp.fetch(url);
    const data = response.getContentText();
    return ContentService
      .createTextOutput(data)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
