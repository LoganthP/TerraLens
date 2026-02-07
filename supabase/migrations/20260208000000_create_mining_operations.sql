-- Create mining_operations table
CREATE TABLE IF NOT EXISTS public.mining_operations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location_lat NUMERIC NOT NULL,
    location_lng NUMERIC NOT NULL,
    location_region TEXT NOT NULL,
    location_country TEXT NOT NULL DEFAULT 'India',
    type TEXT NOT NULL CHECK (type IN ('open-pit', 'underground', 'placer', 'in-situ')),
    primary_ore TEXT NOT NULL,
    annual_production BIGINT NOT NULL DEFAULT 0,
    operational_since TEXT NOT NULL,
    employees INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.mining_operations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all operations"
    ON public.mining_operations FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own operations"
    ON public.mining_operations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own operations"
    ON public.mining_operations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own operations"
    ON public.mining_operations FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_mining_operations_user_id ON public.mining_operations(user_id);
CREATE INDEX idx_mining_operations_location ON public.mining_operations(location_lat, location_lng);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.mining_operations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
