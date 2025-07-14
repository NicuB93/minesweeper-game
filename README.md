# 💣 Minesweeper Game - Full Stack Application

A modern full-stack Minesweeper game built with React (frontend) and NestJS (backend), featuring real-time gameplay, leaderboards, and session persistence.

## 🎮 Features

- **Full-stack Architecture**: React frontend with NestJS backend
- **Real-time Gameplay**: Live timer and game state management
- **Smart Leaderboard**: Only prompts for name if score qualifies for top 10
- **Session Persistence**: Continue your game after page refresh
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Database Persistence**: PostgreSQL with Prisma ORM
- **API Integration**: TanStack Query for seamless data management

## 🛠 Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for build tooling
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **TanStack Query** for API state management

### Backend

- **NestJS** with TypeScript
- **Prisma** ORM for database management
- **PostgreSQL** database
- **Docker** for containerization
- **Class Validator** for input validation

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v20.19.0 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Getting Started

### Quick Start (Recommended)

For the fastest setup, use the automated quick start script:

```bash
# Make sure you're in the minesweeper-game directory
./quick-start.sh
```

This script will:

- Install all dependencies for both frontend and backend
- Start the PostgreSQL database with Docker
- Set up the database with Prisma migrations
- Start both servers automatically

### Manual Setup

If you prefer to set up manually or encounter issues with the quick start script:

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd minesweeper-game
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd minesweeper-be
```

#### Install Dependencies

```bash
npm install
```

#### Set Up Environment Variables

Create a `.env` file in the `minesweeper-be` directory:

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/minesweeper"

# Application
PORT=3000
NODE_ENV=development
```

#### Start PostgreSQL Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL container on port 5432.

#### Run Database Migrations

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Optional: View database with Prisma Studio
npx prisma studio
```

#### Start the Backend Server

```bash
npm run start:dev
```

The backend server will start on `http://localhost:3000`.

### 3. Set Up the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd minesweeper-fe
```

#### Install Dependencies

```bash
npm install
```

#### Set Up Environment Variables

Create a `.env` file in the `minesweeper-fe` directory:

```bash
VITE_BE_API_URL=http://localhost:3000
```

#### Start the Frontend Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`.

## 🎯 How to Play

1. **Start a New Game**: Click "New Game" to begin
2. **Reveal Cells**: Left-click to reveal cells
3. **Flag Mines**: Right-click to flag suspected mines
4. **Win Condition**: Reveal all non-mine cells
5. **Leaderboard**: If your time qualifies for top 10, you'll be prompted to enter your name

## 📁 Project Structure

```
minesweeper-game/
├── minesweeper-be/          # Backend (NestJS)
│   ├── src/
│   │   ├── game-sessions/   # Game session management
│   │   ├── game-results/    # Leaderboard management
│   │   ├── prisma/         # Prisma service
│   │   └── common/         # Shared types and utilities
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   ├── docker-compose.yml  # PostgreSQL container
│   └── package.json
│
├── minesweeper-fe/          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   └── MinesweeperGame/  # Game components
│   │   └── hooks/
│   │       └── api/        # API hooks (TanStack Query)
│   └── package.json
│
└── README.md               # This file
```

## 🔧 Development Commands

### Root Directory Commands (Convenience)

```bash
# Quick setup and start everything
npm run setup

# Start backend only
npm run start:backend

# Start frontend only
npm run start:frontend

# Build both applications
npm run build:backend
npm run build:frontend

# Database management
npm run db:start        # Start PostgreSQL with Docker
npm run db:stop         # Stop PostgreSQL
npm run db:reset        # Reset database (deletes all data)
npm run db:studio       # Open Prisma Studio
```

### Backend Commands

```bash
# Development server
npm run start:dev

# Production build
npm run build

# Run tests
npm run test

# Database commands
npx prisma generate        # Generate Prisma client
npx prisma migrate dev     # Run migrations
npx prisma studio         # Open database GUI
npx prisma db seed        # Run database seeding (if configured)
```

### Frontend Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Docker Commands

```bash
# Start PostgreSQL database
docker-compose up -d

# Stop database
docker-compose down

# View database logs
docker-compose logs postgres

# Reset database (caution: deletes all data)
docker-compose down -v
docker-compose up -d
```

## 🗃 Database Schema

### Game Sessions

Stores active game states with board configuration and progress.

### Game Results

Stores completed game results for the leaderboard.

## 🚀 Production Deployment

### Backend Deployment

1. Build the application:

```bash
npm run build
```

2. Set production environment variables
3. Run database migrations:

```bash
npx prisma migrate deploy
```

4. Start the production server:

```bash
npm run start:prod
```

### Frontend Deployment

1. Build the application:

```bash
npm run build
```

2. Serve the `dist` folder using a web server (nginx, Apache, etc.)

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Ensure Docker is running
   - Check if PostgreSQL container is up: `docker ps`
   - Verify DATABASE_URL in `.env` file

2. **Port Already in Use**

   - Backend: Change PORT in `.env` file
   - Frontend: Vite will automatically suggest an alternative port

3. **CORS Issues**

   - Ensure frontend URL is allowed in backend CORS configuration
   - Check VITE_BACKEND_URL in frontend `.env`

4. **Session Storage Issues**
   - Clear browser session storage if experiencing persistence issues
   - Check browser console for any storage-related errors

### Reset Everything

If you encounter issues, you can reset the entire setup:

```bash
# Stop all services
docker-compose down -v

# Clean node modules (in both directories)
rm -rf node_modules package-lock.json
npm install

# Restart database and run migrations
docker-compose up -d
npx prisma migrate reset
npx prisma generate
```

## 📝 License

This project is licensed under the MIT License.

## 🎉 Enjoy Playing

Have fun playing Minesweeper and competing for the top spots on the leaderboard! 💣🏆
