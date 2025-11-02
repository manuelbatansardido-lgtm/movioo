# Movioo - Movie & TV Browser

A professional-looking movie and TV browsing website powered by TMDb API and Videasy.net for video playback.

## Features

- Browse popular movies
- Search for movies and TV shows
- Watch videos via Videasy.net player
- Responsive design
- Static frontend for free hosting

## Project Structure

- `index.html`: Main HTML page
- `css/style.css`: Styling
- `js/api.js`: API handling for TMDb proxy
- `js/app.js`: Main application logic
- `backend/proxy.js`: Google Apps Script code for API proxy
- `TODO.md`: Development tasks

## Setup and Deployment

### Backend (Google Apps Script)

1. Go to [Google Apps Script](https://script.google.com/).
2. Create a new project.
3. Copy the code from `backend/proxy.js` into the script editor.
4. Save the project.
5. Click "Deploy" > "New deployment".
6. Select type "Web app".
7. Set "Execute as" to "Me", "Who has access" to "Anyone".
8. Deploy and copy the web app URL (e.g., `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`).

> **Important:** After deployment, update the `API_BASE_URL` in `js/api.js` with the full deployed web app URL.  
> This is necessary to avoid CORS errors and enable the frontend to communicate with the backend proxy.

### Frontend

1. Update `js/api.js`: Replace `YOUR_SCRIPT_ID` in `API_BASE_URL` with your deployed script ID.
2. Open `index.html` in a browser to test locally.
3. For hosting:
   - Upload files to GitHub repository.
   - Enable GitHub Pages in repository settings.
   - Or use Firebase Hosting, Netlify, etc.

## API Usage

- TMDb API Key: `0bebdcdf0c33290a7a25426ffdb559d7`
- Backend proxies requests to avoid CORS issues.

## Technologies

- HTML/CSS/JS (Frontend)
- Google Apps Script (Backend proxy)
- TMDb API
- Videasy.net (Video player)

## License

This project is for educational purposes. Respect API terms and copyrights.
