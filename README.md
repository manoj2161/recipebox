# RecipeBox

A responsive recipe discovery and personal recipe management application built with React and Tailwind CSS. RecipeBox combines recipe search, discovery, saved recipes, and shopping-list functionality in a single user-focused interface.

## Live Demo

Add your deployed RecipeBox URL here.

## Features

- User signup and login flow
- User-specific saved recipes
- Recipe search using TheMealDB API
- Random recipe discovery
- Default recipe discovery by common categories/ingredients
- Recipe details and browsing experience
- Save and manage favorite recipes
- Shopping list functionality
- Responsive recipe carousel
- Pagination for recipe results
- Protected user-specific application areas
- Persistent data using `localStorage` and `sessionStorage`
- Responsive desktop, tablet, and mobile UI
- Mobile-friendly navigation/sidebar
- User avatar generated from the account name
- Toast notifications for user feedback

## Tech Stack

- React.js
- React Router
- Tailwind CSS
- JavaScript (ES6+)
- Axios
- Vite
- Lucide React
- React Hot Toast
- clsx
- TheMealDB API
- LocalStorage / SessionStorage

## API Integration

RecipeBox consumes recipe data from **TheMealDB API** through Axios. API requests are separated from UI components so the application can handle loading, results, and user interactions cleanly.

## Application Flow

```text
Login / Signup
      ↓
      Home
   ┌──┼──────────────┐
   ↓  ↓              ↓
Search  Discover   Saved Recipes
   ↓                   ↓
Recipe Details      Shopping List
```

## What I Practiced

This project focuses on practical React development: API integration with Axios, asynchronous data handling, routing, reusable components, browser storage, user-specific application data, responsive Tailwind layouts, pagination, carousels, and UI feedback.

## Getting Started

```bash
git clone https://github.com/manoj2161/recipebox.git
cd recipebox
npm install
npm run dev
```

The application will be available at the local Vite development URL shown in the terminal.

## Future Improvements

- Add a production backend with MongoDB
- Replace browser-based authentication with secure server-side authentication
- Synchronize saved recipes and shopping lists across devices
- Add recipe categories, advanced filtering, and dietary preferences
- Add recipe creation and editing from the application

## Author

**Manoj Kumar**

- GitHub: https://github.com/manoj2161
- Portfolio: https://manoj-portfolio-21.vercel.app/
- LinkedIn: https://www.linkedin.com/in/manoj-kumar-811245200
