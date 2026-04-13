import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, FileText, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PageSection {
  id?: string;
  page_slug: string;
  section_key: string;
  content: Record<string, any>;
  sort_order: number;
}

const castSections = (data: any[]): PageSection[] =>
  data.map(d => ({
    ...d,
    content: (typeof d.content === 'object' && d.content !== null ? d.content : {}) as Record<string, any>,
  }));

const pages = [
  { slug: 'home', label: 'Home' },
  { slug: 'about', label: 'About' },
  { slug: 'faq', label: 'FAQ' },
  { slug: 'refunds', label: 'Refunds' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'terms', label: 'Terms & Conditions' },
];

const AdminPages = () => {
  const [activePage, setActivePage] = useState('home');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSectionKey, setNewSectionKey] = useState('');

  useEffect(() => { loadSections(); }, [activePage]);

  const loadSections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_slug', activePage)
      .order('sort_order', { ascending: true });
    if (error) console.error(error);
    setSections(castSections(data || []));
    setLoading(false);
  };

  const handleContentChange = (index: number, key: string, value: string) => {
    const updated = [...sections];
    updated[index] = {
      ...updated[index],
      content: { ...updated[index].content, [key]: value },
    };
    setSections(updated);
  };

  const addContentField = (index: number) => {
    const fieldName = prompt('Enter field name (e.g., title, body, subtitle):');
    if (!fieldName) return;
    handleContentChange(index, fieldName, '');
  };

  const removeContentField = (sectionIndex: number, key: string) => {
    const updated = [...sections];
    const newContent = { ...updated[sectionIndex].content };
    delete newContent[key];
    updated[sectionIndex] = { ...updated[sectionIndex], content: newContent };
    setSections(updated);
  };

  const addSection = async () => {
    if (!newSectionKey.trim()) { toast.error('Enter a section key'); return; }
    const { error } = await supabase.from('page_content').insert({
      page_slug: activePage,
      section_key: newSectionKey.trim(),
      content: { title: '', body: '' },
      sort_order: sections.length,
    });
    if (error) toast.error('Failed to add section');
    else { toast.success('Section added'); setNewSectionKey(''); loadSections(); }
  };

  const saveSection = async (section: PageSection) => {
    setSaving(true);
    if (section.id) {
      const { error } = await supabase
        .from('page_content')
        .update({ content: section.content, sort_order: section.sort_order })
        .eq('id', section.id);
      if (error) toast.error('Failed to save');
      else toast.success('Section saved');
    }
    setSaving(false);
  };

  const deleteSection = async (id: string) => {
    if (!confirm('Delete this section?')) return;
    await supabase.from('page_content').delete().eq('id', id);
    toast.success('Section deleted');
    loadSections();
  };

  const saveAll = async () => {
    setSaving(true);
    for (const section of sections) {
      if (section.id) {
        await supabase
          .from('page_content')
          .update({ content: section.content, sort_order: section.sort_order })
          .eq('id', section.id);
      }
    }
    toast.success('All sections saved');
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Page Editor</h1>
        <Button onClick={saveAll} disabled={saving} className="bg-primary text-primary-foreground">
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save All'}
        </Button>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 flex-wrap">
        {pages.map(p => (
          <Button
            key={p.slug}
            variant={activePage === p.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActivePage(p.slug)}
            className={activePage === p.slug ? 'bg-primary text-primary-foreground' : ''}
          >
            <FileText className="w-3 h-3 mr-1" /> {p.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          {/* Sections */}
          {sections.map((section, i) => (
            <div key={section.id || i} className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground text-lg">
                  Section: <span className="text-primary">{section.section_key}</span>
                </h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => saveSection(section)}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => section.id && deleteSection(section.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {Object.entries(section.content).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground capitalize">{key}</Label>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => removeContentField(i, key)}>
                      Remove
                    </Button>
                  </div>
                  {typeof value === 'string' && value.length > 100 ? (
                    <Textarea
                      value={value as string}
                      onChange={e => handleContentChange(i, key, e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <Input
                      value={typeof value === 'string' ? value : JSON.stringify(value)}
                      onChange={e => handleContentChange(i, key, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={() => addContentField(i)}>
                <Plus className="w-3 h-3 mr-1" /> Add Field
              </Button>

              <div>
                <Label className="text-muted-foreground text-xs">Sort Order</Label>
                <Input
                  type="number"
                  value={section.sort_order}
                  onChange={e => {
                    const updated = [...sections];
                    updated[i] = { ...updated[i], sort_order: parseInt(e.target.value) || 0 };
                    setSections(updated);
                  }}
                  className="w-24"
                />
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-8 text-center">
              <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No sections for this page yet. Add one below.</p>
            </div>
          )}

          {/* Add Section */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-3">Add New Section</h3>
            <div className="flex gap-3">
              <Input
                value={newSectionKey}
                onChange={e => setNewSectionKey(e.target.value)}
                placeholder="Section key (e.g., hero, features, cta)"
                className="flex-1"
              />
              <Button onClick={addSection} className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPages;
