-- SCRIPT DE TESTE DE CONCORRÊNCIA PARA A RPC create_booking
-- Como o Supabase/PostgreSQL bloqueia a linha usando FOR UPDATE, 
-- a segunda transação irá aguardar a primeira terminar.
-- Se a primeira transação consumir a última vaga, a segunda lançará EXCEPTION 'INSUFFICIENT_CAPACITY'.

-- Preparação de Cenário:
/*
INSERT INTO schedule_dates (schedule_date, is_open) VALUES ('2026-10-10', true) RETURNING id;
-- Suponha id = 'd-uuid'

INSERT INTO time_slots (date_id, schedule_time, capacity_mode, capacity_limit, reserved_capacity) 
VALUES ('d-uuid', '19:00:00', 'orders', 1, 0) RETURNING id;
-- Suponha id = 'slot-uuid' (Capacidade 1)

INSERT INTO combos (name, pizza_quantity, price) VALUES ('Combo 50', 50, 100) RETURNING id;
-- Suponha id = 'combo-uuid'
*/

-- Execução Concorrente (Para testar de verdade, abra DUAS sessões no psql ou DBeaver)

-- Sessão 1:
/*
BEGIN;
SELECT create_booking(
    gen_random_uuid(), 'Cliente 1', '5511999999999', '', 'slot-uuid', 'combo-uuid', 1
);
-- NÃO FAÇA COMMIT AINDA
*/

-- Sessão 2:
/*
BEGIN;
-- Esta chamada ficará "pendurada" aguardando a Sessão 1
SELECT create_booking(
    gen_random_uuid(), 'Cliente 2', '5511999999999', '', 'slot-uuid', 'combo-uuid', 1
);
*/

-- Voltando para Sessão 1:
/*
COMMIT;
*/

-- Resultado na Sessão 2:
-- Assim que o COMMIT da Sessão 1 rodar, a Sessão 2 acordará e falhará imediatamente com:
-- ERROR:  INSUFFICIENT_CAPACITY
-- 
-- Isso comprova que o banco é a fonte da verdade e o overbooking é evitado com segurança.
