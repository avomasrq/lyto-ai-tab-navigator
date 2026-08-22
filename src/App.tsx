import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToHash from "@/components/ScrollToHash";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardDemo from "./pages/DashboardDemo";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import Settings from "./pages/Settings";
import Cli from "./pages/Cli";
import CliDocs from "./pages/CliDocs";
import Waitlist from "./pages/Waitlist";
import Company from "./pages/Company";
import Onboarding from "./pages/Onboarding";
import Admin from "./pages/Admin";
import Beta from "./pages/Beta";
import Scan from "./pages/Scan";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Analytics />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-demo" element={<DashboardDemo />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="/cli" element={<Cli />} />
            {/* The reference, split out of /cli so the sales page stops reading as a manual. */}
            <Route path="/cli/docs" element={<CliDocs />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/company" element={<Company />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/beta" element={<Beta />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/cookies" element={<Cookies />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
