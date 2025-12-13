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

// Using the production API URL
const API_URL = 'https://darulattarecombackend.netlify.app/products';

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
          throw new Error('Unable to connect to the catalogue server.');
        }
        
        const data = await response.json();
        
        // Transform and Optimize Data
        let mappedData: Product[] = data.map((p: any) => ({ 
            ...p, 
            id: p._id,
            categories: p.categories || [],
            // Auto-optimize Cloudinary images for format and quality
            imageUrl: p.imageUrl ? p.imageUrl.replace('/upload/', '/upload/q_auto:good,f_auto/') : '',
        }));
        
        // --- Smart Categorization Logic ---
        // Automatically assigns categories based on keywords in product names if not already set by backend
        const categoryRules: { [category: string]: string[] } = {
          "Best Sellers": [
            "cool water", "one million", "poison", "hugo", "tom ford", "savage", "imperial"
          ],
          "Floral & Fresh": [
            "cool water", "satin", "sabaya", "rose", "jasmine", "jasmin", "lovely", "lavender", "dove", "brute", "charlie", "titan"
          ],
          "Woody & Musk": [
            "rolex", "jawad", "sandal", "majuma", "musk", "aseel", "dunhill", "oud", "afc", "nabeel"
          ],
          "Gourmand & Spicy": [
            "barbary", "million", "ultra male", "shanaya", "chocolate", "biscuit", "vanilla", "vennila", "strawberry", "magnet", "desire"
          ]
        };

        mappedData = mappedData.map((product: Product) => {
          const newCategories = new Set<string>(product.categories);
          const productNameLower = product.name.toLowerCase();

          for (const [category, keywords] of Object.entries(categoryRules)) {
            if (keywords.some(kw => productNameLower.includes(kw))) {
              newCategories.add(category);
            }
          }

          return { ...product, categories: Array.from(newCategories) };
        });

        // --- Specific Overrides (if needed) ---
        const barbaryLondon = mappedData.find(p => p.name === 'Barbary London');
        if (barbaryLondon) {
          barbaryLondon.imageUrl = 'https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511400/Barbary_London_jntova.png'.replace('/upload/', '/upload/q_auto:good,f_auto/');
        }

        setProducts(mappedData);
      } catch (e: any) {
        console.error("Product Fetch Error:", e);
        setError("We are updating our collection. Please check back shortly.");
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