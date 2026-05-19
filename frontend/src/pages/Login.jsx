import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="text-center mb-6">
        <div style={{ display: 'inline-flex', background: 'var(--primary-color)', color: 'white', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
          <LogIn size={32} />
        </div>
        <h2 className="page-title mb-2">Welcome Back</h2>
        <p className="text-secondary">Sign in to manage your complaints</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group mb-8">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-6 text-secondary" style={{ fontSize: '0.875rem' }}>
        Don't have an account? <Link to="/register" className="text-primary" style={{ fontWeight: 600 }}>Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
