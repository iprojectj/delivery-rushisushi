CREATE TABLE public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

-- Default to Paradise
INSERT INTO public.app_settings (key, value) VALUES ('active_gateway', '"paradise"');

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read settings" ON public.app_settings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to update settings" ON public.app_settings
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
