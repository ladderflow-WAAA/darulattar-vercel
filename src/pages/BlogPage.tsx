import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  content: string; // HTML content
}

const blogPosts: BlogPost[] = [
  {
    id: "oud-chennai-weather",
    title: "Why Oud is Perfect for Chennai's Humid Weather",
    date: "Oct 12, 2024",
    excerpt: "Discover why oil-based perfumes last longer than alcohol sprays in tropical climates like Chennai.",
    content: `
      <p class="mb-4">Living in Chennai means contending with a tropical climate where heat and humidity are constant companions. For fragrance lovers, this poses a unique challenge: standard alcohol-based French perfumes (EDPs) tend to "flash off" or evaporate rapidly when they hit hot skin.</p>
      
      <h3 class="text-2xl font-serif text-white mt-8 mb-4">The Chemistry of Heat</h3>
      <p class="mb-4">Alcohol is volatile. In the sweltering heat of MMDA Colony or T. Nagar, an alcohol spray might project loudly for 30 minutes and then vanish. <strong>Attar and Oud oils</strong>, however, are hydrophobic and heavier.</p>
      
      <p class="mb-4">Instead of evaporating, these oils sink into your pores. They rely on your body heat to slowly release their aroma. In fact, Chennai's heat actually <em>helps</em> Oud. As your body temperature rises, the oil warms up and projects the scent further, creating a consistent "scent bubble" that lasts 8-12 hours.</p>

      <h3 class="text-2xl font-serif text-white mt-8 mb-4">Best Profiles for Humidity</h3>
      <ul class="list-disc list-inside space-y-2 mb-6 text-gray-400">
        <li><strong>Vetiver (Ruh Khus):</strong> Known as the "Oil of Tranquility," it cools the body and smells like wet earth after rain.</li>
        <li><strong>White Oud:</strong> A lighter, cleaner variant of Oud that isn't cloying in the sticky weather.</li>
        <li><strong>Shamama:</strong> A complex herbal blend that stands up powerfully against sweat and pollution.</li>
      </ul>
      
      <p>Visit our store in Arumbakkam to test these oils on your skin and see the difference a day in the Chennai sun makes.</p>
    `
  },
  {
    id: "attar-vs-perfume",
    title: "The Difference Between Attar and French Perfume",
    date: "Sep 28, 2024",
    excerpt: "Understanding the concentration, ingredients, and evolution of traditional Itra vs modern EDPs.",
    content: `
      <p class="mb-4">Walk into any mall in Chennai and you're bombarded with "Eau de Parfum" and "Eau de Toilette." But step into Darul Attar, and you enter the world of <strong>Itra</strong>. What exactly is the difference?</p>

      <h3 class="text-2xl font-serif text-white mt-8 mb-4">1. The Base: Alcohol vs. Oil</h3>
      <p class="mb-4">Modern perfumes are 80-95% alcohol. The alcohol acts as a carrier to spray the scent, but it has no smell of its own and can be drying to the skin. <strong>Authentic Attar</strong> is 100% oil concentrate. It uses a base of Sandalwood oil (traditional) or Liquid Paraffin (modern/affordable) to carry the essence.</p>

      <h3 class="text-2xl font-serif text-white mt-8 mb-4">2. The Evolution</h3>
      <p class="mb-4">Alcohol perfumes are designed with "Top Notes" that hit you instantly. Attars are quieter. They don't announce your arrival; they announce your presence. They evolve slowly, often smelling completely different after 1 hour on the skin compared to the first minute.</p>

      <h3 class="text-2xl font-serif text-white mt-8 mb-4">3. Purity</h3>
      <p class="mb-4">For many of our customers in Arumbakkam, purity is spiritual. Our Attars are completely free of alcohol and animal-derived fixatives, making them suitable for prayers and religious occasions.</p>
    `
  },
  {
    id: "top-5-musk",
    title: "Top 5 Long-Lasting Musk Scents for Men",
    date: "Sep 15, 2024",
    excerpt: "Our curated list of masculine musk fragrances that stay with you from morning prayers to late night.",
    content: `
      <p class="mb-4">Musk is the backbone of perfumery. It is primal, clean, and incredibly long-lasting. If you are looking for a signature daily driver that survives the Chennai traffic and office hours, here are our top picks available at Darul Attar.</p>

      <div class="space-y-6 mt-8">
        <div>
            <h4 class="text-xl text-brand-gold font-serif">1. Musk Rijali</h4>
            <p class="text-sm mt-1">"The Heavyweight." Thick, potent, and traditionally masculine. It has spicy undertones and projects authority.</p>
        </div>
        <div>
            <h4 class="text-xl text-brand-gold font-serif">2. White Musk (Tahara)</h4>
            <p class="text-sm mt-1">"The Clean Shirt." Famous for its soapy, fresh-out-of-the-shower vibe. Perfect for Chennai summers and office wear.</p>
        </div>
        <div>
            <h4 class="text-xl text-brand-gold font-serif">3. Black Musk (Kasturi profile)</h4>
            <p class="text-sm mt-1">"The Night Scent." Animalic, deep, and warm. Best suited for evenings or cooler rainy days.</p>
        </div>
        <div>
            <h4 class="text-xl text-brand-gold font-serif">4. Musk Rose</h4>
            <p class="text-sm mt-1">"The Romantic." A blend of soft Taif Rose and clean Musk. A sophisticated choice for weddings.</p>
        </div>
        <div>
            <h4 class="text-xl text-brand-gold font-serif">5. Body Musk</h4>
            <p class="text-sm mt-1">"The Skin Scent." Subtle and powdery. It doesn't project far but makes anyone who hugs you ask what you're wearing.</p>
        </div>
      </div>
    `
  },
  {
    id: "apply-attar-correctly",
    title: "How to Apply Attar Correctly",
    date: "Aug 10, 2024",
    excerpt: "Pulse points, fabric application, and layering tips to get the best projection from your oil.",
    content: `
      <p class="mb-4">We often see customers rubbing their wrists together vigorously after applying Oud. <strong>Stop doing this!</strong> Friction generates heat that breaks down the delicate top notes of the fragrance, changing its character.</p>

      <h3 class="text-2xl font-serif text-white mt-8 mb-4">The "Swipe & Pat" Method</h3>
      <ol class="list-decimal list-inside space-y-3 mb-6 text-gray-400">
        <li><strong>The Swipe:</strong> Use the dipstick to apply a single swipe on the inside of your left wrist.</li>
        <li><strong>The Transfer:</strong> Gently touch your right wrist to your left wrist. Do not rub.</li>
        <li><strong>Pulse Points:</strong> Dab your wrists behind your earlobes and on your neck. These are "pulse points" where veins are close to the skin surface, generating heat that projects the scent.</li>
      </ol>

      <h3 class="text-2xl font-serif text-white mt-8 mb-4">Applying on Fabric (Clothes)</h3>
      <p class="mb-4">Attar lasts significantly longer on fabric than on skin (sometimes days!). However, dark oils like dense Oud can stain white shirts.</p>
      <p><strong>Pro Tip:</strong> Apply the oil to your palms, rub them together lightly until the oil spreads, and then gently pat your clothes (shoulders and chest). This distributes the scent without leaving a concentrated oil spot.</p>
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
    <div className="bg-brand-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-24 font-sans">
        
        <AnimatePresence mode="wait">
            {!selectedPost ? (
                /* List View */
                <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className="text-center mb-16">
                        <span className="text-brand-gold text-sm tracking-widest uppercase font-semibold">The Journal</span>
                        <h1 className="text-4xl md:text-5xl font-thin text-white font-serif mt-4">
                            Notes on <span className="italic text-gray-500">Nose & Nature</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-400">
                            Insights into the world of traditional perfumery from our desk in Arumbakkam.
                        </p>
                    </div>
                    
                    <div className="space-y-12">
                        {blogPosts.map((post, index) => (
                            <motion.article 
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b border-gray-800 pb-10 last:border-0 group cursor-pointer"
                                onClick={() => setSelectedPost(post)}
                            >
                                <div className="text-xs text-brand-gold mb-3 font-bold tracking-wider uppercase">{post.date}</div>
                                <h2 className="text-3xl font-serif text-white group-hover:text-brand-gold transition-colors">{post.title}</h2>
                                <p className="text-gray-400 mt-4 font-light leading-relaxed text-lg">{post.excerpt}</p>
                                <button 
                                    className="mt-6 text-sm text-gray-500 group-hover:text-white underline decoration-gray-800 group-hover:decoration-white underline-offset-4 transition-all"
                                >
                                    Read Article
                                </button>
                            </motion.article>
                        ))}
                    </div>
                </motion.div>
            ) : (
                /* Detail View */
                <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <button 
                        onClick={() => setSelectedPost(null)}
                        className="flex items-center space-x-2 text-sm text-gray-500 hover:text-brand-gold mb-10 group transition-colors"
                    >
                        <ArrowLeftIcon />
                        <span className="group-hover:underline">Back to Journal</span>
                    </button>

                    <article>
                        <header className="mb-10 border-b border-gray-800 pb-10">
                            <div className="text-sm text-brand-gold mb-4 font-bold tracking-wider uppercase">{selectedPost.date}</div>
                            <h1 className="text-4xl md:text-6xl font-thin text-white font-serif leading-tight">
                                {selectedPost.title}
                            </h1>
                        </header>
                        
                        <div 
                            className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:font-thin prose-headings:text-brand-gold prose-p:text-gray-400 prose-p:font-light prose-p:leading-8 prose-li:text-gray-400 prose-strong:text-white prose-strong:font-normal"
                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                        />

                        {/* Article Footer / CTA */}
                        <div className="mt-16 bg-[#0a0a0a] border border-gray-800 p-8 text-center rounded-sm">
                            <h3 className="text-2xl font-serif text-white mb-3">Inspired?</h3>
                            <p className="text-gray-400 mb-6 font-light">Explore our collection of authentic oils or visit us in Chennai to experience them.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
                                    className="bg-brand-gold text-brand-dark py-3 px-8 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors"
                                >
                                    Shop Collection
                                </button>
                                <button
                                    onClick={() => navigate({ name: 'home', props: { section: 'contact' } })}
                                    className="border border-gray-700 text-white py-3 px-8 text-sm font-bold uppercase tracking-widest hover:border-white transition-colors"
                                >
                                    Visit Store
                                </button>
                            </div>
                        </div>
                    </article>
                </motion.div>
            )}
        </AnimatePresence>
        
        {!selectedPost && (
            <div className="mt-16 text-center border-t border-gray-900 pt-12">
                <h3 className="text-xl font-serif text-white mb-4">Have a topic in mind?</h3>
                <p className="text-gray-400 mb-6 font-light">We love discussing fragrances. Visit our store to chat with us.</p>
                <button
                onClick={() => navigate({ name: 'home', props: { section: 'contact' } })}
                className="bg-[#0a0a0a] border border-gray-800 text-white py-3 px-8 text-sm font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all"
                >
                Contact Us
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;