-- Ajouter le champ approved à la table profiles
ALTER TABLE public.profiles
ADD COLUMN approved BOOLEAN DEFAULT false;

-- Les profils existants sont approuvés par défaut (pour ne pas bloquer les comptes existants)
UPDATE public.profiles
SET approved = true;

-- Mettre à jour le trigger pour que les nouveaux utilisateurs soient en attente par défaut
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, approved)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', false);
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;