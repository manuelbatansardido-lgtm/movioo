    # Movioo - Movie & TV Browser

## Non-Technical Overview

### Project Description
Movioo is a professional-looking movie and TV browsing website that allows users to discover, search, and watch movies, TV shows, and anime. The website provides a clean, responsive interface for browsing popular content, searching for specific titles, and streaming videos directly through an integrated player.

### Purpose and Goals
- Provide an easy-to-use platform for movie and TV enthusiasts to explore content
- Offer free access to popular movies, TV shows, and anime
- Enable seamless video playback without requiring user accounts or subscriptions
- Maintain a static frontend for cost-effective hosting and deployment

### Target Audience
- Movie and TV show fans looking for entertainment
- Users seeking a simple, ad-free browsing experience
- Developers interested in learning about API integration and static site development

### Key Features
- **Browse Popular Content**: View trending movies, TV shows, and anime
- **Search Functionality**: Search for specific movies or TV shows with autocomplete suggestions
- **Video Playback**: Watch content using the integrated Videasy.net player
- **Responsive Design**: Optimized for desktop and mobile devices
- **Multi-Content Support**: Movies, TV shows, and anime in one platform
- **Recommendations**: View popular videos as recommendations on the player page

### User Experience
- Clean, modern interface with Netflix-inspired design
- Fast loading times with static hosting
- Intuitive navigation between different content types
- Seamless transition from browsing to watching

## Technical Documentation

### Architecture Overview
Movioo follows a static frontend architecture with a serverless backend proxy:

```
Frontend (Static HTML/CSS/JS)
    ↓ API Calls
Backend Proxy (Google Apps Script)
    ↓ API Requests
External APIs (TMDb, Videasy.net)
```

### Technologies Used

#### Frontend
- **HTML5**: Semantic markup for page structure
- **CSS3**: Custom styling with responsive design
- **Vanilla JavaScript**: DOM manipulation, API calls, and user interactions
- **No frameworks**: Pure JavaScript for lightweight, fast loading

#### Backend
- **Google Apps Script**: Serverless proxy to handle API requests and CORS issues
- **TMDb API**: Movie and TV database for content information
- **Videasy.net**: Video streaming service for playback

#### Development Tools
- **Git**: Version control
- **GitHub Pages**: Frontend hosting
- **Google Apps Script Editor**: Backend development and deployment

### Project Structure

```
Movioo/
├── index.html              # Home page (Movies)
├── tv.html                 # TV Shows page
├── anime.html              # Anime page
├── player.html             # Video player page
├── css/
│   ├── style.css           # Main stylesheet
│   └── favicon             # Favicon files
├── js/
│   ├── api.js              # API functions and endpoints
│   ├── app.js              # Home page logic
│   ├── tv.js               # TV Shows page logic
│   ├── anime.js            # Anime page logic
│   ├── player.js           # Player page logic
│   └── js/player.js        # Additional player logic (if any)
├── backend/
│   └── proxy.js            # Google Apps Script proxy code
├── logo.png                # Site logo
├── favicon.png             # Favicon image
├── README.md               # Basic setup instructions
├── TODO.md                 # Development tasks
└── Detail_Info.md          # This documentation file
```

### File Descriptions

#### HTML Files
- `index.html`: Main landing page with popular movies grid and search
- `tv.html`: TV shows browsing page
- `anime.html`: Anime browsing page
- `player.html`: Video player with controls and recommendations

#### CSS Files
- `css/style.css`: Complete styling including responsive design, dark theme, and component styles

#### JavaScript Files
- `js/api.js`: API endpoint definitions and fetch functions
- `js/app.js`: Home page functionality (movies, search, autocomplete)
- `js/tv.js`: TV shows page functionality
- `js/anime.js`: Anime page functionality (uses AniList API)
- `js/player.js`: Player page logic, controls, and recommendations

#### Backend Files
- `backend/proxy.js`: Google Apps Script code for API proxying

### API Integration

#### TMDb API
- **API Key**: `0bebdcdf0c33290a7a25426ffdb559d7`
- **Base URL**: `https://api.themoviedb.org/3`
- **Endpoints Used**:
  - `/movie/popular`: Popular movies
  - `/search/movie`: Movie search
  - `/movie/{id}`: Movie details
  - `/tv/popular`: Popular TV shows
  - `/tv/{id}`: TV show details
  - `/search/tv`: TV show search

