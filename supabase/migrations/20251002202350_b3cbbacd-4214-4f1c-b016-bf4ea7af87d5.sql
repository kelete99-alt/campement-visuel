-- Ajouter les colonnes de coordonnées GPS à la table campements
ALTER TABLE public.campements 
ADD COLUMN latitude numeric,
ADD COLUMN longitude numeric;

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN public.campements.latitude IS 'Latitude du campement (coordonnées GPS)';
COMMENT ON COLUMN public.campements.longitude IS 'Longitude du campement (coordonnées GPS)';