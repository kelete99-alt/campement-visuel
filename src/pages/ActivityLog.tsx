import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MapPin, RefreshCw, CheckCircle } from "lucide-react";

const ActivityLog = () => {
  // Données d'exemple - à remplacer par des données réelles du backend
  const activities = [
    { 
      id: 1, 
      action: "Nouveau campement ajouté", 
      location: "Aboisso", 
      time: "Il y a 2 heures",
      user: "Admin DGAT",
      type: "creation"
    },
    { 
      id: 2, 
      action: "Mise à jour infrastructure", 
      location: "Bondoukou", 
      time: "Il y a 5 heures",
      user: "Saisisseur A. Koné",
      type: "modification"
    },
    { 
      id: 3, 
      action: "Validation préfectorale", 
      location: "Daloa", 
      time: "Il y a 1 jour",
      user: "Préfet Daloa",
      type: "validation"
    },
    { 
      id: 4, 
      action: "Nouveau campement ajouté", 
      location: "Korhogo", 
      time: "Il y a 2 jours",
      user: "Saisisseur B. Traoré",
      type: "creation"
    },
    { 
      id: 5, 
      action: "Modification données démographiques", 
      location: "Man", 
      time: "Il y a 3 jours",
      user: "Analyste M. Ouattara",
      type: "modification"
    },
    { 
      id: 6, 
      action: "Ajout infrastructures sanitaires", 
      location: "Bouaké", 
      time: "Il y a 4 jours",
      user: "Saisisseur C. Diabaté",
      type: "modification"
    },
    { 
      id: 7, 
      action: "Validation sous-préfectorale", 
      location: "Abengourou", 
      time: "Il y a 5 jours",
      user: "Sous-Préfet Abengourou",
      type: "validation"
    },
    { 
      id: 8, 
      action: "Nouveau campement ajouté", 
      location: "Divo", 
      time: "Il y a 6 jours",
      user: "Saisisseur D. Kouassi",
      type: "creation"
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "creation":
        return <MapPin className="text-primary" size={18} />;
      case "modification":
        return <RefreshCw className="text-secondary" size={18} />;
      case "validation":
        return <CheckCircle className="text-accent" size={18} />;
      default:
        return <Activity className="text-muted-foreground" size={18} />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "creation":
        return <Badge variant="default">Création</Badge>;
      case "modification":
        return <Badge variant="secondary">Modification</Badge>;
      case "validation":
        return <Badge variant="outline">Validation</Badge>;
      default:
        return <Badge variant="secondary">Autre</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Activity className="text-primary" />
            Journal d'activités
          </h1>
          <p className="text-muted-foreground">
            Historique des actions effectuées sur la plateforme
          </p>
        </div>

        {/* Liste des activités */}
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      {getActivityBadge(activity.type)}
                    </div>
                    <p className="text-sm text-primary font-medium mb-1">
                      {activity.location}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ActivityLog;
