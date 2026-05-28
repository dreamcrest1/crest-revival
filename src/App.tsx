
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import HyperspaceBackground from "./components/HyperspaceBackground";
import IndiaMapBackground from "./components/IndiaMapBackground";
import CursorTrail from "./components/CursorTrail";
import AnalyticsTracker from "./components/AnalyticsTracker";

import ScrollToTop from "./components/ScrollToTop";

import StorefrontChatbot from "./components/chatbot/StorefrontChatbot";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Refunds from "./pages/Refunds";
import About from "./pages/About";
import AllTools from "./pages/AllTools";
import AiTools from "./pages/AiTools";
import AiToolDetail from "./pages/AiToolDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPages from "./pages/admin/AdminPages";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSeoAudit from "./pages/admin/AdminSeoAudit";
import AdminErrorLogs from "./pages/admin/AdminErrorLogs";

import AdminBlog from "./pages/admin/AdminBlog";
import AdminFunnel from "./pages/admin/AdminFunnel";
import AdminSearchQueries from "./pages/admin/AdminSearchQueries";
import AdminGeo from "./pages/admin/AdminGeo";
import AdminHeatmap from "./pages/admin/AdminHeatmap";
import AdminUtm from "./pages/admin/AdminUtm";
import AdminInsights from "./pages/admin/AdminInsights";

import ExitIntentSurvey from "./components/ExitIntentSurvey";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import Auth from "./pages/Auth";
import MyOrders from "./pages/MyOrders";
import ResetPassword from "./pages/ResetPassword";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HyperspaceBackground />
          <IndiaMapBackground />
          <CursorTrail />
          <CartProvider>
            <AuthProvider>
              <BrowserRouter>
                <ScrollToTop />
                <CartDrawer />
                <AnalyticsTracker />
                
                <StorefrontChatbot />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/refunds" element={<Refunds />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/alltools" element={<AllTools />} />
                  <Route path="/ai-tools" element={<AiTools />} />
                  <Route path="/ai-tool/:slug" element={<AiToolDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />

                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/failure" element={<PaymentFailure />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/my-orders" element={<MyOrders />} />


                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="pages" element={<AdminPages />} />
                    
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="funnel" element={<AdminFunnel />} />
                    <Route path="utm" element={<AdminUtm />} />
                    <Route path="heatmap" element={<AdminHeatmap />} />
                    <Route path="geo" element={<AdminGeo />} />
                    <Route path="search-queries" element={<AdminSearchQueries />} />
                    <Route path="insights" element={<AdminInsights />} />
                    <Route path="seo-audit" element={<AdminSeoAudit />} />
                    <Route path="errors" element={<AdminErrorLogs />} />
                    <Route path="deploy" element={<AdminDeploy />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ExitIntentSurvey />
              </BrowserRouter>
            </AuthProvider>
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
