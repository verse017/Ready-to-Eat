import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import API_BASE from '../api';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRestaurants = () => {
    setLoading(true);
    axios.get(API_BASE)
      .then(response => {
        setRestaurants(response.data);
        setError('');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not connect to backend server. Make sure it is running on port 5000.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const deleteRestaurant = (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    axios.delete(`${API_BASE}/${id}`)
      .then(() => {
        setRestaurants(prev => prev.filter(r => r._id !== id));
      })
      .catch(err => {
        console.error(err);
        alert('Failed to delete restaurant.');
      });
  };

  const filtered = restaurants.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.cuisine && r.cuisine.toLowerCase().includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="page-wrapper">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Restaurants in Kathmandu</h1>
          <p className="page-subtitle">Hand-picked dining spots, authentic local flavours, and world cuisines</p>
        </div>
        <Link to="/add" className="btn btn-primary">+ Add New Spot</Link>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by restaurant name, cuisine, or location (e.g. Thamel, Italian, Newari)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={fetchRestaurants} className="btn btn-outline-sm">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading restaurants...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No restaurants found matching your criteria.</p>
          {searchTerm ? (
            <button onClick={() => setSearchTerm('')} className="btn btn-secondary-sm">Clear Search</button>
          ) : (
            <Link to="/add" className="btn btn-primary">Add the First Restaurant</Link>
          )}
        </div>
      ) : (
        <div className="restaurant-grid">
          {filtered.map(restaurant => (
            <article className="restaurant-card" key={restaurant._id}>
              <div className="card-image-wrap">
                <img
                  src={restaurant.image || DEFAULT_IMAGE}
                  alt={restaurant.name}
                  className="card-image"
                  onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                  loading="lazy"
                />
                <div className="rating-pill">
                  <span className="star-icon">★</span>
                  <span>{Number(restaurant.rating).toFixed(1)}</span>
                </div>
              </div>

              <div className="card-content">
                <div className="card-top">
                  <span className="cuisine-tag">{restaurant.cuisine}</span>
                  <span className="location-text">{restaurant.location}</span>
                </div>
                <h2 className="card-title">{restaurant.name}</h2>
                <p className="card-description">{restaurant.description || 'No description available.'}</p>
                
                <div className="card-footer">
                  <Link to={`/edit/${restaurant._id}`} className="btn-link">Edit</Link>
                  <button
                    onClick={() => deleteRestaurant(restaurant._id, restaurant.name)}
                    className="btn-link btn-link-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default RestaurantList;
