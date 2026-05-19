import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FileText } from 'lucide-react';

const CATEGORIES = ['Water Supply', 'Electricity', 'Sanitation', 'Roads', 'Garbage', 'Other'];
const STATUSES = ['Pending', 'Resolved', 'Rejected'];

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
    category: '',
    location: '',
    status: 'Pending',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/complaints', form);
      setSuccess('Complaint filed successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', color: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}>
          <FileText size={28} />
        </div>
        <div>
          <h1 className="page-title">File a Complaint</h1>
          <p className="text-secondary">Submit a new complaint for review</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface-color)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Row 1: Name & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name <span style={{ color: 'red' }}>*</span></label>
              <input
                id="complaint-name"
                type="text"
                name="name"
                className="form-control"
                placeholder="Rahul Kumar"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address <span style={{ color: 'red' }}>*</span></label>
              <input
                id="complaint-email"
                type="email"
                name="email"
                className="form-control"
                placeholder="rahul@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2: Title */}
          <div className="form-group">
            <label className="form-label">Complaint Title <span style={{ color: 'red' }}>*</span></label>
            <input
              id="complaint-title"
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Water Leakage Issue"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 3: Description */}
          <div className="form-group">
            <label className="form-label">Description <span style={{ color: 'red' }}>*</span></label>
            <textarea
              id="complaint-description"
              name="description"
              className="form-control"
              rows={5}
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 4: Category & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category <span style={{ color: 'red' }}>*</span></label>
              <select
                id="complaint-category"
                name="category"
                className="form-control"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Location <span style={{ color: 'red' }}>*</span></label>
              <input
                id="complaint-location"
                type="text"
                name="location"
                className="form-control"
                placeholder="e.g. Ghaziabad"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 5: Status */}
          <div className="form-group">
            <label className="form-label">Initial Status</label>
            <select
              id="complaint-status"
              name="status"
              className="form-control"
              value={form.status}
              onChange={handleChange}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="submit-complaint">
              {loading ? (
                <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Submitting...</>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
