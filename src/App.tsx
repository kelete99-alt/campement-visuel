import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SaisieForm from "./pages/SaisieForm";
import ActivityLog from "./pages/ActivityLog";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ListeCampements from "./pages/ListeCampements";
import Admin from "./pages/Admin";
import PendingApproval from "./pages/PendingApproval";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saisie"
          element={
            <ProtectedRoute>
              <SaisieForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saisie/:id"
          element={
            <ProtectedRoute>
              <SaisieForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campements"
          element={
            <ProtectedRoute>
              <ListeCampements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activites"
          element={
            <ProtectedRoute>
              <ActivityLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
