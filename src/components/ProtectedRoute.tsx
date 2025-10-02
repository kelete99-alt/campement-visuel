import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkUserStatus = async () => {
      // Vérifier la session
      const { data: { session } } = await supabase.auth.getSession();
      console.log("✅ Session récupérée:", !!session);
      setSession(session);

      // Si l'utilisateur est connecté, vérifier son statut d'approbation
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("approved")
          .eq("id", session.user.id)
          .single();

        console.log("👤 Profil approuvé:", profile?.approved);
        setIsApproved(profile?.approved ?? false);
      }

      setIsLoading(false);
    };

    checkUserStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth changed:", event);
      setSession(session);

      // Vérifier le statut d'approbation à chaque changement de session
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("approved")
          .eq("id", session.user.id)
          .single();

        setIsApproved(profile?.approved ?? false);
      } else {
        setIsApproved(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log("🎨 Render - isLoading:", isLoading, "session:", !!session, "approved:", isApproved);

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

  // Si l'utilisateur n'est pas approuvé, rediriger vers la page d'attente
  if (isApproved === false && location.pathname !== "/pending-approval") {
    console.log("⏳ Redirection vers /pending-approval");
    return <Navigate to="/pending-approval" replace />;
  }

  console.log("✅ Affichage du contenu");
  return <>{children}</>;
};

export default ProtectedRoute;