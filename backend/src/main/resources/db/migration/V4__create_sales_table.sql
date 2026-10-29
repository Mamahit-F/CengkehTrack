-- V4: Buat tabel sales (satuan: LITER)
-- total_price dihitung oleh backend: quantity_liters * price_per_liter
CREATE TABLE sales (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    garden_id       BIGINT          REFERENCES gardens(id) ON DELETE SET NULL,
    sale_date       DATE            NOT NULL,
    buyer_name      VARCHAR(150),
    quantity_liters NUMERIC(12, 3)  NOT NULL CHECK (quantity_liters > 0),
    price_per_liter NUMERIC(15, 2)  NOT NULL CHECK (price_per_liter >= 0),
    total_price     NUMERIC(18, 2)  NOT NULL CHECK (total_price >= 0),
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sales_user_id    ON sales(user_id);
CREATE INDEX idx_sales_garden_id  ON sales(garden_id);
CREATE INDEX idx_sales_date       ON sales(sale_date);
