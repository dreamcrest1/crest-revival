import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HyperspaceBackground from "./components/HyperspaceBackground";
import CursorTrail from "./components/CursorTrail";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Refunds from "./pages/Refunds";
import About from "./pages/About";
import AllTools from "./pages/AllTools";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HyperspaceBackground />
      <CursorTrail />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/about" element={<About />} />
          <Route path="/alltools" element={<AllTools />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
