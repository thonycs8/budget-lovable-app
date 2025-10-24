import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { queryClient } from "@/lib/queryClient";
import { useOfflineSync } from "@/lib/offlineSync";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Categories from "./pages/Categories";
import Calendar from "./pages/Calendar";
import Payables from "./pages/Payables";
import Debts from "./pages/Debts";
import Investments from "./pages/Investments";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import GDPR from "./pages/GDPR";
import About from "./pages/About";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Hook de sincronização offline
  useOfflineSync();

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/*" element={
                <div className="min-h-screen flex flex-col w-full">
                  <Header />
                  <div className="flex flex-1 w-full relative pb-14">
                    <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
                    <main className={cn(
                      "flex-1 animate-fade-in p-4 md:p-6 transition-all duration-300",
                      sidebarCollapsed ? "md:ml-16" : "md:ml-64"
                    )}>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/income" element={<Income />} />
                        <Route path="/expenses" element={<Expenses />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/payables" element={<Payables />} />
                        <Route path="/debts" element={<Debts />} />
                        <Route path="/investments" element={<Investments />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/gdpr" element={<GDPR />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                  <Footer />
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
