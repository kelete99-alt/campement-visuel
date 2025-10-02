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
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          // Vérifier si l'utilisateur est approuvé
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("approved")
            .eq("id", session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error("Erreur lors de la vérification du profil:", error);
          }
          
          // Si pas de profil trouvé ou approved est null, considérer comme non approuvé
          setIsApproved(profile?.approved === true);
        } else {
          setIsApproved(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setIsApproved(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("approved")
            .eq("id", session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error("Erreur lors de la vérification du profil:", error);
          }
          
          setIsApproved(profile?.approved === true);
        } catch (error) {
          console.error("Erreur:", error);
          setIsApproved(false);
        }
      } else {
        setIsApproved(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    return <Navigate to="/auth" replace />;
  }

  if (!isApproved) {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;