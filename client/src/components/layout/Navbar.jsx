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
} from 'lucide-react';
import toast from 'react-hot-toast';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter gradient-text">
            ROZSEVA
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

              <Link to="/bookings">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ClipboardList size={14} />
                  My Bookings
                </Button>
              </Link>

              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User size={14} />
                  Profile
                </Button>
              </Link>

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
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4">
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
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
                    My Bookings
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