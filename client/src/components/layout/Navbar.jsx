import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice.js';
import Button from '../ui/Button.jsx';
import { LogOut, User, ClipboardList, ShieldAlert, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.success('Logged out successfully');
        navigate('/');
      })
      .catch((err) => toast.error(err));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter gradient-text">ROZSEVA</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.role === 'provider' && (
                <Link to="/provider">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LayoutDashboard size={14} /> Dashboard
                  </Button>
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-2 text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
                    <ShieldAlert size={14} /> Admin
                  </Button>
                </Link>
              )}

              <Link to="/bookings">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ClipboardList size={14} /> My Bookings
                </Button>
              </Link>

              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User size={14} /> Profile
                </Button>
              </Link>

              <Button variant="secondary" size="sm" onClick={handleLogout} className="gap-2 text-zinc-400 hover:text-white">
                <LogOut size={14} /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Join as Provider</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
