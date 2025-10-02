-- Ajouter une politique pour permettre aux admins de voir tous les profils
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Ajouter une politique pour permettre aux admins de voir tous les rôles (déjà existante mais on s'assure)
-- La politique existe déjà d'après la config, donc on ne la recrée pas