#### AniList API (for Anime)
- **GraphQL Endpoint**: `https://graphql.anilist.co`
- **Query**: Popular anime with pagination

#### Videasy.net Player
- **Movie URL**: `https://player.videasy.net/movie/{id}`
- **TV URL**: `https://player.videasy.net/tv/{id}/{season}/{episode}`
- **Anime URL**: `https://player.videasy.net/anime/{id}/{episode}`

### Backend Proxy (Google Apps Script)

The proxy handles CORS issues and API key security:

```javascript
function doGet(e) {
  const params = e.parameter;
  let url = '';

  if (params.endpoint === 'popular') {
    url = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
  } else if (params.endpoint === 'search') {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(params.query)}`;
  } else if (params.endpoint === 'details') {
    url = `${BASE_URL}/movie/${params.id}?api_key=${API_KEY}`;
  } else if (params.endpoint === 'popular_tv') {
    url = `${BASE_URL}/tv/popular?api_key=${API_KEY}`;
  } else if (params.endpoint === 'details_tv') {
    url = `${BASE_URL}/tv/${params.id}?api_key=${API_KEY}`;
  }
  // ... more endpoints

  const response = UrlFetchApp.fetch(url);
  const content = response.getContentText();
  return ContentService
    .createTextOutput(content)
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Setup and Installation

#### Prerequisites
- Google account for Apps Script deployment
- GitHub account for hosting (optional)
- Basic knowledge of HTML/CSS/JS

#### Backend Setup
1. Go to [Google Apps Script](https://script.google.com/)
2. Create new project
3. Copy `backend/proxy.js` content
4. Deploy as web app (Execute as: Me, Access: Anyone)
5. Copy deployment URL

#### Frontend Setup
1. Update `js/api.js` with deployed proxy URL:
   ```javascript
   const API_BASE_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
2. Test locally by opening `index.html` in browser
3. Deploy to GitHub Pages or similar static host

### Deployment

#### Frontend Deployment
- **GitHub Pages**: Push to GitHub repo, enable Pages in settings
- **Netlify**: Drag-and-drop files or connect GitHub repo
- **Firebase Hosting**: Use Firebase CLI to deploy

#### Backend Deployment
- Already handled through Google Apps Script
- No additional hosting required

### Key Features Implementation

#### Search with Autocomplete
- Input event listener triggers API search
- Displays up to 5 suggestions in dropdown
- Clicking suggestion navigates to player

#### Video Player
- Dynamic iframe embedding based on content type
- TV shows include season/episode controls
- Recommendations show popular videos

#### Responsive Design
- Mobile-first approach
- Flexbox and grid layouts
- Media queries for different screen sizes

### Performance Considerations
- Static files load quickly
- Lazy loading not implemented (small project)
- API responses cached by browser
- Minimal JavaScript for fast execution

### Security
- API key hidden in backend proxy
- No user data stored
- CORS handled by proxy
- No authentication required

### Limitations and Future Improvements
- Limited to TMDb and Videasy.net content
- No user accounts or personalization
- Anime uses separate API (AniList)
- No offline functionality
- Potential improvements: User favorites, watch history, advanced search filters

### Development Workflow
1. Make changes to local files
2. Test locally with `index.html`
3. Update backend proxy if needed
4. Redeploy backend
5. Deploy frontend to hosting service

### Testing
- Manual testing across different browsers
- Responsive design testing on mobile devices
- API endpoint testing with browser dev tools
- Video playback testing on different devices

### Maintenance
- Monitor API usage limits
- Update dependencies (none currently)
- Keep TMDb API key secure
- Regular security audits

### License and Legal
- Educational purposes only
- Respect TMDb API terms of service
- Comply with copyright laws
- No commercial use without proper licensing

### Version History
- v1.0: Initial release with movies and basic search
- v1.1: Added TV shows support
- v1.2: Added anime support and recommendations
- v1.3: Removed genres/categories, added search autocomplete

### Support and Contributing
- Issues can be reported on GitHub
- Pull requests welcome for improvements
- Documentation updates encouraged

This documentation provides a comprehensive overview of the Movioo project for developers, maintainers, and users interested in understanding the technical implementation and deployment process.
