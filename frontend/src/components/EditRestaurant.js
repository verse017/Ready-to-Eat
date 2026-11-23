import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

import API_BASE from '../api';

function EditRestaurant() {
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('4.5');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/${id}`)
      .then(response => {
        const data = response.data;
        setName(data.name || '');
        setCuisine(data.cuisine || '');
        setLocation(data.location || '');
        setRating(String(data.rating || '4.5'));
        setDescription(data.description || '');
        setImage(data.image || '');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg('Failed to fetch restaurant details.');
        setLoading(false);
      });
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      name: name.trim(),
      cuisine: cuisine.trim(),
      location: location.trim(),
      rating: parseFloat(rating) || 4.0,
      description: description.trim(),
      image: image.trim()
    };

    setSubmitting(true);

    try {
      await axios.put(`${API_BASE}/update/${id}`, payload);
      setSuccessMsg('Restaurant updated successfully!');
      setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update restaurant: ' + (err.response?.data?.error || err.message));
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading restaurant details...</div>;
  }

  return (
    <div className="form-page-wrapper">
      <div className="form-container">
        <div className="form-header">
          <Link to="/" className="back-link">← Back to list</Link>
          <h1 className="page-title">Edit Restaurant</h1>
          <p className="page-subtitle">Update restaurant information, rating, or photo</p>
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
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Location *</label>
              <input
                type="text"
                required
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Rating</label>
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

          {image && (
            <div className="image-preview-box">
              <span className="preview-label">Image Preview:</span>
              <img
                src={image}
                alt="Preview"
                className="preview-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-block"
            >
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRestaurant;
