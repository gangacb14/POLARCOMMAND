import React, { createContext, useContext, useMemo, useEffect, useRef } from "react";
import { Language } from "./types";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: "IPE-LAMS",
    appSubTitle: "Integrated Polar Expedition Logistics & Asset Management System",
    ministry: "Ministry of Earth Sciences, Govt. of India",
    center: "National Centre for Polar and Ocean Research (NCPOR)",
    planner: "Mission Planner",
    mapTelemetry: "Map & Live Telemetry",
    assetCargo: "Assets & Cargo Manifest",
    inventory: "Cold-Chain Inventory",
    personnel: "Personnel Roster",
    incidents: "Emergency / SOS Desk",
    mobileFieldPwa: "Mobile Field PWA",
    docsAndSih: "SIH 2026 Presentation Hub",
    liveSatStatus: "Iridium SBD Live",
    stationMaitri: "Maitri (Antarctica)",
    stationBharati: "Bharati (Antarctica)",
    stationHimadri: "Himadri (Arctic)",
    highContrast: "High Contrast",
    normalContrast: "Standard UI",
    offlineMode: "Offline Field Mode",
    onlineMode: "Live Satellite Connected",
    syncQueue: "Sync Queue",
    triggerSos: "EMERGENCY SOS",
    activeExpeditions: "Active Expeditions",
    trackedAssets: "Tracked Assets",
    weatherAlerts: "Atmospheric & Blizzard Status",
    currentTemp: "Current Temperature",
    windChill: "Wind Chill Index",
    windSpeed: "Wind Velocity",
    seaIceConcentration: "Sea Ice Concentration",
    blizzardWarning: "BLIZZARD ADVISORY ACTIVE",
    nominalCondition: "Conditions Within Safe Limits",
    createExpedition: "Create New Mission",
    publishMission: "Publish & Mobilize",
    fuelAutonomy: "Days Autonomy",
    dieselRequired: "Diesel Required",
    crewSize: "Crew Personnel",
    chainOfCustody: "Chain of Custody",
    scanCargo: "Scan QR / RFID Tag",
    medicalFlags: "Medical Clearance (AES-256)",
    unmaskMedical: "Authorized Medical Decrypt",
    maskMedical: "Mask Record",
    reorderTriggered: "Reorder Triggered",
    expiringSoon: "Expiring within 30 days",
    exportReport: "Export Madrid Report",
    realDataSource: "Live WMO Polar Feed",
  },
  hi: {
    appTitle: "आईपीई-लैम्स",
    appSubTitle: "एकीकृत ध्रुवीय अभियान रसद एवं परिसंपत्ति प्रबंधन प्रणाली",
    ministry: "पृथ्वी विज्ञान मंत्रालय, भारत सरकार",
    center: "राष्ट्रीय ध्रुवीय एवं महासागर अनुसंधान केंद्र (NCPOR)",
    planner: "अभियान योजना",
    mapTelemetry: "मानचित्र एवं लाइव टेलीमेट्री",
    assetCargo: "परिसंपत्ति एवं कार्गो सूची",
    inventory: "कोल्ड-चेन इन्वेंटरी",
    personnel: "कार्मिक रोस्टर",
    incidents: "आपातकालीन / एसओएस डेस्क",
    mobileFieldPwa: "मोबाइल फील्ड PWA",
    docsAndSih: "SIH 2026 प्रस्तुति केंद्र",
    liveSatStatus: "इरिडियम एसबीडी लाइव",
    stationMaitri: "मैत्री (अंटार्कटिका)",
    stationBharati: "भारती (अंटार्कटिका)",
    stationHimadri: "हिमाद्री (आर्कटिक)",
    highContrast: "उच्च कंट्रास्ट",
    normalContrast: "मानक यूआई",
    offlineMode: "ऑफलाइन फील्ड मोड",
    onlineMode: "लाइव उपग्रह संपर्क",
    syncQueue: "सिंक कतार",
    triggerSos: "आपातकालीन एसओएस (SOS)",
    activeExpeditions: "सक्रिय अभियान",
    trackedAssets: "ट्रैक की जा रही संपत्तियां",
    weatherAlerts: "वायुमंडलीय एवं बर्फ़ीला तूफ़ान स्थिति",
    currentTemp: "वर्तमान तापमान",
    windChill: "विंड चिल इंडेक्स",
    windSpeed: "हवा की गति",
    seaIceConcentration: "समुद्री बर्फ सघनता",
    blizzardWarning: "बर्फ़ीला तूफ़ान चेतावनी सक्रिय",
    nominalCondition: "परिस्थितियां सामान्य सीमा में",
    createExpedition: "नया अभियान बनाएं",
    publishMission: "अभियान प्रकाशित करें",
    fuelAutonomy: "ईंधन स्वायत्तता दिन",
    dieselRequired: "आवश्यक डीजल",
    crewSize: "दल आकार",
    chainOfCustody: "कस्टडी श्रृंखला",
    scanCargo: "क्यूआर / आरएफआईडी स्कैन करें",
    medicalFlags: "चिकित्सा मंजूरी (एईएस-256)",
    unmaskMedical: "अधिकृत मेडिकल डिक्रिप्ट",
    maskMedical: "रिकॉर्ड छिपाएं",
    reorderTriggered: "पुनः ऑर्डर आवश्यक",
    expiringSoon: "30 दिनों में समाप्त",
    exportReport: "मैड्रिड रिपोर्ट निर्यात करें",
    realDataSource: "लाइव WMO ध्रुवीय डेटा",
  },
};

