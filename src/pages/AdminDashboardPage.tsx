import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import CloudinaryUploader from '../components/CloudinaryUploader';
import { supabase } from '../lib/supabase';

type CategoryGroup = 'Best Sellers' | 'Floral & Fresh' | 'Woody & Musk' | 'Gourmand & Spicy';
type Tab = 'dashboard' | 'orders' | 'products' | 'add';

const CATEGORIES: CategoryGroup[] = ['Best Sellers', 'Floral & Fresh', 'Woody & Musk', 'Gourmand & Spicy'];
const CATEGORY_COLORS: Record<string, string> = {
  'Best Sellers': 'bg-yellow-900/40 text-yellow-400 border-yellow-700',
  'Floral & Fresh': 'bg-pink-900/40 text-pink-400 border-pink-700',
  'Woody & Musk': 'bg-amber-900/40 text-amber-400 border-amber-700',
  'Gourmand & Spicy': 'bg-orange-900/40 text-orange-400 border-orange-700',
};

interface FullProduct {
  id: string; name: string; description: string; image_url: string;
  scent_profile: { top: string; heart: string; base: string };
  variants: { size: string; price: number }[];
  categories: string[]; created_at: string;
}

const AdminDashboardPage: React.FC = () => {
  const { isAdmin, isLoading, logout, admin } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dashboard');

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate('/admin/login', { replace: true });
  }, [isAdmin, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : (
        <>
          <Sidebar tab={tab} setTab={setTab} admin={admin} logout={logout} />
          <main className="flex-1 ml-56 p-8 pt-16 overflow-auto">
            {tab === 'dashboard' && <DashboardTab />}
            {tab === 'orders' && <OrdersTab />}
            {tab === 'products' && <ProductsTab />}
            {tab === 'add' && <AddProductTab />}
          </main>
        </>
      )}
    </div>
  );
};

