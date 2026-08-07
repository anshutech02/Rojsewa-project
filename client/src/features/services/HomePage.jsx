import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices, fetchCategories } from "../../store/serviceSlice.js";
import TextType from "../../components/ui/TextType.jsx";
import {
  Search,
  MapPin,
  Star,
  StarHalf,
  Shield,
  Clock,
  CheckCircle,
  BadgeCheck,
  LucideTruckElectric,
  
} from "lucide-react";
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
  const [pincodeFilter, setPincodeFilter] = useState("");
  const [isSearchSticky, setIsSearchSticky] = useState(false);

  // References for GSAP to target elements directly without triggering DOM thrashing
  const searchBarRef = useRef(null);
  const searchInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const pincodeInputRef = useRef(null);
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
          maxWidth: "720px",
          height: "44px",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        });

        // Tweak internal sizing mechanics
        gsap.to(searchInputRef.current, { fontSize: "14px", duration: 0.2 });
        gsap.to(cityInputRef.current, { fontSize: "12px", duration: 0.2 });
        gsap.to(pincodeInputRef.current, { fontSize: "12px", duration: 0.2 });

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
        gsap.to(pincodeInputRef.current, { fontSize: "16px", duration: 0.2 });
      }
    });

    return () => ctx.revert(); // Prevent animation memory leaks on component unmount
  }, [isSearchSticky]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const queryParams = {
      search: searchTerm,
      city: cityFilter,
      pincode: pincodeFilter,
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
        pincode: pincodeFilter,
      }),
    );

    const featuredSection = document.getElementById("featured-services");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 9);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />

      {/* Hero Section */}
     <section
  className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-zinc-950 bg-no-repeat bg-center"
  style={{
    backgroundImage: "url('/Firefly.jpg')",
    backgroundSize: "cover", // Shows the full image
  }}
