# Investment-AI

## Description

This project aims to decide stock sentiment based on news rather than statistical analysis. We are testing to see if news data alone is powerful enough to trade on. One of the biggest shortcomings that most stock screeners or stock analysis applications have is a lack of transparency. They do not tell you why a stock has a 78% chance of increasing in value. Our application will help the end-user understand how and why we came to the analysis we did and what influenced our decision.

## Installation & Getting Started

### Prerequisites
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Create a free [Docker Hub account](https://hub.docker.com/signup)
3. Sign in to Docker Desktop with your Docker Hub account

### Setup
1. Clone the repository and navigate to the project directory:
   ```bash
   cd investment-ai
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```
Note: Initial setup will take a while to download the dependencies and start the server with supabase.
The application will be available at `http://localhost:3000`

## Features

- News-based analysis
- Statistical analysis
- Combination of the above

## Technologies Used

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Drizzle, PostgreSQL
- **Deployment**: Vercel

## API Endpoints

 - **List any API endpoints, their methods (GET, POST, etc.), and a brief description.**

## License

 - This project is licesed under the MIT License