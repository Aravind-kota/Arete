# Aretē - The Book Exploration Platform

Aretē is a modern, premium web application for exploring and purchasing used books. It features a sophisticated frontend built with Next.js and a robust backend built with NestJS, offering a seamless user experience for book lovers.

## Project Structure

This repository is organized into two main applications:

- **Frontend**: A Next.js 16 application using Tailwind CSS for styling, focusing on a responsive, high-performance UI with skeletal loading and server-side rendering.
- **Backend**: A NestJS application handling product data, web scraping (from World of Books), and API endpoints.

## Features

- **Dynamic Product Catalog**: Browse fictional, non-fictional, and rare books with real-time data.
- **Advanced Scraping**: The backend intelligently scrapes and normalizes product data from external sources.
- **Skeletal Loading**: Optimized user experience with skeletal screens during data fetching.
- **Responsive Design**: Fully responsive interface catering to desktop and mobile users.
- **Search & Filtering**: Efficient search by title, author, or ISBN, along with category-based filtering.

## Getting Started

To get the project running locally, you need to start both the frontend and backend servers.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Arete
    ```

2.  **Install dependencies**:
    You need to install dependencies for both the frontend and backend.

    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

### Running the Application

It is recommended to run the backend first, as the frontend relies on its API.

1.  **Start the Backend**:
    Open a terminal and navigate to the `backend` directory:
    ```bash
    cd backend
    npm run start:dev
    ```
    The backend server will start at `http://localhost:3000`.

2.  **Start the Frontend**:
    Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend server will start at `http://localhost:3001` (or 3000 if the port is free).

## Tech Stack

-   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide React, SWR.
-   **Backend**: NestJS, TypeORM, SQLite/PostgreSQL (configurable), Cheerio/Puppeteer (for scraping).

## License

[MIT](LICENSE)
