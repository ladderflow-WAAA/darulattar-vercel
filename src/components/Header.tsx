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
      className={`fixed top-0 left-0 right-0 z-50 py-3 font-sans transition-all duration-300 border-b ${isScrolled || isSearchOpen ? 'bg-black/90 backdrop-blur-md border-brand-gold/20 shadow-2xl' : 'bg-transparent border-transparent'}`}
    >
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 flex justify-between items-center h-16 relative">
        
        {/* Logo Section */}
        <motion.div 
          className="relative w-40 h-full flex items-center"
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
              // FIXED: Added top-1/2 -translate-y-1/2 to vertically center it on mobile
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
        
        {/* Actions (Search, Cart, Login) */}
        <div className="flex items-center justify-end space-x-6 z-10">
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
                        className="text-xs tracking-wider text-gray-400 hover:text-white transition-colors"
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
        </div>
      </div>
    </motion.header>
  );
};

export default Header;