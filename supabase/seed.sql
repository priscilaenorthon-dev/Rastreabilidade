-- Supabase demo seed for HoseTrack Pro
-- Run after schema.sql.

insert into public.companies (id, name, segment, cnpj, location, responsible, email, phone, status)
values
  ('11111111-1111-4111-8111-111111111111', 'Hidraulica Norte Ltda', 'Mineracao', '12.345.678/0001-90', 'Joinville / SC', 'Carlos Silva', 'carlos.silva@hidenorte.com.br', '(47) 3000-0101', 'Ativo'),
  ('22222222-2222-4222-8222-222222222222', 'Industria Metalurgica Sul', 'Siderurgia', '98.765.432/0001-11', 'Curitiba / PR', 'Ana Souza', 'ana.souza@metalsul.ind.br', '(41) 3200-2200', 'Ativo'),
  ('33333333-3333-4333-8333-333333333333', 'Logistica Rapida Conexoes', 'Logistica', '45.678.901/0001-22', 'Sao Paulo / SP', 'Marcos Lima', 'm.lima@lograpid.com', '(11) 3900-3300', 'Inativo'),
  ('44444444-4444-4444-8444-444444444444', 'Petrobras Refinaria A', 'Petroleo e Gas', '33.000.167/0001-01', 'Duque de Caxias / RJ', 'Juliana Costa', 'juliana.costa@cliente.com.br', '(21) 3800-7788', 'Ativo')
on conflict (id) do update
set
  name = excluded.name,
  segment = excluded.segment,
  cnpj = excluded.cnpj,
  location = excluded.location,
  responsible = excluded.responsible,
  email = excluded.email,
  phone = excluded.phone,
  status = excluded.status;

insert into public.client_accounts (id, company_id, username, password_hash, is_active)
values
  (
    'aaaaaaaa-1111-4444-8888-aaaaaaaaaaaa',
    '44444444-4444-4444-8444-444444444444',
    'jomaga',
    'f70abc6b2afbbda09484b9e8e543ad093743110cd6163f873a5c35a4dace1247',
    true
  )
on conflict (username) do update
set
  company_id = excluded.company_id,
  password_hash = excluded.password_hash,
  is_active = excluded.is_active;

insert into public.equipments (
  id,
  company_id,
  category,
  type,
  manufacturer,
  model,
  material,
  length_mm,
  work_pressure_bar,
  max_pressure_bar,
  location,
  sector,
  manufactured_at,
  installed_at,
  expires_at,
  status,
  qr_code
)
values
  ('MANG-7742', '44444444-4444-4444-8444-444444444444', 'Mangueira', 'Alta Pressao 2"', 'TechHose', 'TX-220', 'Inox 304', 2400, 250, 600, 'Refinaria A - Linha 3', 'Transferencia', '2025-04-10', '2025-05-20', '2026-03-12', 'Vencido', 'QR-MANG-7742'),
  ('CONN-1029', '11111111-1111-4111-8111-111111111111', 'Conector', 'Conector Hidraulico', 'ConnectPro', 'CP-09', 'Aco Carbono', 300, 180, 320, 'Mina Norte', 'Bombeamento', '2025-02-12', '2025-02-28', '2026-03-25', 'Ativo', 'QR-CONN-1029'),
  ('MANG-8821', '22222222-2222-4222-8222-222222222222', 'Mangueira', 'Mangueira Succao', 'FlowLine', 'FL-500', 'Borracha sintetica', 1900, 130, 250, 'Usina 2', 'Resfriamento', '2025-01-15', '2025-03-01', '2026-02-28', 'Vencido', 'QR-MANG-8821'),
  ('MANG-2210', '33333333-3333-4333-8333-333333333333', 'Mangueira', 'Composto Quimico', 'ChemFlex', 'CX-14', 'Composito', 2100, 200, 350, 'Polo Industrial', 'Abastecimento', '2025-05-30', '2025-06-15', '2026-04-30', 'Em Manutencao', 'QR-MANG-2210')
on conflict (id) do update
set
  company_id = excluded.company_id,
  category = excluded.category,
  type = excluded.type,
  manufacturer = excluded.manufacturer,
  model = excluded.model,
  material = excluded.material,
  length_mm = excluded.length_mm,
  work_pressure_bar = excluded.work_pressure_bar,
  max_pressure_bar = excluded.max_pressure_bar,
  location = excluded.location,
  sector = excluded.sector,
  manufactured_at = excluded.manufactured_at,
  installed_at = excluded.installed_at,
  expires_at = excluded.expires_at,
  status = excluded.status,
  qr_code = excluded.qr_code;

insert into public.opportunities (id, company_id, equipment_id, unit, service, urgency, deadline, status, notes)
values
  ('OPP-9001', '44444444-4444-4444-8444-444444444444', 'MANG-7742', 'Refinaria A', 'Substituicao Preventiva', 'Alta', '2026-03-08', 'Pendente', 'Ativo vencido com impacto operacional.'),
  ('OPP-9002', '11111111-1111-4111-8111-111111111111', 'CONN-1029', 'Mina Norte', 'Inspecao Anual', 'Media', '2026-03-20', 'Aberta', null),
  ('OPP-9003', '22222222-2222-4222-8222-222222222222', 'MANG-8821', 'Usina 2', 'Teste de Estanqueidade', 'Alta', '2026-03-07', 'Pendente', 'Equipamento ja expirado.'),
  ('OPP-9004', '33333333-3333-4333-8333-333333333333', 'MANG-2210', 'Polo Industrial', 'Recalibracao de sensores', 'Baixa', '2026-04-10', 'Agendada', null)
on conflict (id) do update
set
  company_id = excluded.company_id,
  equipment_id = excluded.equipment_id,
  unit = excluded.unit,
  service = excluded.service,
  urgency = excluded.urgency,
  deadline = excluded.deadline,
  status = excluded.status,
  notes = excluded.notes;

insert into public.inspections (id, equipment_id, inspected_at, inspector, result, notes, status)
values
  ('INSP-1001', 'MANG-7742', '2026-02-28', 'Ricardo Silva', 'Reprovado', 'Desgaste de malha externa.', 'Pendente de acao'),
  ('INSP-1002', 'CONN-1029', '2026-03-01', 'Ana Souza', 'Aprovado', 'Sem vazamentos.', 'Concluida'),
  ('INSP-1003', 'MANG-8821', '2026-02-20', 'Marcos Oliveira', 'Reprovado', 'Pressao acima do limite em teste.', 'Pendente de acao')
on conflict (id) do update
set
  equipment_id = excluded.equipment_id,
  inspected_at = excluded.inspected_at,
  inspector = excluded.inspector,
  result = excluded.result,
  notes = excluded.notes,
  status = excluded.status;

insert into public.maintenances (id, equipment_id, maintenance_type, scheduled_for, status, cost, technician, notes)
values
  ('MAN-220', 'MANG-7742', 'Preventiva', '2026-03-11', 'Agendada', 950.00, 'Equipe Alfa', 'Troca completa recomendada.'),
  ('MAN-218', 'CONN-1029', 'Corretiva', '2026-03-08', 'Em andamento', 450.00, 'Equipe Beta', 'Ajuste de vedacao.'),
  ('MAN-215', 'MANG-8821', 'Preventiva', '2026-03-02', 'Concluida', 620.00, 'Equipe Gama', null)
on conflict (id) do update
set
  equipment_id = excluded.equipment_id,
  maintenance_type = excluded.maintenance_type,
  scheduled_for = excluded.scheduled_for,
  status = excluded.status,
  cost = excluded.cost,
  technician = excluded.technician,
  notes = excluded.notes;
