import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CloudinaryUploader from '../components/CloudinaryUploader';
import { supabase } from '../lib/supabase';

type CategoryGroup = 'Best Sellers' | 'Floral & Fresh' | 'Woody & Musk' | 'Gourmand & Spicy';

const CATEGORIES: CategoryGroup[] = ['Best Sellers', 'Floral & Fresh', 'Woody & Musk', 'Gourmand & Spicy'];

const AdminDashboardPage: React.FC = () => {
  const { isAdmin, isLoading, logout, admin } = useAdmin();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [topNotes, setTopNotes] = useState('');
  const [heartNotes, setHeartNotes] = useState('');
  const [baseNotes, setBaseNotes] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryGroup[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [variants, setVariants] = useState<{ size: string; price: string }[]>([{ size: '3ml', price: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate('/admin/login', { replace: true });
  }, [isAdmin, isLoading, navigate]);

  const toggleCategory = (cat: CategoryGroup) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { size: '', price: '' }]);
  };

  const updateVariant = (index: number, field: 'size' | 'price', value: string) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !imageUrl || selectedCategories.length === 0) {
      setMessage({ type: 'error', text: 'Name, description, image, and at least one category are required.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const productData = {
      name,
      description,
      image_url: imageUrl,
      scent_profile: { top: topNotes, heart: heartNotes, base: baseNotes },
      categories: selectedCategories,
      variants: variants
        .filter((v) => v.size && v.price)
        .map((v) => ({ size: v.size, price: parseFloat(v.price) })),
    };

    try {
      const { error: insertError } = await supabase
        .from('products')
        .insert([productData]);

      if (insertError) throw insertError;

      setMessage({ type: 'success', text: 'Product uploaded successfully!' });
      setName('');
      setDescription('');
      setTopNotes('');
      setHeartNotes('');
      setBaseNotes('');
      setSelectedCategories([]);
      setImageUrl('');
      setVariants([{ size: '3ml', price: '' }]);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload product.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 pt-24 pb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-serif text-white">Product Manager</h1>
            <p className="text-gray-400 text-sm mt-1">{admin?.email}</p>
          </div>
          <button
            onClick={logout}
            className="text-xs text-gray-500 hover:text-red-500 transition uppercase tracking-wider"
          >
            Logout
          </button>
        </div>

        {message && (
          <div
            className={`p-4 mb-6 rounded-sm text-sm ${
              message.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-black/50 border border-gray-800 rounded-sm p-6 space-y-5">
            <h2 className="text-lg font-serif text-white border-b border-gray-700 pb-2">Basic Info</h2>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-4 py-2.5 focus:outline-none focus:border-brand-gold transition"
                placeholder="e.g. Royal Oudh"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-4 py-2.5 focus:outline-none focus:border-brand-gold transition resize-none"
                placeholder="Describe the fragrance notes and character..."
                required
              />
            </div>
          </div>

          <div className="bg-black/50 border border-gray-800 rounded-sm p-6 space-y-5">
            <h2 className="text-lg font-serif text-white border-b border-gray-700 pb-2">Scent Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Top Notes</label>
                <input
                  type="text"
                  value={topNotes}
                  onChange={(e) => setTopNotes(e.target.value)}
                  className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-4 py-2.5 focus:outline-none focus:border-brand-gold transition"
                  placeholder="e.g. Bergamot, Saffron"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Heart Notes</label>
                <input
                  type="text"
                  value={heartNotes}
                  onChange={(e) => setHeartNotes(e.target.value)}
                  className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-4 py-2.5 focus:outline-none focus:border-brand-gold transition"
                  placeholder="e.g. Rose, Jasmine"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Base Notes</label>
                <input
                  type="text"
                  value={baseNotes}
                  onChange={(e) => setBaseNotes(e.target.value)}
                  className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-4 py-2.5 focus:outline-none focus:border-brand-gold transition"
                  placeholder="e.g. Musk, Sandalwood"
                />
              </div>
            </div>
          </div>

          <div className="bg-black/50 border border-gray-800 rounded-sm p-6 space-y-5">
            <h2 className="text-lg font-serif text-white border-b border-gray-700 pb-2">Categories *</h2>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 text-sm rounded-sm border transition ${
                    selectedCategories.includes(cat)
                      ? 'bg-brand-gold text-brand-dark border-brand-gold'
                      : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-black/50 border border-gray-800 rounded-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
              <h2 className="text-lg font-serif text-white">Variants (Size & Price)</h2>
              <button
                type="button"
                onClick={addVariant}
                className="text-xs text-brand-gold hover:text-white transition"
              >
                + Add Size
              </button>
            </div>
            {variants.map((v, i) => (
              <div key={i} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={v.size}
                  onChange={(e) => updateVariant(i, 'size', e.target.value)}
                  placeholder="e.g. 3ml"
                  className="flex-1 bg-brand-charcoal border border-gray-700 text-white rounded-sm px-4 py-2.5 focus:outline-none focus:border-brand-gold transition"
                />
                <input
                  type="number"
                  step="0.01"
                  value={v.price}
                  onChange={(e) => updateVariant(i, 'price', e.target.value)}
                  placeholder="Price"
                  className="flex-1 bg-brand-charcoal border border-gray-700 text-white rounded-sm px-4 py-2.5 focus:outline-none focus:border-brand-gold transition"
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-black/50 border border-gray-800 rounded-sm p-6 space-y-5">
            <h2 className="text-lg font-serif text-white border-b border-gray-700 pb-2">Product Image *</h2>
            {imageUrl ? (
              <div className="relative inline-block">
                <img src={imageUrl} alt="Preview" className="w-48 h-48 object-cover rounded-sm" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-red-900/80 text-white text-xs px-2 py-1 rounded hover:bg-red-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <CloudinaryUploader onUpload={(urls) => setImageUrl(urls[0])} />
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-gold text-brand-dark font-bold py-3 rounded-sm hover:bg-white transition disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {submitting ? 'Uploading...' : 'Upload Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
