import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  ArrowLeft, Sparkles, MapPin, Tag, Clock,
  User, Mail, AlertTriangle, CheckCircle, XCircle,
  Zap, Building2, FileText, MessageSquare
} from 'lucide-react';

const STATUSES = ['Pending', 'Resolved', 'Rejected'];

const priorityColor = (p) => {
  if (!p) return '#6366f1';
  if (p.toLowerCase().includes('high')) return '#ef4444';
  if (p.toLowerCase().includes('medium')) return '#f59e0b';
  return '#10b981';
};

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/complaints');
      const found = data.find((c) => c._id === id);
      if (!found) return setError('Complaint not found');
      setComplaint(found);
      setSelectedStatus(found.status);
    } catch (err) {
      setError('Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setStatusUpdating(true);
    setStatusSuccess('');
    try {
      const { data } = await api.put(`/complaints/${id}`, { status: selectedStatus });
      setComplaint(data);
      setStatusSuccess('Status updated successfully!');
      setTimeout(() => setStatusSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAiAnalyze = async () => {
    if (!complaint) return;
    setAiLoading(true);
    setAiError('');
    setAiResult(null);
    try {
      const { data } = await api.post('/ai/analyze', {
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
      });
      setAiResult(data);
    } catch (err) {
      setAiError(err.response?.data?.message || 'AI analysis failed');
    } finally {
      setAiLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const statusBadgeClass = (status) => {
    if (status === 'Resolved') return 'badge-resolved';
    if (status === 'Rejected') return 'badge-rejected';
    return 'badge-pending';
  };

  if (loading) return <div className="loader-container"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-error" style={{ maxWidth: '600px', margin: '2rem auto' }}>{error}</div>;
  if (!complaint) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Back Button */}
      <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Main Card */}
      <div style={{ background: 'var(--surface-color)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        {/* Gradient Banner */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', padding: '2rem', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <span className={`badge ${statusBadgeClass(complaint.status)}`} style={{ marginBottom: '0.75rem', display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)' }}>
                {complaint.status}
              </span>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{complaint.title}</h1>
              <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>Complaint ID: {complaint._id}</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Meta Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { icon: <User size={16} />, label: 'Complainant', value: complaint.name },
              { icon: <Mail size={16} />, label: 'Email', value: complaint.email },
              { icon: <Tag size={16} />, label: 'Category', value: complaint.category },
              { icon: <MapPin size={16} />, label: 'Location', value: complaint.location },
              { icon: <Clock size={16} />, label: 'Filed On', value: formatDate(complaint.createdAt) },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  {icon} {label}
                </div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, background: 'var(--bg-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              {complaint.description}
            </p>
          </div>

          {/* Update Status */}
          <div style={{ background: 'var(--bg-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Update Status</h3>
            {statusSuccess && <div className="alert alert-success">{statusSuccess}</div>}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select
                id="update-status-select"
                className="form-control"
                style={{ maxWidth: '220px' }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                id="update-status-btn"
                className="btn btn-primary"
                onClick={handleStatusUpdate}
                disabled={statusUpdating}
              >
                {statusUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>

          {/* AI Analysis */}
          <div>
            <button
              id="run-ai-analysis-btn"
              className="btn btn-primary"
              onClick={handleAiAnalyze}
              disabled={aiLoading}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)', fontSize: '1rem', padding: '0.75rem 1.5rem' }}
            >
              {aiLoading ? (
                <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Analyzing with AI...</>
              ) : (
                <><Sparkles size={20} /> Run AI Analysis</>
              )}
            </button>

            {aiError && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{aiError}</div>}

            {aiResult && (
              <div className="ai-analysis-card">
                <div className="ai-header">
                  <Sparkles size={24} style={{ color: '#7c3aed' }} />
                  AI Analysis Results
                </div>

                <div className="ai-grid">
                  <div className="ai-item">
                    <div className="ai-item-label"><Zap size={12} style={{ display: 'inline', marginRight: '4px' }} />Priority</div>
                    <div className="ai-item-value" style={{ color: priorityColor(aiResult.priority), fontWeight: 700, fontSize: '1.1rem' }}>
                      {aiResult.priority}
                    </div>
                  </div>
                  <div className="ai-item">
                    <div className="ai-item-label"><Building2 size={12} style={{ display: 'inline', marginRight: '4px' }} />Suggested Department</div>
                    <div className="ai-item-value">{aiResult.department}</div>
                  </div>
                  <div className="ai-item" style={{ gridColumn: '1 / -1' }}>
                    <div className="ai-item-label"><FileText size={12} style={{ display: 'inline', marginRight: '4px' }} />Complaint Summary</div>
                    <div className="ai-item-value">{aiResult.summary}</div>
                  </div>
                </div>

                <div className="ai-response">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary-color)' }}>
                    <MessageSquare size={18} /> Auto-Generated Response
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>
                    "{aiResult.autoResponse}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
