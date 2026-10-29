-- V3: Buat tabel harvest_records (satuan: LITER)
CREATE TABLE harvest_records (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    garden_id       BIGINT          NOT NULL REFERENCES gardens(id) ON DELETE RESTRICT,
    harvest_date    DATE            NOT NULL,
    quantity_liters NUMERIC(12, 3)  NOT NULL CHECK (quantity_liters > 0),
    quality_grade   VARCHAR(20),
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_harvest_records_user_id    ON harvest_records(user_id);
CREATE INDEX idx_harvest_records_garden_id  ON harvest_records(garden_id);
CREATE INDEX idx_harvest_records_date       ON harvest_records(harvest_date);