// Comprehensive Exact Phrase Dictionary for whole-application Hindi translation
export const PHRASE_MAP_HI: Record<string, string> = {
  // Navigation & Tabs
  "MISSION CONTROL": "मिशन नियंत्रण",
  "DISASTER DASHBOARD": "आपदा डैशबोर्ड",
  "3D GIS & DEM": "3D जीआईएस एवं डीईएम",
  "WORLD MAP": "विश्व मानचित्र",
  "RESET / 3D VIEW": "रीसेट / 3D दृश्य",
  "INCIDENTS & CITIZENS": "घटनाएं एवं नागरिक रिपोर्ट",
  "MCDA & ML ANALYTICS": "एमसीडीए एवं मशीन लर्निंग एनालिटिक्स",
  "DIGITAL TWIN": "डिजिटल ट्विन",
  "EXPEDITIONS": "ध्रुवीय अभियान",
  "CARGO PASSPORT": "कार्गो पासपोर्ट",
  "RESOURCE INTEL": "संसाधन खुफिया",
  "PERSONNEL": "कार्मिक सुरक्षा",
  "ROUTE INTEL": "मार्ग खुफिया",
  "WEATHER IMPACT": "मौसम प्रभाव इंजन",
  "SIMULATOR": "सिम्युलेटर (व्हाट-इफ)",
  "EMERGENCY COMMAND": "आपातकालीन कमान",
  "AI COPILOT": "एआई सह-पायलट",
  "INVENTORY": "इन्वेंटरी स्टॉक",
  "REPORTS": "दस्तावेज़ एवं रिपोर्ट",
  "15-STEP STORY DEMO": "15-चरणीय कहानी डेमो",
  "60-SEC MORNING BRIEF": "60-सेकंड कमांडर ब्रीफ",
  "Quick QR Scan": "त्वरित क्यूआर स्कैन",
  "DISASTER & EXPEDITIONS HQ": "आपदा एवं अभियान मुख्यालय",
  "All 5 Continental Nodes Telemetry Online": "सभी 5 महाद्वीपीय नोड्स टेलीमेट्री ऑनलाइन",
  "Polar Expedition Digital Twin & Mission Intelligence": "ध्रुवीय अभियान डिजिटल ट्विन एवं मिशन इंटेलिजेंस",
  "Autonomous situational awareness integrating geospatial digital twins, real-time burn-rate forecasting, multi-stage expedition timelines, and predictive AI emergency decision support.": "भू-स्थानिक डिजिटल ट्विन, रीयल-टाइम ईंधन खपत पूर्वानुमान, बहु-चरणीय अभियान समयसीमा और पूर्वानुमानित एआई आपातकालीन निर्णय सहायता को एकीकृत करने वाली स्वायत्त स्थितिजन्य जागरूकता।",
  "60-Sec Brief": "60-सेकंड ब्रीफ",
  "What-If Simulator": "व्हाट-इफ सिम्युलेटर",
  "Full Story Demo": "पूर्ण स्टोरी डेमो",
  "Station:": "स्टेशन:",
  "Pastel": "पेस्टेल",
  "Dark": "डार्क",
  "HQ Command": "मुख्यालय कमान",
  "Field PWA": "फील्ड PWA",
  "Commander (Admin)": "कमांडर (प्रशासक)",
  "Disaster Manager": "आपदा प्रबंधक",
  "Field Scout": "फील्ड स्काउट",
  "Citizen / Public": "नागरिक / जनता",
  "Current Dashboard State & Systems Telemetry": "वर्तमान डैशबोर्ड स्थिति एवं सिस्टम टेलीमेट्री",
  "Last Updated:": "अंतिम अद्यतन:",
  "Active Missions": "सक्रिय मिशन",
  "Tracked Fleet": "ट्रैक किया गया बेड़ा",
  "Online Assets": "ऑनलाइन संपत्तियां",
  "Expedition Crew": "अभियान दल",
  "100% Accounted": "100% उपस्थित",
  "Inventory Stock": "इन्वेंटरी स्टॉक",
  "Cold-Chain Nominal": "कोल्ड-चेन सामान्य",
  "Incident Record": "घटना रिकॉर्ड",
  "Resolved": "हल किया गया",
  "Active Alerts": "सक्रिय अलर्ट",
  "Live Weather": "लाइव मौसम",
  "Wind": "हवा",
  "Expedition Mission Reports & Documentation Hub": "अभियान मिशन रिपोर्ट एवं दस्तावेज़ीकरण केंद्र",
  "Automated regulatory compliance, Madrid Protocol certificates, telemetry audit logs, and commander situation dossiers.": "स्वचालित नियामक अनुपालन, मैड्रिड प्रोटोकॉल प्रमाणपत्र, टेलीमेट्री ऑडिट लॉग और कमांडर स्थिति डोजियर।",
  "Overall Dashboard Summary": "समग्र डैशबोर्ड सारांश",
  "Consolidated Operations & Systems Overview": "समेकित संचालन एवं सिस्टम अवलोकन",
  "Generate Official Dossier": "आधिकारिक डोजियर तैयार करें",
  "Export Dossier (PDF/JSON)": "डोजियर निर्यात करें (PDF/JSON)",
  "MADRID PROTOCOL COMPLIANCE": "मैड्रिड प्रोटोकॉल अनुपालन",
  "ASPA & Environmental Audit": "ASPA एवं पर्यावरण ऑडिट",
  "Environmental Protection Annex II (Conservation of Flora & Fauna) and Madrid Protocol Clean Site verified. Zero non-biodegradable waste left behind.": "पर्यावरण संरक्षण अनुलग्नक II और मैड्रिड प्रोटोकॉल स्वच्छ स्थल सत्यापित। शून्य गैर-बायोडिग्रेडेबल कचरा छोड़ा गया।",
  "View Comprehensive Audit →": "व्यापक ऑडिट देखें →",
  "OVERALL DASHBOARD SUMMARY": "समग्र डैशबोर्ड सारांश",
  "View Overall Summary →": "समग्र सारांश देखें →",
  "OFFLINE MOBILE PWA": "ऑफलाइन मोबाइल PWA",
  "Store & Forward Architecture": "स्टोर एवं फॉरवर्ड आर्किटेक्चर",
  "Iridium 9603 Short Burst Data (SBD) queue enables crew to check in, log medical incidents, and scan cargo even during total blackout.": "इरिडियम 9603 शॉर्ट बर्स्ट डेटा कतार चालक दल को पूर्ण ब्लैकआउट के दौरान भी चेक-इन, मेडिकल लॉग और कार्गो स्कैन करने में सक्षम बनाती है।",
  "Open Mobile PWA View →": "मोबाइल PWA दृश्य खोलें →",
  "Dismiss": "खारिज करें",
  "Synchronized": "सिंक्रनाइज़्ड",
  "Sync Now": "अभी सिंक करें",
  "Sync Status:": "सिंक स्थिति:",
  "Offline Cache Active": "ऑफलाइन कैश सक्रिय",
  "Syncing to MC...": "मिशन नियंत्रण को सिंक हो रहा है...",
  "Offline Action Store": "ऑफलाइन एक्शन स्टोर",
  "Offline Store Queue": "ऑफलाइन स्टोर कतार",
  "Offline-First Cache Status": "ऑफलाइन-प्रथम कैश स्थिति",
  "LAST SERVER SYNC": "अंतिम सर्वर सिंक",
  "TARGET SERVER": "लक्षित सर्वर",
  "Central Command": "केंद्रीय कमान",
  "Density Heatmap": "सघनता हीटमैप",
  "Traffic Corridors": "यातायात गलियारे",
  "High-Traffic Polar Corridors": "उच्च-यातायात ध्रुवीय गलियारे",
  "TRAFFIC DENSITY HEATMAP": "यातायात सघनता हीटमैप",
  "HISTORICAL": "ऐतिहासिक",
  "Intensity:": "तीव्रता:",
  "Coordinates": "निर्देशांक",
  "Sensor Temp": "सेंसर तापमान",
  "Battery Reserve": "बैटरी रिज़र्व",
  "Shock Sensor": "शॉक सेंसर",
  "Chain of Custody & RFID": "कस्टडी श्रृंखला एवं RFID",
  "Custodian:": "अभिरक्षक:",
  "Tag:": "टैग:",
  "Last verified:": "अंतिम सत्यापन:",
  "Madrid Protocol ASPA Check": "मैड्रिड प्रोटोकॉल ASPA जांच",
  "Traverse route compliant with Antarctic Treaty Environmental Annex II (Flora & Fauna Protection).": "अंटार्कटिक संधि पर्यावरण अनुलग्नक II (वनस्पति और जीव संरक्षण) के अनुरूप ट्रेवर्स मार्ग।",
  "No telemetry asset selected": "कोई टेलीमेट्री संपत्ति चयनित नहीं है",
  "Select an active vehicle or station from the fleet list below": "नीचे बेड़े की सूची से एक सक्रिय वाहन या स्टेशन चुनें",
  "STABLE": "स्थिर",
  "ATTENTION": "ध्यान दें",
  "HIGH RISK": "उच्च जोखिम",
  "CRITICAL": "गंभीर",
  "ACTIVE": "सक्रिय",
  "ALERT": "अलर्ट",
  "IN_STOCK": "स्टॉक में उपलब्ध",
  "LOW_STOCK": "कम स्टॉक",
  "EXPIRING_SOON": "जल्द समाप्त होने वाला",
  "CRITICAL_DEPLETED": "समाप्त",
  "CHECKED_IN": "उपस्थित (चेक-इन)",
  "FIELD_TRAVERSE": "फील्ड ट्रेवर्स पर",
  "OFFLINE": "ऑफलाइन",
  "MEDICAL_REST": "चिकित्सा आराम",
  "ESCALATED_L2": "स्तर 2 तक त्वरित",
  "ESCALATED_L3": "स्तर 3 तक त्वरित",
  "TRIGGERED": "सक्रिय",
  "Maitri Station": "मैत्री स्टेशन",
  "Bharati Station": "भारती स्टेशन",
  "Himadri Station": "हिमाद्री स्टेशन",
  "Prydz Bay Approach": "प्रिड्ज़ बे दृष्टिकोण",
  "Schirmacher Oasis": "शिरमाकर नखलिस्तान",
  "Ny-Ålesund": "नाय-एलेसुंड",
  "Svalbard": "स्वालबार्ड",
  "Antarctica": "अंटार्कटिका",
  "Arctic": "आर्कटिक",
  "Mission Health Index": "मिशन स्वास्थ्य सूचकांक",
  "Mission Operational State": "मिशन परिचालन स्थिति",
  "Continuous Multimodal Risk Index across Station Operations": "स्टेशन संचालन में निरंतर बहु-मॉडल जोखिम सूचकांक",
  "Autonomous Copilot": "स्वायत्त सह-पायलट",
  "Collapse Details": "विवरण समेटें",
  "View Risk Factors": "जोखिम कारक देखें",
  "Overall Mission Resilience Score": "समग्र मिशन लचीलापन स्कोर",
  "Live Risk Factors & Telemetry Signals": "लाइव जोखिम कारक एवं टेलीमेट्री संकेत",
  "Inventory Availability": "इन्वेंटरी उपलब्धता",
  "Personnel Safety": "कार्मिक सुरक्षा",
  "Weather Conditions": "मौसम की स्थिति",
  "Cargo Delays": "कार्गो विलंब",
  "Equipment Condition": "उपकरण की स्थिति",
  "Communication Status": "संचार स्थिति",
  "Resupply Timeline": "पुनः आपूर्ति समयरेखा",
  "Weight:": "भार:",
  "Quick Actions & Escalation Directives": "त्वरित कार्रवाइयां एवं एस्केलेशन निर्देश",
  "Simulate Emergency Supply Drop": "आपातकालीन आपूर्ति ड्रॉप का अनुकरण करें",
  "Reroute MV Vasiliy Golovnin": "एमवी वासिली गोलोवनिन का मार्ग बदलें",
  "Trigger Field Evacuation Protocol": "फील्ड निकासी प्रोटोकॉल शुरू करें",
  "Launch AI Autonomous Copilot": "एआई स्वायत्त सह-पायलट लॉन्च करें",
  "Quick Dispatch SOS": "त्वरित प्रेषण एसओएस",
  "Emergency Distress Call": "आपातकालीन संकट कॉल",
  "Field Operator Offline Cache": "फील्ड ऑपरेटर ऑफलाइन कैश",
  "Scan Cargo Container": "कार्गो कंटेनर स्कैन करें",
  "Personnel Daily Check-in": "कार्मिक दैनिक चेक-इन",
  "Transmit Emergency SOS": "आपातकालीन एसओएस प्रसारित करें",
  "Simulate Disconnect": "डिस्कनेक्ट अनुकरण",
  "Simulate Online": "ऑनलाइन अनुकरण",
  "Battery Level": "बैटरी स्तर",
  "Ambient Temp": "परिवेश तापमान",
  "GPS Coordinates": "जीपीएस निर्देशांक",
  "Select Incident Type": "घटना प्रकार चुनें",
  "Medical Emergency": "चिकित्सा आपातकाल",
  "Crevasse Accident": "दरार (क्रेवास) दुर्घटना",
  "Vehicle Breakdown": "वाहन खराबी",
  "Severe Frostbite": "गंभीर शीतदंश (फ़्रॉस्टबाइट)",
  "Whiteout Disorientation": "व्हाइटआउट दिशाभ्रम",
  "Submit Incident Report": "घटना रिपोर्ट सबमिट करें",
  "View Queued Actions": "कतारबद्ध क्रियाएं देखें",
  "Clear Offline Queue": "ऑफलाइन कतार साफ़ करें",
  "Sync All Packets": "सभी पैकेट सिंक करें",
  "Official Mission Dossier": "आधिकारिक मिशन डोजियर",
  "Executive Summary": "कार्यकारी सारांश",
  "Environmental Compliance Certificate": "पर्यावरण अनुपालन प्रमाणपत्र",
  "Telemetry Logs & Chain of Custody": "टेलीमेट्री लॉग एवं कस्टडी श्रृंखला",
  "Print / Export PDF": "प्रिंट / PDF निर्यात करें",
  "Close": "बंद करें",
  "Back to HQ": "मुख्यालय पर वापस",
  "Step": "चरण",
  "Next Step": "अगला चरण",
  "Previous": "पिछला",
  "Restart Tour": "टूर पुनः प्रारंभ करें",
  "Skip Story": "स्टोरी छोड़ें",
  "Commander Morning Briefing": "कमांडर सुबह की ब्रीफिंग",
  "Key Operational Highlights": "प्रमुख परिचालन मुख्य बिंदु",
  "Immediate Directives": "तत्काल निर्देश",
  "Acknowledge & Dismiss": "स्वीकार करें एवं बंद करें",
  "Digital Twin 3D View": "डिजिटल ट्विन 3D दृश्य",
  "Traverse Corridor": "ट्रेवर्स गलियारा",
  "Telemetry Buffer": "टेलीमेट्री बफर",
  "Active Convoys": "सक्रिय काफिले",
  "Fuel Burn Rate": "ईंधन खपत दर",
  "Estimated Days Remaining": "अनुमानित शेष दिन",
  "Current Wind Speed": "वर्तमान हवा की गति",
  "Sea Ice Thickness": "समुद्री बर्फ की मोटाई",
  "Solar Radiation": "सौर विकिरण",
  "Atmospheric Pressure": "वायुमंडलीय दबाव",
  "Madrid Protocol Status": "मैड्रिड प्रोटोकॉल स्थिति",
  "ASPA No. 136 Status": "ASPA संख्या 136 स्थिति",
  "Compliant": "अनुपालन पूर्ण",
  "Protected Zone Monitored": "संरक्षित क्षेत्र निगरानी में",
  "Fleet Status": "बेड़े की स्थिति",
  "Snowcat Units": "स्नोकैट इकाइयां",
  "Research Vessels": "अनुसंधान जहाज",
  "Automated Stations": "स्वचालित स्टेशन",
  "Snowmobile Fleet": "स्नोमोबाइल बेड़ा",
  "Digital Cargo Passport": "डिजिटल कार्गो पासपोर्ट",
  "Tamper-evident cryptographically signed polar asset manifest": "छेड़छाड़-रोधी क्रिप्टोग्राफिक रूप से हस्ताक्षरित ध्रुवीय परिसंपत्ति सूची",
  "Live Temperature Profile": "लाइव तापमान प्रोफ़ाइल",
  "Shock & Vibration Telemetry": "शॉक एवं कंपन टेलीमेट्री",
  "Geofence & ASPA Boundaries": "जियोफ़ेंस एवं ASPA सीमाएं",
  "Blockchain Proof of Custody": "कस्टडी का ब्लॉकचेन प्रमाण",
  "Custodian Transfer Log": "अभिरक्षक हस्तांतरण लॉग",
  "Verify Certificate": "प्रमाणपत्र सत्यापित करें",
  "Multi-Hazard Dynamic Disaster Dashboard": "बहु-खतरा गतिशील आपदा डैशबोर्ड",
  "Real-time hazard telemetry, blizzard storm tracking, crevasse field proximity, and multi-station early warning system.": "रीयल-टाइम खतरा टेलीमेट्री, बर्फीला तूफान ट्रैकिंग, दरार क्षेत्र निकटता और बहु-स्टेशन प्रारंभिक चेतावनी प्रणाली।",
  "Hazard Level": "खतरा स्तर",
  "Storm Velocity": "तूफान वेग",
  "Visibility Range": "दृश्यता सीमा",
  "Active Shelters": "सक्रिय आश्रय",
  "Evacuation Routes": "निकासी मार्ग",
  "Early Warning Alerts": "प्रारंभिक चेतावनी अलर्ट",
  "3D GIS & Elevation Model": "3D जीआईएस एवं एलिवेशन मॉडल",
  "High-resolution digital elevation model with satellite terrain layers and ice sheet topography.": "उपग्रह इलाके परतों और बर्फ की चादर स्थलाकृति के साथ उच्च-रिज़ॉल्यूशन डिजिटल एलिवेशन मॉडल।",
  "Citizen & Field Scout Incident Reporting": "नागरिक एवं फील्ड स्काउट घटना रिपोर्टिंग",
  "Crowdsourced field observations, satellite SMS incident dispatch, and multi-agency response dispatch.": "क्राउडसोर्स्ड फील्ड अवलोकन, उपग्रह एसएमएस घटना प्रेषण, और बहु-एजेंसी प्रतिक्रिया प्रेषण।",
  "MCDA & AI Predictive Optimization Hub": "एमसीडीए एवं एआई प्रेडिक्टिव ऑप्टिमाइज़ेशन हब",
  "Multi-criteria decision analysis for route risk assessment, fuel efficiency, and emergency evacuation prioritization.": "मार्ग जोखिम मूल्यांकन, ईंधन दक्षता और आपातकालीन निकासी प्राथमिकता के लिए बहु-मानदंड निर्णय विश्लेषण।",
  "Expedition Mission Timeline": "अभियान मिशन समयरेखा",
  "Phase milestones, logistics mobilization, resupply windows, and return voyage schedules.": "चरण मील के पत्थर, रसद जुटाना, पुनः आपूर्ति खिड़कियां और वापसी यात्रा कार्यक्रम।",
  "Smart Resupply & Inventory Optimization": "स्मार्ट पुनः आपूर्ति एवं इन्वेंटरी अनुकूलन",
  "AI-driven consumable burn rate forecasts, automated reorder thresholds, and shelf-life monitoring.": "एआई-संचालित उपभोग्य खपत दर पूर्वानुमान, स्वचालित पुन: ऑर्डर सीमाएं और शेल्फ-लाइफ निगरानी।",
  "Personnel Safety & Biometric Twin": "कार्मिक सुरक्षा एवं बायोमेट्रिक ट्विन",
  "Real-time physiological telemetry, core body temperature, cold exposure duration, and emergency beacon status.": "रीयल-टाइम शारीरिक टेलीमेट्री, कोर शरीर का तापमान, ठंड के संपर्क की अवधि और आपातकालीन बीकन स्थिति।",
  "Polar AI Mission Copilot": "ध्रुवीय एआई मिशन सह-पायलट",
  "Intelligent autonomous reasoning engine for logistics queries, route contingency analysis, and operational directives.": "रसद प्रश्नों, मार्ग आकस्मिकता विश्लेषण और परिचालन निर्देशों के लिए बुद्धिमान स्वायत्त तर्क इंजन।",
  "Expedition What-If Scenario Simulator": "अभियान व्हाट-इफ परिदृश्य सिम्युलेटर",
  "Stress-test supply chains against extreme blizzard events, vehicle breakdowns, and extended isolation windows.": "अत्यधिक बर्फीले तूफान की घटनाओं, वाहन टूटने और विस्तारित अलगाव के खिलाफ आपूर्ति श्रृंखलाओं का तनाव-परीक्षण करें।",
  "Emergency Incident SOS Command": "आपातकालीन घटना एसओएस कमान",
  "Critical incident response room with automated SAR triage, nearest team dispatch, and medical evacuation workflow.": "स्वचालित एसएआर ट्राइएज, निकटतम टीम प्रेषण और चिकित्सा निकासी कार्यप्रवाह के साथ गंभीर घटना प्रतिक्रिया कक्ष।",
  "Weather Impact Intelligence Engine": "मौसम प्रभाव इंटेलिजेंस इंजन",
  "Meteorological radar, microclimate predictions, sea ice compaction modeling, and helicopter flight windows.": "मौसम संबंधी रडार, माइक्रॉक्लाइमेट पूर्वानुमान, समुद्री बर्फ संघनन मॉडलिंग और हेलीकॉप्टर उड़ान खिड़कियां।",
  "Cold-Chain & Warehouse Inventory": "कोल्ड-चेन एवं गोदाम इन्वेंटरी",
  "Stock monitoring for polar survival rations, specialized expedition fuel, critical spares, and medical supplies.": "ध्रुवीय उत्तरजीविता राशन, विशेष अभियान ईंधन, महत्वपूर्ण पुर्जों और चिकित्सा आपूर्ति के लिए स्टॉक निगरानी।",
  "SIH 062 Presentation Hub & Swagger Docs": "SIH 062 प्रस्तुति हब एवं स्वाइगर दस्तावेज़",
  "Technical architecture, database schema, REST API documentation, and satellite telemetry bridge specifications.": "तकनीकी वास्तुकला, डेटाबेस स्कीमा, रेस्ट एपीआई दस्तावेज़ीकरण और उपग्रह टेलीमेट्री ब्रिज विनिर्देश।",
};

