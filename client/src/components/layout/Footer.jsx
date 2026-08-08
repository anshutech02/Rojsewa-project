import React, { useState } from "react";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiGithub,
  FiArrowUpRight,
} from "react-icons/fi";
import {Link} from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log("Subscribed:", email);
    setEmail("");
  };
  const socialLinks = [
    
    {
      Icon: FiTwitter,
      link: "https://x.com/AjitLalRana",
      hover: "group-hover:text-sky-500",
    },
    {
      Icon: FiInstagram,
      link: "https://www.instagram.com/ajitlalrana/",
      hover: "group-hover:text-pink-500",
    },
    {
      Icon: FiLinkedin,
      link: "https://www.linkedin.com/in/ajit-lal-rana/",
      hover: "group-hover:text-blue-500",
    },
    {
      Icon: FiGithub,
      link: "#",
      hover: "group-hover:text-white",
    },
  ];

  return (
    <footer className="bg-neutral-900/50 text-neutral-300 pt-16 pb-8 border-t border-neutral-800 font-sans">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand & About Column */}
          <div className="lg:col-span-1 flex flex-col space-y-4">
            <div>
              <span className="text-2xl font-black tracking-wider text-white">
                ROJSEWA
              </span>
              <p className="mt-2 text-sm text-neutral-400 font-medium">
                Trusted Local Services Marketplace
              </p>
            </div>

            {/* Social Links */}
            <div className="flex  gap-2 text-sm text-neutral-400">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500"
                >
                  <social.Icon
                    size={18}
                    className={`transition-colors duration-300 ${social.hover}`}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column: Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#featured-services"
                  className="hover:text-white transition-colors duration-200"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="hover:text-white transition-colors duration-200"
                >
                  Categories
                </a>
              </li>
              <li>
                <Link
                  to={'/register'}
                  className="hover:text-white transition-colors duration-200"
                >
                  Become Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column: Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Report Issue
                </a>
              </li>
              
            </ul>
          </div>

          {/* Links Column: Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link
                  to={'/privacy-policy'}
                  className="hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to={'/term-and-condition'}
                  className="hover:text-white transition-colors duration-200"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to={'/refund-policy'}
                  className="hover:text-white transition-colors duration-200"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to={'/cookie-policy'}
                  className="hover:text-white transition-colors duration-200"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                to={'/desclaimer'}
                  className="hover:text-white transition-colors duration-200"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Newsletter
            </h3>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-neutral-800 text-white rounded border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; 2026 ROJSEWA. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link
              to={'/privacy-policy'}
              className="hover:text-neutral-300 transition-colors duration-200"
            >
              Privacy
            </Link>
            <span className="text-neutral-700">|</span>
            <Link
              to={'/term-and-condition'}
              className="hover:text-neutral-300 transition-colors duration-200"
            >
              Terms
            </Link>
            <span className="text-neutral-700">|</span>
            <p
              className="hover:text-neutral-300 transition-colors duration-200"
            >
            decodestack@gmail.com
            </p>
            
          </div>
        </div>
      </div>
    </footer>
  );
}
