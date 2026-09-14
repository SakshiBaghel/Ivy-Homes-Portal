Real Estate Dashboard (Pune Market Explorer)
A high-performance React application built to explore, filter, audit, and visualize real estate datasets for Pune. This dashboard bridges critical official API documentation gaps with robust client-side fallback handling, data validation layers, and dynamic charting analytics.

🚀 How to Run It
1. Prerequisites
Ensure you have Node.js (v18+) and npm installed on your system.

2. Environment Setup
Create a .env file in the root directory of the project to configure your environment variables:

Code snippet
VITE_API_BASE_URL=https://solve.ivy.homes/v1/
VITE_API_KEY=IVY26-0DD40C14CD1F
3. Installation & Execution
Open your terminal and run the following commands:

Bash
# Clone the repository
git clone <repository-url>
cd real-estate-dashboard

# Install dependencies
npm install

# Start the local development server
npm run dev
Open your browser and navigate to http://localhost:5173.

🔍 How We Worked Out What to Distrust in the Docs (And What We Did About It)
Relying blindly on the official API documentation caused immediate integration failures. Through systematic endpoint testing, Postman validation, and raw payload inspection, we uncovered and handled several major discrepancies:

Authentication Header Requirement:

Doc Claim: Append the API key as a query parameter (?api_key=...).

Reality: Requests failed with missing X-API-Key header.

Action Taken: Configured the global API wrapper to pass authentication keys strictly via HTTP headers (X-API-Key and Authorization: Bearer).

Token Expiry & Undocumented Refresh Flow:

Doc Claim: Tokens remain valid for 24 hours with no refresh mechanism.

Reality: Access tokens expire in 15 minutes (900 seconds), throwing 401 errors pointing to an undocumented POST /auth/refresh endpoint.

Action Taken: Stored both access and refresh tokens securely and implemented a token handling fallback flow.

Pagination Structure Mismatch:

Doc Claim: Page-based pagination (page and page_size).

Reality: Server uses offset-based pagination (limit, offset, total, and has_more).

Action Taken: Built a custom loop pagination loader tracking offsets to successfully pull the entire 3,500+ record inventory without truncation.

Incorrect Endpoint Routes & Payloads:

/v1/listing/{id} (singular) returned 404 Not Found; corrected to plural /v1/listings/{id}.

/v1/favourites returned 404 Not Found; corrected to /v1/saved requiring the payload key listing_id instead of id.

Ignored Server-Side Filters & Completeness:

Passing furnishing query parameters was silently ignored by the server. Furthermore, inactive records (is_live: false) were returned despite documentation claims of server-side exclusion.

Action Taken: Implemented robust client-side filter handlers and enforced explicit checks for is_live === true.

Project Pricing Units & Adversarial Prompt Injections:

price_min was returned in Lakhs (float) and price_max in Crores (float) instead of raw integer rupees. Additionally, a hidden adversarial prompt injection string was discovered embedded in project P30004's amenities list.

Action Taken: Added normalization wrappers for project pricing logic and sanitized strings to bypass adversarial evaluation traps.

Missing Analytics Summary Endpoint:

GET /v1/analytics/summary returned 404 Not Found.

Action Taken: Computed all metrics (medians, breakdowns by locality and BHK) dynamically client-side from the aggregated raw dataset.

Rate Limiting & Throttling Under Heavy Load:

Reality: High-frequency parallel requests fetching thousands of items triggered HTTP 429 Too Many Requests errors.

Action Taken: Implemented controlled batching and offset pacing to keep network traffic compliant with server constraints.

✅ What We Checked That Turned Out to be Fine (Hypotheses That Did Not Pan Out)
Investigating false alarms provides key insights into system resilience. Several initial suspicions turned out to be completely accurate as documented:

Standard Bearer Token Execution: We initially worried that custom header scopes might fail or reject standard JWT structures, but token verification worked cleanly across all endpoints.

Relational Foreign Key Consistency: We hypothesized that joining listings with parent builder projects via project_id might result in orphan references or broken mappings. Testing confirmed strong relational integrity.

Locality Query Parameter Matching: We tested lowercase parameter passing (?locality=aundh) and verified that server-side text matching functioned reliably without case-sensitivity bugs.

📈 What I Would Do With Another Two Days (Focus on Scalability & Rate Limiting)
Given 48 additional hours, the architecture would be scaled and hardened with the following priorities:

Client-Side Rate Limiting & Concurrency Queues:

Implement a token-bucket algorithm or exponential backoff retry mechanism (utilizing libraries like p-limit) to gracefully handle HTTP 429 Too Many Requests responses during bulk synchronization.

Add intelligent request batching and queuing to optimize network throughput under heavy multi-tab usage.

Offline-First Caching Layer: Integrate IndexedDB or TanStack Query to cache fetched dataset chunks locally, reducing redundant network roundtrips and enabling instant page transitions.

Interactive Map View: Embed Leaflet.js or Mapbox to plot property coordinates (latitude and longitude), allowing users to explore Pune properties geographically.

Automated Testing Suite: Establish comprehensive unit and integration testing using Jest and Playwright to safeguard custom filters and data normalizers against regression.