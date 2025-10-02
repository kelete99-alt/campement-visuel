import { MapPin, Users, Globe2, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useCampements } from "@/hooks/useCampements";

const Dashboard = () => {
  const { campements, stats: campmentsStats, isLoading } = useCampements();

  const statsCards = [
    {
      title: "Campements enregistrés",
      value: campmentsStats.totalCampements,
      icon: MapPin,
      trend: `${campmentsStats.totalCampements} au total`,
      iconColor: "text-primary",
    },
    {
      title: "Population totale",
      value: campmentsStats.totalPopulation.toLocaleString(),
      icon: Users,
      trend: "Recensés",
      iconColor: "text-secondary",
    },
    {
      title: "Régions",
      value: Object.keys(campmentsStats.campmentsParRegion).length,
      icon: Globe2,
      trend: "Couvertes",
      iconColor: "text-accent",
    },
    {
      title: "Départements",
      value: Object.keys(campmentsStats.campmentsParDepartement).length,
      icon: Building2,
      trend: "Couverts",
      iconColor: "text-primary",
    },
  ];

  // Activités récentes basées sur les derniers campements
  const recentActivity = campements.slice(0, 3).map((c) => ({
    id: c.id,
    action: "Campement enregistré",
    location: `${c.nom_campement} - ${c.departement}`,
    time: new Date(c.created_at).toLocaleDateString("fr-FR"),
  }));

  // Données pour le graphique - top 10 départements
  const departementData = Object.entries(campmentsStats.campmentsParDepartement)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([departement, count]) => ({
      departement,
      campements: count,
    }));

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
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement des statistiques...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {statsCards.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        )}

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

        {/* Répartition par département */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par département</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="departement" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="campements" fill="hsl(var(--primary))" name="Nombre de campements" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
