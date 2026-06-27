import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices, fetchCategories } from "../../store/serviceSlice.js";
import { Search, MapPin, Star, Shield, Clock } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Navbar from "../../components/layout/Navbar.jsx";
import Footer from "../../components/layout/Footer.jsx";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const HomePage = () => {
  const dispatch = useDispatch();
  const { serviceList, categories, loading } = useSelector(
    (state) => state.services,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [isSearchSticky, setIsSearchSticky] = useState(false);

  // References for GSAP to target elements directly without triggering DOM thrashing
  const searchBarRef = useRef(null);
  const searchInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const actionButtonRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchServices());

    const handleScroll = () => {
      if (window.scrollY > 160) {
        setIsSearchSticky(true);
      } else {
        setIsSearchSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  // GSAP Animation Engine Layer
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isSearchSticky) {
        // Morph Outer Form Element into a compact, minimalist pill
        gsap.to(searchBarRef.current, {
          backgroundColor: "rgba(39, 39, 42, 0.9)", // zinc-900 with clear opacity
          borderRadius: "9999px",
          paddingTop: "0.25rem",
          paddingBottom: "0.25rem",
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
          maxWidth: "640px",
          height: "44px",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        });

        // Tweak internal sizing mechanics
        gsap.to(searchInputRef.current, { fontSize: "14px", duration: 0.2 });
        gsap.to(cityInputRef.current, { fontSize: "12px", duration: 0.2 });

        // Smoothly fade-in the miniature navigation action trigger icon
        if (actionButtonRef.current) {
          gsap.fromTo(
            actionButtonRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(1.5)" },
          );
        }
      } else {
        // Revert form back to spacious glassy layout
        gsap.to(searchBarRef.current, {
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: "1rem", // rounded-2xl
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
          maxWidth: "48rem", // max-w-3xl
          height: "auto",
          boxShadow: "none",
          duration: 0.3,
          ease: "power2.inOut",
        });

        gsap.to(searchInputRef.current, { fontSize: "16px", duration: 0.2 });
        gsap.to(cityInputRef.current, { fontSize: "16px", duration: 0.2 });
      }
    });

    return () => ctx.revert(); // Prevent animation memory leaks on component unmount
  }, [isSearchSticky]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const queryParams = {
      search: searchTerm,
      city: cityFilter,
    };
    dispatch(fetchServices(queryParams));
    const featuredSection = document.getElementById("featured-services");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectCategory = (categoryId) => {
    const nextCat = selectedCategory === categoryId ? "" : categoryId;
    setSelectedCategory(nextCat);
    dispatch(
      fetchServices({
        search: searchTerm,
        category: nextCat,
        city: cityFilter,
      }),
    );

    const featuredSection = document.getElementById("featured-services");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-zinc-950 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/downloa.jpg')` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="relative max-w-5xl mx-auto text-center flex flex-col gap-4 md:gap-6 items-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Find Trusted Local{" "}
            <span className="gradient-text">Service Providers</span>
          </h1>
          <p className="text-base sm:text-lg text-shadow-orange-200 max-w-2xl px-2">
            Book verified electricians, plumbers, water suppliers, and
            technicians in your neighborhood in just a few clicks.
          </p>

          {/* Persistent Anchor Container to prevent element jump */}
          <div className="max-w-3xl h-[146px] sm:h-[76px] mt-4">
            {isSearchSticky ? (
              /* ==========================================================================
       1. STICKY SEARCH BAR (Fixed to top on scroll)
       ========================================================================== */
              <div className="fixed top-[56px] sm:top-[64px]  left-0 right-0 z-40 px-4 py-2 transition-all duration-300">
                <form
                  ref={searchBarRef}
                  onSubmit={handleSearch}
                  className="mx-auto flex flex-row gap-2 items-center"
                >
                  {/* Search Term Input Field */}
                  <div className="flex-1 relative flex items-center w-full h-full min-w-0">
                    <Search
                      className="text-zinc-200 shrink-0 absolute left-2 transition-all duration-300"
                      size={16}
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent border-0 text-zinc-100 placeholder-zinc-300 focus:outline-none pl-8 pr-2 py-0.5 text-[8px]"
                    />
                  </div>

                  {/* City Filter Layout Wrapper */}
                  <div className="relative flex items-center border-l border-zinc-800 pl-2 pr-1 h-6 max-w-[90px] sm:max-w-[140px] transition-all duration-300">
                    <MapPin
                      className="absolute left-2 text-zinc-200 shrink-0"
                      size={14}
                    />
                    <input
                      ref={cityInputRef}
                      type="text"
                      placeholder="City"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="w-full bg-transparent border-0 text-zinc-100 placeholder-zinc-300 focus:outline-none truncate pl-6 text-sm"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    ref={actionButtonRef}
                    type="submit"
                    className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-full transition-colors ml-1 shrink-0 h-7 w-7 sm:h-8 sm:w-8 shadow-md"
                    aria-label="Submit Search"
                  >
                    <Search size={14} />
                  </button>
                </form>
              </div>
            ) : (
              /* ==========================================================================
       2. NON-STICKY SEARCH BAR (Standard Inline Layout)
       ========================================================================== */
              <div className="relative px-0">
                <form
                  ref={searchBarRef}
                  onSubmit={handleSearch}
                  className="mx-auto flex flex-col sm:flex-row gap-2 glass p-2 rounded-2xl"
                >
                  {/* Search Input */}
                  <div className="relative flex items-center w-full">
                    <Search
                      className="absolute left-3 text-zinc-200"
                      size={18}
                    />

                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="What service do you need?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent border-0 text-zinc-100 placeholder-zinc-300 focus:outline-none pl-10 pr-4 py-3 text-sm md:text-base"
                    />
                  </div>

                  {/* City Input */}
                  <div className="relative flex items-center w-full sm:w-48 sm:border-l border-zinc-700 sm:pl-3">
                    <MapPin
                      className="absolute left-3 sm:left-5 text-zinc-200"
                      size={18}
                    />

                    <input
                      ref={cityInputRef}
                      type="text"
                      placeholder="City"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="w-full bg-transparent border-0 text-zinc-100 placeholder-zinc-300 focus:outline-none pl-10 sm:pl-12 pr-4 py-3 text-sm md:text-base"
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    ref={actionButtonRef}
                    type="submit"
                    aria-label="Submit Search"
                    className="
        w-full sm:w-auto
        flex items-center justify-center
        bg-indigo-600 hover:bg-indigo-700
        text-white rounded-xl
        px-5 py-2
        transition-colors
        shadow-md shrink-0
      "
                  >
                    Search
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col gap-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Browse by Category
          </h2>
          <p className="text-zinc-500 text-xs md:text-sm">
            Select a category to filter the services list
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Card
              key={cat._id}
              onClick={() => selectCategory(cat._id)}
              className={`flex flex-col items-center gap-3 md:gap-4 p-3 md:p-4 justify-center text-center cursor-pointer transition-all duration-300 backdrop-blur-md rounded-xl md:rounded-2xl border ${
                selectedCategory === cat._id
                  ? "border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/20 text-white scale-[1.02]"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 text-zinc-300"
              }`}
            >
              <span className="text-2xl md:text-3xl drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)]">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-lg"
                  />
                ) : (
                  "🔧"
                )}
              </span>
              <span className="text-[10px] md:text-xs font-semibold tracking-wide transition-colors">
                {cat.name}
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section
        id="featured-services"
        className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8"
      >
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
            <p className="text-sm">
              Try tweaking your search terms or category filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceList.map((service) => (
              <Card
                key={service._id}
                className="flex flex-col h-full justify-between gap-4 border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      {service.category?.name || "Service"}
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
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="border-t border-zinc-800/80 pt-4 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 font-medium">
                      Starting from
                    </span>
                    <span className="text-lg font-extrabold text-indigo-400">
                      ₹{service.price}
                    </span>
                  </div>
                  <Link to={`/services/${service._id}`}>
                    <Button variant="outline" size="sm">
                      Book Now
                    </Button>
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
