import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search, Package, Upload, Copy, Flame, Wand2, ChevronDown, ChevronUp, ImageOff } from 'lucide-react';
import { toast } from 'sonner';
import { PAYMENT_URL } from '@/config/payment';
import PaymentUrlPanel from '@/components/admin/PaymentUrlPanel';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
  buy_link: string;
  is_active: boolean;
  is_hot_selling: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image_url: string | null;
}

type FormState = Omit<Product, 'id'>;

const defaultProduct: FormState = {
  name: '',
  price: 0,
  original_price: null,
  category: 'AI Tools',
  description: '',
  image_url: '',
  image_alt: '',
  buy_link: PAYMENT_URL,
  is_active: true,
  is_hot_selling: false,
  sort_order: 0,
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  og_image_url: '',
};

const categories = [
  'AI Tools', 'Video Editing', 'Indian OTT', 'International OTT',
  'Writing Tools', 'Cloud Services', 'Lead Generation', 'SEO',
  'VPN', 'Software', 'Design Tools', 'Other',
];

/** Convert Google Drive share URLs to a direct-image URL. */
function normalizeImageUrl(raw: string): string {
  if (!raw) return raw;
  const url = raw.trim();
  // https://drive.google.com/file/d/FILE_ID/view?...
  const m1 = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m1) return `https://drive.google.com/uc?export=view&id=${m1[1]}`;
  // https://drive.google.com/open?id=FILE_ID
  const m2 = url.match(/[?&]id=([^&]+)/);
  if (m2 && /drive\.google\.com/.test(url)) return `https://drive.google.com/uc?export=view&id=${m2[1]}`;
  return url;
}

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(defaultProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) { toast.error('Failed to load products'); console.error(error); }
    else setProducts((data || []) as Product[]);
    setLoading(false);
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm(defaultProduct);
    setImgError(false);
    setShowSeo(false);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      price: p.price,
      original_price: p.original_price,
      category: p.category,
      description: p.description || '',
      image_url: p.image_url || '',
      image_alt: p.image_alt || '',
      buy_link: p.buy_link,
      is_active: p.is_active,
      is_hot_selling: p.is_hot_selling || false,
      sort_order: p.sort_order,
      seo_title: p.seo_title || '',
      seo_description: p.seo_description || '',
      seo_keywords: p.seo_keywords || '',
      og_image_url: p.og_image_url || '',
    });
    setImgError(false);
    setShowSeo(false);
    setDialogOpen(true);
  };

  const duplicate = (p: Product) => {
    setEditProduct(null);
    setForm({
      name: `${p.name} (Copy)`,
      price: p.price,
      original_price: p.original_price,
      category: p.category,
      description: p.description || '',
      image_url: p.image_url || '',
      image_alt: p.image_alt || '',
      buy_link: p.buy_link,
      is_active: false,
      is_hot_selling: false,
      sort_order: p.sort_order + 1,
      seo_title: p.seo_title || '',
      seo_description: p.seo_description || '',
      seo_keywords: p.seo_keywords || '',
      og_image_url: p.og_image_url || '',
    });
    setImgError(false);
    setShowSeo(false);
    setDialogOpen(true);
    toast.info('Duplicated — edit and save to create');
  };

  const fixImageUrl = () => {
    const next = normalizeImageUrl(form.image_url || '');
    if (next !== form.image_url) {
      setForm({ ...form, image_url: next });
      setImgError(false);
      toast.success('Drive link converted to direct image URL');
    } else {
      toast.info('URL already looks fine');
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file, {
        upsert: false, contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      setForm(f => ({ ...f, image_url: data.publicUrl }));
      setImgError(false);
      toast.success('Image uploaded');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.price && form.price !== 0) { toast.error('Price is required'); return; }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      original_price: form.original_price !== null && form.original_price !== undefined && String(form.original_price) !== ''
        ? Number(form.original_price) : null,
      category: form.category,
      description: form.description || null,
      image_url: normalizeImageUrl(form.image_url || '') || null,
      image_alt: form.image_alt || null,
      buy_link: form.buy_link || PAYMENT_URL,
      is_active: form.is_active,
      is_hot_selling: form.is_hot_selling,
      sort_order: Number(form.sort_order) || 0,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_keywords: form.seo_keywords || null,
      og_image_url: form.og_image_url || null,
    };

    let error;
    if (editProduct) {
      ({ error } = await supabase.from('products').update(payload).eq('id', editProduct.id));
      if (error) toast.error('Failed to update product');
      else toast.success('Product updated');
    } else {
      ({ error } = await supabase.from('products').insert(payload));
      if (error) toast.error('Failed to create product');
      else toast.success('Product created');
    }

    setSaving(false);
    if (!error) setDialogOpen(false);
    await loadProducts();
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else toast.success('Product deleted');
    setDeleteConfirm(null);
    await loadProducts();
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const toggleActive = async (p: Product) => {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id);
    await loadProducts();
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const toggleHot = async (p: Product) => {
    await supabase.from('products').update({ is_hot_selling: !p.is_hot_selling }).eq('id', p.id);
    await loadProducts();
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const previewUrl = normalizeImageUrl(form.image_url || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Products ({products.length})</h1>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <PaymentUrlPanel />

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Image</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Hot</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Active</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.image_alt || p.name} className="w-10 h-10 rounded-md object-cover border border-border" loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-muted/40 flex items-center justify-center text-muted-foreground"><ImageOff className="w-4 h-4" /></div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-foreground max-w-[260px] truncate">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3">
                    <span className="text-primary font-semibold">₹{p.price}</span>
                    {p.original_price && (
                      <span className="text-muted-foreground line-through text-xs ml-2">₹{p.original_price}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button onClick={() => toggleHot(p)} title="Toggle hot selling"
                      className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${p.is_hot_selling ? 'bg-primary/15 text-primary' : 'bg-muted/30 text-muted-foreground hover:text-foreground'}`}>
                      <Flame className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="p-3"><Switch checked={p.is_active} onCheckedChange={() => toggleActive(p)} /></td>
                  <td className="p-3 text-right space-x-1 whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => duplicate(p)} title="Duplicate"><Copy className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)} title="Edit"><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(p.id)} title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. ChatGPT Plus — 1 Month" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label>Price (₹) *</Label>
                <Input type="text" inputMode="decimal"
                  value={form.price === 0 && !editProduct ? '' : String(form.price ?? '')}
                  onChange={e => { const v = e.target.value.replace(/[^0-9.]/g, ''); setForm({ ...form, price: v === '' ? 0 : Number(v) }); }}
                  placeholder="999" />
              </div>
              <div>
                <Label>Original Price (₹)</Label>
                <Input type="text" inputMode="decimal"
                  value={form.original_price === null || form.original_price === undefined ? '' : String(form.original_price)}
                  onChange={e => { const v = e.target.value.replace(/[^0-9.]/g, ''); setForm({ ...form, original_price: v === '' ? null : Number(v) }); }}
                  placeholder="1999" />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order}
                  onChange={e => setForm({ ...form, sort_order: e.target.value === '' ? 0 : Number(e.target.value) })} />
              </div>
            </div>

            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={6}
                placeholder="Emoji, line breaks and bullets are all fine — this renders directly on the product page." />
              <p className="text-xs text-muted-foreground mt-1">{(form.description || '').length} characters</p>
            </div>

            {/* IMAGE */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex gap-2">
                <Input value={form.image_url || ''}
                  onChange={e => { setForm({ ...form, image_url: e.target.value }); setImgError(false); }}
                  placeholder="Paste image URL or Google Drive link" />
                <Button type="button" variant="outline" size="sm" onClick={fixImageUrl} title="Convert Google Drive link">
                  <Wand2 className="w-4 h-4" />
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <Upload className="w-4 h-4 mr-1" /> {uploading ? '...' : 'Upload'}
                </Button>
                <input ref={fileRef} type="file" accept="image/*" hidden
                  onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: Google Drive share links aren't direct images — click the <Wand2 className="inline w-3 h-3" /> button to auto-fix, or upload directly.
              </p>
              {previewUrl && (
                <div className="mt-2 w-32 h-32 rounded-lg border border-border bg-muted/20 flex items-center justify-center overflow-hidden">
                  {imgError ? (
                    <div className="text-xs text-destructive flex flex-col items-center gap-1"><ImageOff className="w-5 h-5" /> Can't load</div>
                  ) : (
                    <img src={previewUrl} alt="preview" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                  )}
                </div>
              )}
              <div className="mt-2">
                <Label className="text-xs">Image Alt Text (for SEO & accessibility)</Label>
                <Input value={form.image_alt || ''} onChange={e => setForm({ ...form, image_alt: e.target.value })}
                  placeholder="e.g. ChatGPT Plus subscription dashboard" />
              </div>
            </div>

            <div>
              <Label>Buy Link</Label>
              <Input value={form.buy_link} onChange={e => setForm({ ...form, buy_link: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                <Label className="cursor-pointer">Active (visible on store)</Label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                <Switch checked={form.is_hot_selling} onCheckedChange={v => setForm({ ...form, is_hot_selling: v })} />
                <Label className="cursor-pointer flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-primary" /> Hot Selling</Label>
              </div>
            </div>

            {/* SEO collapsible */}
            <button type="button" onClick={() => setShowSeo(s => !s)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/30 text-sm font-medium">
              <span>SEO & Social Sharing (optional)</span>
              {showSeo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showSeo && (
              <div className="space-y-3 p-3 border border-border rounded-lg">
                <div>
                  <Label>SEO Title <span className="text-xs text-muted-foreground">(&lt;60 chars)</span></Label>
                  <Input value={form.seo_title || ''} onChange={e => setForm({ ...form, seo_title: e.target.value })}
                    placeholder="Leave blank to use product name" maxLength={70} />
                </div>
                <div>
                  <Label>Meta Description <span className="text-xs text-muted-foreground">(&lt;160 chars)</span></Label>
                  <Textarea value={form.seo_description || ''} onChange={e => setForm({ ...form, seo_description: e.target.value })}
                    rows={2} maxLength={180} />
                </div>
                <div>
                  <Label>Keywords (comma-separated)</Label>
                  <Input value={form.seo_keywords || ''} onChange={e => setForm({ ...form, seo_keywords: e.target.value })}
                    placeholder="chatgpt plus, ai subscription, india" />
                </div>
                <div>
                  <Label>Social Share Image (Open Graph)</Label>
                  <Input value={form.og_image_url || ''} onChange={e => setForm({ ...form, og_image_url: e.target.value })}
                    placeholder="Leave blank to reuse product image" />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
              {saving ? 'Saving...' : editProduct ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Product?</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
