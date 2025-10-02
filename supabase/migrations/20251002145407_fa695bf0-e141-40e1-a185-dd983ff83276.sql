-- Create campements table
CREATE TABLE public.campements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Identification
  nom_campement TEXT NOT NULL,
  region TEXT NOT NULL,
  departement TEXT NOT NULL,
  sous_prefecture TEXT NOT NULL,
  village_rattachement TEXT NOT NULL,
  distance_village NUMERIC,
  population NUMERIC,
  nombre_menages NUMERIC,
  
  -- Infrastructure
  ecole BOOLEAN DEFAULT false,
  centre_sante BOOLEAN DEFAULT false,
  eau_potable BOOLEAN DEFAULT false,
  electricite BOOLEAN DEFAULT false,
  route_acces TEXT,
  
  -- Opinions administratives
  avis_prefet TEXT,
  avis_sous_prefet TEXT,
  avis_chef_village TEXT,
  
  -- Observations
  observations TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.campements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all campements"
ON public.campements
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own campements"
ON public.campements
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert campements"
ON public.campements
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campements"
ON public.campements
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all campements"
ON public.campements
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own campements"
ON public.campements
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all campements"
ON public.campements
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER handle_campements_updated_at
BEFORE UPDATE ON public.campements
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();