import { MapPin, Users, Globe2, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useCampements } from "@/hooks/useCampements";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
// import DynamicCampementMap from "@/components/DynamicCampementMap";

const Dashboard = () => {
  const { campements, stats: campmentsStats, isLoading } = useCampements();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDepartement, setSelectedDepartement] = useState<string>("all");
  const [selectedSousPrefecture, setSelectedSousPrefecture] = useState<string>("all");

  // Obtenir les valeurs uniques pour les filtres
  const regions = useMemo(() => {
    return Array.from(new Set(campements.map(c => c.region))).sort();
  }, [campements]);

  const departements = useMemo(() => {
    const filtered = selectedRegion === "all" 
      ? campements 
      : campements.filter(c => c.region === selectedRegion);
    return Array.from(new Set(filtered.map(c => c.departement))).sort();
  }, [campements, selectedRegion]);

  const sousPrefectures = useMemo(() => {
    let filtered = campements;
    if (selectedRegion !== "all") {
      filtered = filtered.filter(c => c.region === selectedRegion);
    }
    if (selectedDepartement !== "all") {
      filtered = filtered.filter(c => c.departement === selectedDepartement);
    }
    return Array.from(new Set(filtered.map(c => c.sous_prefecture))).sort();
  }, [campements, selectedRegion, selectedDepartement]);

  // Filtrer les campements selon les critères
  const filteredCampements = useMemo(() => {
    let filtered = campements;
    if (selectedRegion !== "all") {
      filtered = filtered.filter(c => c.region === selectedRegion);
    }
    if (selectedDepartement !== "all") {
      filtered = filtered.filter(c => c.departement === selectedDepartement);
    }
    if (selectedSousPrefecture !== "all") {
      filtered = filtered.filter(c => c.sous_prefecture === selectedSousPrefecture);
    }
    return filtered;
  }, [campements, selectedRegion, selectedDepartement, selectedSousPrefecture]);

  // Recalculer les stats avec les campements filtrés
  const filteredStats = useMemo(() => {
    const totalPopulation = filteredCampements.reduce((sum, c) => sum + (c.population || 0), 0);
    const regionsUniques = new Set(filteredCampements.map(c => c.region));
    const departementsUniques = new Set(filteredCampements.map(c => c.departement));
    
    return {
      totalCampements: filteredCampements.length,
      totalPopulation,
      nombreRegions: regionsUniques.size,
      nombreDepartements: departementsUniques.size,
    };
  }, [filteredCampements]);

  const statsCards = [
    {
      title: "Campements enregistrés",
      value: filteredStats.totalCampements,
      icon: MapPin,
      trend: `${filteredStats.totalCampements} au total`,
      iconColor: "text-primary",
    },
    {
      title: "Population totale",
      value: filteredStats.totalPopulation.toLocaleString(),
      icon: Users,
      trend: "Recensés",
      iconColor: "text-secondary",
    },
    {
      title: "Régions",
      value: filteredStats.nombreRegions,
      icon: Globe2,
      trend: "Couvertes",
      iconColor: "text-accent",
    },
    {
      title: "Départements",
      value: filteredStats.nombreDepartements,
      icon: Building2,
      trend: "Couverts",
      iconColor: "text-primary",
    },
  ];

  // Activités récentes basées sur les derniers campements filtrés
  const recentActivity = filteredCampements.slice(0, 3).map((c) => ({
    id: c.id,
    action: "Campement enregistré",
    location: `${c.nom_campement} - ${c.departement}`,
    time: new Date(c.created_at).toLocaleDateString("fr-FR"),
  }));

  // Données pour le graphique - adapté selon les filtres
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Si un département est sélectionné, afficher les sous-préfectures
    if (selectedDepartement !== "all") {
      filteredCampements.forEach(c => {
        counts[c.sous_prefecture] = (counts[c.sous_prefecture] || 0) + 1;
      });
      return {
        data: Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([name, count]) => ({
            name,
            campements: count,
          })),
        label: "Sous-préfecture"
      };
    }
    
    // Sinon, afficher les départements
    filteredCampements.forEach(c => {
      counts[c.departement] = (counts[c.departement] || 0) + 1;
    });
    return {
      data: Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({
          name,
          campements: count,
        })),
      label: "Département"
    };
  }, [filteredCampements, selectedDepartement]);

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

        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Région</label>
                <Select value={selectedRegion} onValueChange={(value) => {
                  setSelectedRegion(value);
                  setSelectedDepartement("all");
                  setSelectedSousPrefecture("all");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les régions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Département</label>
                <Select 
                  value={selectedDepartement} 
                  onValueChange={(value) => {
                    setSelectedDepartement(value);
                    setSelectedSousPrefecture("all");
                  }}
                  disabled={selectedRegion === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les départements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    {departements.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sous-préfecture</label>
                <Select 
                  value={selectedSousPrefecture} 
                  onValueChange={setSelectedSousPrefecture}
                  disabled={selectedDepartement === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les sous-préfectures" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les sous-préfectures</SelectItem>
                    {sousPrefectures.map(sp => (
                      <SelectItem key={sp} value={sp}>{sp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <div className="h-[500px] w-full rounded-lg overflow-hidden border border-border shadow-sm flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Carte temporairement désactivée</p>
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

        {/* Répartition dynamique */}
        <Card>
          <CardHeader>
            <CardTitle>
              Répartition par {selectedDepartement !== "all" ? "sous-préfecture" : "département"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
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
