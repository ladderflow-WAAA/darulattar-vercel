import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Variant {
  size: string;
  price: number;
}

export interface ScentProfile {
  top: string;
  heart: string;
  base: string;
}

export interface Product {
  id: string; 
  name: string;
  description: string;
  imageUrl: string;
  scentProfile: ScentProfile;
  variants: Variant[];
  categories: string[];
}

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const API_URL = 'https://darulattar-api.onrender.com/api/products';

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch products from the server.');
        }
        const data = await response.json();
        let mappedData: Product[] = data.map((p: any) => ({ 
            ...p, 
            id: p._id,
            categories: p.categories || [],
            imageUrl: p.imageUrl ? p.imageUrl.replace('/upload/', '/upload/q_auto:good,f_auto/') : '',
        }));
        
        // --- Dynamic Categorization Logic based on User's Lists ---
        const categoryAssignments: { [category: string]: string[] } = {
          "Best Sellers": [
            "david off (cool water)", "cool water", "one million", "poison", "hugo boss", "tom ford", "tam ford", "savage", "imperial velli"
          ],
          "Floral & Fresh": [
            "david off (cool water)", "cool water", "satin", "lee cooper", "sabaya", "royal paris", "rose", "jasmine", "jasmin", "litcy", "jaguar black", "lovely", "firdous", "lavender", "dove", "brute", "charlie", "savage", "al madina", "cobra", "titan skin"
          ],
          "Woody & Musk": [
            "rolex", "jawad", "mysore sandal", "majuma", "white musk", "velvet musk", "aseel", "dunhill icon", "london musk", "ameer al oud", "white oud", "black oud", "wishal oud", "afc", "oud nabeel", "tom ford", "tam ford", "mid night oud", "lavender oud", "imperial velli"
          ],
          "Gourmand & Spicy": [
            "barbary london", "one million", "altra male (ultra male)", "ultra male", "shanaya", "cr7", "jaguar red", "chocolate", "biscuit", "red vennila", "red vanilla", "strawberry", "magnet", "dunhill desire", "poison", "hugo boss", "rawe"
          ]
        };

        mappedData = mappedData.map((product: Product) => {
          const newCategories = new Set<string>(product.categories);
          const productNameLower = product.name.toLowerCase();

          for (const [category, productNames] of Object.entries(categoryAssignments)) {
            if (productNames.includes(productNameLower)) {
              newCategories.add(category);
            }
          }

          return { ...product, categories: Array.from(newCategories) };
        });


        // --- Image Override Logic ---
        const barbaryLondon = mappedData.find(p => p.name === 'Barbary London');
        if (barbaryLondon) {
          barbaryLondon.imageUrl = 'https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511400/Barbary_London_jntova.png'.replace('/upload/', '/upload/q_auto:good,f_auto/');
        }

        setProducts(mappedData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const value = { products, isLoading, error, getProductById };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};