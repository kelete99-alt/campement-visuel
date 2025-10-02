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
  const [isApproved, setIsApproved] = useState(true); // Par défaut true pour ne pas bloquer

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🔍 Vérification de l'authentification...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("❌ Erreur session:", sessionError);
        }
        
        console.log("📝 Session:", session ? "Connecté" : "Non connecté");
        setSession(session);
        
        if (session?.user) {
          console.log("👤 Utilisateur ID:", session.user.id);
          
          // Vérifier si l'utilisateur est approuvé
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("approved")
            .eq("id", session.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error("❌ Erreur profil:", profileError);
            // En cas d'erreur, on approuve par défaut pour ne pas bloquer
            setIsApproved(true);
          } else {
            console.log("✅ Profil:", profile);
            // Si approved est explicitement false, on bloque
            setIsApproved(profile?.approved !== false);
          }
        } else {
          setIsApproved(false);
        }
      } catch (error) {
        console.error("❌ Erreur générale:", error);
        // En cas d'erreur, on ne bloque pas
        setIsApproved(true);
      } finally {
        console.log("✅ Fin de la vérification, isLoading = false");
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state changed:", event);
      setSession(session);
      
      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("approved")
            .eq("id", session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error("❌ Erreur profil (auth change):", error);
            setIsApproved(true);
          } else {
            setIsApproved(profile?.approved !== false);
          }
        } catch (error) {
          console.error("❌ Erreur (auth change):", error);
          setIsApproved(true);
        }
      } else {
        setIsApproved(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log("🎨 Render - isLoading:", isLoading, "session:", !!session, "isApproved:", isApproved);

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

  if (!isApproved) {
    console.log("➡️ Redirection vers /pending-approval");
    return <Navigate to="/pending-approval" replace />;
  }

  console.log("✅ Affichage du contenu protégé");
  return <>{children}</>;
};

export default ProtectedRoute;