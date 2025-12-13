import React, { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import { CustomImageProvider } from './contexts/CustomImageContext';
// Fix: Use 'import type' for Transition to fix type resolution issues with framer-motion.
import { AnimatePresence, motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import PolicyPage from './pages/PolicyPage';
import FaqsPage from './pages/FaqsPage';
import { ReviewsProvider } from './contexts/ReviewsContext';
import SearchPage from './pages/SearchPage';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import { AuthProvider } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import DashboardPage from './pages/DashboardPage';
import { ProductProvider, useProducts } from './contexts/ProductContext';
import NewArrivalsPage from './pages/NewArrivalsPage';
import HomePageSkeleton from './components/HomePageSkeleton';
import BlogPage from './pages/BlogPage';

export interface PageState {
  name: 'home' | 'product' | 'cart' | 'category' | 'checkout' | 'orderConfirmation' | 'terms' | 'privacy' | 'shipping' | 'ourStory' | 'faqs' | 'search' | 'dashboard' | 'newArrivals' | 'blog';
  props?: Record<string, any>;
}

const PageRenderer: React.FC<{ page: PageState; navigate: (pageState: PageState) => void; setIsAuthModalOpen: (isOpen: boolean) => void; }> = ({ page, navigate, setIsAuthModalOpen }) => {
  const { isLoading, error } = useProducts();

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  if (error) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-brand-dark">
        <h2 className="text-2xl text-red-500 font-serif">Unable to Load Collection</h2>
        <p className="text-lg text-gray-400 mt-2">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-brand-gold hover:underline">
            Refresh Page
        </button>
      </div>
    );
  }

  switch (page.name) {
    case 'product':
      return <ProductDetailPage productId={page.props?.id} navigate={navigate} onLoginRequest={() => setIsAuthModalOpen(true)} />;
    case 'cart':
      return <CartPage navigate={navigate} />;
    case 'category':
      return <CategoryPage category={page.props?.category} navigate={navigate} />;
    case 'search':
      return <SearchPage query={page.props?.query} navigate={navigate} />;
    case 'checkout':
      return <CheckoutPage navigate={navigate} />;
    case 'orderConfirmation':
      return <OrderConfirmationPage navigate={navigate} orderDetails={page.props?.orderDetails} />;
    case 'terms':
      return <PolicyPage pageType="terms" navigate={navigate} />;
    case 'privacy':
      return <PolicyPage pageType="privacy" navigate={navigate} />;
    case 'shipping':
      return <PolicyPage pageType="shipping" navigate={navigate} />;
    case 'ourStory':
      return <PolicyPage pageType="ourStory" navigate={navigate} />;
    case 'faqs':
      return <FaqsPage navigate={navigate} />;
    case 'dashboard':
      return <DashboardPage navigate={navigate} />;
    case 'newArrivals':
      return <NewArrivalsPage navigate={navigate} />;
    case 'blog':
      return <BlogPage navigate={navigate} />;
    case 'home':
    default:
      return <HomePage navigate={navigate} section={page.props?.section} />;
  }
};

const App: React.FC = () => {
  const [page, setPage] = useState<PageState>({ name: 'home' });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navigate = (pageState: PageState) => {
    if (pageState.name === 'home' && pageState.props?.section && page.name !== 'home') {
       setPage(pageState);
    } else {
      setPage(pageState);
    }
    window.scrollTo(0, 0);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const pageTransition: Transition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  };

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <CustomImageProvider>
            <ReviewsProvider>
              <ToastProvider>
                <div className="bg-brand-dark text-gray-300 min-h-screen flex flex-col font-sans selection:bg-brand-gold selection:text-brand-dark">
                  <Header navigate={navigate} onLoginClick={() => setIsAuthModalOpen(true)} />
                  <main className="flex-grow">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={page.name + (page.props ? JSON.stringify(page.props) : '')}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="min-h-screen"
                      >
                        <PageRenderer page={page} navigate={navigate} setIsAuthModalOpen={setIsAuthModalOpen} />
                      </motion.div>
                    </AnimatePresence>
                  </main>
                  <Footer navigate={navigate} />
                  <ToastContainer />
                  <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
                </div>
              </ToastProvider>
            </ReviewsProvider>
          </CustomImageProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;