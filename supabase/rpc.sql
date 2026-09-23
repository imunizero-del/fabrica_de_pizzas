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
