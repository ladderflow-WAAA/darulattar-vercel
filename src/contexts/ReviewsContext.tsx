import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  authorName: string;
  authorPicture?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

interface ReviewSubmission {
  productId: string;
  rating: number;
  comment: string;
}

interface UserInfo {
    id: string;
    name: string;
    picture?: string;
}

interface ReviewsContextType {
  addReview: (reviewData: ReviewSubmission, user: UserInfo) => void;
  deleteReview: (reviewId: string) => void;
  getReviewsForProduct: (productId: string) => Review[];
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const REVIEWS_STORAGE_KEY = 'darulAttarReviews';

const initializer = (): Review[] => {
    try {
        const storedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
        return storedReviews ? JSON.parse(storedReviews) : [];
    } catch (error) {
        console.error("Could not parse reviews from localStorage", error);
        return [];
    }
}

export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(initializer);

  useEffect(() => {
    try {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (error) {
        console.error("Could not save reviews to localStorage", error);
    }
  }, [reviews]);

  const addReview = (reviewData: ReviewSubmission, user: UserInfo) => {
    const newReview: Review = {
      ...reviewData,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
      userId: user.id,
      authorName: user.name,
      authorPicture: user.picture,
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const getReviewsForProduct = (productId: string): Review[] => {
    return reviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const value = { addReview, deleteReview, getReviewsForProduct };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};