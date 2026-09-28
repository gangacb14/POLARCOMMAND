-- ==============================================================================
-- IPE-LAMS: Integrated Polar Expedition Logistics and Asset Management System
-- Ministry of Earth Sciences (MoES) / National Centre for Polar & Ocean Research (NCPOR)
-- PostgreSQL 16+ with PostGIS 3.4 & TimescaleDB 2.14 Hypertable Extensibility
-- ==============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Definitions
CREATE TYPE expedition_status_enum AS ENUM ('PLANNING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'ABORTED');
CREATE TYPE polar_region_enum AS ENUM ('ANTARCTICA', 'ARCTIC', 'SOUTHERN_OCEAN', 'HIMALAYA_CRYOSPHERE');
CREATE TYPE base_station_enum AS ENUM ('MAITRI', 'BHARATI', 'HIMADRI', 'DAKSHIN_GANGOTRI_AWS', 'VESSEL_VASILIY_GOLOVNIN');
CREATE TYPE asset_category_enum AS ENUM ('VESSEL', 'SNOWCAT_PISTENBULLY', 'SNOWMOBILE', 'AWS_WEATHER_STATION', 'CARGO_SLEDGE', 'DRONE_UAV', 'HELICOPTER_KAMOV');
CREATE TYPE asset_condition_enum AS ENUM ('NOMINAL', 'MAINTENANCE_REQUIRED', 'ALERT_OVERHEATING', 'SUB_ZERO_CRITICAL', 'DECOMMISSIONED');
CREATE TYPE inventory_category_enum AS ENUM ('RATIONS_COLD_CHAIN', 'SURVIVAL_GEAR', 'MEDICAL_SUPPLIES', 'SPARE_PARTS', 'FUEL_LUBRICANTS', 'SCIENTIFIC_REAGENTS');
CREATE TYPE personnel_role_enum AS ENUM ('EXPEDITION_LEADER', 'POLAR_LOGISTICS_OFFICER', 'METEOROLOGIST', 'MEDICAL_DOCTOR', 'FIELD_ENGINEER', 'SCIENTIST', 'COMMUNICATIONS_SPECIALIST');
CREATE TYPE incident_severity_enum AS ENUM ('SOS_CRITICAL', 'HIGH_DANGER', 'MEDIUM_URGENT', 'LOW_ADVISORY');
CREATE TYPE incident_status_enum AS ENUM ('TRIGGERED', 'ESCALATED_L1_STATION', 'ESCALATED_L2_NCPOR', 'ESCALATED_L3_MOES', 'SAR_DEPLOYED', 'RESOLVED');
CREATE TYPE telemetry_source_enum AS ENUM ('IRIDIUM_SBD', 'CELLULAR_LTE', 'VHF_RADIO', 'MQTT_BROKER', 'REST_GATEWAY');

-- 1. Expeditions Table
CREATE TABLE expeditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    region polar_region_enum NOT NULL DEFAULT 'ANTARCTICA',
    base_station base_station_enum NOT NULL,
    leader_name VARCHAR(150) NOT NULL,
    crew_size INT NOT NULL CHECK (crew_size > 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status expedition_status_enum NOT NULL DEFAULT 'PLANNING',
    route_geom GEOMETRY(LineString, 4326),
    planned_diesel_liters NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    planned_jet_a1_liters NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    daily_burn_rate_liters NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    madrid_protocol_permit VARCHAR(100),
    aspa_clearance BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Assets & Mobile Polar Units
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category asset_category_enum NOT NULL,
    assigned_expedition_id UUID REFERENCES expeditions(id) ON DELETE SET NULL,
    current_holder VARCHAR(150),
    rfid_tag_id VARCHAR(100) UNIQUE,
    qr_code_id VARCHAR(100) UNIQUE,
    last_known_location GEOMETRY(Point, 4326),
    last_known_altitude_m NUMERIC(8, 2),
    last_telemetry_at TIMESTAMPTZ,
    condition_status asset_condition_enum DEFAULT 'NOMINAL',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Time-Series Telemetry Store (TimescaleDB Hypertable compatible)
CREATE TABLE asset_telemetry (
    id BIGSERIAL,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    altitude_m NUMERIC(8, 2),
    speed_kmh NUMERIC(6, 2) DEFAULT 0.0,
    heading_deg NUMERIC(5, 2) DEFAULT 0.0,
    temperature_c NUMERIC(5, 2) NOT NULL,
    battery_pct NUMERIC(5, 2) NOT NULL CHECK (battery_pct >= 0 AND battery_pct <= 100),
    shock_g NUMERIC(5, 2) DEFAULT 0.0,
    fuel_pct NUMERIC(5, 2) CHECK (fuel_pct >= 0 AND fuel_pct <= 100),
    source telemetry_source_enum NOT NULL DEFAULT 'IRIDIUM_SBD',
    raw_payload_hex TEXT,
    PRIMARY KEY (asset_id, recorded_at)
);

-- Convert to TimescaleDB hypertable if extension exists
-- SELECT create_hypertable('asset_telemetry', 'recorded_at', if_not_exists => TRUE);

-- 4. Inventory & Cold-Chain Store
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category inventory_category_enum NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    unit VARCHAR(50) NOT NULL,
    min_threshold NUMERIC(10, 2) NOT NULL DEFAULT 10.0,
    expiry_date DATE,
    storage_temp_min_c NUMERIC(5, 2),
    storage_temp_max_c NUMERIC(5, 2),
    batch_lot VARCHAR(100),
    storage_location VARCHAR(150),
    station base_station_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Personnel Roster & Medical Records
CREATE TABLE personnel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role personnel_role_enum NOT NULL,
    current_station base_station_enum NOT NULL,
    survival_qualification_valid_until DATE NOT NULL,
    medical_clearance_status VARCHAR(50) DEFAULT 'CLEARED',
    medical_notes_encrypted BYTEA, -- Encrypted using pgp_sym_encrypt with MoES Master Key
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(50),
    last_check_in_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    current_status VARCHAR(50) DEFAULT 'CHECKED_IN'
);

-- 6. Incidents & Emergency SOS Escalation
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_code VARCHAR(50) UNIQUE NOT NULL,
    expedition_id UUID REFERENCES expeditions(id) ON DELETE SET NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    personnel_id UUID REFERENCES personnel(id) ON DELETE SET NULL,
    severity incident_severity_enum NOT NULL DEFAULT 'SOS_CRITICAL',
    status incident_status_enum NOT NULL DEFAULT 'TRIGGERED',
    incident_location GEOMETRY(Point, 4326) NOT NULL,
    description TEXT NOT NULL,
    triggered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE incident_escalation_logs (
    id BIGSERIAL PRIMARY KEY,
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    tier_level VARCHAR(50) NOT NULL,
    notified_entity VARCHAR(150) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    dispatched_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    delivery_status VARCHAR(50) DEFAULT 'DISPATCHED'
);

-- 7. Chain of Custody Audit Log
CREATE TABLE chain_of_custody_events (
    id BIGSERIAL PRIMARY KEY,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'CHECK_IN', 'HANDOVER', 'VERIFICATION', 'DEPARTURE'
    operator_name VARCHAR(150) NOT NULL,
    station_or_coords VARCHAR(150) NOT NULL,
    rfid_or_qr_scanned VARCHAR(100),
    logged_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    client_offline_timestamp TIMESTAMPTZ
);

-- Indexes for high-speed spatial queries and telemetry time-series lookup
CREATE INDEX idx_expeditions_geom ON expeditions USING GIST (route_geom);
CREATE INDEX idx_assets_location ON assets USING GIST (last_known_location);
CREATE INDEX idx_telemetry_geom ON asset_telemetry USING GIST (location);
CREATE INDEX idx_telemetry_time ON asset_telemetry (recorded_at DESC);
CREATE INDEX idx_incidents_status ON incidents (status, severity);
CREATE INDEX idx_inventory_sku ON inventory_items (sku);
