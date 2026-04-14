import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import HyperspaceBackground from "./components/HyperspaceBackground";
import IndiaMapBackground from "./components/IndiaMapBackground";
import CursorTrail from "./components/CursorTrail";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Refunds from "./pages/Refunds";
import About from "./pages/About";
import AllTools from "./pages/AllTools";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminPages from "./pages/admin/AdminPages";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HyperspaceBackground />
      <IndiaMapBackground />
      <CursorTrail />
      <AuthProvider>
        <BrowserRouter>
          <AnalyticsTracker />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/about" element={<About />} />
            <Route path="/alltools" element={<AllTools />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
