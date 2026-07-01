# Medium Blog Retriever API

A full-stack web application and REST API that retrieves Medium articles for a given username, stores them in MongoDB, and exposes the collected archive through a developer-friendly JSON endpoint.

The deployed application is available at:

- Web app: https://medium-blogs-retriever-api.onrender.com/
- API base URL: `https://medium-blogs-retriever-api.onrender.com/api`
- Source repository: https://github.com/aman-shahi-dev/medium-blogs-retriever-api

## Overview

Medium Blog Retriever turns a public Medium profile into a reusable API. Enter a Medium username in the UI, or call the API directly, and the service returns the user's posts with metadata such as title, URL, publication date, author, tags, excerpt, thumbnail, and stored content.

For a first-time username, the backend performs a full historical scrape with Puppeteer, persists the results in MongoDB, enriches the data from the user's Medium RSS feed, and returns the normalized post list. For returning usernames, responses are served from cache or MongoDB while a background RSS sync keeps recent posts fresh.

## Features

- Fetch all known posts for a public Medium username.
- Generate a stable JSON endpoint per Medium user.
- Store scraped and parsed article metadata in MongoDB.
- Enrich posts with RSS metadata such as publication dates, categories, excerpts, and thumbnails.
- Cache API responses in memory for faster repeat reads.
- Run background RSS syncs for previously requested users.
- Serve the React frontend and Express API from one production service.
- Provide a clean UI with dark/light mode, article cards, direct Medium links, and copyable API snippets.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Client | React 19, Vite, Tailwind CSS |
| Server | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Scraping | Puppeteer |
| Caching | node-cache |
| Deployment target | Render-compatible Node service |

## Architecture

```text
Client search / API request
        |
        v
Express API: GET /api/posts/:username
        |
        +--> 10-minute in-memory cache hit
        |
        +--> MongoDB lookup
        |
        +--> First-time user:
        |       Puppeteer profile scrape
        |       MongoDB upsert by Medium post ID
        |       RSS enrichment
        |
        +--> Returning user:
                Immediate DB response
                Background RSS sync
```

## Repository Structure

```text
.
├── client/
│   ├── src/
│   │   ├── App.jsx          # Main React UI
│   │   ├── index.css        # Tailwind entry styles
│   │   └── main.jsx         # React bootstrap
│   ├── index.html
│   ├── package.json
│   └── vite.config.js       # Dev proxy for /api -> localhost:5000
├── server/
│   ├── config/
│   │   └── dbConnection.js  # MongoDB connection
│   ├── models/
│   │   └── Post.js          # Mongoose post schema
│   ├── routes/
│   │   └── posts.js         # API routes
│   ├── services/
│   │   ├── mediumService.js # DB, scrape, and RSS sync orchestration
│   │   └── scraperService.js# Puppeteer profile scraper
│   ├── utils/
│   │   ├── rssParser.js     # RSS XML parsing helpers
│   │   └── urlHelper.js     # Medium post ID extraction
│   ├── index.js             # Express app entrypoint
│   └── package.json
├── .puppeteerrc.cjs         # Chrome cache directory for deployment
└── package.json             # Monorepo scripts
```

## API Reference

### Health Check

```http
GET /api/ping
```

Example response:

```json
{
  "status": "alive"
}
```

### Fetch Posts By Username

```http
GET /api/posts/:username
```

Fetches posts for a Medium user. The username is normalized to lowercase.

Example:

```bash
curl https://medium-blogs-retriever-api.onrender.com/api/posts/amanshahidev
```

Example success response:

```json
{
  "success": true,
  "data": {
    "username": "amanshahidev",
    "postCount": 12,
    "posts": [
      {
        "username": "amanshahidev",
        "postId": "abc123def456",
        "title": "Example Medium Article",
        "link": "https://medium.com/@amanshahidev/example-article-abc123def456",
        "pubDate": "2026-01-15T10:00:00.000Z",
        "author": "Aman Shahi",
        "categories": ["javascript", "web-development"],
        "excerpt": "A short plain-text preview of the article...",
        "thumbnail": "https://miro.medium.com/...",
        "content": "<p>Article content from RSS when available.</p>"
      }
    ]
  }
}
```

Example 404 response:

```json
{
  "success": false,
  "message": "No posts found for user @username or user does not exist."
}
```

Example 500 response:

```json
{
  "success": false,
  "message": "An error occurred while fetching Medium posts",
  "error": "Error details"
}
```

## Client Integration

```js
const username = "amanshahidev";

const response = await fetch(
  `https://medium-blogs-retriever-api.onrender.com/api/posts/${username}`,
);

const result = await response.json();

if (!result.success) {
  throw new Error(result.message);
}

