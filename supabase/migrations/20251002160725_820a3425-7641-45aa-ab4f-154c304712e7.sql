-- Ajouter le rôle admin pour l'utilisateur kone@yahoo.fr
INSERT INTO public.user_roles (user_id, role)
VALUES ('25a0b26d-dbc7-46a8-a48a-5111d66d9aaf', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;