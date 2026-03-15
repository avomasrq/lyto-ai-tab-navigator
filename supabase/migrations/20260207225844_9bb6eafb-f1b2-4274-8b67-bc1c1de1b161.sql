-- Enable RLS on _prisma_migrations table (system table, restrict to service role only)
ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access this table
CREATE POLICY "Service role only" ON public._prisma_migrations FOR ALL USING (auth.role() = 'service_role');