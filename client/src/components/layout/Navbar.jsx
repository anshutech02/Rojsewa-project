import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice.js';
import Button from '../ui/Button.jsx';
import {
  LogOut,
  User,
  ClipboardList,
  ShieldAlert,
  LayoutDashboard,
  Menu,
  X,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';
import NotificationTray from '../shared/NotificationTray.jsx';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/favicon.png"
            alt="ROZSEVA Logo"
            className="h-10 w-10 rounded-full"
          />
          <span className=" md:text-2xl font-black tracking-wide gradient-text">
          ROJSEWA
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.role === 'provider' && (
                <Link to="/provider">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Button>
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    <ShieldAlert size={14} />
                    Admin
                  </Button>
                </Link>
              )}

              {user?.role === 'customer' ? (
                <Link to="/bookings">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ClipboardList size={14} />
                    My Bookings
                  </Button>
                </Link>
              ) : null}

              <NotificationTray />

              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User size={14} />
                  Profile
                </Button>
              </Link>
              {/* Logout button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-zinc-400 hover:text-white"
              >
                <LogOut size={14} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="primary" size="sm">
                  Join as Provider
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0  md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 ">
          <div className="flex flex-col gap-3 ">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Home size={16} />
                    Home
                  </Button>
                </Link>
                {user?.role === 'provider' && (
                  <Link
                    to="/provider"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Button>
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <ShieldAlert size={16} />
                      Admin
                    </Button>
                  </Link>
                )}

                <Link
                  to="/bookings"
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <ClipboardList size={16} />
                    {user?.role === 'admin' ? 'All Bookings' : 'My Bookings'}
                  </Button>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <User size={16} />
                    Profile
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
              
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="primary" className="w-full">
                    Join as Provider
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      
      
    </header>
  );
};

export default Navbar;