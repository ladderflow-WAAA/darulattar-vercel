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
        price: product.variants?.[0]?.price ?? 0,
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        seller: {
            '@type': 'Organization',
            name: 'Darul Attar',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '#144 Aziz Mulk, 1st Street, Greams Road',
                addressLocality: 'Thousand Lights',
                addressRegion: 'Chennai',
                postalCode: '600006',
                addressCountry: 'IN'
            }
        },
        areaServed: {
            '@type': 'City',
            name: 'Chennai'
        },
        availableAtOrFrom: {
            '@type': 'Store',
            name: 'Darul Attar Thousand Lights',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '#144 Aziz Mulk, 1st Street, Greams Road',
                addressLocality: 'Thousand Lights',
                addressRegion: 'Chennai',
                postalCode: '600006',
                addressCountry: 'IN'
            }
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

    const scriptId = `product-schema-${product.id}`;
    // Clean up old scripts to avoid duplicates
    const oldScript = document.getElementById(scriptId);
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if(scriptToRemove) {
          scriptToRemove.remove();
      }
    };
  }, [product, reviews]);

  return null;
};

export default ProductSchema;