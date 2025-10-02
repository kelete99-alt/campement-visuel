import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import logoDgat from "@/assets/logo-dgat.jpg";
import armoiries from "@/assets/armoiries-ci.png";

const PendingApproval = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier périodiquement si l'utilisateur a été approuvé
    const checkApproval = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("approved")
        .eq("id", user.id)
        .single();

      if (profile?.approved) {
        clearInterval(checkApproval);
        toast.success("Votre compte a été approuvé ! Redirection...");
        setTimeout(() => navigate("/"), 1000);
      }
    }, 5000); // Vérifier toutes les 5 secondes

    return () => clearInterval(checkApproval);
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <img src={armoiries} alt="Armoiries de Côte d'Ivoire" className="h-16 w-16 object-contain" />
            <img src={logoDgat} alt="Logo DGAT" className="h-14 w-14 object-contain" />
          </div>
          <CardTitle className="text-2xl">Compte en attente d'approbation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-6">
                <Clock className="text-primary" size={48} />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-foreground font-medium">
                Votre inscription a bien été enregistrée !
              </p>
              <p className="text-sm text-muted-foreground">
                Un administrateur doit valider votre compte avant que vous puissiez accéder à l'application.
              </p>
              <p className="text-sm text-muted-foreground">
                Vous recevrez une notification dès que votre compte sera approuvé.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Actualiser le statut
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Se déconnecter
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              En cas de problème, contactez un administrateur de la DGAT
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
