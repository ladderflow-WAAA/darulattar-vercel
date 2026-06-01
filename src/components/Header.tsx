import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { CartIcon } from './icons/CartIcon';
import { useCart } from '../contexts/CartContext';
import { PageState } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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

  const handleAdminClick = () => {
    window.location.href = '/admin';
  };

  const handleNavClick = (page: PageState) => {
    navigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 py-3 font-sans transition-all duration-300 border-b ${isScrolled || isSearchOpen ? 'bg-black/90 backdrop-blur-md border-brand-gold/20 shadow-2xl' : 'bg-transparent border-transparent'}`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 lg:px-16 flex justify-between items-center h-16 relative">
        
        {/* Logo Section */}
        <motion.div 
          className="relative w-28 sm:w-40 h-full flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
            <button onClick={() => navigate({ name: 'home' })} aria-label="Darul Attar Home" className="opacity-95 hover:opacity-100 transition-opacity relative h-full w-full flex items-center">
                <Logo className="h-28 w-auto object-contain" />
            </button>
        </motion.div>
        
        {/* Desktop Navigation or Search Bar */}
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              key="search-bar"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg block px-4" 
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for musk, oud, rose..."
                  className="w-full bg-[#111] border border-gray-700 text-white placeholder-gray-500 rounded-sm py-2 pl-5 pr-12 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-lg"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gold">
                  <SearchIcon />
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.nav 
              key="nav-links"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:flex"
            >
              <ul className="flex items-center space-x-10 text-xs tracking-[0.15em] font-medium text-gray-300">
                {navLinks.map(link => (
                  <motion.li key={link.name} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <button onClick={() => navigate(link.page as PageState)} className="relative group hover:text-brand-gold transition-colors">
                      {link.name}
                      <span className="absolute -bottom-2 left-0 w-full h-px bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
        
        {/* Actions (Search, Cart, Login, Hamburger) */}
        <div className="flex items-center justify-end space-x-3 sm:space-x-6 z-10">
            <motion.button 
              onClick={() => setIsSearchOpen(o => !o)}
              aria-label="Search products"
              className="relative text-gray-300 hover:text-brand-gold transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
                {isSearchOpen ? <XIcon /> : <SearchIcon />}
            </motion.button>
            
            <motion.button 
              onClick={() => navigate({ name: 'cart' })} 
              aria-label="Shopping Cart" 
              className="relative text-gray-300 hover:text-brand-gold transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
                <CartIcon />
                {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="absolute -top-2 -right-3 bg-brand-gold text-brand-dark text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold"
                >
                    {cartCount}
                </motion.span>
                )}
            </motion.button>

            {isAuthenticated && user ? (
                <div className="hidden sm:flex items-center space-x-4">
                     <motion.button 
                        onClick={() => navigate({ name: 'dashboard' })}
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Dashboard"
                      >
                        {user.picture ? (
                            <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-gray-600" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center font-bold">{user.name.charAt(0)}</div>
                        )}
                    </motion.button>
                    <button 
                        onClick={logout}
                        className="hidden sm:block text-xs tracking-wider text-gray-400 hover:text-white transition-colors"
                        >
                        LOGOUT
                    </button>
                </div>
            ) : (
                <motion.button 
                    onClick={onLoginClick}
                    className="hidden sm:block text-xs tracking-wider font-semibold text-brand-gold hover:text-white transition-colors border border-brand-gold/50 px-4 py-1.5 rounded-sm hover:bg-brand-gold hover:text-brand-dark"
                    whileTap={{ scale: 0.95 }}
                    >
                    LOGIN
                </motion.button>
            )}
            <button
                onClick={handleAdminClick}
                className="hidden sm:block text-xs tracking-wider text-gray-500 hover:text-brand-gold transition"
                title="Admin"
            >
                ADMIN
            </button>

            {/* Hamburger Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-gray-300 hover:text-brand-gold transition"
                aria-label="Open menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-brand-charcoal border-l border-gray-800 z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <span className="text-sm text-gray-400 tracking-widest uppercase">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-brand-gold transition"
                  aria-label="Close menu"
                >
                  <XIcon />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.page as PageState)}
                      className="block w-full text-left py-3 text-sm tracking-widest text-gray-300 hover:text-brand-gold transition border-b border-gray-800/50"
                    >
                      {link.name}
                    </button>
                  ))}
                  <button
                    onClick={() => { handleAdminClick(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-3 text-sm tracking-widest text-gray-500 hover:text-brand-gold transition border-b border-gray-800/50"
                  >
                    ADMIN
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  {isAuthenticated && user ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border border-gray-600" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center font-bold">{user.name.charAt(0)}</div>
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">{user.name}</p>
                          <p className="text-gray-400 text-xs">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleNavClick({ name: 'dashboard' })}
                          className="flex-1 text-center text-xs text-brand-gold border border-brand-gold/50 px-3 py-2 rounded-sm hover:bg-brand-gold hover:text-brand-dark transition"
                        >
                          DASHBOARD
                        </button>
                        <button
                          onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                          className="flex-1 text-center text-xs text-red-400 border border-red-900/50 px-3 py-2 rounded-sm hover:bg-red-900/20 transition"
                        >
                          LOGOUT
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                      className="w-full text-center text-xs tracking-wider font-semibold text-brand-gold border border-brand-gold/50 px-4 py-2.5 rounded-sm hover:bg-brand-gold hover:text-brand-dark transition"
                    >
                      LOGIN
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
