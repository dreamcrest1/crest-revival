import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Calendar, ArrowRight } from 'lucide-react';
import PageBanner from '@/components/PageBanner';

interface BlogRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  tags: string[];
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, cover_image_url, published_at, tags')
        .eq('is_published', true)
        .order('published_at', { ascending: false, nullsFirst: false });
      setPosts((data as BlogRow[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen relative z-10">
      <Helmet>
        <title>Blog — Dreamcrest Solutions</title>
        <meta name="description" content="Guides, deals, and tips on the best AI, SEO, OTT and design tools — explained for Indian creators and businesses." />
        <link rel="canonical" href="https://dreamcrest.net/blog" />
        <meta property="og:title" content="Dreamcrest Blog" />
        <meta property="og:url" content="https://dreamcrest.net/blog" />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-6xl">
        <PageBanner
          eyebrow="Chronicles & Sagas"
          title="Dreamcrest"
          highlight="Chronicles"
          subtitle="Honest guides, deals and how-tos on the tools we sell — written for Indian creators, marketers and entrepreneurs."
        />


        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts yet — check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 transition-all"
              >
                {post.cover_image_url && (
                  <div className="aspect-video bg-secondary/20 overflow-hidden">
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  {post.published_at && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                  <h2 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{post.excerpt}</p>}
                  <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                    Read more <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Blog;