>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="relative max-w-5xl mx-auto text-center flex flex-col gap-4 md:gap-6 items-center">
          <h1 className="text-4xl text-red-400  sm:text-6xl font-[Neue] font-extrabold  ">
            Find Trusted Local
          </h1>
          <div className=" text-3xl text-[#E6E6FA] sm:text-6xl font-[Neue] font-extrabold  min-h-[1.2em]">
            <TextType
              text={[
                "Service Providers",
                "Electricians",
                "Plumbers",
                "Carpenters",
                "AC Repair Experts",
                "Home Cleaning Services",
                "Beauty Professionals",
                "Mechanics",
              ]}
              typingSpeed={75}
              deletingSpeed={45}
              pauseDuration={1800}
              showCursor
              cursorCharacter="!"
        
              cursorBlinkDuration={0.5}
            />
          </div>
          <p className="text-base sm:text-lg   text-shadow-2xs font-[Neue] text-shadow-gray-950 max-w-2xl px-2">
            Book verified electricians, plumbers, water suppliers, and
            technicians in your neighborhood in just a few clicks.
          </p>

          {/* Persistent Anchor Container to prevent element jump */}
          <div className="max-w-3xl h-[146px] sm:h-[76px] mt-4">
            {isSearchSticky ? (
              /* ==========================================================================
       1. STICKY SEARCH BAR (Fixed to top on scroll)
       ========================================================================== */
              <div className="fixed top-[56px] sm:top-[64px] left-0 right-0 z-40 px-4 py-2 mt-1 transition-all duration-300">
                <form
                  ref={searchBarRef}
                  onSubmit={handleSearch}
                  className="mx-auto flex flex-row gap-2 items-center  p-2 rounded-2xl"
                >
                  {/* Search Term Input Field */}
                  <div className="flex-1 relative flex items-center border border-amber-50/40 px-1 sm:px-2 rounded-full w-full h-6 ">
                    <Search
                      className="text-zinc-100 shrink-0 hidden sm:block absolute transition-all duration-300"
                      size={16}
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent border-0 text-zinc-100 placeholder:text-zinc-400 focus:outline-none sm:pl-6 pl-1 py-0.5 text-[10px]"
                    />
                  </div>

                  {/* City Filter Layout Wrapper */}
                  <div className="relative  flex items-center border-1 rounded-full border-amber-50/40 px-1 sm:px-3 h-6 w-[70px]  sm:w-[200px] transition-all duration-300">
                    <MapPin
                      className="absolute hidden sm:block left-2 text-zinc-100 shrink-0"
                      size={14}
                    />
                    <input
                      ref={cityInputRef}
                      type="text"
                      placeholder="City"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="w-full bg-transparent border-0 text-zinc-100 placeholder:text-zinc-400 focus:outline-none truncate px-1 sm:pl-5 text-[12px]"
                    />
                  </div>

                  {/* Pincode Filter Layout Wrapper */}
                  <div className="relative flex items-center border-1 rounded-full border-amber-50/40 pl-1 pr-1 h-6 w-[70px] max-w-[80px] sm:w-[150px] transition-all duration-300">
                    <input
                      ref={pincodeInputRef}
                      type="text"
                      placeholder="Pincode"
                      value={pincodeFilter}
                      onChange={(e) => setPincodeFilter(e.target.value)}
                      className="w-full bg-transparent border-0 text-zinc-100 placeholder:text-zinc-400 focus:outline-none truncate pl-1 text-[12px]"
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
              <div className="relative px-0 -mt-8">
                <form
                  ref={searchBarRef}
                  onSubmit={handleSearch}
                  className="mx-auto flex flex-col sm:flex-row gap-2 glass !bg-white/60  p-2 rounded-2xl"
                >
                  {/* Search Input */}
                  <div className="relative flex items-center border-2 px-2 gap-2  rounded-full w-full">
                    <Search className=" text-zinc-900" size={18} />

                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="What service do you need?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent border-0 text-zinc-900 placeholder-zinc-500 focus:outline-none  py-3 text-sm md:text-base"
                    />
                  </div>

                  {/* City Input */}
                  <div className="relative flex items-center w-full sm:w-48 border-2 rounded-full gap-2 px-2 sm:pl-3">
                    <MapPin className=" text-zinc-900" size={18} />

                    <input
                      ref={cityInputRef}
                      type="text"
                      placeholder="City"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="w-full bg-transparent border-0 text-zinc-900 placeholder-zinc-500 focus:outline-none  pr-4 py-3 text-sm md:text-base"
                    />
                  </div>

                  {/* Pincode Input */}
                  <div className="relative flex items-center w-full sm:w-40 border-2 rounded-full px-2  sm:pl-3">
                    <input
                      ref={pincodeInputRef}
                      type="text"
                      placeholder="Pincode"
                      value={pincodeFilter}
                      onChange={(e) => setPincodeFilter(e.target.value)}
                      className="w-full bg-transparent border-0 text-zinc-900 placeholder-zinc-500 focus:outline-none pr-4 py-3 text-sm md:text-base"
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    ref={actionButtonRef}
                    type="submit"
                    aria-label="Submit Search"
                    className="w-full sm:w-auto flex items-center justify-center bg-indigo-600/80 hover:bg-indigo-700 text-white rounded-full px-5 py-2 transition-colors shadow-2xl hover:scale-0.8 inset-0.5"
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

      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-3xl font-bold tracking-tight">
              Browse by Category
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              Select a category to filter services
            </p>
          </div>

          {categories.length > 8 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              {showAllCategories ? "Show Less" : "See All"}
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div
        id="categories"
          className={`
      grid gap-3 md:gap-5
      grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8
      transition-all duration-300
    `}
        >
          {visibleCategories.map((cat) => (
            <Card
              key={cat._id}
              onClick={() => selectCategory(cat._id)}
              hoverEffect={
                selectedCategory !== cat._id
              } /* Disables generic hover if already active */
              className={`
    group relative w-full overflow-hidden
    flex flex-col items-center justify-between
    text-center p-3 md:p-5
    transition-all duration-300 ease-out

    ${
      selectedCategory === cat._id
        ? "border-indigo-500/80 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.02]"
        : "border-white/5 bg-white/[0.02]"
    }
  `}
            >
              {/* Modern Ambient Glow — Only active when category matches */}
              <div
                className={`
      absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent 
      opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
      ${selectedCategory === cat._id ? "opacity-40" : ""}
    `}
              />

              {/* Image or Fallback Icon Container */}
              <div className="relative z-10 w-full flex justify-center mb-3">
                {cat.image ? (
                  <>
                    <div className="w-28 h- md:w-full md:h-28 rounded-xl overflow-hidden bg-zinc-900/40 border border-white/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </>
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-zinc-800/50 border border-white/5 flex items-center justify-center text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <span>🔧</span>
                  </div>
                )}
              </div>

              {/* Category Name Typography */}
              <span
                className={`
      relative z-10 w-full
      text-[10px] md:text-sm font-medium 
      tracking-wide leading-snug line-clamp-2
      transition-colors duration-300

      ${selectedCategory === cat._id ? "text-indigo-300 font-semibold" : "text-zinc-400 group-hover:text-zinc-200"}
    `}
              >
                {cat.name}
              </span>
            </Card>
          ))}
        </div>

        {/* Mobile Show More Button */}
        {categories.length > 8 && (
          <div className="flex justify-center mt-6 ">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="
          px-5 py-2 rounded-full
          bg-white/5 border border-white/10
          text-sm text-zinc-300
          hover:bg-white/10
          transition-all
        "
            >
              {showAllCategories ? "Show Less" : "View More Categories"}
            </button>
          </div>
        )}
      </section>

      {/* Services Section */}
      <section
        id="featured-services"
        className="max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col items-center gap-8"
      >
        <h2 className="text-2xl font-bold tracking-tight gradient-text">
          Featured Services
        </h2>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {serviceList.map((service) => (
              <div
                key={service._id}
                className="relative flex flex-col shadow-xl justify-between h-full w-full max-w-[350px] overflow-hidden rounded-2xl border border-zinc-800/80 transition-all hover:border-indigo-500/30"
              >
                {/* Background Image */}
                {service?.category?.backgroundImage && (
                  <div className="absolute h-full w-full bg-green-100 inset-0 flex items-center justify-center">
                    <img
                      src={service.category.backgroundImage}
                      alt={service.category?.name}
                      className="h-full object-center overflow-hidden select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                )}

                {/* Optional Dark Overlay */}
                <div className="absolute inset-0 backdrop-blur-[0.2px]" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 glass !bg-white/10 p-1 rounded-md">
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-zinc-200">
                          {service.category?.name || "Service"}
                        </span>
                        {/* Verification Tag */}
                        {service?.provider?.isApproved && (
                          <span
                            className="flex items-center justify-center overflow-hidden rounded-full"
                            title="Verified Provider"
                          >
                            <img
                              src="/verified.gif"
                              alt="Verified Provider"
                              className="w-5 h-5"
                            />
                          </span>
                        )}
                      </div>

                      {service.isEmergency && (
                        <div className="glass !bg-white/10 p-1 rounded-full shadow-lg">
                          <span className="px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 animate-pulse">
                            Emergency
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg glass rounded-md !bg-white/30 p-1 font-bold text-zinc-900 leading-snug">
                      <Link
                        to={`/services/${service._id}`}
                        className="block w-full rounded-md p-1 transition-colors gradient-text hover:text-indigo-400 break-words"
                      >
                        <span className="line-clamp-2">{service.title}</span>
                      </Link>
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="flex items-center gap-1 text-zinc-800/80 text-[12px] rounded-xl overflow-hidden font-medium">
                        <img
                          src="/location.gif"
                          alt="Location"
                          className="w-5 h-5 object-contain flex-shrink-0"
                        />
                        <span className="line-clamp-1 text-[12px] font-bold text-taupe-950 glass px-2 py-1 !bg-white/40 rounded-md">
                          {service?.serviceArea?.city ||
                            "Location not available"}
                        </span>
                      </span>
                    </div>

                    <p className="text-sm text-zinc-900 line-clamp-2 border-2 border-amber-50 backdrop-blur-md p-1 rounded-md">
                      {service.description}
                    </p>
                  </div>

                  <div className="border-t border-zinc-700/70 mt-2 pt-4 flex items-center justify-between glass !bg-zinc-400/20 p-1 rounded-md">
                    <div className="flex flex-col">
                      <span className="text-lg px-2 font-extrabold gradient-text">
                        ₹{service.price}
                      </span>
                      <div className="flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-md">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, index) => {
                            const rating = service.provider?.rating || 0;

                            if (rating >= index + 1) {
                              return (
                                <Star
                                  key={index}
                                  size={14}
                                  className="fill-amber-400 text-amber-400"
                                />
                              );
                            }

                            if (rating >= index + 0.5) {
                              return (
                                <StarHalf
                                  key={index}
                                  size={14}
                                  className="fill-amber-400 text-amber-400"
                                />
                              );
                            }

                            return (
                              <Star
                                key={index}
                                size={14}
                                className="text-zinc-500"
                              />
                            );
                          })}
                        </div>

                        <span className="text-xs font-semibold text-zinc-800">
                          {service.provider?.rating
                            ? service.provider.rating.toFixed(1)
                            : "New"}
                        </span>
                      </div>
                    </div>

                    <Link to={`/services/${service._id}`}>
                      <Button className="p-1 text-[12px] bg-zinc-900 text-white hover:bg-indigo-500">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