// Word-level fallback translation map for single keywords
export const WORD_MAP_HI: Record<string, string> = {
  "Expedition": "अभियान",
  "Expeditions": "अभियान",
  "Mission": "मिशन",
  "Missions": "मिशन",
  "Asset": "संपत्ति",
  "Assets": "संपत्तियां",
  "Fleet": "बेड़ा",
  "Inventory": "इन्वेंटरी",
  "Personnel": "कार्मिक",
  "Crew": "दल",
  "Status": "स्थिति",
  "Live": "लाइव",
  "Telemetry": "टेलीमेट्री",
  "Weather": "मौसम",
  "Disaster": "आपदा",
  "Emergency": "आपातकाल",
  "Command": "कमान",
  "Overview": "अवलोकन",
  "Summary": "सारांश",
  "Report": "रिपोर्ट",
  "Reports": "रिपोर्ट्स",
  "Simulator": "सिम्युलेटर",
  "Analytics": "विश्लेषण",
  "Route": "मार्ग",
  "Routes": "मार्ग",
  "Resource": "संसाधन",
  "Resources": "संसाधन",
  "Passport": "पासपोर्ट",
  "Digital": "डिजिटल",
  "Twin": "ट्विन",
  "Twins": "ट्विन",
  "Health": "स्वास्थ्य",
  "Safe": "सुरक्षित",
  "Critical": "गंभीर",
  "Active": "सक्रिय",
  "Stable": "स्थिर",
  "Warning": "चेतावनी",
  "Alert": "अलर्ट",
  "Alerts": "अलर्ट",
  "Attention": "ध्यान दें",
  "Resolved": "हल किया गया",
  "Pending": "लंबित",
  "Offline": "ऑफलाइन",
  "Online": "ऑनलाइन",
  "Synchronized": "सिंक्रनाइज़्ड",
  "Sync": "सिंक",
  "Syncing": "सिंक हो रहा है",
  "Cache": "कैश",
  "PWA": "पीडब्ल्यूए",
  "Mobile": "मोबाइल",
  "Field": "फील्ड",
  "Station": "स्टेशन",
  "Stations": "स्टेशन",
  "Maitri": "मैत्री",
  "Bharati": "भारती",
  "Himadri": "हिमाद्री",
  "Antarctica": "अंटार्कटिका",
  "Arctic": "आर्कटिक",
  "Temperature": "तापमान",
  "Wind": "हवा",
  "Speed": "गति",
  "Pressure": "दबाव",
  "Fuel": "ईंधन",
  "Diesel": "डीजल",
  "Rations": "राशन",
  "Medical": "चिकित्सा",
  "Hospital": "अस्पताल",
  "Clinic": "क्लिनिक",
  "Doctor": "डॉक्टर",
  "Leader": "नेता / प्रमुख",
  "Officer": "अधिकारी",
  "Scientist": "वैज्ञानिक",
  "Engineer": "इंजीनियर",
  "Vehicle": "वाहन",
  "Vehicles": "वाहन",
  "Vessel": "जहाज",
  "Vessels": "जहाज",
  "Sledge": "स्लेज",
  "Container": "कंटेनर",
  "Containers": "कंटेनर",
  "Corridor": "गलियारा",
  "Corridors": "गलियारे",
  "Traffic": "यातायात",
  "Density": "सघनता",
  "Heatmap": "हीटमैप",
  "Pings": "पिंग्स",
  "Hotspot": "हॉटस्पॉट",
  "Hazard": "जोखिम / खतरा",
  "Hazards": "खतरे",
  "Crevasse": "क्रेवास (दरार)",
  "Ice": "बर्फ",
  "Blizzard": "बर्फ़ीला तूफ़ान",
  "Snow": "बर्फ",
  "Search": "खोजें",
  "Filter": "फ़िल्टर",
  "Filters": "फ़िल्टर",
  "All": "सभी",
  "Total": "कुल",
  "Days": "दिन",
  "Hours": "घंटे",
  "Minutes": "मिनट",
  "Seconds": "सेकंड",
  "Now": "अब",
  "Today": "आज",
  "Details": "विवरण",
  "View": "देखें",
  "Open": "खोलें",
  "Close": "बंद करें",
  "Save": "सहेजें",
  "Cancel": "रद्द करें",
  "Submit": "जमा करें",
  "Confirm": "पुष्टि करें",
  "Download": "डाउनलोड करें",
  "Export": "निर्यात करें",
  "Import": "आयात करें",
  "Print": "प्रिंट करें",
  "Settings": "सेटिंग्स",
  "Help": "सहायता",
  "Docs": "दस्तावेज़",
  "Hub": "हब",
  "Security": "सुरक्षा",
  "Protocol": "प्रोटोकॉल",
  "Clearance": "मंजूरी",
  "Check-in": "चेक-इन",
  "Checkin": "चेक-इन",
  "Battery": "बैटरी",
  "Coordinates": "निर्देशांक",
  "Latitude": "अक्षांश",
  "Longitude": "देशांतर",
  "Altitude": "ऊंचाई",
  "Elevation": "ऊंचाई",
  "Satellite": "उपग्रह",
  "Iridium": "इरिडियम",
  "Signal": "सिग्नल",
  "Strength": "क्षमता",
  "Connected": "जुड़ा हुआ",
  "Disconnected": "डिस्कनेक्ट",
  "Autonomous": "स्वायत्त",
  "Copilot": "सह-पायलट",
  "Decision": "निर्णय",
  "Evacuation": "निकासी",
  "Rescue": "बचाव",
  "Incident": "घटना",
  "Incidents": "घटनाएं",
  "Citizen": "नागरिक",
  "Citizens": "नागरिक",
  "Public": "जनता",
  "Admin": "प्रशासक",
  "Commander": "कमांडर",
  "Manager": "प्रबंधक",
  "Scout": "स्काउट",
  "Staff": "कर्मचारी / सदस्य",
  "Members": "सदस्य",
  "Member": "सदस्य",
  "Tier": "स्तर",
  "Level": "स्तर",
  "Low": "कम",
  "Medium": "मध्यम",
  "High": "उच्च",
  "Extreme": "अत्यधिक",
  "Nominal": "सामान्य",
  "Normal": "सामान्य",
  "Optimal": "इष्टतम",
  "Good": "उत्कृष्ट",
  "Warning:": "चेतावनी:",
  "Alert:": "अलर्ट:",
  "Note:": "नोट:",
  "Success": "सफल",
  "Failed": "विफल",
  "Error": "त्रुटि",
  "Ready": "तैयार",
  "Standby": "स्टैंडबाय",
  "Deploy": "तैनात करें",
  "Deployed": "तैनात",
  "Mobilize": "गतिशील करें",
  "Mobilized": "गतिशील",
  "Forecast": "पूर्वानुमान",
  "Simulation": "अनुकरण",
  "Simulate": "अनुकरण करें",
  "Simulated": "अनुकरणित",
  "Resupply": "पुनः आपूर्ति",
  "Supply": "आपूर्ति",
  "Supplies": "आपूर्ति",
  "Chain": "श्रृंखला",
  "Custody": "कस्टडी",
  "Seal": "सील",
  "Sealed": "सील बंद",
  "Verify": "सत्यापित करें",
  "Verified": "सत्यापित",
  "Unverified": "असत्यापित",
  "Audit": "ऑडिट",
  "Compliance": "अनुपालन",
  "Compliant": "अनुपालित",
  "Environmental": "पर्यावरणीय",
  "Protection": "संरक्षण",
  "Protected": "संरक्षित",
  "Zone": "क्षेत्र",
  "Zones": "क्षेत्र",
  "Sector": "सेक्टर",
  "Sectors": "सेक्टर",
  "Region": "क्षेत्र",
  "Regions": "क्षेत्र",
  "Terrain": "इलाका / भूभाग",
  "Glacier": "हिमनद (ग्लेशियर)",
  "Iceberg": "हिमशैल",
  "Ocean": "महासागर",
  "Sea": "समुद्र",
  "Bay": "खाड़ी",
  "Hill": "पहाड़ी",
  "Hills": "पहाड़ियां",
  "Valley": "घाटी",
  "Ridge": "कटक",
  "Runway": "रनवे",
  "Airport": "हवाई अड्डा",
  "Helipad": "हेलीपैड",
  "Air": "हवाई",
  "Ground": "जमीनी",
  "Marine": "समुद्री",
  "Traverse": "ट्रेवर्स (सफर)",
  "Distance": "दूरी",
  "Duration": "अवधि",
  "Estimated": "अनुमानित",
  "Remaining": "शेष",
  "Used": "प्रयुक्त",
  "Available": "उपलब्ध",
  "Unavailable": "अनुपलब्ध",
  "Capacity": "क्षमता",
  "Volume": "मात्रा",
  "Weight": "भार",
  "Quantity": "मात्रा",
  "Stock": "स्टॉक",
  "Storage": "भंडारण",
  "Depot": "डिपो",
  "Warehouse": "गोदाम",
  "Replenish": "पुनर्पूर्ति",
  "Replenished": "पुनर्पूरित",
  "Threshold": "सीमा",
  "Limit": "सीमा",
  "Expiry": "समाप्ति",
  "Expired": "समाप्त",
  "Batch": "बैच",
  "Lot": "लॉट",
  "SKU": "एसकेयू",
  "QR": "क्यूआर",
  "RFID": "आरएफआईडी",
  "Barcode": "बारकोड",
  "Sensor": "सेंसर",
  "Sensors": "सेंसर",
  "Shock": "शॉक",
  "Vibration": "कंपन",
  "Humidity": "आर्द्रता",
  "Radiation": "विकिरण",
  "Solar": "सौर",
  "Windchill": "विंडचिल",
  "Chill": "ठंडक",
  "Frostbite": "शीतदंश",
  "Hypothermia": "हाइपोथर्मिया",
  "Oxygen": "ऑक्सीजन",
  "Pulse": "नाड़ी",
  "Heart": "हृदय",
  "Rate": "दर",
  "Score": "स्कोर",
  "Index": "सूचकांक",
  "Resilience": "लचीलापन",
  "Risk": "जोखिम",
  "Risks": "जोखिम",
  "Factor": "कारक",
  "Factors": "कारक",
  "Impact": "प्रभाव",
  "Engine": "इंजन",
  "Module": "मॉड्यूल",
  "Step-by-step": "चरण-दर-चरण",
  "Tour": "टूर",
  "Guide": "मार्गदर्शिका",
  "Briefing": "ब्रीफिंग",
  "Brief": "संक्षिप्त",
  "Dossier": "डोजियर",
  "Document": "दस्तावेज़",
  "Documents": "दस्तावेज़",
  "Certificate": "प्रमाणपत्र",
  "Certificates": "प्रमाणपत्र",
  "Official": "आधिकारिक",
  "Government": "सरकार",
  "Ministry": "मंत्रालय",
  "National": "राष्ट्रीय",
  "Centre": "केंद्र",
  "Research": "अनुसंधान",
  "Science": "विज्ञान",
  "Scientific": "वैज्ञानिक",
  "Indian": "भारतीय",
  "India": "भारत",
};

