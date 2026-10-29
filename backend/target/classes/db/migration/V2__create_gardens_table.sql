-- V2: Buat tabel gardens
CREATE TABLE gardens (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(150)    NOT NULL,
    location        VARCHAR(255),
    area_hectares   NUMERIC(10, 4)  NOT NULL,
    tree_count      INTEGER,
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gardens_user_id ON gardens(user_id);