console.log(`Retrieved ${result.data.postCount} posts`);
console.log(result.data.posts);
```

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection string
- Chrome/Chromium support for Puppeteer

### Installation

```bash
git clone https://github.com/aman-shahi-dev/medium-blogs-retriever-api.git
cd medium-blogs-retriever-api
npm run install-all
```

Create `server/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
npm start
```

In a second terminal, start the frontend:

```bash
npm run dev --prefix client
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so the frontend can call `/api/posts/:username` without hard-coding the backend URL.

## Production Deployment

The project is designed to run as a single Node service in production. The Express server serves the compiled React app from `client/dist` and mounts API routes under `/api`.

Recommended production commands:

```bash
npm run install-all
npm run build
npm start
```

Required environment variables:

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string used by Mongoose. |
| `PORT` | Platform-dependent | Port for the Express server. Render and similar platforms usually inject this automatically. |
| `NODE_ENV` | Recommended | Set to `production` so Express serves `client/dist`. |

Render-style configuration:

```text
Build command: npm run install-all && npm run build
Start command: npm start
```

The root `build` script builds the client and installs the Puppeteer Chrome browser binary. `.puppeteerrc.cjs` stores Puppeteer's browser cache inside the project so the browser can survive the build/runtime handoff on platforms such as Render.

## Data Model

Posts are stored in MongoDB with a unique `postId` extracted from the Medium URL.

| Field | Type | Notes |
| --- | --- | --- |
| `username` | String | Lowercase Medium username, indexed. |
| `postId` | String | Unique Medium post identifier, indexed. |
| `title` | String | Article title. |
| `link` | String | Canonical Medium article URL. |
| `pubDate` | Date | Publication date when available from RSS. |
| `author` | String | RSS author or username fallback. |
| `categories` | String[] | Medium RSS categories/tags. |
| `excerpt` | String | Plain-text excerpt generated from RSS content. |
| `thumbnail` | String | Featured image URL when available. |
| `content` | String | RSS HTML content when available. |

## Runtime Behavior

- First request for a new username can take 30-60 seconds because Puppeteer loads the public Medium profile and scrolls through historical posts.
- Repeat requests are faster because data is served from the 10-minute in-memory cache or MongoDB.
- Returning usernames trigger a non-blocking RSS sync after the response is sent.
- A background scheduler runs every 30 minutes and syncs RSS feeds for all known users.
- The API currently allows cross-origin requests from all origins through the default CORS middleware.

## Production Readiness Notes

Before using this service with persistent production data, review the following items:

- `server/config/dbConnection.js` currently calls `Post.deleteMany({})` after connecting to MongoDB. Remove this line before any production deployment where stored data must persist across restarts.
- Add rate limiting to protect the scraper endpoint from abuse and expensive first-time requests.
- Restrict CORS if the API is intended for a known frontend or private consumers.
- Add structured request logging and error monitoring.
- Move long-running first-time scrapes to a queue if traffic grows.
- Add automated tests for RSS parsing, post ID extraction, route behavior, and scraper fallbacks.
- Consider adding OpenAPI documentation for API consumers.
- Medium page structure can change; monitor scraper success rates and keep selectors resilient.

## Troubleshooting

### `Server connection failed. Make sure backend is running.`

The frontend could not reach `/api`. Confirm the backend is running on port `5000` during local development and that `client/vite.config.js` is proxying `/api` correctly.

### First request is slow

This is expected for a new username. The backend performs a full Puppeteer scrape before saving the user archive.

### No posts found

The username may not exist, the profile may not expose public posts, Medium may have changed the page structure, or the request may have been blocked upstream.

### Puppeteer cannot launch Chrome

Run the browser install step from the server package:

```bash
npm run install-chrome --prefix server
```

On Linux deployment targets, make sure the environment supports Chromium dependencies and that Puppeteer can run with the existing `--no-sandbox` launch arguments.

## Scripts

| Command | Description |
| --- | --- |
| `npm run install-all` | Installs server dependencies and client dependencies. |
| `npm run build` | Builds the React client and installs Puppeteer's Chrome browser. |
| `npm start` | Starts the Express server from `server/index.js`. |
| `npm run dev --prefix client` | Starts the Vite development server. |
| `npm run lint --prefix client` | Runs ESLint for the client package. |
| `npm run install-chrome --prefix server` | Installs Chrome for Puppeteer. |

## Security Considerations

- Do not commit `.env` files or database credentials.
- The API returns article content and metadata from public Medium pages/RSS feeds only.
- The service does not currently implement authentication, quotas, or per-client request limits.
- Scraping third-party websites may be subject to their terms and rate limits; use responsibly.

## License

The server package declares the `ISC` license in `server/package.json`. Add a repository-level `LICENSE` file before distributing or accepting external contributions.

## Author

Developed by [Aman Shahi](https://github.com/aman-shahi-dev).
