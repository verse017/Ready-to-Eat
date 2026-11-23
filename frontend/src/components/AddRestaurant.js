import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import API_BASE from '../api';

const SAMPLE_IMAGES = [
  { label: 'Pizza & Italian', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80' },
  { label: 'Nepali Feast', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Himalayan Momos', url: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cafe & Coffee', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80' },
];

function AddRestaurant() {
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('4.5');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !cuisine.trim() || !location.trim()) {
      setErrorMsg('Please fill in Name, Cuisine, and Location.');
      return;
    }

    const payload = {
      name: name.trim(),
      cuisine: cuisine.trim(),
      location: location.trim(),
      rating: parseFloat(rating) || 4.0,
      description: description.trim(),
      image: image.trim() || SAMPLE_IMAGES[0].url
    };

    setSubmitting(true);

    try {
      const res = await axios.post(`${API_BASE}/add`, payload);
      setSuccessMsg('Restaurant added successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err) {
      console.error(err);
      const serverError = err.response?.data?.error || err.message;
      setErrorMsg(`Failed to add restaurant: ${serverError}. Please check that backend is running.`);
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-container">
        <div className="form-header">
          <Link to="/" className="back-link">← Back to list</Link>
          <h1 className="page-title">Add Restaurant</h1>
          <p className="page-subtitle">Add a new restaurant recommendation in or around Kathmandu</p>
        </div>

        {errorMsg && (
          <div className="alert alert-error">
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="minimal-form">
          <div className="form-group">
            <label className="form-label">Restaurant Name *</label>
            <input
              type="text"
              required
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fire and Ice Pizzeria"
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Cuisine Type *</label>
              <input
                type="text"
                required
                className="form-control"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g. Italian / Pizza, Nepali, Middle Eastern"
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Location in/near Kathmandu *</label>
              <input
                type="text"
                required
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Thamel, Kathmandu or Jhamsikhel, Lalitpur"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Rating (1.0 to 5.0)</label>
              <select
                className="form-control"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5.0">5.0 — Exceptional</option>
                <option value="4.8">4.8 — Outstanding</option>
                <option value="4.5">4.5 — Excellent</option>
                <option value="4.2">4.2 — Very Good</option>
                <option value="4.0">4.0 — Good</option>
                <option value="3.5">3.5 — Average</option>
                <option value="3.0">3.0 — Fair</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                className="form-control"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="preset-images-group">
            <span className="preset-label">Or pick a sample photo:</span>
            <div className="preset-buttons">
              {SAMPLE_IMAGES.map((sample, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={`preset-btn ${image === sample.url ? 'active' : ''}`}
                  onClick={() => setImage(sample.url)}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {image && (
            <div className="image-preview-box">
              <span className="preview-label">Selected Image Preview:</span>
              <img
                src={image}
                alt="Preview"
                className="preview-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Description & Highlights</label>
            <textarea
              className="form-control textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this place special? Specialty dishes, atmosphere, seating..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-block"
            >
              {submitting ? 'Adding Restaurant...' : 'Save Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRestaurant;
