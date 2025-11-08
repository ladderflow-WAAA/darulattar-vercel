import React, { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import { CustomImageProvider } from './contexts/CustomImageContext';
import { AnimatePresence, motion, Transition } from 'framer-motion';
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

export interface PageState {
  name: 'home' | 'product' | 'cart' | 'category' | 'checkout' | 'orderConfirmation' | 'terms' | 'privacy' | 'shipping' | 'ourStory' | 'faqs' | 'search' | 'dashboard' | 'newArrivals';
  props?: Record<string, any>;
}

const PageRenderer: React.FC<{ page: PageState; navigate: (pageState: PageState) => void; setIsAuthModalOpen: (isOpen: boolean) => void; }> = ({ page, navigate, setIsAuthModalOpen }) => {
  const { isLoading, error } = useProducts();

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  if (error) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl text-red-500 font-serif">Failed to Load Products</h2>
        <p className="text-lg text-gray-400 mt-2">{error}</p>
        <p className="text-gray-500 mt-1">Please try refreshing the page.</p>
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
    duration: 0.5,
  };

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <CustomImageProvider>
            <ReviewsProvider>
              <ToastProvider>
                <div className="bg-brand-dark text-gray-300 min-h-screen flex flex-col font-sans">
                  <Header navigate={navigate} onLoginClick={() => setIsAuthModalOpen(true)} />
                  <main className="flex-grow">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={page.name + JSON.stringify(page.props)}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
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
