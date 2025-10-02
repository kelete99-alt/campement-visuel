-- Add electricity connectivity and telephone network columns
ALTER TABLE public.campements
ADD COLUMN IF NOT EXISTS electricite_connectivite TEXT,
ADD COLUMN IF NOT EXISTS reseau_telephone BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reseau_type TEXT,
ADD COLUMN IF NOT EXISTS reseau_operateur TEXT,
ADD COLUMN IF NOT EXISTS reseau_operateur_autre TEXT;