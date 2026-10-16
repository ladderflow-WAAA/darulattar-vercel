import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import CloudinaryUploader from '../components/CloudinaryUploader';
import { supabase } from '../lib/supabase';
import {
  fetchAllOrders,
  updateOrderStatus as persistOrderStatus,
  deleteOrderRecord,
  checkOrdersCloudSyncStatus,
  OrderRecord
} from '../utils/orderService';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate('/admin/login', { replace: true });
  }, [isAdmin, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col md:flex-row">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : (
        <>
          {/* Mobile Top Header */}
          <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black/95 border-b border-gray-800 z-50 px-4 flex items-center justify-between backdrop-blur-md">
            <div>
              <span className="font-serif text-white text-sm font-semibold tracking-wide">Darul Attar Admin</span>
              <span className="text-[10px] text-[#FF5A00] block uppercase font-mono tracking-wider font-semibold">
                {tab.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="px-2.5 py-1 text-xs bg-gray-900 border border-gray-700 text-gray-200 rounded-sm font-medium"
              >
                {mobileMenuOpen ? '✕ Close' : '☰ Menu'}
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-2 py-1 text-xs text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </div>
          </header>

          {/* Mobile Dropdown Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed top-14 left-0 right-0 bg-black/95 border-b border-gray-800 z-40 p-3 space-y-1 backdrop-blur-md shadow-2xl">
              {([
                { id: 'dashboard', label: 'Dashboard', icon: '◉' },
                { id: 'orders', label: 'Orders & UTR', icon: '▤' },
                { id: 'products', label: 'Products', icon: '◎' },
                { id: 'add', label: 'Add Product', icon: '⊕' },
              ] as { id: Tab; label: string; icon: string }[]).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition ${
                    tab === item.id
                      ? 'bg-[#FF5A00]/20 text-[#FF5A00] font-bold border-l-2 border-[#FF5A00]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Desktop Sidebar (hidden on mobile) */}
          <Sidebar tab={tab} setTab={setTab} admin={admin} logout={logout} />

          {/* Main Content Area */}
          <main className="flex-1 ml-0 md:ml-56 p-4 sm:p-8 pt-18 md:pt-16 min-w-0 overflow-x-hidden">
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
  <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 bg-black/60 border-r border-gray-800 z-50 flex-col">
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
const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cloudStatus, setCloudStatus] = useState<{ connected: boolean; message: string }>({ connected: true, message: '' });
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'WHATSAPP' | 'VERIFIED' | 'DISPATCHED'>('ALL');
  const [search, setSearch] = useState('');
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual Quick-Log Order State
  const [manualForm, setManualForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '',
    itemName: 'Darul Attar Blend',
    itemSize: '6ml',
    quantity: 1,
    price: 350,
    shippingFee: 69,
    utrNumber: '',
    status: 'VERIFICATION_PENDING' as const
  });

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const [orderList, status] = await Promise.all([
        fetchAllOrders(),
        checkOrdersCloudSyncStatus()
      ]);
      setOrders(orderList);
      setCloudStatus(status);
    } catch (err) {
      console.warn('Orders load failed:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(ord => ord.orderId === orderId ? {
      ...ord,
      payment: { ...ord.payment, status: newStatus }
    } : ord));
    await persistOrderStatus(orderId, { paymentStatus: newStatus });
  };

  const assignDelhiveryAwb = async (orderId: string) => {
    const awb = window.prompt('Enter Delhivery Waybill / Tracking AWB Number:');
    if (!awb || !awb.trim()) return;

    setOrders(prev => prev.map(ord => ord.orderId === orderId ? {
      ...ord,
      delhiveryTrackingAwb: awb.trim(),
      payment: { ...ord.payment, status: 'DISPATCHED' }
    } : ord));
    await persistOrderStatus(orderId, {
      paymentStatus: 'DISPATCHED',
      delhiveryTrackingAwb: awb.trim()
    });
  };

  const handleCopy = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      await deleteOrderRecord(orderId);
    }
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName.trim() || !manualForm.phone.trim()) {
      alert('Customer Name and Phone are required.');
      return;
    }

    const newOrder: OrderRecord = {
      orderId: `DAO-M-${Date.now().toString().slice(-6)}`,
      customer: {
        fullName: manualForm.fullName.trim(),
        phone: manualForm.phone.trim(),
        address: manualForm.address.trim(),
        city: manualForm.city.trim(),
        state: manualForm.state.trim(),
        pincode: manualForm.pincode.trim()
      },
      items: [
        {
          name: manualForm.itemName,
          size: manualForm.itemSize,
          quantity: Number(manualForm.quantity) || 1,
          price: Number(manualForm.price) || 0
        }
      ],
      subtotal: (Number(manualForm.price) || 0) * (Number(manualForm.quantity) || 1),
      shippingFee: Number(manualForm.shippingFee) || 0,
      total: ((Number(manualForm.price) || 0) * (Number(manualForm.quantity) || 1)) + (Number(manualForm.shippingFee) || 0),
      shippingSpeed: 'Delhivery Standard',
      payment: {
        method: manualForm.utrNumber ? 'DIRECT_MERCHANT_UPI' : 'WHATSAPP_CHECKOUT',
        utrNumber: manualForm.utrNumber.trim(),
        status: manualForm.status
      },
      createdAt: new Date().toISOString()
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    await persistOrderStatus(newOrder.orderId, { paymentStatus: newOrder.payment.status });
    setShowManualModal(false);
    setManualForm({
      fullName: '',
      phone: '',
      address: '',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '',
      itemName: 'Darul Attar Blend',
      itemSize: '6ml',
      quantity: 1,
      price: 350,
      shippingFee: 69,
      utrNumber: '',
      status: 'VERIFICATION_PENDING'
    });
  };

  const filteredOrders = orders.filter(ord => {
    const status = ord.payment?.status || '';
    const matchesFilter =
      filter === 'ALL'
        ? true
        : filter === 'PENDING'
        ? status === 'VERIFICATION_PENDING'
        : filter === 'WHATSAPP'
        ? status === 'WHATSAPP_ENQUIRY'
        : filter === 'VERIFIED'
        ? status === 'VERIFIED_PAID'
        : status === 'DISPATCHED';

    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ord.orderId.toLowerCase().includes(q) ||
      (ord.customer?.fullName && ord.customer.fullName.toLowerCase().includes(q)) ||
      (ord.customer?.phone && ord.customer.phone.includes(q)) ||
      (ord.payment?.utrNumber && ord.payment.utrNumber.includes(q));

    return matchesFilter && matchesSearch;
  });

  const pendingUtrCount = orders.filter(o => o.payment?.status === 'VERIFICATION_PENDING').length;
  const whatsappCount = orders.filter(o => o.payment?.status === 'WHATSAPP_ENQUIRY').length;
  const verifiedCount = orders.filter(o => o.payment?.status === 'VERIFIED_PAID').length;
  const totalRevenue = orders
    .filter(o => o.payment?.status === 'VERIFIED_PAID' || o.payment?.status === 'DISPATCHED')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Verification Guidance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-4">
        <div>
          <h2 className="text-xl font-serif text-white">Orders &amp; UTR Reconciliation</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Cross-device order management synchronized across mobile and desktop.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="text-xs bg-[#FF5A00] hover:bg-[#EA580C] text-white px-3 py-1.5 rounded-sm font-semibold transition"
          >
            + Log Order Manually
          </button>
          <button
            type="button"
            onClick={loadOrders}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-sm transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Cloud Database Alert */}
      {!cloudStatus.connected && (
        <div className="p-4 bg-amber-950/40 border border-amber-800 rounded-sm text-xs text-amber-200 space-y-1">
          <div className="font-bold flex items-center gap-2 text-amber-300">
            <span>⚠️ Multi-Device Cloud Sync Notice</span>
          </div>
          <p className="leading-relaxed">
            The database table <code>orders</code> is not active in Supabase ({cloudStatus.message}).
            Orders on this device are saved in local browser memory. To access orders across your mobile phone and PC, run <code>CREATE-ORDERS-TABLE.sql</code> in your Supabase SQL Editor.
          </p>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-black/60 border border-gray-800 rounded-sm">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Orders</span>
          <span className="text-xl font-mono font-bold text-white mt-1 block">{orders.length}</span>
        </div>
        <div className="p-3 bg-black/60 border border-gray-800 rounded-sm">
          <span className="text-[10px] text-amber-400 uppercase tracking-wider block">Pending UTR Check</span>
          <span className="text-xl font-mono font-bold text-amber-400 mt-1 block">{pendingUtrCount}</span>
        </div>
        <div className="p-3 bg-black/60 border border-gray-800 rounded-sm">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">WhatsApp Enquiries</span>
          <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">{whatsappCount}</span>
        </div>
        <div className="p-3 bg-black/60 border border-gray-800 rounded-sm">
          <span className="text-[10px] text-blue-400 uppercase tracking-wider block">Verified &amp; Paid</span>
          <span className="text-xl font-mono font-bold text-blue-400 mt-1 block">{verifiedCount}</span>
        </div>
        <div className="p-3 bg-black/60 border border-gray-800 rounded-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Settled</span>
          <span className="text-xl font-mono font-bold text-white mt-1 block">₹{totalRevenue.toFixed(2)}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-black/40 border border-gray-800 p-3 rounded-sm">
        <div className="flex gap-1.5 flex-wrap w-full sm:w-auto">
          {(['ALL', 'PENDING', 'WHATSAPP', 'VERIFIED', 'DISPATCHED'] as const).map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setFilter(tabKey)}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-sm font-semibold transition ${
                filter === tabKey
                  ? 'bg-[#FF5A00] text-white'
                  : 'bg-black text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {tabKey === 'PENDING' ? 'Pending UTR' : tabKey === 'WHATSAPP' ? 'WhatsApp' : tabKey}
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

      {/* Loading State */}
      {loadingOrders ? (
        <div className="p-12 text-center bg-black/40 border border-gray-800 rounded-sm">
          <p className="text-gray-400 text-sm">Loading orders from database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-black/40 border border-gray-800 rounded-sm">
          <p className="text-gray-400 text-sm">No orders matching the current filter.</p>
          <p className="text-gray-500 text-xs mt-1">
            New orders from website checkout or WhatsApp inquiries will show here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isPendingUtr = order.payment?.status === 'VERIFICATION_PENDING';
            const isWhatsapp = order.payment?.status === 'WHATSAPP_ENQUIRY';
            const isVerified = order.payment?.status === 'VERIFIED_PAID';
            const isDispatched = order.payment?.status === 'DISPATCHED';

            return (
              <div
                key={order.orderId}
                className="bg-black/60 border border-gray-800 rounded-sm p-4 sm:p-5 space-y-4 hover:border-gray-700 transition"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-800 gap-2">
                  <div className="flex items-center space-x-3 flex-wrap">
                    <span className="font-mono font-bold text-white text-sm sm:text-base">{order.orderId}</span>
                    <span className="text-[11px] text-gray-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : ''}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                        isPendingUtr
                          ? 'bg-amber-950/40 text-amber-400 border border-amber-800'
                          : isWhatsapp
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
                          : isVerified
                          ? 'bg-blue-950/40 text-blue-300 border border-blue-800'
                          : isDispatched
                          ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-800'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {isPendingUtr
                        ? 'Pending UTR Verification'
                        : isWhatsapp
                        ? 'WhatsApp Enquiry'
                        : isVerified
                        ? 'Verified & Paid'
                        : isDispatched
                        ? 'Dispatched'
                        : order.payment?.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Customer Information */}
                  <div className="p-3 bg-black/40 border border-gray-800/80 rounded-sm space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                      Customer &amp; Address
                    </span>
                    <p className="font-bold text-white">{order.customer?.fullName}</p>
                    <p className="text-gray-300 font-mono">{order.customer?.phone}</p>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      {order.customer?.address}
                      {order.customer?.city ? `, ${order.customer.city}` : ''}
                      {order.customer?.pincode ? ` - ${order.customer.pincode}` : ''}
                    </p>
                  </div>

                  {/* Payment & 12-Digit UTR */}
                  <div className="p-3 bg-black/40 border border-gray-800/80 rounded-sm space-y-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                      Payment Details
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Payable:</span>
                      <span className="font-mono font-bold text-white text-sm">₹{order.total?.toFixed(2)}</span>
                    </div>

                    <div className="pt-1">
                      <span className="text-gray-400 text-[11px] block">
                        {isWhatsapp ? 'Method:' : '12-Digit UTR / Reference:'}
                      </span>
                      <div className="flex items-center justify-between mt-0.5 p-1.5 bg-black border border-gray-700 rounded-sm">
                        <span className="font-mono text-xs text-[#FF5A00] font-bold select-all tracking-wider truncate mr-1">
                          {isWhatsapp ? 'WhatsApp Enquiry' : order.payment?.utrNumber || 'Not entered'}
                        </span>
                        {order.payment?.utrNumber && (
                          <button
                            type="button"
                            onClick={() => handleCopy(order.payment.utrNumber!)}
                            className="text-[10px] bg-gray-800 hover:bg-gray-700 text-white px-2 py-0.5 rounded transition shrink-0"
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
                    <p className="text-gray-300">{order.shippingSpeed || 'Delhivery Standard'}</p>
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
                <div className="pt-1 text-xs text-gray-300">
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

                  {(isPendingUtr || isWhatsapp) && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order.orderId, 'VERIFIED_PAID')}
                      className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-sm transition"
                    >
                      Verify &amp; Mark Paid
                    </button>
                  )}

                  {!isDispatched && (
                    <button
                      type="button"
                      onClick={() => assignDelhiveryAwb(order.orderId)}
                      className="px-3 py-1.5 text-xs bg-[#FF5A00] hover:bg-[#EA580C] text-white font-semibold rounded-sm transition"
                    >
                      Assign Delhivery AWB
                    </button>
                  )}

                  <button
                    type="button"
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

      {/* Manual Order Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-gray-800 rounded-sm p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-serif text-white text-lg">Log Order Manually</h3>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.fullName}
                  onChange={e => setManualForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                  placeholder="e.g. Sameeulla.M"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 block mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.phone}
                    onChange={e => setManualForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                    placeholder="e.g. 8608133694"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={manualForm.pincode}
                    onChange={e => setManualForm(prev => ({ ...prev, pincode: e.target.value }))}
                    className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                    placeholder="e.g. 600106"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Street Address</label>
                <textarea
                  rows={2}
                  value={manualForm.address}
                  onChange={e => setManualForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                  placeholder="e.g. 5/36 1st Street Periyar Nagar Padappai"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-gray-400 block mb-1">Item Name</label>
                  <input
                    type="text"
                    value={manualForm.itemName}
                    onChange={e => setManualForm(prev => ({ ...prev, itemName: e.target.value }))}
                    className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Size</label>
                  <input
                    type="text"
                    value={manualForm.itemSize}
                    onChange={e => setManualForm(prev => ({ ...prev, itemSize: e.target.value }))}
                    className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-gray-400 block mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={manualForm.quantity}
                    onChange={e => setManualForm(prev => ({ ...prev, quantity: Number(e.target.value) || 1 }))}
                    className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={manualForm.price}
                    onChange={e => setManualForm(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
                    className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Shipping (₹)</label>
                  <input
                    type="number"
                    value={manualForm.shippingFee}
                    onChange={e => setManualForm(prev => ({ ...prev, shippingFee: Number(e.target.value) || 0 }))}
                    className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 block mb-1">12-Digit UTR (Optional)</label>
                  <input
                    type="text"
                    value={manualForm.utrNumber}
                    onChange={e => setManualForm(prev => ({ ...prev, utrNumber: e.target.value }))}
                    className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                    placeholder="If paid via UPI"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Initial Status</label>
                  <select
                    value={manualForm.status}
                    onChange={e => setManualForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-black border border-gray-700 p-2 rounded-sm text-white focus:border-[#FF5A00] outline-none"
                  >
                    <option value="WHATSAPP_ENQUIRY">WhatsApp Enquiry</option>
                    <option value="VERIFICATION_PENDING">Pending UTR</option>
                    <option value="VERIFIED_PAID">Verified &amp; Paid</option>
                    <option value="DISPATCHED">Dispatched</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-sm hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#FF5A00] hover:bg-[#EA580C] text-white rounded-sm font-semibold transition"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