// Build Reverse Map from Hindi to English
export const REVERSE_MAP_HI_TO_EN: Record<string, string> = {};

// Populate reverse translations from base table
Object.entries(translations.hi).forEach(([key, hiVal]) => {
  const enVal = translations.en[key];
  if (enVal && hiVal) {
    REVERSE_MAP_HI_TO_EN[hiVal.trim()] = enVal;
  }
});

// Populate reverse translations from phrases
Object.entries(PHRASE_MAP_HI).forEach(([enKey, hiVal]) => {
  if (enKey && hiVal) {
    REVERSE_MAP_HI_TO_EN[hiVal.trim()] = enKey;
  }
});

// Populate reverse translations from single words
Object.entries(WORD_MAP_HI).forEach(([enWord, hiWord]) => {
  if (enWord && hiWord) {
    REVERSE_MAP_HI_TO_EN[hiWord.trim()] = enWord;
  }
});

/**
 * Universal text translation helper to English
 */
export function translateToEnglish(text: string): string {
  if (!text || typeof text !== "string") return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Direct exact lookup
  if (REVERSE_MAP_HI_TO_EN[trimmed]) {
    return REVERSE_MAP_HI_TO_EN[trimmed];
  }

  // 2. Case-insensitive / trimmed lookup
  const lower = trimmed.toLowerCase();
  for (const [hiKey, enVal] of Object.entries(REVERSE_MAP_HI_TO_EN)) {
    if (hiKey.toLowerCase() === lower) {
      return enVal;
    }
  }

  // 3. Multi-word phrase replacement sorted by length descending
  let result = trimmed;
  let changed = false;

  const reverseEntries = Object.entries(REVERSE_MAP_HI_TO_EN).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [hiKey, enVal] of reverseEntries) {
    if (result.includes(hiKey) && hiKey.length > 1) {
      result = result.replaceAll(hiKey, enVal);
      changed = true;
    }
  }

  if (changed) return result;
  return text;
}

