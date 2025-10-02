-- Permettre aux admins de modifier les profils (notamment le champ approved)
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));