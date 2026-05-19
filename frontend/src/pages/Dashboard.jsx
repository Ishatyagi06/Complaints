import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Search, Filter, MapPin, Tag, Clock, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, Inbox
} from 'lucide-react';

const statusBadge = (status) => {
  const map = {
    Pending: 'badge-pending',
    Resolved: 'badge-resolved',
    Rejected: 'badge-rejected',
  };
  return map[status] || 'badge-pending';
};

const statusIcon = (status) => {
  if (status === 'Resolved') return <CheckCircle size={16} />;
  if (status === 'Rejected') return <XCircle size={16} />;
  return <AlertTriangle size={16} />;
};

const CATEGORIES = ['All', 'Water Supply', 'Electricity', 'Sanitation', 'Roads', 'Garbage', 'Other'];

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
      setFiltered(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchLocation.trim()) {
      return applyFilters(complaints, selectedCategory);
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/complaints/search?location=${searchLocation}`);
      setFiltered(
        selectedCategory === 'All'
          ? data
          : data.filter((c) => c.category === selectedCategory)
      );
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (source, category) => {
    if (category === 'All') {
      setFiltered(source);
    } else {
      setFiltered(source.filter((c) => c.category === category));
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    applyFilters(complaints, cat);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaints Dashboard</h1>
          <p className="text-secondary" style={{ marginTop: '0.25rem' }}>
            {filtered.length} complaint{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link to="/create" className="btn btn-primary">
          + File New Complaint
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Search by Location */}
        <div className="search-input" style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 1 }} />
          <input
            id="search-location"
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>
          <Search size={16} /> Search
        </button>
        <button className="btn btn-secondary" onClick={() => { setSearchLocation(''); setSelectedCategory('All'); fetchComplaints(); }}>
          Reset
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className="btn"
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              background: selectedCategory === cat ? 'var(--primary-color)' : 'var(--surface-color)',
              color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${selectedCategory === cat ? 'var(--primary-color)' : 'var(--border-color)'}`,
              fontWeight: selectedCategory === cat ? 600 : 400,
              transition: 'all 0.2s',
            }}
          >
            <Filter size={12} style={{ display: 'inline', marginRight: '4px' }} />
            {cat}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading */}
      {loading && (
        <div className="loader-container">
          <div className="spinner" />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Inbox size={56} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No complaints found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Try a different search or category, or file a new complaint.
          </p>
        </div>
      )}

      {/* Complaints Grid */}
      {!loading && (
        <div className="card-grid">
          {filtered.map((complaint) => (
            <Link
              to={`/complaints/${complaint._id}`}
              key={complaint._id}
              style={{ textDecoration: 'none' }}
            >
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">{complaint.title}</h3>
                    <p className="card-subtitle">{complaint.name} · {complaint.email}</p>
                  </div>
                  <span className={`badge ${statusBadge(complaint.status)}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {statusIcon(complaint.status)} {complaint.status}
                  </span>
                </div>

                <div className="card-body">
                  <p className="card-text">{complaint.description}</p>
                </div>

                <div className="card-footer">
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge badge-category" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Tag size={11} /> {complaint.category}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {complaint.location}
                    </span>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {formatDate(complaint.createdAt)}
                    <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
