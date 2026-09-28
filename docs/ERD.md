# IPE-LAMS Entity-Relationship Diagram (ERD)
**Ministry of Earth Sciences (MoES) & NCPOR Goa**
**System**: Integrated Polar Expedition Logistics and Asset Management System (SIH 2026)

```mermaid
erDiagram
    EXPEDITIONS ||--o{ ASSETS : allocates
    EXPEDITIONS ||--o{ INCIDENTS : associates
    EXPEDITIONS ||--o{ INVENTORY_ITEMS : consumes
    
    ASSETS ||--o{ ASSET_TELEMETRY : streams
    ASSETS ||--o{ CHAIN_OF_CUSTODY_EVENTS : tracks
    ASSETS ||--o{ INCIDENTS : triggers
    
    PERSONNEL ||--o{ INCIDENTS : reports
    PERSONNEL ||--o{ CHAIN_OF_CUSTODY_EVENTS : signs
    
    INCIDENTS ||--|{ INCIDENT_ESCALATION_LOGS : dispatches

    EXPEDITIONS {
        uuid id PK
        string code UK "e.g. 44-IAE-MAITRI"
        string name
        string region "ANTARCTICA | ARCTIC"
        string base_station "MAITRI | BHARATI | HIMADRI"
        int crew_size
        geometry route_geom "LineString 4326"
        numeric planned_diesel_liters
        numeric daily_burn_rate_liters
        string madrid_protocol_permit
        string status "ACTIVE | PLANNING"
    }

    ASSETS {
        uuid id PK
        string asset_code UK "e.g. PISTENBULLY-300-01"
        string name
        string category "VESSEL | PISTENBULLY | SNOWMOBILE | AWS"
        uuid assigned_expedition_id FK
        string current_holder
        string rfid_tag_id UK
        string qr_code_id UK
        geometry last_known_location "Point 4326"
        numeric last_known_altitude_m
        timestamptz last_telemetry_at
        string condition_status "NOMINAL | ALERT | CRITICAL"
    }

    ASSET_TELEMETRY {
        bigserial id PK
        uuid asset_id FK
        timestamptz recorded_at PK
        geometry location "Point 4326"
        numeric speed_kmh
        numeric heading_deg
        numeric temperature_c
        numeric battery_pct
        numeric shock_g
        numeric fuel_pct
        string source "IRIDIUM_SBD | MQTT | CELLULAR"
        text raw_payload_hex
    }

    INVENTORY_ITEMS {
        uuid id PK
        string sku UK "e.g. RAT-POLAR-PACK-A"
        string name
        string category "RATIONS | SURVIVAL | MEDICAL | FUEL"
        numeric quantity
        numeric min_threshold
        date expiry_date
        numeric storage_temp_min_c
        numeric storage_temp_max_c
        string batch_lot
        string station
    }

    PERSONNEL {
        uuid id PK
        string service_number UK "MoES-NCPOR-XXX"
        string full_name
        string role "LEADER | LOGISTICS | DOCTOR | SCIENTIST"
        string current_station
        date survival_qualification_valid_until
        string medical_clearance_status
        bytea medical_notes_encrypted "PGP AES-256 GCM"
        string emergency_contact_name
        string current_status "CHECKED_IN | FIELD_TRAVERSE"
    }

    INCIDENTS {
        uuid id PK
        string incident_code UK "SOS-ANT-2026-XXX"
        uuid expedition_id FK
        uuid asset_id FK
        uuid personnel_id FK
        string severity "SOS_CRITICAL | HIGH_DANGER"
        string status "TRIGGERED | ESCALATED_L2 | RESOLVED"
        geometry incident_location "Point 4326"
        text description
        timestamptz triggered_at
        timestamptz resolved_at
    }

    INCIDENT_ESCALATION_LOGS {
        bigserial id PK
        uuid incident_id FK
        string tier_level "L1_STATION | L2_NCPOR | L3_MOES"
        string notified_entity
        string channel "IRIDIUM_SBD | SMS | EMAIL"
        timestamptz dispatched_at
    }

    CHAIN_OF_CUSTODY_EVENTS {
        bigserial id PK
        uuid asset_id FK
        string action "CHECK_IN | HANDOVER | INSPECTION"
        string operator_name
        string rfid_or_qr_scanned
        timestamptz logged_at
    }
```

### Data Sovereignty & Madrid Protocol Guarantees
1. **Medical Records Encryption**: Stored in `personnel.medical_notes_encrypted` using PGP symmetric AES-256 GCM, ensuring personal medical records comply with international polar research privacy standards.
2. **Spatial Indexing**: All geospatial coordinates utilize PostGIS SRID 4326 with GIST indexes enabling fast distance queries between PistenBully traverse convoys and Antarctic Specially Protected Areas (ASPA).
3. **Time-Series Partitioning**: `asset_telemetry` table is partitioned by month or Timescale hypertable chunks to efficiently handle high-frequency telemetry ingest over satellite links.
