import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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
  getProductBySlug: (slug: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

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

const assignSmartCategories = (productName: string, existingCategories: string[]): string[] => {
  const unique = new Set<string>(existingCategories);
  const nameLower = productName.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryRules)) {
    if (keywords.some(kw => nameLower.includes(kw))) {
      unique.add(category);
    }
  }
  return Array.from(unique);
};

const CACHE_KEY = 'darulattar_products_cache';
const CACHE_AGE = 5 * 60 * 1000;

const loadCached = (): Product[] | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, time } = JSON.parse(raw);
    if (Date.now() - time > CACHE_AGE) { localStorage.removeItem(CACHE_KEY); return null; }
    return data;
  } catch { return null; }
};

const saveCache = (data: Product[]) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, time: Date.now() })); } catch {}
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cached = loadCached();
  const [products, setProducts] = useState<Product[]>(cached || []);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      let mappedData: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.image_url ? p.image_url.replace('/upload/', '/upload/q_auto:good,f_auto/') : '',
        scentProfile: p.scent_profile || { top: '', heart: '', base: '' },
        variants: p.variants || [],
        categories: p.categories || [],
      }));

      mappedData = mappedData.map((product: Product) => ({
        ...product,
        categories: assignSmartCategories(product.name, product.categories),
      }));

      const barbaryLondon = mappedData.find(p => p.name === 'Barbary London');
      if (barbaryLondon) {
        barbaryLondon.imageUrl = 'https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511400/Barbary_London_jntova.png'.replace('/upload/', '/upload/q_auto:good,f_auto/');
      }

      setProducts(mappedData);
      saveCache(mappedData);
    } catch (e: any) {
      console.error("Product Fetch Error:", e);
      if (!cached) setError("We are updating our collection. Please check back shortly.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getProductBySlug = (slug: string) => {
    return products.find(p => slugify(p.name) === slug);
  };

  const value = { products, isLoading, error, getProductById, getProductBySlug, refreshProducts: fetchProducts };

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
