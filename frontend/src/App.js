import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import AddRestaurant from './components/AddRestaurant';
import EditRestaurant from './components/EditRestaurant';
import Recommendations from './components/Recommendations';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="navbar">
          <div className="nav-container">
            <Link to="/" className="navbar-brand">Ready to Eat</Link>
            <nav className="nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                All Restaurants
              </NavLink>
              <NavLink to="/recommendations" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Recommendations
              </NavLink>
              <NavLink to="/add" className={({ isActive }) => isActive ? 'nav-link active add-btn' : 'nav-link add-btn'}>
                + Add Restaurant
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<RestaurantList />} />
            <Route path="/add" element={<AddRestaurant />} />
            <Route path="/edit/:id" element={<EditRestaurant />} />
            <Route path="/recommendations" element={<Recommendations />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Ready to Eat — Curated Restaurant Recommendations for Kathmandu</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
