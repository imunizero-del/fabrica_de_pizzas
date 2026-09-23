-- FÁBRICA DE PIZZAS - SCHEMA E RLS

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELAS

-- Combos
CREATE TABLE combos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    pizza_quantity INTEGER NOT NULL CHECK (pizza_quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    promotional_price DECIMAL(10,2),
    badge TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sabores
CREATE TABLE flavors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Associação Combo <-> Sabores
CREATE TABLE combo_flavors (
    combo_id UUID REFERENCES combos(id) ON DELETE CASCADE,
    flavor_id UUID REFERENCES flavors(id) ON DELETE CASCADE,
    PRIMARY KEY (combo_id, flavor_id)
);

-- Datas de Agenda
CREATE TABLE schedule_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_date DATE UNIQUE NOT NULL,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Horários (Time Slots)
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_id UUID REFERENCES schedule_dates(id) ON DELETE CASCADE,
    schedule_time TIME NOT NULL,
    capacity_mode TEXT NOT NULL CHECK (capacity_mode IN ('orders', 'units')),
    capacity_limit INTEGER NOT NULL CHECK (capacity_limit > 0),
    reserved_capacity INTEGER DEFAULT 0 CHECK (reserved_capacity >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (date_id, schedule_time),
    -- Constraint crucial: Não permite overbooking a nível de banco
    CONSTRAINT capacity_check CHECK (reserved_capacity <= capacity_limit)
);

-- Pedidos (Orders)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idempotency_key UUID UNIQUE NOT NULL,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL,
    customer_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'in_production', 'ready', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'not_required'
        CHECK (payment_status IN ('not_required', 'pending', 'paid', 'failed', 'refunded', 'cancelled')),
    total DECIMAL(10,2) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    time_slot_id UUID REFERENCES time_slots(id) NOT NULL,
    capacity_consumed INTEGER NOT NULL CHECK (capacity_consumed > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do Pedido (Order Items - Snapshot)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    combo_id UUID REFERENCES combos(id),
    combo_name TEXT NOT NULL,
    unit_count INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sabores do Item
CREATE TABLE order_item_flavors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    flavor_name TEXT NOT NULL
);


-- 3. ROW LEVEL SECURITY (RLS)

-- Habilitar RLS em todas as tabelas
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_flavors ENABLE ROW LEVEL SECURITY;

-- Políticas Públicas (Leitura)
CREATE POLICY "Combos visíveis publicamente" ON combos FOR SELECT USING (is_active = true);
CREATE POLICY "Sabores visíveis publicamente" ON flavors FOR SELECT USING (is_active = true);
CREATE POLICY "Combo_flavors visíveis publicamente" ON combo_flavors FOR SELECT USING (true);
CREATE POLICY "Datas visíveis publicamente" ON schedule_dates FOR SELECT USING (is_open = true AND schedule_date >= CURRENT_DATE);
CREATE POLICY "Horários visíveis publicamente" ON time_slots FOR SELECT USING (is_active = true AND reserved_capacity < capacity_limit);

-- Políticas Administrativas (Usuários Autenticados têm ALL)
-- (Simplificado para o MVP: apenas usuários autenticados via Supabase Auth)
CREATE POLICY "Admin CRUD combos" ON combos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD flavors" ON flavors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD combo_flavors" ON combo_flavors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD schedule_dates" ON schedule_dates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD time_slots" ON time_slots FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD order_item_flavors" ON order_item_flavors FOR ALL USING (auth.role() = 'authenticated');

-- RPC para criação transacional de agendamentos
-- Garante segurança contra overbooking usando locks de linha

CREATE OR REPLACE FUNCTION create_booking(
    p_idempotency_key UUID,
    p_customer_name TEXT,
    p_customer_whatsapp TEXT,
    p_customer_notes TEXT,
    p_time_slot_id UUID,
    p_combo_id UUID,
    p_quantity INTEGER
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_slot RECORD;
    v_combo RECORD;
    v_date RECORD;
    v_consumed_capacity INTEGER;
    v_order_id UUID;
    v_order_number TEXT;
    v_total DECIMAL(10,2);
BEGIN
    -- 1. Lock no Time Slot
    SELECT * INTO v_slot 
    FROM time_slots 
    WHERE id = p_time_slot_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'TIME_SLOT_NOT_FOUND';
    END IF;

    IF NOT v_slot.is_active THEN
        RAISE EXCEPTION 'TIME_SLOT_INACTIVE';
    END IF;

    -- 2. Buscar Data
    SELECT * INTO v_date FROM schedule_dates WHERE id = v_slot.date_id;
    
    IF NOT FOUND OR NOT v_date.is_open THEN
        RAISE EXCEPTION 'DATE_NOT_AVAILABLE';
    END IF;

    -- 3. Buscar Combo
    SELECT * INTO v_combo FROM combos WHERE id = p_combo_id;

    IF NOT FOUND OR NOT v_combo.is_active THEN
        RAISE EXCEPTION 'COMBO_NOT_AVAILABLE';
    END IF;

    -- 4. Calcular Capacidade a Consumir
    IF v_slot.capacity_mode = 'orders' THEN
        v_consumed_capacity := p_quantity; -- 1 pedido = X combos = X de capacidade (ou apenas 1 dependendo da regra de negócio). Vamos assumir que capacity_mode=orders conta cada combo como 1 pedido, ou o pedido todo como 1. O user disse: "Quando capacity_mode = orders: cada pedido consome 1 unidade de capacidade".
        v_consumed_capacity := 1;
    ELSE
        -- units mode
        v_consumed_capacity := p_quantity * v_combo.pizza_quantity;
    END IF;

    -- 5. Validar Capacidade (Double check com o CHECK constraint do BD)
    IF v_slot.reserved_capacity + v_consumed_capacity > v_slot.capacity_limit THEN
        RAISE EXCEPTION 'INSUFFICIENT_CAPACITY';
    END IF;

    -- 6. Calcular Total
    v_total := COALESCE(v_combo.promotional_price, v_combo.price) * p_quantity;

    -- 7. Gerar Order Number (Ex: FP-1027)
    -- Simples sequência baseada no timestamp e um random ou sequencial
    v_order_number := 'FP-' || to_char(NOW(), 'YYMMDD') || '-' || lpad(floor(random() * 9999)::text, 4, '0');

    -- 8. Inserir Pedido
    INSERT INTO orders (
        idempotency_key, order_number, customer_name, customer_whatsapp, customer_notes,
        status, payment_status, total, scheduled_date, scheduled_time,
        time_slot_id, capacity_consumed
    ) VALUES (
        p_idempotency_key, v_order_number, p_customer_name, p_customer_whatsapp, p_customer_notes,
        'pending', 'not_required', v_total, v_date.schedule_date, v_slot.schedule_time,
        p_time_slot_id, v_consumed_capacity
    ) RETURNING id INTO v_order_id;

    -- 9. Inserir Item do Pedido
    INSERT INTO order_items (
        order_id, combo_id, combo_name, unit_count, quantity, unit_price, total
    ) VALUES (
        v_order_id, p_combo_id, v_combo.name, v_combo.pizza_quantity, p_quantity, 
        COALESCE(v_combo.promotional_price, v_combo.price), v_total
    );

    -- 10. Atualizar Capacidade Reservada do Horário
    UPDATE time_slots 
    SET reserved_capacity = reserved_capacity + v_consumed_capacity,
        updated_at = NOW()
    WHERE id = p_time_slot_id;

    RETURN json_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number
    );
EXCEPTION
    WHEN unique_violation THEN
        -- Provavelmente idempotency_key repetida
        RETURN json_build_object(
            'success', false,
            'error', 'DUPLICATE_ORDER',
            'message', 'Este pedido já foi processado.'
        );
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- RPC para cancelar agendamento e devolver capacidade
CREATE OR REPLACE FUNCTION cancel_booking(
    p_order_id UUID
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order RECORD;
BEGIN
    -- 1. Lock no Pedido
    SELECT * INTO v_order 
    FROM orders 
    WHERE id = p_order_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'ORDER_NOT_FOUND';
    END IF;

    -- Se já estiver cancelado, ignora
    IF v_order.status = 'cancelled' THEN
        RETURN json_build_object('success', true, 'message', 'Order already cancelled');
    END IF;

    -- 2. Atualizar Pedido
    UPDATE orders 
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = p_order_id;

    -- 3. Devolver Capacidade ao Horário
    UPDATE time_slots
    SET reserved_capacity = reserved_capacity - v_order.capacity_consumed,
        updated_at = NOW()
    WHERE id = v_order.time_slot_id;

    RETURN json_build_object('success', true);
END;
$$;

