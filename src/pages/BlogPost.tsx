import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Calendar, ArrowLeft } from 'lucide-react';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_markdown: string;
  cover_image_url: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  tags: string[];
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      setPost((data as Post) || null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-primary hover:underline">← Back to blog</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const title = post.seo_title || `${post.title} — Dreamcrest Blog`;
  const desc = post.seo_description || post.excerpt || post.title;
  const url = `https://dreamcrest.net/blog/${post.slug}`;
  const ogImg = post.og_image_url || post.cover_image_url || undefined;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: desc,
    image: ogImg ? [ogImg] : undefined,
    datePublished: post.published_at,
    author: { '@type': 'Organization', name: 'Dreamcrest Solutions' },
    publisher: { '@type': 'Organization', name: 'Dreamcrest Solutions' },
    mainEntityOfPage: url,
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dreamcrest.net/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://dreamcrest.net/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <div className="min-h-screen relative z-10">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        {ogImg && <meta property="og:image" content={ogImg} />}
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>

        {post.cover_image_url && (
          <img src={post.cover_image_url} alt={post.title} className="w-full aspect-video object-cover rounded-2xl mb-6" />
        )}

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{post.title}</h1>

        {post.published_at && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
            <Calendar className="w-4 h-4" />
            {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        )}

        <article className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body_markdown}</ReactMarkdown>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogPost;
