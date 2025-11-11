import React, { useEffect } from 'react';
import { Product } from '../contexts/ProductContext';
import { Review } from '../contexts/ReviewsContext';

interface ProductSchemaProps {
  product: Product;
  reviews: Review[];
}

const ProductSchema: React.FC<ProductSchemaProps> = ({ product, reviews }) => {

  useEffect(() => {
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    const schema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: product.imageUrl,
      description: product.description,
      sku: product.id,
      mpn: product.id,
      brand: {
        '@type': 'Brand',
        name: 'Darul Attar',
      },
      offers: {
        '@type': 'Offer',
        url: window.location.href,
        priceCurrency: 'INR',
        price: product.variants[0].price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        seller: {
            '@type': 'Organization',
            name: 'Darul Attar'
        }
      },
      ...(averageRating && reviews.length > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: averageRating,
          reviewCount: reviews.length,
        },
      }),
    };

    const scriptId = 'product-schema-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }
    
    script.innerHTML = JSON.stringify(schema);
    
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if(scriptToRemove) {
          scriptToRemove.remove();
      }
    };
  }, [product, reviews]);

  return null; // This component does not render anything to the DOM itself
};

export default ProductSchema;
