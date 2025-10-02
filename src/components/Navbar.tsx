import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, Home, Activity, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoDgat from "@/assets/logo-dgat.jpg";
import armoiries from "@/assets/armoiries-ci.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      toast.success("Déconnexion réussie");
      navigate("/auth");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center gap-4">
            <img src={armoiries} alt="Armoiries de Côte d'Ivoire" className="h-14 w-14 object-contain" />
            <div className="hidden md:block h-12 w-px bg-border" />
            <img src={logoDgat} alt="Logo DGAT" className="h-12 w-12 object-contain" />
            <div className="hidden lg:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">
                Direction Générale de l'Administration du Territoire
              </h1>
              <p className="text-sm text-muted-foreground">
                Érection de Campements en Villages
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Tableau de bord</span>
            </Link>
            <Link
              to="/saisie"
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive("/saisie")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <FileText size={18} />
              <span className="hidden sm:inline">Nouvelle fiche</span>
            </Link>
            <Link
              to="/activites"
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive("/activites")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Activity size={18} />
              <span className="hidden sm:inline">Activités</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
