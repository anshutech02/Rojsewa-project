import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, fetchCategories } from '../../store/serviceSlice.js';
import { Search, MapPin, Star, Shield, Clock } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const { serviceList, categories, loading } = useSelector((state) => state.services);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchServices());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = {
      search: searchTerm,
      category: selectedCategory,
      city: cityFilter,
    }
    dispatch(fetchServices(queryParams));
  };

  const selectCategory = (categoryId) => {
    const nextCat = selectedCategory === categoryId ? '' : categoryId;
    setSelectedCategory(nextCat);
    dispatch(fetchServices({
      search: searchTerm,
      category: nextCat,
      city: cityFilter,
    }));

    //go to featured-services section
    const featuredSection = document.getElementById('featured-services');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }

  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="relative max-w-5xl mx-auto text-center flex flex-col gap-6 items-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Find Trusted Local <span className="gradient-text">Service Providers</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Book verified electricians, plumbers, water suppliers, and technicians in your neighborhood in just a few clicks.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl glass p-3 rounded-2xl flex flex-col md:flex-row gap-2 mt-4">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="What service do you need?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border-0 text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
            </div>
            <div className="w-full md:w-48 relative flex items-center border-t md:border-t-0 md:border-l border-zinc-800 md:pl-2">
              <MapPin className="absolute left-3 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Enter city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border-0 text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
            </div>
            <Button type="submit" variant="primary">Search</Button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
          <p className="text-zinc-500 text-sm">Select a category to filter the services list</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Card
              key={cat._id}
              onClick={() => selectCategory(cat._id)}
              className={`flex flex-col items-center gap-3 p-4 justify-center text-center cursor-pointer transition-all duration-300 border ${
                selectedCategory === cat._id 
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-600/10' 
                  : 'border-zinc-800/80'
              }`}
            >
              <span className="text-3xl">{cat.icon || '🔧'}</span>
              <span className="text-xs font-semibold tracking-wide text-zinc-300">{cat.name}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id='featured-services' className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8">
        <h2 className="text-2xl font-bold tracking-tight">Featured Services</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass rounded-2xl h-64 shimmer" />
            ))}
          </div>
        ) : serviceList.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-zinc-500 flex flex-col gap-2 items-center">
            <span className="text-4xl">🔍</span>
            <h3 className="font-bold text-zinc-300">No Services Found</h3>
            <p className="text-sm">Try tweaking your search terms or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceList.map((service) => (
              <Card key={service._id} className="flex flex-col h-full justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      {service.category?.name || 'Service'}
                    </span>
                    {service.isEmergency && (
                      <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[9px] uppercase font-bold tracking-widest text-red-400">
                        Emergency
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100 hover:text-indigo-400 transition-colors">
                    <Link to={`/services/${service._id}`}>{service.title}</Link>
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">{service.description}</p>
                </div>

                <div className="border-t border-zinc-800/80 pt-4 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 font-medium">Starting from</span>
                    <span className="text-lg font-extrabold text-indigo-400">₹{service.price}</span>
                  </div>
                  <Link to={`/services/${service._id}`}>
                    <Button variant="outline" size="sm">Book Now</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
