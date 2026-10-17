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
    excerpt: "Discover why oil-based perfumes last longer than alcohol sprays in tropical climates like Chennai.",
    content: `
      <p class="mb-4">Living in Chennai means contending with a tropical climate where heat and humidity are constant companions. For fragrance lovers, this poses a unique challenge: standard alcohol-based French perfumes tend to evaporate rapidly when they hit warm skin.</p>
      
      <h3 class="text-2xl font-serif text-gray-900 font-bold mt-8 mb-4">The Chemistry of Heat</h3>
      <p class="mb-4">Alcohol is volatile. In the heat of Chennai, an alcohol spray might project loudly for 30 minutes and then vanish. <strong>Attar and Oud oils</strong>, however, are hydrophobic and heavier.</p>
      
      <p class="mb-4">Instead of evaporating, these oils sink into your pores. They rely on body warmth to slowly release their aroma. Chennai's warmth actually helps Oud develop, creating a consistent scent bubble that lasts 8-12 hours.</p>

      <h3 class="text-2xl font-serif text-gray-900 font-bold mt-8 mb-4">Best Profiles for Humidity</h3>
      <ul class="list-disc list-inside space-y-2 mb-6 text-gray-700">
        <li><strong>Vetiver (Ruh Khus):</strong> Known as the "Oil of Tranquility," it cools and smells like wet earth after rain.</li>
        <li><strong>White Oud:</strong> A lighter, cleaner variant of Oud that is not cloying in humid weather.</li>
        <li><strong>Shamama:</strong> A complex herbal blend that stands up powerfully against heat.</li>
      </ul>
      
      <p>Visit our boutique in Thousand Lights to test these oils on your skin.</p>
    `
  },
  {
    id: "attar-vs-perfume",
    title: "The Difference Between Attar and French Perfume",
    date: "Sep 28, 2024",
    excerpt: "Understanding the concentration, ingredients, and evolution of traditional Itra vs modern EDPs.",
    content: `
      <p class="mb-4">Standard alcohol perfumes contain 80-95% alcohol carrier. Authentic Attar is 100% pure concentrated oil, using sandalwood or premium plant/mineral carriers to deliver pure scent without drying the skin or evaporating quickly.</p>
      
      <h3 class="text-2xl font-serif text-gray-900 font-bold mt-8 mb-4">1. Longevity</h3>
      <p class="mb-4">Because attars are oil-based, they evolve slowly over hours and bind directly with fabric and skin warmth.</p>

      <h3 class="text-2xl font-serif text-gray-900 font-bold mt-8 mb-4">2. Alcohol-Free Purity</h3>
      <p class="mb-4">Our Attars are completely free of alcohol, making them ideal for religious worship, prayer times, and sensitive skin.</p>
    `
  },
  {
    id: "top-5-musk",
    title: "Top 5 Long-Lasting Musk Scents for Men",
    date: "Sep 15, 2024",
    excerpt: "Our curated list of masculine musk fragrances that stay with you all day long.",
    content: `
      <p class="mb-4">Musk is timeless and clean. Here are the top selections available at Darul Attar:</p>
      <div class="space-y-4 mt-6">
        <div><h4 class="text-lg font-serif font-bold text-gray-900">1. Musk Rijali</h4><p class="text-sm text-gray-600">Thick, potent, and traditionally masculine with spicy undertones.</p></div>
        <div><h4 class="text-lg font-serif font-bold text-gray-900">2. White Musk (Tahara)</h4><p class="text-sm text-gray-600">Fresh and soapy, ideal for office and summer wear.</p></div>
        <div><h4 class="text-lg font-serif font-bold text-gray-900">3. Black Musk</h4><p class="text-sm text-gray-600">Deep, warm, and sophisticated for evening gatherings.</p></div>
      </div>
    `
  }
];

const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (selectedPost) {
        window.scrollTo(0,0);
        setMetadata(
            `${selectedPost.title} | Darul Attar Blog`,
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
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-24">
        <AnimatePresence mode="wait">
            {!selectedPost ? (
                <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className="text-center mb-16">
                        <span className="text-[#8C6D47] text-xs tracking-widest uppercase font-semibold">The Journal</span>
                        <h1 className="text-4xl md:text-5xl font-thin text-gray-900 font-serif mt-4">
                            Notes on <span className="italic text-[#8C6D47]">Fragrance</span>
                        </h1>
                        <p className="mt-4 text-base text-gray-600">
                            Insights into the world of traditional perfumery from Thousand Lights, Chennai.
                        </p>
                    </div>
                    
                    <div className="space-y-10">
                        {blogPosts.map((post, index) => (
                            <motion.article 
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b border-gray-200 pb-10 last:border-0 group cursor-pointer"
                                onClick={() => setSelectedPost(post)}
                            >
                                <div className="text-xs text-[#8C6D47] mb-2 font-bold tracking-wider uppercase">{post.date}</div>
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 group-hover:text-[#8C6D47] transition-colors">{post.title}</h2>
                                <p className="text-gray-600 mt-3 font-normal leading-relaxed text-base">{post.excerpt}</p>
                                <button 
                                    className="mt-4 text-xs font-bold text-black uppercase tracking-wider group-hover:underline underline-offset-4 transition-all"
                                >
                                    Read Article &rarr;
                                </button>
                            </motion.article>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <button 
                        onClick={() => setSelectedPost(null)}
                        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black mb-10 group transition-colors font-medium"
                    >
                        <ArrowLeftIcon />
                        <span className="group-hover:underline">Back to Journal</span>
                    </button>

                    <article>
                        <header className="mb-10 border-b border-gray-200 pb-8">
                            <div className="text-xs text-[#8C6D47] mb-3 font-bold tracking-wider uppercase">{selectedPost.date}</div>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                                {selectedPost.title}
                            </h1>
                        </header>
                        
                        <div 
                            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:font-normal prose-p:leading-8 prose-li:text-gray-700 prose-strong:text-black"
                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                        />

                        {/* Article Footer / CTA */}
                        <div className="mt-16 bg-[#FAF8F5] border border-gray-200 p-8 text-center rounded-sm shadow-xs">
                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Experience Authentic Attar</h3>
                            <p className="text-gray-600 mb-6 text-sm">Explore our collection of authentic oils or visit us in Chennai.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
                                    className="bg-black hover:bg-gray-800 text-white py-3 px-8 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors shadow-xs"
                                >
                                    Shop Collection
                                </button>
                                <button
                                    onClick={() => navigate({ name: 'home', props: { section: 'contact' } })}
                                    className="border border-gray-300 text-gray-900 py-3 px-8 text-xs font-bold uppercase tracking-widest hover:border-black rounded-sm transition-colors bg-white shadow-xs"
                                >
                                    Visit Store
                                </button>
                            </div>
                        </div>
                    </article>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogPage;