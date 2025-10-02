import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérification simple et rapide
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("✅ Session récupérée:", !!session);
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 Auth changed:", event);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log("🎨 Render - isLoading:", isLoading, "session:", !!session);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    console.log("➡️ Redirection vers /auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("✅ Affichage du contenu");
  return <>{children}</>;
};

export default ProtectedRoute;