/**
 * Universal text translation helper
 */
export function translate(text: string, lang: Language = "en"): string {
  if (!text || typeof text !== "string") return text;
  
  if (lang === "en") {
    // If string has Devanagari Hindi characters, translate back to original English
    if (/[\u0900-\u097F]/.test(text)) {
      return translateToEnglish(text);
    }
    return text;
  }

  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Exact key in base translation table
  if (translations.hi[trimmed]) {
    return translations.hi[trimmed];
  }

  // 2. Exact match in phrase map
  if (PHRASE_MAP_HI[trimmed]) {
    return PHRASE_MAP_HI[trimmed];
  }

  // 3. Exact case-insensitive match in phrase map
  const lower = trimmed.toLowerCase();
  for (const [enKey, hiVal] of Object.entries(PHRASE_MAP_HI)) {
    if (enKey.toLowerCase() === lower) {
      return hiVal;
    }
  }

  // 4. Word-level lookup for single words
  if (WORD_MAP_HI[trimmed]) {
    return WORD_MAP_HI[trimmed];
  }

  // 5. Look for matching prefix or phrase replacements in long text
  let result = trimmed;
  let changed = false;

  // Sort phrases by length descending to replace larger multi-word sequences first
  const phraseEntries = Object.entries(PHRASE_MAP_HI).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [enKey, hiVal] of phraseEntries) {
    if (result.includes(enKey) && enKey.length > 2) {
      result = result.replaceAll(enKey, hiVal);
      changed = true;
    }
  }

  // Sort word entries by length descending
  const wordEntries = Object.entries(WORD_MAP_HI).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [enWord, hiWord] of wordEntries) {
    const regex = new RegExp(`\\b${enWord}\\b`, "gi");
    if (regex.test(result)) {
      result = result.replace(regex, hiWord);
      changed = true;
    }
  }

  if (changed) return result;

  return text;
}

