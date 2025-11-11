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
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 py-4 font-sans transition-all duration-300 ${isScrolled || isSearchOpen ? 'bg-black/50 backdrop-blur-lg' : 'bg-transparent'}`}
    >
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 flex justify-between items-center h-16">
        <motion.div 
          className="relative w-48 h-full flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
            <button onClick={() => navigate({ name: 'home' })} aria-label="Darul Attar Home" className="opacity-90 hover:opacity-100 transition-opacity relative h-full w-full">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                  <Logo className="h-32 w-auto object-contain" />
                </div>
            </button>
        </motion.div>
        
        <AnimatePresence>
          {isSearchOpen ? (
            <motion.div
              key="search-bar"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute left-1/2 -translate-x-1/2 w-full max-w-lg"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for attars..."
                  className="w-full bg-black/50 border border-gray-700 text-white placeholder-gray-500 rounded-full py-2 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
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
              <ul className="flex items-center space-x-12 text-sm tracking-widest text-gray-300">
                {navLinks.map(link => (
                  <motion.li key={link.name} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <button onClick={() => navigate(link.page as PageState)} className="relative group">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
        
        <div className="w-48 flex justify-end">
            <div className="flex items-center space-x-6">
            <motion.button 
              onClick={() => setIsSearchOpen(o => !o)}
              aria-label="Search"
              className="relative text-gray-300 hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
                {isSearchOpen ? <XIcon /> : <SearchIcon />}
            </motion.button>
            <motion.button 
              onClick={() => navigate({ name: 'cart' })} 
              aria-label="Shopping Cart" 
              className="relative text-gray-300 hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
                <CartIcon />
                {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="absolute -top-2 -right-3 bg-brand-gold text-brand-dark text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans font-bold"
                >
                    {cartCount}
                </motion.span>
                )}
            </motion.button>
            {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                     <motion.button 
                        onClick={() => navigate({ name: 'dashboard' })}
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border-2 border-gray-600" />
                    </motion.button>
                    <motion.button 
                        onClick={logout}
                        className="text-sm tracking-wider text-gray-300 hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        >
                        LOGOUT
                    </motion.button>
                </div>
            ) : (
                <motion.button 
                    onClick={onLoginClick}
                    className="text-sm tracking-wider text-gray-300 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    >
                    LOGIN
                </motion.button>
            )}
            </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;