/* ─── SIDEBAR ─── */
const Sidebar: React.FC<{ tab: Tab; setTab: (t: Tab) => void; admin: any; logout: () => void }> = ({ tab, setTab, admin, logout }) => (
  <aside className="fixed left-0 top-0 bottom-0 w-56 bg-black/60 border-r border-gray-800 z-50 flex flex-col">
    <div className="p-5 border-b border-gray-800">
      <h1 className="text-lg font-serif text-white">Darul Attar</h1>
      <p className="text-xs text-gray-500 mt-0.5">{admin?.email}</p>
    </div>
    <nav className="flex-1 p-3 space-y-1">
      {([
        { id: 'dashboard', label: 'Dashboard', icon: '◉' },
        { id: 'orders', label: 'Orders & UTR', icon: '▤' },
        { id: 'products', label: 'Products', icon: '◎' },
        { id: 'add', label: 'Add Product', icon: '⊕' },
      ] as { id: Tab; label: string; icon: string }[]).map((item) => (
        <button
          key={item.id}
          onClick={() => setTab(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition ${
            tab === item.id
              ? 'bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
    <div className="p-3 border-t border-gray-800">
      <button onClick={logout} className="w-full text-xs text-gray-500 hover:text-red-500 transition py-2 uppercase tracking-wider">
        Logout
      </button>
    </div>
  </aside>
);

/* ─── DASHBOARD TAB ─── */
const DashboardTab: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, variants: 0, newest: 0 });
  const [recent, setRecent] = useState<FullProduct[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) {
        const vCount = data.reduce((a, p) => a + (p.variants?.length || 0), 0);
        setStats({ total: data.length, variants: vCount, newest: data.filter(p => {
          const d = new Date(p.created_at);
          return Date.now() - d.getTime() < 86400000 * 7;
        }).length });
        setRecent(data.slice(0, 5));
      }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-serif text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Products', value: stats.total },
          { label: 'Total Variants', value: stats.variants },
          { label: 'Added This Week', value: stats.newest },
        ].map((s) => (
          <div key={s.label} className="bg-black/50 border border-gray-800 rounded-sm p-5">
            <p className="text-gray-500 text-xs uppercase tracking-wider">{s.label}</p>
            <p className="text-3xl font-serif text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-black/50 border border-gray-800 rounded-sm p-5">
        <h3 className="text-sm font-serif text-white border-b border-gray-700 pb-2 mb-3">Recently Added</h3>
        {recent.length === 0 ? (
          <p className="text-gray-500 text-sm">No products yet.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((p) => (
              <div key={p.id} className="flex items-center gap-3 text-sm">
                <img src={p.image_url} alt="" className="w-8 h-8 object-cover rounded-sm" />
                <span className="text-white flex-1 truncate">{p.name}</span>
                <span className="text-gray-500 text-xs">{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── PRODUCTS TAB ─── */
const ProductsTab: React.FC = () => {
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  const [editing, setEditing] = useState<FullProduct | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from('products').delete().eq('id', id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    })
    .filter((p) => !categoryFilter || p.categories?.includes(categoryFilter))
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sort === 'az') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-white">Products ({filtered.length})</h2>
        <button onClick={fetch} className="text-xs text-brand-gold hover:text-white transition">Refresh</button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-brand-gold transition"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-brand-charcoal border border-gray-700 text-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="bg-brand-charcoal border border-gray-700 text-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading products...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No products match your search.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-3 bg-black/50 border border-gray-800 rounded-sm p-3 hover:border-gray-700 transition group">
              <img src={p.image_url || '/placeholder.png'} alt="" className="w-10 h-10 object-cover rounded-sm flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{p.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {p.categories?.map((c) => (
                    <span key={c} className={`text-[10px] px-1.5 py-0.5 rounded-sm border ${CATEGORY_COLORS[c] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {c}
                    </span>
                  ))}
                  <span className="text-gray-600 text-xs">
                    {p.variants?.length || 0} variant{(p.variants?.length || 0) !== 1 ? 's' : ''} &middot; ₹{Math.min(...(p.variants?.map(v => v.price) || [0]))}+
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => setEditing(p)} className="text-gray-400 hover:text-brand-gold text-xs px-2 py-1">Edit</button>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                  className="text-gray-500 hover:text-red-500 text-xs px-2 py-1 disabled:opacity-50"
                >
                  {deleting === p.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <EditModal product={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetch(); }} />}
    </div>
  );
};

/* ─── EDIT MODAL ─── */
const EditModal: React.FC<{ product: FullProduct; onClose: () => void; onSaved: () => void }> = ({ product, onClose, onSaved }) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [topNotes, setTopNotes] = useState(product.scent_profile?.top || '');
  const [heartNotes, setHeartNotes] = useState(product.scent_profile?.heart || '');
  const [baseNotes, setBaseNotes] = useState(product.scent_profile?.base || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(product.categories || []);
  const [variants, setVariants] = useState<{ size: string; price: string }[]>(
    (product.variants || []).map((v) => ({ size: v.size, price: String(v.price) }))
  );
  const [imageUrl, setImageUrl] = useState(product.image_url);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('products')
      .update({
        name, description,
        scent_profile: { top: topNotes, heart: heartNotes, base: baseNotes },
        categories: selectedCategories,
        variants: variants.filter(v => v.size && v.price).map(v => ({ size: v.size, price: parseFloat(v.price) })),
        image_url: imageUrl,
      })
      .eq('id', product.id);
    setSaving(false);
    if (!error) onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="bg-brand-dark border border-gray-700 rounded-sm w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-serif text-white">Edit Product</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-lg">&times;</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Top Notes</label>
              <input value={topNotes} onChange={(e) => setTopNotes(e.target.value)} className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Heart Notes</label>
              <input value={heartNotes} onChange={(e) => setHeartNotes(e.target.value)} className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Base Notes</label>
              <input value={baseNotes} onChange={(e) => setBaseNotes(e.target.value)} className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Categories</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => setSelectedCategories((prev) => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                  className={`text-xs px-2.5 py-1 rounded-sm border transition ${selectedCategories.includes(cat) ? 'bg-brand-gold text-brand-dark border-brand-gold' : 'bg-transparent text-gray-400 border-gray-600'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Image</label>
            {imageUrl ? (
              <div className="relative inline-block">
                <img src={imageUrl} alt="" className="w-24 h-24 object-cover rounded-sm" />
                <button onClick={() => setImageUrl('')} className="absolute top-1 right-1 bg-red-900/80 text-white text-[10px] px-1.5 py-0.5 rounded hover:bg-red-800">Remove</button>
              </div>
            ) : (
              <CloudinaryUploader onUpload={(urls) => setImageUrl(urls[0])} />
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Variants</label>
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="flex gap-2">
                  <input value={v.size} onChange={(e) => { const n = [...variants]; n[i] = { ...n[i], size: e.target.value }; setVariants(n); }} placeholder="Size" className="flex-1 bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
                  <input value={v.price} onChange={(e) => { const n = [...variants]; n[i] = { ...n[i], price: e.target.value }; setVariants(n); }} placeholder="Price" type="number" step="0.01" className="flex-1 bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
                  {variants.length > 1 && <button onClick={() => setVariants(variants.filter((_, j) => j !== i))} className="text-red-500 text-xs">✕</button>}
                </div>
              ))}
              <button onClick={() => setVariants([...variants, { size: '', price: '' }])} className="text-xs text-brand-gold hover:text-white transition">+ Add variant</button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-400 border border-gray-700 rounded-sm hover:text-white transition">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2 text-sm bg-brand-gold text-brand-dark font-bold rounded-sm hover:bg-white transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── ADD PRODUCT TAB ─── */
const AddProductTab: React.FC = () => {
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

  const toggleCategory = (cat: CategoryGroup) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
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
      variants: variants.filter((v) => v.size && v.price).map((v) => ({ size: v.size, price: parseFloat(v.price) })),
    };

    try {
      const { error: insertError } = await supabase.from('products').insert([productData]);
      if (insertError) throw insertError;
      setMessage({ type: 'success', text: 'Product uploaded successfully!' });
      setName(''); setDescription(''); setTopNotes(''); setHeartNotes(''); setBaseNotes('');
      setSelectedCategories([]); setImageUrl(''); setVariants([{ size: '3ml', price: '' }]);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload product.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-serif text-white mb-6">Add New Product</h2>

      {message && (
        <div className={`p-3 mb-5 rounded-sm text-sm ${message.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-black/50 border border-gray-800 rounded-sm p-5 space-y-4">
          <h3 className="text-sm font-serif text-white border-b border-gray-700 pb-1.5">Basic Info</h3>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Product Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" placeholder="e.g. Royal Oudh" required />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold resize-none" required />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Top Notes</label>
              <input value={topNotes} onChange={(e) => setTopNotes(e.target.value)} className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" placeholder="Bergamot, Saffron" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Heart Notes</label>
              <input value={heartNotes} onChange={(e) => setHeartNotes(e.target.value)} className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" placeholder="Rose, Jasmine" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Base Notes</label>
              <input value={baseNotes} onChange={(e) => setBaseNotes(e.target.value)} className="w-full bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" placeholder="Musk, Sandalwood" />
            </div>
          </div>
        </div>

        <div className="bg-black/50 border border-gray-800 rounded-sm p-5 space-y-3">
          <h3 className="text-sm font-serif text-white border-b border-gray-700 pb-1.5">Categories & Variants</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                className={`text-xs px-2.5 py-1.5 rounded-sm border transition ${selectedCategories.includes(cat) ? 'bg-brand-gold text-brand-dark border-brand-gold' : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-2 pt-1">
            {variants.map((v, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={v.size} onChange={(e) => { const n = [...variants]; n[i] = { ...n[i], size: e.target.value }; setVariants(n); }} placeholder="Size" className="flex-1 bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
                <input value={v.price} onChange={(e) => { const n = [...variants]; n[i] = { ...n[i], price: e.target.value }; setVariants(n); }} placeholder="Price" type="number" step="0.01" className="flex-1 bg-brand-charcoal border border-gray-700 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
                {variants.length > 1 && <button type="button" onClick={() => setVariants(variants.filter((_, j) => j !== i))} className="text-red-500 text-xs">✕</button>}
              </div>
            ))}
            <button type="button" onClick={() => setVariants([...variants, { size: '', price: '' }])} className="text-xs text-brand-gold hover:text-white transition">+ Add Size</button>
          </div>
        </div>

        <div className="bg-black/50 border border-gray-800 rounded-sm p-5 space-y-3">
          <h3 className="text-sm font-serif text-white border-b border-gray-700 pb-1.5">Product Image *</h3>
          {imageUrl ? (
            <div className="relative inline-block">
              <img src={imageUrl} alt="" className="w-32 h-32 object-cover rounded-sm" />
              <button type="button" onClick={() => setImageUrl('')} className="absolute top-1.5 right-1.5 bg-red-900/80 text-white text-[10px] px-1.5 py-0.5 rounded hover:bg-red-800">Remove</button>
            </div>
          ) : (
            <CloudinaryUploader onUpload={(urls) => setImageUrl(urls[0])} />
          )}
        </div>

        <button type="submit" disabled={submitting} className="w-full bg-brand-gold text-brand-dark font-bold py-2.5 rounded-sm hover:bg-white transition disabled:opacity-50 uppercase tracking-widest text-sm">
          {submitting ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>
    </div>
  );
};

/* ─── ORDERS & UTR VERIFICATION TAB ─── */
interface AdminOrder {
  orderId: string;
  items: { name: string; size: string; quantity: number; price: number }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingSpeed: string;
  estimatedDeliveryDate?: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  payment: {
    method: string;
    utrNumber?: string;
    vpa?: string;
    status: 'VERIFICATION_PENDING' | 'VERIFIED_PAID' | 'DISPATCHED' | 'CANCELLED' | string;
  };
  delhiveryTrackingAwb?: string;
  createdAt: string;
}

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'DISPATCHED'>('ALL');
  const [search, setSearch] = useState('');
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  const loadOrders = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('darulattar_orders') || '[]');
      setOrders(stored);
    } catch {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const saveOrders = (updated: AdminOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem('darulattar_orders', JSON.stringify(updated));
    } catch {}
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map(ord => {
      if (ord.orderId === orderId) {
        return {
          ...ord,
          payment: { ...ord.payment, status: newStatus }
        };
      }
      return ord;
    });
    saveOrders(updated);
  };

  const assignDelhiveryAwb = (orderId: string) => {
    const awb = window.prompt('Enter Delhivery Waybill / Tracking AWB Number:');
    if (!awb || !awb.trim()) return;

    const updated = orders.map(ord => {
      if (ord.orderId === orderId) {
        return {
          ...ord,
          delhiveryTrackingAwb: awb.trim(),
          payment: { ...ord.payment, status: 'DISPATCHED' }
        };
      }
      return ord;
    });
    saveOrders(updated);
  };

  const handleCopy = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      const updated = orders.filter(o => o.orderId !== orderId);
      saveOrders(updated);
    }
  };

  const filteredOrders = orders.filter(ord => {
    const matchesFilter =
      filter === 'ALL'
        ? true
        : filter === 'PENDING'
        ? ord.payment?.status === 'VERIFICATION_PENDING'
        : filter === 'VERIFIED'
        ? ord.payment?.status === 'VERIFIED_PAID'
        : ord.payment?.status === 'DISPATCHED';

    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ord.orderId.toLowerCase().includes(q) ||
      ord.customer.fullName.toLowerCase().includes(q) ||
      ord.customer.phone.includes(q) ||
      (ord.payment?.utrNumber && ord.payment.utrNumber.includes(q));

    return matchesFilter && matchesSearch;
  });

  const pendingCount = orders.filter(o => o.payment?.status === 'VERIFICATION_PENDING').length;
  const verifiedCount = orders.filter(o => o.payment?.status === 'VERIFIED_PAID').length;
  const totalRevenue = orders
    .filter(o => o.payment?.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Verification Guidance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-4">
        <div>
          <h2 className="text-xl font-serif text-white">Orders &amp; UTR Reconciliation</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Step 2: Match incoming 12-digit UTR against your Paytm Business statement (paytm.s2gnznb@pty).
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-sm transition self-start"
        >
          Refresh Orders
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-black/60 border border-gray-800 rounded-sm">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Orders</span>
          <span className="text-2xl font-mono font-bold text-white mt-1 block">{orders.length}</span>
        </div>
        <div className="p-4 bg-black/60 border border-gray-800 rounded-sm">
          <span className="text-[10px] text-amber-400 uppercase tracking-wider block">Pending UTR Check</span>
          <span className="text-2xl font-mono font-bold text-amber-400 mt-1 block">{pendingCount}</span>
        </div>
        <div className="p-4 bg-black/60 border border-gray-800 rounded-sm">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Verified &amp; Paid</span>
          <span className="text-2xl font-mono font-bold text-emerald-400 mt-1 block">{verifiedCount}</span>
        </div>
        <div className="p-4 bg-black/60 border border-gray-800 rounded-sm">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Settled</span>
          <span className="text-2xl font-mono font-bold text-white mt-1 block">₹{totalRevenue.toFixed(2)}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-black/40 border border-gray-800 p-3 rounded-sm">
        <div className="flex gap-2">
          {(['ALL', 'PENDING', 'VERIFIED', 'DISPATCHED'] as const).map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setFilter(tabKey)}
              className={`px-3 py-1 text-xs uppercase tracking-wider rounded-sm font-semibold transition ${
                filter === tabKey
                  ? 'bg-[#FF5A00] text-white'
                  : 'bg-black text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {tabKey}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID, Phone, or UTR..."
          className="w-full sm:w-72 bg-black border border-gray-700 px-3 py-1.5 rounded-sm text-xs text-white focus:border-[#FF5A00] outline-none"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-black/40 border border-gray-800 rounded-sm">
          <p className="text-gray-400 text-sm">No orders matching the current filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isPending = order.payment?.status === 'VERIFICATION_PENDING';
            const isVerified = order.payment?.status === 'VERIFIED_PAID';
            const isDispatched = order.payment?.status === 'DISPATCHED';

            return (
              <div
                key={order.orderId}
                className="bg-black/60 border border-gray-800 rounded-sm p-5 space-y-4 hover:border-gray-700 transition"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-800 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-white text-base">{order.orderId}</span>
                    <span className="text-xs text-gray-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : ''}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                        isPending
                          ? 'bg-amber-950/40 text-amber-400 border border-amber-800'
                          : isVerified
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
                          : isDispatched
                          ? 'bg-blue-950/40 text-blue-400 border border-blue-800'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {order.payment?.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Customer Information */}
                  <div className="p-3 bg-black/40 border border-gray-800/80 rounded-sm space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                      Customer &amp; Address
                    </span>
                    <p className="font-bold text-white">{order.customer?.fullName}</p>
                    <p className="text-gray-300 font-mono">{order.customer?.phone}</p>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}
                    </p>
                  </div>

                  {/* Payment & 12-Digit UTR */}
                  <div className="p-3 bg-black/40 border border-gray-800/80 rounded-sm space-y-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                      UPI Payment &amp; UTR Details
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Payable:</span>
                      <span className="font-mono font-bold text-white text-sm">₹{order.total?.toFixed(2)}</span>
                    </div>

                    <div className="pt-1">
                      <span className="text-gray-400 text-[11px] block">12-Digit UTR / Reference:</span>
                      <div className="flex items-center justify-between mt-0.5 p-1.5 bg-black border border-gray-700 rounded-sm">
                        <span className="font-mono text-xs text-[#FF5A00] font-bold select-all tracking-wider">
                          {order.payment?.utrNumber || 'Not entered'}
                        </span>
                        {order.payment?.utrNumber && (
                          <button
                            type="button"
                            onClick={() => handleCopy(order.payment.utrNumber!)}
                            className="text-[10px] bg-gray-800 hover:bg-gray-700 text-white px-2 py-0.5 rounded transition"
                          >
                            {copiedUtr === order.payment.utrNumber ? 'Copied' : 'Copy'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delhivery Logistics */}
                  <div className="p-3 bg-black/40 border border-gray-800/80 rounded-sm space-y-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                      Logistics (Delhivery)
                    </span>
                    <p className="text-gray-300">{order.shippingSpeed}</p>
                    {order.delhiveryTrackingAwb ? (
                      <div>
                        <span className="text-[10px] text-gray-400">AWB Tracking Number:</span>
                        <a
                          href={`https://www.delhivery.com/track/package/${order.delhiveryTrackingAwb}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[#FF5A00] underline block text-xs"
                        >
                          {order.delhiveryTrackingAwb}
                        </a>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-500 italic">No AWB assigned yet</span>
                    )}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="pt-2 text-xs text-gray-300">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Items:</span>
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((it, idx) => (
                      <span
                        key={idx}
                        className="bg-black/60 border border-gray-800 px-2.5 py-1 rounded-sm text-[11px]"
                      >
                        {it.quantity}x {it.name} ({it.size}) — ₹{(it.price * it.quantity).toFixed(2)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification & Dispatch Actions */}
                <div className="pt-3 border-t border-gray-800 flex flex-wrap gap-2 justify-end items-center">
                  <a
                    href={`https://wa.me/91${order.customer?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${order.customer?.fullName}, regarding your Darul Attar Order ${order.orderId}:`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs bg-[#25D366] hover:bg-[#20bd4d] text-white font-semibold rounded-sm transition"
                  >
                    WhatsApp Customer
                  </a>

                  {isPending && (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'VERIFIED_PAID')}
                      className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-sm transition"
                    >
                      Verify &amp; Mark Paid
                    </button>
                  )}

                  {!isDispatched && (
                    <button
                      onClick={() => assignDelhiveryAwb(order.orderId)}
                      className="px-3 py-1.5 text-xs bg-[#FF5A00] hover:bg-[#EA580C] text-white font-semibold rounded-sm transition"
                    >
                      Assign Delhivery AWB
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(order.orderId)}
                    className="px-2.5 py-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-red-950/20 rounded-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
