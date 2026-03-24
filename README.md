# VerseLore (ReadList) - Book Reading Tracker

A full-stack web application for book lovers, students, and hobby readers to track and manage their reading journey. Built with React, Supabase, and Vite.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Components](#components)
- [Pages](#pages)
- [Styling](#styling)
- [Available Scripts](#available-scripts)

---

## Overview

VerseLore (formerly ReadList) helps users organize their reading journey by tracking:

-  Books currently being read
-  Books already finished
-  Books they wish to read

The application provides statistics, reading streaks, and progress tracking to encourage consistent reading habits.

---

## Features

### Authentication
- User registration and login with email/password
- Password reset functionality
- Protected routes for authenticated users
- Session management via Supabase Auth

### Book Management
- Add books manually or search via Google Books API
- Track reading progress (current page / total pages)
- Categorize books by status:
  - `want_to_read` - Books on the wishlist
  - `currently_reading` - Books in progress
  - `finished` - Completed books
- Update book details and metadata
- Delete books from library

### Reading Sessions
- Log reading sessions with duration and pages read
- Add notes to reading sessions
- Track reading activity over time

### Statistics & Analytics
- Total books read (all-time and yearly)
- Pages read statistics
- Reading streak tracking (consecutive days)
- Genre breakdown visualization
- Monthly reading charts

### User Profile
- View account information
- Change password
- Reading statistics summary
- Account management

---

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **React Router DOM 6** - Client-side routing
- **Supabase JS** - Backend client
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend (BaaS)
- **Supabase** - Backend-as-a-Service
  - Authentication
  - PostgreSQL Database
  - Row Level Security (RLS)

### Styling
- **CSS Modules** - Component-scoped styles
- **CSS Variables** - Design system
- **Tailwind CSS** (dev dependency) - Utility classes

---

## Project Structure

```
ReadList/
├── client/                      # Frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images, fonts, etc.
│   │   ├── components/          # Reusable React components
│   │   │   ├── auth/             # Authentication components
│   │   │   ├── books/            # Book-related components
│   │   │   ├── common/           # Shared UI components
│   │   │   └── stats/            # Statistics components
│   │   ├── context/              # React Context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utility libraries
│   │   ├── pages/                # Page components
│   │   │   └── auth/             # Auth page components
│   │   ├── services/             # API service modules
│   │   ├── styles/               # Global styles & variables
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Root styles
│   ├── .env.example              # Environment template
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration
├── package.json                  # Root package.json
└── README.md                      # This file
```

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier)
- Google Books API key (optional, for book search)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ReadList
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `client` directory:
   ```bash
   cp .env.example .env
   ```

5. **Configure Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings → API
   - Copy the **Project URL** and **anon key**
   - Add them to your `.env` file:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

6. **Set up the database**

   Run the following SQL in your Supabase SQL Editor to create the required tables:

   ```sql
   -- Books table
   CREATE TABLE books (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     google_books_id TEXT,
     title TEXT NOT NULL,
     author TEXT,
     description TEXT,
     cover_url TEXT,
     page_count INTEGER,
     isbn TEXT,
     published_year INTEGER,
     genre TEXT,
     status TEXT DEFAULT 'want_to_read' CHECK (status IN ('want_to_read', 'currently_reading', 'finished')),
     current_page INTEGER DEFAULT 0,
     format TEXT,
     started_at TIMESTAMP WITH TIME ZONE,
     finished_at TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Reading sessions table
   CREATE TABLE reading_sessions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     pages_read INTEGER,
     duration_minutes INTEGER,
     notes TEXT,
     session_date DATE DEFAULT CURRENT_DATE,
     session_time TIME DEFAULT CURRENT_TIME,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE books ENABLE ROW LEVEL SECURITY;
   ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

   -- Books policies
   CREATE POLICY "Users can only see their own books" 
     ON books FOR ALL 
     USING (auth.uid() = user_id);

   -- Reading sessions policies
   CREATE POLICY "Users can only see their own sessions" 
     ON reading_sessions FOR ALL 
     USING (auth.uid() = user_id);
   ```

7. **Start the development server**
   ```bash
   cd client
   npm run dev
   ```

8. **Open the application**
   
   Navigate to `http://localhost:5173` in your browser.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key | Yes |
| `VITE_GOOGLE_BOOKS_API_KEY` | Google Books API key for book search | No |

---

## Database Schema

### Books Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `google_books_id` | TEXT | Google Books identifier |
| `title` | TEXT | Book title |
| `author` | TEXT | Author name(s) |
| `description` | TEXT | Book description |
| `cover_url` | TEXT | Cover image URL |
| `page_count` | INTEGER | Total pages |
| `isbn` | TEXT | ISBN number |
| `published_year` | INTEGER | Publication year |
| `genre` | TEXT | Book genre |
| `status` | TEXT | Reading status |
| `current_page` | INTEGER | Current page position |
| `format` | TEXT | Book format (ebook, paperback, etc.) |
| `started_at` | TIMESTAMP | When reading started |
| `finished_at` | TIMESTAMP | When book was finished |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Reading Sessions Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `book_id` | UUID | Foreign key to books |
| `user_id` | UUID | Foreign key to auth.users |
| `pages_read` | INTEGER | Pages read in session |
| `duration_minutes` | INTEGER | Session duration |
| `notes` | TEXT | Session notes |
| `session_date` | DATE | Session date |
| `session_time` | TIME | Session time |
| `created_at` | TIMESTAMP | Record creation time |

---

## API Reference

### Authentication Service (`AuthContext`)

Located in [`src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx)

```javascript
const { user, loading, signup, login, logout, resetPassword, updatePassword, updateProfile } = useAuth()
```

| Method | Description |
|--------|-------------|
| `signup(email, password, metadata)` | Register new user |
| `login(email, password)` | Authenticate user |
| `logout()` | Sign out current user |
| `resetPassword(email)` | Send password reset email |
| `updatePassword(newPassword)` | Update user password |
| `updateProfile(updates)` | Update user metadata |

### Book Service

Located in [`src/services/bookService.js`](client/src/services/bookService.js)

```javascript
import { bookService } from '../services/bookService'
```

| Method | Description |
|--------|-------------|
| `getBooks(userId)` | Get all user books |
| `getBooksByStatus(userId, status)` | Filter by status |
| `getBookById(bookId)` | Get single book |
| `addBook(userId, bookData)` | Add new book |
| `updateBook(bookId, updates)` | Update book |
| `updateProgress(bookId, page)` | Update reading progress |
| `updateStatus(bookId, status)` | Change book status |
| `markAsFinished(bookId)` | Mark as finished |
| `deleteBook(bookId)` | Remove book |
| `searchBooks(userId, query)` | Search library |

### Session Service

Located in [`src/services/sessionService.js`](client/src/services/sessionService.js)

```javascript
import { sessionService } from '../services/sessionService'
```

| Method | Description |
|--------|-------------|
| `logSession(sessionData)` | Log reading session |
| `getSessions(bookId)` | Get sessions for book |
| `getUserSessions(userId)` | Get all user sessions |
| `deleteSession(sessionId)` | Remove session |

### Stats Service

Located in [`src/services/statsService.js`](client/src/services/statsService.js)

```javascript
import { statsService } from '../services/statsService'
```

| Method | Description |
|--------|-------------|
| `getReadingStats(userId)` | Get overall statistics |
| `getReadingStreak(userId)` | Calculate streak days |
| `getMonthlyBreakdown(userId, months)` | Monthly breakdown |

---

## Components

### Common Components

Located in [`src/components/common/`](client/src/components/common/)

| Component | Description |
|-----------|-------------|
| [`Button.jsx`](client/src/components/common/Button.jsx) | Reusable button with variants |
| [`Card.jsx`](client/src/components/common/Card.jsx) | Content container card |
| [`Input.jsx`](client/src/components/common/Input.jsx) | Form input component |
| [`Loading.jsx`](client/src/components/common/Loading.jsx) | Loading spinner |
| [`Modal.jsx`](client/src/components/common/Modal.jsx) | Dialog modal |
| [`Navbar.jsx`](client/src/components/common/Navbar.jsx) | Navigation header |
| [`Toast.jsx`](client/src/components/common/Toast.jsx) | Notification toast |
| [`Tooltip.jsx`](client/src/components/common/Tooltip.jsx) | Hover tooltip |

### Auth Components

Located in [`src/components/auth/`](client/src/components/auth/)

| Component | Description |
|-----------|-------------|
| [`AuthLayout.jsx`](client/src/components/auth/AuthLayout.jsx) | Auth page layout wrapper |
| [`ProtectedRoute.jsx`](client/src/components/auth/ProtectedRoute.jsx) | Route guard for authenticated pages |

### Book Components

Located in [`src/components/books/`](client/src/components/books/)

| Component | Description |
|-----------|-------------|
| [`AddBookModal.jsx`](client/src/components/books/AddBookModal.jsx) | Modal to add new book |
| [`BookCard.jsx`](client/src/components/books/BookCard.jsx) | Book display card |
| [`BookList.jsx`](client/src/components/books/BookList.jsx) | List of books |
| [`BookSearch.jsx`](client/src/components/books/BookSearch.jsx) | Google Books search |

### Stats Components

Located in [`src/components/stats/`](client/src/components/stats/)

| Component | Description |
|-----------|-------------|
| [`GoalProgress.jsx`](client/src/components/stats/GoalProgress.jsx) | Reading goal tracker |
| [`ReadingStreak.jsx`](client/src/components/stats/ReadingStreak.jsx) | Streak display |
| [`StatsChart.jsx`](client/src/components/stats/StatsChart.jsx) | Chart visualizations |

---

## Pages

Located in [`src/pages/`](client/src/pages/)

| Page | Route | Description |
|------|-------|-------------|
| [`Home.jsx`](client/src/pages/Home.jsx) | `/` | Dashboard with stats & currently reading |
| [`Library.jsx`](client/src/pages/Library.jsx) | `/library` | User's book collection |
| [`SearchBooks.jsx`](client/src/pages/SearchBooks.jsx) | `/search` | Search & add books |
| [`Stats.jsx`](client/src/pages/Stats.jsx) | `/stats` | Reading statistics |
| [`Profile.jsx`](client/src/pages/Profile.jsx) | `/profile` | User settings |
| [`Login.jsx`](client/src/pages/auth/Login.jsx) | `/login` | Login page |
| [`Signup.jsx`](client/src/pages/auth/Signup.jsx) | `/signup` | Registration page |
| [`ForgotPassword.jsx`](client/src/pages/auth/ForgotPassword.jsx) | `/forgot-password` | Password reset request |
| [`ResetPassword.jsx`](client/src/pages/auth/ResetPassword.jsx) | `/reset-password` | New password entry |

---

## Styling

### Design System

The project uses a custom design system with a "Blush Antique Rose" color palette.

Located in [`src/styles/variables.css`](client/src/styles/variables.css)

#### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background | Champagne | `#FBEAD6` |
| Surface | White | `#FFFFFF` |
| Surface Alt | Blush | `#F0C4CB` |
| Primary | Dried Thyme | `#131410` |
| Accent | Antique Rose | `#C87D87` |
| Secondary | Bisque | `#E5BCA9` |

### Global Styles

Located in [`src/styles/global.css`](client/src/styles/global.css)

Includes:
- CSS Reset
- Base typography
- Utility classes
- Component base styles
- Responsive breakpoints

### Component Styles

Each component uses CSS Modules (`.module.css` files) for scoped styling.

---

## Available Scripts

### Root Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client dev server |
| `npm start` | Alias for dev |

### Client Scripts

Run from `client/` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## License

MIT License

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
