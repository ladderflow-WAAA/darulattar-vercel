import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { CartIcon } from './icons/CartIcon';
import { useCart } from '../contexts/CartContext';
import { PageState } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { SearchIcon } from './icons/SearchIcon';
import { XIcon } from './icons/XIcon';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  navigate: (pageState: PageState) => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ navigate, onLoginClick }) => {
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHoverNav, setActiveHoverNav] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ name: 'search', props: { query: searchQuery.trim() } });
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'HOME', page: { name: 'home' } },
    { name: 'COLLECTION', page: { name: 'home', props: { section: 'collection' } } },
    { name: 'OUR STORY', page: { name: 'home', props: { section: 'about' } } },
    { name: 'BLOG', page: { name: 'blog' } },
    { name: 'CONTACT', page: { name: 'home', props: { section: 'contact' } } }
  ];

  const quickSearchTags = ['Assam Oud', 'Ruh Khus', 'White Musk', 'Taif Rose'];

  const handleNavClick = (page: PageState) => {
    navigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isSearchOpen 
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-[0_4px_20px_-4px_rgba(17,24,39,0.06)] py-2.5' 
          : 'bg-white/60 backdrop-blur-md border-b border-gray-200/40 py-3.5'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 flex justify-between items-center h-14 relative">
        
        {/* Brand Identity */}
        <motion.div 
          className="relative w-28 sm:w-36 h-full flex items-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <button 
            onClick={() => navigate({ name: 'home' })} 
            aria-label="Darul Attar Home" 
            className="relative h-full w-full flex items-center focus:outline-none"
          >
            <Logo className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300" />
          </button>
        </motion.div>
        
        {/* Desktop Navigation */}
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              key="search-bar"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl px-4" 
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pure oud, rose, ruh khus, amber..."
                  className="w-full bg-white/95 border border-brand-gold/60 text-gray-950 placeholder-gray-400 rounded-full py-2.5 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 shadow-lg text-sm transition-all"
                />
                <button 
                  type="submit" 
                  aria-label="Submit search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-brand-gold-dark transition-colors"
                >
                  <SearchIcon />
                </button>
              </form>
              
              <div className="hidden sm:flex items-center justify-center gap-2 mt-2">
                <span className="text-[11px] text-gray-400 tracking-wider uppercase">Popular:</span>
                {quickSearchTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      navigate({ name: 'search', props: { query: tag } });
                      setIsSearchOpen(false);
                    }}
                    className="text-[11px] text-gray-600 hover:text-brand-gold-dark bg-gray-100 hover:bg-brand-gold/10 px-2.5 py-0.5 rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <nav 
              key="nav-links"
              className="hidden lg:flex items-center"
              onMouseLeave={() => setActiveHoverNav(null)}
            >
              <ul className="flex items-center space-x-1 text-[13px] tracking-[0.14em] font-medium text-gray-800">
                {navLinks.map((link) => {
                  const isHovered = activeHoverNav === link.name;
                  return (
                    <li key={link.name} className="relative">
                      <button 
                        onClick={() => navigate(link.page as PageState)}
                        onMouseEnter={() => setActiveHoverNav(link.name)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-950 transition-colors relative z-10"
                      >
                        {link.name}
                        {isHovered && (
                          <motion.div
                            layoutId="navHoverPill"
                            className="absolute inset-0 bg-brand-gold/15 rounded-full -z-10"
                            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </AnimatePresence>
        
        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-3 sm:space-x-5 z-10">
          <motion.button 
            onClick={() => setIsSearchOpen(o => !o)}
            aria-label={isSearchOpen ? "Close search" : "Open search"}
            className="p-2 text-gray-700 hover:text-brand-gold-dark rounded-full hover:bg-black/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSearchOpen ? <XIcon /> : <SearchIcon />}
          </motion.button>
          
          <motion.button 
            onClick={() => navigate({ name: 'cart' })} 
            aria-label="Shopping Cart" 
            className="relative p-2 text-gray-700 hover:text-brand-gold-dark rounded-full hover:bg-black/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CartIcon />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                className="absolute top-0.5 right-0.5 bg-brand-charcoal text-brand-gold-light text-[10px] rounded-full h-4.5 w-4.5 min-w-[18px] px-1 flex items-center justify-center font-bold shadow-sm"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          {isAuthenticated && user ? (
            <div className="hidden sm:flex items-center space-x-3">
              <motion.button 
                onClick={() => navigate({ name: 'dashboard' })}
                className="flex items-center space-x-2 focus:outline-none"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                title="Account Dashboard"
              >
                <div className="w-8 h-8 rounded-full bg-brand-charcoal text-brand-gold border border-brand-gold/60 flex items-center justify-center font-bold text-xs select-none shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </motion.button>
              <button 
                onClick={logout}
                className="text-[11px] tracking-wider text-gray-500 hover:text-black uppercase transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <motion.button 
              onClick={onLoginClick}
              className="hidden sm:inline-flex items-center text-xs tracking-[0.14em] font-semibold text-gray-900 border border-gray-300 hover:border-gray-900 hover:bg-gray-950 hover:text-white px-4 py-2 rounded-full transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              LOGIN
            </motion.button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-800 hover:text-brand-gold-dark transition-colors"
            aria-label="Open mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white/95 backdrop-blur-2xl border-l border-gray-200 z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <span className="text-xs text-gray-500 tracking-[0.2em] uppercase font-bold">Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-gray-700 hover:text-brand-gold-dark rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <XIcon />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.page as PageState)}
                      className="block w-full text-left py-3 text-sm tracking-[0.15em] text-gray-900 font-medium hover:text-brand-gold-dark hover:pl-2 transition-all border-b border-gray-50"
                    >
                      {link.name}
                    </button>
                  ))}
                  <button
                    onClick={() => { window.location.href = '/admin'; setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-3 text-sm tracking-[0.15em] text-gray-500 hover:text-brand-gold-dark hover:pl-2 transition-all border-b border-gray-50"
                  >
                    ADMIN CONSOLE
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  {isAuthenticated && user ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-brand-charcoal text-brand-gold border border-brand-gold flex items-center justify-center font-bold text-sm select-none">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-gray-900 text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-gray-500 text-xs truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3 pt-2">
                        <button
                          onClick={() => handleNavClick({ name: 'dashboard' })}
                          className="flex-1 text-center text-xs tracking-wider uppercase font-semibold text-black border border-black px-3 py-2.5 rounded-full hover:bg-black hover:text-white transition"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                          className="flex-1 text-center text-xs tracking-wider uppercase font-semibold text-red-600 border border-red-200 px-3 py-2.5 rounded-full hover:bg-red-50 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                      className="w-full text-center text-xs tracking-[0.15em] font-semibold text-white bg-black hover:bg-brand-gold-dark hover:text-white py-3 rounded-full transition shadow-md"
                    >
                      LOGIN / REGISTER
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
