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
