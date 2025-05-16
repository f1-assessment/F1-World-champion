# F1 World Champions

A comprehensive web application for exploring Formula 1 World Champions from 2005 to the present day.

## Features

- View all F1 World Champions from 2005 to the present
- Explore detailed season information and race results
- Analyze championship statistics through interactive charts
- Responsive design for both web and mobile devices
- Dark and light mode support

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Chart.js
- Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/f1-champions.git
   cd f1-champions
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/f1champions?schema=public"
   ```
   Replace `username` and `password` with your PostgreSQL credentials.

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Source

This application uses the Jolpica F1 API (successor to the Ergast API) to fetch Formula 1 data. The data is then stored in a PostgreSQL database using Prisma ORM for efficient querying and persistence.

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and API client
- `/prisma`: Database schema and migrations

## License

This project is licensed under the MIT License.