import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Campement {
  id: string;
  nom_campement: string;
  region: string;
  departement: string;
  sous_prefecture: string;
  village_rattachement: string;
  population: number | null;
  nombre_menages: number | null;
  distance_village: number | null;
  ecole: boolean | null;
  centre_sante: boolean | null;
  eau_potable: boolean | null;
  electricite: boolean | null;
  reseau_telephone: boolean | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export const useCampements = () => {
  const queryClient = useQueryClient();

  const { data: campements = [], isLoading, error } = useQuery({
    queryKey: ["campements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Campement[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("campements")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campements"] });
      toast.success("Campement supprimé avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    },
  });

  // Statistiques dérivées
  const stats = {
    totalCampements: campements.length,
    totalPopulation: campements.reduce((sum, c) => sum + (c.population || 0), 0),
    campmentsParDepartement: campements.reduce((acc, c) => {
      acc[c.departement] = (acc[c.departement] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    campmentsParRegion: campements.reduce((acc, c) => {
      acc[c.region] = (acc[c.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return {
    campements,
    isLoading,
    error,
    stats,
    deleteCampement: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
