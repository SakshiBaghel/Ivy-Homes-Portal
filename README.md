# Ivy Homes Portal

### Pune Real Estate Market Explorer

A React-based real estate dashboard for exploring, filtering, auditing, and visualizing Pune property data. The application includes client-side validation and fallback handling for inconsistencies between the API documentation and the actual running service.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
git clone <repository-url>
cd Ivy-Homes-Portal
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=https://solve.ivy.homes/v1/
VITE_API_KEY=YOUR_API_KEY
```

Run the application:

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## 🔍 API Findings & Handling

Testing the API through Postman and raw payload inspection revealed several differences from the documentation:

### Authentication
- **Docs:** API key as a query parameter.
- **Actual:** Requests require `X-API-Key` and Bearer authentication headers.
- **Handled by:** Centralized API wrapper.

### Token Expiry
- **Docs:** Tokens valid for 24 hours with no refresh flow.
- **Actual:** Access tokens expire after 15 minutes and return `401`.
- **Handled by:** Refresh flow using the undocumented `/auth/refresh` endpoint.

### Pagination
- **Docs:** `page` and `page_size`.
- **Actual:** `limit`, `offset`, `total`, and `has_more`.
- **Handled by:** Custom offset-based pagination loader, allowing retrieval of 3,500+ records.

### Incorrect Endpoints
- `/v1/listing/{id}` → `/v1/listings/{id}`
- `/v1/favourites` → `/v1/saved`
- Saved listings require `listing_id` instead of `id`.

### Filtering & Data Validation
Server-side furnishing filters were unreliable, and inactive listings (`is_live: false`) could still be returned.

The application therefore applies important filters and validation **client-side**, including explicit `is_live === true` checks.

### Pricing
Project pricing fields were returned in inconsistent units:
- `price_min` → Lakhs
- `price_max` → Crores

Normalization logic was added before using these values in the UI and analytics.

### Data Sanitization
An unexpected prompt-injection-style string was found inside the amenities data of project `P30004`. API strings are therefore treated as untrusted input and sanitized before processing.

### Analytics
`GET /v1/analytics/summary` returned `404`.

Required analytics such as median prices and locality/BHK breakdowns are calculated client-side from the aggregated dataset.

### Rate Limiting
Bulk requests triggered `429 Too Many Requests`.

The application uses controlled batching and request pacing to avoid excessive API traffic.

---

## ✅ Additional API Checks

The following were tested and found to work correctly:

- Standard Bearer token authentication
- `project_id` relationships between listings and projects
- Case-insensitive locality matching

---

## 📈 Future Improvements

Given two additional days, I would focus on:

- Request queue with exponential backoff for `429` responses
- IndexedDB / TanStack Query caching
- Interactive property map using Leaflet or Mapbox
- Jest and Playwright test coverage

---

## 🛠️ Tech Stack

- React
- Vite
- JavaScript
- REST APIs
- Postman
- Dynamic data visualization

## 🔒 Security

Never commit API credentials to the repository. Keep them in `.env` and add the file to `.gitignore`.

```gitignore
.env
.env.local
```

## Demo
https://drive.google.com/drive/folders/12HZ6vfVO7igW9ODoAnYAqXYiBvsuyw9A?usp=drive_link