import React, { useState, Suspense } from 'react';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { CustomImageProvider } from './contexts/CustomImageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import { AuthProvider } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import { ProductProvider, useProducts, slugify } from './contexts/ProductContext';
import HomePageSkeleton from './components/HomePageSkeleton';
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import ChatBot from './components/ChatBot';
import WhatsAppButton from './components/WhatsAppButton';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = React.lazy(() => import('./pages/OrderConfirmationPage'));
const PolicyPage = React.lazy(() => import('./pages/PolicyPage'));
const FaqsPage = React.lazy(() => import('./pages/FaqsPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const NewArrivalsPage = React.lazy(() => import('./pages/NewArrivalsPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const AdminLoginPage = React.lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage'));

export interface PageState {
  name: 'home' | 'product' | 'cart' | 'category' | 'checkout' | 'orderConfirmation' | 'terms' | 'privacy' | 'shipping' | 'ourStory' | 'faqs' | 'search' | 'dashboard' | 'newArrivals' | 'blog';
  props?: Record<string, any>;
}

// --- Route Wrappers ---

const ProductRoute = ({ navigate, setIsAuthModalOpen }: { navigate: any, setIsAuthModalOpen: any }) => {
  const { slug } = useParams();
  return <ProductDetailPage productSlug={slug || ''} navigate={navigate} onLoginRequest={() => setIsAuthModalOpen(true)} />;
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
        <Suspense fallback={<div className="min-h-screen bg-brand-dark" />}>
          {children}
        </Suspense>
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
                    <div key={location.pathname + location.search} className="w-full flex-grow">
                        <Routes location={location}>
                            <Route path="/" element={<AnimatedPage><HomeRoute navigate={navigate} /></AnimatedPage>} />
                            <Route path="/product/:slug" element={<AnimatedPage><ProductRoute navigate={navigate} setIsAuthModalOpen={setIsAuthModalOpen} /></AnimatedPage>} />
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
                            <Route path="/admin/login" element={<Suspense fallback={<div className="min-h-screen bg-brand-dark" />}><AdminLoginPage /></Suspense>} />
                            <Route path="/admin" element={<Suspense fallback={<div className="min-h-screen bg-brand-dark" />}><AdminDashboardPage /></Suspense>} />
                            <Route path="*" element={<AnimatedPage><HomeRoute navigate={navigate} /></AnimatedPage>} />
                        </Routes>
                    </div>
                </AnimatePresence>
            </main>
            <Footer navigate={navigate} />
            <ToastContainer />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <WhatsAppButton />
            <ChatBot />
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
        const slug = pageState.props?.slug || slugify(pageState.props?.name || '');
        if (slug) {
            routerNavigate(`/product/${slug}`);
        } else if (pageState.props?.id) {
             routerNavigate(`/product/${pageState.props.id}`); 
        }
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
      <AdminProvider>
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
      </AdminProvider>
    </AuthProvider>
  );
};

export default App;
