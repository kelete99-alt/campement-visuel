import { MapPin, Users, Globe2, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  // Données d'exemple - à remplacer par des données réelles du backend
  const stats = [
    {
      title: "Campements enregistrés",
      value: 247,
      icon: MapPin,
      trend: "+12 ce mois-ci",
      iconColor: "text-primary",
    },
    {
      title: "Population totale",
      value: "52,340",
      icon: Users,
      trend: "RGPH 2014",
      iconColor: "text-secondary",
    },
    {
      title: "Nationalités",
      value: 15,
      icon: Globe2,
      trend: "Nationalités dominantes",
      iconColor: "text-accent",
    },
    {
      title: "Départements",
      value: 31,
      icon: Building2,
      trend: "Répartition nationale",
      iconColor: "text-primary",
    },
  ];

  const recentActivity = [
    { id: 1, action: "Nouveau campement ajouté", location: "Aboisso", time: "Il y a 2 heures" },
    { id: 2, action: "Mise à jour infrastructure", location: "Bondoukou", time: "Il y a 5 heures" },
    { id: 3, action: "Validation préfectorale", location: "Daloa", time: "Il y a 1 jour" },
    { id: 4, action: "Nouveau campement ajouté", location: "Korhogo", time: "Il y a 2 jours" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tableau de bord SIG
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des campements ériges en villages en Côte d'Ivoire
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Carte et activités récentes */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-primary" size={20} />
                  Cartographie des campements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full rounded-lg overflow-hidden border border-border shadow-sm bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Carte interactive Leaflet (à activer)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex flex-col gap-1 pb-4 border-b border-border last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {activity.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Répartition par département - Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par département</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <p>Graphique de répartition (à intégrer avec Chart.js)</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
