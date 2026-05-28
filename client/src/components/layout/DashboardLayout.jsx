import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import Card from '../ui/Card.jsx';

const DashboardLayout = ({ title, sidebarLinks, children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 flex flex-col gap-4">
            <Card hoverEffect={false} className="p-4 flex flex-col gap-2">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-3 mb-2">
                {title || 'Menu'}
              </h2>
              {sidebarLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`
                  }
                >
                  {link.icon && <link.icon size={16} />}
                  {link.label}
                </NavLink>
              ))}
            </Card>
          </aside>

          {/* Main Dashboard Content */}
          <section className="lg:col-span-3 flex flex-col gap-6">
            {children}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
