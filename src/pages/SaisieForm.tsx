import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const SaisieForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Circonscription de rattachement
    departement: "",
    sousPrefecture: "",
    village: "",
    
    // I - Identification du campement
    toponymie: "",
    populationTotale: "",
    nombreHabitantsRGPH: "",
    pourcentageEtrangers: "",
    nationalitesDominantes: "",
    nationaliteChef: "",
    identiteFondateur: "",
    anneeCreation: "",
    distanceVillage: "",
    natureVoie: "",
    etatVoie: "",
    activiteEconomique: "",
    situationGeographique: "",
    
    // II - Infrastructures
    ecoleStatut: "",
    ecoleNombreClasses: "",
    santeType: "",
    santeStatut: "",
    depotPharmacie: false,
    electricite: false,
    electriciteConnectivite: "",
    reseauTelephone: false,
    reseauType: "",
    reseauOperateur: "",
    lieuxCulte: [] as string[],
    eauPotable: false,
    nombrePompes: "",
    
    // Autres infrastructures
    equipementsSportifs: false,
    associationSportive: false,
    associationJeunes: false,
    associationFemmes: false,
    lotissement: false,
    cimetiere: false,
    siteTouristique: false,
    gareRoutiere: false,
    
    // Cultures
    culturesIndustrielles: [] as string[],
    culturesVivrieres: [] as string[],
    marcheVivres: false,
    magasinStockage: false,
    orgProducteurs: false,
    orgCommercialisation: false,
    
    // III - Avis des autorités
    avisChefCampement: "",
    avisChefVillage: "",
    avisSousPrefet: "",
    avisPrefet: "",
    
    // IV - Observations
    observations: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.toponymie || !formData.departement) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    
    // TODO: Envoyer les données au backend
    console.log("Données du formulaire:", formData);
    toast.success("Fiche enregistrée avec succès !");
    
    // Redirection vers le dashboard
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Retour au tableau de bord
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Fiche technique d'érection de campement en village
          </h1>
          <p className="text-muted-foreground">
            Saisie complète des informations conformément au formulaire DGAT
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Circonscription de rattachement */}
          <Card>
            <CardHeader>
              <CardTitle>Circonscription de rattachement du campement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="departement">Département *</Label>
                  <Input
                    id="departement"
                    value={formData.departement}
                    onChange={(e) => setFormData({ ...formData, departement: e.target.value })}
                    placeholder="Ex: Abidjan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sousPrefecture">Sous-préfecture *</Label>
                  <Input
                    id="sousPrefecture"
                    value={formData.sousPrefecture}
                    onChange={(e) => setFormData({ ...formData, sousPrefecture: e.target.value })}
                    placeholder="Ex: Cocody"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village">Village *</Label>
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="Ex: Riviera"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* I - Identification du campement */}
          <Card>
            <CardHeader>
              <CardTitle>I - Identification du campement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toponymie">1. Toponymie (Nom du campement) *</Label>
                <Input
                  id="toponymie"
                  value={formData.toponymie}
                  onChange={(e) => setFormData({ ...formData, toponymie: e.target.value })}
                  placeholder="Nom du campement"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="nombreHabitantsRGPH">2. Nombre d'habitants RGPH 2014</Label>
                  <Input
                    id="nombreHabitantsRGPH"
                    type="number"
                    value={formData.nombreHabitantsRGPH}
                    onChange={(e) => setFormData({ ...formData, nombreHabitantsRGPH: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pourcentageEtrangers">Pourcentage d'étrangers</Label>
                  <Input
                    id="pourcentageEtrangers"
                    type="number"
                    value={formData.pourcentageEtrangers}
                    onChange={(e) => setFormData({ ...formData, pourcentageEtrangers: e.target.value })}
                    placeholder="0%"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalitesDominantes">Nationalités dominantes</Label>
                  <Input
                    id="nationalitesDominantes"
                    value={formData.nationalitesDominantes}
                    onChange={(e) => setFormData({ ...formData, nationalitesDominantes: e.target.value })}
                    placeholder="Ex: Burkinabè, Malien"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nationaliteChef">3. Nationalité du Chef de campement</Label>
                  <Input
                    id="nationaliteChef"
                    value={formData.nationaliteChef}
                    onChange={(e) => setFormData({ ...formData, nationaliteChef: e.target.value })}
                    placeholder="Nationalité"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identiteFondateur">4. Identité du fondateur du campement</Label>
                  <Input
                    id="identiteFondateur"
                    value={formData.identiteFondateur}
                    onChange={(e) => setFormData({ ...formData, identiteFondateur: e.target.value })}
                    placeholder="Nom complet"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="anneeCreation">5. Année de création</Label>
                  <Input
                    id="anneeCreation"
                    type="number"
                    value={formData.anneeCreation}
                    onChange={(e) => setFormData({ ...formData, anneeCreation: e.target.value })}
                    placeholder="Ex: 2010"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distanceVillage">6. Distance au village de rattachement (km)</Label>
                  <Input
                    id="distanceVillage"
                    type="number"
                    value={formData.distanceVillage}
                    onChange={(e) => setFormData({ ...formData, distanceVillage: e.target.value })}
                    placeholder="Distance en km"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>7. Accessibilité</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="natureVoie">Nature de la voie</Label>
                    <Select value={formData.natureVoie} onValueChange={(value) => setFormData({ ...formData, natureVoie: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bitume">Bitume</SelectItem>
                        <SelectItem value="piste">Piste rurale</SelectItem>
                        <SelectItem value="fluviale">Voie fluviale</SelectItem>
                        <SelectItem value="lagunaire">Voie lagunaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="etatVoie">État de la voie</Label>
                    <Select value={formData.etatVoie} onValueChange={(value) => setFormData({ ...formData, etatVoie: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bon">Bon</SelectItem>
                        <SelectItem value="mauvais">Mauvais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activiteEconomique">8. Activité économique principale</Label>
                <Input
                  id="activiteEconomique"
                  value={formData.activiteEconomique}
                  onChange={(e) => setFormData({ ...formData, activiteEconomique: e.target.value })}
                  placeholder="Ex: Agriculture, Commerce"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="situationGeographique">9. Situation géographique</Label>
                <Select value={formData.situationGeographique} onValueChange={(value) => setFormData({ ...formData, situationGeographique: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="habitable">Zone habitable</SelectItem>
                    <SelectItem value="foret">Forêt classée</SelectItem>
                    <SelectItem value="parc">Parc et réserve</SelectItem>
                    <SelectItem value="risque">Zone à risque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* II - Infrastructures */}
          <Card>
            <CardHeader>
              <CardTitle>II - Infrastructures disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* École */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">1. École Primaire</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Statut de l'école</Label>
                    <Select value={formData.ecoleStatut} onValueChange={(value) => setFormData({ ...formData, ecoleStatut: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="publique">Publique</SelectItem>
                        <SelectItem value="privee">Privée</SelectItem>
                        <SelectItem value="confessionnelle">Confessionnelle</SelectItem>
                        <SelectItem value="communautaire">Communautaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ecoleNombreClasses">Nombre de classes</Label>
                    <Input
                      id="ecoleNombreClasses"
                      type="number"
                      value={formData.ecoleNombreClasses}
                      onChange={(e) => setFormData({ ...formData, ecoleNombreClasses: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Santé */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">2. Santé</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Type d'infrastructure</Label>
                    <Select value={formData.santeType} onValueChange={(value) => setFormData({ ...formData, santeType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dispensaire">Dispensaire</SelectItem>
                        <SelectItem value="case">Case de santé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select value={formData.santeStatut} onValueChange={(value) => setFormData({ ...formData, santeStatut: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="prive">Privé</SelectItem>
                        <SelectItem value="confessionnel">Confessionnel</SelectItem>
                        <SelectItem value="communautaire">Communautaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="depotPharmacie"
                      checked={formData.depotPharmacie}
                      onCheckedChange={(checked) => setFormData({ ...formData, depotPharmacie: checked as boolean })}
                    />
                    <Label htmlFor="depotPharmacie" className="cursor-pointer">
                      Dépôt de pharmacie
                    </Label>
                  </div>
                </div>
              </div>

              {/* Autres infrastructures de base */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">3-6. Autres infrastructures</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="electricite"
                      checked={formData.electricite}
                      onCheckedChange={(checked) => setFormData({ ...formData, electricite: checked as boolean })}
                    />
                    <Label htmlFor="electricite" className="cursor-pointer">
                      Électricité disponible
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reseauTelephone"
                      checked={formData.reseauTelephone}
                      onCheckedChange={(checked) => setFormData({ ...formData, reseauTelephone: checked as boolean })}
                    />
                    <Label htmlFor="reseauTelephone" className="cursor-pointer">
                      Accès réseau téléphonique
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="eauPotable"
                      checked={formData.eauPotable}
                      onCheckedChange={(checked) => setFormData({ ...formData, eauPotable: checked as boolean })}
                    />
                    <Label htmlFor="eauPotable" className="cursor-pointer">
                      Eau potable disponible
                    </Label>
                  </div>
                  {formData.eauPotable && (
                    <div className="space-y-2">
                      <Label htmlFor="nombrePompes">Nombre de pompes</Label>
                      <Input
                        id="nombrePompes"
                        type="number"
                        value={formData.nombrePompes}
                        onChange={(e) => setFormData({ ...formData, nombrePompes: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* III - Avis des autorités */}
          <Card>
            <CardHeader>
              <CardTitle>III - Avis des autorités administratives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avisChefCampement">1. Chef de campement</Label>
                <Textarea
                  id="avisChefCampement"
                  value={formData.avisChefCampement}
                  onChange={(e) => setFormData({ ...formData, avisChefCampement: e.target.value })}
                  placeholder="Avis du chef de campement"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avisChefVillage">2. Chef du village de rattachement</Label>
                <Textarea
                  id="avisChefVillage"
                  value={formData.avisChefVillage}
                  onChange={(e) => setFormData({ ...formData, avisChefVillage: e.target.value })}
                  placeholder="Avis du chef du village"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avisSousPrefet">3. Sous-Préfet</Label>
                <Textarea
                  id="avisSousPrefet"
                  value={formData.avisSousPrefet}
                  onChange={(e) => setFormData({ ...formData, avisSousPrefet: e.target.value })}
                  placeholder="Avis du sous-préfet"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avisPrefet">4. Préfet</Label>
                <Textarea
                  id="avisPrefet"
                  value={formData.avisPrefet}
                  onChange={(e) => setFormData({ ...formData, avisPrefet: e.target.value })}
                  placeholder="Avis du préfet"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* IV - Observations */}
          <Card>
            <CardHeader>
              <CardTitle>IV - Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="observations">Observations libres</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Observations complémentaires..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Annuler
            </Button>
            <Button type="submit" className="gap-2">
              <Save size={18} />
              Enregistrer la fiche
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SaisieForm;
