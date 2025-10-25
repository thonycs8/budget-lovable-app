-- Habilitar replicação completa para realtime updates
ALTER TABLE public.debts REPLICA IDENTITY FULL;

-- Adicionar tabela à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.debts;