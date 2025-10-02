import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Pencil, Plus, Search, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCampements } from "@/hooks/useCampements";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ListeCampements = () => {
  const navigate = useNavigate();
  const { campements, isLoading, deleteCampement } = useCampements();
  const [filteredCampements, setFilteredCampements] = useState(campements);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
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

  useEffect(() => {
    let filtered = campements;
    
    // Filtrer par région
    if (selectedRegion !== "all") {
      filtered = filtered.filter(c => c.region === selectedRegion);
    }
    
    // Filtrer par département
    if (selectedDepartement !== "all") {
      filtered = filtered.filter(c => c.departement === selectedDepartement);
    }
    
    // Filtrer par sous-préfecture
    if (selectedSousPrefecture !== "all") {
      filtered = filtered.filter(c => c.sous_prefecture === selectedSousPrefecture);
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.nom_campement.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.departement.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.sous_prefecture.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCampements(filtered);
  }, [searchTerm, campements, selectedRegion, selectedDepartement, selectedSousPrefecture]);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCampement(deleteId);
    setDeleteId(null);
  };

  const handleExportExcel = () => {
    if (filteredCampements.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const exportData = filteredCampements.map((c) => ({
      "Nom du campement": c.nom_campement,
      "Région": c.region,
      "Département": c.departement,
      "Sous-préfecture": c.sous_prefecture,
      "Village de rattachement": c.village_rattachement,
      "Population": c.population || 0,
      "Date de création": new Date(c.created_at).toLocaleDateString("fr-FR"),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Campements");

    const colWidths = [
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 12 },
      { wch: 15 },
    ];
    ws["!cols"] = colWidths;

    XLSX.writeFile(wb, `Campements_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Export Excel réussi");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl">Liste des Campements</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Gestion complète des campements enregistrés
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleExportExcel}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={filteredCampements.length === 0}
                >
                  <Download size={18} />
                  Exporter Excel
                </Button>
                <Button
                  onClick={() => navigate("/saisie")}
                  className="flex items-center gap-2"
                >
                  <Plus size={18} />
                  Nouveau
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtres */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              
              {/* Barre de recherche */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder="Rechercher par nom, région, département ou sous-préfecture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement...
              </div>
            ) : filteredCampements.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchTerm ? "Aucun résultat" : "Aucun campement enregistré"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm
                    ? "Essayez de modifier vos critères de recherche"
                    : "Commencez par ajouter votre premier campement"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => navigate("/saisie")}>
                    <Plus size={18} className="mr-2" />
                    Ajouter un campement
                  </Button>
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom du campement</TableHead>
                        <TableHead>Région</TableHead>
                        <TableHead>Département</TableHead>
                        <TableHead>Sous-préfecture</TableHead>
                        <TableHead>Village</TableHead>
                        <TableHead className="text-right">Population</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampements.map((campement) => (
                        <TableRow key={campement.id}>
                          <TableCell className="font-medium">
                            {campement.nom_campement}
                          </TableCell>
                          <TableCell>{campement.region}</TableCell>
                          <TableCell>{campement.departement}</TableCell>
                          <TableCell>{campement.sous_prefecture}</TableCell>
                          <TableCell>{campement.village_rattachement}</TableCell>
                          <TableCell className="text-right">
                            {campement.population?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/saisie/${campement.id}`)}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteId(campement.id)}
                              >
                                <Trash2 size={16} className="text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="px-4 py-3 border-t bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    Total: <span className="font-medium">{filteredCampements.length}</span>{" "}
                    campement{filteredCampements.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce campement ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListeCampements;
