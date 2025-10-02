-- Add lieux de culte columns
ALTER TABLE public.campements
ADD COLUMN IF NOT EXISTS lieux_culte TEXT[],
ADD COLUMN IF NOT EXISTS lieux_culte_autre TEXT;