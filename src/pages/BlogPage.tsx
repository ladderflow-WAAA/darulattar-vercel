import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageState } from '../App';
import { setMetadata } from '../utils/metadata';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';

interface BlogPageProps {
  navigate: (pageState: PageState) => void;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "oud-chennai-weather",
    title: "Why Oud is Well-Suited for Chennai's Humid Weather",
    date: "Oct 12, 2024",
    excerpt: "Discover why concentrated oil-based perfumes outlast alcohol sprays in tropical climates.",
    content: `
      <p class="mb-4">Living in Chennai means contending with a tropical climate where heat and coastal humidity are constant companions. For fragrance enthusiasts, this poses a unique challenge: standard alcohol-based spray perfumes evaporate rapidly when they contact warm skin.</p>
      
      <h3 class="text-2xl font-serif text-brand-charcoal font-normal mt-8 mb-4">The Chemistry of Heat &amp; Evaporation</h3>
      <p class="mb-4">Alcohol is volatile. In Chennai's ambient temperature, an alcohol spray projects loudly for twenty to thirty minutes before vanishing into the air. <strong>Concentrated Attar and Oudh oils</strong>, however, are hydrophobic and substantive.</p>
      
      <p class="mb-4">Rather than evaporating into the atmosphere, these viscous botanical oils bond with your skin warmth. Body heat activates the heavier resinous molecules over eight to twelve hours, generating an intimate and lasting sillage.</p>

      <h3 class="text-2xl font-serif text-brand-charcoal font-normal mt-8 mb-4">Recommended Profiles for Tropical Humidity</h3>
      <ul class="list-disc list-inside space-y-2 mb-6 text-gray-700">
        <li><strong>Ruh Khus (Vetiver):</strong> Known as the "Oil of Tranquility," it cools the pulse points and smells of deep green roots after rain.</li>
        <li><strong>White Oud:</strong> A clean, airy iteration of agarwood that provides elegance without becoming cloying in heat.</li>
        <li><strong>Shamamatul Amber:</strong> A multifaceted spiced botanical blend that withstands outdoor warmth.</li>
      </ul>
      
      <p>Visit our boutique at #144 Aziz Mulk, Greams Road, Thousand Lights to sample these distillations.</p>
    `
  },
  {
    id: "attar-vs-perfume",
    title: "The Difference Between Concentrated Attar and Alcohol Perfume",
    date: "Sep 28, 2024",
    excerpt: "Understanding carrier purity, oil concentration, and the evolution of traditional Itra.",
    content: `
      <p class="mb-4">Commercial perfumes are typically 80% to 90% denatured alcohol. In contrast, authentic Attar is 100% pure concentrated oil, using sandalwood or premium plant carriers to deliver pure botanical scent without drying skin.</p>
      
      <h3 class="text-2xl font-serif text-brand-charcoal font-normal mt-8 mb-4">1. Evolution on Pulse Points</h3>
      <p class="mb-4">Because attars are pure oil extracts, they evolve gradually across top, heart, and base phases, creating a personal signature that lingers on cuffs and pulse points.</p>

      <h3 class="text-2xl font-serif text-brand-charcoal font-normal mt-8 mb-4">2. Pure Alcohol-Free Integrity</h3>
      <p class="mb-4">Our formulations are completely free of alcohol, rendering them suitable for prayers, sensitive skin, and mindful daily wear.</p>
    `
  },
  {
    id: "top-5-musk",
    title: "Understanding Musk Profiles & Longevity",
    date: "Sep 15, 2024",
    excerpt: "A guide to clean, powdery, and animalic musk profiles available at Darul Attar.",
    content: `
      <p class="mb-4">Musk forms the enduring cornerstone of classical Arabian perfumery. Here is an overview of the primary profiles available at our Thousand Lights atelier:</p>
      <div class="space-y-4 mt-6">
        <div><h4 class="text-lg font-serif text-brand-charcoal font-medium">1. Musk Rijali</h4><p class="text-sm text-gray-600">Thick, potent, and traditionally warm with spicy undertones.</p></div>
        <div><h4 class="text-lg font-serif text-brand-charcoal font-medium">2. White Musk (Misk Tahara)</h4><p class="text-sm text-gray-600">Clean, velvety, and powdery; well-suited for daily wear and warm afternoons.</p></div>
        <div><h4 class="text-lg font-serif text-brand-charcoal font-medium">3. Black Amber Musk</h4><p class="text-sm text-gray-600">Deep, resinous, and sophisticated for evening gatherings and special assemblies.</p></div>
      </div>
    `
  }
];

const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (selectedPost) {
      window.scrollTo(0, 0);
      setMetadata(
        `${selectedPost.title} | Darul Attar Journal`,
        selectedPost.excerpt
      );
    } else {
      setMetadata(
        'Fragrance Journal | Darul Attar Chennai',
        'Read about the history of Oud, tips for applying attar, and the best scents for the Chennai climate.'
      );
    }
  }, [selectedPost]);

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 pb-24">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-14 pb-6 border-b border-gray-100">
                <h1 className="text-3xl sm:text-5xl font-serif text-brand-charcoal mb-3">
                  Notes on <span className="font-editorial italic font-normal text-brand-gold-dark">Fragrance</span>
                </h1>
                <p className="text-base text-gray-600 font-normal leading-relaxed">
                  Artisanal insights into traditional extraction, climate longevity, and scent layering from Thousand Lights, Chennai.
                </p>
              </div>
              
              <div className="space-y-8">
                {blogPosts.map((post, index) => (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    onClick={() => setSelectedPost(post)}
                    className="p-6 sm:p-8 bg-brand-ivory border border-gray-200/80 rounded-2xl hover:border-brand-gold/60 cursor-pointer transition-all duration-300 shadow-2xs hover:shadow-xs group"
                  >
                    <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-2">
                      <span className="text-brand-gold-dark font-semibold">ESSAY #{String(index + 1).padStart(2, '0')}</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif text-brand-charcoal group-hover:text-brand-gold-dark transition-colors duration-300 font-normal">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 font-sans leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-brand-charcoal font-semibold group-hover:text-brand-gold-dark transition-colors">Read Treatise →</span>
                      <span className="text-gray-400">4 Min Read</span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="post"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-gray-600 hover:text-black mb-8 group transition-colors font-semibold"
              >
                <ArrowLeftIcon />
                <span>Return to Journal</span>
              </button>
              
              <div className="mb-8 pb-6 border-b border-gray-100">
                <span className="text-xs font-mono text-brand-gold-dark uppercase tracking-widest font-semibold block mb-2">{selectedPost.date}</span>
                <h1 className="text-3xl sm:text-5xl font-serif text-brand-charcoal leading-tight font-normal">
                  {selectedPost.title}
                </h1>
              </div>

              <div 
                className="prose prose-lg text-gray-700 leading-relaxed max-w-none font-sans"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />

              <div className="mt-14 pt-8 border-t border-gray-100 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="text-xs font-mono uppercase tracking-widest text-brand-charcoal font-semibold hover:text-brand-gold-dark transition-colors"
                >
                  ← Back to All Articles
                </button>
                <button
                  onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
                  className="bg-brand-charcoal hover:bg-brand-gold-dark text-white py-2.5 px-6 rounded-full text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Explore Blends
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogPage;
