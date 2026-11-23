# Ready to Eat — Kathmandu Restaurant Recommendation Website

A minimalist, modern MERN stack web application for discovering and recommending top dining spots in and around Kathmandu Valley.

## Key Features

- **10 Curated Kathmandu Restaurants** with high-resolution food & atmosphere photography.
- **Top Recommendations** page showcasing culinary spots rated 4.0 and above.
- **Minimalist Aesthetic** — clean typography, subtle neutral borders, zero tacky emojis or garish colors.
- **Search & Filter** — quickly search restaurants by name, cuisine (Italian, Newari, Middle Eastern, etc.), or location (Thamel, Jhamsikhel, Dilli Bazar, etc.).
- **Reliable Add & Edit** — full validation, inline feedback, photo preview, and sample photo presets.
- **Full CRUD Support** — view, add, edit, and delete restaurants.

## Project Structure

```
ready-to-eat/
├── package.json              # Root package (runs concurrently)
├── README.md
├── backend/
│   ├── package.json
│   ├── .env                  # MongoDB Atlas connection string
│   ├── server.js             # Express server with resilient DB handling
│   ├── seedData.js           # 10 curated Kathmandu restaurants with images
│   ├── models/
│   │   └── Restaurant.js     # Mongoose schema (with image field)
│   └── routes/
│       └── restaurants.js    # CRUD and recommendations endpoints
└── frontend/
    ├── package.json          # React, Axios, React Router DOM
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js            # Minimalist navigation
        ├── App.css           # Clean, minimalist design system
        └── components/
            ├── RestaurantList.js    # All restaurants with search & cards
            ├── Recommendations.js   # Top rated restaurants
            ├── AddRestaurant.js     # Add new spot with photo picker
            └── EditRestaurant.js    # Edit restaurant details
```

## Running the Application

### 1. Start the Backend
Open a terminal in `ready-to-eat/backend`:
```bash
cd backend
npm start
```
*Server runs on port 5000.*

### 2. Start the Frontend
Open a second terminal in `ready-to-eat/frontend`:
```bash
cd frontend
npm start
```
*Frontend runs on port 3000.*
