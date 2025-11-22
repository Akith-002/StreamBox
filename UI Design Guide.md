# StreamBox — Modern UI Design Guide

A contemporary movie streaming app built with React Native, featuring a glassmorphism aesthetic, vibrant gradients, smooth animations, and intelligent data visualization powered by the TMDB API.

This repository demonstrates a cohesive design system, polished screen flows, component patterns and API integrations used throughout the StreamBox app.

---

## Table of contents

- Overview
- Design System
- Screen Designs
- Animation & Interaction Patterns
- Responsiveness & Accessibility
- Component Patterns
- TMDB API Usage
- Future Enhancements
- Contributing
- License

---

## Overview

StreamBox is a UX-focused movie streaming demo implementation built with React Native. It emphasizes visual polish (glassmorphism), consistent typography and spacing, and well-defined interaction patterns. The app shows how to surface trending, top-rated and popular movies using the TMDB API while keeping a delightful, responsive UI and accessibility best practices in mind.

---

## Design System

All UI decisions are driven by a small, consistent design system so the application feels uniform across features and screens.

### Color palette

Primary accents and semantic colors used across the app:

Primary Colors:

- Primary: `#6366F1` (Indigo)
- Accent: `#EC4899` (Pink)
- Success: `#10B981` (Emerald)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

Semantic Colors:

- Background: `#0F172A` (Deep Blue-Black)
- Card / Surface: `#1E293B` (Slate)
- Border: `#334155` (Slate-600)
- Text Primary: `#F1F5F9` (Slate-100)
- Text Secondary: `#CBD5E1` (Slate-300)

### Typography

- Display: 32px, Bold
- Title XL: 28px, Bold
- Title: 24px, Bold
- Subtitle: 16px, Semi-bold
- Body: 14px, Regular
- Caption: 12px, Regular

### Spacing scale

- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- xxl: 32px

### Border radius

- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 20px
- Round: 50px

---

## Screen designs

The app includes multiple screens with a consistent visual language: Home, Details, Favorites, Login, Register, and Profile. Below is a condensed version of the design intent for each screen.

### 1) Home Screen

- Hero section with backdrop image + 40% dark gradient overlay
- Movie title, rating badge and CTA
- Animated carousel indicators with spring animation and 5s auto-rotation
- Sections: Trending Now, Top Rated, Popular Now (horizontal carousels)

Design notes: cards use glassmorphism, subtle borders, press micro-interactions and accessible safe-area spacing for notched devices.

### 2) Details Screen

- Sticky header with back and favorite toggle
- Poster with shadow, rating box, release year and runtime
- Content: tagline, genres (pills), stats grid, synopsis, production, popularity meter and large Add/Remove favorite CTA

### 3) Favorites Screen

- Title with counter
- 2-column grid of poster images
- Each item supports delete with a smooth fade-out animation and an empty-state view when no favourites exist

### 4) Login Screen

- Centered form on gradient background with film icon
- Username/password inputs + inline validation
- Demo credentials banner and sign up CTA

### 5) Register Screen

- Two-column first/last name inputs, username, email, and password fields
- Demo banner telling users registration is simulated in this sample app

### 6) Profile Screen

- Profile header with avatar, name, username and email
- Account information card and appearance settings (Dark Mode toggle) with logout CTA

---

## Animation & interaction patterns

- Hero Fade: 800ms fade-in overlay
- Indicator animation: active indicator expands (8px → 24px)
- Auto-rotation: 5s
- Press interactions: scale 0.98 + opacity 0.7 (200ms bounce easing)
- Loading states: skeletons, activity indicators, disabled + reduced opacity buttons

---

## Responsive behavior & accessibility

- Padding for safe areas / notched devices
- Portrait-first design; hero adapts in landscape
- Minimum touch target: 44x44pt
- Proper color contrast, screen reader friendly labels and keyboard navigation where applicable

---

## Component patterns

Common components are designed for reuse and accessibility:

- MovieCard: poster (130x195), 2-line truncation for title, optional rating overlay, press animations
- Input: left icon, placeholder, error message, touched validation and visual feedback
- Button: primary filled, outline, loading spinner, icon support and size variants

---

## TMDB API usage

Endpoints used in the app (examples):

- GET /trending/movie/week (Trending Now)
- GET /movie/popular (Popular)
- GET /movie/top_rated (Top rated)
- GET /movie/{id} (Details)
- GET /movie/{id}/credits (Cast — ready for future use)

Image base URLs:

- `https://image.tmdb.org/t/p/w500` (poster)
- `https://image.tmdb.org/t/p/w1280` (backdrop)

Implementation notes:

- Cache responses locally when possible and implement request queuing to avoid hitting rate limits.

---

## Future enhancements

1. Search (GET /search/movie)
2. Cast details (GET /movie/{id}/credits)
3. Recommendations (GET /movie/{id}/recommendations)
4. Reviews (GET /movie/{id}/reviews)
5. Watchlist + advanced collection management
6. Offline mode with background sync
7. Deep links for shareable movie pages

---

## Running the project

This project uses React Native and the repository includes components and screens ready to explore. If the app is built with Expo, run:

```bash
# install
npm install

# start Metro bundler
npm run start
```

If using bare React Native CLI, please follow the usual platform-specific instructions (Android/iOS) present in your local development environment.

---

## Contributing

Contributions are welcome — open an issue or submit a pull request describing the planned change. Keep changes aligned with the existing design system and style guidelines.

---

## Accessibility & testing notes

- Follow WCAG AA contrast guidelines
- Use accessible labels for icons and actionable controls
- Add tests for interactive components and cache/fallback behaviors

---

## License

This repository is provided as a design-focused demo. Make sure to check any included license file or project policy before re-using or redistributing resources.
