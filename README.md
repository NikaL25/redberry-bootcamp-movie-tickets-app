# Redberry Movie Tickets App

A modern React-based application for browsing movies, booking sessions, and managing user profiles.

---

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library for building interactive components |
| **TypeScript** | Type safety and better developer experience |
| **Vite** | Fast development server and build tool |
| **React Router DOM** | Client-side routing and navigation |
| **Redux Toolkit** | Centralized state management for auth, bookings, and UI state |
| **React Query** | Server‑state fetching, caching, and updates |
| **Axios** | HTTP client for API requests |
| **Tailwind CSS** | Utility‑first styling for rapid UI development |
| **clsx** | Simple className conditional joining |
| **lucide-react** | Icon set for the interface |
| **tailwind-merge** | Resolve Tailwind class conflicts |
| **tw-animate-css** | Simple CSS animations integrated with Tailwind |

---

## 🏗️ Architecture

The project follows a **feature‑based** folder structure:

```
src/
├─ api/          # API service functions (Axios instances, endpoints)
├─ app/          # Root component with modals (AppRoutes, AuthModal, BookingModal, ProfileModal)
├─ components/   # Reusable UI components
├─ features/     # Feature slices (auth, booking, movies, profile, sessions) + hooks
│   └─ auth/     # Auth state: token, user, modal logic, login/register flow
├─ hooks/        # Custom React hooks (useAuth, etc.)
├─ pages/        # Page components routed in the app
├─ routes/       # Route configuration and ProtectedRoute wrapper
├─ types/        # TypeScript type definitions (User model, ReplayAction, etc.)
└─ utils/        # Helper utilities
```

**State flow:**
- Global state (auth, bookings, UI modals) is managed with **Redux Toolkit**.
- Server data fetching and caching are handled by **React Query**.
- Protected routes use a custom `ProtectedRoute` component that checks authentication status before rendering.

---

## 🚀 Running Locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables** (if needed, check `.env` or `.env.example`)

   ```bash
   cp .env.example .env
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` (default Vite port).

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview the production build**

   ```bash
   npm run preview
   ```

---

## 🌐 Demo

Live demo is deployed at:

**https://redberry-bootcamp-movie-tickets-app.vercel.app/**

Feel free to explore the features, browse movies, and try the booking flow.

---

## 📝 Notes

- The project uses **Vite** with React 19 and **TypeScript** for type safety.
- State is persisted in `localStorage` (auth token) and managed centrally with Redux Toolkit.
- API calls go through **Axios** with automatic JSON transformation.
- Styling is done with **Tailwind CSS** – feel free to extend the config in `tailwind.config.ts` if present.

---

