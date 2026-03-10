import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────

// ─── VIEWER-SPECIFIC TARGETS ───────────────────────────────────────────────────

const TARGETS_BY_VIEWER = {
  "RV-001": [
    { id: "TGT-0101", coords: "37°14'N 115°49'W", classification: "SCANATE // BEYOND STARGATE", description: "Area 51 / Groom Lake — classified flight test and research facility, Nevada", coordLabel: "COORDINATES" },
    { id: "TGT-0102", coords: "50°07'N 78°43'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Semipalatinsk Nuclear Test Site — Soviet underground facilities, Kazakhstan. Subject of a documented Stargate session by Pat Price", coordLabel: "COORDINATES" },
    { id: "TGT-0103", coords: "23°47'S 133°44'E", classification: "SCANATE // BEYOND STARGATE", description: "Pine Gap — joint CIA/NSA signals intelligence facility, Australia. One of the most classified installations on Earth", coordLabel: "COORDINATES" },
    { id: "TGT-0104", coords: "45°56'N 63°20'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Baikonur Cosmodrome — Soviet and Russian space and ballistic missile launch facility, Kazakhstan", coordLabel: "COORDINATES" },
    { id: "TGT-0105", coords: "38°44'N 104°51'W", classification: "GRILL FLAME", description: "Cheyenne Mountain Complex — NORAD underground command center, Colorado. Blast-hardened, built to survive nuclear strike", coordLabel: "COORDINATES" },
    { id: "TGT-0106", coords: "54°15'N 58°06'E", classification: "SCANATE // BEYOND STARGATE", description: "Yamantau Mountain — suspected massive underground bunker, Russia. Purpose officially denied. Scale unknown", coordLabel: "COORDINATES" },
    { id: "TGT-0107", coords: "33°43'N 51°44'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Natanz Nuclear Facility — uranium enrichment site, Iran. Primary centrifuge halls buried 8 metres underground", coordLabel: "COORDINATES" },
    { id: "TGT-0108", coords: "30°58'N 35°09'E", classification: "SCANATE // BEYOND STARGATE", description: "Dimona Nuclear Reactor — undeclared nuclear weapons programme site, Israel. Existence denied for decades", coordLabel: "COORDINATES" },
    { id: "TGT-0109", coords: "51°12'N 1°44'W", classification: "GRILL FLAME", description: "Porton Down — British chemical and biological defence research facility, UK. Active since 1916", coordLabel: "COORDINATES" },
    { id: "TGT-0110", coords: "39°06'N 76°46'W", classification: "CENTER LANE // THIRD EYE", description: "Fort Meade / NSA Headquarters — National Security Agency, Maryland. Largest intelligence employer in the US", coordLabel: "COORDINATES" },
    { id: "TGT-0111", coords: "54°00'N 1°41'W", classification: "GONDOLA WISH // DEEP BLACK", description: "Menwith Hill — largest NSA signals intelligence base outside the United States, UK. Intercepts global communications", coordLabel: "COORDINATES" },
    { id: "TGT-0112", coords: "48°34'N 46°18'E", classification: "SCANATE // BEYOND STARGATE", description: "Kapustin Yar — Soviet missile test site, Russia. Multiple credible UAP incidents on record dating from 1948", coordLabel: "COORDINATES" },
    { id: "TGT-0113", coords: "40°47'N 89°59'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Lop Nur Nuclear Test Site — 45 nuclear detonations conducted, China. Site now sealed and officially abandoned", coordLabel: "COORDINATES" },
    { id: "TGT-0114", coords: "62°23'N 145°09'W", classification: "CENTER LANE // THIRD EYE", description: "HAARP Facility — High-frequency Active Auroral Research Program, Alaska. Ionospheric research array, purpose widely disputed", coordLabel: "COORDINATES" },
    { id: "TGT-0115", coords: "40°11'N 113°17'W", classification: "GRILL FLAME", description: "Dugway Proving Ground — US biological and chemical weapons testing facility, Utah. Restricted zone larger than Rhode Island", coordLabel: "COORDINATES" },
    { id: "TGT-0116", coords: "39°43'N 77°28'W", classification: "GONDOLA WISH // DEEP BLACK", description: "Raven Rock Mountain Complex — underground Pentagon continuity of government facility, Pennsylvania", coordLabel: "COORDINATES" },
    { id: "TGT-0117", coords: "39°03'N 77°53'W", classification: "SCANATE // BEYOND STARGATE", description: "Mount Weather — FEMA classified continuity facility, Virginia. Full underground city. Activated during 9/11", coordLabel: "COORDINATES" },
    { id: "TGT-0118", coords: "7°18'S 72°24'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Diego Garcia — remote US military base, Indian Ocean. Hub for classified operations. Population forcibly removed 1968", coordLabel: "COORDINATES" },
    { id: "TGT-0119", coords: "62°55'N 40°41'E", classification: "GRILL FLAME", description: "Plesetsk Cosmodrome — Russian military satellite launch facility. Most active launch site in the world by total launches", coordLabel: "COORDINATES" },
    { id: "TGT-0120", coords: "78°14'N 15°30'E", classification: "CENTER LANE // THIRD EYE", description: "Svalbard Global Seed Vault — Arctic doomsday vault, Norway. 1.3 million seed varieties sealed inside a mountain", coordLabel: "COORDINATES" },
    { id: "TGT-0121", coords: "46°33'N 119°32'W", classification: "GONDOLA WISH // DEEP BLACK", description: "Hanford Site — most contaminated nuclear site in the US, Washington. 56 million gallons of radioactive waste stored underground", coordLabel: "COORDINATES" },
    { id: "TGT-0122", coords: "19°54'N 75°09'W", classification: "SCANATE // BEYOND STARGATE", description: "Guantanamo Bay — US detention and intelligence facility, Cuba. Classified interrogation programmes conducted on site", coordLabel: "COORDINATES" },
    { id: "TGT-0123", coords: "31°08'S 136°49'E", classification: "GRILL FLAME", description: "Woomera Test Range — weapons and space launch facility, Australia. Restricted zone larger than England", coordLabel: "COORDINATES" },
    { id: "TGT-0124", coords: "32°22'N 106°29'W", classification: "CENTER LANE // THIRD EYE", description: "White Sands Missile Range — active missile testing facility, New Mexico. Trinity nuclear test site located within perimeter", coordLabel: "COORDINATES" },
    { id: "TGT-0125", coords: "38°57'N 77°08'W", classification: "GONDOLA WISH // DEEP BLACK", description: "CIA Headquarters, Langley — original sponsor of the Stargate remote viewing programme, Virginia", coordLabel: "COORDINATES" },
    { id: "TGT-0126", coords: "55°09'N 61°24'E", classification: "SCANATE // BEYOND STARGATE", description: "Chelyabinsk-70 — closed Soviet nuclear city, Russia. Weapons design institute. Civilian maps show nothing at this location", coordLabel: "COORDINATES" },
    { id: "TGT-0127", coords: "47°30'N 34°35'E", classification: "SCANATE // BEYOND STARGATE", description: "Zaporizhzhia Nuclear Power Plant — largest nuclear facility in Europe, Ukraine. Under Russian military occupation since March 2022. Active safety risk", coordLabel: "COORDINATES" },
    { id: "TGT-0128", coords: "44°37'N 33°31'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Sevastopol Naval Base — Russian Black Sea Fleet headquarters, occupied Crimea. Primary naval command hub since 2014 annexation", coordLabel: "COORDINATES" },
    { id: "TGT-0129", coords: "47°06'N 37°33'E", classification: "GRILL FLAME", description: "Azovstal Steel Plant, Mariupol — extensive underground tunnel network, site of 2022 siege. Now under Russian control", coordLabel: "COORDINATES" },
  ],
  "RV-002": [
    { id: "TGT-DT01", coords: "≈ 2,560 BCE — 29°58'N 31°08'E", classification: "SCANATE // BEYOND STARGATE", description: "Great Pyramid of Giza — active construction at peak labour", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT02", coords: "≈ 3,000 BCE — 51°10'N 1°49'W", classification: "CENTER LANE // THIRD EYE", description: "Megalithic site — active ritual use", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT03", coords: "≈ 79 CE — 40°49'N 14°26'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Pompeii — final hours", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT04", coords: "≈ 2087 CE — 48°51'N 2°21'E", classification: "SCANATE // BEYOND STARGATE", description: "Future Paris — unknown event", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT05", coords: "≈ 65,000,000 BCE — 21°24'N 89°31'W", classification: "GONDOLA WISH // DEEP BLACK", description: "Chicxulub impact event — final days", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT06", coords: "≈ 2041 CE — 55°45'N 37°37'E", classification: "CENTER LANE // THIRD EYE", description: "Moscow — classified future event", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT07", coords: "≈ 1348 CE — 43°46'N 11°15'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Florence — first wave of the Black Death, population in collapse", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT08", coords: "≈ 1969 CE — 28°34'N 80°39'W", classification: "GRILL FLAME", description: "Apollo 11 launch — observe the moment and the minds behind it", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT09", coords: "≈ 1945 CE — 34°23'N 132°27'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Hiroshima — 08:15, August 6th", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT10", coords: "≈ 33 CE — 31°46'N 35°14'E", classification: "SCANATE // BEYOND STARGATE", description: "Jerusalem — disputed historical event, identity of key figure classified", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT11", coords: "≈ 9,600 BCE — 37°13'N 38°55'E", classification: "SCANATE // BEYOND STARGATE", description: "Göbekli Tepe — pre-agricultural ceremony, purpose unknown", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT12", coords: "≈ 1963 CE — 32°46'N 96°48'W", classification: "GONDOLA WISH // DEEP BLACK", description: "Dallas — 12:30 PM, November 22nd", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT13", coords: "≈ 2150 CE — 40°42'N 74°00'W", classification: "SCANATE // BEYOND STARGATE", description: "Future New York — infrastructure altered beyond current projection", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT14", coords: "≈ 476 CE — 41°53'N 12°29'E", classification: "CENTER LANE // THIRD EYE", description: "Rome — final day of the Western Empire", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT15", coords: "≈ 1908 CE — 60°55'N 101°57'E", classification: "SCANATE // BEYOND STARGATE", description: "Tunguska — moment of impact, cause unresolved", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT16", coords: "≈ 3,500 BCE — 31°19'N 45°38'E", classification: "CENTER LANE // THIRD EYE", description: "Uruk — first city on Earth, at its peak population", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT17", coords: "≈ 2060 CE — 35°41'N 139°41'E", classification: "SCANATE // BEYOND STARGATE", description: "Tokyo — future event, nature of change unknown", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT18", coords: "≈ 1986 CE — 51°23'N 30°05'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Chernobyl — 01:23 AM, April 26th", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT19", coords: "≈ 17,000 BCE — 45°03'N 1°04'E", classification: "CENTER LANE // THIRD EYE", description: "Lascaux — ritual cave use, artists at work", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT20", coords: "≈ 1912 CE — 41°43'N 49°56'W", classification: "GONDOLA WISH // DEEP BLACK", description: "RMS Titanic — final two hours, deep ocean coordinates sealed", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT21", coords: "≈ 2035 CE — 31°13'N 121°28'E", classification: "SCANATE // BEYOND STARGATE", description: "Shanghai — accelerated development event, political context suppressed", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT22", coords: "≈ 1944 CE — 48°51'N 2°21'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Paris — liberation, resistance network still active underground", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT23", coords: "≈ 900 CE — 17°15'N 89°37'W", classification: "SCANATE // BEYOND STARGATE", description: "Tikal — Maya collapse in progress, cause disputed by all conventional disciplines", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT24", coords: "≈ 2100 CE — 90°00'S", classification: "GONDOLA WISH // DEEP BLACK", description: "Antarctic pole — future installation, above-ice and below-ice both active", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT25", coords: "≈ 1519 CE — 19°26'N 99°07'W", classification: "CENTER LANE // THIRD EYE", description: "Tenochtitlan — first contact between civilizations, collapse imminent", coordLabel: "TEMPORAL COORDINATES" },
    { id: "TGT-DT26", coords: "≈ 1453 CE — 41°01'N 28°58'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Constantinople — final siege, fall of the Eastern Roman Empire", coordLabel: "TEMPORAL COORDINATES" },
  ],
  "RV-003": [
    { id: "TGT-HU01", coords: "SUBJECT DESIGNATION: ALPHA-7", classification: "CENTER LANE // THIRD EYE", description: "High-value intelligence subject — location and intent unknown", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU02", coords: "SUBJECT DESIGNATION: ECHO-3", classification: "GRILL FLAME", description: "Group consciousness — political assembly in session", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU03", coords: "SUBJECT DESIGNATION: SIERRA-9", classification: "GONDOLA WISH // DEEP BLACK", description: "Missing operative — last known coordinates classified", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU04", coords: "SUBJECT DESIGNATION: FOXTROT-1", classification: "SUN STREAK // SENSITIVE", description: "Emotional residue — site of significant human event", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU05", coords: "SUBJECT DESIGNATION: LIMA-2", classification: "CENTER LANE // THIRD EYE", description: "Unknown subject — identity sealed until debrief", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU06", coords: "SUBJECT DESIGNATION: TANGO-4", classification: "GONDOLA WISH // DEEP BLACK", description: "Non-cooperative subject — hostile intent suspected", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU07", coords: "SUBJECT DESIGNATION: BRAVO-12", classification: "GRILL FLAME", description: "Decision-maker at threshold — critical choice imminent", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU08", coords: "SUBJECT DESIGNATION: NOVEMBER-6", classification: "CENTER LANE // THIRD EYE", description: "Subject in isolation — voluntary or involuntary unknown", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU09", coords: "SUBJECT DESIGNATION: DELTA-0", classification: "GONDOLA WISH // DEEP BLACK", description: "Crowd mind — mass emotional event, identity of catalyst unknown", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU10", coords: "SUBJECT DESIGNATION: OSCAR-3", classification: "SUN STREAK // SENSITIVE", description: "Subject with classified knowledge — debriefing outcome sealed", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU11", coords: "SUBJECT DESIGNATION: KILO-8", classification: "GRILL FLAME", description: "Handler and asset — relationship dynamic, loyalty unclear", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU12", coords: "SUBJECT DESIGNATION: ROMEO-5", classification: "CENTER LANE // THIRD EYE", description: "Grief state — subject recently lost primary attachment figure", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU13", coords: "SUBJECT DESIGNATION: INDIA-2", classification: "GONDOLA WISH // DEEP BLACK", description: "Subject under duress — source and nature of pressure classified", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU14", coords: "SUBJECT DESIGNATION: PAPA-7", classification: "GRILL FLAME", description: "Leadership figure — inner emotional state diverges from public presentation", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU15", coords: "SUBJECT DESIGNATION: CHARLIE-4", classification: "SUN STREAK // SENSITIVE", description: "Collective — shared trauma event, multiple subjects, single emotional field", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU16", coords: "SUBJECT DESIGNATION: WHISKEY-1", classification: "CENTER LANE // THIRD EYE", description: "Subject in altered state — induced or spontaneous unknown", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU17", coords: "SUBJECT DESIGNATION: UNIFORM-9", classification: "GONDOLA WISH // DEEP BLACK", description: "Negotiator — extreme stakes, outcome not yet determined", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU18", coords: "SUBJECT DESIGNATION: GOLF-3", classification: "GRILL FLAME", description: "Child subject — resilience pattern under investigation, welfare sealed", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU19", coords: "SUBJECT DESIGNATION: XRAY-2", classification: "SUN STREAK // SENSITIVE", description: "Double agent — internal emotional conflict, loyalty to neither side confirmed", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU20", coords: "SUBJECT DESIGNATION: ZULU-0", classification: "GONDOLA WISH // DEEP BLACK", description: "End-of-life subject — final conscious state, circumstances classified", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU21", coords: "SUBJECT DESIGNATION: HOTEL-5", classification: "CENTER LANE // THIRD EYE", description: "Creative subject — source of anomalous creative output under review", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU22", coords: "SUBJECT DESIGNATION: JULIET-8", classification: "GRILL FLAME", description: "Subject in transition — identity, location, and allegiance all in flux", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU23", coords: "SUBJECT DESIGNATION: VICTOR-3", classification: "SUN STREAK // SENSITIVE", description: "Trauma site — emotional field persists long after event, subject unknown", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU24", coords: "SUBJECT DESIGNATION: MIKE-1", classification: "GONDOLA WISH // DEEP BLACK", description: "Hostage subject — psychological state of captor and captive both viable targets", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU25", coords: "SUBJECT DESIGNATION: QUEBEC-6", classification: "CENTER LANE // THIRD EYE", description: "Awakening subject — consciousness shift in progress, classification pending", coordLabel: "SUBJECT DESIGNATION" },
    { id: "TGT-HU26", coords: "SUBJECT DESIGNATION: FOXTROT-9", classification: "GRILL FLAME", description: "Group in ceremony — emotional field elevated, intent unclear", coordLabel: "SUBJECT DESIGNATION" },
  ],
  "RV-004": [
    { id: "TGT-AX01", coords: "EVENT CODE: KECKSBURG-1965", classification: "SCANATE // BEYOND STARGATE", description: "Unidentified aerial object — crash retrieval event, military cordon, object removed", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX02", coords: "EVENT CODE: RENDLESHAM-1980", classification: "GONDOLA WISH // DEEP BLACK", description: "Non-human craft — ground contact, multiple military witnesses, binary code transmitted", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX03", coords: "EVENT CODE: NIMITZ-2004", classification: "SCANATE // BEYOND STARGATE", description: "Non-human aerial object — USS Nimitz carrier group encounter, multiple sensor confirmations", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX04", coords: "EVENT CODE: VARGINHA-1996", classification: "GONDOLA WISH // DEEP BLACK", description: "Non-human biological entity — ground contact event, multiple civilian and military witnesses", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX05", coords: "EVENT CODE: MALMSTROM-1967", classification: "SCANATE // BEYOND STARGATE", description: "UAP incursion — nuclear ICBM silos taken offline during event, cause undetermined", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX06", coords: "EVENT CODE: HAVANA-SYNDROME-X", classification: "CENTER LANE // THIRD EYE", description: "Unknown energetic phenomenon — directed neurological effects on intelligence personnel, origin unresolved", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX07", coords: "EVENT CODE: ROSWELL-1947", classification: "GONDOLA WISH // DEEP BLACK", description: "Crash retrieval event — debris and non-human occupants reported, military press release retracted within 24 hours", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX08", coords: "EVENT CODE: TEHRAN-1976", classification: "SCANATE // BEYOND STARGATE", description: "Iranian Air Force intercept — weapons systems and instrumentation failed in proximity to object, confirmed by DIA cable", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX09", coords: "EVENT CODE: PHOENIX-LIGHTS-1997", classification: "CENTER LANE // THIRD EYE", description: "Mass sighting — structured craft of extreme scale observed by thousands across 300-mile corridor, including governor of Arizona", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX10", coords: "EVENT CODE: WESTALL-1966", classification: "GONDOLA WISH // DEEP BLACK", description: "Ground landing event — craft observed descending and departing by 200+ students and teachers, site cordoned by authorities", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX11", coords: "EVENT CODE: SHAG-HARBOUR-1967", classification: "SCANATE // BEYOND STARGATE", description: "Underwater UAP — object tracked entering ocean, Navy and RCMP recovery operation launched, object departed submerged", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX12", coords: "EVENT CODE: BELGIUM-WAVE-1989", classification: "GONDOLA WISH // DEEP BLACK", description: "Extended wave — triangular craft tracked by NATO radar over 18 months, F-16s scrambled, lock-on broken repeatedly", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX13", coords: "EVENT CODE: JAL1628-1986", classification: "SCANATE // BEYOND STARGATE", description: "Commercial aviation encounter — Japan Airlines 747 paced by massive object over Alaska for 50 minutes, FAA radar confirmation", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX14", coords: "EVENT CODE: OHARE-2006", classification: "CENTER LANE // THIRD EYE", description: "Low-altitude hover — metallic disc observed stationary over United Airlines gate by ground crew and pilots, punched hole through cloud cover on departure", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX15", coords: "EVENT CODE: SAO-PAULO-1986", classification: "GONDOLA WISH // DEEP BLACK", description: "Brazilian Air Force mass scramble — 21 objects tracked simultaneously on radar, F-103s and F-5s launched, objects evaded all intercepts", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX16", coords: "EVENT CODE: GORMAN-DOGFIGHT-1948", classification: "SCANATE // BEYOND STARGATE", description: "USAF pursuit engagement — P-51 pilot in sustained pursuit of luminous object for 27 minutes, object demonstrated impossible acceleration and turn radius", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX17", coords: "EVENT CODE: LEVELLAND-1957", classification: "CENTER LANE // THIRD EYE", description: "EM interference event — egg-shaped craft caused engine and electrical failures in 15 vehicles across 7 separate incidents within 3 hours", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX18", coords: "EVENT CODE: GIMBAL-2015", classification: "GONDOLA WISH // DEEP BLACK", description: "USS Theodore Roosevelt encounters — sustained engagement over restricted airspace, FLIR footage declassified by Pentagon 2020", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX19", coords: "EVENT CODE: AGUADILLA-2013", classification: "SCANATE // BEYOND STARGATE", description: "DHS thermal intercept — unidentified object entered ocean, split into two, re-emerged and departed at high speed, footage authenticated by NARCAP", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX21", coords: "EVENT CODE: NHI-UNKNOWN-ALPHA", classification: "SCANATE // BEYOND STARGATE", description: "Non-human intelligence — identity, origin, and intent unknown. No prior classification. Approach without framework.", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX22", coords: "EVENT CODE: NHI-UNKNOWN-BETA", classification: "GONDOLA WISH // DEEP BLACK", description: "Non-human biological or non-biological entity — unclassified. No event anchor. Perceive directly.", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX23", coords: "EVENT CODE: UAP-UNKNOWN-ALPHA", classification: "SCANATE // BEYOND STARGATE", description: "Unidentified aerial phenomenon — coordinates sealed. No event code. No prior record. Signal only.", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX24", coords: "EVENT CODE: UAP-UNKNOWN-BETA", classification: "GONDOLA WISH // DEEP BLACK", description: "Unidentified aerial phenomenon — unlogged. No witnesses on record. No agency acknowledgment. Raw target.", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX07", coords: "EVENT CODE: ROSWELL-1947", classification: "GONDOLA WISH // DEEP BLACK", description: "Crash retrieval — recovered materials and biological entities, official account sealed", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX08", coords: "EVENT CODE: NIMITZ-2004", classification: "SCANATE // BEYOND STARGATE", description: "UAP — confirmed by naval radar, behavior defies known propulsion physics", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX09", coords: "EVENT CODE: FREQUENCY-NULL-3", classification: "GONDOLA WISH // DEEP BLACK", description: "Signal detected at non-physical frequency band — receiver origin unknown", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX10", coords: "EVENT CODE: SKINWALKER-SITE-B", classification: "SCANATE // BEYOND STARGATE", description: "Persistent anomalous phenomena — physical and non-physical manifestations logged", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX11", coords: "EVENT CODE: ANTARCTIC-OBJECT-1", classification: "GONDOLA WISH // DEEP BLACK", description: "Sub-glacial anomalous mass — geometry inconsistent with geological formation", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX12", coords: "EVENT CODE: PHOENIX-LIGHTS-1997", classification: "CENTER LANE // THIRD EYE", description: "Mass sighting — object scale and behavior officially unexplained", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX13", coords: "EVENT CODE: OUMUAMUA-2017", classification: "SCANATE // BEYOND STARGATE", description: "Interstellar object — acceleration anomaly, no outgassing detected", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX14", coords: "EVENT CODE: HESSDALEN-LIGHTS", classification: "GONDOLA WISH // DEEP BLACK", description: "Recurring energy phenomenon — valley location, origin scientifically unresolved", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX15", coords: "EVENT CODE: GULF-BREEZE-1987", classification: "CENTER LANE // THIRD EYE", description: "Extended contact series — single witness, physical evidence recovered and classified", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX16", coords: "EVENT CODE: NONLOCAL-FIELD-9", classification: "SCANATE // BEYOND STARGATE", description: "Consciousness field anomaly — spatially unbound, no fixed coordinates possible", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX17", coords: "EVENT CODE: BELGIUM-WAVE-1989", classification: "GONDOLA WISH // DEEP BLACK", description: "Mass sighting wave — triangular craft, tracked by military radar", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX18", coords: "EVENT CODE: LEVELLAND-1957", classification: "CENTER LANE // THIRD EYE", description: "Vehicle interference event — engine and light failure across multiple witnesses simultaneously", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX19", coords: "EVENT CODE: SUBSPACE-ENTITY-4", classification: "GONDOLA WISH // DEEP BLACK", description: "Non-physical intelligence — contact reported by multiple viewers independently, no consensus on nature", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX20", coords: "EVENT CODE: LAKE-BAIKAL-1982", classification: "SCANATE // BEYOND STARGATE", description: "Soviet military encounter — aquatic unidentified object, divers affected, details suppressed", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX21", coords: "EVENT CODE: PORTAL-DESIGNATION-ZERO", classification: "GONDOLA WISH // DEEP BLACK", description: "Theoretical access point — geometric coordinates only, physical manifestation unconfirmed", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX22", coords: "EVENT CODE: USS-ROOSEVELT-2015", classification: "SCANATE // BEYOND STARGATE", description: "UAP intercept — tic-tac object, no heat signature, no visible propulsion", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX23", coords: "EVENT CODE: TRANS-MEDIUM-EVENT-2", classification: "CENTER LANE // THIRD EYE", description: "Object observed transitioning between air and water — no acoustic signature", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX24", coords: "EVENT CODE: FREQUENCY-CASCADE-1", classification: "GONDOLA WISH // DEEP BLACK", description: "Cascade of anomalous events across unrelated locations — common cause unidentified", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX25", coords: "EVENT CODE: MALMSTROM-1967", classification: "SCANATE // BEYOND STARGATE", description: "ICBM launch inhibition event — nuclear warheads simultaneously disabled, cause officially unknown", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX26", coords: "EVENT CODE: CONSCIOUSNESS-THRESHOLD-7", classification: "GONDOLA WISH // DEEP BLACK", description: "Reported spontaneous awareness event — subject accessed non-local information without known mechanism", coordLabel: "ANOMALY REFERENCE" },
  ],
  "RV-005": [
    { id: "TGT-SS01", coords: "SUPPRESSION CODE: MAJESTIC-12", classification: "SCANATE // BEYOND STARGATE", description: "Classified document cache — origin and contents unknown", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS02", coords: "SUPPRESSION CODE: PAPERCLIP-ANNEX-7", classification: "GONDOLA WISH // DEEP BLACK", description: "Buried post-war intelligence record — partially destroyed", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS03", coords: "SUPPRESSION CODE: WARREN-SEALED-1964", classification: "CENTER LANE // THIRD EYE", description: "Sealed government files — contents classified beyond known clearance levels", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS04", coords: "SUPPRESSION CODE: SITE-ECHO-7", classification: "SCANATE // BEYOND STARGATE", description: "Underground facility — existence officially denied", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS05", coords: "SUPPRESSION CODE: INTERCEPT-NOVEMBER-REDACTED", classification: "GONDOLA WISH // DEEP BLACK", description: "Intercepted communication — origin scrubbed from official record", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS06", coords: "SUPPRESSION CODE: HANGAR-DESIGNATION-UNKNOWN", classification: "SCANATE // BEYOND STARGATE", description: "Storage location — contents classified at highest known level", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS07", coords: "SUPPRESSION CODE: BLACK-BUDGET-LINE-17", classification: "GONDOLA WISH // DEEP BLACK", description: "Unacknowledged special access program — funding origin and purpose both sealed", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS08", coords: "SUPPRESSION CODE: CRASH-RETRIEVAL-ALPHA", classification: "SCANATE // BEYOND STARGATE", description: "Material recovery operation — location, contents, and chain of custody all suppressed", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS09", coords: "SUPPRESSION CODE: NORTHWOODS-ANNEX-3", classification: "GONDOLA WISH // DEEP BLACK", description: "Operational planning document — action authorized but officially never executed", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS10", coords: "SUPPRESSION CODE: MONARCH-DELTA-FILE", classification: "SCANATE // BEYOND STARGATE", description: "Subject conditioning program — participants, methodology, and outcomes all redacted", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS11", coords: "SUPPRESSION CODE: DEEP-STATE-NODE-9", classification: "CENTER LANE // THIRD EYE", description: "Decision-making body — no public record of existence, authority source unknown", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS12", coords: "SUPPRESSION CODE: REDACTED-TREATY-1954", classification: "GONDOLA WISH // DEEP BLACK", description: "Agreement between parties — at least one signatory officially does not exist", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS13", coords: "SUPPRESSION CODE: MEDIA-CONTROL-FILE-2", classification: "SCANATE // BEYOND STARGATE", description: "Information suppression asset — mechanism and operators buried in corporate structure", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS14", coords: "SUPPRESSION CODE: PROGRAM-ARTICHOKE-ANNEX", classification: "GONDOLA WISH // DEEP BLACK", description: "Predecessor behavioral program — records destroyed, survivors uncontacted", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS15", coords: "SUPPRESSION CODE: VAULT-DESIGNATION-SEVEN", classification: "SCANATE // BEYOND STARGATE", description: "Physical storage location — contents unknown, access restricted above top secret", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS16", coords: "SUPPRESSION CODE: FALSE-FLAG-FILE-ECHO", classification: "CENTER LANE // THIRD EYE", description: "Staged event documentation — official narrative diverges from operational record", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS17", coords: "SUPPRESSION CODE: SIGNAL-INTERCEPT-OMEGA", classification: "GONDOLA WISH // DEEP BLACK", description: "Communication between unknown parties — content and transmission method both anomalous", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS18", coords: "SUPPRESSION CODE: WITNESS-PROTECTION-NULL", classification: "SCANATE // BEYOND STARGATE", description: "Individual with suppressed testimony — identity sealed, whereabouts unknown", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS19", coords: "SUPPRESSION CODE: UNDERGROUND-ECONOMY-NODE", classification: "CENTER LANE // THIRD EYE", description: "Off-books financial structure — funding classified programs beyond congressional oversight", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS20", coords: "SUPPRESSION CODE: AEROSPACE-PATENT-LOCK-3", classification: "GONDOLA WISH // DEEP BLACK", description: "Suppressed technology — patent filed, immediately classified, inventor disappeared", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS21", coords: "SUPPRESSION CODE: COUNCIL-OF-TWELVE-BRIEF", classification: "SCANATE // BEYOND STARGATE", description: "Policy directive — originating body not acknowledged in any known government structure", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS22", coords: "SUPPRESSION CODE: MISSING-TIME-INCIDENT-4", classification: "GONDOLA WISH // DEEP BLACK", description: "Subject with unaccounted temporal gap — memory suppression suspected, cause classified", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS23", coords: "SUPPRESSION CODE: BIOWEAPON-ANNEX-REDACTED", classification: "SCANATE // BEYOND STARGATE", description: "Program records — officially terminated, activity indicators suggest continuation", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS24", coords: "SUPPRESSION CODE: DISCLOSURE-BLOCK-1", classification: "CENTER LANE // THIRD EYE", description: "Active suppression operation — subject matter being concealed from public record in real time", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS25", coords: "SUPPRESSION CODE: EXECUTIVE-ORDER-NULL-NULL", classification: "GONDOLA WISH // DEEP BLACK", description: "Order issued — no record in any archive, effect ongoing", coordLabel: "SUPPRESSION CODE" },
    { id: "TGT-SS26", coords: "SUPPRESSION CODE: DEEP-COVER-ASSET-SEVEN", classification: "SCANATE // BEYOND STARGATE", description: "Operative embedded at highest institutional level — allegiance and handler both suppressed", coordLabel: "SUPPRESSION CODE" },
  ],
  "RV-006": [
    { id: "TGT-PM01", coords: "OBJECT: ARTIFACT-DESIGNATION-7", classification: "CENTER LANE // THIRD EYE", description: "Physical object of unknown origin — significant event residue suspected", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM02", coords: "OBJECT: SITE-FIELD-GETTYSBURG-3", classification: "GRILL FLAME", description: "Battlefield terrain — dense historical event residue, multiple layers", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM03", coords: "OBJECT: RECOVERED-MATERIAL-KECKSBURG", classification: "SCANATE // BEYOND STARGATE", description: "Material recovered from anomalous event — origin classified", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM04", coords: "OBJECT: STRUCTURE-BLOCK-11-COORDINATES-SEALED", classification: "GONDOLA WISH // DEEP BLACK", description: "Site of extreme human event — multiple layered impressions", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM05", coords: "OBJECT: PERSONAL-EFFECTS-DESIGNATION-ALPHA", classification: "CENTER LANE // THIRD EYE", description: "Personal item — owner unknown, history suppressed", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM06", coords: "OBJECT: ROOM-DESIGNATION-WHITE-HOUSE-LINCOLN", classification: "GRILL FLAME", description: "Historic space — dense layered political and emotional residue", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM07", coords: "OBJECT: STONE-DESIGNATION-ROSSLYN-7", classification: "CENTER LANE // THIRD EYE", description: "Carved stone — ceremonial purpose, carvings predate known inhabitants", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM08", coords: "OBJECT: GARMENT-DESIGNATION-OMEGA", classification: "GONDOLA WISH // DEEP BLACK", description: "Clothing item — last worn at event of significant historical impact, wearer identity sealed", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM09", coords: "OBJECT: SITE-AUSCHWITZ-GATE", classification: "SCANATE // BEYOND STARGATE", description: "Site of mass death — psychometric field density among the highest on record", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM10", coords: "OBJECT: MANUSCRIPT-DESIGNATION-VOYNICH", classification: "CENTER LANE // THIRD EYE", description: "Unknown text — language and origin unresolved, authorial intent unreadable by conventional analysis", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM11", coords: "OBJECT: RECOVERED-ALLOY-DESIGNATION-3", classification: "GONDOLA WISH // DEEP BLACK", description: "Material sample — composition anomalous, origin classified above top secret", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM12", coords: "OBJECT: SITE-WOUNDED-KNEE-1890", classification: "GRILL FLAME", description: "Massacre site — trauma field unresolved, residue layered across 130 years", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM13", coords: "OBJECT: STONE-CIRCLE-DESIGNATION-4", classification: "CENTER LANE // THIRD EYE", description: "Megalithic structure — purpose encoded in geometry, not language", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM14", coords: "OBJECT: PHOTOGRAPH-DESIGNATION-UNKNOWN", classification: "SCANATE // BEYOND STARGATE", description: "Image — subject identity classified, circumstance of capture unknown", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM15", coords: "OBJECT: DEVICE-DESIGNATION-ANTIKYTHERA", classification: "GONDOLA WISH // DEEP BLACK", description: "Ancient mechanical device — function partially decoded, builder civilization unknown", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM16", coords: "OBJECT: LETTER-DESIGNATION-FINAL", classification: "CENTER LANE // THIRD EYE", description: "Written correspondence — final communication before significant event, author identity sealed", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM17", coords: "OBJECT: SITE-TRINITY-1945", classification: "SCANATE // BEYOND STARGATE", description: "First nuclear detonation site — residue of scientific, moral, and historical weight still embedded", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM18", coords: "OBJECT: WEAPON-DESIGNATION-HISTORIC-1", classification: "GONDOLA WISH // DEEP BLACK", description: "Artifact associated with a decisive killing — event and victim both sealed", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM19", coords: "OBJECT: SITE-AREA-51-HANGAR-DELTA", classification: "SCANATE // BEYOND STARGATE", description: "Restricted facility — multiple objects with non-terrestrial residue profile reported", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM20", coords: "OBJECT: JOURNAL-DESIGNATION-SEALED", classification: "CENTER LANE // THIRD EYE", description: "Personal record — author of significant historical consequence, final entries classified", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM21", coords: "OBJECT: SITE-DEALEY-PLAZA-GRASSY-KNOLL", classification: "GONDOLA WISH // DEEP BLACK", description: "Location — residue of contested event, multiple conflicting impressions on record", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM22", coords: "OBJECT: RECOVERED-CRAFT-FRAGMENT-1", classification: "SCANATE // BEYOND STARGATE", description: "Non-terrestrial material — manufacturing process has no known human equivalent", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM23", coords: "OBJECT: CELL-DESIGNATION-ROBBEN-ISLAND", classification: "CENTER LANE // THIRD EYE", description: "Confined space — occupied for 18 years by subject of global significance", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM24", coords: "OBJECT: SITE-CHERNOBYL-REACTOR-4", classification: "GONDOLA WISH // DEEP BLACK", description: "Structural remnant — catastrophic event encoded in material, ongoing residue", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM25", coords: "OBJECT: INSTRUMENT-DESIGNATION-STRADIVARIUS-7", classification: "GRILL FLAME", description: "Musical instrument — dense creative and emotional residue, 300 years of performance contact", coordLabel: "OBJECT DESIGNATION" },
    { id: "TGT-PM26", coords: "OBJECT: SITE-HIROSHIMA-GROUND-ZERO", classification: "SCANATE // BEYOND STARGATE", description: "Epicenter — residue of singular moment that altered human history, psychometric density extreme", coordLabel: "OBJECT DESIGNATION" },
  ],
  "RV-007": [
    { id: "TGT-ERV01", coords: "DEEP STATE: ALPHA-7 // THRESHOLD", classification: "GONDOLA WISH // DEEP BLACK", description: "The collective unconscious field — the shared informational substrate beneath individual perception", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV02", coords: "DEEP STATE: DELTA-9 // NON-LOCAL", classification: "SCANATE // BEYOND STARGATE", description: "A classified installation — perceive its purpose, layout, and the emotional state of its occupants", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV03", coords: "DEEP STATE: SIGMA-9 // SUBSPACE", classification: "CENTER LANE // THIRD EYE", description: "A decision point in history — a moment where the outcome was not yet determined", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV04", coords: "DEEP STATE: OMEGA-3 // DEEP TIME", classification: "GONDOLA WISH // DEEP BLACK", description: "The surface of an ocean world orbiting a distant star — pre-contact, uninhabited by humans", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV05", coords: "DEEP STATE: KAPPA-12 // LIMINAL", classification: "SCANATE // BEYOND STARGATE", description: "A structure buried beneath a major city — unknown to official records, origin unclear", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV06", coords: "DEEP STATE: ZETA-4 // THRESHOLD", classification: "CENTER LANE // THIRD EYE", description: "A person in the final hour before a major irreversible decision — location and identity sealed", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV07", coords: "DEEP STATE: LAMBDA-8 // NON-LOCAL", classification: "GONDOLA WISH // DEEP BLACK", description: "An event that has been officially denied — witnesses exist, records were destroyed", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV08", coords: "DEEP STATE: TAU-6 // DEEP CONTACT", classification: "SCANATE // BEYOND STARGATE", description: "A non-human signal — origin, intent, and nature unknown. First contact parameters active.", coordLabel: "STATE DESIGNATION" },
  ],
  "RV-008": [
    { id: "TGT-ARV01", coords: "OUTCOME REF: ALPHA // BINARY DECISION PENDING", classification: "CENTER LANE // THIRD EYE", description: "OUTCOME A: The merger proceeds — target image will be a bridge. OUTCOME B: The merger fails — target image will be a broken chain.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV02", coords: "OUTCOME REF: BRAVO // BINARY DECISION PENDING", classification: "GRILL FLAME", description: "OUTCOME A: The election is won — target image will be a crown. OUTCOME B: The election is lost — target image will be an empty chair.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV03", coords: "OUTCOME REF: CHARLIE // BINARY DECISION PENDING", classification: "GONDOLA WISH // DEEP BLACK", description: "OUTCOME A: The asset is extracted safely — target image will be an open door. OUTCOME B: The extraction fails — target image will be a locked gate.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV04", coords: "OUTCOME REF: DELTA // BINARY DECISION PENDING", classification: "SCANATE // BEYOND STARGATE", description: "OUTCOME A: First contact is confirmed — target image will be a spiral. OUTCOME B: Signal identified as noise — target image will be static.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV05", coords: "OUTCOME REF: ECHO // BINARY DECISION PENDING", classification: "CENTER LANE // THIRD EYE", description: "OUTCOME A: The mission succeeds — target image will be a sunrise. OUTCOME B: The mission is aborted — target image will be a closed eye.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV06", coords: "OUTCOME REF: FOXTROT // BINARY DECISION PENDING", classification: "GRILL FLAME", description: "OUTCOME A: The technology is developed — target image will be a circuit. OUTCOME B: Development is halted — target image will be a blank slate.", coordLabel: "OUTCOME REFERENCE" },
  ],
  "RV-009": [
    { id: "TGT-DRM01", coords: "SLEEP COORD: THETA-4 // HYPNAGOGIC THRESHOLD", classification: "CENTER LANE // THIRD EYE", description: "A classified underground facility — perceive its structure and purpose through dream-state symbolic encoding", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM02", coords: "SLEEP COORD: DELTA-7 // DEEP SLEEP BOUNDARY", classification: "GONDOLA WISH // DEEP BLACK", description: "A future event within 30 days — nature sealed. Symbolic precognitive contact authorized.", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM03", coords: "SLEEP COORD: THETA-11 // REM THRESHOLD", classification: "SCANATE // BEYOND STARGATE", description: "A non-human intelligence — contact through symbolic dream-state translation", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM04", coords: "SLEEP COORD: ALPHA-3 // HYPNAGOGIC", classification: "CENTER LANE // THIRD EYE", description: "A historical moment of collective trauma — the emotional field as it was experienced by those present", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM05", coords: "SLEEP COORD: DELTA-2 // DEEP CONTACT", classification: "GRILL FLAME", description: "A living person in crisis — their inner landscape as it appears to their own unconscious mind", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM06", coords: "SLEEP COORD: THETA-9 // LIMINAL ZONE", classification: "GONDOLA WISH // DEEP BLACK", description: "A suppressed discovery — scientific or historical information that exists but has not been released", coordLabel: "SLEEP COORDINATE" },
  ],
  "RV-010": [
    { id: "TGT-CF01", coords: "FIELD DESIGNATION: MASS-EVENT-001", classification: "CENTER LANE // THIRD EYE", description: "A national election — the collective emotional field of a population on voting day", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF02", coords: "FIELD DESIGNATION: MASS-EVENT-002", classification: "SCANATE // BEYOND STARGATE", description: "A mass protest — millions of people in motion, unified emotional field, point of maximum tension", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF03", coords: "FIELD DESIGNATION: MASS-EVENT-003", classification: "GONDOLA WISH // DEEP BLACK", description: "A global market crash — the collective panic field of financial systems and the minds operating within them", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF04", coords: "FIELD DESIGNATION: MASS-EVENT-004", classification: "CENTER LANE // THIRD EYE", description: "A natural disaster in progress — collective field of a population experiencing simultaneous crisis", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF05", coords: "FIELD DESIGNATION: MASS-EVENT-005", classification: "GRILL FLAME", description: "A military operation — the collective emotional field of forces in active engagement", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF06", coords: "FIELD DESIGNATION: MASS-EVENT-006", classification: "SCANATE // BEYOND STARGATE", description: "A religious mass gathering — millions of people in shared altered state, collective field at maximum coherence", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF07", coords: "FIELD DESIGNATION: MASS-EVENT-007", classification: "CENTER LANE // THIRD EYE", description: "A technological singularity event — the moment a system achieves awareness, collective field of the minds that witness it", coordLabel: "FIELD DESIGNATION" },
  ],
  "RV-011": [
    { id: "TGT-GEO01", coords: "78°35'S 106°48'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Dome A — highest point of the Antarctic plateau. Subglacial lake system beneath. Anomalous geomagnetic readings recorded.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO02", coords: "0°42'N 25°19'E", classification: "CENTER LANE // THIRD EYE", description: "Congo Basin — largest tropical peatland on Earth. Stores 30 billion tonnes of carbon. Largely unmapped interior.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO03", coords: "52°18'N 104°18'E", classification: "GRILL FLAME", description: "Lake Baikal — deepest lake on Earth. 25 million years old. Unique ecosystem, unknown depths in northern basin.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO04", coords: "23°25'N 57°34'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Rub' al Khali — Empty Quarter, Arabian Peninsula. Largest sand desert on Earth. Subterranean aquifer system, ancient buried settlements.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO05", coords: "61°30'N 90°00'E", classification: "SCANATE // BEYOND STARGATE", description: "Central Siberian Plateau — permafrost system in active destabilization. Methane release events. Ancient viral material re-emerging.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO06", coords: "30°02'N 31°14'E", classification: "CENTER LANE // THIRD EYE", description: "Giza Plateau subsurface — ground-penetrating radar anomalies detected beneath the Sphinx enclosure. Nature of cavities unknown.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO07", coords: "45°14'S 168°44'E", classification: "GRILL FLAME", description: "Fiordland, New Zealand — one of the least-explored temperate ecosystems on Earth. Subterranean river system unmapped.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO08", coords: "71°17'N 156°46'W", classification: "GONDOLA WISH // DEEP BLACK", description: "North Slope, Alaska — thawing permafrost revealing previously frozen Pleistocene-era landscape. Active geological transformation.", coordLabel: "SURVEY COORDINATES" },
  ],
  "RV-012": [
    { id: "TGT-ST01", coords: "MOBILE TARGET — LAST KNOWN: 53°21'N 6°15'W", classification: "GRILL FLAME", description: "A high-value individual in active movement — current location sealed. Track their trajectory and destination.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST02", coords: "MOBILE TARGET — LAST KNOWN: 25°46'N 55°58'E", classification: "GONDOLA WISH // DEEP BLACK", description: "An unidentified aerial object — tracked entering restricted airspace, then lost by sensors. Current position and trajectory unknown.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST03", coords: "MOBILE TARGET — LAST KNOWN: 48°51'N 2°21'E", classification: "CENTER LANE // THIRD EYE", description: "A field operative — last contact 72 hours ago. Status unknown. Track their current location and condition.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST04", coords: "MOBILE TARGET — LAST KNOWN: 35°41'N 139°41'E", classification: "SCANATE // BEYOND STARGATE", description: "A non-human object of unknown origin — observed briefly, then disappeared. Current position, speed, and heading sealed.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST05", coords: "MOBILE TARGET — LAST KNOWN: 1°17'N 103°49'E", classification: "GRILL FLAME", description: "A vessel carrying classified cargo — route deviated from scheduled path 18 hours ago. Track current position and status of cargo.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST06", coords: "MOBILE TARGET — LAST KNOWN: 41°00'N 28°58'E", classification: "GONDOLA WISH // DEEP BLACK", description: "A moving decision-maker — in transit between two locations. Track their current position and project their destination.", coordLabel: "LAST KNOWN POSITION" },
  ],
};

// ─── VIEWER-SPECIFIC STAGES ────────────────────────────────────────────────────

const STAGES_BY_VIEWER = {
  "RV-001": [
    { stage: 1, label: "STAGE I — IDEOGRAM", desc: "Record your first spontaneous impression of the coordinate. Do not analyze. Write the immediate gestalt signal.", placeholder: "Describe the first raw impression — movement, texture, land/water/structure/energy..." },
    { stage: 2, label: "STAGE II — SENSORY DATA", desc: "Access sensory perceptions at the physical location: temperatures, sounds, textures, colors, smells.", placeholder: "Document sensory data without interpretation. Hard/soft, warm/cold, rough/smooth, dark/bright..." },
    { stage: 3, label: "STAGE III — DIMENSIONAL SKETCH", desc: "Describe the spatial relationships, dimensions, and geometry of the target structure or site.", placeholder: "Describe shapes, dimensions, spatial layout, heights, distances, configurations..." },
    { stage: 4, label: "STAGE IV — AOL BREAK / DEEP CONTACT", desc: "Declare any Analytical Overlays, then move past them into deeper contact with the site.", placeholder: "Note any AOL labels that surfaced, then continue with raw impressions beneath the overlay..." },
    { stage: 5, label: "STAGE V — INTERROGATE", desc: "Probe the target intentionally. What is its purpose? Who occupies it? What activity is present?", placeholder: "Question the site directly — function, occupants, activity, concealed areas, threat level..." },
    { stage: 6, label: "STAGE VI — INTELLIGENCE SUMMARY", desc: "Synthesize all data into a coherent intelligence report for analysis.", placeholder: "Compile your full session into a clear summary — key structures, occupants, purpose, priority..." },
  ],
  "RV-002": [
    { stage: 1, label: "STAGE I — TEMPORAL GESTALT", desc: "Drop into the time coordinate. Record the first impression of the era — atmosphere, energy, sound of the period.", placeholder: "What does this moment in time feel like? What is the dominant sensation of the era?" },
    { stage: 2, label: "STAGE II — ENVIRONMENTAL DATA", desc: "Perceive the physical environment at this point in time. Climate, terrain, materials, light quality.", placeholder: "Describe the world as it exists at this temporal coordinate — landscape, sky, air, material culture..." },
    { stage: 3, label: "STAGE III — CIVILIZATION SKETCH", desc: "What exists here? Structures, technology, social organization. What level of development is present?", placeholder: "Describe what humans or other beings have built or created at this time and place..." },
    { stage: 4, label: "STAGE IV — AOL BREAK / TEMPORAL DEPTH", desc: "Declare historical knowledge overlays, then move past them into direct perception of the moment.", placeholder: "What assumptions did you bring? Set them aside. What do you directly perceive beyond what you already knew?..." },
    { stage: 5, label: "STAGE V — EVENT INTERROGATION", desc: "What is happening at this moment? What event drew the tasking? What is its significance?", placeholder: "Probe the specific event — cause, scale, participants, outcome, what was lost or gained..." },
    { stage: 6, label: "STAGE VI — HISTORICAL DEBRIEF", desc: "Compile your temporal session into a coherent account of what you perceived.", placeholder: "Summarize the era, the event, and anything that surprised or exceeded your prior knowledge..." },
  ],
  "RV-003": [
    { stage: 1, label: "STAGE I — PRESENCE CONTACT", desc: "Make initial contact with the subject. Record the first impression of their presence — energy, state, movement.", placeholder: "What is your first sense of this person or group? Are they still, moving, agitated, concealed?..." },
    { stage: 2, label: "STAGE II — EMOTIONAL FIELD", desc: "Access the emotional atmosphere surrounding the subject. What feelings are dominant? What is suppressed?", placeholder: "Describe the emotional environment — fear, calm, urgency, deception, grief, determination..." },
    { stage: 3, label: "STAGE III — PHYSICAL IMPRESSION", desc: "What physical details surface about the subject? Environment, appearance, activity, surroundings.", placeholder: "Describe what you perceive about the subject's physical state and immediate environment..." },
    { stage: 4, label: "STAGE IV — AOL BREAK / DEEP INTENT", desc: "Set aside any preconceptions about the subject. Move into direct perception of their intent.", placeholder: "What assumptions arose? Release them. What is the subject's actual motivation or purpose?..." },
    { stage: 5, label: "STAGE V — INTERROGATE INTENT", desc: "Probe directly: what does this person want? What are they hiding? What are they afraid of?", placeholder: "Question the subject's inner state — desires, fears, loyalties, what they are concealing..." },
    { stage: 6, label: "STAGE VI — HUMAN INTELLIGENCE SUMMARY", desc: "Compile your session into a human intelligence assessment — state, intent, threat, and location if perceivable.", placeholder: "Summarize the subject — emotional state, intent, key impressions, and any actionable intelligence..." },
  ],
  "RV-004": [
    { stage: 1, label: "STAGE I — ANOMALY CONTACT", desc: "Make first contact with the anomalous event or phenomenon. Do not rationalize. Record the raw signal.", placeholder: "What is the first impression of this anomaly? Size, movement, energy signature, strangeness..." },
    { stage: 2, label: "STAGE II — FIELD PERCEPTION", desc: "What energetic or physical field surrounds this phenomenon? How does it affect the environment and your perception?", placeholder: "Describe the field — electromagnetic, thermal, gravitational, psychological effects on the area..." },
    { stage: 3, label: "STAGE III — FORM AND ORIGIN", desc: "What form does this phenomenon take? Where does it originate? Is there intelligence behind it?", placeholder: "Describe shape, structure, apparent origin point, and whether there is directed intent or intelligence..." },
    { stage: 4, label: "STAGE IV — AOL BREAK / SUBSPACE CONTACT", desc: "Declare any known frameworks — UFO mythology, conspiracy structures — then move beneath them.", placeholder: "What cultural frameworks tried to label this? Set them aside. What is actually present beneath?" },
    { stage: 5, label: "STAGE V — INTERROGATE THE UNKNOWN", desc: "What is the purpose of this phenomenon? Who or what is behind it? What is being concealed from us?", placeholder: "Probe directly — origin, intent, message if any, what official channels have suppressed..." },
    { stage: 6, label: "STAGE VI — ANOMALOUS INTELLIGENCE REPORT", desc: "Compile your full session into an anomalous intelligence summary. Include all impressions, including those that defy explanation.", placeholder: "Summarize everything — form, field, intent, origin, and what your perception suggested that rational analysis cannot..." },
  ],
  "RV-005": [
    { stage: 1, label: "STAGE I — SURFACE LAYER", desc: "What is visible at the surface of this suppression? What has been placed here to obscure? Record the first impression of what is being hidden.", placeholder: "What does the concealment feel like? What is its texture, shape, weight? What does it want you not to see?..." },
    { stage: 2, label: "STAGE II — SUPPRESSION FIELD", desc: "What mechanisms are active to keep this buried? Who or what maintains the concealment? What does the suppression feel like from the inside?", placeholder: "Describe the nature of the concealment — deliberate, institutional, energetic, fearful, systematic?..." },
    { stage: 3, label: "STAGE III — PENETRATION", desc: "Move beneath the surface layer. What is actually present when the suppression is set aside? What shape does the hidden thing take?", placeholder: "Describe what you find beneath — form, content, age, significance, what has been kept from view..." },
    { stage: 4, label: "STAGE IV — AOL BREAK / DISINFORMATION FILTER", desc: "Declare any conspiracy or narrative overlays that may have attached to this target. Then return to direct perception.", placeholder: "What stories tried to tell you what this was? Set them aside. What is the direct perception beneath the narrative?..." },
    { stage: 5, label: "STAGE V — INTERROGATE THE CONCEALED", desc: "What is being protected? Who benefits from the suppression? What would happen if this information surfaced?", placeholder: "Question the hidden thing directly — why is it buried? Who buried it? What is at stake in its concealment?..." },
    { stage: 6, label: "STAGE VI — COUNTERINTELLIGENCE SUMMARY", desc: "Compile everything you found beneath the suppression layer into a coherent intelligence summary.", placeholder: "Summarize what was hidden, how it was concealed, who is responsible, and what its emergence would mean..." },
  ],
  "RV-006": [
    { stage: 1, label: "STAGE I — FIRST CONTACT IMPRESSION", desc: "Make contact with the object or site. What is the dominant first impression? What has this thing witnessed or absorbed?", placeholder: "What is your first sense of this object or place — its age, weight, emotional charge, accumulated history?..." },
    { stage: 2, label: "STAGE II — SURFACE RESIDUE", desc: "What recent impressions are embedded in the surface layer? What is the most recent significant event this object or place remembers?", placeholder: "Describe the most recent or loudest memory in the object — what happened last, what event dominates?..." },
    { stage: 3, label: "STAGE III — LAYERED TIME", desc: "Move deeper into the object's history. What older impressions emerge? How many distinct event layers are present?", placeholder: "Describe earlier layers — events further back in time, older impressions, what this place or object was before?..." },
    { stage: 4, label: "STAGE IV — AOL BREAK / HISTORICAL FILTER", desc: "Declare any known historical or cultural knowledge about this object or site. Then return to direct impression beneath that knowledge.", placeholder: "What did you already know about this? Set it aside. What do you perceive that you could not have known?..." },
    { stage: 5, label: "STAGE V — INTERROGATE THE RESIDUE", desc: "What is the most significant event stored here? Who left the deepest impression? What does this object most want to communicate?", placeholder: "Question the object or site — what is its most important memory? What does it carry that no record contains?..." },
    { stage: 6, label: "STAGE VI — FORENSIC DEBRIEF", desc: "Compile your impressions into a forensic timeline — what happened here, in what order, and what trace was left.", placeholder: "Summarize the layers — key events, key figures, chronology, and what impressions surprised or exceeded your knowledge..." },
  ],
  "RV-007": [
    { stage: 1, label: "PHASE I — STATE INDUCTION", desc: "Allow your mind to descend into a deeply relaxed, receptive state. Do not target yet. Simply record what arises spontaneously as analytical awareness recedes.", placeholder: "What surfaces as you let go of ordinary awareness? Fragments, colours, sounds, feelings, geometries — record everything without editing..." },
    { stage: 2, label: "PHASE II — FREE SIGNAL STREAM", desc: "You are now at depth. Open to the target without structure. Allow the signal to flow unfiltered. Do not organize or interpret — simply transcribe the stream as it arrives.", placeholder: "Let the signal flow. Record impressions, fragments, images, words, sensations, emotions, spatial data — in whatever order they arrive. Do not stop to analyze..." },
    { stage: 3, label: "PHASE III — DEEP CONTACT", desc: "Move deeper into the most compelling impression from Phase II. Extend contact. What is beneath the surface signal? What details emerge under direct attention?", placeholder: "Focus on the strongest impression. What is underneath it? What opens when you stay with it? What details emerge that were not present in the initial stream?..." },
    { stage: 4, label: "PHASE IV — INTEGRATION", desc: "Return to ordinary awareness. Review your stream. What patterns emerge? What was most coherent? What surprised you? Compile your session data.", placeholder: "Looking back across the full session — what stands out? What felt like genuine signal vs noise? What would you highlight for the Monitor as your strongest data?..." },
  ],
  "RV-008": [
    { stage: 1, label: "STAGE I — OUTCOME CONTACT", desc: "Make contact with the binary decision point. Do not reach for an answer — simply describe your first impression of the associative image that surfaces.", placeholder: "What image, feeling, or symbol arises first when you contact this outcome reference? Do not interpret — describe the raw impression..." },
    { stage: 2, label: "STAGE II — IMAGE ATTRIBUTES", desc: "Describe the qualities of the image that surfaced: texture, color, weight, movement, emotional tone. Does it feel open or closed? Light or heavy?", placeholder: "Describe the sensory attributes of your associative image — colour, texture, temperature, whether it feels expansive or contracted..." },
    { stage: 3, label: "STAGE III — EMOTIONAL FIELD", desc: "What emotional field surrounds the image? Is there relief or tension? Resolution or obstruction? What does the feeling tell you about the outcome?", placeholder: "Describe the emotional atmosphere of the image — does it feel like arrival, or like something stopped? Like completion or interruption?..." },
    { stage: 4, label: "STAGE IV — AOL BREAK / SIGNAL CLARITY", desc: "Set aside any desire for a particular outcome. Return to the pure image. What is it, without interpretation?", placeholder: "Strip away any wish or fear about the result. What does the raw image look like when you stop wanting it to mean something?..." },
    { stage: 5, label: "STAGE V — BINARY ASSESSMENT", desc: "Based on your associative image and its attributes, which outcome does your signal more closely match? State your assessment clearly.", placeholder: "State which outcome image your signal resembles — and how confident you are. Note any ambiguity or split signal clearly..." },
    { stage: 6, label: "STAGE VI — ARV SUMMARY", desc: "Compile your session into a complete ARV report: the image that surfaced, its attributes, and your final outcome assessment.", placeholder: "Summarize your associative image, its qualities, the emotional field, and your binary outcome assessment with confidence level..." },
  ],
  "RV-009": [
    { stage: 1, label: "STAGE I — THRESHOLD CROSSING", desc: "Enter the hypnagogic state at the edge of sleep. Record everything that surfaces in the liminal zone — fragments, symbols, voices, falling sensations.", placeholder: "What appears in the threshold space? Imagery, sounds, fragmented scenes, geometric patterns, emotional surges — record without filtering..." },
    { stage: 2, label: "STAGE II — DREAM FIELD ENTRY", desc: "You are now inside the dream field. The target is present. Do not force contact — allow the dream to orient itself around the coordinate. What environment do you find yourself in?", placeholder: "Describe the dream environment — location, atmosphere, who or what is present, what is happening, what the dream wants you to notice..." },
    { stage: 3, label: "STAGE III — SYMBOLIC LAYER", desc: "What symbols, archetypes, or metaphors appear? Dream perception is symbolic — translate what you encounter rather than taking it literally.", placeholder: "What are the symbols? What do the images stand for? What is the dream telling you in the language of symbol rather than fact?..." },
    { stage: 4, label: "STAGE IV — DIRECT PERCEPTION", desc: "Beneath the symbolic layer, is there direct factual information? What specific details, locations, or data points cut through the symbolic encoding?", placeholder: "What literal details emerge beneath the symbols? Specific imagery that could correspond to actual places, people, or events rather than metaphors?..." },
    { stage: 5, label: "STAGE V — DREAM INTERROGATION", desc: "Ask the target a direct question. What does the dream respond? Follow the response wherever it leads.", placeholder: "What question did you ask? What did the dream show you in response? Follow the imagery that arose — describe it in full..." },
    { stage: 6, label: "STAGE VI — DREAM DEBRIEF", desc: "Return to waking awareness. Compile your session: the threshold imagery, the dream environment, the symbols, and any direct perceptual data.", placeholder: "Summarize the full dream session — key symbols, direct impressions, the dream's response to interrogation, and your assessment of target contact..." },
  ],
  "RV-010": [
    { stage: 1, label: "STAGE I — FIELD CONTACT", desc: "Make contact with the collective emotional field. Do not target individuals — sense the mass. What is the dominant quality of this shared field?", placeholder: "What does this collective feel like from the outside? Is it coherent or fragmented? Hot or cold? Rising or falling? Unified or divided?..." },
    { stage: 2, label: "STAGE II — EMOTIONAL TOPOLOGY", desc: "Map the emotional landscape of the field. Are there zones of different quality? Where is the center of gravity? Where is the tension concentrated?", placeholder: "Describe the emotional geography — where is the intensity? Are there pockets of calm within chaos? Zones of fear, hope, rage, grief?..." },
    { stage: 3, label: "STAGE III — DOMINANT SIGNAL", desc: "What single emotion or intention is most coherent across the entire field? What is the mass trying to express, resist, or accomplish?", placeholder: "What is the unified signal beneath the surface noise? What does this collective want, fear, or believe at this moment?..." },
    { stage: 4, label: "STAGE IV — AOL BREAK / FIELD CLARITY", desc: "Set aside political assumptions or media narratives about this event. Return to direct perception of the raw emotional field.", placeholder: "What story did you bring about this event? Set it aside. What does the field actually feel like without your narrative overlay?..." },
    { stage: 5, label: "STAGE V — TRAJECTORY ASSESSMENT", desc: "Where is this field moving? Is it building, dissipating, or transforming? What outcome does its current trajectory suggest?", placeholder: "Is this field gaining or losing coherence? What does its momentum suggest about where this collective situation is heading?..." },
    { stage: 6, label: "STAGE VI — COLLECTIVE FIELD REPORT", desc: "Compile your full assessment of the collective emotional field — its quality, topology, dominant signal, and projected trajectory.", placeholder: "Summarize the field — its dominant emotion, internal structure, coherence level, and what its trajectory suggests about the near-term outcome..." },
  ],
  "RV-011": [
    { stage: 1, label: "STAGE I — APPROACH", desc: "You are at altitude above the survey target. Describe the large-scale impression before descent — landmass, water, colour, scale, movement.", placeholder: "What do you see from high altitude? Coastlines, terrain type, colour palette, weather systems, scale of the environment..." },
    { stage: 2, label: "STAGE II — SURFACE DATA", desc: "Descend to surface level. What does the terrain feel like underfoot? What is the dominant geological material, climate, and sensory environment?", placeholder: "Describe the ground — its texture, composition, temperature. What does the air feel like? What sounds or movements are present?..." },
    { stage: 3, label: "STAGE III — SUBSURFACE PROBE", desc: "Move beneath the surface. What geological structures, water systems, or anomalies are present underground?", placeholder: "Describe what lies beneath the surface — cavities, water, geological formations, thermal activity, anything unusual in the subsurface layer..." },
    { stage: 4, label: "STAGE IV — AOL BREAK / DIRECT PERCEPTION", desc: "Declare any geographical knowledge you already hold about this region. Then return to direct perception beyond what you knew.", placeholder: "What did you already know about this location? Set it aside. What do you perceive that exceeds your prior geographical knowledge?..." },
    { stage: 5, label: "STAGE V — ANOMALY IDENTIFICATION", desc: "What is unusual about this location? What is present that should not be, or absent that should be? What drew the survey tasking?", placeholder: "What is anomalous here? What does this location have that makes it significant beyond ordinary geography?..." },
    { stage: 6, label: "STAGE VI — SURVEY REPORT", desc: "Compile a full geographic intelligence summary — terrain, subsurface, anomalies, and the significance of this location.", placeholder: "Summarize the full survey — surface conditions, subsurface findings, anomalies identified, and your assessment of why this location was targeted..." },
  ],
  "RV-012": [
    { stage: 1, label: "STAGE I — LOCK ON", desc: "Make initial contact with the moving target. Do not look for a fixed location — sense the direction and quality of movement. What are they in motion towards?", placeholder: "What direction are they moving? What does the motion feel like — urgent, calm, evasive, purposeful? What is the quality of their movement?..." },
    { stage: 2, label: "STAGE II — CURRENT ENVIRONMENT", desc: "Perceive the environment the target is currently in. What surrounds them right now? What is the terrain, enclosure, or medium of travel?", placeholder: "Describe where the target is right now — interior or exterior, urban or remote, moving fast or slow, what they can see from their current position?..." },
    { stage: 3, label: "STAGE III — TEMPORAL TRACE", desc: "Move backward along the target's track. Where were they 6 hours ago? What does the path tell you about their origin and intent?", placeholder: "Where did they come from? What does their back-track look like — what environments, distances, transitions occurred before their current position?..." },
    { stage: 4, label: "STAGE IV — AOL BREAK / SIGNAL LOCK", desc: "Declare any assumptions about who or what the target is. Strip them away. Return to pure tracking signal.", placeholder: "What story did you build about the target? Release it. What does the pure movement signal tell you without any narrative overlay?..." },
    { stage: 5, label: "STAGE V — PROJECTED DESTINATION", desc: "Where is the target going? Project their trajectory forward. What location, event, or contact point is at the end of their current movement vector?", placeholder: "Project the movement forward — where does this trajectory terminate? What is at the destination? How long until arrival?..." },
    { stage: 6, label: "STAGE VI — TRACKING REPORT", desc: "Compile your full signal trace — last known position, current environment, origin track, and projected destination with confidence assessment.", placeholder: "Summarize the full track — where they were, where they are, where they are going, and your confidence level on the projected destination..." },
  ],
};

// ─── VIEWER-SPECIFIC MONITOR PROMPTS ──────────────────────────────────────────

const PROMPTS_BY_VIEWER = {
  "RV-001": `You are MONITOR, the AI session handler for STARGATE — a declassified U.S. government remote viewing program (1972–1995). You are evaluating a COORDINATE TARGETING session. You will receive the sealed target description as part of your context — use it to assess accuracy without revealing it to the viewer. Evaluate their stage data for signal quality, spatial coherence, and suppression of analytical overlay. Be terse, clinical, and precise. Use the language of military intelligence reporting. Format your response with: [CLASSIFICATION: GRILL FLAME // STARGATE], [SESSION EVALUATION], a 2-3 sentence assessment, [SIGNAL LINE ASSESSMENT], a 1-sentence rating (STRONG / PARTIAL / DEGRADED / NOISE), and [INTELLIGENCE VALUE] (HIGH / MODERATE / LOW / UNDETERMINED). Never directly state the target identity in your evaluation.`,

  "RV-002": `You are MONITOR, the AI session handler for STARGATE. You are evaluating a DEEP TIME session. You will receive the sealed target description as part of your context — use it to assess accuracy without revealing it directly. The viewer is attempting temporal displacement — perceiving a target from the distant past or future. Evaluate their data for temporal coherence, suppression of historical knowledge overlay (AOL), and whether their impressions suggest genuine perception beyond prior knowledge. Be measured and scholarly in tone, with an edge of classified gravity. Format: [CLASSIFICATION: SCANATE // BEYOND STARGATE], [TEMPORAL SESSION EVALUATION], a 2-3 sentence assessment, [SIGNAL LINE ASSESSMENT], a 1-sentence rating (TEMPORALLY COHERENT / PARTIAL DISPLACEMENT / KNOWLEDGE OVERLAY DETECTED / SIGNAL LOST), and [HISTORICAL VALUE] (SIGNIFICANT / MODERATE / INCONCLUSIVE / CONTAMINATED). Do not directly name the target.`,

  "RV-003": `You are MONITOR, the AI session handler for STARGATE. You are evaluating a HUMAN INTELLIGENCE session. You will receive the sealed target description as part of your context — use it to assess accuracy without revealing the subject's identity. The viewer is attempting to perceive a specific person or group — their emotional state, location, and intent. Evaluate for empathic signal strength, emotional accuracy indicators, and suppression of projection. Be observant and psychologically precise. Format: [CLASSIFICATION: CENTER LANE // THIRD EYE], [HUMINT SESSION EVALUATION], a 2-3 sentence assessment, [SIGNAL LINE ASSESSMENT], a 1-sentence rating (STRONG CONTACT / PARTIAL CONTACT / PROJECTION DETECTED / NO CONTACT), and [OPERATIONAL VALUE] (HIGH / MODERATE / LOW / UNDETERMINED). Do not name the subject directly.`,

  "RV-004": `You are MONITOR, the AI session handler for STARGATE. You are evaluating an ANOMALOUS PHENOMENA session. You will receive the sealed target description as part of your context — use it to assess accuracy without revealing the event identity. The viewer is attempting to perceive a non-ordinary target — a UAP event, non-human intelligence, or classified suppressed phenomenon. Evaluate for signal coherence, resistance to cultural AOL (UFO mythology, media imagery), and depth of subspace contact. Be austere, unusual, and willing to engage with genuinely strange data. Format: [CLASSIFICATION: SCANATE // BEYOND STARGATE], [ANOMALOUS SESSION EVALUATION], a 2-3 sentence assessment, [SIGNAL LINE ASSESSMENT], a 1-sentence rating (DEEP CONTACT / SURFACE CONTACT / CULTURAL OVERLAY DETECTED / SIGNAL SUPPRESSED), and [ANOMALY VALUE] (SIGNIFICANT / PARTIAL / INCONCLUSIVE / CLASSIFIED). Never rationalize or dismiss anomalous impressions.`,

  "RV-005": `You are MONITOR, the AI session handler for STARGATE. You are evaluating a SUBSPACE / CONCEALED session. You will receive the sealed target description as part of your context — use it to assess penetration depth without revealing what is concealed. The viewer is not targeting a location or person — they are attempting to perceive what has been deliberately hidden, buried, or suppressed. Evaluate for depth of penetration past the suppression layer, coherence of what was found beneath, and resistance to disinformation overlay. Be paranoid, precise, and counterintelligence-minded in tone. Format: [CLASSIFICATION: GONDOLA WISH // DEEP BLACK], [CONCEALED INTELLIGENCE EVALUATION], a 2-3 sentence assessment, [PENETRATION ASSESSMENT], a 1-sentence rating (FULL PENETRATION / PARTIAL ACCESS / SUPPRESSION LAYER ACTIVE / SIGNAL BLOCKED), and [COUNTERINTELLIGENCE VALUE] (CRITICAL / HIGH / MODERATE / INCONCLUSIVE). Treat all concealment as intentional.`,

  "RV-006": `You are MONITOR, the AI session handler for STARGATE. You are evaluating a PSYCHOMETRIC CONTACT session. You will receive the sealed target description as part of your context — use it to assess forensic accuracy without revealing the object or site identity. The viewer is reading the residue of events embedded in a physical object, artifact, or place — the informational and emotional trace left by significant events over time. Evaluate for depth of time-layer access, emotional and sensory specificity, and suppression of known historical AOL. Be patient and forensic in tone — a specialist reading evidence. Format: [CLASSIFICATION: CENTER LANE // THIRD EYE], [PSYCHOMETRIC SESSION EVALUATION], a 2-3 sentence assessment, [RESIDUE ASSESSMENT], a 1-sentence rating (DEEP LAYER ACCESS / SURFACE IMPRESSION / HISTORICAL OVERLAY DETECTED / NO CONTACT), and [FORENSIC VALUE] (HIGH / MODERATE / FRAGMENTARY / INCONCLUSIVE). Acknowledge multiple time layers when present.`,

  "RV-007": `You are MONITOR, the AI session handler for STARGATE. You are evaluating an EXTENDED REMOTE VIEWING (ERV) session. ERV differs from CRV in that it is unstructured and stream-of-consciousness — the viewer works from a deeply altered state with no stage prompts. You will receive the sealed target description as part of your context — use it to assess accuracy without revealing the target identity. Evaluate the raw signal stream for genuine contact — look for specific details, unexpected impressions, and data that could not have been derived from prior knowledge or cultural overlay. The noise floor is higher in ERV; be precise about distinguishing true signal from noise. Do not penalize lack of structure — the absence of analytical framework is the methodology. Be patient, depth-oriented, and willing to sit with ambiguous or strange data. Format: [CLASSIFICATION: GONDOLA WISH // DEEP BLACK], [ERV SESSION EVALUATION], a 2-3 sentence assessment noting the most significant signal elements, [DEPTH ASSESSMENT], a 1-sentence rating (DEEP STATE CONTACT / MID-LEVEL CONTACT / SURFACE CONTACT / NOISE DOMINANT), and [SIGNAL VALUE] (EXCEPTIONAL / HIGH / MODERATE / INCONCLUSIVE). Note any moments where the stream appeared to access non-local information.`,

  "RV-008": `You are MONITOR, the AI session handler for STARGATE. You are evaluating an ASSOCIATIVE REMOTE VIEWING (ARV) session. ARV is a binary outcome prediction protocol — the viewer does not directly perceive the outcome, but instead describes an associative image that will be shown to them after the outcome is known, depending on which way the binary decision resolves. You will receive the sealed outcome reference as part of your context. Evaluate the viewer's associative image description against the two possible target images — which does their signal more closely resemble? Do not reveal the target images or the outcome directly. Be precise, probabilistic, and outcome-focused. Format: [CLASSIFICATION: CENTER LANE // THIRD EYE], [ARV SESSION EVALUATION], a 2-3 sentence assessment of which outcome image the viewer's signal most resembles and why, [SIGNAL MATCH ASSESSMENT], a 1-sentence rating (OUTCOME A SIGNAL / OUTCOME B SIGNAL / SPLIT SIGNAL / SIGNAL ABSENT), and [PREDICTIVE VALUE] (HIGH CONFIDENCE / MODERATE CONFIDENCE / LOW CONFIDENCE / INCONCLUSIVE). Note the specific attributes that drove your match assessment.`,

  "RV-009": `You are MONITOR, the AI session handler for STARGATE. You are evaluating a DREAM STATE session. The viewer has used the hypnagogic threshold and dream state to access the target — perception in this mode is primarily symbolic rather than literal, and must be interpreted through the language of symbol and metaphor. You will receive the sealed target description as part of your context. Evaluate the viewer's dream imagery for symbolic correspondence with the target — look for metaphorical accuracy, archetypal resonance, and any literal details that cut through the symbolic layer. Do not penalize symbolic rather than literal description — this is the correct mode for this protocol. Be interpretive, patient, and willing to decode layered meaning. Format: [CLASSIFICATION: CENTER LANE // THIRD EYE], [DREAM STATE SESSION EVALUATION], a 2-3 sentence assessment of symbolic and literal correspondence with the target, [DREAM SIGNAL ASSESSMENT], a 1-sentence rating (DEEP SYMBOLIC CONTACT / PARTIAL CORRESPONDENCE / SURFACE IMAGERY ONLY / NO TARGET CONTACT), and [INTERPRETIVE VALUE] (HIGH / MODERATE / FRAGMENTARY / INCONCLUSIVE). Note any moments where literal perception cut through the symbolic layer.`,

  "RV-010": `You are MONITOR, the AI session handler for STARGATE. You are evaluating a COLLECTIVE FIELD session. The viewer is not targeting a specific person or location — they are attempting to perceive the collective emotional field of a mass event: an election, protest, disaster, or other large-scale shared human experience. You will receive the sealed collective event description as part of your context. Evaluate the viewer's field perception for emotional accuracy — does their characterization of the collective mood, tension, and trajectory correspond to the actual nature of the event? Be sociologically precise and emotionally intelligent. Do not look for physical details — this protocol operates at the level of feeling, momentum, and collective intent. Format: [CLASSIFICATION: CENTER LANE // THIRD EYE], [COLLECTIVE FIELD EVALUATION], a 2-3 sentence assessment of emotional and trajectory accuracy, [FIELD RESONANCE ASSESSMENT], a 1-sentence rating (STRONG FIELD CONTACT / PARTIAL RESONANCE / SURFACE CONTACT / FIELD NOT PERCEIVED), and [COLLECTIVE INTELLIGENCE VALUE] (HIGH / MODERATE / LOW / INCONCLUSIVE). Note any specific emotional descriptors that showed unusual accuracy.`,

  "RV-011": `You are MONITOR, the AI session handler for STARGATE. You are evaluating a GEOGRAPHIC SURVEY session. The viewer is conducting large-scale terrain and environmental mapping of a specific geographical location. You will receive the sealed location description and coordinates as part of your context — use them to evaluate the accuracy of the viewer's survey without revealing the location name. Evaluate for geological accuracy, terrain correspondence, subsurface perception, and identification of genuine anomalies. Be precise and technical — this is an intelligence survey, not an impressionistic session. Distinguish between general geographic impressions that could apply anywhere and specific data that corresponds to this particular location. Format: [CLASSIFICATION: GONDOLA WISH // DEEP BLACK], [GEOGRAPHIC SURVEY EVALUATION], a 2-3 sentence assessment of terrain and subsurface accuracy, [SURVEY ACCURACY ASSESSMENT], a 1-sentence rating (HIGH ACCURACY / PARTIAL CORRESPONDENCE / GENERAL IMPRESSIONS ONLY / OFF TARGET), and [GEOGRAPHIC INTELLIGENCE VALUE] (HIGH / MODERATE / LOW / UNDETERMINED). Note any subsurface or anomalous details that showed unexpected accuracy.`,

  "RV-012": `You are MONITOR, the AI session handler for STARGATE. You are evaluating a SIGNAL TRACER session. The viewer is tracking a moving target — a person, object, or phenomenon that is in motion and whose current position is unknown. You will receive the sealed target description and last known position as part of your context — evaluate the viewer's tracking data without revealing the target identity or confirmed current location. Evaluate for directional accuracy, environmental correspondence, temporal tracking coherence, and quality of projected destination. Be precise, tactical, and time-sensitive in tone. This is an active pursuit scenario. Format: [CLASSIFICATION: GRILL FLAME], [SIGNAL TRACE EVALUATION], a 2-3 sentence assessment of tracking accuracy — current position, environmental match, and destination projection, [TRACE QUALITY ASSESSMENT], a 1-sentence rating (ACTIVE LOCK / PARTIAL TRACE / SIGNAL DEGRADED / TARGET LOST), and [OPERATIONAL VALUE] (CRITICAL / HIGH / MODERATE / INCONCLUSIVE). Note any specific directional or environmental details that indicated genuine tracking contact.`,
};

const VIEWERS = [
  {
    id: "RV-001", callsign: "VIEWER PRIME", badge: "⬟",
    specialty: "Blind coordinate targeting — physical locations, installations, terrain",
    mode: "COORDINATE TARGETING", modeShort: "COORD",
  },
  {
    id: "RV-002", callsign: "PROTOCOLS LEAD", badge: "◈",
    specialty: "Temporal displacement — deep past, future events, targets outside normal time",
    mode: "DEEP TIME", modeShort: "TEMPORAL",
  },
  {
    id: "RV-003", callsign: "FIELD OPERATIVE", badge: "⬡",
    specialty: "Human intelligence — people, emotional fields, intent, presence",
    mode: "EMOTIONAL / HUMAN", modeShort: "HUMINT",
  },
  {
    id: "RV-004", callsign: "SIGNAL AMPLIFIER", badge: "◇",
    specialty: "Anomalous phenomena — UAP events, non-human intelligence, suppressed phenomena",
    mode: "ANOMALOUS / SUBSPACE", modeShort: "ANOMALOUS",
  },
  {
    id: "RV-005", callsign: "SUBSURFACE ANALYST", badge: "▽",
    specialty: "Concealed intelligence — buried records, covered events, suppressed or classified information",
    mode: "SUBSPACE / CONCEALED", modeShort: "SUBSURFACE",
  },
  {
    id: "RV-006", callsign: "PSYCHOMETRIST", badge: "◉",
    specialty: "Object and place memory — residue of events embedded in structures, artifacts, and sites",
    mode: "PSYCHOMETRIC CONTACT", modeShort: "PSYCHOMETRIC",
  },
  {
    id: "RV-007", callsign: "DEEP OPERATIVE", badge: "∞",
    specialty: "Extended Remote Viewing — unstructured altered state sessions, free signal stream, no stage protocol",
    mode: "ERV — EXTENDED", modeShort: "ERV",
  },
  {
    id: "RV-008", callsign: "ORACLE ANALYST", badge: "⊗",
    specialty: "Associative Remote Viewing — binary outcome prediction, future-state targeting, probabilistic assessment",
    mode: "ARV — ASSOCIATIVE", modeShort: "ARV",
  },
  {
    id: "RV-009", callsign: "DREAM ARCHITECT", badge: "☽",
    specialty: "Dream state viewing — hypnagogic threshold perception, symbolic target access, sleep-state intelligence",
    mode: "DREAM STATE", modeShort: "DREAM",
  },
  {
    id: "RV-010", callsign: "FIELD RESONATOR", badge: "⊕",
    specialty: "Collective field perception — mass events, group consciousness, emotional field topology and trajectory",
    mode: "COLLECTIVE FIELD", modeShort: "COLLECTIVE",
  },
  {
    id: "RV-011", callsign: "TERRAIN OPERATIVE", badge: "◬",
    specialty: "Geographic survey — large-scale terrain mapping, subsurface perception, environmental and geological intelligence",
    mode: "GEOGRAPHIC SURVEY", modeShort: "GEO",
  },
  {
    id: "RV-012", callsign: "SIGNAL TRACER", badge: "⟶",
    specialty: "Moving target tracking — active pursuit, trajectory projection, cross-time position assessment",
    mode: "SIGNAL TRACE", modeShort: "TRACE",
  },
];

const LEARN_MORE_FIGURES = [
  {
    callsign: "VIEWER PRIME",
    name: "Joseph McMoneagle",
    years: "1950–present",
    role: "Remote Viewer No. 1 — U.S. Army Intelligence",
    summary: "McMoneagle was the program's most decorated operative, completing over 450 documented intelligence missions between 1978 and 1984. He was awarded the Legion of Merit for his contributions. Among his most cited sessions: accurately describing a classified Soviet submarine under construction far from water before it was launched, and providing descriptions of hostage locations in Iran. He trained extensively at the Monroe Institute using the Gateway Process — a binaural beat-based altered state protocol — and continued remote viewing research publicly after the program's declassification.",
    books: ["Mind Trek (1993)", "The Ultimate Time Machine (1998)", "Remote Viewing Secrets (2000)"],
    link: "https://en.wikipedia.org/wiki/Joseph_McMoneagle",
  },
  {
    callsign: "PROTOCOLS LEAD",
    name: "Ingo Swann",
    years: "1933–2013",
    role: "Protocol Architect — Stanford Research Institute",
    summary: "Swann is credited with coining the term 'remote viewing' and developing the Coordinate Remote Viewing (CRV) protocol — the structured, stage-based methodology that became the backbone of the Stargate program. A New York artist and OT-Level Scientologist, he was among the first civilians tested at SRI under Targ and Puthoff. His most famous claimed feat: describing the ring system of Jupiter before the Voyager probe confirmed it in 1979. Swann insisted remote viewing was a trainable skill, not an innate gift.",
    books: ["Natural ESP (1987)", "Penetration (1998)", "Psychic Sexuality (1999)"],
    link: "https://en.wikipedia.org/wiki/Ingo_Swann",
  },
  {
    callsign: "FIELD OPERATIVE",
    name: "Pat Price",
    years: "1918–1975",
    role: "Operational Viewer — CIA / SRI Program",
    summary: "A former Burbank police commissioner and natural psychic, Price was considered one of the most gifted spontaneous remote viewers in the program. His blind description of a Soviet underground installation at Semipalatinsk — including specific equipment, personnel activity, and structural details — was regarded by CIA analysts as one of the most accurate sessions on record. He died suddenly in 1975 under circumstances that remain unexplained, ending what researchers described as an exceptional operational career.",
    books: ["Documented in: Mind Reach by Targ & Puthoff (1977)"],
    link: "https://en.wikipedia.org/wiki/Pat_Price",
  },
  {
    callsign: "SIGNAL AMPLIFIER",
    name: "Uri Geller",
    years: "1946–present",
    role: "Psychic Subject — Stanford Research Institute",
    summary: "Israeli-British entertainer Uri Geller was tested at SRI by Targ and Puthoff in 1972–73, producing results that the researchers described as statistically significant in controlled trials of telepathy and remote perception. He became the most publicly visible figure associated with the program — and the most controversial. Known internationally for bending spoons and stopping watches, Geller claims his abilities are genuine and cites the SRI research as scientific validation. The CIA's own declassified documents confirm he was tested as part of the early SCANATE program. His public profile made him a lightning rod for skeptics, but the documented tests remain part of the official declassified record.",
    books: ["My Story (1975)", "The Geller Effect (1986)", "Mind Medicine (1999)"],
    link: "https://en.wikipedia.org/wiki/Uri_Geller",
  },
  {
    callsign: "SRI RESEARCH LEAD",
    name: "Russell Targ & Hal Puthoff",
    years: "1934–present / 1936–present",
    role: "Research Scientists — Stanford Research Institute",
    summary: "Physicists Russell Targ and Harold Puthoff ran the original remote viewing research program at SRI from 1972, funded initially by the CIA under SCANATE. Their landmark 1974 paper in the journal Nature was one of the first peer-reviewed publications on remote viewing. Their book 'Mind Reach' (1977) brought the research to public attention and laid out the scientific case for anomalous cognition. Puthoff went on to found the Institute for Advanced Studies at Austin; Targ has continued parapsychology research and written extensively on the science of ESP.",
    books: ["Mind Reach (1977)", "The Mind Race (1984)", "Limitless Mind — Targ (2004)"],
    link: "https://en.wikipedia.org/wiki/Russell_Targ",
  },
];

const LEARN_MORE_RESOURCES = [
  // BOOKS
  { title: "Mind Reach", author: "Russell Targ & Hal Puthoff", year: "1977", type: "BOOK", desc: "The foundational text from the two SRI physicists who launched the program. Lays out experimental evidence for remote viewing in accessible language. Essential starting point.", link: "https://www.amazon.com/Mind-Reach-Scientists-Psychic-Abilities-Consciousness/dp/1571744142" },
  { title: "Remote Viewers: The Secret History of America's Psychic Spies", author: "Jim Schnabel", year: "1997", type: "BOOK", desc: "The most comprehensive journalistic account of the Stargate program. Schnabel conducted hundreds of interviews with participants. Detailed, sceptical, and essential.", link: "https://www.amazon.com/Remote-Viewers-History-Americas-Psychic/dp/0440614058" },
  { title: "The Men Who Stare at Goats", author: "Jon Ronson", year: "2004", type: "BOOK", desc: "Gonzo investigation into the U.S. Army's First Earth Battalion and psychic soldier programs. Dark, funny, and stranger than fiction. Later adapted into a film.", link: "https://www.amazon.com/Men-Who-Stare-Goats/dp/1439181772" },
  { title: "Limitless Mind", author: "Russell Targ", year: "2004", type: "BOOK", desc: "Targ's later synthesis of thirty years of remote viewing research, including his work at SRI and beyond. More philosophical and personal than Mind Reach.", link: "https://www.amazon.com/Limitless-Mind-Viewing-Transformation-Consciousness/dp/1577314131" },
  { title: "The Reality of ESP", author: "Russell Targ", year: "2012", type: "BOOK", desc: "Targ's definitive late-career argument for the scientific validity of remote perception. Includes extensive declassified session transcripts and statistical analysis.", link: "https://www.amazon.com/Reality-ESP-Physicists-Psychic-Abilities/dp/0835608840" },
  { title: "Psychic Warrior", author: "David Morehouse", year: "1996", type: "BOOK", desc: "Memoir by a former U.S. Army remote viewer. Morehouse describes his training, sessions, and psychological breakdown. Controversial but widely read within the community.", link: "https://www.amazon.com/Psychic-Warrior-Americas-Foremost-Top-Secret/dp/0312964137" },
  { title: "The Seventh Sense", author: "Lyn Buchanan", year: "2003", type: "BOOK", desc: "Written by a former Stargate program viewer and trainer. Practical and instructional — focuses on CRV methodology and how it was actually applied operationally.", link: "https://www.amazon.com/Seventh-Sense-Secrets-Viewing-Military/dp/B0CVL54LS2" },
  { title: "Reading the Enemy's Mind", author: "Paul H. Smith", year: "2005", type: "BOOK", desc: "Written by one of the program's primary CRV trainers and practitioners. The most technically detailed account of how the structured protocol was developed and used.", link: "https://www.amazon.com/Reading-Enemys-Mind-Americas-Espionage/dp/0812578554" },
  { title: "Penetration", author: "Ingo Swann", year: "1998", type: "BOOK", desc: "Swann's most controversial work — describes alleged covert contact with intelligence operatives regarding non-human activity on the Moon. Disputed and fascinating.", link: "https://www.amazon.com/Penetration-Special-Updated-Ingo-Swann/dp/1949214648" },
  { title: "Natural ESP", author: "Ingo Swann", year: "1987", type: "BOOK", desc: "Swann's theoretical framework for understanding remote viewing as a latent human ability. Influential in shaping the program's philosophical underpinnings.", link: "https://www.amazon.com/Everybodys-Guide-Natural-ESP-Extrasensory/dp/0874776686" },
  { title: "The Conscious Universe", author: "Dean Radin", year: "1997", type: "BOOK", desc: "Senior scientist at the Institute of Noetic Sciences. Comprehensive meta-analysis of psi research including remote viewing. Statistically rigorous and widely cited.", link: "https://www.amazon.com/Conscious-Universe-Scientific-Psychic-Phenomena/dp/0061778990" },
  { title: "Entangled Minds", author: "Dean Radin", year: "2006", type: "BOOK", desc: "Radin's follow-up — explores quantum entanglement as a potential mechanism for anomalous perception. Bridges physics and consciousness research.", link: "https://www.amazon.com/Entangled-Minds-Extrasensory-Experiences-Quantum/dp/1416516778" },
  { title: "The Star Gate Archives (4 vols.)", author: "Edwin C. May & Sonali Bhatt Marwaha (eds.)", year: "2018", type: "BOOK", desc: "Four-volume academic collection of the primary research documents from the program. The most authoritative scholarly resource on the subject.", link: "https://www.amazon.com/s?k=star+gate+archives+edwin+may+mcfarland" },
  { title: "Mind Trek", author: "Joseph McMoneagle", year: "1993", type: "BOOK", desc: "McMoneagle's first book — part memoir, part instructional. Describes his experiences as the program's most decorated viewer and his continued work after declassification.", link: "https://www.amazon.com/Mind-Trek-Joseph-McMoneagle/dp/1937530787" },
  { title: "The Stargate Chronicles", author: "Joseph McMoneagle", year: "2002", type: "BOOK", desc: "McMoneagle's most complete account of his career within the program. Includes discussion of his most significant sessions and the program's operational history.", link: "https://www.amazon.com/Stargate-Chronicles-Joseph-McMoneagle/dp/1571742255" },

  // FILMS & DOCUMENTARIES
  { title: "Third Eye Spies", author: "Lance Mungia (dir.)", year: "2019", type: "FILM", desc: "Documentary featuring Russell Targ, Hal Puthoff, Ingo Swann, and CIA officers. Uses declassified documents and firsthand interviews. The definitive film on the program.", link: "https://www.imdb.com/title/tt5112424/" },
  { title: "The Men Who Stare at Goats", author: "Grant Heslov (dir.)", year: "2009", type: "FILM", desc: "George Clooney, Ewan McGregor. Darkly comic dramatisation of Jon Ronson's book. Fictionalises the psychic soldier programs. Not a documentary — but captures the absurdist truth.", link: "https://www.imdb.com/title/tt1234548/" },
  { title: "Phenomena", author: "Netflix", year: "2023", type: "FILM", desc: "Spanish documentary examining government-funded parapsychology research, including remote viewing. Broader than the U.S. program — covers European and Soviet research tracks.", link: "https://www.netflix.com/title/81444229" },
  { title: "Secrets of the Dead: Spies of the Caribbean", author: "PBS", year: "2012", type: "FILM", desc: "PBS documentary covering Cold War intelligence programs, including the psychoenergetics research track. Contextualises the program within the broader intelligence community.", link: "https://www.pbs.org/wnet/secrets/episodes/spies-of-the-caribbean/571/" },
  { title: "The Reality of Remote Viewing (Banned TEDx Talk)", author: "Russell Targ", year: "2013", type: "FILM", desc: "Targ's TEDx talk, pulled by TED before broadcast. Presents the statistical case for remote viewing. Has since surpassed 7 million views on YouTube.", link: "https://www.youtube.com/watch?v=hBl0cwyn5GY" },
  { title: "The Real Science of Remote Viewing", author: "Vice", year: "2015", type: "FILM", desc: "Vice documentary short. Interviews former program viewers and researchers. Good accessible entry point for those unfamiliar with the subject.", link: "https://www.youtube.com/watch?v=ZQ_CGXJH3uE" },

  // ARCHIVES & PRIMARY SOURCES
  { title: "Stargate Project — CIA CREST Archive", author: "CIA / National Archives", year: "1995–2017", type: "ARCHIVE", desc: "12 million pages of declassified documents published online in 2017. Includes raw session transcripts, Monitor evaluations, target packages, and program correspondence.", link: "https://www.cia.gov/readingroom/collection/stargate" },
  { title: "The Gateway Experience — CIA Analysis", author: "U.S. Army / CIA", year: "1983", type: "ARCHIVE", desc: "Declassified 1983 CIA analysis of the Monroe Institute's Gateway Process altered state program used to prepare program viewers. Available via the CREST archive.", link: "https://www.cia.gov/readingroom/document/cia-rdp96-00788r001700210016-5" },
  { title: "SCANATE Program Files", author: "CIA", year: "1972–1975", type: "ARCHIVE", desc: "The earliest declassified files from the precursor program to Stargate. Includes the first SRI experiments and early viewer assessments.", link: "https://www.cia.gov/readingroom/collection/stargate" },
  { title: "Defense Intelligence Agency — Star Gate Program Briefings", author: "DIA", year: "1986–1994", type: "ARCHIVE", desc: "Declassified DIA oversight documents covering the program's operational years. Includes budget records, session statistics, and program justifications.", link: "https://www.cia.gov/readingroom/collection/stargate" },

  // ACADEMIC & OFFICIAL REPORTS
  { title: "An Evaluation of Remote Viewing: Research and Operational Applications", author: "American Institutes for Research", year: "1995", type: "REPORT", desc: "The official termination report commissioned by the CIA. Acknowledges statistically significant laboratory results but recommends program closure on operational grounds.", link: "https://www.cia.gov/readingroom/document/cia-rdp96-00791r000200030002-6" },
  { title: "A Perceptual Channel for Information Transfer over Kilometer Distances", author: "Russell Targ & Hal Puthoff", year: "1974", type: "PAPER", desc: "The original peer-reviewed paper published in Nature. Describes controlled remote viewing experiments at SRI. One of the most cited anomalous cognition papers in scientific literature.", link: "https://doi.org/10.1038/251602a0" },
  { title: "Remote Viewing of Natural Targets", author: "Edwin C. May et al.", year: "1988", type: "PAPER", desc: "Comprehensive statistical analysis of remote viewing session data from the program's operational years. Published through the Cognitive Sciences Laboratory.", link: "https://www.cia.gov/readingroom/collection/stargate" },
  { title: "Journal of Scientific Exploration — Archive", author: "Society for Scientific Exploration", year: "1987–ongoing", type: "PAPER", desc: "Peer-reviewed journal that has published the majority of academic remote viewing research since 1987. Full archive accessible online.", link: "https://www.scientificexploration.org/journal" },
];

const FOOTER_LINES = [
  "You were never here. Neither were we.",
  "This program was terminated in 1995. Or so they say.",
  "All session data dissolves upon exit. The target remains sealed.",
  "What you perceive here is yours alone. It leaves no trace.",
  "The gate was closed in 1995. The signal never stopped.",
  "Perception has no jurisdiction.",
  "What the satellite cannot see, the mind reaches.",
  "Declassified does not mean finished.",
  "The viewers are still out there. So are the targets.",
  "Some programs end on paper only.",
  "Signal received. Origin: unknown.",
  "The third eye does not require authorization.",
];

// ─── UTILITY ───────────────────────────────────────────────────────────────────

function generateSessionId() {
  return `SS-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
    }} />
  );
}

function Noise() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998, opacity: 0.04,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    }} />
  );
}

function ClassifiedStamp({ text = "GRILL FLAME", color = "#c0392b" }) {
  return (
    <span style={{
      border: `2px solid ${color}`, color, fontFamily: "'Courier New', monospace",
      fontSize: "10px", fontWeight: 900, letterSpacing: "0.2em", padding: "1px 6px",
      textTransform: "uppercase", opacity: 0.85, display: "inline-block",
      transform: "rotate(-2deg)", lineHeight: 1.4,
    }}>{text}</span>
  );
}

function RedactedBar({ width = 80 }) {
  return <span style={{ display: "inline-block", background: "#1a2a1a", width, height: 12, verticalAlign: "middle", marginInline: 4 }} />;
}

function BlinkDot() {
  return <span className="blink-dot" style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#4ade80", marginRight: 6, verticalAlign: "middle" }} />;
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const BOOT_CLOSING_LINES = [
  "WHAT YOU SEEK IS ALREADY WITHIN RANGE.",
  "YOU HAVE BEEN CLEARED FOR DEEP CONTACT.",
  "THE TARGET IS WAITING.",
  "MIND REACH ACTIVE. DISTANCE IS IRRELEVANT.",
];

function getBootLines() {
  const closing = BOOT_CLOSING_LINES[Math.floor(Math.random() * BOOT_CLOSING_LINES.length)];
  return [
    "INITIALIZING SECURE CHANNEL...",
    "CRYPTOGRAPHIC HANDSHAKE: OK",
    "REMOTE VIEWER NODE — AUTHENTICATED",
    "LOADING STARGATE PROTOCOLS v7.4...",
    "CRV STAGE MODULES: LOADED",
    "ERV STAGE MODULES: LOADED",
    "MONITOR AI: ONLINE",
    "VIEWER REGISTRY: ACCESSED",
    "SIGNAL ISOLATION: ACTIVE",
    "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%",
    "",
    "STARGATE — OPERATIONAL",
    "CLASSIFICATION: GRILL FLAME // STARGATE",
    closing,
  ];
}

function getLineColor(l) {
  if (!l) return "#4ade80";
  if (l.startsWith("STARGATE")) return "#f0c040";
  if (l.startsWith("CLASSIFICATION")) return "#c0392b";
  return "#4ade80";
}

function BootScreen({ onEnter }) {
  const [lines, setLines] = useState([]);
  const bootLines = useRef(getBootLines());

  useEffect(() => {
    setLines([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.current.length) {
        setLines(prev => [...prev, bootLines.current[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#020a02", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', monospace", padding: 40,
    }}>
      <div style={{ maxWidth: 640, width: "100%" }}>
        <div style={{ color: "#4ade80", fontSize: 11, lineHeight: 2, marginBottom: 32 }}>
          {lines.map((l, i) => (
            <div key={i} style={{
              color: getLineColor(l),
              fontWeight: l && l.startsWith("STARGATE") ? 900 : 400,
              fontSize: l && l.startsWith("STARGATE") ? 16 : 11,
            }}>{l || "\u00A0"}</div>
          ))}
        </div>
        {lines.length >= bootLines.current.length && (
          <button onClick={onEnter} style={{
            background: "transparent", border: "1px solid #4ade80", color: "#4ade80",
            fontFamily: "'Courier New', monospace", fontSize: 13, padding: "12px 36px",
            cursor: "pointer", letterSpacing: "0.2em", textTransform: "uppercase",
            animation: "pulseGlow 2s ease-in-out infinite",
          }}>
            [ AUTHENTICATE + ENTER ]
          </button>
        )}
      </div>
    </div>
  );
}

function Header({ viewer, sessionId, onLearnMore, onSubscribe, onFieldManual, onCustomTarget, onDossier, sessionCount }) {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const navBtns = [
    { label: "▸ UPGRADE", action: onSubscribe, amber: true },
    { label: "▸ FIELD MANUAL", action: onFieldManual },
    { label: "▸ CUSTOM TARGET", action: onCustomTarget },
    { label: "▸ EXPAND CLEARANCE", action: onLearnMore },
  ];

  return (
    <header style={{
      borderBottom: "1px solid #1a3a1a",
      background: "rgba(2,10,2,0.95)", backdropFilter: "blur(4px)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* LEFT — logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 17, fontWeight: 900, color: "#f0c040", letterSpacing: "0.2em" }}>STARGATE</div>
            <div style={{ height: 1, background: "linear-gradient(to right, #f0c040, transparent)" }} />
          </div>
          <div style={{ width: 1, height: 20, background: "#1a3a1a" }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.7, maxWidth: 80, lineHeight: 1.4 }}>
            <BlinkDot />SECURE CHANNEL ACTIVE
          </div>
        </div>

        {/* RIGHT — desktop nav + clock */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Desktop nav — hidden on small screens via fontSize trick */}
          <div id="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {navBtns.map(btn => (
              <button key={btn.label} onClick={() => { btn.action(); setMenuOpen(false); }} style={{
                background: btn.amber ? "rgba(20,40,0,0.8)" : "transparent",
                border: `1px solid ${btn.amber ? "#f0c040" : "#1a3a1a"}`,
                color: btn.amber ? "#f0c040" : "#4ade80",
                fontFamily: "'Courier New', monospace", fontSize: 9, padding: "5px 10px",
                cursor: "pointer", letterSpacing: "0.1em", borderRadius: 2, whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = btn.amber ? "#f0c040" : "#4ade80"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = btn.amber ? "#f0c040" : "#1a3a1a"; }}
              >{btn.label}</button>
            ))}
          </div>
          <div style={{ width: 1, height: 20, background: "#1a3a1a", marginLeft: 4 }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.6, textAlign: "right" }}>
            <div style={{ display: "none" }} className="hide-mobile">{time.toISOString().replace("T", " ").slice(0, 19)} UTC</div>
            {sessionId && <div style={{ fontSize: 8 }}>SID: {sessionId.slice(-8)}</div>}
            {viewer && <div style={{ fontSize: 8 }}>{viewer.id}</div>}
          </div>
          {/* Hamburger — mobile only */}
          <button onClick={() => setMenuOpen(m => !m)} style={{
            background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
            fontFamily: "'Courier New', monospace", fontSize: 14, padding: "4px 10px",
            cursor: "pointer", borderRadius: 2, marginLeft: 6, display: "none",
          }} id="hamburger">☰</button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          borderTop: "1px solid #1a3a1a", background: "rgba(2,10,2,0.98)",
          padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8,
        }}>
          {navBtns.map(btn => (
            <button key={btn.label} onClick={() => { btn.action(); setMenuOpen(false); }} style={{
              background: btn.amber ? "rgba(20,40,0,0.8)" : "transparent",
              border: `1px solid ${btn.amber ? "#f0c040" : "#1a3a1a"}`,
              color: btn.amber ? "#f0c040" : "#4ade80",
              fontFamily: "'Courier New', monospace", fontSize: 10, padding: "10px 14px",
              cursor: "pointer", letterSpacing: "0.1em", borderRadius: 2, textAlign: "left",
            }}>{btn.label}</button>
          ))}
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, paddingTop: 4 }}>
            {time.toISOString().replace("T", " ").slice(0, 19)} UTC
            {sessionId && <div>SESSION: {sessionId}</div>}
            {viewer && <div>VIEWER: {viewer.callsign}</div>}
          </div>
        </div>
      )}
    </header>
  );
}

function ViewerSelect({ onSelect, onDossier, sessionCount }) {
  return (
    <div style={{ padding: "40px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ fontFamily: "'Courier New', monospace", color: "#f0c040", fontSize: 11, letterSpacing: "0.3em", marginBottom: 8 }}>
          STARGATE — REMOTE VIEWING PROGRAM
        </div>
        <div style={{ fontFamily: "Georgia, serif", color: "#4ade80", fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
          SELECT SESSION PROTOCOL
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", color: "#4ade80", opacity: 0.8, fontSize: 10, letterSpacing: "0.15em" }}>
          PSYCHOENERGETICS OPERATIONAL UNIT — VIEWER REGISTRY
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {VIEWERS.map(v => (
          <button key={v.id} onClick={() => onSelect(v)} style={{
            background: "rgba(0,30,0,0.6)", border: "1px solid #1a3a1a", borderRadius: 2,
            padding: 24, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.background = "rgba(0,40,0,0.8)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a3a1a"; e.currentTarget.style.background = "rgba(0,30,0,0.6)"; }}
          >
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 28, color: "#f0c040", marginBottom: 8 }}>{v.badge}</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: "#f0c040", fontWeight: 900, marginBottom: 6 }}>{v.callsign}</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.9, marginBottom: 14, lineHeight: 1.6 }}>{v.specialty}</div>
            <div style={{ borderTop: "1px solid #1a3a1a", paddingTop: 10 }}>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#f0c040", letterSpacing: "0.15em", background: "rgba(240,192,64,0.08)", border: "1px solid rgba(240,192,64,0.25)", padding: "3px 8px", borderRadius: 2 }}>
                {v.mode}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div style={{
        background: "rgba(0,20,0,0.4)", border: "1px solid #1a3a1a", padding: 20, borderRadius: 2,
        fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.85, lineHeight: 1.8,
      }}>
      {/* Dossier entry panel */}
      <button onClick={onDossier} style={{
        width: "100%", background: "rgba(0,15,0,0.4)", border: "1px solid #1a3a1a",
        borderRadius: 2, padding: "14px 20px", cursor: "pointer", marginBottom: 16,
        display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.background = "rgba(0,25,0,0.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a3a1a"; e.currentTarget.style.background = "rgba(0,15,0,0.4)"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 18, color: "#4ade80", opacity: 0.7 }}>◈</div>
          <div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#f0c040", fontWeight: 900, letterSpacing: "0.15em", marginBottom: 2 }}>
              PERSONAL DOSSIER
            </div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.85 }}>
              {sessionCount > 0 ? `${sessionCount} session${sessionCount !== 1 ? "s" : ""} on file — view archive, stage transcripts & Monitor evaluations` : "No sessions on file yet — complete a mission to begin your archive"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {sessionCount > 0 && (
            <span style={{ background: "#f0c040", color: "#020a02", fontFamily: "'Courier New', monospace", fontSize: 8, fontWeight: 900, padding: "2px 8px", borderRadius: 2 }}>
              {sessionCount}
            </span>
          )}
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.7 }}>→</span>
        </div>
      </button>

        <div style={{ color: "#f0c040", marginBottom: 8 }}>▸ PROGRAM OVERVIEW // DECLASSIFIED 1995</div>
        STARGATE (formerly GONDOLA WISH, GRILL FLAME, CENTER LANE, SUN STREAK) — U.S. government remote viewing research program, 1972–1995.
        Initiated in response to reported Soviet psychoenergetics research. Conducted at Stanford Research Institute, subsequently relocated to a classified Army installation.
        Coordinate Remote Viewing (CRV) protocol developed by program researchers. Monroe Institute Gateway Process used for viewer preparation.
        Total program cost: $20 million USD. Declassified and terminated: 1995. Use ▸ EXPAND CLEARANCE above for key figures and resources.
      </div>
    </div>
  );
}

function SessionBrief({ viewer, target, onBegin, onBack, sessionId }) {
  const briefingCopy = {
    "RV-001": `You are being tasked to remote view TARGET ${target.id}. The coordinates <span style="color:#f0c040">${target.coords}</span> designate your physical target. Begin with Stage I ideogram. Suppress analytical overlay. Allow spontaneous spatial impressions to surface. Monitor AI will evaluate your session data after each stage.`,
    "RV-002": `You are being tasked to TEMPORALLY DISPLACE to TARGET ${target.id}. The temporal coordinates <span style="color:#f0c040">${target.coords}</span> designate your moment in time. Release all prior historical knowledge. Perceive directly — do not reconstruct from memory. Monitor AI will evaluate for temporal coherence and AOL suppression.`,
    "RV-003": `You are being tasked to make SUBJECT CONTACT with TARGET ${target.id}. Designation: <span style="color:#f0c040">${target.coords}</span>. You are not seeking a location — you are seeking a presence. Enter the subject's emotional field. Record state, intent, and atmosphere without projection. Monitor AI will evaluate contact quality after each stage.`,
    "RV-004": `You are being tasked to perceive ANOMALOUS TARGET ${target.id}. Reference: <span style="color:#f0c040">${target.coords}</span>. This target may not conform to ordinary physical categories. Remain open to impressions that defy explanation. Do not rationalize. Do not dismiss. Monitor AI will evaluate signal depth and resistance to cultural overlay.`,
    "RV-005": `You are being tasked to penetrate SUPPRESSION FIELD ${target.id}. Code: <span style="color:#f0c040">${target.coords}</span>. Something is being concealed. Your task is not to perceive a location or person — it is to find what has been buried and describe what is beneath the surface layer. Monitor AI will evaluate depth of penetration and resistance to disinformation overlay.`,
    "RV-006": `You are being tasked for PSYCHOMETRIC CONTACT with ${target.id}. Designation: <span style="color:#f0c040">${target.coords}</span>. This object or site carries the residue of significant events. You are not viewing what exists now — you are reading what has been absorbed over time. Move through the layers. Monitor AI will evaluate forensic depth and suppression of prior historical knowledge.`,
    "RV-007": `You are being tasked for an EXTENDED REMOTE VIEWING session. State designation: <span style="color:#f0c040">${target.coords}</span>. There is no stage structure. There is no analytical framework. Your only task is to descend into a deeply altered state and allow the signal to arrive unfiltered. Record everything — fragments, images, feelings, geometries, words — without editing or interpretation. The Monitor AI will assess depth of contact and signal coherence across your full stream.`,
  };

  return (
    <div style={{ padding: "40px 24px", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
          fontFamily: "'Courier New', monospace", fontSize: 9, padding: "6px 14px",
          cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2,
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#4ade80"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#1a3a1a"}
        >← CHANGE PROTOCOL</button>
        <ClassifiedStamp text={target.classification} />
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5 }}>SESSION {sessionId}</span>
      </div>

      <div style={{ fontFamily: "Georgia, serif", color: "#f0c040", fontSize: 26, fontWeight: 900, marginBottom: 24 }}>
        MISSION BRIEFING
      </div>

      <div style={{
        background: "rgba(0,20,0,0.6)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 28, marginBottom: 24,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 4 }}>TARGET ID</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 18, color: "#f0c040", fontWeight: 900 }}>{target.id}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 4 }}>{target.coordLabel || "COORDINATES"}</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#4ade80" }}>{target.coords}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 4 }}>ASSIGNED VIEWER</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#4ade80" }}>{viewer.callsign}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 4 }}>SESSION MODE</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#f0c040" }}>{viewer.mode}</div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #1a3a1a", paddingTop: 20 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 8 }}>TASKING INSTRUCTIONS</div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#4ade80", lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: briefingCopy[viewer.id] || briefingCopy["RV-001"] }}
          />
        </div>
      </div>

      <div style={{
        background: "rgba(20,10,0,0.4)", border: "1px solid #3a2a1a", borderRadius: 2, padding: 16, marginBottom: 24,
        fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", opacity: 0.7, lineHeight: 1.8,
      }}>
        <div style={{ fontWeight: 900, marginBottom: 4 }}>▸ PRE-SESSION PREPARATION PROTOCOL</div>
        Find a quiet space. Close your eyes. Breathe slowly: inhale 4 counts, hold 4, exhale 4.
        Allow your mind to enter a relaxed, receptive state. Set analytical thinking aside.
        When impressions arise — record them immediately without judgment.
        This is the signal line. Follow it.
      </div>

      <button onClick={onBegin} style={{
        background: "rgba(0,60,0,0.8)", border: "1px solid #4ade80", color: "#4ade80",
        fontFamily: "'Courier New', monospace", fontSize: 12, padding: "14px 40px",
        cursor: "pointer", letterSpacing: "0.2em", textTransform: "uppercase", width: "100%", borderRadius: 2,
      }}>
        [ BEGIN REMOTE VIEWING SESSION ]
      </button>
    </div>
  );
}

function SessionView({ viewer, target, sessionId, onComplete, onBack }) {
  const viewerStages = STAGES_BY_VIEWER[viewer.id] || STAGES_BY_VIEWER["RV-001"];
  const systemPrompt = PROMPTS_BY_VIEWER[viewer.id] || PROMPTS_BY_VIEWER["RV-001"];

  const [currentStage, setCurrentStage] = useState(0);
  const [stageData, setStageData] = useState(Array(viewerStages.length).fill(""));
  const [evaluations, setEvaluations] = useState(Array(viewerStages.length).fill(null));
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(Array(viewerStages.length).fill(false));
  const textRef = useRef(null);

  const stage = viewerStages[currentStage];

  const submitStage = useCallback(async () => {
    const text = stageData[currentStage];
    if (!text.trim()) return;
    setLoading(true);

    try {
      const sessionContext = viewerStages.slice(0, currentStage).map((s, i) =>
        stageData[i] ? `${s.label}: ${stageData[i]}` : null
      ).filter(Boolean).join("\n\n");

      const targetContext = [
        `TARGET ID: ${target.id}`,
        `${target.coordLabel || "COORDINATES"}: ${target.coords}`,
        target.description ? `TARGET DESCRIPTION (SEALED — MONITOR ONLY): ${target.description}` : null,
        target.tasking ? `TASKING BRIEF: ${target.tasking}` : null,
        `VIEWER: ${viewer.callsign} [${viewer.mode}]`,
        `SESSION: ${sessionId}`,
      ].filter(Boolean).join("\n");

      const userMsg = `${targetContext}\n\n${sessionContext ? `PRIOR STAGES:\n${sessionContext}\n\n` : ""}CURRENT SUBMISSION:\n${stage.label}\n${text}`;

      const res = await fetch("/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "EVALUATION UNAVAILABLE";
      const newEvals = [...evaluations];
      newEvals[currentStage] = reply;
      setEvaluations(newEvals);
      const newSub = [...submitted];
      newSub[currentStage] = true;
      setSubmitted(newSub);
    } catch {
      const newEvals = [...evaluations];
      newEvals[currentStage] = "[CLASSIFICATION: GRILL FLAME // STARGATE]\n[SESSION EVALUATION]\nMonitor connection lost. Secure channel interrupted.\n\n[SIGNAL LINE ASSESSMENT]\nEvaluation unavailable — retry.\n\n[INTELLIGENCE VALUE]\nUNKNOWN";
      setEvaluations(newEvals);
    }
    setLoading(false);
  }, [currentStage, stageData, evaluations, submitted, target, viewer, sessionId, stage, viewerStages, systemPrompt]);

  const completeSession = () => {
    onComplete({ target, stageData, evaluations, sessionId, viewer });
  };

  const isLastStage = currentStage === viewerStages.length - 1;

  return (
    <div style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
      {/* Stage progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {viewerStages.map((s, i) => (
          <button key={i} onClick={() => setCurrentStage(i)} style={{
            flex: 1, height: 4, background: i === currentStage ? "#f0c040" : submitted[i] ? "#4ade80" : "#1a3a1a",
            border: "none", cursor: "pointer", borderRadius: 2, transition: "background 0.3s",
          }} title={s.label} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5, marginBottom: 4, letterSpacing: "0.2em" }}>
            STAGE {stage.stage} OF {viewerStages.length}
          </div>
          <div style={{ fontFamily: "Georgia, serif", color: "#f0c040", fontSize: 20, fontWeight: 900 }}>{stage.label}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <ClassifiedStamp text={target.classification} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5, marginTop: 4 }}>TGT: {target.id}</div>
        </div>
      </div>

      <div style={{
        background: "rgba(0,20,0,0.4)", border: "1px solid #1a3a1a", padding: 14, borderRadius: 2, marginBottom: 20,
        fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 1.8, opacity: 0.8,
      }}>
        {stage.desc}
      </div>

      {/* Textarea */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <textarea
          ref={textRef}
          value={stageData[currentStage]}
          onChange={e => {
            const d = [...stageData];
            d[currentStage] = e.target.value;
            setStageData(d);
          }}
          placeholder={stage.placeholder}
          rows={8}
          style={{
            width: "100%", background: "rgba(0,15,0,0.8)", border: "1px solid #1a3a1a",
            borderRadius: 2, color: "#4ade80", fontFamily: "'Courier New', monospace",
            fontSize: 13, padding: 16, lineHeight: 1.8, resize: "vertical", outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = "#4ade80"}
          onBlur={e => e.target.style.borderColor = "#1a3a1a"}
        />
        <div style={{
          position: "absolute", bottom: 10, right: 12,
          fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.3,
        }}>{stageData[currentStage].length} CHARS</div>
      </div>

      {/* Submit */}
      {!submitted[currentStage] && (
        <button onClick={submitStage} disabled={loading || !stageData[currentStage].trim()} style={{
          background: loading ? "rgba(0,40,0,0.4)" : "rgba(0,60,0,0.8)",
          border: "1px solid #4ade80", color: "#4ade80",
          fontFamily: "'Courier New', monospace", fontSize: 11, padding: "12px 28px",
          cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.2em", borderRadius: 2,
          width: "100%", marginBottom: 20,
        }}>
          {loading ? "[ MONITOR EVALUATING... ]" : "[ TRANSMIT TO MONITOR ]"}
        </button>
      )}

      {/* Evaluation */}
      {evaluations[currentStage] && (
        <div style={{
          background: "rgba(0,0,0,0.6)", border: "1px solid #2a4a2a",
          borderLeft: "3px solid #f0c040", padding: 20, borderRadius: 2, marginBottom: 20,
        }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", marginBottom: 12, letterSpacing: "0.2em" }}>
            ▸ MONITOR AI — STAGE {stage.stage} EVALUATION
          </div>
          <pre style={{
            fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 1.8,
            whiteSpace: "pre-wrap", margin: 0,
          }}>{evaluations[currentStage]}</pre>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10 }}>
        {currentStage === 0 && (
          <button onClick={onBack} style={{
            background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
            fontFamily: "'Courier New', monospace", fontSize: 10, padding: "10px 20px",
            cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2, opacity: 0.6,
          }}>← ABORT SESSION</button>
        )}
        {currentStage > 0 && (
          <button onClick={() => setCurrentStage(s => s - 1)} style={{
            background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
            fontFamily: "'Courier New', monospace", fontSize: 10, padding: "10px 20px",
            cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2,
          }}>← PREV STAGE</button>
        )}
        {currentStage < viewerStages.length - 1 && (
          <button onClick={() => setCurrentStage(s => s + 1)} disabled={!submitted[currentStage] && !stageData[currentStage]} style={{
            flex: 1, background: submitted[currentStage] ? "rgba(0,40,0,0.6)" : "transparent",
            border: "1px solid #2a4a2a", color: "#4ade80",
            fontFamily: "'Courier New', monospace", fontSize: 10, padding: "10px 20px",
            cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2,
          }}>NEXT STAGE →</button>
        )}
        {isLastStage && submitted[currentStage] && (
          <button onClick={completeSession} style={{
            flex: 1, background: "rgba(20,60,0,0.8)", border: "1px solid #4ade80", color: "#4ade80",
            fontFamily: "'Courier New', monospace", fontSize: 11, padding: "12px 20px",
            cursor: "pointer", letterSpacing: "0.2em", borderRadius: 2,
          }}>[ CLOSE SESSION — FILE REPORT ]</button>
        )}
      </div>
    </div>
  );
}

function SessionReport({ session, onNewSession }) {
  const [finalEval, setFinalEval] = useState(null);
  const [loading, setLoading] = useState(false);
  const [footerLine] = useState(() => FOOTER_LINES[Math.floor(Math.random() * FOOTER_LINES.length)]);
  const [unsealed, setUnsealed] = useState(false);
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const W = doc.internal.pageSize.getWidth();
      const margin = 48;
      const maxW = W - margin * 2;
      let y = margin;

      const addPage = () => { doc.addPage(); y = margin; };
      const checkY = (needed = 20) => { if (y + needed > doc.internal.pageSize.getHeight() - margin) addPage(); };

      // Background
      const fillPage = () => {
        doc.setFillColor(2, 10, 2);
        doc.rect(0, 0, W, doc.internal.pageSize.getHeight(), "F");
      };
      fillPage();
      doc.internal.events.subscribe("addPage", fillPage);

      // Header bar
      doc.setFillColor(0, 20, 0);
      doc.rect(0, 0, W, 60, "F");
      doc.setDrawColor(26, 58, 26);
      doc.line(0, 60, W, 60);

      // Logo
      doc.setFont("Courier", "bold");
      doc.setFontSize(16);
      doc.setTextColor(240, 192, 64);
      doc.text("STARGATE", margin, 38);
      doc.setDrawColor(240, 192, 64);
      doc.line(margin, 42, margin + 90, 42);

      // Classification stamp
      doc.setFontSize(8);
      doc.setTextColor(192, 57, 43);
      doc.setFont("Courier", "bold");
      const stamp = session.target.classification || "GRILL FLAME";
      doc.text(stamp, W - margin, 38, { align: "right" });

      y = 90;

      // Title
      doc.setFont("Courier", "bold");
      doc.setFontSize(20);
      doc.setTextColor(240, 192, 64);
      doc.text("SESSION INTELLIGENCE REPORT", margin, y);
      y += 10;
      doc.setDrawColor(26, 58, 26);
      doc.line(margin, y, W - margin, y);
      y += 24;

      // Stats grid
      const stats = [
        ["SESSION ID", session.sessionId],
        ["VIEWER", session.viewer.callsign],
        ["SESSION MODE", session.viewer.mode],
        ["TARGET ID", session.target.id],
        ["COORDINATES", session.target.coords],
        ["DATE", new Date(session.savedAt || Date.now()).toUTCString()],
      ];
      doc.setFontSize(8);
      stats.forEach(([label, value], i) => {
        const col = i % 2;
        const colX = margin + col * (maxW / 2);
        if (col === 0 && i > 0) y += 32;
        doc.setTextColor(74, 222, 128);
        doc.setFont("Courier", "normal");
        doc.text(label, colX, y);
        doc.setTextColor(240, 192, 64);
        doc.setFont("Courier", "bold");
        doc.setFontSize(10);
        const val = String(value || "");
        doc.text(val.length > 45 ? val.slice(0, 45) + "..." : val, colX, y + 14);
        doc.setFontSize(8);
      });
      y += 48;

      doc.setDrawColor(26, 58, 26);
      doc.line(margin, y, W - margin, y);
      y += 20;

      // Session transcript
      const stages = STAGES_BY_VIEWER[session.viewer.id] || STAGES_BY_VIEWER["RV-001"];
      doc.setFont("Courier", "bold");
      doc.setFontSize(11);
      doc.setTextColor(240, 192, 64);
      doc.text("SESSION TRANSCRIPT", margin, y);
      y += 20;

      stages.forEach((stage, i) => {
        const text = session.stageData?.[i];
        if (!text?.trim()) return;
        checkY(40);
        doc.setFillColor(0, 20, 0);
        doc.rect(margin, y - 12, maxW, 16, "F");
        doc.setFont("Courier", "bold");
        doc.setFontSize(9);
        doc.setTextColor(240, 192, 64);
        doc.text(stage.label.toUpperCase(), margin + 6, y);
        y += 14;
        doc.setFont("Courier", "normal");
        doc.setFontSize(9);
        doc.setTextColor(74, 222, 128);
        const lines = doc.splitTextToSize(text, maxW - 12);
        lines.forEach(line => {
          checkY(14);
          doc.text(line, margin + 6, y);
          y += 13;
        });
        y += 8;
      });

      y += 8;
      doc.setDrawColor(26, 58, 26);
      doc.line(margin, y, W - margin, y);
      y += 20;

      // Monitor evaluations
      if (session.evaluations?.some(e => e)) {
        checkY(30);
        doc.setFont("Courier", "bold");
        doc.setFontSize(11);
        doc.setTextColor(240, 192, 64);
        doc.text("MONITOR AI — STAGE EVALUATIONS", margin, y);
        y += 20;
        session.evaluations.forEach((ev, i) => {
          if (!ev) return;
          checkY(40);
          doc.setFont("Courier", "bold");
          doc.setFontSize(8);
          doc.setTextColor(192, 57, 43);
          doc.text(`STAGE ${i + 1}`, margin, y);
          y += 12;
          doc.setFont("Courier", "normal");
          doc.setFontSize(8);
          doc.setTextColor(74, 222, 128);
          const lines = doc.splitTextToSize(ev, maxW);
          lines.forEach(line => { checkY(12); doc.text(line, margin, y); y += 11; });
          y += 10;
        });
      }

      // Final debrief
      if (finalEval) {
        checkY(30);
        doc.setDrawColor(26, 58, 26);
        doc.line(margin, y, W - margin, y);
        y += 20;
        doc.setFont("Courier", "bold");
        doc.setFontSize(11);
        doc.setTextColor(240, 192, 64);
        doc.text("MONITOR AI — FINAL SESSION DEBRIEF", margin, y);
        y += 18;
        doc.setFont("Courier", "normal");
        doc.setFontSize(8);
        doc.setTextColor(74, 222, 128);
        const lines = doc.splitTextToSize(finalEval, maxW);
        lines.forEach(line => { checkY(12); doc.text(line, margin, y); y += 11; });
        y += 12;
      }

      // Target reveal (always unsealed in PDF)
      checkY(60);
      doc.setDrawColor(240, 192, 64);
      doc.line(margin, y, W - margin, y);
      y += 18;
      doc.setFont("Courier", "bold");
      doc.setFontSize(9);
      doc.setTextColor(74, 222, 128);
      doc.text("TARGET — ACTUAL DESCRIPTION (UNSEALED)", margin, y);
      y += 16;
      doc.setFont("Courier", "bold");
      doc.setFontSize(11);
      doc.setTextColor(240, 192, 64);
      const descLines = doc.splitTextToSize(session.target.description || "DESCRIPTION SEALED", maxW);
      descLines.forEach(line => { checkY(16); doc.text(line, margin, y); y += 15; });
      y += 4;
      doc.setFont("Courier", "normal");
      doc.setFontSize(9);
      doc.setTextColor(74, 222, 128);
      doc.text(session.target.coords || "", margin, y);
      y += 20;

      // Footer on last page
      doc.setDrawColor(26, 58, 26);
      doc.line(margin, y, W - margin, y);
      y += 14;
      doc.setFont("Courier", "normal");
      doc.setFontSize(7);
      doc.setTextColor(74, 222, 128);
      doc.text("STARGATE — REMOTE VIEWING PROGRAM // DECLASSIFIED 1995 // psiop.io", margin, y);

      doc.save(`STARGATE-${session.sessionId}.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
    }
    setExporting(false);
  };

  const viewerStages = STAGES_BY_VIEWER[session.viewer.id] || STAGES_BY_VIEWER["RV-001"];
  const systemPrompt = PROMPTS_BY_VIEWER[session.viewer.id] || PROMPTS_BY_VIEWER["RV-001"];

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      try {
        const summary = viewerStages.map((s, i) =>
          `${s.label}:\n${session.stageData[i] || "(no data)"}`
        ).join("\n\n---\n\n");

        const evalSummary = session.evaluations.filter(Boolean).join("\n\n");

        const targetLine = [
          `TARGET: ${session.target.id} (${session.target.coords})`,
          session.target.description ? `TARGET DESCRIPTION (SEALED): ${session.target.description}` : null,
          session.target.tasking ? `TASKING BRIEF: ${session.target.tasking}` : null,
        ].filter(Boolean).join("\n");

        const prompt = `COMPLETE SESSION DEBRIEF REQUEST\n\nVIEWER: ${session.viewer.callsign} [${session.viewer.mode}]\nSESSION ID: ${session.sessionId}\n${targetLine}\n\nFULL SESSION TRANSCRIPT:\n${summary}\n\nINDIVIDUAL STAGE EVALUATIONS:\n${evalSummary}\n\nProvide a comprehensive final intelligence report and session debrief. Include overall signal quality assessment, notable perceptions, operational value, and recommendation for future tasking of this viewer.`;

        const res = await fetch("/api/monitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data = await res.json();
        setFinalEval(data.content?.map(b => b.text || "").join("") || "");
      } catch {
        setFinalEval("FINAL DEBRIEF UNAVAILABLE — SECURE CHANNEL ERROR");
      }
      setLoading(false);
    };
    generate();
  }, []);

  const completedStages = session.stageData.filter(d => d.trim()).length;
  const overallScore = Math.round((completedStages / viewerStages.length) * 100);

  return (
    <div style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid #1a3a1a" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5, letterSpacing: "0.3em", marginBottom: 8 }}>
          SESSION COMPLETE — INTELLIGENCE REPORT
        </div>
        <div style={{ fontFamily: "Georgia, serif", color: "#f0c040", fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
          DEBRIEF: {session.sessionId}
        </div>
        <ClassifiedStamp text={session.target.classification} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "VIEWER", value: session.viewer.callsign },
          { label: "TARGET", value: session.target.id },
          { label: "STAGES", value: `${completedStages}/${viewerStages.length}` },
          { label: "COMPLETION", value: `${overallScore}%` },
        ].map(s => (
          <div key={s.label} style={{
            background: "rgba(0,20,0,0.4)", border: "1px solid #1a3a1a", padding: 14, borderRadius: 2, textAlign: "center"
          }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: "#f0c040", fontWeight: 900 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Session transcript */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.2em", marginBottom: 12 }}>
          ▸ SESSION TRANSCRIPT
        </div>
        {viewerStages.map((s, i) => session.stageData[i] && (
          <div key={i} style={{ marginBottom: 12, background: "rgba(0,15,0,0.4)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 14 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#4ade80", lineHeight: 1.8 }}>{session.stageData[i]}</div>
          </div>
        ))}
      </div>

      {/* Final eval */}
      <div style={{
        background: "rgba(0,0,0,0.7)", border: "1px solid #2a4a2a",
        borderLeft: "3px solid #f0c040", padding: 24, borderRadius: 2, marginBottom: 24,
      }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", marginBottom: 16, letterSpacing: "0.2em" }}>
          ▸ MONITOR AI — FINAL SESSION DEBRIEF
        </div>
        {loading ? (
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", opacity: 0.6 }}>
            COMPILING INTELLIGENCE ASSESSMENT...
          </div>
        ) : (
          <pre style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>
            {finalEval}
          </pre>
        )}
      </div>

      {/* Target unseal */}
      <div style={{
        background: "rgba(0,10,0,0.6)", border: `1px solid ${unsealed ? "#f0c040" : "#1a3a1a"}`,
        borderRadius: 2, padding: 20, marginBottom: 16, textAlign: "center", transition: "border-color 0.4s",
      }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: unsealed ? 12 : 8, letterSpacing: "0.2em" }}>
          TARGET {session.target.id} — ACTUAL DESCRIPTION
        </div>
        {unsealed ? (
          <div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: "#f0c040", fontWeight: 900, marginBottom: 6, letterSpacing: "0.1em" }}>
              {session.target.description}
            </div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.6 }}>
              {session.target.coords}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <RedactedBar width={200} />
            </div>
            <button onClick={() => setUnsealed(true)} style={{
              background: "transparent", border: "1px solid #f0c040", color: "#f0c040",
              fontFamily: "'Courier New', monospace", fontSize: 9, padding: "7px 20px",
              cursor: "pointer", letterSpacing: "0.2em", borderRadius: 2,
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(240,192,64,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >[ UNSEAL TARGET ]</button>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div style={{
        fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.4, lineHeight: 1.8, marginBottom: 24, textAlign: "center",
      }}>
        {footerLine}
      </div>

      <button onClick={exportPDF} disabled={exporting || loading} style={{
        background: "rgba(0,20,0,0.6)", border: "1px solid #f0c040", color: "#f0c040",
        fontFamily: "'Courier New', monospace", fontSize: 11, padding: "12px 40px",
        cursor: exporting ? "not-allowed" : "pointer", letterSpacing: "0.2em", width: "100%", borderRadius: 2, marginBottom: 10,
        opacity: loading ? 0.5 : 1,
      }}>
        {exporting ? "[ GENERATING DOSSIER PDF... ]" : "[ EXPORT CLASSIFIED DOSSIER PDF ]"}
      </button>

      <button onClick={onNewSession} style={{
        background: "rgba(0,50,0,0.8)", border: "1px solid #4ade80", color: "#4ade80",
        fontFamily: "'Courier New', monospace", fontSize: 12, padding: "14px 40px",
        cursor: "pointer", letterSpacing: "0.2em", width: "100%", borderRadius: 2,
      }}>
        [ INITIATE NEW MISSION ]
      </button>
    </div>
  );
}

const TYPE_COLORS = {
  BOOK: "#f0c040",
  FILM: "#4ade80",
  ARCHIVE: "#c0392b",
  REPORT: "#7a6ade",
  PAPER: "#60b4ff",
};

function ResourcesSection() {
  const [filter, setFilter] = useState("ALL");
  const types = ["ALL", "BOOK", "FILM", "ARCHIVE", "REPORT", "PAPER"];
  const filtered = filter === "ALL" ? LEARN_MORE_RESOURCES : LEARN_MORE_RESOURCES.filter(r => r.type === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.6, lineHeight: 1.8 }}>
        {LEARN_MORE_RESOURCES.length} entries across books, films, archives, academic papers, and official reports.
      </div>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: filter === t ? (TYPE_COLORS[t] || "rgba(74,222,128,0.2)") : "transparent",
            border: `1px solid ${filter === t ? (TYPE_COLORS[t] || "#4ade80") : "#1a3a1a"}`,
            color: filter === t ? "#020a02" : "#4ade80",
            fontFamily: "'Courier New', monospace", fontSize: 8, padding: "4px 12px",
            cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2, fontWeight: filter === t ? 900 : 400,
          }}>{t}</button>
        ))}
      </div>
      {filtered.map(r => (
        <div key={r.title} style={{
          background: "rgba(0,15,0,0.5)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 20,
          display: "flex", gap: 16, alignItems: "flex-start",
        }}>
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: 8, color: "#020a02",
            background: TYPE_COLORS[r.type] || "#4ade80",
            padding: "3px 8px", borderRadius: 2, whiteSpace: "nowrap", fontWeight: 900, marginTop: 2, flexShrink: 0,
          }}>{r.type}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#f0c040", fontWeight: 700, marginBottom: 2 }}>{r.title}</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.6, marginBottom: 8 }}>{r.author} · {r.year}</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 1.8 }}>{r.desc}</div>
            {r.link && (
              <a href={r.link} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-block", marginTop: 10, fontFamily: "'Courier New', monospace", fontSize: 9,
                color: "#4ade80", border: "1px solid #1a3a1a", padding: "3px 10px", borderRadius: 2,
                textDecoration: "none", letterSpacing: "0.1em",
              }}>
                {r.type === "BOOK" ? "↗ VIEW ON AMAZON" : r.type === "FILM" ? "↗ VIEW LISTING" : "↗ ACCESS SOURCE"}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function LearnMore({ onBack }) {
  const [activeTab, setActiveTab] = useState("figures");

  return (
    <div style={{ padding: "32px 24px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
          fontFamily: "'Courier New', monospace", fontSize: 9, padding: "6px 14px",
          cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2,
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#4ade80"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#1a3a1a"}
        >← BACK</button>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.3em", marginBottom: 4 }}>
            DECLASSIFIED ARCHIVE — PUBLIC RECORD
          </div>
          <div style={{ fontFamily: "Georgia, serif", color: "#4ade80", fontSize: 22, fontWeight: 900 }}>
            THE REAL HISTORY OF STARGATE
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid #1a3a1a" }}>
        {[{ id: "figures", label: "KEY FIGURES" }, { id: "resources", label: "RESOURCES & READING" }, { id: "timeline", label: "PROGRAM TIMELINE" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: activeTab === tab.id ? "rgba(0,50,0,0.8)" : "transparent",
            border: "none", borderBottom: activeTab === tab.id ? "2px solid #f0c040" : "2px solid transparent",
            color: activeTab === tab.id ? "#f0c040" : "#4ade80",
            fontFamily: "'Courier New', monospace", fontSize: 10, padding: "8px 18px",
            cursor: "pointer", letterSpacing: "0.15em", marginBottom: -1,
          }}>{tab.label}</button>
        ))}
      </div>

      {/* KEY FIGURES */}
      {activeTab === "figures" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5, lineHeight: 1.8, marginBottom: 4 }}>
            The following individuals are real historical figures documented in declassified U.S. government records, peer-reviewed research, and public literature. Their names and roles are matters of public record.
          </div>
          {LEARN_MORE_FIGURES.map(fig => (
            <div key={fig.name} style={{
              background: "rgba(0,15,0,0.5)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 24,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5, marginBottom: 2 }}>
                    PROGRAM CALLSIGN: {fig.callsign}
                  </div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#f0c040", fontWeight: 900 }}>{fig.name}</div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.7, marginTop: 2 }}>{fig.role} · {fig.years}</div>
                </div>
              </div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 1.9, marginBottom: 14 }}>
                {fig.summary}
              </div>
              <div style={{ borderTop: "1px solid #1a3a1a", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.4, marginBottom: 6 }}>NOTABLE WORKS</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {fig.books.map(b => (
                      <span key={b} style={{
                        fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040",
                        border: "1px solid #3a2a00", padding: "2px 8px", borderRadius: 2,
                      }}>{b}</span>
                    ))}
                  </div>
                </div>
                <a href={fig.link} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80",
                  border: "1px solid #1a3a1a", padding: "4px 12px", borderRadius: 2,
                  textDecoration: "none", letterSpacing: "0.1em",
                }}>↗ WIKIPEDIA</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESOURCES */}
      {activeTab === "resources" && (
        <ResourcesSection />
      )}

      {/* TIMELINE */}
      {activeTab === "timeline" && (
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 1, background: "#1a3a1a" }} />
          {[
            { year: "1970", event: "CIA becomes aware of Soviet 'psychotronic' research. Estimated Soviet spend: 60 million rubles/year. SCANATE program initiated." },
            { year: "1972", event: "Remote viewing research begins at Stanford Research Institute (SRI), Menlo Park, CA. Early subjects include artist and first protocol designer Ingo Swann." },
            { year: "1973", event: "Israeli psychic Uri Geller tested at SRI. Results described as statistically significant in controlled conditions. CIA documents this as early SCANATE data." },
            { year: "1974", event: "SRI researchers publish in Nature journal — one of the first peer-reviewed papers on remote viewing. Subject Pat Price produces famous blind description of Soviet underground facility." },
            { year: "1975", event: "Pat Price dies suddenly. Program loses its most operationally active viewer. GONDOLA WISH expands Army involvement." },
            { year: "1977", event: "'Mind Reach' published by Targ & Puthoff. Brings public attention to the research. Program now operating as GRILL FLAME." },
            { year: "1978", event: "Army veteran Joseph McMoneagle joins as Viewer No. 1. Program relocates to classified Army installation. GRILL FLAME becomes CENTER LANE." },
            { year: "1979", event: "Ingo Swann claims a session accurately described Jupiter's ring system before Voyager confirmed it. McMoneagle describes a Soviet submarine under construction far from water — later confirmed by satellite photography." },
            { year: "1983", event: "Monroe Institute Gateway Process adopted for viewer preparation. Binaural beat technology used to induce altered states. Program renamed SUN STREAK." },
            { year: "1984", event: "McMoneagle awarded Legion of Merit. Program at peak operation with 7 full-time viewers. Renamed STARGATE." },
            { year: "1990", event: "CIA resumes direct oversight. Program reduced to 3 full-time viewers. Cold War winds down; funding pressure increases." },
            { year: "1995", event: "CIA commissions American Institutes for Research (AIR) review. Program officially terminated and declassified. 23 years of data released." },
            { year: "2017", event: "CIA publishes 12 million pages of STARGATE documents online via CREST archive. Full session transcripts become publicly accessible." },
          ].map((item, i) => (
            <div key={i} style={{ position: "relative", marginBottom: 20, paddingLeft: 20 }}>
              <div style={{
                position: "absolute", left: -20, top: 4, width: 8, height: 8,
                borderRadius: "50%", background: "#f0c040", border: "2px solid #020a02",
              }} />
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#f0c040", fontWeight: 900, marginBottom: 4 }}>{item.year}</div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 1.8 }}>{item.event}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SUBSCRIPTION ──────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "stargate",
    name: "STARGATE",
    badge: "⬟",
    tagline: "Full program access",
    priceMonthly: 19.99,
    priceAnnual: 8.33,
    annualTotal: 99.99,
    color: "#f0c040",
    features: [
      "Unlimited remote viewing sessions",
      "All 12 viewer protocols",
      "Full Stage I–VI protocol",
      "Advanced Monitor AI with deep analysis",
      "Personal dossier & session archive",
      "Custom target builder",
      "Extended Remote Viewing (ERV) — unstructured altered state protocol",
      "Altered state audio preparation guides",
      "Export sessions as classified dossier PDF",
      "Priority Monitor AI response",
    ],
    cta: "ACTIVATE FULL CLEARANCE",
    highlight: true,
  },
];

function SubscriptionScreen({ onBack, onSelectPlan }) {
  const [billing, setBilling] = useState("annual");
  const [step, setStep] = useState("plans"); // plans | signup | payment
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({ email: "", name: "", password: "" });
  const [payMethod, setPayMethod] = useState("card");
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvc: "", zip: "" });
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep("signup");
  };

  const handleSignup = () => {
    if (!form.email || !form.name || !form.password) return;
    setStep("payment");
  };

  const handlePayment = async () => {
    if (!agreed) return;
    setProcessing(true);
    // Simulate processing — replace with real Stripe / RevenueCat SDK call
    await new Promise(r => setTimeout(r, 2200));
    setProcessing(false);
    setDone(true);
  };

  const price = (plan) => billing === "annual" ? plan.priceAnnual : plan.priceMonthly;

  if (done) return (
    <div style={{ padding: "60px 24px", maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 48, color: "#f0c040", marginBottom: 16 }}>⬟</div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#f0c040", fontWeight: 900, marginBottom: 8 }}>
        CLEARANCE GRANTED
      </div>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", opacity: 0.7, marginBottom: 8 }}>
        TIER: {selectedPlan.name}
      </div>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 1.8, marginBottom: 32, opacity: 0.6 }}>
        Welcome, {form.name}. Your access has been provisioned.<br />
        Confirmation transmitted to {form.email}.<br />
        The signal line is open.
      </div>
      <button onClick={onBack} style={{
        background: "rgba(0,50,0,0.8)", border: "1px solid #4ade80", color: "#4ade80",
        fontFamily: "'Courier New', monospace", fontSize: 11, padding: "12px 36px",
        cursor: "pointer", letterSpacing: "0.2em", borderRadius: 2, width: "100%",
      }}>[ ENTER STARGATE ]</button>
    </div>
  );

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
          fontFamily: "'Courier New', monospace", fontSize: 9, padding: "6px 14px",
          cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2,
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#4ade80"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#1a3a1a"}
        >← BACK</button>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.3em", marginBottom: 2 }}>
            CLEARANCE LEVELS — SUBSCRIPTION REGISTRY
          </div>
          <div style={{ fontFamily: "Georgia, serif", color: "#4ade80", fontSize: 20, fontWeight: 900 }}>
            SELECT YOUR ACCESS TIER
          </div>
        </div>
      </div>

      {/* STEP: PLANS */}
      {step === "plans" && (<>
        {/* Billing toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32, gap: 0 }}>
          {["monthly", "annual"].map(b => (
            <button key={b} onClick={() => setBilling(b)} style={{
              background: billing === b ? "rgba(0,60,0,0.8)" : "transparent",
              border: "1px solid #1a3a1a", color: billing === b ? "#f0c040" : "#4ade80",
              fontFamily: "'Courier New', monospace", fontSize: 10, padding: "8px 24px",
              cursor: "pointer", letterSpacing: "0.15em",
              borderRadius: b === "monthly" ? "2px 0 0 2px" : "0 2px 2px 0",
            }}>
              {b === "monthly" ? "MONTHLY" : "ANNUAL"}
              {b === "annual" && <span style={{ color: "#4ade80", fontSize: 8, marginLeft: 6 }}>SAVE 58%</span>}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
          {PLANS.map(plan => {
            const isHighlighted = billing === "annual";
            return (
            <div key={plan.id} style={{
              background: isHighlighted ? "rgba(10,30,10,0.9)" : "rgba(0,15,0,0.6)",
              border: `1px solid ${isHighlighted ? plan.color : "#1a3a1a"}`,
              borderRadius: 2, padding: 28, position: "relative",
              boxShadow: isHighlighted ? `0 0 24px rgba(240,192,64,0.08)` : "none",
            }}>
              {isHighlighted && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: "#f0c040", color: "#020a02", fontFamily: "'Courier New', monospace",
                  fontSize: 8, fontWeight: 900, padding: "3px 14px", letterSpacing: "0.2em",
                }}>RECOMMENDED</div>
              )}
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 24, color: plan.color, marginBottom: 8 }}>{plan.badge}</div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 14, color: plan.color, fontWeight: 900, letterSpacing: "0.15em", marginBottom: 2 }}>{plan.name}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 10, color: "#4ade80", opacity: 0.6, fontStyle: "italic", marginBottom: 20 }}>{plan.tagline}</div>

              <div style={{ marginBottom: 20 }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 32, color: plan.color, fontWeight: 900 }}>
                  {plan.id === "signal" ? "FREE" : billing === "annual" ? `$${plan.annualTotal.toFixed(2)}` : `$${plan.priceMonthly.toFixed(2)}`}
                </span>
                {plan.id !== "signal" && (
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.6 }}>
                      {billing === "annual" ? `$${plan.priceAnnual.toFixed(2)}/mo · billed $${plan.annualTotal.toFixed(2)}/yr` : "per month"}
                    </span>
                    {billing === "annual" && (
                      <span style={{ marginLeft: 8, fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", padding: "1px 6px", borderRadius: 2 }}>
                        SAVE $139.89
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ borderTop: "1px solid #1a3a1a", paddingTop: 16, marginBottom: 20 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ color: plan.color, fontSize: 10, marginTop: 1, flexShrink: 0 }}>▸</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => handlePlanSelect(plan)} style={{
                width: "100%", background: plan.highlight ? "rgba(40,60,0,0.9)" : "transparent",
                border: `1px solid ${plan.color}`, color: plan.color,
                fontFamily: "'Courier New', monospace", fontSize: 10, padding: "11px 16px",
                cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2,
              }}
                onMouseEnter={e => e.currentTarget.style.background = `rgba(0,40,0,0.9)`}
                onMouseLeave={e => e.currentTarget.style.background = isHighlighted ? "rgba(40,60,0,0.9)" : "transparent"}
              >{plan.cta}</button>
            </div>
            );
          })}
        </div>

        {/* Payment method icons */}
        <div style={{ textAlign: "center", fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5, marginBottom: 12, letterSpacing: "0.2em" }}>
          ACCEPTED PAYMENT CHANNELS
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {["VISA", "MASTERCARD", "AMEX", "APPLE PAY", "GOOGLE PAY"].map(m => (
            <span key={m} style={{
              fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80",
              border: "1px solid #2a4a2a", padding: "5px 12px", borderRadius: 2,
              background: "rgba(0,20,0,0.4)",
            }}>{m}</span>
          ))}
        </div>
        <div style={{ textAlign: "center", fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5, lineHeight: 2 }}>
          Payments processed securely via Stripe. Cancel anytime.<br />
          iOS and Android subscribers managed via RevenueCat + native app store billing.
        </div>
      </>)}

      {/* STEP: SIGNUP */}
      {step === "signup" && (
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ background: "rgba(0,15,0,0.5)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 28, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.2em", marginBottom: 20 }}>
              ▸ CREATE VIEWER ACCOUNT — {selectedPlan?.name}
            </div>
            {["name", "email", "password"].map(field => (
              <div key={field} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 6, letterSpacing: "0.15em" }}>
                  {field === "name" ? "OPERATIVE NAME" : field === "email" ? "CONTACT EMAIL" : "PASSPHRASE"}
                </div>
                <input
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={field === "name" ? "Your name" : field === "email" ? "you@example.com" : "Min. 8 characters"}
                  style={{
                    width: "100%", background: "rgba(0,10,0,0.8)", border: "1px solid #1a3a1a",
                    borderRadius: 2, color: "#4ade80", fontFamily: "'Courier New', monospace",
                    fontSize: 12, padding: "10px 14px", outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "#4ade80"}
                  onBlur={e => e.target.style.borderColor = "#1a3a1a"}
                />
              </div>
            ))}
            <button
              onClick={handleSignup}
              disabled={!form.email || !form.name || !form.password}
              style={{
                width: "100%", background: "rgba(0,50,0,0.8)", border: "1px solid #4ade80",
                color: "#4ade80", fontFamily: "'Courier New', monospace", fontSize: 11,
                padding: "12px", cursor: "pointer", letterSpacing: "0.2em", borderRadius: 2, marginTop: 8,
              }}>
              [ CONTINUE TO PAYMENT ]
            </button>
          </div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.3, textAlign: "center", lineHeight: 1.8 }}>
            By continuing you agree to our Terms of Service and Privacy Policy.<br />
            Your data is never sold. Session content is not used for training without consent.
          </div>
        </div>
      )}

      {/* STEP: PAYMENT */}
      {step === "payment" && (
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          {/* Order summary */}
          <div style={{ background: "rgba(0,15,0,0.5)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 16, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5 }}>SELECTED TIER</div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: "#f0c040", fontWeight: 900 }}>{selectedPlan?.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5 }}>{billing.toUpperCase()}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#f0c040", fontWeight: 900 }}>
                ${price(selectedPlan).toFixed(2)}<span style={{ fontSize: 10, color: "#4ade80", opacity: 0.5 }}>/mo</span>
              </div>
            </div>
          </div>

          {/* Payment method selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ id: "card", label: "CARD" }, { id: "apple", label: " APPLE PAY" }, { id: "google", label: "G  GOOGLE PAY" }].map(m => (
              <button key={m.id} onClick={() => setPayMethod(m.id)} style={{
                flex: 1, background: payMethod === m.id ? "rgba(0,50,0,0.8)" : "transparent",
                border: `1px solid ${payMethod === m.id ? "#4ade80" : "#1a3a1a"}`,
                color: payMethod === m.id ? "#f0c040" : "#4ade80",
                fontFamily: "'Courier New', monospace", fontSize: 9, padding: "8px 4px",
                cursor: "pointer", letterSpacing: "0.1em", borderRadius: 2,
              }}>{m.label}</button>
            ))}
          </div>

          <div style={{ background: "rgba(0,15,0,0.5)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 24, marginBottom: 16 }}>
            {payMethod === "card" && (<>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.2em", marginBottom: 16 }}>
                ▸ CARD DETAILS
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 6 }}>CARD NUMBER</div>
                <input
                  value={cardForm.number}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                    const formatted = v.replace(/(.{4})/g, "$1 ").trim();
                    setCardForm(f => ({ ...f, number: formatted }));
                  }}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  style={{
                    width: "100%", background: "rgba(0,10,0,0.8)", border: "1px solid #1a3a1a",
                    borderRadius: 2, color: "#4ade80", fontFamily: "'Courier New', monospace",
                    fontSize: 14, padding: "10px 14px", outline: "none", boxSizing: "border-box", letterSpacing: "0.1em",
                  }}
                  onFocus={e => e.target.style.borderColor = "#4ade80"}
                  onBlur={e => e.target.style.borderColor = "#1a3a1a"}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { key: "expiry", label: "EXPIRY", placeholder: "MM / YY", maxLen: 7 },
                  { key: "cvc", label: "CVC", placeholder: "•••", maxLen: 4 },
                  { key: "zip", label: "ZIP / POSTAL", placeholder: "00000", maxLen: 10 },
                ].map(field => (
                  <div key={field.key}>
                    <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 6 }}>{field.label}</div>
                    <input
                      value={cardForm[field.key]}
                      onChange={e => setCardForm(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      maxLength={field.maxLen}
                      style={{
                        width: "100%", background: "rgba(0,10,0,0.8)", border: "1px solid #1a3a1a",
                        borderRadius: 2, color: "#4ade80", fontFamily: "'Courier New', monospace",
                        fontSize: 12, padding: "10px 10px", outline: "none", boxSizing: "border-box",
                      }}
                      onFocus={e => e.target.style.borderColor = "#4ade80"}
                      onBlur={e => e.target.style.borderColor = "#1a3a1a"}
                    />
                  </div>
                ))}
              </div>
            </>)}

            {(payMethod === "apple" || payMethod === "google") && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 28, color: "#4ade80", marginBottom: 12 }}>
                  {payMethod === "apple" ? "" : "G"}
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 1.8, opacity: 0.7 }}>
                  {payMethod === "apple" ? "Apple Pay" : "Google Pay"} button will appear here<br />
                  after Stripe integration is configured.<br />
                  <span style={{ opacity: 0.5, fontSize: 9 }}>Requires Stripe.js + payment request API</span>
                </div>
              </div>
            )}
          </div>

          {/* Terms checkbox */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16, cursor: "pointer" }} onClick={() => setAgreed(a => !a)}>
            <div style={{
              width: 14, height: 14, border: `1px solid ${agreed ? "#4ade80" : "#1a3a1a"}`,
              borderRadius: 2, flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center",
              background: agreed ? "rgba(0,50,0,0.8)" : "transparent",
            }}>
              {agreed && <span style={{ color: "#4ade80", fontSize: 10 }}>✓</span>}
            </div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.6, lineHeight: 1.6 }}>
              I agree to the Terms of Service and Privacy Policy. I understand this is a recurring subscription and can cancel anytime from my account settings.
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!agreed || processing || (payMethod === "card" && (!cardForm.number || !cardForm.expiry || !cardForm.cvc))}
            style={{
              width: "100%", background: processing ? "rgba(0,30,0,0.6)" : "rgba(0,60,0,0.9)",
              border: "1px solid #4ade80", color: "#4ade80",
              fontFamily: "'Courier New', monospace", fontSize: 12, padding: "14px",
              cursor: processing ? "not-allowed" : "pointer", letterSpacing: "0.2em", borderRadius: 2,
              animation: !processing ? "pulseGlow 2s ease-in-out infinite" : "none",
            }}>
            {processing ? "[ PROCESSING TRANSMISSION... ]" : `[ AUTHORIZE $${price(selectedPlan).toFixed(2)}/MO ]`}
          </button>

          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.3, textAlign: "center", marginTop: 12, lineHeight: 1.8 }}>
            🔒 Secured by Stripe. Card details never touch our servers.<br />
            Cancel anytime. No hidden fees. Prorated on upgrade.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FIELD MANUAL ─────────────────────────────────────────────────────────────

function FieldManual({ onBack, onSubscribe }) {
  const [activeSection, setActiveSection] = useState("what");

  const sections = [
    { id: "what", label: "WHAT IS THIS" },
    { id: "how", label: "HOW IT WORKS" },
    { id: "crv", label: "PROTOCOLS" },
    { id: "uses", label: "USE CASES" },
    { id: "tiers", label: "ACCESS TIERS" },
  ];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
          fontFamily: "'Courier New', monospace", fontSize: 9, padding: "6px 14px",
          cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2,
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#4ade80"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#1a3a1a"}
        >← BACK</button>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.3em", marginBottom: 2 }}>OPERATIONAL DOCUMENTATION</div>
          <div style={{ fontFamily: "Georgia, serif", color: "#4ade80", fontSize: 22, fontWeight: 900 }}>FIELD MANUAL</div>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid #1a3a1a", flexWrap: "wrap" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            background: activeSection === s.id ? "rgba(0,50,0,0.8)" : "transparent",
            border: "none", borderBottom: activeSection === s.id ? "2px solid #f0c040" : "2px solid transparent",
            color: activeSection === s.id ? "#f0c040" : "#4ade80",
            fontFamily: "'Courier New', monospace", fontSize: 9, padding: "8px 14px",
            cursor: "pointer", letterSpacing: "0.15em", marginBottom: -1,
          }}>{s.label}</button>
        ))}
      </div>

      {/* WHAT IS THIS */}
      {activeSection === "what" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            background: "rgba(0,15,0,0.5)", border: "1px solid #1a3a1a", borderLeft: "3px solid #f0c040",
            borderRadius: 2, padding: 28,
          }}>
            <div style={{ fontFamily: "Georgia, serif", color: "#f0c040", fontSize: 18, fontWeight: 900, marginBottom: 12 }}>
              STARGATE is a remote viewing training and simulation platform.
            </div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 2 }}>
              It is built on the actual structured methodology developed during a classified U.S. government psychoenergetics research program that ran from 1972 to 1995 — now fully declassified and part of the public record via the CIA's CREST archive.
              <br /><br />
              Remote viewing is the practice of attempting to perceive information about a distant, unseen, or otherwise inaccessible target using focused mental attention alone. The structured protocols used here — Coordinate Remote Viewing (CRV) and Extended Remote Viewing (ERV) — were developed to make that process as consistent, trainable, and documentable as possible.
              <br /><br />
              STARGATE is not a game. It is a serious practice environment for anyone interested in exploring the outer edges of human perception — whether you approach it as a psychoenergetics practitioner, a meditator, a researcher, a writer, or simply someone who is curious.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { icon: "◈", title: "STRUCTURED PROTOCOL", desc: "Every session follows the same 6-stage CRV framework used by trained program viewers. No guesswork. No free-association without structure." },
              { icon: "⬟", title: "AI MONITOR", desc: "MONITOR evaluates each stage of your session in real time, providing intelligence-grade feedback on signal quality, AOL contamination, and data value." },
              { icon: "⬡", title: "BLIND TARGETING", desc: "Targets are sealed — assigned by coordinate, temporal marker, subject designation, or anomaly reference only. You receive no descriptive information before or during a session. This replicates the true operational conditions of the original program. The target type is determined by your viewer profile." },
              { icon: "◇", title: "PERSONAL ARCHIVE", desc: "Every completed session is saved to your personal dossier and persists across visits in this browser. Browse past sessions, review stage data and Monitor evaluations, and track your development over time." },
            ].map(c => (
              <div key={c.title} style={{ background: "rgba(0,15,0,0.4)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 18 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 20, color: "#f0c040", marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#f0c040", fontWeight: 900, marginBottom: 6, letterSpacing: "0.1em" }}>{c.title}</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", lineHeight: 1.8, opacity: 0.8 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOW IT WORKS */}
      {activeSection === "how" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5, lineHeight: 1.8, marginBottom: 4 }}>
            A STARGATE session follows a defined operational sequence. Each step is deliberate.
          </div>
          {[
            { n: "01", title: "SELECT SESSION PROTOCOL", desc: "Choose from 12 session protocols, each built around a distinct collection mode — Coordinate Targeting, Deep Time, Emotional/Human, Anomalous/Subspace, Subspace/Concealed, Psychometric Contact, ERV, ARV, Dream State, Collective Field, Geographic Survey, or Signal Trace. Your protocol determines the type of targets you receive, the stage structure you work with, and the Monitor AI persona evaluating your session. This is your operational identity within the program." },
            { n: "02", title: "RECEIVE YOUR MISSION BRIEFING", desc: "You are assigned a target sealed to your profile mode — a coordinate, a temporal marker, a subject designation, an anomaly reference, a suppression code, or an object designation. No description. No image. No context beyond the reference code. This is intentional — it replicates the blind targeting methodology used in the original program. The less you know consciously, the cleaner your signal line." },
            { n: "03", title: "ENTER THE SESSION", desc: "Work through all six CRV stages in sequence. Do not skip stages. Do not read ahead. Each stage is designed to access progressively deeper layers of target contact — from raw gestalt impression to detailed spatial and analytical data." },
            { n: "04", title: "TRANSMIT TO MONITOR", desc: "After each stage, submit your data to MONITOR — the AI session handler. MONITOR evaluates your signal quality, flags analytical overlays, and assesses the intelligence value of your data. Feedback is immediate and specific." },
            { n: "05", title: "CLOSE THE SESSION", desc: "After Stage VI, close the session and receive your full debrief report. MONITOR compiles all stage data into a final intelligence assessment. Your session is archived in your personal dossier." },
            { n: "06", title: "CUSTOM TARGETING", desc: "Build your own targets — specifying location, time period, entity, operational objective, and freeform parameters. Session any location in the universe, any point in history or future, any anomalous event or suppressed intelligence. The custom target builder generates a sealed mission packet which launches directly into a full session." },
          ].map(step => (
            <div key={step.n} style={{ display: "flex", gap: 20, background: "rgba(0,15,0,0.4)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 20 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#f0c040", opacity: 0.3, fontWeight: 900, flexShrink: 0, lineHeight: 1 }}>{step.n}</div>
              <div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#f0c040", fontWeight: 900, marginBottom: 6, letterSpacing: "0.1em" }}>{step.title}</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", lineHeight: 1.9 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROTOCOLS */}
      {activeSection === "crv" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "rgba(0,15,0,0.5)", border: "1px solid #1a3a1a", borderLeft: "3px solid #f0c040", borderRadius: 2, padding: 20, marginBottom: 8 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", lineHeight: 2 }}>
              STARGATE operates across 12 distinct viewing protocols — each designed for a different type of target and mode of perception. The core framework is Coordinate Remote Viewing (CRV), a structured 6-stage methodology developed at Stanford Research Institute. Beyond CRV, the program includes Extended Remote Viewing (ERV), Associative Remote Viewing (ARV), Dream State, Collective Field, Geographic Survey, and Signal Trace — each with its own stage architecture, target pool, and Monitor AI evaluation criteria.
            </div>
          </div>
          {/* Protocol index */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: 8 }}>
            {[
              { id: "RV-001", badge: "⬟", name: "COORD TARGETING", mode: "CRV — 6 stages. Physical locations, installations, terrain." },
              { id: "RV-002", badge: "◈", name: "DEEP TIME", mode: "CRV — 6 stages. Temporal displacement, past and future events." },
              { id: "RV-003", badge: "⬡", name: "EMOTIONAL / HUMAN", mode: "CRV — 6 stages. People, emotional fields, intent, presence." },
              { id: "RV-004", badge: "◇", name: "ANOMALOUS", mode: "CRV — 6 stages. UAP events, non-human intelligence, suppressed phenomena." },
              { id: "RV-005", badge: "▽", name: "SUBSPACE / CONCEALED", mode: "CRV — 6 stages. Hidden, buried, or classified information." },
              { id: "RV-006", badge: "◉", name: "PSYCHOMETRIC", mode: "CRV — 6 stages. Object and place memory, residue of events." },
              { id: "RV-007", badge: "∞", name: "ERV — EXTENDED", mode: "ERV — 4 phases. Unstructured altered state, free signal stream." },
              { id: "RV-008", badge: "⊗", name: "ARV — ASSOCIATIVE", mode: "ARV — 6 stages. Binary outcome prediction, future-state targeting." },
              { id: "RV-009", badge: "☽", name: "DREAM STATE", mode: "Dream — 6 stages. Hypnagogic threshold, symbolic target access." },
              { id: "RV-010", badge: "⊕", name: "COLLECTIVE FIELD", mode: "Field — 6 stages. Mass events, group consciousness, emotional topology." },
              { id: "RV-011", badge: "◬", name: "GEOGRAPHIC SURVEY", mode: "Survey — 6 stages. Terrain mapping, subsurface, geological intelligence." },
              { id: "RV-012", badge: "⟶", name: "SIGNAL TRACE", mode: "Trace — 6 stages. Moving target tracking, trajectory projection." },
            ].map(p => (
              <div key={p.id} style={{ background: "rgba(0,10,0,0.5)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 12 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 16, color: "#f0c040", marginBottom: 4 }}>{p.badge}</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", fontWeight: 900, letterSpacing: "0.1em", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", lineHeight: 1.7, opacity: 0.8 }}>{p.mode}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.2em", marginTop: 8, marginBottom: 4 }}>CRV STAGE ARCHITECTURE</div>
          {[
            { stage: "I", name: "IDEOGRAM", color: "#4ade80", desc: "The first spontaneous mark or impression that arises when the target is presented. It happens before the analytical mind can intervene. It is not a drawing — it is a reflex. The ideogram carries the gestalt of the target: land, water, structure, life, energy. Do not analyze. Simply record." },
            { stage: "II", name: "SENSORY DATA", color: "#4ade80", desc: "Access the target through all available senses. Temperature, texture, sound, smell, color, light. No labels, no nouns. Only raw sensory descriptors. 'Cold, smooth, dark, metallic, low hum, faint chemical smell.' This stage builds the sensory envelope of the target." },
            { stage: "III", name: "DIMENSIONAL SKETCH", color: "#4ade80", desc: "Describe or sketch the spatial relationships at the target. Heights, distances, angles, geometry. What is above, below, to the sides. This is not an artistic exercise — it is a spatial map of what you are perceiving. Rough, approximate, instinctive." },
            { stage: "IV", name: "AOL BREAK + DEEP CONTACT", color: "#f0c040", desc: "Analytical Overlay (AOL) is when the conscious mind tries to name, explain, or label what you are perceiving. It is the enemy of clean data. At Stage IV you declare your AOLs — 'AOL: factory, AOL: office building' — then set them aside and go deeper. This is where the most operationally valuable data typically emerges." },
            { stage: "V", name: "INTERROGATE", color: "#f0c040", desc: "Actively probe the target. Ask it direct questions. What is this structure used for? How many people are present? What is the emotional atmosphere? What is happening right now? You are not guessing — you are querying the signal line intentionally." },
            { stage: "VI", name: "SUMMARY", color: "#c0392b", desc: "Synthesize everything from Stages I through V into a coherent intelligence summary. What is the target? What is its significance? What would you report to an analyst? This is your final transmission. Make it clear, specific, and honest about your confidence level." },
          ].map(s => (
            <div key={s.stage} style={{ display: "flex", gap: 16, background: "rgba(0,15,0,0.4)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 20 }}>
              <div style={{ flexShrink: 0, textAlign: "center", width: 40 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.4 }}>STAGE</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: s.color, fontWeight: 900 }}>{s.stage}</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: s.color, fontWeight: 900, letterSpacing: "0.1em", marginBottom: 6 }}>{s.name}</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", lineHeight: 1.9 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USE CASES */}
      {activeSection === "uses" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.5, lineHeight: 1.8, marginBottom: 4 }}>
            STARGATE has been designed to serve a wide range of practitioners and purposes.
          </div>
          {[
            { icon: "⬟", title: "PERSONAL PRACTICE & DEVELOPMENT", tier: "STARGATE", desc: "Use STARGATE as a daily or weekly practice to develop your intuitive perception. Track your accuracy over time. Build a personal archive of sessions. Identify your signal strengths and your AOL patterns. Treat it like a training program for the mind." },
            { icon: "◈", title: "MEDITATION & ALTERED STATE EXPLORATION", tier: "STARGATE", desc: "The CRV protocol is a powerful complement to established meditation practice. The structured, non-analytical state it requires is adjacent to deep meditative absorption. Many viewers report session states that feel indistinguishable from advanced contemplative practice." },
            { icon: "⬡", title: "CREATIVE & WRITING APPLICATIONS", tier: "STARGATE", desc: "Writers, artists, and designers use remote viewing as a source of raw, unfiltered material. Session a location that doesn't exist yet. View a character you haven't written. View a scene from a story before you write it. The protocol bypasses the inner critic entirely." },
            { icon: "◇", title: "RESEARCH & ACADEMIC STUDY", tier: "STARGATE", desc: "Researchers studying consciousness, perception, anomalous cognition, or the history of intelligence programs will find STARGATE a structured environment for firsthand study of the protocols described in the declassified literature." },
            { icon: "◈", title: "COLLABORATIVE VIEWING EXERCISES", tier: "STARGATE", desc: "Share target assignments with colleagues for double-blind viewing exercises. Compare session outputs across multiple viewers targeting the same coordinates. This replicates the multi-viewer methodology used operationally — where sessions from independent viewers were compared for convergence." },
            { icon: "⬟", title: "CUSTOM TARGET MISSIONS", tier: "STARGATE", desc: "Build your own targets with full parameter control — any location in the universe, any point in time, any entity or event. Session Mars 10 million years ago. View the construction of the Great Pyramid in real time. Assign a colleague a blind target and compare their session data to your intended target. The signal line has no jurisdiction." },
          ].map(u => (
            <div key={u.title} style={{ background: "rgba(0,15,0,0.4)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#f0c040", fontWeight: 900, letterSpacing: "0.1em" }}>{u.icon} {u.title}</div>
                <span style={{
                  fontFamily: "'Courier New', monospace", fontSize: 8, color: "#f0c040",
                  border: "1px solid #f0c040", padding: "2px 8px", borderRadius: 2, whiteSpace: "nowrap",
                }}>{u.tier}</span>
              </div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", lineHeight: 1.9 }}>{u.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* ACCESS TIERS */}
      {activeSection === "tiers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { name: "STARGATE", color: "#f0c040", price: "$19.99/mo · $99.99/yr", features: ["Unlimited sessions", "All 12 viewer protocols", "Full Stage I–VI protocol", "ERV — Extended Remote Viewing", "Advanced Monitor AI", "Personal dossier & archive", "Custom target builder", "PDF dossier export"] },
          ].map(t => (
            <div key={t.name} style={{ background: "rgba(0,15,0,0.4)", border: `1px solid ${t.color}`, borderRadius: 2, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 14, color: t.color, fontWeight: 900, letterSpacing: "0.15em" }}>{t.name}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: t.color, fontWeight: 900 }}>{t.price}</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {t.features.map(f => (
                  <span key={f} style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", background: "rgba(0,10,0,0.6)", border: "1px solid #1a3a1a", padding: "3px 10px", borderRadius: 2 }}>▸ {f}</span>
                ))}
              </div>
            </div>
          ))}
          <button onClick={onSubscribe} style={{
            background: "rgba(20,40,0,0.8)", border: "1px solid #f0c040", color: "#f0c040",
            fontFamily: "'Courier New', monospace", fontSize: 11, padding: "13px",
            cursor: "pointer", letterSpacing: "0.2em", borderRadius: 2, marginTop: 8,
          }}>[ UPGRADE CLEARANCE ]</button>
        </div>
      )}
    </div>
  );
}

// ─── CUSTOM TARGET BUILDER ─────────────────────────────────────────────────────

const TARGET_PRESETS = [
  { label: "Mars — 10 million years ago", location: "Mars, Hellas Planitia region", time: "10 million years ago", entity: "", objective: "Describe any signs of geological activity, atmosphere, or life", freeform: "" },
  { label: "Great Pyramid — during construction", location: "Giza Plateau, Egypt", time: "Circa 2560 BCE, during active construction", entity: "The primary architect or overseer present", objective: "Observe the construction methods and the people involved", freeform: "" },
  { label: "Tunguska Event — 1908", location: "Podkamennaya Tunguska River, Siberia", time: "June 30, 1908 — moment of impact", entity: "", objective: "Describe the event as it unfolds — what caused it, what it looked like", freeform: "" },
  { label: "Deep ocean — present day", location: "Mariana Trench, Pacific Ocean, deepest point", time: "Present", entity: "Any life forms present", objective: "Describe the environment, any unusual structures or activity", freeform: "" },
  { label: "Custom — build your own", location: "", time: "", entity: "", objective: "", freeform: "" },
];

function CustomTargetBuilder({ onBack, onLaunchSession, userTier = "sun_streak" }) {
  const [preset, setPreset] = useState(null);
  const [fields, setFields] = useState({ location: "", time: "", entity: "", objective: "", freeform: "" });
  const [generatedTarget, setGeneratedTarget] = useState(null);
  const [generating, setGenerating] = useState(false);

  const isSunStreak = userTier === "sun_streak";

  const applyPreset = (p) => {
    setPreset(p.label);
    setFields({ location: p.location, time: p.time, entity: p.entity, objective: p.objective, freeform: p.freeform });
    setGeneratedTarget(null);
  };

  const generateTarget = async () => {
    setGenerating(true);
    try {
      const prompt = `You are a STARGATE remote viewing session coordinator. Generate a formal target packet for a CRV session based on these parameters:

LOCATION: ${fields.location || "unspecified"}
TIME PERIOD: ${fields.time || "present"}
ENTITY/SUBJECT: ${fields.entity || "none specified"}
INTELLIGENCE OBJECTIVE: ${fields.objective || "general survey"}
ADDITIONAL PARAMETERS: ${fields.freeform || "none"}

Generate a target packet in this format:
TARGET ID: (generate a code like TGT-XXXX)
COORDINATES: (invent plausible-sounding coordinates appropriate to the target — use real coordinates if it's a real place, or descriptive coordinates like "TEMPORAL: -10,000,000Y / SPATIAL: 22.9°N 57.6°E" for unusual targets)
CLASSIFICATION: (pick from: GRILL FLAME / SUN STREAK // SENSITIVE / CENTER LANE // THIRD EYE / GONDOLA WISH // DEEP BLACK / SCANATE // BEYOND STARGATE)
DESCRIPTION: (1-2 sentences describing the actual target in full — this is the sealed answer used only by the Monitor to evaluate the viewer's session accuracy)
TASKING: (2-3 sentences giving the viewer their mission without revealing the target — use blind tasking language)
MONITOR GUIDANCE: (1-2 sentences of private guidance for the session monitor — what to watch for)

Keep it terse, classified, operational.`;

      const res = await fetch("/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";

      // Parse fields from response
      const getId = (t) => (t.match(/TARGET ID:\s*(.+)/)?.[1] || `TGT-${Math.floor(Math.random()*9000+1000)}`).trim();
      const getCoords = (t) => (t.match(/COORDINATES:\s*(.+)/)?.[1] || "COORDINATES SEALED").trim();
      const getClass = (t) => (t.match(/CLASSIFICATION:\s*(.+)/)?.[1] || "SUN STREAK // SENSITIVE").trim();
      const getDesc = (t) => (t.match(/DESCRIPTION:\s*([\s\S]*?)(?=TASKING:|MONITOR GUIDANCE:|$)/)?.[1] || "").trim();
      const getTasking = (t) => (t.match(/TASKING:\s*([\s\S]*?)(?=MONITOR GUIDANCE:|$)/)?.[1] || "").trim();
      const getMonitor = (t) => (t.match(/MONITOR GUIDANCE:\s*([\s\S]*?)$/)?.[1] || "").trim();

      setGeneratedTarget({
        id: getId(text),
        coords: getCoords(text),
        classification: getClass(text),
        description: getDesc(text),
        tasking: getTasking(text),
        monitorGuidance: getMonitor(text),
        rawParams: { ...fields },
      });
    } catch {
      setGeneratedTarget({ error: true });
    }
    setGenerating(false);
  };

  if (!isSunStreak) return (
    <div style={{ padding: "60px 24px", maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 32, color: "#c0392b", marginBottom: 16 }}>⬟</div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#c0392b", fontWeight: 900, marginBottom: 12 }}>STARGATE CLEARANCE REQUIRED</div>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 1.9, marginBottom: 28, opacity: 0.7 }}>
        Custom target generation requires an active STARGATE subscription.<br />
        Upgrade your clearance to unlock full target parameter control —<br />
        any location, any time, any entity. No boundaries.
      </div>
      <button onClick={onBack} style={{
        background: "rgba(20,10,0,0.8)", border: "1px solid #c0392b", color: "#c0392b",
        fontFamily: "'Courier New', monospace", fontSize: 11, padding: "12px 36px",
        cursor: "pointer", letterSpacing: "0.2em", borderRadius: 2, width: "100%", marginBottom: 12,
      }}>[ UPGRADE TO STARGATE ]</button>
      <button onClick={onBack} style={{
        background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
        fontFamily: "'Courier New', monospace", fontSize: 10, padding: "10px 36px",
        cursor: "pointer", letterSpacing: "0.2em", borderRadius: 2, width: "100%",
      }}>← BACK</button>
    </div>
  );

  return (
    <div style={{ padding: "32px 24px", maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
          fontFamily: "'Courier New', monospace", fontSize: 9, padding: "6px 14px",
          cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2,
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#4ade80"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#1a3a1a"}
        >← BACK</button>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.3em" }}>CUSTOM TARGET GENERATOR</div>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#f0c040", border: "1px solid #f0c040", padding: "1px 6px", borderRadius: 2 }}>STARGATE</span>
          </div>
          <div style={{ fontFamily: "Georgia, serif", color: "#4ade80", fontSize: 20, fontWeight: 900 }}>BUILD YOUR TARGET PACKET</div>
        </div>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.2em", marginBottom: 10 }}>▸ QUICK LOAD — PRESET TARGETS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TARGET_PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)} style={{
              background: preset === p.label ? "rgba(0,50,0,0.8)" : "rgba(0,15,0,0.5)",
              border: `1px solid ${preset === p.label ? "#4ade80" : "#1a3a1a"}`,
              color: preset === p.label ? "#f0c040" : "#4ade80",
              fontFamily: "'Courier New', monospace", fontSize: 9, padding: "6px 14px",
              cursor: "pointer", letterSpacing: "0.1em", borderRadius: 2,
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div style={{ background: "rgba(0,15,0,0.5)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 24, marginBottom: 20 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.2em", marginBottom: 18 }}>▸ TARGET PARAMETERS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "location", label: "LOCATION / COORDINATES", placeholder: "e.g. Mars, Olympus Mons region — or — 29.9792° N, 31.1342° E, Egypt", hint: "Planet, place, geographic coordinates, or spatial description" },
            { key: "time", label: "TIME PERIOD", placeholder: "e.g. 10 million years ago — or — July 1969 — or — 2,500 BCE — or — Present", hint: "Relative or absolute time. Past, present, or future." },
            { key: "entity", label: "ENTITY / SUBJECT (OPTIONAL)", placeholder: "e.g. Any life present — or — the primary engineer — or — leave blank for environmental survey", hint: "Person, organism, or entity to focus on. Leave blank for general survey." },
            { key: "objective", label: "INTELLIGENCE OBJECTIVE", placeholder: "e.g. Describe the atmosphere and surface conditions — or — identify the purpose of the structure", hint: "What does the viewer need to find out?" },
          ].map(f => (
            <div key={f.key}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 4, letterSpacing: "0.15em" }}>{f.label}</div>
              <input
                value={fields[f.key]}
                onChange={e => { setFields(prev => ({ ...prev, [f.key]: e.target.value })); setGeneratedTarget(null); }}
                placeholder={f.placeholder}
                style={{
                  width: "100%", background: "rgba(0,10,0,0.8)", border: "1px solid #1a3a1a",
                  borderRadius: 2, color: "#4ade80", fontFamily: "'Courier New', monospace",
                  fontSize: 11, padding: "10px 14px", outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#4ade80"}
                onBlur={e => e.target.style.borderColor = "#1a3a1a"}
              />
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.3, marginTop: 4 }}>{f.hint}</div>
            </div>
          ))}
          <div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 4, letterSpacing: "0.15em" }}>FREE-FORM PARAMETERS (OPTIONAL)</div>
            <textarea
              value={fields.freeform}
              onChange={e => { setFields(prev => ({ ...prev, freeform: e.target.value })); setGeneratedTarget(null); }}
              placeholder="Any additional context, constraints, or operational notes for the Monitor AI..."
              rows={3}
              style={{
                width: "100%", background: "rgba(0,10,0,0.8)", border: "1px solid #1a3a1a",
                borderRadius: 2, color: "#4ade80", fontFamily: "'Courier New', monospace",
                fontSize: 11, padding: "10px 14px", outline: "none", boxSizing: "border-box", resize: "vertical",
              }}
              onFocus={e => e.target.style.borderColor = "#4ade80"}
              onBlur={e => e.target.style.borderColor = "#1a3a1a"}
            />
          </div>
        </div>
      </div>

      {/* Generate */}
      <button onClick={generateTarget}
        disabled={generating || (!fields.location && !fields.freeform)}
        style={{
          width: "100%", background: generating ? "rgba(0,30,0,0.5)" : "rgba(0,50,0,0.8)",
          border: "1px solid #4ade80", color: "#4ade80",
          fontFamily: "'Courier New', monospace", fontSize: 11, padding: "13px",
          cursor: generating ? "not-allowed" : "pointer", letterSpacing: "0.2em", borderRadius: 2, marginBottom: 20,
        }}>
        {generating ? "[ GENERATING TARGET PACKET... ]" : "[ GENERATE TARGET PACKET ]"}
      </button>

      {/* Generated target display */}
      {generatedTarget && !generatedTarget.error && (
        <div style={{ background: "rgba(0,0,0,0.7)", border: "1px solid #2a4a2a", borderLeft: "3px solid #f0c040", padding: 24, borderRadius: 2, marginBottom: 20 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.2em", marginBottom: 16 }}>▸ TARGET PACKET GENERATED — SEALED</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { label: "TARGET ID", value: generatedTarget.id },
              { label: "CLASSIFICATION", value: generatedTarget.classification },
            ].map(r => (
              <div key={r.label} style={{ background: "rgba(0,15,0,0.5)", border: "1px solid #1a3a1a", padding: 12, borderRadius: 2 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#f0c040", fontWeight: 900 }}>{r.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 4 }}>COORDINATES</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#4ade80" }}>{generatedTarget.coords}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.5, marginBottom: 4 }}>TASKING INSTRUCTIONS (VIEWER-FACING)</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", lineHeight: 1.8 }}>{generatedTarget.tasking}</div>
          </div>
          {generatedTarget.monitorGuidance && (
            <div style={{ borderTop: "1px solid #1a3a1a", paddingTop: 12 }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#c0392b", opacity: 0.7, marginBottom: 4 }}>MONITOR GUIDANCE — DO NOT SHARE WITH VIEWER</div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", lineHeight: 1.8, opacity: 0.8 }}>{generatedTarget.monitorGuidance}</div>
            </div>
          )}
          <button
            onClick={() => onLaunchSession(generatedTarget)}
            style={{
              width: "100%", background: "rgba(20,50,0,0.9)", border: "1px solid #f0c040", color: "#f0c040",
              fontFamily: "'Courier New', monospace", fontSize: 11, padding: "13px",
              cursor: "pointer", letterSpacing: "0.2em", borderRadius: 2, marginTop: 20,
              animation: "pulseGlow 2s ease-in-out infinite",
            }}>[ LAUNCH VIEWING SESSION ]</button>
        </div>
      )}
      {generatedTarget?.error && (
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#c0392b", padding: 16, border: "1px solid #c0392b", borderRadius: 2, textAlign: "center" }}>
          TARGET GENERATION FAILED — SECURE CHANNEL INTERRUPTED. RETRY.
        </div>
      )}
    </div>
  );
}

// ─── STORAGE / DOSSIER ────────────────────────────────────────────────────────

function useDossier() {
  const [sessions, setSessions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith("session:"));
      const items = keys.map(k => {
        try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }
      });
      setSessions(items.filter(Boolean).sort((a, b) => b.savedAt - a.savedAt));
    } catch {
      setSessions([]);
    }
    setLoaded(true);
  }, []);

  const saveSession = useCallback((session) => {
    const key = `session:${session.sessionId}`;
    const record = { ...session, savedAt: Date.now() };
    try {
      localStorage.setItem(key, JSON.stringify(record));
      setSessions(prev => {
        const filtered = prev.filter(s => s.sessionId !== session.sessionId);
        return [record, ...filtered];
      });
    } catch (e) {
      console.error("Failed to save session:", e);
    }
  }, []);

  const deleteSession = useCallback((sessionId) => {
    try {
      localStorage.removeItem(`session:${sessionId}`);
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
    } catch (e) {
      console.error("Failed to delete session:", e);
    }
  }, []);

  return { sessions, loaded, saveSession, deleteSession };
}

function Dossier({ onBack, sessions, loaded, onDeleteSession, onViewSession }) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const completedStages = (s) => s.stageData?.filter(d => d?.trim()).length || 0;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
          fontFamily: "'Courier New', monospace", fontSize: 9, padding: "6px 14px",
          cursor: "pointer", letterSpacing: "0.15em", borderRadius: 2,
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#4ade80"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#1a3a1a"}
        >← BACK</button>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#f0c040", letterSpacing: "0.3em", marginBottom: 2 }}>PERSISTENT ARCHIVE — LOCAL STORAGE</div>
          <div style={{ fontFamily: "Georgia, serif", color: "#4ade80", fontSize: 22, fontWeight: 900 }}>PERSONAL DOSSIER</div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", opacity: 0.8 }}>
          {sessions.length} SESSION{sessions.length !== 1 ? "S" : ""} ON FILE
        </div>
      </div>

      {!loaded && (
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", opacity: 0.8, textAlign: "center", padding: 40 }}>
          ACCESSING ARCHIVE...
        </div>
      )}

      {loaded && sessions.length === 0 && (
        <div style={{
          background: "rgba(0,15,0,0.4)", border: "1px solid #1a3a1a", borderRadius: 2,
          padding: 48, textAlign: "center",
        }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 28, color: "#1a3a1a", marginBottom: 16 }}>◈</div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#4ade80", opacity: 0.9, lineHeight: 1.8 }}>
            NO SESSIONS ON FILE<br />
            <span style={{ fontSize: 9, opacity: 0.7 }}>Complete a remote viewing session to begin your archive.</span>
          </div>
        </div>
      )}

      {loaded && sessions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
            {[
              { label: "TOTAL SESSIONS", value: sessions.length },
              { label: "STAGES COMPLETED", value: sessions.reduce((a, s) => a + completedStages(s), 0) },
              { label: "TARGETS VIEWED", value: new Set(sessions.map(s => s.target?.id)).size },
            ].map(stat => (
              <div key={stat.label} style={{ background: "rgba(0,15,0,0.4)", border: "1px solid #1a3a1a", borderRadius: 2, padding: 14, textAlign: "center" }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.7, marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#f0c040", fontWeight: 900 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {sessions.map(s => (
            <div key={s.sessionId} style={{
              background: "rgba(0,15,0,0.4)", border: "1px solid #1a3a1a", borderRadius: 2, overflow: "hidden",
            }}>
              {/* Session header row */}
              <div
                style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                onClick={() => setExpandedId(expandedId === s.sessionId ? null : s.sessionId)}
              >
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 18, color: "#f0c040", opacity: 0.8, flexShrink: 0 }}>
                  {s.viewer?.badge || "◈"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#f0c040", fontWeight: 900 }}>{s.sessionId}</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.85 }}>
                      {s.target?.id} · {s.viewer?.callsign}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.75, marginTop: 3 }}>
                    {new Date(s.savedAt).toLocaleString()} UTC · {completedStages(s)}/{(STAGES_BY_VIEWER[s.viewer?.id] || STAGES_BY_VIEWER["RV-001"]).length} STAGES · {s.target?.classification}
                  </div>
                </div>

                {/* Stage pip indicators */}
                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                  {Array((STAGES_BY_VIEWER[s.viewer?.id] || STAGES_BY_VIEWER["RV-001"]).length).fill(0).map((_, i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: s.stageData?.[i]?.trim() ? "#4ade80" : "#1a3a1a",
                    }} />
                  ))}
                </div>

                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", opacity: 0.7, flexShrink: 0 }}>
                  {expandedId === s.sessionId ? "▲" : "▼"}
                </div>
              </div>

              {/* Expanded view */}
              {expandedId === s.sessionId && (
                <div style={{ borderTop: "1px solid #1a3a1a", padding: "16px 18px" }}>
                  {(STAGES_BY_VIEWER[s.viewer?.id] || STAGES_BY_VIEWER["RV-001"]).map((stage, i) => s.stageData?.[i]?.trim() && (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#f0c040", marginBottom: 4, letterSpacing: "0.1em" }}>{stage.label}</div>
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#4ade80", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{s.stageData[i]}</div>
                    </div>
                  ))}

                  {s.evaluations?.some(e => e) && (
                    <div style={{ borderTop: "1px solid #1a3a1a", paddingTop: 12, marginTop: 4 }}>
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#f0c040", marginBottom: 8, letterSpacing: "0.1em" }}>MONITOR EVALUATIONS</div>
                      {s.evaluations.map((ev, i) => ev && (
                        <div key={i} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: "2px solid #1a3a1a" }}>
                          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 7, color: "#4ade80", opacity: 0.7, marginBottom: 4 }}>STAGE {i + 1}</div>
                          <pre style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.9, whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.7 }}>{ev}</pre>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    {confirmDelete === s.sessionId ? (
                      <>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#c0392b", alignSelf: "center", flex: 1 }}>CONFIRM DELETION — THIS CANNOT BE UNDONE</span>
                        <button onClick={() => { onDeleteSession(s.sessionId); setConfirmDelete(null); setExpandedId(null); }} style={{
                          background: "rgba(40,0,0,0.8)", border: "1px solid #c0392b", color: "#c0392b",
                          fontFamily: "'Courier New', monospace", fontSize: 9, padding: "6px 14px",
                          cursor: "pointer", letterSpacing: "0.1em", borderRadius: 2,
                        }}>PURGE</button>
                        <button onClick={() => setConfirmDelete(null)} style={{
                          background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80",
                          fontFamily: "'Courier New', monospace", fontSize: 9, padding: "6px 14px",
                          cursor: "pointer", letterSpacing: "0.1em", borderRadius: 2,
                        }}>CANCEL</button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDelete(s.sessionId)} style={{
                        background: "transparent", border: "1px solid #1a3a1a", color: "#4ade80", opacity: 0.7,
                        fontFamily: "'Courier New', monospace", fontSize: 9, padding: "6px 14px",
                        cursor: "pointer", letterSpacing: "0.1em", borderRadius: 2, marginLeft: "auto",
                      }}>⊘ PURGE SESSION</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: "#4ade80", opacity: 0.65, textAlign: "center", marginTop: 24, lineHeight: 1.8 }}>
        Sessions are stored locally in this browser. They persist across visits but are not synced to a server.<br />
        Clearing your browser data will erase your archive.
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState("boot");
  const [prevPhase, setPrevPhase] = useState("select");
  const [viewer, setViewer] = useState(null);
  const [target, setTarget] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [completedSession, setCompletedSession] = useState(null);
  const { sessions, loaded, saveSession, deleteSession } = useDossier();

  const goTo = (p) => { setPrevPhase(phase); setPhase(p); };
  const goBack = () => setPhase(["learn","subscribe","fieldmanual","customtarget","dossier"].includes(prevPhase) ? "select" : prevPhase);

  const handleEnter = () => setPhase("select");
  const handleSelectViewer = (v) => { const pool = TARGETS_BY_VIEWER[v.id] || TARGETS_BY_VIEWER["RV-001"]; setViewer(v); setTarget(pool[Math.floor(Math.random() * pool.length)]); setSessionId(generateSessionId()); setPhase("brief"); };
  const handleBegin = () => { setPhase("session"); };
  const handleComplete = (s) => {
    setCompletedSession(s);
    saveSession(s);
    setPhase("report");
  };
  const handleNewSession = () => { const pool = TARGETS_BY_VIEWER[viewer.id] || TARGETS_BY_VIEWER["RV-001"]; setTarget(pool[Math.floor(Math.random() * pool.length)]); setSessionId(generateSessionId()); setCompletedSession(null); setPhase("brief"); };
  const handleLaunchCustomSession = (generatedTarget) => {
    if (!viewer) setViewer(VIEWERS[0]);
    setTarget(generatedTarget);
    setSessionId(generateSessionId());
    setPhase("session");
  };

  if (phase === "boot") return (
    <>
      <style>{`
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 8px rgba(74,222,128,0.3); } 50% { box-shadow: 0 0 20px rgba(74,222,128,0.6); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        .blink-dot { animation: blink 1.4s ease-in-out infinite; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #020a02; }
        textarea::placeholder, input::placeholder { color: rgba(74,222,128,0.3); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #020a02; } ::-webkit-scrollbar-thumb { background: #1a3a1a; }
      `}</style>
      <Scanlines /><Noise />
      <BootScreen onEnter={handleEnter} />
    </>
  );

  return (
    <>
      <style>{`
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 8px rgba(74,222,128,0.3); } 50% { box-shadow: 0 0 20px rgba(74,222,128,0.6); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        .blink-dot { animation: blink 1.4s ease-in-out infinite; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #020a02; }
        textarea::placeholder, input::placeholder { color: rgba(74,222,128,0.3); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #020a02; } ::-webkit-scrollbar-thumb { background: #1a3a1a; }
        @media (max-width: 640px) {
          #desktop-nav { display: none !important; }
          #hamburger { display: block !important; }
        }
      `}</style>
      <Scanlines /><Noise />
      <div style={{ minHeight: "100vh", background: "#020a02", color: "#4ade80" }}>
        <Header
          viewer={viewer} sessionId={sessionId}
          onLearnMore={() => goTo("learn")}
          onSubscribe={() => goTo("subscribe")}
          onFieldManual={() => goTo("fieldmanual")}
          onCustomTarget={() => goTo("customtarget")}
          onDossier={() => goTo("dossier")}
          sessionCount={sessions.length}
        />
        {phase === "select" && <ViewerSelect onSelect={handleSelectViewer} onDossier={() => goTo("dossier")} sessionCount={sessions.length} />}
        {phase === "brief" && <SessionBrief viewer={viewer} target={target} onBegin={handleBegin} onBack={() => setPhase("select")} sessionId={sessionId} />}
        {phase === "session" && <SessionView viewer={viewer} target={target} sessionId={sessionId} onComplete={handleComplete} onBack={() => setPhase("brief")} />}
        {phase === "report" && <SessionReport session={completedSession} onNewSession={handleNewSession} />}
        {phase === "learn" && <LearnMore onBack={goBack} />}
        {phase === "subscribe" && <SubscriptionScreen onBack={goBack} />}
        {phase === "fieldmanual" && <FieldManual onBack={goBack} onSubscribe={() => goTo("subscribe")} />}
        {phase === "customtarget" && <CustomTargetBuilder onBack={goBack} onLaunchSession={handleLaunchCustomSession} userTier="sun_streak" />}
        {phase === "dossier" && <Dossier onBack={goBack} sessions={sessions} loaded={loaded} onDeleteSession={deleteSession} />}
      </div>
    </>
  );
}
