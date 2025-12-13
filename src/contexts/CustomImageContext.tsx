import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CustomImageContextType {
  customImages: Record<string, string>;
  setCustomImage: (productId: string, imageDataUrl: string) => void;
  getCustomImage: (productId: string) => string | undefined;
}

const CustomImageContext = createContext<CustomImageContextType | undefined>(undefined);

const initializer = (): Record<string, string> => {
    try {
        const storedImages = localStorage.getItem('darulAttarCustomImages');
        return storedImages ? JSON.parse(storedImages) : {};
    } catch (error) {
        console.error("Could not parse custom images from localStorage", error);
        return {};
    }
}

export const CustomImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customImages, setCustomImages] = useState<Record<string, string>>(initializer);

  useEffect(() => {
    try {
        localStorage.setItem('darulAttarCustomImages', JSON.stringify(customImages));
    } catch (error) {
        console.error("Could not save custom images to localStorage", error);
    }
  }, [customImages]);

  const setCustomImage = (productId: string, imageDataUrl: string) => {
    setCustomImages(prev => ({ ...prev, [productId]: imageDataUrl }));
  };

  const getCustomImage = (productId: string): string | undefined => {
    return customImages[productId];
  };

  const value = { customImages, setCustomImage, getCustomImage };

  return (
    <CustomImageContext.Provider value={value}>
      {children}
    </CustomImageContext.Provider>
  );
};

export const useCustomImages = () => {
  const context = useContext(CustomImageContext);
  if (context === undefined) {
    throw new Error('useCustomImages must be used within a CustomImageProvider');
  }
  return context;
};