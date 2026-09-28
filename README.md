# 🏔️ IPE-LAMS & SIH 062: Integrated Polar Logistics & Multi-Hazard Decision Support System

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?logo=express)](https://expressjs.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-2.5_Flash-8e75ff.svg)](https://ai.google.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_First-5A0FC8.svg?logo=pwa)](https://web.dev/progressive-web-apps/)

> **Next-Generation Polar Expedition Logistics, Real-time Satellite Telemetry, 3D GIS Terrain Modeling, and Relocation & Disaster Decision Support Platform** designed for the **Ministry of Earth Sciences (MoES / NCPOR)** and **Smart India Hackathon (SIH 2026)**.

---

## 📑 Table of Contents

- [Executive Summary](#-executive-summary)
- [System Architecture](#-system-architecture)
- [Key Modules & Features](#-key-modules--features)
  - [1. 🗺️ 3D GIS Terrain Engine & Multi-Hazard Simulation (DEM)](#1-3d-gis-terrain-engine--multi-hazard-simulation-dem)
  - [2. 📊 Dynamic Disaster & Telemetry Dashboard](#2-dynamic-disaster--telemetry-dashboard)
  - [3. 🚨 Incident & Citizen Engagement Module](#3-incident--citizen-engagement-module)
  - [4. 🧠 Relocation Prioritization & Predictive Analytics Engine](#4-relocation-prioritization--predictive-analytics-engine)
  - [5. ❄️ Polar Mission Control & Cargo Chain-of-Custody](#5-polar-mission-control--cargo-chain-of-custody)
  - [6. 🤖 Polar AI Tactical Copilot & Policy Brief Generator](#6-polar-ai-tactical-copilot--policy-brief-generator)
  - [7. 📱 Offline PWA & Role-Based Access Control (RBAC)](#7-offline-pwa--role-based-access-control-rbac)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [Containerization & DevOps](#-containerization--devops)
  - [Docker & Docker Compose](#docker--docker-compose)
  - [Kubernetes & Helm Chart](#kubernetes--helm-chart)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [License & Acknowledgments](#-license--acknowledgments)

---

## 🚀 Executive Summary

Operating scientific expeditions in extreme cryospheric environments (Antarctica: Maitri & Bharati stations; Arctic: Himadri; Southern Ocean) and managing extreme multi-hazard climate emergencies (floods, glacial lake outburst floods [GLOFs], blizzards, calving events, flash surges) requires zero-latency operational intelligence, resilient offline data capture, and predictive decision support.

**IPE-LAMS / SIH 062** unifies:
1. **Real-time asset telemetry** over hybrid satellite uplinks (Iridium SBD, VHF, Cellular LTE).
2. **Digital Elevation Model (DEM) 3D simulation** with real-time flood inundation, rainfall surge modeling, and safe evacuation pathway routing.
3. **Citizen and field incident reporting** with GPS geotagging, verification queues, and mass alerting (SMS, WhatsApp, and emergency radio).
4. **Relocation Prioritization Matrix** computing multi-criteria vulnerability indexes (composite hazard risk, slope instability, population density, vulnerable demographics).
5. **Safe Shelter Carrying Capacity Calculator** calculating supply runway (water, MRE rations, bed occupancy, medical oxygen).
6. **Machine Learning Hazard Forecasting** providing forward-looking risk projections with statistical confidence intervals.

---

## 🏛️ System Architecture

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           IPE-LAMS / SIH 062 CLIENT (React 19 SPA + PWA)          │
├───────────────────┬───────────────────┬───────────────────┬───────────────────────┤
│ 3D GIS DEM Engine │ Telemetry Maps    │ Dynamic Dashboards│ Citizen / Field PWA   │
│ Inundation Sim    │ Satellite Tracking│ Resource Charts   │ Offline Sync Buffer   │
├───────────────────┴───────────────────┴───────────────────┴───────────────────────┤
│                       REST API / WebSocket / Gemini AI Client                      │
└─────────────────────────────────────────▲─────────────────────────────────────────┘
                                          │
┌─────────────────────────────────────────▼─────────────────────────────────────────┐
│                    NODE.JS EXPRESS FULL-STACK BACKEND (server.ts)                  │
├───────────────────────────────────────────────────────────────────────────────────┤
│ • Telemetry Parsing (Iridium SBD Binary, NMEA, MQTT Gateways)                     │
│ • Relocation Prioritization & Multi-Hazard Scoring Engine                         │
│ • Safe Haven Carrying Capacity & Supply Runway Calculators                        │
│ • Incident Dispatch, Verification, & Mass Broadcast Dispatcher                    │
│ • Gemini 2.5 Flash Tactical Analysis & Auto-Policy Brief Generator                │
├───────────────────────────────────────────────────────────────────────────────────┤
│                        In-Memory + PostgreSQL Engine (db/schema.sql)              │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Modules & Features

### 1. 🗺️ 3D GIS Terrain Engine & Multi-Hazard Simulation (DEM)
- **Digital Elevation Model (DEM) Renderer**: Real-time 3D interactive terrain mesh visualization with adjustable camera inclination, azimuth rotation, and elevation exaggeration.
- **Dynamic Inundation & Melt Simulation**: Interactive rainfall intensity sliders (0–250 mm/h) triggering real-time flood spread and hazard zone overlays.
- **Layer Controls**:
  - Rainfall Intensity Isohyets
  - Flood Inundation Zones (Low, Moderate, Catastrophic)
  - Evacuation Corridors with gradient slope ratings
  - High-ground Safe Shelters with real-time occupancy counts
  - Hazard Risk Heatmaps with normalized vulnerability scoring

### 2. 📊 Dynamic Disaster & Telemetry Dashboard
- **Hazard Frequency Line Chart**: Multi-variable historical and forecasted time-series analyzing blizzard events, calving shifts, glacial surge, and tidal crevassing.
- **Resource Allocation Stacked Bar Chart**: Logistics breakdown across food reserves, fuel (Jet A-1 / Arctic Diesel), medical equipment, and search & rescue (SAR) kits.
- **Population Vulnerability Donut Chart**: Demographic risk breakdown (Elderly & Children, Medical-Dependent, Isolated Homesteads, Stable Populations).
- **Theme Support**: Seamless switching between Tactical Dark and Crisp High-Contrast Government themes.

### 3. 🚨 Incident & Citizen Engagement Module
- **Citizen SOS & Incident Logging**: Quick submission of field incidents with automatic GPS geolocation, severity ranking, and photo simulation.
- **Mass Citizen Alert Dispatcher**: Trigger emergency advisory broadcasts via simulated multi-channel pipelines (SMS, WhatsApp, Satellite Sirens).
- **Relief Feedback Loop**: Real-time citizen satisfaction and supply delivery confirmation loop.
- **Verification Workflow**: Officers can review, verify, flag, or dispatch emergency response teams to crowdsourced reports.

### 4. 🧠 Relocation Prioritization & Predictive Analytics Engine
- **Settlement Relocation Matrix**: Automated scoring algorithm ranking at-risk villages/wards by combining:
  $$\text{Score} = w_1 \cdot \text{Hazard Risk} + w_2 \cdot \text{Slope Instability} + w_3 \cdot \text{Demographic Vulnerability} - w_4 \cdot \text{Road Access}$$
- **Carrying Capacity Calculator**: Computes safe haven capacity limits based on square footage, potable water liters/day, caloric requirements, and medical triage beds.
- **ML Hazard Forecast**: Time-horizon projection engine outputting probabilistic confidence bounds ($90\%\ \text{CI}$) for early evacuation triggers.
- **Automated Policy Brief Generator**: Generates comprehensive, NDMA-compliant executive disaster and relocation policy briefs formatted for decision-makers.

### 5. ❄️ Polar Mission Control & Cargo Chain-of-Custody
- **Mission Health Bar**: Mission uptime, communications link status, average crew bio-status, fuel endurance, and environmental severity metrics.
- **Cargo Passports**: Tamper-proof cryptographic hashes, QR-code verification, thermal tracking (-80°C cold-chain preservation), and shock-event logs.
- **Personnel Digital Twin**: Vital monitoring (body core temp, SpO2, heart rate variability, cold-stress fatigue indexes).
- **Smart Resupply Engine**: Predictive consumption forecasting accounting for thermal loss and storm delays.

### 6. 🤖 Polar AI Tactical Copilot & Policy Brief Generator
- Powered by the `@google/genai` SDK using `gemini-2.5-flash`.
- Generates real-time tactical routing recommendations, cold-weather contingency plans, and natural-language disaster assessments grounded in live operational state.

### 7. 📱 Offline PWA & Role-Based Access Control (RBAC)
- **Offline-First PWA**: Equipped with Service Worker (`public/sw.js`), Web App Manifest (`public/manifest.json`), and client-side transaction queue that syncs seamlessly when satellite or cellular connections recover.
- **RBAC Perspectives**: Switch between **Commander (Admin)**, **Disaster Response Officer**, **Field Scout**, and **Citizen / Public** views.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React, Recharts |
| **Visualization & 3D** | Canvas 3D DEM Engine, Interactive GIS Layers, SVG Terrain Projections |
| **Backend** | Node.js, Express 4.21, TypeScript (`tsx` execution, `esbuild` bundling) |
| **AI / LLM** | `@google/genai` (Gemini 2.5 Flash), Server-Side Secure API Proxies |
| **PWA & Offline** | Service Workers, Cache Storage API, LocalStorage Offline Mutation Queue |
| **DevOps & Containers**| Docker, Docker Compose, Kubernetes, Helm Charts |

---

## 📁 Project Directory Structure

```text
├── .env.example                  # Environment variables template
├── Dockerfile                    # Multi-stage production container build
├── docker-compose.yml            # Local microservices orchestration
├── db/
│   └── schema.sql                # PostgreSQL DDL for expeditions, telemetry, & disasters
├── docs/
│   ├── ERD.md                    # Entity Relationship Diagram & architecture spec
│   └── SATELLITE_IRIDIUM_ADAPTER.md # Iridium SBD binary parsing specifications
├── helm/
│   ├── Chart.yaml                # Kubernetes Helm chart metadata
│   └── values.yaml               # Helm deployment values & replica configurations
├── public/
│   ├── icon.svg                  # Vector application emblem
│   ├── manifest.json             # PWA Web App Manifest
│   └── sw.js                     # Service Worker for offline telemetry caching
├── server.ts                     # Express server & API endpoints
├── src/
│   ├── main.tsx                  # React DOM entry point
│   ├── App.tsx                   # Main orchestrator & tab routing
│   ├── types.ts                  # Comprehensive TypeScript interfaces
│   ├── i18n.ts                   # English / Hindi (हिन्दी) localization dictionaries
│   ├── index.css                 # Tailwind CSS styles & polar themes
│   ├── data/
│   │   └── mockPolarData.ts      # Seed data for expeditions, assets, & hazard zones
│   └── components/
│       ├── AnalyticsWowHub.tsx   # Relocation ranking, carrying capacity, ML forecasting
│       ├── AssetCargoView.tsx    # Cargo chain of custody & Cold-Chain tracker
│       ├── CargoPassportModal.tsx# Cryptographic cargo passport inspection
│       ├── CitizenIncidentModule.tsx # Citizen SOS, photo uploads, SMS/WhatsApp broadcast
│       ├── CommandNav.tsx        # High-accessibility tactical navigation bar
│       ├── DynamicDisasterDashboard.tsx # Interactive charts (Line, Bar, Donut)
│       ├── EmergencyCommandView.tsx # Red-alert crisis mode & SOS broadcaster
│       ├── ExpeditionSimulatorView.tsx # What-if polar traverse simulator
│       ├── Gis3dTerrainView.tsx  # 3D DEM interactive terrain & inundation engine
│       ├── Header.tsx            # Header with role switcher & offline sync indicator
│       ├── IncidentSosView.tsx   # Expedition incident management & quick triage
│       ├── InventoryView.tsx     # Station warehouse stocks & critical reserve alerts
│       ├── MapTelemetryView.tsx  # Geospatial satellite tracking & live route vector map
│       ├── MissionControlOverview.tsx # Real-time mission overview dashboard
│       ├── MissionHealthBar.tsx  # High-level mission KPI telemetry ticker
│       ├── MobileFieldPWAView.tsx# Field operator mobile view & satellite burst sync
│       ├── MorningBriefModal.tsx # Daily expedition commander briefing
│       ├── PersonnelDigitalTwinView.tsx # Biometric health & telemetry monitoring
│       ├── PersonnelRosterView.tsx # Crew rosters, qualifications, & medical records
│       ├── PlannerView.tsx       # Route waypoint planning & traverse logistics
│       ├── PolarAiCopilotView.tsx# Gemini-powered conversational expedition assistant
│       ├── PolarDigitalTwin.tsx  # Digital twin visualizer for polar vehicles/stations
│       ├── ResourceDigitalTwinView.tsx # Fuel, power, water, and life-support monitoring
│       ├── RouteIntelligenceView.tsx # Crevasse & katabatic wind avoidance router
│       ├── SihDocsModal.tsx      # SIH problem statement & compliance documentation
│       ├── SmartResupplyView.tsx # Resupply flight/ship scheduling & burn forecasts
│       ├── StoryDemoPlayer.tsx   # Interactive guided tour for judges & reviewers
│       └── WeatherImpactEngineView.tsx # Meteorological radar & wind-chill index engine
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm** or **bun**: `v10.x+` (npm) or `v1.1+` (bun)
- **Gemini API Key** *(Optional for AI Copilot)*: Obtain from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/polar-command-sih.git
   cd polar-command-sih
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Set the following variables:
```env
# Google Gemini API Key for AI Copilot and Executive Brief generation
GEMINI_API_KEY="your_google_gemini_api_key"

# Base Application URL
APP_URL="http://localhost:3000"
```

### Running the Application

#### Development Mode (with Hot Module Reloading & Full Express API):
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

#### Production Build:
```bash
npm run build
npm start
```

---

## 🐳 Containerization & DevOps

### Docker & Docker Compose

To build and run the container locally with Docker:

```bash
# Build image
docker build -t polar-command:latest .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY="your_key" polar-command:latest
```

Or using **Docker Compose**:
```bash
docker-compose up --build
```

### Kubernetes & Helm Chart

Deploy into a Kubernetes cluster using the provided Helm chart:

```bash
# Lint chart
helm lint ./helm

# Install chart
helm install polar-command ./helm --set env.geminiApiKey="your_key"
```

---

## 🔌 API Reference

### Telemetry & Satellite Uplinks
- `GET /api/telemetry` — Retrieve live telemetry stream for all deployed assets.
- `POST /api/telemetry/iridium-sbd` — Ingest raw binary/hex Iridium Short Burst Data packets.
- `GET /api/telemetry/:assetId` — Retrieve historical time-series telemetry for a specific asset.

### Expeditions & Cargo
- `GET /api/expeditions` — List all active, planning, and historical polar traverses.
- `GET /api/cargo-passport/:id` — Fetch cryptographic chain-of-custody passport with SHA-256 seal.
- `GET /api/inventory` — Station inventory reserves, burn rate projections, and critical threshold flags.

### Disaster Management & Relocation (SIH 062)
- `GET /api/disaster/hazard-feed` — Live multi-hazard telemetry (rainfall, flood level, wind speed, avalanche risk).
- `GET /api/analytics/relocation-priorities` — Priority ranking matrix for at-risk settlements/wards.
- `GET /api/analytics/carrying-capacity` — Safe shelter capacity calculations and supply runway.
- `GET /api/analytics/hazard-forecast` — Probabilistic hazard predictions with confidence intervals.
- `POST /api/citizen/incident` — Submit a citizen emergency report with GPS and photo.
- `POST /api/citizen/broadcast` — Dispatch mass emergency alerts (SMS, WhatsApp, Satellite).

### AI Copilot & Briefings
- `POST /api/ai/copilot` — Interactive conversational assistant for route planning & contingency.
- `POST /api/ai/policy-brief` — Generate an executive disaster management briefing document.

---

## 🗄️ Database Schema

The production SQL schema is defined in [`db/schema.sql`](./db/schema.sql) and includes:
- `expeditions`: Traverse plans, route GeoJSON, fuel reserves, and crew assignments.
- `assets`: Sledges, snowcats, UAVs, automatic weather stations (AWS), and containers.
- `telemetry_points`: High-frequency spatiotemporal coordinates, battery, temperature, and shock records.
- `inventory_items`: Station supplies, batch IDs, expiration dates, and cold-storage parameters.
- `incidents`: Severity classifications, geolocation coordinates, status, and resolution logs.
- `relocation_sites`: Candidate high-ground safe zones, elevation, water sources, and capacity.

---

## 📜 Compliance & Standards

- **MoES / NCPOR Guidelines**: Protocol compliance for Indian Antarctic Research Stations (Maitri & Bharati) and Arctic Station (Himadri).
- **NDMA Guidelines**: Aligned with the National Disaster Management Authority framework for Multi-Hazard Early Warning Systems (MHEWS).
- **ATCM Environmental Protocol**: Adherence to the Protocol on Environmental Protection to the Antarctic Treaty (Madrid Protocol).
- **WMO / IHO Standards**: Meteorological and sea ice classification formatting.

---

## 👥 Contributors & SIH 2026

Developed for the **Smart India Hackathon (SIH 2026)** — Ministry of Earth Sciences (MoES / NCPOR) Problem Statement.

*For questions, technical support, or deployment assistance, please submit an issue or contact the development team.*