// React Context for Global Language
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: (text: string) => text,
});

export const I18nProvider: React.FC<{
  language: Language;
  setLanguage: (lang: Language) => void;
  children: React.ReactNode;
}> = ({ language, setLanguage, children }) => {
  const originalTextMapRef = useRef<WeakMap<Node, string>>(new WeakMap());

  const t = useMemo(() => {
    return (text: string) => translate(text, language);
  }, [language]);

  // Global Automatic DOM Tree Translator to guarantee full Hindi in hi mode and 100% pristine English in en mode
  useEffect(() => {
    const origMap = originalTextMapRef.current;

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        if (!text || !text.trim()) return;

        if (language === "hi") {
          let original = origMap.get(node);
          if (!original) {
            original = text;
            origMap.set(node, original);
          }
          const translated = translate(original, "hi");
          if (translated !== text) {
            node.nodeValue = translated;
          }
        } else if (language === "en") {
          const original = origMap.get(node);
          if (original && original !== text) {
            node.nodeValue = original;
          } else if (/[\u0900-\u097F]/.test(text)) {
            node.nodeValue = translateToEnglish(text);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toUpperCase();

        // Skip script, style, and code tags
        if (tagName === "SCRIPT" || tagName === "STYLE" || tagName === "CODE") {
          return;
        }

        // Translate button titles & tooltips
        if (el.title) {
          if (language === "hi") {
            const origTitle = el.getAttribute("data-orig-title") || el.title;
            el.setAttribute("data-orig-title", origTitle);
            el.title = translate(origTitle, "hi");
          } else {
            const origTitle = el.getAttribute("data-orig-title");
            if (origTitle) {
              el.title = origTitle;
            } else if (/[\u0900-\u097F]/.test(el.title)) {
              el.title = translateToEnglish(el.title);
            }
          }
        }

        // Translate placeholder
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          if (el.placeholder) {
            if (language === "hi") {
              const origPh = el.getAttribute("data-orig-placeholder") || el.placeholder;
              el.setAttribute("data-orig-placeholder", origPh);
              el.placeholder = translate(origPh, "hi");
            } else {
              const origPh = el.getAttribute("data-orig-placeholder");
              if (origPh) {
                el.placeholder = origPh;
              } else if (/[\u0900-\u097F]/.test(el.placeholder)) {
                el.placeholder = translateToEnglish(el.placeholder);
              }
            }
          }
        }

        // Recursively traverse child nodes
        for (let i = 0; i < el.childNodes.length; i++) {
          translateNode(el.childNodes[i]);
        }
      }
    };

    const rootElement = document.getElementById("root") || document.body;
    translateNode(rootElement);

    // MutationObserver to translate dynamic elements (like popups, modals, tabs)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          translateNode(node);
        });
      }
    });

    observer.observe(rootElement, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  return React.createElement(
    I18nContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useTranslation = () => {
  return useContext(I18nContext);
};
