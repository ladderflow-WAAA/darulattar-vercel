import React, { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import { CustomImageProvider } from './contexts/CustomImageContext';
import { AnimatePresence, motion } from 'framer-motion';
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
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';

export interface PageState {
  name: 'home' | 'product' | 'cart' | 'category' | 'checkout' | 'orderConfirmation' | 'terms' | 'privacy' | 'shipping' | 'ourStory' | 'faqs' | 'search' | 'dashboard' | 'newArrivals' | 'blog';
  props?: Record<string, any>;
}

// --- Route Wrappers ---

const ProductRoute = ({ navigate, setIsAuthModalOpen }: { navigate: any, setIsAuthModalOpen: any }) => {
  const { id } = useParams();
  if (!id) return null; 
  return <ProductDetailPage productId={id} navigate={navigate} onLoginRequest={() => setIsAuthModalOpen(true)} />;
};

const CategoryRoute = ({ navigate }: { navigate: any }) => {
  const { category } = useParams();
  return <CategoryPage category={category || ''} navigate={navigate} />;
};

const SearchRoute = ({ navigate }: { navigate: any }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  return <SearchPage query={query} navigate={navigate} />;
};

const OrderConfirmationRoute = ({ navigate }: { navigate: any }) => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;
  return <OrderConfirmationPage navigate={navigate} orderDetails={orderDetails} />;
};

const HomeRoute = ({ navigate }: { navigate: any }) => {
    const [searchParams] = useSearchParams();
    const section = searchParams.get('section') || undefined;
    return <HomePage navigate={navigate} section={section} />;
};

const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={{
            initial: { opacity: 0 },
            in: { opacity: 1 },
            out: { opacity: 0 },
        }}
        transition={{
            type: 'tween',
            ease: 'anticipate',
            duration: 0.4,
        }}
        className="min-h-screen"
    >
        {children}
    </motion.div>
);

// --- Main Content ---

const AppContent: React.FC<{ navigate: (page: PageState) => void, isAuthModalOpen: boolean, setIsAuthModalOpen: (isOpen: boolean) => void }> = ({ navigate, isAuthModalOpen, setIsAuthModalOpen }) => {
    const { isLoading, error } = useProducts();
    const location = useLocation();

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

    return (
        <div className="bg-brand-dark text-gray-300 min-h-screen flex flex-col font-sans selection:bg-brand-gold selection:text-brand-dark">
            <Header navigate={navigate} onLoginClick={() => setIsAuthModalOpen(true)} />
            <main className="flex-grow flex flex-col">
                <AnimatePresence mode="wait">
                    {/* Wrapped Routes in a div with the key to fix TypeScript error and trigger animation */}
                    <div key={location.pathname + location.search} className="w-full flex-grow">
                        <Routes location={location}>
                            <Route path="/" element={<AnimatedPage><HomeRoute navigate={navigate} /></AnimatedPage>} />
                            <Route path="/product/:id" element={<AnimatedPage><ProductRoute navigate={navigate} setIsAuthModalOpen={setIsAuthModalOpen} /></AnimatedPage>} />
                            <Route path="/cart" element={<AnimatedPage><CartPage navigate={navigate} /></AnimatedPage>} />
                            <Route path="/category/:category" element={<AnimatedPage><CategoryRoute navigate={navigate} /></AnimatedPage>} />
                            <Route path="/search" element={<AnimatedPage><SearchRoute navigate={navigate} /></AnimatedPage>} />
                            <Route path="/checkout" element={<AnimatedPage><CheckoutPage navigate={navigate} /></AnimatedPage>} />
                            <Route path="/order-confirmation" element={<AnimatedPage><OrderConfirmationRoute navigate={navigate} /></AnimatedPage>} />
                            <Route path="/terms" element={<AnimatedPage><PolicyPage pageType="terms" navigate={navigate} /></AnimatedPage>} />
                            <Route path="/privacy" element={<AnimatedPage><PolicyPage pageType="privacy" navigate={navigate} /></AnimatedPage>} />
                            <Route path="/shipping" element={<AnimatedPage><PolicyPage pageType="shipping" navigate={navigate} /></AnimatedPage>} />
                            <Route path="/our-story" element={<AnimatedPage><PolicyPage pageType="ourStory" navigate={navigate} /></AnimatedPage>} />
                            <Route path="/faqs" element={<AnimatedPage><FaqsPage navigate={navigate} /></AnimatedPage>} />
                            <Route path="/dashboard" element={<AnimatedPage><DashboardPage navigate={navigate} /></AnimatedPage>} />
                            <Route path="/new-arrivals" element={<AnimatedPage><NewArrivalsPage navigate={navigate} /></AnimatedPage>} />
                            <Route path="/blog" element={<AnimatedPage><BlogPage navigate={navigate} /></AnimatedPage>} />
                            <Route path="*" element={<AnimatedPage><HomeRoute navigate={navigate} /></AnimatedPage>} />
                        </Routes>
                    </div>
                </AnimatePresence>
            </main>
            <Footer navigate={navigate} />
            <ToastContainer />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const routerNavigate = useNavigate();

  const navigate = (pageState: PageState) => {
    window.scrollTo(0, 0);
    switch (pageState.name) {
      case 'home':
        if (pageState.props?.section) {
            routerNavigate(`/?section=${pageState.props.section}`);
        } else {
            routerNavigate('/');
        }
        break;
      case 'product':
        routerNavigate(`/product/${pageState.props?.id}`);
        break;
      case 'cart':
        routerNavigate('/cart');
        break;
      case 'category':
        routerNavigate(`/category/${pageState.props?.category}`);
        break;
      case 'search':
        routerNavigate(`/search?q=${encodeURIComponent(pageState.props?.query || '')}`);
        break;
      case 'checkout':
        routerNavigate('/checkout');
        break;
      case 'orderConfirmation':
        routerNavigate('/order-confirmation', { state: { orderDetails: pageState.props?.orderDetails } });
        break;
      case 'terms':
        routerNavigate('/terms');
        break;
      case 'privacy':
        routerNavigate('/privacy');
        break;
      case 'shipping':
        routerNavigate('/shipping');
        break;
      case 'ourStory':
        routerNavigate('/our-story');
        break;
      case 'faqs':
        routerNavigate('/faqs');
        break;
      case 'dashboard':
        routerNavigate('/dashboard');
        break;
      case 'newArrivals':
        routerNavigate('/new-arrivals');
        break;
      case 'blog':
        routerNavigate('/blog');
        break;
      default:
        routerNavigate('/');
    }
  };

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <CustomImageProvider>
            <ReviewsProvider>
              <ToastProvider>
                 <AppContent navigate={navigate} isAuthModalOpen={isAuthModalOpen} setIsAuthModalOpen={setIsAuthModalOpen} />
              </ToastProvider>
            </ReviewsProvider>
          </CustomImageProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;