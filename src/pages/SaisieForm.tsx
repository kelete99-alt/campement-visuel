import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";

const SaisieForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // Structure: Region -> Département -> [Sous-préfectures]
  const adminData: Record<string, Record<string, string[]>> = {
    "ABIDJAN": {
      "Abidjan": ["ABIDJAN", "ANYAMA", "BINGERVILLE", "BROFODOUME", "SONGON"]
    },
    "AGNEBY-TIASSA": {
      "Agboville": ["ABOUDE", "AGBOVILLE", "ANANGUIE", "ATTOBROU", "AZAGUIE", "CECHI", "GRAND-MORIE", "GUESSIGUIE", "LOVIGUIE", "ORESS-KROBOU", "RUBINO"],
      "Sikensi": ["GOMON", "SIKENSI"],
      "Taabo": ["PACOBO", "TAABO"],
      "Tiassalé": ["GBOLOUVILLE(ex BINA-BOUS)", "MOROKRO", "N'DOUCI", "TIASSALE"]
    },
    "BAFING": {
      "Koro": ["BOOKO", "BOROTOU", "KORO", "MAHANDOUGOU", "NIOKOSSO"],
      "Ouaninou": ["GBELO", "GOUEKAN", "KOONAN", "OUANINOU", "SABOUDOUGOU", "SANTA"],
      "Touba": ["DIOMAN", "FOUNGBESSO", "GUINTEGUELA", "TOUBA"]
    },
    "BAGOUE": {
      "Boundiali": ["BAYA", "BOUNDIALI", "GANAONI", "KASSERE", "SIEMPURGO"],
      "Kouto": ["BLESSEGUE", "GBON", "KOLIA", "KOUTO", "SIANHALA"],
      "Tengréla": ["DEBETE", "KANAKONO", "PAPARA", "TENGRELA"]
    },
    "BELIER": {
      "Didievi": ["BOLI", "DIDIEVI", "MOLONOU-BLE", "RAVIART", "TIE-N'DIEKRO"],
      "Djekanou": ["BONIKRO", "DJEKANOU"],
      "Tiebissou": ["LOMOKANKRO", "MOLONOU", "TIEBISSOU", "YAKPABO-SAKASSOU"],
      "Toumodi": ["ANGODA", "KOKUMBO", "KPOUEBO", "TOUMODI"]
    },
    "BERE": {
      "Dianra": ["DIANRA", "DIANRA-VILLAGE"],
      "Kounahiri": ["KONGASSO", "KOUNAHIRI"],
      "Mankono": ["BOUANDOUGOU", "MANKONO", "MARANDALLAH", "SARHALA", "TIENINGBOUE"]
    },
    "BOUNKANI": {
      "Bouna": ["BOUKO", "BOUNA", "ONDEFIDOUO", "YOUNDOUO"],
      "Doropo": ["DANOA", "DOROPO", "KALAMON", "NIAMOUE"],
      "Nassian": ["BOGOFA", "KAKPIN", "KOTOUBA", "NASSIAN", "SOMINASSE"],
      "Tehini": ["GOGO", "TEHINI", "TOUGBO"]
    },
    "CAVALLY": {
      "Blolequin": ["BLOLEQUIN", "DIBOKE", "DOKE", "TINHOU", "ZEAGLO"],
      "Guiglo": ["BEDY-GOAZON", "GUIGLO", "KAADE", "NIZAHON"],
      "Taï": ["TAI", "ZAGNE"],
      "Toulepleu": ["BAKOUBLY", "MEO", "NEZOBLY", "PEHE", "TIOBLY", "TOULEPLEU"]
    },
    "FOLON": {
      "Kaniasso": ["GOULIA", "KANIASSO", "MAHANDIANA-SOKOURANI"],
      "Minignan": ["KIMBIRILA-NORD", "MINIGNAN", "SOKORO", "TIENKO"]
    },
    "GBEKE": {
      "Béoumi": ["ANDO-KEKRENOU", "BEOUMI", "BODOKRO", "KONDROBO", "LOLOBO", "MARABADJASSA", "N'GUESSANKRO"],
      "Botro": ["BOTRO", "DIABO", "KROFOINSOU", "LANGUIBONOU"],
      "Bouaké": ["BOUAKE", "BOUNDA", "BROBO", "DJEBONOUA", "MAMINI"],
      "Sakassou": ["AYAOU-SRAN", "DIBRI-ASRIKRO", "SAKASSOU", "TOUMODI-SAKASSOU"]
    },
    "GBOKLE": {
      "Fresco": ["DAHIRI", "FRESCO", "GBAGBAM"],
      "Sassandra": ["DAKPADOU", "GRIHIRI", "LOBAKUYA", "MEDON", "SAGO", "SASSANDRA"]
    },
    "GOH": {
      "Gagnoa": ["BAYOTA", "DAHIEPA-KEHI", "DIGNAGO", "DOUKOUYO", "DOUGROUPALEGNOA", "GAGNOA", "GALEBOUO", "GNAGBODOUGNOA", "GUIBEROUA", "OURAGAHIO", "SERIHIO", "YOPOHUE"],
      "Oumé": ["DIEGONEFLA", "GUEPAHOUO", "OUME", "TONLA"]
    },
    "GONTOUGO": {
      "Bondoukou": ["APPIMANDOUM", "BONDO", "BONDOUKOU", "GOUMERE", "LAOUDI-BA", "PINDA-BOROKRO", "SAPLI-SEPINGO", "SOROBANGO", "TABAGNE", "TAGADI", "YEZIMALA"],
      "Koun-Fao": ["BOAHIA", "KOKOMIAN", "KOUN-FAO", "KOUASSI-DATEKRO", "TANKESSE", "TIENKOIKRO"],
      "Sandégué": ["BANDAKAGNI-TOMORA", "DIMANDOUGOU", "SANDEGUE", "YOROBODI"],
      "Tanda": ["AMANVI", "DIAMBA", "TANDA", "TCHEDIO"],
      "Transua": ["ASSUEFRY", "KOUASSIA-NIAGUINI", "TRANSUA"]
    },
    "GRANDS-PONTS": {
      "Dabou": ["DABOU", "LOPOU", "TOUPAH"],
      "Grand-Lahou": ["AHOUANOU", "BACANDA", "EBONOU", "GRAND-LAHOU", "TOUKOUZOU"],
      "Jacqueville": ["ATTOUTOU", "JACQUEVILLE"]
    },
    "GUEMON": {
      "Bangolo": ["BANGOLO", "BEOUE-ZIBIAO", "BLENIMEOUIN", "DIEOUZON", "GOHOUO-ZAGNA", "GUINGLO-TAHOUAKE", "KAHIN-ZARABAON", "ZEO", "ZOU"],
      "Duékoué": ["BAGOHOUO", "DUEKOUE", "GBAPLEU", "GUEHIEBLY", "GUEZON"],
      "Facobly": ["FACOBLY", "GUEZON", "KOUA", "SEMIEN", "TIENY-SEABLY"],
      "Kouibly": ["KOUIBLY", "NIDROU", "OUYABLY-GNONDROU", "TOTRODROU"]
    },
    "HAMBOL": {
      "Dabakala": ["BASSAWA", "BONIEREDOUGOU", "DABAKALA", "FOUMBOLO", "NIEMENE", "SATAMA-SOKORO", "SATAMA-SOKOURA", "SOKALA-SOBARA", "TENDENE-BAMBARASSO", "YAOSSEDOUGOU"],
      "Katiola": ["FRONAN", "KATIOLA", "TIMBE"],
      "Niakaramandougou": ["ARIKOKAHA", "BADIKAHA", "NIAKARAMADOUGOU", "NIEDEKAHA", "TAFIRE", "TORTIYA"]
    },
    "HAUT-SASSANDRA": {
      "Daloa": ["BEDIALA", "DALOA", "GADOUAN", "GBOGUHE", "GONATE", "ZAIBO"],
      "Issia": ["BOGUEDIA", "IBOGUHE", "ISSIA", "NAHIO", "NAMANE", "SAIOUA", "TAPEGUIA"],
      "Vavoua": ["BAZRA NATTIS", "DANANON", "DANIA", "KETRO BASSAM", "SEITIFLA", "VAVOUA"],
      "Zoukougbeu": ["DOMANGBEU", "GREGBEU", "GUESSABO", "ZOUKOUGBEU"]
    },
    "IFFOU": {
      "Daoukro": ["DAOUKRO", "ETTROKRO", "N'GATTAKRO", "SAMANZA"],
      "M'Bahiakro": ["BONGUERA", "KONDOSSOU", "M'BAHIAKRO"],
      "Ouelle": ["AKPASSANOU", "ANANDA", "OUELLE"],
      "Prikro": ["ANIANOU", "FAMIENKRO", "KOFFI-AMONKRO", "NAFANA", "PRIKRO"]
    },
    "INDENIE-DJUABLIN": {
      "Abengourou": ["ABENGOUROU", "AMELEKIA", "ANIASSUE", "EBILASSOKRO", "NIABLE", "YAKASSE-FEYASSE", "ZARANOU"],
      "Agnibilékrou": ["AGNIBILEKROU", "AKOBOISSUE", "DAME", "DUFFREBO", "TANGUELAN"],
      "Bettié": ["BETTIE", "DIAMARAKRO"]
    },
    "KABADOUGOU": {
      "Gbeleban": ["GBELEBAN", "SAMANGO", "SEYDOUGOU"],
      "Madinani": ["FENGOLO", "MADINANI", "N'GOLOBLASSO"],
      "Odienné": ["BAKO", "BOUGOUSSO", "DIOULATIEDOUGOU", "ODIENNE", "TIEME"],
      "Samatiguila": ["KIMBIRILA-SUD", "SAMATIGUILA"],
      "Seguelon": ["GBONGAHA", "SEGUELON"]
    },
    "LA ME": {
      "Akoupé": ["AFFERY", "AKOUPE", "BECOUEFIN"],
      "Adzopé": ["ADZOPE", "AGOU", "ANNEPE", "ASSIKOI", "BECEDI-BRIGNAN", "YAKASSE-ME"],
      "Alépé": ["ABOISSO-COMOE", "ALEPE", "ALLOSSO", "DANGUIRA", "OGHLWAPO"],
      "Yakasse-Attobrou": ["ABONGOUA", "BIEBY", "YAKASSE-ATTOBROU"]
    },
    "LOH-DJIBOUA": {
      "Divo": ["CHIEPO", "DIDOKO", "DIVO", "HIRE", "NEBO", "OGOUDOU", "ZEGO"],
      "Guitry": ["DAIRO-DIDIZO", "GUITRY", "LAUZOUA", "YOCOBOUE"],
      "Lakota": ["DJIDJI", "GAGORE", "GOUDOUKO", "LAKOTA", "NIAMBEZARIA", "ZIKISSO"]
    },
    "MARAHOUE": {
      "Bonon": ["BONON", "ZAGUIETA"],
      "Bouaflé": ["BEGBESSOU", "BOUAFLE", "N'DOUFFOUKANKRO", "PAKOUABO", "TIBEITA"],
      "Gohitafla": ["GOHITAFLA", "IRIEFLA", "MAMINIGUI"],
      "Sinfra": ["BAZRE", "KONONFLA", "KOUETINFLA", "SINFRA"],
      "Zuenoula": ["KANZRA", "VOUEBOUFLA", "ZANZRA", "ZUENOULA"]
    },
    "MORONOU": {
      "Arrah": ["ARRAH", "KOTOBI", "KREGBE"],
      "Bongouanou": ["ANDE", "ASSIE-KOUMASSI", "BONGOUANOU", "N'GUESSANKRO"],
      "M'Batto": ["ANOUMABA", "ASSAHARA", "M'BATTO", "TIEMELEKRO"]
    },
    "N'ZI": {
      "Bocanda": ["BENGASSOU", "BOCANDA", "KOUADIOBLEKRO", "N'ZECREZESSOU"],
      "Dimbokro": ["ABIGUI", "DIANGOKRO", "DIMBOKRO", "NOFOU"],
      "Kouassi-Kouassikro": ["KOUASSI-KOUASSIKRO", "MEKRO"]
    },
    "NAWA": {
      "Buyo": ["BUYO", "DAPEOUA"],
      "Guéyo": ["DABOUYO", "GUEYO"],
      "Meagui": ["GNAMANGUI", "MEAGUI", "OUPOYO"],
      "Soubré": ["GRAND-ZATTRY", "LILIYO", "OKROUYO", "SOUBRE"]
    },
    "PORO": {
      "Dikodougou": ["BORON", "DIKODOUGOU", "GUIEMBE"],
      "Korhogo": ["DASSOUNGBOHO", "KANOROBA", "KARAKORO", "KIEMOU", "KOMBOLOKOURA", "KOMBORODOUGOU", "KONI", "KORHOGO", "LATAHA", "N'GANON", "NAFOUN", "NAPIELEDOUGOU", "NIOFOIN", "SIRASSO", "SOHOUO", "TIORONIARADOUGOU"],
      "M'Bengué": ["BOUGOU", "KATIALI", "KATOGO", "M'BENGUE"],
      "Sinématiali": ["BAHOUAKAHA", "KAGBOLODOUGOU", "SIDIOGO", "SINEMATIALI"]
    },
    "SAN-PEDRO": {
      "San-Pédro": ["DOBA", "DOGBO", "GABIADJI", "GRAND-BEREBY", "SAN-PEDRO"],
      "Tabou": ["DAPO-IBOKE", "DJAMANDIOKE", "DJOUROUTOU", "GRABO", "OLODIO", "TABOU"]
    },
    "SUD-COMOE": {
      "Aboisso": ["ABOISSO", "ADAOU", "ADJOUAN", "AYAME", "BIANOUAN", "KOUAKRO", "MAFERE", "YAOU"],
      "Adiaké": ["ADIAKE", "ASSINIE-MAFIA", "ETUEBOUE"],
      "Grand-Bassam": ["BONGO", "BONOUA", "GRAND-BASSAM"],
      "Tiapoum": ["NOE", "NOUAMOU", "TIAPOUM"]
    },
    "TCHOLOGO": {
      "Ferkessédougou": ["FERKESSEDOUGOU", "KOUMBALA", "TOGONIERE"],
      "Kong": ["BILIMONO", "KONG", "NAFANA", "SIKOLO"],
      "Ouangolodougou": ["DIAWALA", "KAOUARA", "NIELLE", "OUANGOLODOUGOU", "TOUMOUKORO"]
    },
    "TONKPI": {
      "Biankouma": ["BIANKOUMA", "BLAPLEU", "GBANGBEGOUINE", "GBONNE", "GOUINE", "KPATA", "SANTA"],
      "Danané": ["DALEU", "DANANE", "GBON-HOUYE", "KOUAN-HOULE", "MAHAPLEU", "SEILEU", "ZONNEU"],
      "Man": ["BOGOUINE", "FAGNAMPLEU", "GBANGBEGOUINE-YATI", "LOGOUALE", "MAN", "PODIAGOUINE", "SANDOUGOU-SOBA", "SANGOUINE", "YAPLEU", "ZAGOUE", "ZIOGOUINE"],
      "Sipilou": ["SIPILOU", "YORODOUGOU"],
      "Zouan-Hounien": ["BANNEU", "BIN-HOUYE", "GOULALEU", "TEAPLEU", "YELLEU", "ZOUAN-HOUNIEN"]
    },
    "WORODOUGOU": {
      "Kani": ["DJIBROSSO", "FADIADOUGOU", "KANI", "MORONDO"],
      "Séguéla": ["BOBI", "DIARABANA", "DUALLA", "KAMALO", "MASSALA", "SEGUELA", "SIFIE", "WOROFLA"]
    },
    "YAMOUSSOUKRO": {
      "Attiegouakro": ["ATTIEGOUAKRO", "LOLOBO"],
      "Yamoussoukro": ["KOSSOU", "YAMOUSSOUKRO"]
    },
    "DIASPORA": {
      "Diaspora": ["AFRIQUE", "AMERIQUE", "EUROPE"]
    }
  };
  
  // Get departments for selected region
  const getDepartments = (region: string): string[] => {
    const normalizedRegion = region.toUpperCase();
    return adminData[normalizedRegion] ? Object.keys(adminData[normalizedRegion]) : [];
  };
  
  // Get sous-préfectures for selected region and department
  const getSousPrefectures = (region: string, departement: string): string[] => {
    const normalizedRegion = region.toUpperCase();
    if (!adminData[normalizedRegion]) return [];
    return adminData[normalizedRegion][departement] || [];
  };
  const [formData, setFormData] = useState({
    // Circonscription de rattachement
    region: "",
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
    reseauOperateurAutre: "",
    lieuxCulte: [] as string[],
    lieuxCulteAutre: "",
    eauPotable: false,
    nombrePompes: "",
    
    // 7. Autres infrastructures
    equipementsSportifs: false,
    associationSportive: false,
    associationJeunes: false,
    associationFemmes: false,
    lotissement: false,
    cimetiere: false,
    siteTouristique: false,
    gareRoutiere: false,
    cultureCafe: false,
    cultureCacao: false,
    cultureCoton: false,
    cultureAnacarde: false,
    cultureHevea: false,
    cultureRiz: false,
    cultureIgname: false,
    cultureManioc: false,
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

  useEffect(() => {
    if (id) {
      loadCampement();
    }
  }, [id]);

  const loadCampement = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("campements")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          region: data.region || "",
          departement: data.departement || "",
          sousPrefecture: data.sous_prefecture || "",
          village: data.village_rattachement || "",
          toponymie: data.nom_campement || "",
          populationTotale: data.population?.toString() || "",
          nombreHabitantsRGPH: data.nombre_menages?.toString() || "",
          pourcentageEtrangers: "",
          nationalitesDominantes: "",
          nationaliteChef: "",
          identiteFondateur: "",
          anneeCreation: "",
          distanceVillage: data.distance_village?.toString() || "",
          natureVoie: data.route_acces || "",
          etatVoie: "",
          activiteEconomique: "",
          situationGeographique: "",
          ecoleStatut: "",
          ecoleNombreClasses: "",
          santeType: "",
          santeStatut: "",
          depotPharmacie: false,
          electricite: data.electricite || false,
          electriciteConnectivite: data.electricite_connectivite || "",
          reseauTelephone: data.reseau_telephone || false,
          reseauType: data.reseau_type || "",
          reseauOperateur: data.reseau_operateur || "",
          reseauOperateurAutre: data.reseau_operateur_autre || "",
          lieuxCulte: data.lieux_culte || [],
          lieuxCulteAutre: data.lieux_culte_autre || "",
          eauPotable: data.eau_potable || false,
          nombrePompes: "",
          equipementsSportifs: false,
          associationSportive: false,
          associationJeunes: false,
          associationFemmes: false,
          lotissement: false,
          cimetiere: false,
          siteTouristique: false,
          gareRoutiere: false,
          cultureCafe: false,
          cultureCacao: false,
          cultureCoton: false,
          cultureAnacarde: false,
          cultureHevea: false,
          cultureRiz: false,
          cultureIgname: false,
          cultureManioc: false,
          marcheVivres: false,
          magasinStockage: false,
          orgProducteurs: false,
          orgCommercialisation: false,
          avisChefCampement: data.avis_chef_village || "",
          avisChefVillage: data.avis_chef_village || "",
          avisSousPrefet: data.avis_sous_prefet || "",
          avisPrefet: data.avis_prefet || "",
          observations: data.observations || "",
        });
      }
    } catch (error) {
      console.error("Erreur de chargement:", error);
      toast.error("Erreur lors du chargement du campement");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.toponymie || !formData.departement || !formData.region) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Utilisateur non authentifié");
        return;
      }

      const campementData = {
        user_id: user.id,
        nom_campement: formData.toponymie,
        region: formData.region,
        departement: formData.departement,
        sous_prefecture: formData.sousPrefecture,
        village_rattachement: formData.village,
        distance_village: formData.distanceVillage ? parseFloat(formData.distanceVillage) : null,
        population: formData.populationTotale ? parseInt(formData.populationTotale) : null,
        nombre_menages: formData.nombreHabitantsRGPH ? parseInt(formData.nombreHabitantsRGPH) : null,
        ecole: !!formData.ecoleStatut,
        centre_sante: !!formData.santeType,
        eau_potable: formData.eauPotable,
        electricite: formData.electricite,
        electricite_connectivite: formData.electriciteConnectivite || null,
        reseau_telephone: formData.reseauTelephone,
        reseau_type: formData.reseauType || null,
        reseau_operateur: formData.reseauOperateur || null,
        reseau_operateur_autre: formData.reseauOperateurAutre || null,
        lieux_culte: formData.lieuxCulte.length > 0 ? formData.lieuxCulte : null,
        lieux_culte_autre: formData.lieuxCulteAutre || null,
        route_acces: formData.natureVoie,
        avis_prefet: formData.avisPrefet,
        avis_sous_prefet: formData.avisSousPrefet,
        avis_chef_village: formData.avisChefVillage,
        observations: formData.observations,
      };

      if (id) {
        const { error } = await supabase
          .from("campements")
          .update(campementData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Campement mis à jour avec succès !");
      } else {
        const { error } = await supabase
          .from("campements")
          .insert(campementData);

        if (error) throw error;
        toast.success("Campement enregistré avec succès !");
      }

      setTimeout(() => navigate("/campements"), 1500);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
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
            {id ? "Modifier" : "Nouvelle"} fiche technique d'érection de campement
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Région *</Label>
                  <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value, departement: "", sousPrefecture: "" })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une région" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="Abidjan">Abidjan</SelectItem>
                      <SelectItem value="Agnéby-Tiassa">Agnéby-Tiassa</SelectItem>
                      <SelectItem value="Bafing">Bafing</SelectItem>
                      <SelectItem value="Bagoué">Bagoué</SelectItem>
                      <SelectItem value="Béré">Béré</SelectItem>
                      <SelectItem value="Bounkani">Bounkani</SelectItem>
                      <SelectItem value="Cavally">Cavally</SelectItem>
                      <SelectItem value="Folon">Folon</SelectItem>
                      <SelectItem value="Gbêkê">Gbêkê</SelectItem>
                      <SelectItem value="Gbokle">Gbokle</SelectItem>
                      <SelectItem value="Gôh">Gôh</SelectItem>
                      <SelectItem value="Gontougo">Gontougo</SelectItem>
                      <SelectItem value="Grands-Ponts">Grands-Ponts</SelectItem>
                      <SelectItem value="Guémon">Guémon</SelectItem>
                      <SelectItem value="Hambol">Hambol</SelectItem>
                      <SelectItem value="Haut-Sassandra">Haut-Sassandra</SelectItem>
                      <SelectItem value="Iffou">Iffou</SelectItem>
                      <SelectItem value="Indénié-Djuablin">Indénié-Djuablin</SelectItem>
                      <SelectItem value="Kabadougou">Kabadougou</SelectItem>
                      <SelectItem value="La Mé">La Mé</SelectItem>
                      <SelectItem value="Lôh-Djiboua">Lôh-Djiboua</SelectItem>
                      <SelectItem value="Marahoué">Marahoué</SelectItem>
                      <SelectItem value="Moronou">Moronou</SelectItem>
                      <SelectItem value="Nawa">Nawa</SelectItem>
                      <SelectItem value="N'Zi">N'Zi</SelectItem>
                      <SelectItem value="Poro">Poro</SelectItem>
                      <SelectItem value="San-Pédro">San-Pédro</SelectItem>
                      <SelectItem value="Sud-Comoé">Sud-Comoé</SelectItem>
                      <SelectItem value="Tchologo">Tchologo</SelectItem>
                      <SelectItem value="Tonkpi">Tonkpi</SelectItem>
                      <SelectItem value="Worodougou">Worodougou</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departement">Département *</Label>
                  <Select value={formData.departement} onValueChange={(value) => setFormData({ ...formData, departement: value, sousPrefecture: "" })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50 max-h-[300px]">
                      {formData.region === "Abidjan" && (
                        <>
                          <SelectItem value="Abidjan">Abidjan</SelectItem>
                        </>
                      )}
                      {formData.region === "Agnéby-Tiassa" && (
                        <>
                          <SelectItem value="Agboville">Agboville</SelectItem>
                          <SelectItem value="Tiassalé">Tiassalé</SelectItem>
                        </>
                      )}
                      {formData.region === "Bafing" && (
                        <>
                          <SelectItem value="Touba">Touba</SelectItem>
                        </>
                      )}
                      {formData.region === "Bagoué" && (
                        <>
                          <SelectItem value="Boundiali">Boundiali</SelectItem>
                          <SelectItem value="Tengréla">Tengréla</SelectItem>
                        </>
                      )}
                      {formData.region === "Béré" && (
                        <>
                          <SelectItem value="Mankono">Mankono</SelectItem>
                        </>
                      )}
                      {formData.region === "Bounkani" && (
                        <>
                          <SelectItem value="Bouna">Bouna</SelectItem>
                          <SelectItem value="Doropo">Doropo</SelectItem>
                          <SelectItem value="Tehini">Tehini</SelectItem>
                        </>
                      )}
                      {formData.region === "Cavally" && (
                        <>
                          <SelectItem value="Guiglo">Guiglo</SelectItem>
                          <SelectItem value="Taï">Taï</SelectItem>
                          <SelectItem value="Toulepleu">Toulepleu</SelectItem>
                        </>
                      )}
                      {formData.region === "Folon" && (
                        <>
                          <SelectItem value="Minignan">Minignan</SelectItem>
                        </>
                      )}
                      {formData.region === "Gbêkê" && (
                        <>
                          <SelectItem value="Bouaké">Bouaké</SelectItem>
                          <SelectItem value="Béoumi">Béoumi</SelectItem>
                          <SelectItem value="Botro">Botro</SelectItem>
                        </>
                      )}
                      {formData.region === "Gbokle" && (
                        <>
                          <SelectItem value="Sassandra">Sassandra</SelectItem>
                        </>
                      )}
                      {formData.region === "Gôh" && (
                        <>
                          <SelectItem value="Gagnoa">Gagnoa</SelectItem>
                          <SelectItem value="Oumé">Oumé</SelectItem>
                        </>
                      )}
                      {formData.region === "Gontougo" && (
                        <>
                          <SelectItem value="Bondoukou">Bondoukou</SelectItem>
                          <SelectItem value="Koun-Fao">Koun-Fao</SelectItem>
                          <SelectItem value="Sandégué">Sandégué</SelectItem>
                          <SelectItem value="Tanda">Tanda</SelectItem>
                          <SelectItem value="Transua">Transua</SelectItem>
                        </>
                      )}
                      {formData.region === "Grands-Ponts" && (
                        <>
                          <SelectItem value="Dabou">Dabou</SelectItem>
                          <SelectItem value="Jacqueville">Jacqueville</SelectItem>
                        </>
                      )}
                      {formData.region === "Guémon" && (
                        <>
                          <SelectItem value="Bangolo">Bangolo</SelectItem>
                          <SelectItem value="Duékoué">Duékoué</SelectItem>
                        </>
                      )}
                      {formData.region === "Hambol" && (
                        <>
                          <SelectItem value="Dabakala">Dabakala</SelectItem>
                          <SelectItem value="Katiola">Katiola</SelectItem>
                          <SelectItem value="Niakaramandougou">Niakaramandougou</SelectItem>
                        </>
                      )}
                      {formData.region === "Haut-Sassandra" && (
                        <>
                          <SelectItem value="Daloa">Daloa</SelectItem>
                          <SelectItem value="Issia">Issia</SelectItem>
                          <SelectItem value="Vavoua">Vavoua</SelectItem>
                          <SelectItem value="Zoukougbeu">Zoukougbeu</SelectItem>
                        </>
                      )}
                      {formData.region === "Iffou" && (
                        <>
                          <SelectItem value="Daoukro">Daoukro</SelectItem>
                          <SelectItem value="M'Bahiakro">M'Bahiakro</SelectItem>
                        </>
                      )}
                      {formData.region === "Indénié-Djuablin" && (
                        <>
                          <SelectItem value="Abengourou">Abengourou</SelectItem>
                          <SelectItem value="Agnibilékrou">Agnibilékrou</SelectItem>
                          <SelectItem value="Bettié">Bettié</SelectItem>
                        </>
                      )}
                      {formData.region === "Kabadougou" && (
                        <>
                          <SelectItem value="Odienné">Odienné</SelectItem>
                        </>
                      )}
                      {formData.region === "La Mé" && (
                        <>
                          <SelectItem value="Adzopé">Adzopé</SelectItem>
                          <SelectItem value="Akoupé">Akoupé</SelectItem>
                          <SelectItem value="Alépé">Alépé</SelectItem>
                        </>
                      )}
                      {formData.region === "Lôh-Djiboua" && (
                        <>
                          <SelectItem value="Divo">Divo</SelectItem>
                          <SelectItem value="Guitry">Guitry</SelectItem>
                          <SelectItem value="Lakota">Lakota</SelectItem>
                        </>
                      )}
                      {formData.region === "Marahoué" && (
                        <>
                          <SelectItem value="Bouaflé">Bouaflé</SelectItem>
                          <SelectItem value="Sinfra">Sinfra</SelectItem>
                          <SelectItem value="Zuenoula">Zuenoula</SelectItem>
                        </>
                      )}
                      {formData.region === "Moronou" && (
                        <>
                          <SelectItem value="Bongouanou">Bongouanou</SelectItem>
                          <SelectItem value="M'Batto">M'Batto</SelectItem>
                        </>
                      )}
                      {formData.region === "Nawa" && (
                        <>
                          <SelectItem value="Guéyo">Guéyo</SelectItem>
                          <SelectItem value="Soubré">Soubré</SelectItem>
                        </>
                      )}
                      {formData.region === "N'Zi" && (
                        <>
                          <SelectItem value="Bocanda">Bocanda</SelectItem>
                          <SelectItem value="Dimbokro">Dimbokro</SelectItem>
                        </>
                      )}
                      {formData.region === "Poro" && (
                        <>
                          <SelectItem value="Korhogo">Korhogo</SelectItem>
                          <SelectItem value="M'Bengué">M'Bengué</SelectItem>
                          <SelectItem value="Sinématiali">Sinématiali</SelectItem>
                        </>
                      )}
                      {formData.region === "San-Pédro" && (
                        <>
                          <SelectItem value="San-Pédro">San-Pédro</SelectItem>
                          <SelectItem value="Tabou">Tabou</SelectItem>
                        </>
                      )}
                      {formData.region === "Sud-Comoé" && (
                        <>
                          <SelectItem value="Aboisso">Aboisso</SelectItem>
                          <SelectItem value="Adiaké">Adiaké</SelectItem>
                          <SelectItem value="Grand-Bassam">Grand-Bassam</SelectItem>
                          <SelectItem value="Tiapoum">Tiapoum</SelectItem>
                        </>
                      )}
                      {formData.region === "Tchologo" && (
                        <>
                          <SelectItem value="Ferkessédougou">Ferkessédougou</SelectItem>
                          <SelectItem value="Kong">Kong</SelectItem>
                          <SelectItem value="Ouangolodougou">Ouangolodougou</SelectItem>
                        </>
                      )}
                      {formData.region === "Tonkpi" && (
                        <>
                          <SelectItem value="Biankouma">Biankouma</SelectItem>
                          <SelectItem value="Danané">Danané</SelectItem>
                          <SelectItem value="Man">Man</SelectItem>
                          <SelectItem value="Sipilou">Sipilou</SelectItem>
                          <SelectItem value="Zouan-Hounien">Zouan-Hounien</SelectItem>
                        </>
                      )}
                      {formData.region === "Worodougou" && (
                        <>
                          <SelectItem value="Kani">Kani</SelectItem>
                          <SelectItem value="Séguéla">Séguéla</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sousPrefecture">Sous-préfecture *</Label>
                  <Select 
                    value={formData.sousPrefecture} 
                    onValueChange={(value) => setFormData({ ...formData, sousPrefecture: value })} 
                    disabled={!formData.departement}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={!formData.departement ? "Sélectionner d'abord un département" : "Sélectionner une sous-préfecture"} />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50 max-h-[300px]">
                      {formData.departement && getSousPrefectures(formData.region, formData.departement).map((sp) => (
                        <SelectItem key={sp} value={sp}>{sp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              {/* 1. École */}
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

              {/* 3. Électricité */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">3. Électricité</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
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
                    {formData.electricite && (
                      <div className="ml-6 space-y-2">
                        <Label htmlFor="electriciteConnectivite">Type de connectivité</Label>
                        <Select 
                          value={formData.electriciteConnectivite} 
                          onValueChange={(value) => setFormData({ ...formData, electriciteConnectivite: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reseau_national">Réseau national</SelectItem>
                            <SelectItem value="isole">Isolé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Accès au réseau téléphonique */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">4. Accès au réseau téléphonique</h3>
                <div className="space-y-2">
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
                    {formData.reseauTelephone && (
                      <div className="ml-6 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="reseauType">Type de réseau</Label>
                          <Select 
                            value={formData.reseauType} 
                            onValueChange={(value) => setFormData({ ...formData, reseauType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixe">Fixe</SelectItem>
                              <SelectItem value="mobile">Mobile</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {formData.reseauType === "mobile" && (
                          <div className="space-y-2">
                            <Label htmlFor="reseauOperateur">Opérateur mobile</Label>
                            <Select 
                              value={formData.reseauOperateur} 
                              onValueChange={(value) => setFormData({ ...formData, reseauOperateur: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="orange">Orange</SelectItem>
                                <SelectItem value="mtn">MTN</SelectItem>
                                <SelectItem value="moov">Moov</SelectItem>
                                <SelectItem value="autre">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {formData.reseauType === "mobile" && formData.reseauOperateur === "autre" && (
                          <div className="space-y-2">
                            <Label htmlFor="reseauOperateurAutre">Préciser l'opérateur</Label>
                            <Input
                              id="reseauOperateurAutre"
                              value={formData.reseauOperateurAutre}
                              onChange={(e) => setFormData({ ...formData, reseauOperateurAutre: e.target.value })}
                              placeholder="Nom de l'opérateur"
                            />
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
                  
              {/* 5. Lieux de culte */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">5. Lieux de culte</h3>
                <div className="space-y-2">
                    <div className="ml-6 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="culte-chretien"
                          checked={formData.lieuxCulte.includes("chretien")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, lieuxCulte: [...formData.lieuxCulte, "chretien"] });
                            } else {
                              setFormData({ ...formData, lieuxCulte: formData.lieuxCulte.filter(c => c !== "chretien") });
                            }
                          }}
                        />
                        <Label htmlFor="culte-chretien" className="cursor-pointer">Chrétien</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="culte-musulman"
                          checked={formData.lieuxCulte.includes("musulman")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, lieuxCulte: [...formData.lieuxCulte, "musulman"] });
                            } else {
                              setFormData({ ...formData, lieuxCulte: formData.lieuxCulte.filter(c => c !== "musulman") });
                            }
                          }}
                        />
                        <Label htmlFor="culte-musulman" className="cursor-pointer">Musulman</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="culte-traditionnel"
                          checked={formData.lieuxCulte.includes("traditionnel")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, lieuxCulte: [...formData.lieuxCulte, "traditionnel"] });
                            } else {
                              setFormData({ ...formData, lieuxCulte: formData.lieuxCulte.filter(c => c !== "traditionnel") });
                            }
                          }}
                        />
                        <Label htmlFor="culte-traditionnel" className="cursor-pointer">Traditionnel</Label>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="culte-autre"
                            checked={formData.lieuxCulte.includes("autre")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({ ...formData, lieuxCulte: [...formData.lieuxCulte, "autre"] });
                              } else {
                                setFormData({ ...formData, lieuxCulte: formData.lieuxCulte.filter(c => c !== "autre"), lieuxCulteAutre: "" });
                              }
                            }}
                          />
                          <Label htmlFor="culte-autre" className="cursor-pointer">Autre</Label>
                        </div>
                        {formData.lieuxCulte.includes("autre") && (
                          <div className="ml-6">
                            <Input
                              id="lieuxCulteAutre"
                              value={formData.lieuxCulteAutre}
                              onChange={(e) => setFormData({ ...formData, lieuxCulteAutre: e.target.value })}
                              placeholder="Préciser"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              {/* 6. Eau potable */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">6. Eau potable</h3>
                <div className="grid gap-4 md:grid-cols-2">
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

              {/* 7. Autres infrastructures */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">7. Autres infrastructures à préciser</h3>
                
                {/* Équipements et associations */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="equipementsSportifs"
                      checked={formData.equipementsSportifs}
                      onCheckedChange={(checked) => setFormData({ ...formData, equipementsSportifs: checked as boolean })}
                    />
                    <Label htmlFor="equipementsSportifs" className="cursor-pointer">
                      Équipements sportifs (terrain de football)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="associationSportive"
                      checked={formData.associationSportive}
                      onCheckedChange={(checked) => setFormData({ ...formData, associationSportive: checked as boolean })}
                    />
                    <Label htmlFor="associationSportive" className="cursor-pointer">
                      Association sportive
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="associationJeunes"
                      checked={formData.associationJeunes}
                      onCheckedChange={(checked) => setFormData({ ...formData, associationJeunes: checked as boolean })}
                    />
                    <Label htmlFor="associationJeunes" className="cursor-pointer">
                      Association de jeunes
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="associationFemmes"
                      checked={formData.associationFemmes}
                      onCheckedChange={(checked) => setFormData({ ...formData, associationFemmes: checked as boolean })}
                    />
                    <Label htmlFor="associationFemmes" className="cursor-pointer">
                      Association de femmes
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lotissement"
                      checked={formData.lotissement}
                      onCheckedChange={(checked) => setFormData({ ...formData, lotissement: checked as boolean })}
                    />
                    <Label htmlFor="lotissement" className="cursor-pointer">
                      Lotissement
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cimetiere"
                      checked={formData.cimetiere}
                      onCheckedChange={(checked) => setFormData({ ...formData, cimetiere: checked as boolean })}
                    />
                    <Label htmlFor="cimetiere" className="cursor-pointer">
                      Cimetière
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="siteTouristique"
                      checked={formData.siteTouristique}
                      onCheckedChange={(checked) => setFormData({ ...formData, siteTouristique: checked as boolean })}
                    />
                    <Label htmlFor="siteTouristique" className="cursor-pointer">
                      Site touristique
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gareRoutiere"
                      checked={formData.gareRoutiere}
                      onCheckedChange={(checked) => setFormData({ ...formData, gareRoutiere: checked as boolean })}
                    />
                    <Label htmlFor="gareRoutiere" className="cursor-pointer">
                      Gare routière
                    </Label>
                  </div>
                </div>

                {/* Cultures industrielles */}
                <div className="space-y-2">
                  <Label className="font-semibold">Principale culture industrielle</Label>
                  <div className="grid gap-3 md:grid-cols-3 ml-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cultureCafe"
                        checked={formData.cultureCafe}
                        onCheckedChange={(checked) => setFormData({ ...formData, cultureCafe: checked as boolean })}
                      />
                      <Label htmlFor="cultureCafe" className="cursor-pointer">Café</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cultureCacao"
                        checked={formData.cultureCacao}
                        onCheckedChange={(checked) => setFormData({ ...formData, cultureCacao: checked as boolean })}
                      />
                      <Label htmlFor="cultureCacao" className="cursor-pointer">Cacao</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cultureCoton"
                        checked={formData.cultureCoton}
                        onCheckedChange={(checked) => setFormData({ ...formData, cultureCoton: checked as boolean })}
                      />
                      <Label htmlFor="cultureCoton" className="cursor-pointer">Coton</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cultureAnacarde"
                        checked={formData.cultureAnacarde}
                        onCheckedChange={(checked) => setFormData({ ...formData, cultureAnacarde: checked as boolean })}
                      />
                      <Label htmlFor="cultureAnacarde" className="cursor-pointer">Anacarde</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cultureHevea"
                        checked={formData.cultureHevea}
                        onCheckedChange={(checked) => setFormData({ ...formData, cultureHevea: checked as boolean })}
                      />
                      <Label htmlFor="cultureHevea" className="cursor-pointer">Hévéa</Label>
                    </div>
                  </div>
                </div>

                {/* Cultures vivrières */}
                <div className="space-y-2">
                  <Label className="font-semibold">Principale culture vivrière</Label>
                  <div className="grid gap-3 md:grid-cols-3 ml-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cultureRiz"
                        checked={formData.cultureRiz}
                        onCheckedChange={(checked) => setFormData({ ...formData, cultureRiz: checked as boolean })}
                      />
                      <Label htmlFor="cultureRiz" className="cursor-pointer">Riz</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cultureIgname"
                        checked={formData.cultureIgname}
                        onCheckedChange={(checked) => setFormData({ ...formData, cultureIgname: checked as boolean })}
                      />
                      <Label htmlFor="cultureIgname" className="cursor-pointer">Igname</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cultureManioc"
                        checked={formData.cultureManioc}
                        onCheckedChange={(checked) => setFormData({ ...formData, cultureManioc: checked as boolean })}
                      />
                      <Label htmlFor="cultureManioc" className="cursor-pointer">Manioc</Label>
                    </div>
                  </div>
                </div>

                {/* Commercialisation */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marcheVivres"
                      checked={formData.marcheVivres}
                      onCheckedChange={(checked) => setFormData({ ...formData, marcheVivres: checked as boolean })}
                    />
                    <Label htmlFor="marcheVivres" className="cursor-pointer">
                      Marché de vivres
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="magasinStockage"
                      checked={formData.magasinStockage}
                      onCheckedChange={(checked) => setFormData({ ...formData, magasinStockage: checked as boolean })}
                    />
                    <Label htmlFor="magasinStockage" className="cursor-pointer">
                      Magasin de stockage
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="orgProducteurs"
                      checked={formData.orgProducteurs}
                      onCheckedChange={(checked) => setFormData({ ...formData, orgProducteurs: checked as boolean })}
                    />
                    <Label htmlFor="orgProducteurs" className="cursor-pointer">
                      Organisation de producteurs
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="orgCommercialisation"
                      checked={formData.orgCommercialisation}
                      onCheckedChange={(checked) => setFormData({ ...formData, orgCommercialisation: checked as boolean })}
                    />
                    <Label htmlFor="orgCommercialisation" className="cursor-pointer">
                      Organisation de la commercialisation
                    </Label>
                  </div>
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
              onClick={() => navigate("/campements")}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" className="gap-2" disabled={loading}>
              <Save size={18} />
              {loading ? "Enregistrement..." : (id ? "Mettre à jour" : "Enregistrer la fiche")}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SaisieForm;
