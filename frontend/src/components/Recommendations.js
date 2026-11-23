import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import API_BASE from '../api';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';

function Recommendations() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/recommendations`)
      .then(response => {
        setRestaurants(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not fetch recommendations. Please check server.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Top Recommendations</h1>
          <p className="page-subtitle">Highest rated culinary gems across Kathmandu Valley rated 4.0 and above</p>
        </div>
        <Link to="/add?from=recommendations" className="btn btn-primary">+ Suggest a Place</Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading recommendations...</div>
      ) : restaurants.length === 0 ? (
        <div className="empty-state">
          <p>No highly rated spots recorded yet.</p>
          <Link to="/add" className="btn btn-primary">Add a Top Recommendation</Link>
        </div>
      ) : (
        <div className="restaurant-grid">
          {restaurants.map((restaurant, index) => (
            <article className="restaurant-card recommended-card" key={restaurant._id}>
              <div className="card-image-wrap">
                <img
                  src={restaurant.image || DEFAULT_IMAGE}
                  alt={restaurant.name}
                  className="card-image"
                  onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                  loading="lazy"
                />
                <div className="rating-pill rating-pill-highlight">
                  <span className="star-icon">★</span>
                  <span>{Number(restaurant.rating).toFixed(1)}</span>
                </div>
                <div className="rank-tag">#{index + 1} Choice</div>
              </div>

              <div className="card-content">
                <div className="card-top">
                  <span className="cuisine-tag">{restaurant.cuisine}</span>
                  <span className="location-text">{restaurant.location}</span>
                </div>
                <h2 className="card-title">{restaurant.name}</h2>
                <p className="card-description">{restaurant.description || 'No description provided.'}</p>
                
                <div className="card-footer">
                  <span className="curated-badge">Top Rated</span>
                  <Link to={`/edit/${restaurant._id}`} className="btn-link">Edit Details</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;
