import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageState } from '../App';
import { setMetadata } from '../utils/metadata';

interface BlogPageProps {
  navigate: (pageState: PageState) => void;
}

const blogPosts = [
  "Difference Between Attar and Perfume",
  "Why Oud is the King of Arabic Fragrances",
  "Top 10 Long-Lasting Attars for Everyday Wear",
  "How to Store and Apply Attar the Right Way"
];

const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
  useEffect(() => {
    setMetadata(
      'Attar & Oud Blog - Fragrance Insights | Darul Attar',
      'Explore the world of Arabic fragrances. Learn about the difference between attar and perfume, the history of oud, and how to apply attar correctly.'
    );
  }, []);

  return (
    <div className="bg-brand-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 pt-40 pb-24 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-5xl font-thin text-white font-serif text-center">
            The Darul Attar Blog
          </h1>
          <p className="mt-4 text-lg text-gray-400 text-center">
            Insights into the world of traditional fragrances. Coming soon.
          </p>
          
          <div className="mt-12 border-t border-gray-800 pt-8">
            <h2 className="text-2xl font-serif text-brand-gold text-center mb-6">Topics We'll Explore</h2>
            <ul className="space-y-3 list-disc list-inside text-gray-300 max-w-2xl mx-auto">
              {blogPosts.map((post, index) => (
                <li key={index}>{post}</li>
              ))}
            </ul>
          </div>
          
          <div className="text-center mt-12">
            <motion.button
              onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
              className="bg-brand-gold text-brand-dark py-4 px-10 tracking-widest text-sm font-bold uppercase"
              whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF' }}
              whileTap={{ scale: 0.95 }}
            >
              Explore The Collection
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;
