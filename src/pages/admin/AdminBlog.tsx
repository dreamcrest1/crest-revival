import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_markdown: string;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
}

const blank: Omit<Post, 'id'> = {
  slug: '', title: '', excerpt: '', body_markdown: '',
  cover_image_url: '', seo_title: '', seo_description: '',
  og_image_url: '', tags: [], is_published: false, published_at: null,
};

const AdminBlog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [preview, setPreview] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    else setPosts((data as Post[]) || []);
  };

  useEffect(() => { void load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.title) {
      toast.error('Slug and title are required');
      return;
    }
    const payload = {
      slug: editing.slug,
      title: editing.title,
      excerpt: editing.excerpt || null,
      body_markdown: editing.body_markdown || '',
      cover_image_url: editing.cover_image_url || null,
      seo_title: editing.seo_title || null,
      seo_description: editing.seo_description || null,
      og_image_url: editing.og_image_url || null,
      tags: editing.tags || [],
      is_published: editing.is_published || false,
      published_at: editing.is_published && !editing.published_at ? new Date().toISOString() : editing.published_at,
    };

    const { error } = editing.id
      ? await supabase.from('blog_posts').update(payload).eq('id', editing.id)
      : await supabase.from('blog_posts').insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Saved');
    setEditing(null);
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Deleted'); void load(); }
  };

  if (editing) {
    return (
      <div className="space-y-4 max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">{editing.id ? 'Edit post' : 'New post'}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreview(!preview)}><Eye className="w-4 h-4 mr-2" />{preview ? 'Edit' : 'Preview'}</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}><Save className="w-4 h-4 mr-2" /> Save</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Input placeholder="Title" value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <Input placeholder="slug-like-this" value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          <Input placeholder="Cover image URL" value={editing.cover_image_url || ''} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} />
          <Input placeholder="OG image URL" value={editing.og_image_url || ''} onChange={(e) => setEditing({ ...editing, og_image_url: e.target.value })} />
          <Input placeholder="SEO title (optional)" value={editing.seo_title || ''} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} />
          <Input placeholder="Tags (comma separated)" value={(editing.tags || []).join(', ')} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
        </div>
        <Textarea placeholder="Excerpt (1-2 lines)" rows={2} value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
        <Textarea placeholder="SEO description (optional)" rows={2} value={editing.seo_description || ''} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} />

        {preview ? (
          <Card><CardContent className="p-6 prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{editing.body_markdown || '*Nothing to preview*'}</ReactMarkdown>
          </CardContent></Card>
        ) : (
          <Textarea placeholder="Body (markdown supported)" rows={20} className="font-mono text-sm" value={editing.body_markdown || ''} onChange={(e) => setEditing({ ...editing, body_markdown: e.target.value })} />
        )}

        <div className="flex items-center gap-3 pt-2">
          <Switch checked={!!editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
          <span className="text-sm">Published</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Blog posts</h1>
        <Button onClick={() => setEditing({ ...blank })}><Plus className="w-4 h-4 mr-2" /> New post</Button>
      </div>

      <div className="grid gap-2">
        {posts.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold truncate">{p.title}</div>
                <div className="text-xs text-muted-foreground">/blog/{p.slug} · {p.is_published ? '✅ Published' : '⏸ Draft'}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => setEditing(p)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && <p className="text-muted-foreground text-sm">No posts yet.</p>}
      </div>
    </div>
  );
};

export default AdminBlog;
