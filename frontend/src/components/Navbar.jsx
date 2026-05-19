import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <ShieldAlert size={28} />
        SmartComplaint
      </Link>
      
      <div className="navbar-links">
        {userInfo ? (
          <>
            <Link to="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={18} /> New Complaint
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
