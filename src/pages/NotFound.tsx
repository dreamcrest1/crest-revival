import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Package, MessageCircle, Search, ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const popularLinks = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/products", label: "All Products", Icon: Package },
  { to: "/alltools", label: "All Tools Catalog", Icon: Search },
  { to: "/contact", label: "Contact Us", Icon: MessageCircle },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
      <SEOHead
        title="404 – Page Not Found | Dreamcrest Solutions"
        description="The page you're looking for doesn't exist. Browse our premium digital products, AI tools and OTT subscriptions instead."
        noindex
      />

      <div className="container mx-auto max-w-2xl text-center">
        {/* Glass card */}
        <div className="relative bg-card/60 backdrop-blur-xl border border-border/60 rounded-3xl p-10 md:p-14 shadow-2xl">
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/[0.06] to-transparent pointer-events-none" />

          <div className="relative z-10">
            <p className="font-display text-7xl md:text-8xl font-bold text-gradient mb-3">404</p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Page Not Found
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
              Try one of the popular destinations below.
            </p>

            {/* Popular links grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {popularLinks.map(({ to, label, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex flex-col items-center gap-2 bg-secondary/40 hover:bg-primary/10 border border-border/60 hover:border-primary/30 rounded-xl p-4 transition-all"
                >
                  <Icon className="w-6 h-6 text-primary" />
                  <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {label}
                  </span>
                </Link>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl shadow-[0_0_30px_hsl(24_95%_53%/0.25)]"
            >
              <Link to="/">
                Back to Home <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground mt-6">
              Need help? <a href="https://wa.me/916357998730" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Chat with us on WhatsApp</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
