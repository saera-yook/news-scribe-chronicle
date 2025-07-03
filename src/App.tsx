import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index.tsx";
import MyArticles from "./pages/MyArticles.tsx";
import Likes from "./pages/Likes.tsx";
import NotFound from "./pages/NotFound.tsx";
import { NewsVersion } from "./types/news.ts";

const queryClient = new QueryClient();

const App = () => {
  const [sharedHistory, setSharedHistory] = useState<NewsVersion[]>([]);
  const [currentView, setCurrentView] = useState('home');

  const handleShowHistory = (history: NewsVersion[]) => {
    setSharedHistory(history);
    setCurrentView('history');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/likes" element={<Likes onShowHistory={handleShowHistory} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;