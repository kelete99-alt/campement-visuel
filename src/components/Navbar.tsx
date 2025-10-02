import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, Home, Activity, LogOut, List, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import logoDgat from "@/assets/logo-dgat.jpg";
import armoiries from "@/assets/armoiries-ci.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roleData);
    };

    checkAdminStatus();
  }, []);

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
    <nav className="sticky top-0 z-50 border-b border-border shadow-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
      <div className="container mx-auto px-4 py-3">
        {/* En-tête avec logos et titre */}
        <div className="flex items-center justify-between mb-3 lg:mb-0">
          <div className="flex items-center gap-3">
            <img src={armoiries} alt="Armoiries de Côte d'Ivoire" className="h-12 w-12 md:h-14 md:w-14 object-contain" />
            <div className="hidden md:block h-10 w-px bg-border/50" />
            <img src={logoDgat} alt="Logo DGAT" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-base lg:text-lg font-bold text-foreground leading-tight">
                Direction Générale de l'Administration du Territoire
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Érection de Campements en Villages
              </p>
            </div>
          </div>

          {/* Bouton déconnexion visible sur mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="lg:hidden flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={18} />
          </Button>
        </div>

        {/* Navigation - séparée sur une ligne en dessous sur mobile */}
        <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-end">
          <Link
            to="/"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-card/80"
            }`}
          >
            <Home size={18} />
            <span className="hidden sm:inline">Tableau de bord</span>
          </Link>
          <Link
            to="/saisie"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/saisie")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-card/80"
            }`}
          >
            <FileText size={18} />
            <span className="hidden sm:inline">Nouvelle fiche</span>
          </Link>
          <Link
            to="/campements"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/campements")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-card/80"
            }`}
          >
            <List size={18} />
            <span className="hidden sm:inline">Liste</span>
          </Link>
          <Link
            to="/activites"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/activites")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-card/80"
            }`}
          >
            <Activity size={18} />
            <span className="hidden sm:inline">Activités</span>
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/admin")
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-card/80"
              }`}
            >
              <Shield size={18} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
