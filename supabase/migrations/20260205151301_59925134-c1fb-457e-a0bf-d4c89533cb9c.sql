-- LCA projects persisted in backend
CREATE TABLE IF NOT EXISTS public.lca_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  product_name text NOT NULL DEFAULT '',
  functional_unit text NOT NULL DEFAULT '',
  system_boundary text NOT NULL DEFAULT 'cradle-to-gate',
  status text NOT NULL DEFAULT 'draft',
  total_impact jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lca_projects ENABLE ROW LEVEL SECURITY;

-- For now, allow all app users (including unauthenticated) to read/write projects.
-- Tighten this later by adding authentication and scoping rows to a user_id.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='lca_projects' AND policyname='Public can view projects'
  ) THEN
    CREATE POLICY "Public can view projects"
      ON public.lca_projects
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='lca_projects' AND policyname='Public can create projects'
  ) THEN
    CREATE POLICY "Public can create projects"
      ON public.lca_projects
      FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='lca_projects' AND policyname='Public can update projects'
  ) THEN
    CREATE POLICY "Public can update projects"
      ON public.lca_projects
      FOR UPDATE
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='lca_projects' AND policyname='Public can delete projects'
  ) THEN
    CREATE POLICY "Public can delete projects"
      ON public.lca_projects
      FOR DELETE
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_lca_projects_updated_at'
  ) THEN
    CREATE TRIGGER trg_lca_projects_updated_at
    BEFORE UPDATE ON public.lca_projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_lca_projects_created_at ON public.lca_projects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lca_projects_status ON public.lca_projects (status);