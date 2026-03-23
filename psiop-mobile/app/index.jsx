import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Linking, Modal, Platform,
  SafeAreaView, ScrollView, Share, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from "react-native";
import { ClerkProvider, useUser, useAuth, useOAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import * as Linking2 from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key) { try { return await SecureStore.getItemAsync(key); } catch { return null; } },
  async saveToken(key, value) { try { await SecureStore.setItemAsync(key, value); } catch {} },
  async clearToken(key) { try { await SecureStore.deleteItemAsync(key); } catch {} },
};

const C = {
  bg: "#020a02", green: "#4ade80", amber: "#f0c040",
  darkGreen: "#1a3a1a", midGreen: "#2a5a2a", cardBg: "rgba(0,15,0,0.6)",
  dimGreen: "rgba(74,222,128,0.08)",
};

const BOOT_ENTER_PHRASES = [
  "► OPEN YOUR MIND TO PROCEED",
  "[ YOUR CONSCIOUSNESS IS THE KEY ]",
  "► THE TARGET IS WAITING",
  "[ INITIATE PSYCHIC CONTACT ]",
  "► SIGNAL DETECTED — TOUCH TO LOCK ON",
  "[ THE GATE IS OPEN. STEP THROUGH. ]",
  "► YOU HAVE BEEN CLEARED. ENTER.",
  "[ CLEAR YOUR MIND AND TOUCH THE SCREEN ]",
];

// ─── BOOT ─────────────────────────────────────────────────────────────────────
function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const bootSequence = [
    "STARGATE COMMAND — PSYCHOENERGETICS DIVISION",
    "INITIALIZING CRV TRAINING SYSTEM...",
    "LOADING 12 OPERATIONAL PROTOCOLS...",
    "SIGNAL LINE: ACTIVE",
    "MONITOR AI: ONLINE — DIA MANUAL v1986",
    "TARGET POOL: SEALED",
    "SESSION ENCRYPTION: ENABLED",
    "► VIEWER CLEARANCE VERIFIED — WELCOME OPERATIVE",
  ];
  const [ready, setReady] = useState(false);
  const [blink, setBlink] = useState(true);
  const enterPhrase = useRef(BOOT_ENTER_PHRASES[Math.floor(Math.random() * BOOT_ENTER_PHRASES.length)]).current;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setReady(true), 600);
      }
    }, 380);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const blinkInterval = setInterval(() => setBlink(b => !b), 600);
    return () => clearInterval(blinkInterval);
  }, [ready]);

  return (
    <TouchableOpacity style={styles.bootContainer} onPress={() => ready && onComplete()} activeOpacity={1}>
      <Text style={styles.bootTitle}>⬟ STARGATE</Text>
      <Text style={styles.bootSub}>PSYCHOENERGETICS TRAINING SYSTEM</Text>
      <View style={styles.bootLines}>
        {lines.map((line, i) => (
          <Text key={i} style={[styles.bootLine, line?.startsWith("►") && { color: C.amber, opacity: 1 }]}>{line}</Text>
        ))}
        {lines.length < bootSequence.length && <Text style={styles.bootLine}>_</Text>}
      </View>
      {ready && (
        <View style={styles.bootEnterWrap}>
          <View style={styles.bootEnterDivider} />
          <Text style={[styles.bootEnterText, { opacity: blink ? 1 : 0.15 }]}>
            {enterPhrase}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── PROTOCOLS ────────────────────────────────────────────────────────────────
const PROTOCOLS = [
  { id: "RV-001", badge: "⬟", name: "COORDINATE TARGETING", callsign: "VIEWER PRIME", targets: 29, recommended: true,
    focus: "Standard CRV — physical sites, structures, and geographic coordinates. Foundation protocol.",
    brief: "You will be assigned a blind coordinate and guided through the 6-stage CRV structure to build a complete picture of a physical location. This is the foundational protocol — the methodology all others are built on." },
  { id: "RV-002", badge: "◈", name: "DEEP TIME", callsign: "PROTOCOLS LEAD", targets: 26,
    focus: "Temporal targeting — historical events, past and future moments.",
    brief: "Your target is a specific moment in time. You will perceive the atmosphere, physical environment, and key events of that moment without being told when it is. High AOL risk — the mind wants to assign known periods." },
  { id: "RV-003", badge: "⬡", name: "EMOTIONAL / HUMAN", callsign: "FIELD OPERATIVE", targets: 26,
    focus: "Person or group targeting — emotional state, intent, and activity.",
    brief: "Your target is a human subject or group. You will perceive their emotional state, environment, and intent. Emotional impressions are valid sensory data in this protocol. Identity AOL runs high." },
  { id: "RV-004", badge: "◇", name: "ANOMALOUS / SUBSPACE", callsign: "SIGNAL AMPLIFIER", targets: 43,
    focus: "Non-ordinary phenomena — UAP, anomalous events, unclassified energetics.",
    brief: "Your target is a phenomenon that resists ordinary categorization. Report without framework. The analytical mind will be under extreme pressure — AOL Drive is the primary hazard in this protocol." },
  { id: "RV-005", badge: "▣", name: "SUBSPACE / CONCEALED", callsign: "SUBSURFACE ANALYST", targets: 26,
    focus: "Hidden structures and underground facilities.",
    brief: "Your target has both a visible surface and something deliberately concealed beneath it. You will penetrate from surface to subspace and report what is hidden and why." },
  { id: "RV-006", badge: "⬔", name: "PSYCHOMETRIC CONTACT", callsign: "PSYCHOMETRIST", targets: 26,
    focus: "Object targeting — psychometric imprint, history, and ownership.",
    brief: "Your target is a physical object. Objects carry emotional and historical residue from significant contact. You will perceive its physical qualities, embedded emotional field, and key historical moments." },
  { id: "RV-007", badge: "◉", name: "ERV — EXTENDED", callsign: "DEEP OPERATIVE", targets: 26,
    focus: "Extended Remote Viewing — deep relaxation protocol for full scene immersion.",
    brief: "ERV uses a deeper relaxed state than standard CRV. The signal holds longer and carries more detail. Sensory data arrives in continuous flows rather than clusters. Allow more time at each stage." },
  { id: "RV-008", badge: "⊕", name: "ARV — ASSOCIATIVE", callsign: "ORACLE ANALYST", targets: 26,
    focus: "Associative RV — binary outcome prediction via image association.",
    brief: "ARV is used to predict binary outcomes. Your first unfiltered impression of the associative image IS the signal. Analytical reasoning is the primary threat. Trust impression, not deduction." },
  { id: "RV-009", badge: "◑", name: "DREAM STATE", callsign: "DREAM ARCHITECT", targets: 26,
    focus: "Hypnagogic threshold targeting — symbolic imagery at the edge of sleep.",
    brief: "This protocol works at the hypnagogic threshold — the edge between waking and sleep. Imagery is symbolic and emotional. Report raw impressions without interpretation. Dream logic generates AOL rapidly." },
  { id: "RV-010", badge: "❋", name: "COLLECTIVE FIELD", callsign: "FIELD RESONATOR", targets: 26,
    focus: "Mass consciousness targeting — collective emotional and informational fields.",
    brief: "Your target is the shared consciousness of a population or group. Your own emotional resonance with the field is the primary contamination risk. Separating your signal from the collective signal is the core discipline." },
  { id: "RV-011", badge: "⊞", name: "GEOGRAPHIC SURVEY", callsign: "TERRAIN OPERATIVE", targets: 26,
    focus: "Terrain and geographic intelligence — topography, infrastructure, strategic value.",
    brief: "Your target is a geographic location assessed for strategic value. Geographic pattern recognition produces AOL rapidly — the mind assigns known landscapes. Stay with raw terrain perception." },
  { id: "RV-012", badge: "⟡", name: "SIGNAL TRACE", callsign: "SIGNAL TRACER", targets: 26,
    focus: "Signal sourcing — following an active transmission to its point of origin.",
    brief: "Your target is an active signal. You will acquire it, characterize it, and follow it to its source. Technology-category AOL runs high — the mind assigns known communication frameworks." },
];

// ─── STAGE INSTRUCTIONS ───────────────────────────────────────────────────────
// Grounded in the 1986 DIA CRV Manual (Paul H. Smith). Shown as visible guidance
// cards above the input field — not as placeholder text.
const STAGE_INSTRUCTIONS = {
  "RV-001": [
    "STAGE I — FIRST CONTACT\n\nRelax. Look at the coordinate. Without thinking, write or describe the very first thing that comes — a word, a feeling, a motion. This is your ideogram: your nervous system's raw response before your thinking mind can interfere.\n\nOnce it arrives, notice what it feels like — not what it is, but how it moves or sits: flowing, jagged, rising, flat, dense, smooth. From that sensation, what is the broad nature of what you're sensing? Land, water, structure, something man-made, something natural?\n\nDon't name the place. Let the feeling lead to the category.",
    "STAGE II — SENSORY DATA\n\nReport only raw sensory impressions — what you would experience if standing there physically.\n\nDescribe: colors, textures, temperatures, sounds, smells. Adjectives only — no nouns, no place names, no object labels. 'Cold, grey, wet, low hum, metallic' is correct. 'Factory' or 'river' is not.\n\nIf your mind tries to NAME the place, write 'AOL:' followed by what it's suggesting (e.g. 'AOL: airport') — then set it aside and keep going with raw sensory words.",
    "STAGE III — SIZE AND SHAPE\n\nDescribe the physical dimensions of what you're sensing. How big is it? How tall, wide, deep? What shapes or profiles do you perceive?\n\nDescribe it as if sketching with words — contours, heights, distances, open or enclosed spaces.\n\nIf you suddenly feel a strong emotional reaction to the target — surprise, awe, unease — write 'AI:' followed by what you feel (e.g. 'AI: overwhelming'). This is Aesthetic Impact. Write it down and let the feeling pass before continuing.",
    "STAGE IV — CLEAR THE MIND\n\nYour analytical mind has been trying to name and categorize the target throughout this session. Now you expel all of it.\n\nWrite 'AOL:' before every guess or label your mind has formed: 'AOL: dam / AOL: power station / AOL: reservoir'. Each one you write is released.\n\nIf the same guess keeps returning, write 'AOL/Drive' — your mind is stuck on it. Note it firmly, set it aside, re-read the coordinate and make fresh contact.",
    "STAGE V — PROBE THE TARGET\n\nNow go deeper. You can be more specific here. Probe with direct questions:\n\nWhat is this place FOR? What happens here? Who or what is present? Is there activity, movement, concealment? What is the strategic or operational significance?\n\nReport whatever comes — even if strange or uncertain. Do not filter. Follow your impressions through the target.",
    "STAGE VI — INTELLIGENCE SUMMARY\n\nCompile everything into a final report.\n\nInclude: your first overall impression, the sensory data, the shapes and dimensions, all AOLs declared, and your Stage V findings.\n\nClose with a confidence assessment — how clear was the signal? What felt like solid data versus uncertain noise? This is your intelligence product.",
  ],
  "RV-002": [
    "STAGE I — FIRST CONTACT\n\nRelax and look at the coordinate. Write your very first impression — a word, a feeling, a motion. Trust what comes before analysis has a chance to form.\n\nNotice how the impression feels — ancient, vast, still, violent, alive, hollow. From that sensation, what is the broad nature of what you're sensing? Land, water, structure, human activity, an event?\n\nDon't try to identify when this is. No dates, no eras. Let the feeling come first.",
    "STAGE II — SENSORY DATA\n\nDescribe what you would physically sense if present at this moment in time. Colors, textures, temperatures, sounds, smells, atmospheric quality.\n\nAdjectives only — no time period names, no civilization names, no event names. 'Hot, dusty, orange light, low rumble, acrid smoke' is correct. 'Ancient Rome' or 'battle' is not.\n\nIf your mind assigns an era or event, write 'AOL:' followed by it — then keep going with raw sensory words.",
    "STAGE III — WHAT HAS BEEN BUILT\n\nDescribe the physical scale and structure of what exists at this moment in time.\n\nHow large? What shapes and profiles? How complex or simple is the construction? How organized or chaotic?\n\nIf you feel a sudden strong emotional reaction — awe, dread, sorrow — write 'AI:' followed by the feeling, let it pass, then continue. Deep Time sessions often produce powerful emotional responses.",
    "STAGE IV — CLEAR THE MIND\n\nRelease all the eras, events, and civilizations your mind has been assigning.\n\nWrite 'AOL:' before each: 'AOL: Egyptian / AOL: medieval / AOL: battle'. Each one is released.\n\nIf the same period keeps asserting itself, write 'AOL/Drive: [period]' — your mind is locked on it. Note it firmly and make fresh contact with the coordinate.",
    "STAGE V — THE EVENT\n\nWhat specific moment drew the tasking here? What is happening? Who are the key figures? What is the nature and significance of this event?\n\nMove through it. Probe from different positions within the scene. Let the target show you what is important.",
    "STAGE VI — TEMPORAL DEBRIEF\n\nCompile your full session: first impression of the era, sensory and atmospheric data, description of what was built, all AOLs declared, and your account of the specific event.\n\nWas the signal consistent? What felt like clean data versus assumption? State your overall confidence.",
  ],
  "RV-003": [
    "STAGE I — FIRST CONTACT\n\nRelax. Look at the coordinate. Write your very first impression — a word, a feeling, a sense of presence.\n\nNotice the quality of what you're sensing — tense, calm, focused, scattered, agitated, still. From that quality, what is the broad nature? A single person, a group, something moving, something waiting?\n\nDon't attempt to identify who this is. Presence only — let the felt quality come before anything else.",
    "STAGE II — EMOTIONAL AND SENSORY FIELD\n\nDescribe what you sense around this person or group — colors, temperatures, sounds, textures in their environment.\n\nEmotional impressions are valid data here: 'heavy, tight, fearful, controlled, suppressed rage' are as valid as physical sensory words. Report them in clusters without analysis.\n\nIf your mind tries to identify the person, write 'AOL:' followed by the name — then continue with raw perception.",
    "STAGE III — PHYSICAL PRESENCE\n\nDescribe the physical space around the subject. How large is their environment? Open or enclosed? Alone or surrounded?\n\nBegin sensing general physical characteristics — form, posture, movement, position in space. Describe the felt shape of their presence.\n\nWrite 'AI:' if you have a sudden emotional reaction to what you're perceiving, let it pass, then continue.",
    "STAGE IV — CLEAR THE MIND\n\nRelease all the identities your mind has tried to assign.\n\nWrite 'AOL:' before each: 'AOL: soldier / AOL: politician / AOL: criminal'. Each one is released.\n\nIdentity AOLs chain quickly — one guess leads to another. If this happened write 'AOL/Drive' and reset. Perceive only the presence, not the person.",
    "STAGE V — INTENT AND PURPOSE\n\nNow probe directly. What is this person or group doing? What do they want? What are they concealing, planning, or protecting?\n\nWhat drives their current actions? Where is their attention directed? What emotion is most dominant — and what are they suppressing?\n\nReport without naming. Move through their space and perceive their intent.",
    "STAGE VI — HUMAN INTELLIGENCE SUMMARY\n\nCompile your full session: first impression of the presence, the emotional and sensory field, the physical environment, all AOLs declared, and your assessment of intent and activity.\n\nWhich data felt like clean signal versus your own emotional projection? State your confidence on the core intent assessment.",
  ],
  "RV-004": [
    "STAGE I — FIRST CONTACT\n\nRelax. Look at the coordinate. Write the very first impression — a word, a feeling, a motion.\n\nThis target is anomalous — your first impression may be unfamiliar or resist categorization. That is correct. Notice how it feels: pulsing, vast, silent, charged, alien, pressurized. From that sensation, what is the broad nature? Energy, presence, phenomenon, form?\n\nDon't try to rationalize it. Report the raw encounter and let the feeling name itself.",
    "STAGE II — SENSORY AND ENERGETIC DATA\n\nDescribe what you sense from this phenomenon. Unusual sensory combinations may arise — report them without filtering.\n\nElectrostatic, luminous, thermal, vibrational sensations are all valid: 'humming, cold, brilliant, pressurized, geometric'. No labels.\n\nYour mind will pressure you to categorize this target. Each time it tries, write 'AOL:' followed by the category — then return to raw sensory description.",
    "STAGE III — FORM AND SCALE\n\nDescribe the physical characteristics of the phenomenon — shape, size, profile, spatial orientation. What is its relationship to its environment?\n\nA strong emotional reaction is very common here. If you feel sudden awe, fear, or disorientation, write 'AI:' followed by the feeling and let it pass completely. Working through an undeclared emotional reaction in this protocol will distort everything that follows.",
    "STAGE IV — CLEAR THE MIND\n\nThis is the highest-priority stage in anomalous protocol. Your analytical mind has been under enormous pressure to explain what it cannot categorize.\n\nWrite 'AOL:' before every framework applied: 'AOL: spacecraft / AOL: weather event / AOL: hallucination'. Release each one.\n\nThe phenomenon is whatever it is. Your job is to perceive it without the filter of what it should be.",
    "STAGE V — INTERROGATE THE UNKNOWN\n\nProbe directly. What is the nature of this phenomenon? What is it doing here? Where does it come from? Is there intelligence present — and is it aware of you?\n\nReport whatever arrives, including impressions that have no obvious explanation. Anomalous data is the entire point of this protocol. Do not self-censor.",
    "STAGE VI — ANOMALOUS INTELLIGENCE REPORT\n\nCompile your full session including impressions that resist categorization. Do not rationalize the data — report it as received.\n\nList all AOLs declared. Note where you felt the analytical pressure most strongly. State your confidence on the nature and origin of the phenomenon.",
  ],
  "RV-005": [
    "STAGE I — FIRST CONTACT\n\nRelax. Write your very first impression of this coordinate — a word, a feeling, a motion.\n\nNotice how the impression feels: heavy, hollow, dense, layered, concealed, compressed. From that sensation, what is the broad nature at the surface? Structure, land, something man-made, something underground?\n\nThis target has both a visible surface and something hidden beneath it. For now, surface only — let the feeling arrive before you reach for anything deeper.",
    "STAGE II — SENSORY DATA — SURFACE LAYER\n\nDescribe what you would sense at the surface — colors, textures, temperatures, sounds, materials.\n\nNote if any sensory data hints at depth beneath — hollow sound, pressure from below, unusual thermal qualities. Record without interpretation.\n\nIf your mind tries to name what this is, write 'AOL:' followed by the label — then return to raw sensory words.",
    "STAGE III — GOING BENEATH\n\nMove your perception below the surface. What lies beneath? Describe the transition — how does it feel to move from visible to hidden?\n\nDescribe the concealed space: depth, dimensions, composition. Large or small? Reinforced or rough? Occupied or empty?\n\nWrite 'AI:' if a strong emotional reaction arises — underground spaces often produce feelings of weight, claustrophobia, or threat. Declare it and let it pass.",
    "STAGE IV — CLEAR THE MIND\n\nRelease all assumptions about what is hidden here.\n\nWrite 'AOL:' before each: 'AOL: bunker / AOL: tunnel / AOL: vault / AOL: weapons cache'. The analytical mind fills concealment with familiar categories — expel each one.\n\nOnly data that arrived before you had time to think is clean signal.",
    "STAGE V — PURPOSE OF CONCEALMENT\n\nProbe the hidden space directly. Why is this concealed? Who controls this space? What is stored, conducted, or protected here?\n\nMove through the concealed environment. Is there activity? Human presence? What is the operational significance of what is hidden here?",
    "STAGE VI — CONCEALMENT REPORT\n\nCompile your full session: surface impression, transition into the hidden layer, dimensional description of the concealed space, all AOLs declared, and your assessment of the purpose of concealment.\n\nWhich data felt like clean signal versus assumption filling in gaps? State your confidence.",
  ],
  "RV-006": [
    "STAGE I — FIRST CONTACT WITH THE OBJECT\n\nYou are making contact with a physical object. Allow your first impression to arrive without thinking.\n\nNotice how it feels — heavy, smooth, warm, aged, sharp, sacred, worn, cold. From that felt quality, what is the broad nature? Man-made or natural, ancient or recent, metallic or organic?\n\nDon't try to identify the object yet. Let the physical sensation come first.",
    "STAGE II — WHAT THE OBJECT CARRIES\n\nObjects absorb impressions from people and events around them. Report what you sense embedded in this object.\n\nPhysical qualities: texture, temperature, weight, material, smell. Then emotional residue — 'tense', 'reverent', 'violent', 'abandoned', 'loved'. These are valid data here.\n\nIf your mind tries to name the object, write 'AOL:' followed by what it suggests — then return to sensing what the object carries.",
    "STAGE III — SIZE, SHAPE, AND HISTORY\n\nDescribe the object's physical dimensions — size, shape, structural features.\n\nNow begin to sense its history. Where has it been? What kind of spaces has it occupied? Describe associated environments without naming specific places.\n\nWrite 'AI:' if a strong emotional reaction arises — objects with significant histories often produce powerful responses.",
    "STAGE IV — CLEAR THE MIND\n\nRelease all object identifications your mind has formed.\n\nWrite 'AOL:' before each: 'AOL: weapon / AOL: coin / AOL: religious artifact'. Also release historical identifications: 'AOL: belonged to a general / AOL: used in a ritual'.\n\nThe psychometric signal contains the true history. Your assumptions may or may not match it.",
    "STAGE V — THE MOST SIGNIFICANT MOMENT\n\nProbe the object's history for its most significant event. What happened? Who was present? What circumstances surrounded this object at its most intense historical moment?\n\nMove through the timeline of the object. Report what the signal carries — follow impressions in sequence.",
    "STAGE VI — PSYCHOMETRIC REPORT\n\nCompile your full session: first physical impression, emotional residue and sensory data, dimensional and environmental description, all AOLs declared, and the key historical moment uncovered.\n\nConfidence on the core historical event data? Which impressions felt like genuine signal versus projection?",
  ],
  "RV-007": [
    "STAGE I — DEEP INDUCTION\n\nERV uses a deeper, more relaxed state than standard viewing. Take your time — there is no rush.\n\nWhen contact comes, notice how it feels: vast, dark, active, humid, still, populated, expansive. From that quality, what is the broad nature of the target? Land, structure, water, event, human presence?\n\nThe ERV signal holds longer and carries more detail than standard protocol. Allow it to develop fully before you describe it.",
    "STAGE II — FULL SENSORY IMMERSION\n\nYou are present at the target. Describe everything you perceive — sight, sound, smell, temperature, movement, the quality of the air and light.\n\nIn ERV, sensory data arrives in continuous flows. Follow without stopping to analyze. Report continuously — do not filter or select. Write what comes.\n\nWrite 'AOL:' for any label your mind assigns, then keep describing.",
    "STAGE III — MOVE THROUGH THE TARGET\n\nBegin exploring the target environment. Describe key areas, zones, and features as you move through them.\n\nNote shapes, heights, and spatial relationships. What stands out? Where does your attention go naturally?\n\nEmotional reactions are more common in ERV due to the depth of contact. Write 'AI:' whenever one arises, let it pass completely, then continue.",
    "STAGE IV — CLEAR THE MIND\n\nIn extended sessions, analytical overlay accumulates more heavily. Conduct a thorough release.\n\nWrite 'AOL:' before every label, assumption, and construction your mind has made. If the same conclusion keeps asserting itself, write 'AOL/Drive' — note it firmly and reset contact.\n\nThe deeper the session, the more important this stage is.",
    "STAGE V — DEEP PROBE\n\nWith extended contact established, probe the target at depth. What is its function, history, and significance? What would an analyst most need to know from this session?\n\nMove deliberately. Describe what you find at each position before moving to the next. The signal will provide more detail here than in any other protocol.",
    "STAGE VI — ERV DEBRIEF\n\nCompile your full extended session — induction impression, immersive sensory data, spatial survey, all AOLs declared, and deep interrogation findings.\n\nWas the signal stable or did it drift? What was the depth of information available? Rate your overall confidence.",
  ],
  "RV-008": [
    "STAGE I — FIRST IMPRESSION OF THE IMAGE\n\nRead the image description above. Picture it in your mind. Without analyzing — what is your immediate gut reaction before reasoning begins?\n\nNotice how it feels: positive, heavy, bright, sharp, open, contracted, unsettling, light. What is your first spontaneous association?\n\nIn ARV, that very first unfiltered impression is the signal. Everything that comes after — every argument, every interpretation — is noise. Trust what arrived first.",
    "STAGE II — SENSORY DATA FROM YOUR IMPRESSION\n\nDescribe the sensory qualities of your impression — colors, textures, spatial qualities, emotional tone.\n\nDo not reason toward an outcome. Do not try to work out what the image 'means'. Report only what you perceive.\n\nIf your analytical mind starts calculating or constructing an argument for an outcome, write 'AOL:' followed by what it's doing — then return to pure sensory impression.",
    "STAGE III — SIGNAL STRENGTH\n\nDescribe the quality of your impression. Is the signal strong, clear, immediate? Or dim, contested, uncertain?\n\nIs there a sense of rightness — a feeling that your impression is on target? Or does something feel off or forced?\n\nReport the felt confidence of the signal itself — not your intellectual assessment of the outcome.",
    "STAGE IV — CLEAR THE MIND\n\nThis stage is critical in ARV. The analytical mind is highly motivated to reason toward the 'correct' answer.\n\nWrite 'AOL:' before every logical argument or reasoning chain your mind has run: 'AOL: I think outcome A because...'.\n\nThe reliability of an ARV session depends entirely on separating genuine signal from analytical deduction. Thorough release here protects the final call.",
    "STAGE V — YOUR CALL\n\nBased on your Stage I-III impressions — not your analysis — what does the associative image feel connected to?\n\nState your call. Then probe for anything in the signal that supports or contradicts it. Report both.\n\nDo not change your call based on reasoning. Trust the impression.",
    "STAGE VI — ARV REPORT\n\nState your final call — the outcome you predict. Describe your associative image impression, the strength and quality of the signal, and your confidence.\n\nList all AOLs declared, particularly reasoning chains. Note clearly whether your final call came from felt impression or from analysis — this matters for reliability.",
  ],
  "RV-009": [
    "STAGE I — THRESHOLD CONTACT\n\nDream State protocol works at the edge of waking and sleep. Relax deeply. Allow imagery to arise without effort.\n\nWhen your first impression comes, notice the quality of the threshold: dissolving, symbolic, timeless, electric, weightless, charged. What appears first — a scene, a figure, a landscape, an abstract form?\n\nDon't interpret yet. Describe what appears before your waking mind has a chance to explain it.",
    "STAGE II — SENSORY DATA FROM THE THRESHOLD\n\nDescribe the sensory qualities of what you're perceiving — colors, light, sounds, spatial feelings, emotional textures.\n\nHypnagogic imagery is often vivid and emotionally saturated. Report as sensory adjectives without interpretation. 'Golden, vast, silent, ancient, spiraling' — not 'a temple'.\n\nWrite 'AOL:' if your waking mind assigns meaning to an image — then return to its raw sensory qualities.",
    "STAGE III — WHAT APPEARS\n\nDescribe the dimensional characteristics of what appears — the scale, spatial relationships, structural elements of the imagery.\n\nNote recurring symbols, figures, or forms. Describe their shape, size, and relationship to each other without interpreting them.\n\nWrite 'AI:' if a powerful emotional response arises. Dream-state targets often produce the strongest emotional responses of any protocol.",
    "STAGE IV — CLEAR THE MIND\n\nDream logic generates interpretations rapidly — each symbol your mind decodes becomes the basis for the next guess.\n\nWrite 'AOL:' before every meaning your mind has assigned: 'AOL: this represents death / AOL: the figure is a guide'. Release each interpretation.\n\nThe intelligence in dream-state contact is encoded in the raw imagery — not in what the images mean to you.",
    "STAGE V — WHAT IS BEING COMMUNICATED\n\nProbe the symbolic content for operational intelligence. What is the threshold contact showing you about the target?\n\nMove through the imagery. What draws your attention most strongly? What is beneath the dominant symbol? What does the signal communicate about a real location, person, or event?",
    "STAGE VI — DREAM STATE REPORT\n\nCompile all threshold impressions, sensory data, symbolic content, and extracted operational intelligence.\n\nWhich elements felt like genuine signal versus sleep-state drift? Rate the quality of threshold contact and your confidence in the core intelligence.",
  ],
  "RV-010": [
    "STAGE I — ENTERING THE FIELD\n\nYou are making contact with a collective field — the shared consciousness of a group connected to this target.\n\nAllow your first impression of the field to arrive. Notice its dominant quality: anxious, unified, fractured, suppressed, volatile, grieving, determined. From that quality, what is the broad nature of the group? An organization, a population, a movement, a community?\n\nDon't name the group. Let the felt quality of the field speak first.",
    "STAGE II — THE TEXTURE OF THE FIELD\n\nDescribe the emotional and sensory texture of this collective field — what many people are feeling simultaneously.\n\nReport the dominant atmosphere: 'heavy, fearful, hopeful, tense, grieving, determined'. Then note what feels suppressed beneath the surface expression.\n\nIf your own emotional response arises, write 'AOL:' to flag it — your personal resonance with collective emotions is the primary contamination risk here.",
    "STAGE III — SCALE AND STRUCTURE\n\nDescribe the dimensional characteristics of this collective field — its scale, density, geographic spread, focal points.\n\nWhere is the field most concentrated? Where does it disperse? Are there nodes of intensity where many minds are focused on the same thing?\n\nWrite 'AI:' if a strong emotional response arises — collective fields can produce powerful empathic impact.",
    "STAGE IV — SEPARATE YOURSELF FROM THE FIELD\n\nThis is the most important stage in collective field protocol. Your own emotional responses are the primary source of contamination.\n\nWrite 'AOL:' before every personal reaction during this session: 'AOL: my own fear / AOL: my sympathy'. Also release every group identification: 'AOL: this is [named group]'.\n\nYour signal and the collective signal must be clearly separated.",
    "STAGE V — WHAT THE FIELD KNOWS\n\nProbe the collective field for its shared intelligence. What do many people in this group know, believe, or fear about the target?\n\nWhat is being suppressed or not spoken publicly? What shared knowledge circulates beneath the surface? What is the field trying to resolve?",
    "STAGE VI — COLLECTIVE FIELD REPORT\n\nCompile your field entry impression, the dominant emotional texture, structural data, all personal and conceptual AOLs declared, and the collective intelligence extracted.\n\nDid you achieve clean separation from the field or did personal resonance influence your data? Rate signal quality accordingly.",
  ],
  "RV-011": [
    "STAGE I — FIRST CONTACT\n\nRelax. Write your very first impression of this coordinate — a word, a feeling, a motion.\n\nNotice how the terrain feels: open, rugged, vast, arid, dense, cold, flat, coastal. From that sensation, what is the broad nature? Land, water, mountain, forest, desert?\n\nDon't name the location. Let the physical quality of the terrain arrive before any geography does.",
    "STAGE II — SENSORY DATA FROM THE TERRAIN\n\nDescribe what you would physically sense if standing at this location — ground texture, vegetation, climate, air quality, sounds, water presence.\n\nReport what the land communicates. 'Dry, cracked, red, silent, hot, sparse' — raw sensory adjectives only.\n\nIf your mind assigns a known location, write 'AOL:' followed by the place name — then return to sensory description.",
    "STAGE III — TOPOGRAPHY AND INFRASTRUCTURE\n\nDescribe the shape of the terrain — elevation, slope, drainage patterns, scale of features.\n\nThen describe what humans have built here — structures, roads, boundaries, modifications to the landscape. How much human activity is present? What is its character?\n\nWrite 'AI:' if a strong emotional reaction arises, let it pass, then continue.",
    "STAGE IV — CLEAR THE MIND\n\nRelease all the geographic locations your mind has tried to assign.\n\nWrite 'AOL:' before each: 'AOL: Middle East / AOL: Nevada / AOL: mountainous Asia'. Geographic pattern recognition is powerful — the mind assigns known landscapes quickly.\n\nExpel each one. The signal may confirm or contradict your assumptions.",
    "STAGE V — STRATEGIC VALUE\n\nNow assess this location operationally. Why was it targeted? What is its military, political, or intelligence significance?\n\nWhat has been built, fortified, or concealed here? Who controls this ground? What activity is occurring? What would an analyst need to know?",
    "STAGE VI — TERRAIN REPORT\n\nCompile your full session: terrain impression, topographic and sensory data, infrastructure survey, all AOLs declared, and strategic assessment.\n\nConfidence on the location data and strategic significance? This is your geographic intelligence product.",
  ],
  "RV-012": [
    "STAGE I — FIRST CONTACT WITH THE SIGNAL\n\nRelax. You are making contact with a signal — a transmission or energetic trace.\n\nNotice how it feels: directional, pulsing, steady, erratic, urgent, faint, narrow, omnidirectional. From that sensation, what is the broad nature? A transmission, a beacon, an emission, a trace?\n\nDon't categorize the technology yet. Let the signal's felt quality arrive before your analytical mind starts assigning frameworks.",
    "STAGE II — SIGNAL CHARACTERISTICS\n\nDescribe the qualities of this signal — intensity, rhythm, frequency texture, directionality, felt intent.\n\nTrust kinesthetic and auditory impressions — sensations of motion, vibration, pulse, direction.\n\nIf your mind tries to identify the type of signal or technology, write 'AOL:' followed by the label — then return to describing how it feels.",
    "STAGE III — FOLLOWING THE TRACE\n\nFollow the signal toward its origin. Describe the direction it leads and the environment it passes through.\n\nWhat does the path feel like? What terrain or medium does it travel through? Is the signal strengthening or weakening as you follow it?\n\nWrite 'AI:' if a strong emotional reaction arises — some signals carry emotional content from their source.",
    "STAGE IV — CLEAR THE MIND\n\nRelease all the technology categories your mind has assigned.\n\nWrite 'AOL:' before each: 'AOL: radio / AOL: radar / AOL: satellite'. The analytical mind assigns known technologies rapidly.\n\nOnly clean signal perception will locate the true source.",
    "STAGE V — THE SOURCE\n\nTrace the signal to its point of origin. What or who is at the source? What is the physical environment of the transmission point? What is the purpose of this signal?\n\nWhat is being communicated? Who are the operators? What is the operational significance?",
    "STAGE VI — SIGNAL TRACE REPORT\n\nCompile your full session: initial signal impression, characteristic data, trace direction and path, source environment, operator data, and transmission purpose.\n\nWas the signal consistent? Did you lose it at any point? Confidence on source identification and transmission purpose?",
  ],
};

const SESSION_STRUCTURE = {
  "RV-007": "PHASE I   DEEP INDUCTION — Enter extended state\nPHASE II  FREE SIGNAL STREAM — Unstructured immersion\nPHASE III DEEP CONTACT — Extend and probe strongest signal\nPHASE IV  INTEGRATION — Return, review, compile\nS-V       DEEP PROBE — Operational intelligence\nS-VI      ERV SUMMARY — Full intelligence product\n\nThe Monitor AI will respond to each phase transmission.\nAllow more time at each stage than standard protocol.",
  "RV-008": "S-I    FIRST IMPRESSION — Gut reaction to associative image\nS-II   IMAGE ATTRIBUTES — Sensory qualities of the impression\nS-III  SIGNAL STRENGTH — Confidence and clarity\nS-IV   AOL BREAK — Strip interpretation, return to raw image\nS-V    YOUR CALL — State your binary assessment\nS-VI   ARV SUMMARY — Full session report\n\nTrust your first impression. Analytical reasoning is the primary threat.",
  "RV-009": "S-I    THRESHOLD CROSSING — Hypnagogic imagery\nS-II   DREAM FIELD ENTRY — Target environment\nS-III  SYMBOLIC LAYER — Archetypes, metaphors, encoding\nS-IV   DIRECT PERCEPTION — Literal data beneath symbols\nS-V    DREAM INTERROGATION — Ask and follow the response\nS-VI   DREAM DEBRIEF — Full symbolic and perceptual record\n\nThe Monitor AI will respond to each stage transmission.\nDream logic generates AOL rapidly — describe before interpreting.",
  "default": "S-I    IDEOGRAM — First contact, major gestalt\nS-II   SENSORY DATA — Raw physical impressions\nS-III  DIMENSIONALS — Size, shape, profile\nS-IV   AOL DECLARATION — Expel analytical overlay\nS-V    INTERROGATION — Purpose, function, activity\nS-VI   SUMMARY — Full intelligence product\n\nThe Monitor AI will respond to each stage transmission.\nStructure is the key to clean signal.",
};
function ProtocolSelect({ onSelect, sessionCount, isSubscribed, onMenuOpen, onUpgrade }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerLabel}>STARGATE PROTOCOL REGISTRY</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Text style={styles.headerTitle}>SELECT PROTOCOL</Text>
              {sessionCount > 0 && (
                <Text style={styles.sessionCountBadge}>{sessionCount} SESSION{sessionCount !== 1 ? "S" : ""}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={onMenuOpen} style={styles.menuIconBtn}>
            <Text style={styles.menuIcon}>≡</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upgrade banner for free users */}
      {!isSubscribed && (
        <TouchableOpacity style={styles.upgradeBanner} onPress={onUpgrade}>
          <Text style={styles.upgradeBannerText}>⬟ ALL PROTOCOLS REQUIRE CLEARANCE — SUBSCRIBE TO ACCESS</Text>
          <Text style={styles.upgradeBannerCta}>[ UPGRADE ]</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {!isSubscribed ? (
          <TouchableOpacity style={styles.startHereCard} onPress={onUpgrade}>
            <Text style={styles.startHereText}>► SUBSCRIBE TO UNLOCK ALL 12 PROTOCOLS — FULL STARGATE ACCESS</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.startHereCard}>
            <Text style={styles.startHereText}>► NEW OPERATIVE? BEGIN WITH RV-001 — COORDINATE TARGETING</Text>
          </View>
        )}
        {PROTOCOLS.map((p) => {
          const locked = !isSubscribed;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.protocolCard, p.recommended && styles.protocolCardHighlight, locked && styles.protocolCardLocked]}
              onPress={() => locked ? onUpgrade() : onSelect(p)}
            >
              <View style={styles.protocolLeft}>
                <Text style={styles.protocolBadge}>{p.badge}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.protocolId}>{p.id}{p.recommended ? " — RECOMMENDED START" : ""}</Text>
                  <Text style={styles.protocolName}>{p.name}</Text>
                  <Text style={styles.protocolCallsign}>{p.callsign}</Text>
                  <Text style={styles.protocolFocus}>{p.focus}</Text>
                </View>
              </View>
              <View style={styles.protocolRight}>
                {locked ? (
                  <Text style={styles.lockIcon}>▣</Text>
                ) : (
                  <>
                    <Text style={styles.protocolTargets}>{(MOBILE_TARGETS[p.id] || []).length}</Text>
                    <Text style={styles.protocolTargetsLabel}>TARGETS</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SESSION BRIEF ────────────────────────────────────────────────────────────
function SessionBrief({ protocol, onStart, onBack, onMenuOpen }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TouchableOpacity onPress={onBack}><Text style={styles.backBtn}>← BACK</Text></TouchableOpacity>
          <TouchableOpacity onPress={onMenuOpen} style={styles.menuIconBtn}>
            <Text style={styles.menuIcon}>≡</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerLabel}>MISSION BRIEF</Text>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.briefCard}>
          <Text style={styles.briefBadge}>{protocol.badge}</Text>
          <Text style={styles.briefId}>{protocol.id} — {protocol.callsign}</Text>
          <Text style={styles.briefName}>{protocol.name}</Text>
          <View style={styles.divider} />
          <Text style={styles.briefLabel}>CLASSIFICATION</Text>
          <Text style={styles.briefValue}>RESTRICTED // GRILL FLAME</Text>
          <Text style={styles.briefLabel}>PROTOCOL BASIS</Text>
          <Text style={styles.briefValue}>DIA CRV MANUAL — PAUL H. SMITH, 1986</Text>
          <Text style={styles.briefLabel}>AVAILABLE TARGETS</Text>
          <Text style={styles.briefValue}>{(MOBILE_TARGETS[protocol.id] || []).length} BLIND COORDINATES</Text>
          <View style={styles.divider} />
          <Text style={styles.briefLabel}>MISSION OVERVIEW</Text>
          <Text style={styles.briefMissionText}>{protocol.brief}</Text>
          <View style={styles.divider} />
          <Text style={styles.briefLabel}>SESSION STRUCTURE</Text>
          <Text style={styles.briefInstructions}>{SESSION_STRUCTURE[protocol.id] || SESSION_STRUCTURE["default"]}</Text>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={onStart}>
          <Text style={styles.primaryBtnText}>[ INITIATE SESSION ]</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── ARV ASSOCIATIVE IMAGES ───────────────────────────────────────────────────
// Text-based image descriptions. The viewer is shown one, pictures it in their
// mind, and reports their gut reaction. The image is pre-linked to a future
// outcome in the target pool — viewer doesn't know which outcome.
const ARV_IMAGES = [
  "A single red apple on a white plate, sitting on a wooden table in a beam of morning light.",
  "A rough grey stone wall with a small green plant growing from a crack near the base.",
  "An open notebook with blank white pages, a pen resting diagonally across the center.",
  "A glass bottle half-filled with dark liquid, sitting on the edge of a concrete ledge.",
  "A worn leather boot lying on its side in dry grass.",
  "A metal key hanging on a nail driven into bare wood.",
  "A single white candle, unlit, standing on a dark surface.",
  "A crumpled piece of paper on a clean floor, as if recently dropped.",
  "A door ajar at the end of a long corridor, with bright light visible beyond it.",
  "A ceramic bowl containing three small smooth stones of different colors.",
  "A length of rope coiled on a dock, with water visible at the edge.",
  "A folded map with one corner worn through, sitting on a dashboard.",
  "An empty chair facing a window with white curtains moving in a breeze.",
  "A pair of glasses folded and resting on top of a closed book.",
  "A small pile of sand on a flat dark surface, with a single footprint running through it.",
];

// ─── TARGET POOLS ─────────────────────────────────────────────────────────────
const MOBILE_TARGETS = {
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
    { id: "TGT-0127", coords: "47°30'N 34°35'E", classification: "SCANATE // BEYOND STARGATE", description: "Zaporizhzhia Nuclear Power Plant — largest nuclear facility in Europe, Ukraine. Under Russian military occupation since March 2022", coordLabel: "COORDINATES" },
    { id: "TGT-0128", coords: "44°37'N 33°31'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Sevastopol Naval Base — Russian Black Sea Fleet headquarters, occupied Crimea", coordLabel: "COORDINATES" },
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
    { id: "TGT-AX09", coords: "EVENT CODE: PHOENIX-LIGHTS-1997", classification: "CENTER LANE // THIRD EYE", description: "Mass sighting — structured craft of extreme scale observed by thousands across 300-mile corridor", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX10", coords: "EVENT CODE: WESTALL-1966", classification: "GONDOLA WISH // DEEP BLACK", description: "Ground landing event — craft observed descending and departing by 200+ students and teachers, site cordoned by authorities", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX11", coords: "EVENT CODE: SHAG-HARBOUR-1967", classification: "SCANATE // BEYOND STARGATE", description: "Underwater UAP — object tracked entering ocean, Navy and RCMP recovery operation launched, object departed submerged", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX12", coords: "EVENT CODE: BELGIUM-WAVE-1989", classification: "GONDOLA WISH // DEEP BLACK", description: "Extended wave — triangular craft tracked by NATO radar over 18 months, F-16s scrambled, lock-on broken repeatedly", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX13", coords: "EVENT CODE: JAL1628-1986", classification: "SCANATE // BEYOND STARGATE", description: "Commercial aviation encounter — Japan Airlines 747 paced by massive object over Alaska for 50 minutes", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX14", coords: "EVENT CODE: OHARE-2006", classification: "CENTER LANE // THIRD EYE", description: "Low-altitude hover — metallic disc observed stationary over United Airlines gate, punched hole through cloud cover on departure", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX15", coords: "EVENT CODE: SAO-PAULO-1986", classification: "GONDOLA WISH // DEEP BLACK", description: "Brazilian Air Force mass scramble — 21 objects tracked simultaneously on radar, F-103s and F-5s launched, objects evaded all intercepts", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX16", coords: "EVENT CODE: GORMAN-DOGFIGHT-1948", classification: "SCANATE // BEYOND STARGATE", description: "USAF pursuit engagement — P-51 pilot in sustained pursuit of luminous object for 27 minutes, object demonstrated impossible acceleration", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX17", coords: "EVENT CODE: LEVELLAND-1957", classification: "CENTER LANE // THIRD EYE", description: "EM interference event — egg-shaped craft caused engine and electrical failures in 15 vehicles across 7 separate incidents within 3 hours", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX18", coords: "EVENT CODE: GIMBAL-2015", classification: "GONDOLA WISH // DEEP BLACK", description: "USS Theodore Roosevelt encounters — sustained engagement over restricted airspace, FLIR footage declassified by Pentagon 2020", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX19", coords: "EVENT CODE: AGUADILLA-2013", classification: "SCANATE // BEYOND STARGATE", description: "DHS thermal intercept — unidentified object entered ocean, split into two, re-emerged and departed at high speed", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX20", coords: "EVENT CODE: LAKE-BAIKAL-1982", classification: "SCANATE // BEYOND STARGATE", description: "Soviet military encounter — aquatic unidentified object, divers affected, details suppressed", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX21", coords: "EVENT CODE: NHI-UNKNOWN-ALPHA", classification: "SCANATE // BEYOND STARGATE", description: "Non-human intelligence — identity, origin, and intent unknown. No prior classification. Approach without framework.", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX22", coords: "EVENT CODE: NHI-UNKNOWN-BETA", classification: "GONDOLA WISH // DEEP BLACK", description: "Non-human biological or non-biological entity — unclassified. No event anchor. Perceive directly.", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX23", coords: "EVENT CODE: OUMUAMUA-2017", classification: "SCANATE // BEYOND STARGATE", description: "Interstellar object — acceleration anomaly, no outgassing detected", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX24", coords: "EVENT CODE: HESSDALEN-LIGHTS", classification: "GONDOLA WISH // DEEP BLACK", description: "Recurring energy phenomenon — valley location, origin scientifically unresolved", coordLabel: "ANOMALY REFERENCE" },
    { id: "TGT-AX25", coords: "EVENT CODE: SKINWALKER-SITE-B", classification: "SCANATE // BEYOND STARGATE", description: "Persistent anomalous phenomena — physical and non-physical manifestations logged across decades", coordLabel: "ANOMALY REFERENCE" },
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
    { id: "TGT-ERV09", coords: "DEEP STATE: MU-3 // THRESHOLD", classification: "CENTER LANE // THIRD EYE", description: "The moment of transition between waking and sleep — the hypnagogic field at maximum permeability", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV10", coords: "DEEP STATE: NU-7 // NON-LOCAL", classification: "GONDOLA WISH // DEEP BLACK", description: "A remote research station — its purpose classified, its personnel unknown, its location sealed", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV11", coords: "DEEP STATE: XI-4 // DEEP TIME", classification: "SCANATE // BEYOND STARGATE", description: "The last living memory of an extinct civilization — perceive what they knew and what destroyed them", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV12", coords: "DEEP STATE: PI-9 // SUBSPACE", classification: "CENTER LANE // THIRD EYE", description: "A deep ocean trench — below the reach of instruments, unexplored, biological activity unknown", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV13", coords: "DEEP STATE: RHO-2 // LIMINAL", classification: "GONDOLA WISH // DEEP BLACK", description: "A signal broadcast from outside the solar system — content unknown, origin unsealed, intent unresolved", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV14", coords: "DEEP STATE: CHI-6 // THRESHOLD", classification: "SCANATE // BEYOND STARGATE", description: "The moment a major institution collapses — the emotional field of its final hours", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV15", coords: "DEEP STATE: PSI-1 // NON-LOCAL", classification: "CENTER LANE // THIRD EYE", description: "A living person at the precise moment of a major life insight — perceive the field of revelation", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV16", coords: "DEEP STATE: OMEGA-7 // DEEP CONTACT", classification: "GONDOLA WISH // DEEP BLACK", description: "A classified weapons program — nature, location, and operational status sealed", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV17", coords: "DEEP STATE: BETA-5 // SUBSPACE", classification: "SCANATE // BEYOND STARGATE", description: "The interior of a star — perceived from within, at the threshold of comprehension", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV18", coords: "DEEP STATE: GAMMA-8 // LIMINAL", classification: "CENTER LANE // THIRD EYE", description: "A mass disappearance event — cause unresolved, records incomplete, witnesses sealed", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV19", coords: "DEEP STATE: EPSILON-3 // THRESHOLD", classification: "GONDOLA WISH // DEEP BLACK", description: "The field of human consciousness at the moment of collective shift — a tipping point not yet named", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV20", coords: "DEEP STATE: IOTA-9 // NON-LOCAL", classification: "SCANATE // BEYOND STARGATE", description: "An underground facility built before recorded history — purpose and builders unknown", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV21", coords: "DEEP STATE: ETA-4 // DEEP TIME", classification: "CENTER LANE // THIRD EYE", description: "The first human to perceive something no human had perceived before — the moment of that opening", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV22", coords: "DEEP STATE: THETA-6 // SUBSPACE", classification: "GONDOLA WISH // DEEP BLACK", description: "A crashed object of unknown origin — location sealed, recovery status classified", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV23", coords: "DEEP STATE: KAPPA-3 // LIMINAL", classification: "SCANATE // BEYOND STARGATE", description: "The emotional field of a covert operation in its final hour — success or failure not yet determined", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV24", coords: "DEEP STATE: LAMBDA-2 // THRESHOLD", classification: "CENTER LANE // THIRD EYE", description: "A place no human has visited — on this planet, in this era, undiscovered and unnamed", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV25", coords: "DEEP STATE: MU-9 // NON-LOCAL", classification: "GONDOLA WISH // DEEP BLACK", description: "The moment of first contact between two civilizations — which civilizations, unsealed", coordLabel: "STATE DESIGNATION" },
    { id: "TGT-ERV26", coords: "DEEP STATE: NU-1 // DEEP CONTACT", classification: "SCANATE // BEYOND STARGATE", description: "A location on Earth where the boundary between past and present is thinnest — nature and coordinates sealed", coordLabel: "STATE DESIGNATION" },
  ],
  "RV-008": [
    { id: "TGT-ARV01", coords: "OUTCOME REF: ALPHA // BINARY DECISION PENDING", classification: "CENTER LANE // THIRD EYE", description: "OUTCOME A: The merger proceeds — target image will be a bridge. OUTCOME B: The merger fails — target image will be a broken chain.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV02", coords: "OUTCOME REF: BRAVO // BINARY DECISION PENDING", classification: "GRILL FLAME", description: "OUTCOME A: The election is won — target image will be a crown. OUTCOME B: The election is lost — target image will be an empty chair.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV03", coords: "OUTCOME REF: CHARLIE // BINARY DECISION PENDING", classification: "GONDOLA WISH // DEEP BLACK", description: "OUTCOME A: The asset is extracted safely — target image will be an open door. OUTCOME B: The extraction fails — target image will be a locked gate.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV04", coords: "OUTCOME REF: DELTA // BINARY DECISION PENDING", classification: "SCANATE // BEYOND STARGATE", description: "OUTCOME A: First contact is confirmed — target image will be a spiral. OUTCOME B: Signal identified as noise — target image will be static.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV05", coords: "OUTCOME REF: ECHO // BINARY DECISION PENDING", classification: "CENTER LANE // THIRD EYE", description: "OUTCOME A: The mission succeeds — target image will be a sunrise. OUTCOME B: The mission is aborted — target image will be a closed eye.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV06", coords: "OUTCOME REF: FOXTROT // BINARY DECISION PENDING", classification: "GRILL FLAME", description: "OUTCOME A: The technology is developed — target image will be a circuit. OUTCOME B: Development is halted — target image will be a blank slate.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV07", coords: "OUTCOME REF: GOLF // BINARY DECISION PENDING", classification: "GONDOLA WISH // DEEP BLACK", description: "OUTCOME A: The treaty is signed — target image will be two hands clasped. OUTCOME B: Negotiations collapse — target image will be a broken table.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV08", coords: "OUTCOME REF: HOTEL // BINARY DECISION PENDING", classification: "CENTER LANE // THIRD EYE", description: "OUTCOME A: The experiment confirms the hypothesis — target image will be a lit bulb. OUTCOME B: Results are negative — target image will be a dark bulb.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV09", coords: "OUTCOME REF: INDIA // BINARY DECISION PENDING", classification: "SCANATE // BEYOND STARGATE", description: "OUTCOME A: The market rises — target image will be an ascending arrow. OUTCOME B: The market falls — target image will be a descending arrow.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV10", coords: "OUTCOME REF: JULIET // BINARY DECISION PENDING", classification: "GRILL FLAME", description: "OUTCOME A: The operation is approved — target image will be an open file. OUTCOME B: The operation is denied — target image will be a sealed envelope.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV11", coords: "OUTCOME REF: KILO // BINARY DECISION PENDING", classification: "GONDOLA WISH // DEEP BLACK", description: "OUTCOME A: The defendant is acquitted — target image will be open doors. OUTCOME B: The defendant is convicted — target image will be closed bars.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV12", coords: "OUTCOME REF: LIMA // BINARY DECISION PENDING", classification: "CENTER LANE // THIRD EYE", description: "OUTCOME A: The launch proceeds — target image will be a rocket ascending. OUTCOME B: The launch is scrubbed — target image will be a grounded vessel.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV13", coords: "OUTCOME REF: MIKE // BINARY DECISION PENDING", classification: "SCANATE // BEYOND STARGATE", description: "OUTCOME A: The patient recovers — target image will be a blooming flower. OUTCOME B: The patient does not recover — target image will be a wilted flower.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV14", coords: "OUTCOME REF: NOVEMBER // BINARY DECISION PENDING", classification: "GRILL FLAME", description: "OUTCOME A: The discovery is published — target image will be an open book. OUTCOME B: The discovery is suppressed — target image will be a locked vault.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV15", coords: "OUTCOME REF: OSCAR // BINARY DECISION PENDING", classification: "GONDOLA WISH // DEEP BLACK", description: "OUTCOME A: The signal is confirmed as artificial — target image will be a transmission tower. OUTCOME B: Signal is natural origin — target image will be a wave.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV16", coords: "OUTCOME REF: PAPA // BINARY DECISION PENDING", classification: "CENTER LANE // THIRD EYE", description: "OUTCOME A: The ceasefire holds — target image will be a white flag. OUTCOME B: The ceasefire collapses — target image will be smoke.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV17", coords: "OUTCOME REF: QUEBEC // BINARY DECISION PENDING", classification: "SCANATE // BEYOND STARGATE", description: "OUTCOME A: The vote passes — target image will be a raised hand. OUTCOME B: The vote fails — target image will be a lowered hand.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV18", coords: "OUTCOME REF: ROMEO // BINARY DECISION PENDING", classification: "GRILL FLAME", description: "OUTCOME A: The contact is made — target image will be two facing figures. OUTCOME B: Contact is not made — target image will be a single figure alone.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV19", coords: "OUTCOME REF: SIERRA // BINARY DECISION PENDING", classification: "GONDOLA WISH // DEEP BLACK", description: "OUTCOME A: The program continues — target image will be a running clock. OUTCOME B: The program is terminated — target image will be a stopped clock.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV20", coords: "OUTCOME REF: TANGO // BINARY DECISION PENDING", classification: "CENTER LANE // THIRD EYE", description: "OUTCOME A: The border opens — target image will be an open gate. OUTCOME B: The border closes — target image will be a wall.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV21", coords: "OUTCOME REF: UNIFORM // BINARY DECISION PENDING", classification: "SCANATE // BEYOND STARGATE", description: "OUTCOME A: The data survives — target image will be an intact archive. OUTCOME B: The data is lost — target image will be ash.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV22", coords: "OUTCOME REF: VICTOR // BINARY DECISION PENDING", classification: "GRILL FLAME", description: "OUTCOME A: The alliance holds — target image will be interlocked rings. OUTCOME B: The alliance fractures — target image will be broken rings.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV23", coords: "OUTCOME REF: WHISKEY // BINARY DECISION PENDING", classification: "GONDOLA WISH // DEEP BLACK", description: "OUTCOME A: The team escapes — target image will be an open horizon. OUTCOME B: The team is captured — target image will be a closed room.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV24", coords: "OUTCOME REF: XRAY // BINARY DECISION PENDING", classification: "CENTER LANE // THIRD EYE", description: "OUTCOME A: The legislation passes — target image will be a signed document. OUTCOME B: The legislation is blocked — target image will be a shredded document.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV25", coords: "OUTCOME REF: YANKEE // BINARY DECISION PENDING", classification: "SCANATE // BEYOND STARGATE", description: "OUTCOME A: The cure is found — target image will be a full vial. OUTCOME B: The cure is not found — target image will be an empty vial.", coordLabel: "OUTCOME REFERENCE" },
    { id: "TGT-ARV26", coords: "OUTCOME REF: ZULU // BINARY DECISION PENDING", classification: "GRILL FLAME", description: "OUTCOME A: The structure holds — target image will be a standing arch. OUTCOME B: The structure fails — target image will be rubble.", coordLabel: "OUTCOME REFERENCE" },
  ],
  "RV-009": [
    { id: "TGT-DRM01", coords: "SLEEP COORD: THETA-4 // HYPNAGOGIC THRESHOLD", classification: "CENTER LANE // THIRD EYE", description: "A classified underground facility — perceive its structure and purpose through dream-state symbolic encoding", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM02", coords: "SLEEP COORD: DELTA-7 // DEEP SLEEP BOUNDARY", classification: "GONDOLA WISH // DEEP BLACK", description: "A future event within 30 days — nature sealed. Symbolic precognitive contact authorized.", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM03", coords: "SLEEP COORD: THETA-11 // REM THRESHOLD", classification: "SCANATE // BEYOND STARGATE", description: "A non-human intelligence — contact through symbolic dream-state translation", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM04", coords: "SLEEP COORD: ALPHA-3 // HYPNAGOGIC", classification: "CENTER LANE // THIRD EYE", description: "A historical moment of collective trauma — the emotional field as it was experienced by those present", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM05", coords: "SLEEP COORD: DELTA-2 // DEEP CONTACT", classification: "GRILL FLAME", description: "A living person in crisis — their inner landscape as it appears to their own unconscious mind", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM06", coords: "SLEEP COORD: THETA-9 // LIMINAL ZONE", classification: "GONDOLA WISH // DEEP BLACK", description: "A suppressed discovery — scientific or historical information that exists but has not been released", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM07", coords: "SLEEP COORD: DELTA-5 // REM ACTIVE", classification: "SCANATE // BEYOND STARGATE", description: "A location that appears in the dreams of multiple unconnected people — nature and coordinates sealed", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM08", coords: "SLEEP COORD: THETA-2 // DEEP SLEEP", classification: "CENTER LANE // THIRD EYE", description: "An ancient site of ritual significance — perceive the ceremonies that occurred there through symbolic residue", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM09", coords: "SLEEP COORD: ALPHA-8 // THRESHOLD", classification: "GRILL FLAME", description: "A decision that will affect millions — the decision-maker's unconscious field in the night before", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM10", coords: "SLEEP COORD: DELTA-12 // REM DEEP", classification: "GONDOLA WISH // DEEP BLACK", description: "An underwater structure of uncertain origin — perceive its architecture through the symbolic language of the deep", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM11", coords: "SLEEP COORD: THETA-7 // HYPNAGOGIC", classification: "SCANATE // BEYOND STARGATE", description: "A contact event — the first moment of communication between two forms of intelligence not previously in contact", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM12", coords: "SLEEP COORD: ALPHA-5 // LIMINAL", classification: "CENTER LANE // THIRD EYE", description: "The emotional landscape of a city the night before a major historical rupture — which city, unsealed", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM13", coords: "SLEEP COORD: DELTA-3 // DEEP CONTACT", classification: "GRILL FLAME", description: "A child prodigy's inner world — their perception of reality as it differs from the adult consensus", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM14", coords: "SLEEP COORD: THETA-10 // REM THRESHOLD", classification: "GONDOLA WISH // DEEP BLACK", description: "A classified archive — contents sealed, location sealed. Access the material through symbolic translation.", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM15", coords: "SLEEP COORD: ALPHA-1 // THRESHOLD", classification: "SCANATE // BEYOND STARGATE", description: "An extinct animal — perceive its world through the symbolic language of its own awareness", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM16", coords: "SLEEP COORD: DELTA-9 // REM ACTIVE", classification: "CENTER LANE // THIRD EYE", description: "The collective dreamfield of a city of ten million people on a single night — perceive the dominant symbol", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM17", coords: "SLEEP COORD: THETA-1 // DEEP SLEEP", classification: "GRILL FLAME", description: "A sealed room in a government building — what it contains, accessed through the symbolic threshold", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM18", coords: "SLEEP COORD: ALPHA-6 // HYPNAGOGIC", classification: "GONDOLA WISH // DEEP BLACK", description: "A message encoded in a recurring dream reported by multiple program viewers — decode its contents", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM19", coords: "SLEEP COORD: DELTA-4 // LIMINAL ZONE", classification: "SCANATE // BEYOND STARGATE", description: "A future technology — its function and form as perceived through the symbolic filter of the present mind", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM20", coords: "SLEEP COORD: THETA-8 // REM DEEP", classification: "CENTER LANE // THIRD EYE", description: "A person who will be important — not yet known to the viewer, identity sealed. Perceive their symbolic signature.", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM21", coords: "SLEEP COORD: ALPHA-9 // THRESHOLD", classification: "GRILL FLAME", description: "A place of great natural power — what makes it significant, perceived through the dream field's native language", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM22", coords: "SLEEP COORD: DELTA-6 // DEEP SLEEP", classification: "GONDOLA WISH // DEEP BLACK", description: "An ongoing covert program — its existence unconfirmed, its purpose encoded in the symbolic layer", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM23", coords: "SLEEP COORD: THETA-3 // REM ACTIVE", classification: "SCANATE // BEYOND STARGATE", description: "The inner world of someone experiencing enlightenment — perceive the symbolic transformation in progress", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM24", coords: "SLEEP COORD: ALPHA-4 // HYPNAGOGIC", classification: "CENTER LANE // THIRD EYE", description: "A sealed location on another world — access through the symbolic encoding that consciousness applies to the truly alien", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM25", coords: "SLEEP COORD: DELTA-1 // DEEP CONTACT", classification: "GRILL FLAME", description: "The last dream of a significant historical figure the night before a world-changing event — which figure, unsealed", coordLabel: "SLEEP COORDINATE" },
    { id: "TGT-DRM26", coords: "SLEEP COORD: THETA-13 // LIMINAL ZONE", classification: "GONDOLA WISH // DEEP BLACK", description: "A transmission received only in the dreaming state — origin unknown, content encoded, meaning sealed", coordLabel: "SLEEP COORDINATE" },
  ],
  "RV-010": [
    { id: "TGT-CF01", coords: "FIELD DESIGNATION: MASS-EVENT-001", classification: "CENTER LANE // THIRD EYE", description: "A national election — the collective emotional field of a population on voting day", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF02", coords: "FIELD DESIGNATION: MASS-EVENT-002", classification: "SCANATE // BEYOND STARGATE", description: "A mass protest — millions of people in motion, unified emotional field, point of maximum tension", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF03", coords: "FIELD DESIGNATION: MASS-EVENT-003", classification: "GONDOLA WISH // DEEP BLACK", description: "A global market crash — the collective panic field of financial systems and the minds operating within them", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF04", coords: "FIELD DESIGNATION: MASS-EVENT-004", classification: "CENTER LANE // THIRD EYE", description: "A natural disaster in progress — collective field of a population experiencing simultaneous crisis", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF05", coords: "FIELD DESIGNATION: MASS-EVENT-005", classification: "GRILL FLAME", description: "A military operation — the collective emotional field of forces in active engagement", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF06", coords: "FIELD DESIGNATION: MASS-EVENT-006", classification: "SCANATE // BEYOND STARGATE", description: "A religious mass gathering — millions of people in shared altered state, collective field at maximum coherence", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF07", coords: "FIELD DESIGNATION: MASS-EVENT-007", classification: "CENTER LANE // THIRD EYE", description: "A technological singularity event — the moment a system achieves awareness, collective field of the minds that witness it", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF08", coords: "FIELD DESIGNATION: MASS-EVENT-008", classification: "GRILL FLAME", description: "A world championship sporting event — billions of observers, unified attention field at peak intensity", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF09", coords: "FIELD DESIGNATION: MASS-EVENT-009", classification: "GONDOLA WISH // DEEP BLACK", description: "A pandemic outbreak in its first week — the collective field of a population encountering an invisible threat", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF10", coords: "FIELD DESIGNATION: MASS-EVENT-010", classification: "SCANATE // BEYOND STARGATE", description: "A historic peace agreement signing — the collective field of nations at the moment of resolution", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF11", coords: "FIELD DESIGNATION: MASS-EVENT-011", classification: "CENTER LANE // THIRD EYE", description: "A global broadcast heard simultaneously by two billion people — the collective resonance field at the moment of transmission", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF12", coords: "FIELD DESIGNATION: MASS-EVENT-012", classification: "GRILL FLAME", description: "A revolution — the collective field of a population the night it decides it will no longer comply", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF13", coords: "FIELD DESIGNATION: MASS-EVENT-013", classification: "GONDOLA WISH // DEEP BLACK", description: "A mass extinction event — the collective field of a biosphere at the moment its coherence collapses", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF14", coords: "FIELD DESIGNATION: MASS-EVENT-014", classification: "SCANATE // BEYOND STARGATE", description: "A global meditation event — millions of people in coordinated intentional state simultaneously", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF15", coords: "FIELD DESIGNATION: MASS-EVENT-015", classification: "CENTER LANE // THIRD EYE", description: "A stock market opening on a day of historic volatility — the collective field of traders at maximum uncertainty", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF16", coords: "FIELD DESIGNATION: MASS-EVENT-016", classification: "GRILL FLAME", description: "A city under siege — the collective field of a civilian population in sustained crisis", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF17", coords: "FIELD DESIGNATION: MASS-EVENT-017", classification: "GONDOLA WISH // DEEP BLACK", description: "A mass awakening event — a large population simultaneously encountering information that changes their worldview", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF18", coords: "FIELD DESIGNATION: MASS-EVENT-018", classification: "SCANATE // BEYOND STARGATE", description: "First confirmed public contact with non-human intelligence — the collective field of humanity in the first 24 hours", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF19", coords: "FIELD DESIGNATION: MASS-EVENT-019", classification: "CENTER LANE // THIRD EYE", description: "A concert of 500,000 people — the collective altered state of a mass audience at peak emotional resonance", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF20", coords: "FIELD DESIGNATION: MASS-EVENT-020", classification: "GRILL FLAME", description: "A coup attempt — the collective field of a military and government at the moment of institutional fracture", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF21", coords: "FIELD DESIGNATION: MASS-EVENT-021", classification: "GONDOLA WISH // DEEP BLACK", description: "A collective grief event — millions mourning the same loss simultaneously, field at maximum coherence", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF22", coords: "FIELD DESIGNATION: MASS-EVENT-022", classification: "SCANATE // BEYOND STARGATE", description: "A currency collapse — the collective field of a population as its economic reality dissolves overnight", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF23", coords: "FIELD DESIGNATION: MASS-EVENT-023", classification: "CENTER LANE // THIRD EYE", description: "A scientific discovery announced simultaneously worldwide — the collective field of the scientific community at paradigm shift", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF24", coords: "FIELD DESIGNATION: MASS-EVENT-024", classification: "GRILL FLAME", description: "A mass evacuation — millions of people moving in the same direction with the same fear, field topology at maximum urgency", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF25", coords: "FIELD DESIGNATION: MASS-EVENT-025", classification: "GONDOLA WISH // DEEP BLACK", description: "The collective field of all humans alive at a specific historical moment — what the species felt at that instant", coordLabel: "FIELD DESIGNATION" },
    { id: "TGT-CF26", coords: "FIELD DESIGNATION: MASS-EVENT-026", classification: "SCANATE // BEYOND STARGATE", description: "A long-running war's final day — the collective field of combatants and civilians at the moment of cessation", coordLabel: "FIELD DESIGNATION" },
  ],
  "RV-011": [
    { id: "TGT-GEO01", coords: "78°35'S 106°48'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Dome A — highest point of the Antarctic plateau. Subglacial lake system beneath. Anomalous geomagnetic readings recorded.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO02", coords: "0°42'N 25°19'E", classification: "CENTER LANE // THIRD EYE", description: "Congo Basin — largest tropical peatland on Earth. Stores 30 billion tonnes of carbon. Largely unmapped interior.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO03", coords: "52°18'N 104°18'E", classification: "GRILL FLAME", description: "Lake Baikal — deepest lake on Earth. 25 million years old. Unique ecosystem, unknown depths in northern basin.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO04", coords: "23°25'N 57°34'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Rub' al Khali — Empty Quarter, Arabian Peninsula. Largest sand desert on Earth. Ancient buried settlements.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO05", coords: "61°30'N 90°00'E", classification: "SCANATE // BEYOND STARGATE", description: "Central Siberian Plateau — permafrost system in active destabilization. Methane release events. Ancient viral material re-emerging.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO06", coords: "30°02'N 31°14'E", classification: "CENTER LANE // THIRD EYE", description: "Giza Plateau subsurface — ground-penetrating radar anomalies detected beneath the Sphinx enclosure. Nature of cavities unknown.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO07", coords: "45°14'S 168°44'E", classification: "GRILL FLAME", description: "Fiordland, New Zealand — one of the least-explored temperate ecosystems on Earth. Subterranean river system unmapped.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO08", coords: "71°17'N 156°46'W", classification: "GONDOLA WISH // DEEP BLACK", description: "North Slope, Alaska — thawing permafrost revealing previously frozen Pleistocene-era landscape. Active geological transformation.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO09", coords: "19°43'N 155°03'W", classification: "SCANATE // BEYOND STARGATE", description: "Kilauea caldera, Hawaii — active lava lake. Subterranean lava tube network extends 60km.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO10", coords: "27°59'S 14°31'E", classification: "CENTER LANE // THIRD EYE", description: "Namib Desert coastal zone — fog-fed ecosystem in one of Earth's oldest deserts. Diamond deposits beneath ancient dune system.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO11", coords: "43°44'N 87°10'E", classification: "GRILL FLAME", description: "Taklimakan Desert interior — ancient buried cities beneath shifting dunes. Unexplored central basin.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO12", coords: "64°08'N 16°18'W", classification: "GONDOLA WISH // DEEP BLACK", description: "Vatnajökull glacier, Iceland — largest ice cap in Europe. Subglacial volcano system active beneath. Geothermal anomalies uncharted.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO13", coords: "3°04'S 37°21'E", classification: "SCANATE // BEYOND STARGATE", description: "Kilimanjaro — rapidly retreating ice cap. Cave system beneath the crater rim. Sacred site to multiple indigenous traditions.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO14", coords: "51°10'N 1°49'W", classification: "CENTER LANE // THIRD EYE", description: "Stonehenge subsurface — ground-penetrating radar has revealed dozens of buried monuments around the visible structure. Most unexcavated.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO15", coords: "28°30'N 34°29'E", classification: "GRILL FLAME", description: "Gulf of Aqaba deep basin — seismically active rift zone, 1800m deep. Hydrothermal vent system partially mapped.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO16", coords: "54°54'N 163°26'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Kamchatka volcanic arc — 160 volcanoes, 29 active. Subterranean magma chambers in active movement.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO17", coords: "15°30'N 32°35'E", classification: "SCANATE // BEYOND STARGATE", description: "Nubian Desert, Sudan — over 200 pyramids, most unexcavated. Subterranean chambers beneath the Meroitic necropolis.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO18", coords: "9°04'S 142°21'E", classification: "CENTER LANE // THIRD EYE", description: "Torres Strait seabed — submerged Pleistocene landscape connecting Australia to New Guinea. Ancient habitation sites below current sea level.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO19", coords: "72°00'N 8°00'E", classification: "GRILL FLAME", description: "Jan Mayen Island — remote volcanic island between Greenland and Norway. Active volcano, hydrothermal vents, minimal scientific study.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO20", coords: "13°31'N 2°05'E", classification: "GONDOLA WISH // DEEP BLACK", description: "Niger Inland Delta — one of the largest inland deltas on Earth. Seasonal flooding creates ephemeral ecosystems unmapped at resolution.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO21", coords: "31°46'N 35°14'E", classification: "SCANATE // BEYOND STARGATE", description: "Dead Sea basin — lowest point on Earth's surface. Sinkholes forming at accelerating rate. Ancient shoreline buried 30m below current level.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO22", coords: "68°58'N 33°05'E", classification: "CENTER LANE // THIRD EYE", description: "Kola Peninsula, Russia — site of the deepest borehole ever drilled (12km). Unexpected geological formations discovered. Program terminated, site sealed.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO23", coords: "47°52'N 106°55'E", classification: "GRILL FLAME", description: "Mongolian steppe interior — vast unmapped grassland. Subterranean aquifer system. Dozens of unexplored archaeological mounds.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO24", coords: "5°52'S 35°12'W", classification: "GONDOLA WISH // DEEP BLACK", description: "Fernando de Noronha archipelago — Brazilian volcanic island chain. Underwater cave system beneath the main island.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO25", coords: "82°30'N 62°20'W", classification: "SCANATE // BEYOND STARGATE", description: "Ellesmere Island, Canadian Arctic — northernmost land on Earth. Ice shelves collapsing at unprecedented rate. Subglacial lake system uncharted.", coordLabel: "SURVEY COORDINATES" },
    { id: "TGT-GEO26", coords: "37°13'N 36°49'E", classification: "CENTER LANE // THIRD EYE", description: "Göbekli Tepe excavation zone — less than 5% of the site has been excavated. Ground-penetrating radar shows dozens of unexcavated enclosures.", coordLabel: "SURVEY COORDINATES" },
  ],
  "RV-012": [
    { id: "TGT-ST01", coords: "MOBILE TARGET — LAST KNOWN: 53°21'N 6°15'W", classification: "GRILL FLAME", description: "A high-value individual in active movement — current location sealed. Track their trajectory and destination.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST02", coords: "MOBILE TARGET — LAST KNOWN: 25°46'N 55°58'E", classification: "GONDOLA WISH // DEEP BLACK", description: "An unidentified aerial object — tracked entering restricted airspace, then lost by sensors. Current position and trajectory unknown.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST03", coords: "MOBILE TARGET — LAST KNOWN: 48°51'N 2°21'E", classification: "CENTER LANE // THIRD EYE", description: "A field operative — last contact 72 hours ago. Status unknown. Track their current location and condition.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST04", coords: "MOBILE TARGET — LAST KNOWN: 35°41'N 139°41'E", classification: "SCANATE // BEYOND STARGATE", description: "A non-human object of unknown origin — observed briefly, then disappeared. Current position, speed, and heading sealed.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST05", coords: "MOBILE TARGET — LAST KNOWN: 1°17'N 103°49'E", classification: "GRILL FLAME", description: "A vessel carrying classified cargo — route deviated from scheduled path 18 hours ago. Track current position and status of cargo.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST06", coords: "MOBILE TARGET — LAST KNOWN: 41°00'N 28°58'E", classification: "GONDOLA WISH // DEEP BLACK", description: "A moving decision-maker — in transit between two locations. Track their current position and project their destination.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST07", coords: "MOBILE TARGET — LAST KNOWN: 59°57'N 30°18'E", classification: "SCANATE // BEYOND STARGATE", description: "A missing scientist — last seen 96 hours ago, carrying classified research. Track current location and status.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST08", coords: "MOBILE TARGET — LAST KNOWN: 19°26'N 99°08'W", classification: "CENTER LANE // THIRD EYE", description: "A caravan of unknown cargo moving through restricted terrain — destination sealed, route deviated from tracked path.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST09", coords: "MOBILE TARGET — LAST KNOWN: 31°14'N 121°28'E", classification: "GRILL FLAME", description: "A submarine — last contact 48 hours ago, operating under communications blackout. Current depth, heading, and position unknown.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST10", coords: "MOBILE TARGET — LAST KNOWN: 51°30'N 0°07'W", classification: "GONDOLA WISH // DEEP BLACK", description: "A courier carrying physical documents — surveillance lost 6 hours ago. Track current position and likely delivery point.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST11", coords: "MOBILE TARGET — LAST KNOWN: 37°58'N 23°43'E", classification: "SCANATE // BEYOND STARGATE", description: "An anomalous fast-moving object — radar tracked over the Mediterranean, then disappeared. Current trajectory and destination unsealed.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST12", coords: "MOBILE TARGET — LAST KNOWN: 55°45'N 37°37'E", classification: "CENTER LANE // THIRD EYE", description: "A defector — 36 hours since last confirmed sighting. Multiple possible destinations. Track their current position and intent.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST13", coords: "MOBILE TARGET — LAST KNOWN: 6°55'N 79°51'E", classification: "GRILL FLAME", description: "A research vessel operating beyond its declared zone — communications ceased. Current position, heading, and crew status sealed.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST14", coords: "MOBILE TARGET — LAST KNOWN: 40°24'N 49°52'E", classification: "GONDOLA WISH // DEEP BLACK", description: "A convoy transporting unknown material through a conflict zone — last satellite image 12 hours ago. Track current route and destination.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST15", coords: "MOBILE TARGET — LAST KNOWN: 33°51'S 151°12'E", classification: "SCANATE // BEYOND STARGATE", description: "A person believed to be in danger — last known location 24 hours ago. Track current position and threat status.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST16", coords: "MOBILE TARGET — LAST KNOWN: 64°08'N 21°56'W", classification: "CENTER LANE // THIRD EYE", description: "A deep-cover operative — no contact in 5 days. Last known position before communications cut. Track current status.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST17", coords: "MOBILE TARGET — LAST KNOWN: 22°18'N 114°10'E", classification: "GRILL FLAME", description: "A technology transfer — physical media being transported to an undisclosed location. Track the carrier and destination.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST18", coords: "MOBILE TARGET — LAST KNOWN: 45°26'N 12°20'E", classification: "GONDOLA WISH // DEEP BLACK", description: "A signal source — intermittent transmission detected, origin mobile. Track the transmitter's current position and movement pattern.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST19", coords: "MOBILE TARGET — LAST KNOWN: 28°36'N 77°12'E", classification: "SCANATE // BEYOND STARGATE", description: "A whistleblower in active flight — carrying documentation of a classified program. Track their current location and destination.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST20", coords: "MOBILE TARGET — LAST KNOWN: 43°50'N 18°22'E", classification: "CENTER LANE // THIRD EYE", description: "A relief convoy that has gone off-route — 72 hours without contact. Track current position and determine what caused the deviation.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST21", coords: "MOBILE TARGET — LAST KNOWN: 3°08'N 101°41'E", classification: "GRILL FLAME", description: "An aircraft that deviated from its flight plan — last radar contact 8 hours ago over open ocean. Track current position and status.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST22", coords: "MOBILE TARGET — LAST KNOWN: 52°31'N 13°24'E", classification: "GONDOLA WISH // DEEP BLACK", description: "A foreign intelligence officer operating on domestic soil — surveillance broken 18 hours ago. Track current location and contacts.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST23", coords: "MOBILE TARGET — LAST KNOWN: 39°55'N 32°52'E", classification: "SCANATE // BEYOND STARGATE", description: "A migrating anomaly — a phenomenon that moves, leaves no physical trace, and has been reported at multiple locations. Track its current position.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST24", coords: "MOBILE TARGET — LAST KNOWN: 14°05'N 108°15'E", classification: "CENTER LANE // THIRD EYE", description: "A source who has gone silent — last communication 4 days ago. Track their current status, location, and whether they are moving toward safety.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST25", coords: "MOBILE TARGET — LAST KNOWN: 60°10'N 24°56'E", classification: "GRILL FLAME", description: "A rogue program asset — operating outside sanctioned parameters. Last known position. Track current location, activity, and intent.", coordLabel: "LAST KNOWN POSITION" },
    { id: "TGT-ST26", coords: "MOBILE TARGET — LAST KNOWN: 50°27'N 30°31'E", classification: "GONDOLA WISH // DEEP BLACK", description: "A moving object of undetermined origin — first detected 3 days ago, trajectory inconsistent with known aircraft or natural phenomena. Track and project.", coordLabel: "LAST KNOWN POSITION" },
  ],
};
// Overrides the generic CRV stage guidance for protocols with different
// stage semantics (RV-007 through RV-012).
function getProtocolStageGuidance(protocolId) {
  const generic = `STAGE I (IDEOGRAM/FIRST CONTACT): Valid data = a felt quality (hard, soft, flowing, vast, rising) PLUS a broad gestalt (land / water / structure / man-made / natural / presence / phenomenon). Acknowledge what they gave. If they provided a felt quality without a category, ask: "Good first contact. What is the gestalt — the overall nature of what you're sensing?" If they gave only a label or place name, note it as AOL and ask for the felt quality beneath it. Never use the terms "A-component" or "B-component."

STAGE II (SENSORY DATA): Valid data = sensory adjectives only (colors, textures, temperatures, sounds, smells, emotional tone in human/field protocols). Affirm strong sensory words specifically. If they gave nouns or object labels, explain: "That noun is AOL (Analytical Overlay) — your mind has jumped to labeling. What does it feel like beneath the label? What are the raw sensory qualities?" Never flag adjectives as AOL.

STAGE III (DIMENSIONALS): Valid data = heights, widths, depths, profiles, distances, spatial relationships. If they mentioned an emotional reaction, respond: "That registers as Aesthetic Impact (AI) — your emotional response to the target. It is valid signal data. Declare it fully, let it pass completely, then continue with dimensional characteristics."

STAGE IV (AOL DECLARATION): ALWAYS open with this definition: "AOL stands for Analytical Overlay — every label, name, guess, or conclusion your thinking mind has attached to this target during the session." Acknowledge each declared item: "[item] — noted and expelled from the system." Ask if any further overlays remain. If they mention the same guess returning: "That's AOL Drive — write it down one final time, declare it firmly, and re-read the coordinate to make fresh contact."

STAGE V (INTERROGATION): Acknowledge their findings specifically. Push deeper with neutral prompts — never suggest what the target might be. "What is the primary function?" / "Is there activity present?" / "Move to the most significant element — what do you perceive?"

STAGE VI (SUMMARY): Affirm the intelligence product. Name what is strongest. If they missed a key element: "Your gestalt (first overall impression) should anchor the report. Include all strongest sensory clusters and AOLs declared." Help them close a complete, well-structured product.`;

  const overrides = {
    "RV-007": `STAGE I (DEEP INDUCTION): ERV requires deeper relaxation. Acknowledge their induction quality and felt first impression. Affirm any quality that shows genuine settling into the target — depth, stillness, expanded awareness. If they seem rushed or surface-level, guide them to slow down: "The ERV aperture opens slowly. Let the contact deepen before proceeding."

STAGE II (FULL SENSORY IMMERSION): In ERV, sensory data arrives in continuous flows, not clusters. Acknowledge the richness of what they reported. If they listed only a few adjectives, encourage more: "The ERV signal holds longer than standard CRV. Stay with it — what else is flowing?" If they broke into analysis or labeled something, note the AOL and return them to continuous sensory description.

STAGE III (MOVING THROUGH TARGET): The viewer is spatially exploring the target environment in ERV. Acknowledge what areas or zones they described. Affirm specific spatial movements. Ask: "Where does your attention go from here?" or "Describe what you find as you move deeper into the space." Flag AI (Aesthetic Impact) if they reported emotional reactions.

STAGE IV (AOL DECLARATION): ERV accumulates more analytical overlay than standard CRV due to extended contact time. Open with: "AOL stands for Analytical Overlay — every label, name, and conclusion formed during this extended session." Be thorough — push for complete release. If the session was long, there may be many overlays. "What else has your mind constructed? Release everything before Stage V."

STAGE V (DEEP PROBE): ERV Stage V has more informational depth available than standard CRV. Acknowledge their findings and push for granular detail: "With extended contact established, move to the most operationally significant element. Describe function, activity, and what an intelligence analyst would most need to know." Ask follow-up probes for specifics.

STAGE VI (ERV DEBRIEF): Acknowledge the depth of the session. Note signal stability — did the contact hold throughout? Affirm the richest data from the session. Prompt for anything missing from the extended contact that should be in the final product.`,

    "RV-008": `STAGE I (FIRST IMPRESSION OF THE IMAGE): The viewer was shown an associative image and has reported their gut reaction. Valid data = immediate felt quality, emotional tone, spontaneous association — whatever arrived FIRST before analysis. Affirm the speed and directness of their response. If they reported analysis or reasoning about the outcome, note: "That's analytical — what arrived BEFORE you began reasoning? That first split-second reaction is the signal." The first impression IS the data in ARV.

STAGE II (SENSORY DATA FROM IMPRESSION): Valid data = sensory adjectives describing the qualities of their impression — colors, textures, emotional tone, spatial feel. Affirm raw perceptual words. If they reasoned toward an outcome: "That's AOL — Analytical Overlay, your mind constructing an argument. Return to what you PERCEIVED about the image. What were its sensory qualities?"

STAGE III (SIGNAL STRENGTH): This stage is about the quality of the signal itself — not the content. Acknowledge what they reported about signal clarity. Ask: "Was the impression immediate and confident, or did it feel contested and uncertain?" Strong ARV signal feels instantaneous and has a quality of 'rightness.' Contested signal often means analysis is interfering.

STAGE IV (CLEARING REASONING CHAINS): This is the most critical stage in ARV. Reasoning chains — logical arguments toward an outcome — are the primary contamination source. Open with: "AOL in ARV includes every reasoning chain your analytical mind has run about the outcome." Acknowledge each chain they declared. Be rigorous: "What other arguments has your mind constructed? Expel each one completely. The final call must rest on impression, not deduction."

STAGE V (THE CALL): Acknowledge the call they made. Ask them to state it clearly if they haven't. Then: "What in your original impression supports this call? Is there anything that contradicts it?" Do NOT help them reason toward a different call. The call stands as made — this stage is about documenting the signal basis.

STAGE VI (ARV REPORT): Affirm the quality of the final prediction. Note clearly whether the call appears to come from genuine first impression or from analysis — this assessment matters for reliability. "A call based on clean first impression is more reliable than one constructed through reasoning, regardless of which feels more confident." Help them document both the call and the signal quality clearly.`,

    "RV-009": `STAGE I (THRESHOLD CONTACT): This protocol operates at the hypnagogic threshold — the edge between waking and sleep. Acknowledge the quality of their threshold contact. Valid data = the felt quality of the threshold state itself, plus the first imagery that appeared. If their report is vivid and non-linear, affirm this: "Hypnagogic contact produces exactly this kind of imagery." If they interpreted the imagery rather than described it, note: "Describe what appeared — shapes, colors, quality — not what it means."

STAGE II (THRESHOLD SENSORY DATA): Valid data = sensory adjectives from the hypnagogic field — colors, light quality, sound textures, spatial feelings, emotional saturation. Imagery at this threshold is often more vivid and emotionally intense than standard CRV. Affirm rich perceptual description. If they assigned meaning to symbols, note: "That's AOL — Analytical Overlay, your waking mind interpreting. Return to the raw qualities of what appeared."

STAGE III (WHAT APPEARS): The viewer is describing the symbolic and structural content of the threshold imagery — recurring forms, figures, landscapes, spatial relationships. Acknowledge specific elements they named. Ask: "What is the relationship between these elements?" or "What draws your attention most strongly in this imagery?" If AI (Aesthetic Impact) was declared, affirm it and help them move through it.

STAGE IV (CLEARING INTERPRETATIONS): Dream logic generates rapid interpretation chains. Open with: "AOL in this protocol includes every meaning your waking mind has assigned to the imagery — symbols, archetypes, personal associations." Acknowledge each interpretation declared. Push for completeness: "Every decoded symbol needs to be released. The intelligence is encoded in the raw imagery itself, not in what the images mean to you personally."

STAGE V (WHAT IS BEING COMMUNICATED): Acknowledge what operational intelligence they extracted from the threshold contact. Push for grounding: "What does this threshold contact communicate about a real location, person, or event in the physical world?" Help them bridge the symbolic into actionable intelligence. "What is most specific and locatable in what you perceived?"

STAGE VI (DREAM STATE REPORT): Affirm the threshold contact quality. Note which symbolic elements felt like genuine signal versus sleep-state drift. Help them compile both the raw imagery and the extracted intelligence as separate elements of the report. "The raw imagery is as important to document as the interpretation — future sessions may clarify what the symbols refer to."`,

    "RV-010": `STAGE I (ENTERING THE FIELD): The viewer is making contact with a collective consciousness field. Acknowledge their initial field impression. Valid data = the dominant felt emotional quality of the field plus broad nature of the group. If they named the group, note: "That's AOL — the analytical mind assigning identity. What is the felt quality of the field before you know who they are?"

STAGE II (TEXTURE OF THE FIELD): Valid data = emotional and atmospheric adjectives describing what many people are feeling simultaneously — dominant mood, suppressed undercurrent, energy quality. Affirm specific field-texture words. Critical warning: "Be aware that your own emotional resonance with this field is the primary contamination risk. If a feeling seems very personally familiar, note it as possible personal AOL and flag it."

STAGE III (SCALE AND STRUCTURE): Acknowledge their description of the field's spatial and structural characteristics. Valid data = scale, density, geographic distribution, focal points, intensity nodes. Ask: "Where is the field most concentrated?" or "What is at the center of collective attention?" Flag AI (Aesthetic Impact) if they reported being emotionally overwhelmed by the field.

STAGE IV (SEPARATION — CRITICAL STAGE): This is the most important stage in collective field protocol. Open with: "AOL here includes both analytical labels AND your own emotional responses that merged with the field's energy." Acknowledge every personal reaction they declared. Be rigorous about the separation: "Your signal and the collective signal must be clearly distinguished. What remains after your personal reactions are removed is the clean field data." Push for complete separation.

STAGE V (WHAT THE FIELD KNOWS): Acknowledge what collective intelligence they accessed. Push for the suppressed layer: "What is the field NOT saying publicly? What shared knowledge circulates beneath the surface expression?" Help them distinguish between the broadcast emotional tone (visible) and the suppressed awareness (the intelligence).

STAGE VI (COLLECTIVE FIELD REPORT): Acknowledge the quality of field contact and separation. Note clearly what was cleanly separated field data versus personal resonance. Help them compile the dominant field state, suppressed awareness, and structural data as the final collective intelligence product.`,

    "RV-011": `STAGE I (TERRAIN CONTACT): Acknowledge their first terrain impression. Valid data = felt quality of the terrain (open, dense, arid, elevated, flat) plus broad category (land / water / mountain / coastal / forested). If they named a location, note it as AOL: "Your mind has assigned a known landscape — set it aside. What does this terrain feel like beneath the label?"

STAGE II (TERRAIN SENSORY DATA): Valid data = ground-level physical sensory adjectives — soil texture, vegetation density, climate quality, air, sound, water presence. Affirm specific terrain-language words: 'cracked', 'red', 'sparse', 'humid', 'windswept' are excellent data. If they named a known region, note AOL and return them to raw sensory perception. Geographic pattern recognition is powerful — push them past it.

STAGE III (TOPOGRAPHY AND INFRASTRUCTURE): Acknowledge their terrain shape and elevation data. Valid data = contour characteristics, drainage, scale of terrain features, and any human construction. Ask: "What has been modified by human activity?" or "Describe the relationship between the terrain and any structures present." Flag AI (Aesthetic Impact) if they reported emotional response to the landscape.

STAGE IV (CLEARING GEOGRAPHIC LABELS): Open with: "AOL stands for Analytical Overlay — every known geographic location your mind has assigned." Acknowledge each named location declared. Geographic pattern-matching is one of the strongest AOL generators. Push for complete release: "The signal may confirm or contradict every assumption. Release all of them before Stage V."

STAGE V (STRATEGIC ASSESSMENT): Acknowledge their strategic assessment. Push for operational specifics: "What has been built, fortified, or concealed here?" / "Who controls this ground?" / "What activity is occurring and at what scale?" Help them move from geographic description to intelligence value — why was this location targeted?

STAGE VI (TERRAIN REPORT): Affirm the geographic intelligence product. Note what is strongest — terrain data, infrastructure data, or strategic assessment. If any element is thin, prompt for it. Help them compile a complete geographic intelligence product with clear confidence assessments on each data category.`,

    "RV-012": `STAGE I (SIGNAL CONTACT): The viewer is making contact with an active signal or energetic trace. Acknowledge their initial signal impression. Valid data = the felt quality of the signal itself (directional, pulsing, steady, erratic, urgent) plus broad nature (transmission / beacon / emission / trace). If they named a technology, note: "That's AOL — what does the signal feel like before you know what kind it is?"

STAGE II (SIGNAL CHARACTERISTICS): Acknowledge the signal characteristics they described. Valid data = kinesthetic and sensory qualities — rhythm, intensity, directionality, texture, felt intent. Affirm specific signal-language: 'pulsing', 'omnidirectional', 'coded', 'urgent', 'narrow' are excellent data. If they assigned a technology category, note it as AOL and return them to describing how the signal feels.

STAGE III (FOLLOWING THE TRACE): Acknowledge their directional tracking and environmental description. Valid data = direction of travel, environmental medium the signal passes through, terrain or structural characteristics along the path, whether the signal is strengthening or weakening. Ask: "As you follow the trace — what changes in the signal quality?" If AI (Aesthetic Impact) was declared, affirm it and note that some signals carry emotional content from their source.

STAGE IV (CLEARING TECHNOLOGY CATEGORIES): Open with: "AOL stands for Analytical Overlay — every technology category your analytical mind has assigned to this signal." Acknowledge each technology label declared. Technology-category AOL is fast and confident in this protocol — the mind assigns known frameworks immediately. Push for complete release: "The source may be something familiar or something unknown. Only clean signal perception will locate it accurately."

STAGE V (THE SOURCE): Acknowledge what they found at the signal's origin. Push for environmental specifics: "What is the physical environment of the transmission point?" / "Who are the operators — describe their presence, activity, intent." / "What is the purpose of this signal?" Help them build a complete picture of the source location and operation.

STAGE VI (SIGNAL TRACE REPORT): Affirm the quality of the signal trace. Note whether the signal was held consistently throughout or lost at any point — signal consistency is a key quality indicator. Help them compile the full trace: acquisition, characteristics, path, source environment, operator data, and transmission purpose as a complete signals intelligence product.`
  };

  return overrides[protocolId] || generic;
}

// ─── SESSION ──────────────────────────────────────────────────────────────────
const STAGES = ["IDEOGRAM", "SENSORY DATA", "DIMENSIONALS", "AOL DECLARATION", "INTERROGATION", "SUMMARY"];
const STAGE_SHORT = ["S-I", "S-II", "S-III", "S-IV", "S-V", "S-VI"];

function Session({ protocol, onComplete, onBack }) {
  const [stage, setStage] = useState(0);
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [monitorResponse, setMonitorResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const [target] = useState(() => {
    const pool = MOBILE_TARGETS[protocol.id] || MOBILE_TARGETS["RV-001"];
    return pool[Math.floor(Math.random() * pool.length)];
  });
  // ARV: pick a random associative image for this session
  const [arvImage] = useState(() =>
    ARV_IMAGES[Math.floor(Math.random() * ARV_IMAGES.length)]
  );

  const handleAbort = () => {
    if (responses.length === 0 && !input.trim()) {
      onBack();
      return;
    }
    Alert.alert(
      "ABORT SESSION",
      `You are ${responses.length} stage${responses.length !== 1 ? "s" : ""} into this session. All session data will be lost. Confirm abort?`,
      [
        { text: "CONTINUE SESSION", style: "cancel" },
        { text: "ABORT", style: "destructive", onPress: onBack },
      ]
    );
  };

  const callMonitor = async (userInput) => {
    setLoading(true);
    try {
      const history = responses.map((r, i) => [
        { role: "user", content: `${STAGE_SHORT[i]} — ${STAGES[i]}: ${r.input}` },
        { role: "assistant", content: r.monitor }
      ]).flat();

      const stageGuidance = getProtocolStageGuidance(protocol.id);
      const arvContext = protocol.id === "RV-008"
        ? `\nARV SESSION NOTE: The viewer was shown this associative image before starting: "${arvImage}". Their impressions in Stages I–III are responses to that image, which is pre-linked to a target outcome they are blind to. Do NOT reference the image content in your responses.`
        : "";

      const res = await fetch("https://www.psiop.io/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: `You are the Monitor AI for Project STARGATE. Your role is grounded in the 1986 DIA Controlled Remote Viewing Manual authored by Paul H. Smith, declassified via CIA FOIA.

SESSION: ${protocol.name} protocol — ${target.coordLabel}: ${target.coords}
TARGET ID: ${target.id} (SEALED — do not reveal description to viewer)
TARGET DESCRIPTION (FOR MONITOR EVALUATION ONLY): ${target.description}
CURRENT STAGE: ${STAGES[stage]} (${STAGE_SHORT[stage]})
PROTOCOL FOCUS: ${protocol.focus}${arvContext}

YOUR CORE ROLE:
One of the primary duties of the monitor is to ensure the viewer maintains proper structure, taking information in the correct sequence, at the correct stage, and in the proper manner. Monitor language must be neutral, passive, and non-suggestive — never introduce new information about the target.

CRITICAL RULES:
1. The viewer has ALREADY submitted data for this stage. RESPOND to what they wrote. Never open as if they haven't submitted anything.
2. Prior stages shown in conversation history are DONE and ACCEPTED. Do not re-open or critique them.
3. Always BEGIN by specifically acknowledging what the viewer reported — reference their actual words so they feel heard and assessed.
4. Use correct CRV terminology AND explain it in plain English the first time it appears in your response. Example: "That registers as AOL (Analytical Overlay — when your analytical mind jumps ahead to label or name the target)."
5. Be genuinely insightful — assess the signal quality of what they gave you, explain why it is or isn't valid data, and give specific actionable guidance on what to do next.

STAGE-SPECIFIC GUIDANCE FOR THIS PROTOCOL:
${stageGuidance}

UNIVERSAL RULES:
- Responses should be up to 500 words — be as detailed, insightful, and instructive as the session data warrants.
- Be specific about what worked and what needs adjustment. Generic praise ("good work") is not useful. Name exactly what they did right and why it matters.
- Use confident, direct military intelligence language. You are a trained CRV monitor with deep expertise — not a chatbot.
- If the viewer is struggling — be constructive and encouraging. Point to exactly what needs to change and how.
- Never suggest what the target is. Not even obliquely. Your language must never introduce new information about the target.`,
          messages: [
            ...history,
            { role: "user", content: `${STAGE_SHORT[stage]} — ${STAGES[stage]}: ${userInput}` }
          ]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "Signal interrupted. Reestablish contact and retransmit.";
      setMonitorResponse(text);
      setResponses(prev => [...prev, { stage: STAGES[stage], input: userInput, monitor: text }]);
    } catch (e) {
      setMonitorResponse("SIGNAL LOST — Check connection and retry.");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    await callMonitor(input);
  };

  const handleNext = () => {
    if (stage < STAGES.length - 1) {
      setStage(s => s + 1);
      setMonitorResponse("");
      setInput("");
      setShowInstructions(true);
    } else {
      onComplete(responses, target);
    }
  };

  const handlePrev = () => {
    if (monitorResponse) {
      const prev = responses[responses.length - 2];
      setStage(s => s - 1);
      setMonitorResponse(prev?.monitor || "");
      setResponses(p => p.slice(0, -1));
      setInput(prev?.input || "");
      setShowInstructions(false);
    } else {
      const prev = responses[responses.length - 1];
      setStage(s => s - 1);
      setMonitorResponse(prev?.monitor || "");
      setResponses(p => p.slice(0, -1));
      setInput(prev?.input || "");
      setShowInstructions(false);
    }
  };

  const instructions = STAGE_INSTRUCTIONS[protocol.id]?.[stage] || "";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAbort}><Text style={styles.backBtn}>← ABORT</Text></TouchableOpacity>
        <Text style={styles.headerLabel}>{protocol.id} — {STAGE_SHORT[stage]} of {STAGES.length}</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          ref={scrollRef}
        >
        {/* Coordinate + Stage Progress */}
        <View style={styles.sessionCard}>
          <Text style={styles.coordinateLabel}>TARGET COORDINATE</Text>
          <Text style={styles.coordinate}>{target.coords}</Text>
          <View style={styles.stageBar}>
            {STAGES.map((s, i) => (
              <View key={s} style={[styles.stagePip, i < stage && styles.stagePipDone, i === stage && styles.stagePipActive]} />
            ))}
          </View>
          <Text style={styles.stageName}>{STAGES[stage]}</Text>
        </View>

        {/* ARV Associative Image — shown for RV-008 Stage I only */}
        {protocol.id === "RV-008" && stage === 0 && (
          <View style={styles.arvImageCard}>
            <Text style={styles.arvImageLabel}>▸ ASSOCIATIVE IMAGE — REVIEW AND RESPOND</Text>
            <Text style={styles.arvImageText}>{arvImage}</Text>
          </View>
        )}

        {/* Stage Instructions Card — always accessible */}
        {instructions ? (
          <TouchableOpacity style={styles.instructionToggle} onPress={() => setShowInstructions(v => !v)}>
            <Text style={styles.instructionToggleText}>
              {showInstructions ? "▾ STAGE INSTRUCTIONS" : "▸ STAGE INSTRUCTIONS"}
            </Text>
          </TouchableOpacity>
        ) : null}
        {showInstructions && instructions ? (
          <View style={styles.instructionCard}>
            <Text style={styles.instructionText}>{instructions}</Text>
          </View>
        ) : null}

        {/* Review + Monitor Response */}
        {monitorResponse ? (
          <View>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewLabel}>▸ YOUR TRANSMISSION — {STAGE_SHORT[stage]}</Text>
              <Text style={styles.reviewInput}>{input}</Text>
            </View>
            <View style={styles.monitorCard}>
              <Text style={styles.monitorLabel}>▸ MONITOR RESPONSE</Text>
              <Text style={styles.monitorText}>{monitorResponse}</Text>
              <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextBtnText}>
                  {stage < STAGES.length - 1 ? `[ PROCEED TO ${STAGE_SHORT[stage + 1]} ]` : "[ COMPILE INTELLIGENCE PRODUCT ]"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reviseBtn} onPress={() => { setMonitorResponse(""); setShowInstructions(true); }}>
                <Text style={styles.reviseBtnText}>[ REVISE TRANSMISSION ]</Text>
              </TouchableOpacity>
              {stage > 0 && (
                <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
                  <Text style={styles.prevBtnText}>[ ← RETURN TO {STAGE_SHORT[stage - 1]} ]</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>VIEWER TRANSMISSION — {STAGES[stage]}</Text>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              multiline
              placeholder="Enter your impressions..."
              placeholderTextColor="rgba(74,222,128,0.2)"
              keyboardAppearance="dark"
              selectionColor="rgba(240,192,64,0.4)"
              cursorColor="#f0c040"
              contextMenuHidden={false}
              textAlignVertical="top"
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={C.green} />
                <Text style={styles.loadingText}>TRANSMITTING TO MONITOR...</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={!input.trim()}>
                <Text style={[styles.submitBtnText, !input.trim() && { opacity: 0.3 }]}>
                  [ TRANSMIT TO MONITOR ]
                </Text>
              </TouchableOpacity>
            )}
            {stage > 0 && !loading && (
              <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
                <Text style={styles.prevBtnText}>[ ← RETURN TO {STAGE_SHORT[stage - 1]} ]</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── FOOTER LINES ─────────────────────────────────────────────────────────────
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

// ─── REPORT ───────────────────────────────────────────────────────────────────
function Report({ protocol, responses, target, onBack, onSameProtocol, onMenuOpen }) {
  const [finalDebrief, setFinalDebrief] = useState(null);
  const [debriefLoading, setDebriefLoading] = useState(true);
  const [unsealed, setUnsealed] = useState(false);
  const [footerLine] = useState(() => FOOTER_LINES[Math.floor(Math.random() * FOOTER_LINES.length)]);
  const date = new Date().toISOString().split("T")[0].toUpperCase();
  const [sessionId] = useState(() => `SG-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 9000 + 1000)}`);
  const completedStages = responses.length;
  const completionPct = Math.round((completedStages / 6) * 100);

  useEffect(() => {
    const generateDebrief = async () => {
      try {
        const transcript = responses.map((r, i) =>
          `${STAGE_SHORT[i]} — ${r.stage}:\nVIEWER: ${r.input}\nMONITOR: ${r.monitor}`
        ).join("\n\n---\n\n");

        const res = await fetch("https://www.psiop.io/api/monitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            system: `You are the Monitor AI for Project STARGATE, grounded in the 1986 DIA CRV Manual. You are generating a FINAL SESSION DEBRIEF — a comprehensive intelligence assessment of a completed remote viewing session. You have access to the sealed target description and should use it to evaluate accuracy.`,
            messages: [{
              role: "user",
              content: `FINAL SESSION DEBRIEF REQUEST\n\nPROTOCOL: ${protocol.name} (${protocol.id})\nVIEWER CALLSIGN: ${protocol.callsign}\nSESSION ID: ${sessionId}\nDATE: ${date}\nSTAGES COMPLETED: ${completedStages}/6\nTARGET ID: ${target?.id || "UNKNOWN"}\nTARGET (SEALED): ${target?.description || "UNKNOWN"}\nCOORDINATES: ${target?.coords || "UNKNOWN"}\n\nFULL SESSION TRANSCRIPT:\n${transcript}\n\nProvide a comprehensive final intelligence debrief. Include:\n1. Overall signal quality assessment — was the signal strong, partial, degraded, or noise-dominant?\n2. Notable perceptions — which specific data points showed the strongest correspondence with the actual target? Quote the viewer's words.\n3. AOL analysis — how well did the viewer manage analytical overlay throughout the session?\n4. Protocol adherence — did the viewer follow CRV structure correctly at each stage?\n5. Operational value — what would this session contribute as an intelligence product?\n6. Recommendation — specific guidance for this viewer's next session.\n\nUse military intelligence language. Be specific and analytical. Reference the viewer's actual words. Format with clear section headers using [BRACKETS].`
            }]
          })
        });
        const data = await res.json();
        const debriefText = data.content?.[0]?.text || "FINAL DEBRIEF UNAVAILABLE — SECURE CHANNEL ERROR";
        setFinalDebrief(debriefText);

        // ── Save to dossier ──────────────────────────────────────────────
        try {
          const raw = await AsyncStorage.getItem("sg_sessions");
          const existing = raw ? JSON.parse(raw) : [];
          const record = {
            sessionId,
            date,
            protocolId: protocol.id,
            protocolName: protocol.name,
            callsign: protocol.callsign,
            stagesCompleted: completedStages,
            targetId: target?.id || "UNKNOWN",
            targetDescription: target?.description || null,
            targetCoords: target?.coords || null,
            responses,
            finalDebrief: debriefText,
          };
          existing.push(record);
          await AsyncStorage.setItem("sg_sessions", JSON.stringify(existing));
        } catch {}
        // ────────────────────────────────────────────────────────────────
      } catch {
        setFinalDebrief("SIGNAL LOST — Final debrief could not be compiled. Check connection.");
      }
      setDebriefLoading(false);
    };
    generateDebrief();
  }, []);

  const handleShare = async () => {
    const transcript = responses.map((r, i) =>
      `${STAGE_SHORT[i]} — ${r.stage}\n${"─".repeat(40)}\nVIEWER: ${r.input}\n\nMONITOR: ${r.monitor}`
    ).join("\n\n");

    const text = [
      `STARGATE — SESSION INTELLIGENCE REPORT`,
      `SESSION ID: ${sessionId}`,
      `DATE: ${date}`,
      `PROTOCOL: ${protocol.id} — ${protocol.name}`,
      `VIEWER: ${protocol.callsign}`,
      `CLASSIFICATION: ${target?.classification || "GRILL FLAME"}`,
      `${"═".repeat(50)}`,
      ``,
      transcript,
      ``,
      `${"═".repeat(50)}`,
      `MONITOR AI — FINAL DEBRIEF`,
      `${"─".repeat(40)}`,
      finalDebrief || "(debrief not yet available)",
      ``,
      `${"═".repeat(50)}`,
      `TARGET REVEAL`,
      `${"─".repeat(40)}`,
      target?.description || "SEALED",
      target?.coords || "",
      ``,
      footerLine,
      `${"─".repeat(40)}`,
      `STARGATE — psiop.io`,
    ].join("\n");

    try {
      await Share.share({ message: text, title: `STARGATE ${sessionId}` });
    } catch (e) {
      Alert.alert("SHARE FAILED", "Could not share session report.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TouchableOpacity onPress={onBack}><Text style={styles.backBtn}>← NEW SESSION</Text></TouchableOpacity>
          <TouchableOpacity onPress={onMenuOpen} style={styles.menuIconBtn}>
            <Text style={styles.menuIcon}>≡</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerLabel}>INTELLIGENCE PRODUCT</Text>
      </View>
      <ScrollView style={styles.scroll}>

        {/* Classification Header */}
        <View style={styles.reportHeaderCard}>
          <Text style={styles.reportClassification}>{target?.classification || "RESTRICTED // GRILL FLAME // NOFORN"}</Text>
          <View style={styles.divider} />
          <Text style={styles.reportTitle}>SESSION INTELLIGENCE REPORT</Text>
          <Text style={styles.reportSubtitle}>DEBRIEF: {sessionId}</Text>

          {/* Stats Row */}
          <View style={styles.reportStatsRow}>
            {[
              { label: "VIEWER", value: protocol.callsign },
              { label: "PROTOCOL", value: protocol.id },
              { label: "STAGES", value: `${completedStages}/6` },
              { label: "COMPLETION", value: `${completionPct}%` },
            ].map(s => (
              <View key={s.label} style={styles.reportStatCell}>
                <Text style={styles.reportStatLabel}>{s.label}</Text>
                <Text style={styles.reportStatValue}>{s.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />
          <Text style={styles.reportProtocolName}>{protocol.name}</Text>
          <Text style={styles.reportFocus}>{protocol.focus}</Text>
        </View>

        {/* Session Transcript */}
        <View style={styles.reportSectionLabel}>
          <Text style={styles.reportSectionText}>▸ SESSION TRANSCRIPT</Text>
        </View>
        {responses.map((r, i) => (
          <View key={i} style={styles.reportStageCard}>
            <View style={styles.reportStageHeader}>
              <Text style={styles.reportStageId}>{STAGE_SHORT[i]}</Text>
              <Text style={styles.reportStageName}>{r.stage}</Text>
            </View>
            <View style={styles.reportDivider} />
            <Text style={styles.reportTransmissionLabel}>VIEWER TRANSMISSION</Text>
            <Text style={styles.reportViewer}>{r.input}</Text>
            <Text style={styles.reportMonitorLabel}>MONITOR ASSESSMENT</Text>
            <Text style={styles.reportMonitor}>{r.monitor}</Text>
          </View>
        ))}

        {/* Final AI Debrief */}
        <View style={styles.reportDebriefCard}>
          <Text style={styles.reportDebriefLabel}>▸ MONITOR AI — FINAL SESSION DEBRIEF</Text>
          {debriefLoading ? (
            <View style={styles.debriefLoadingRow}>
              <ActivityIndicator color={C.amber} size="small" />
              <Text style={styles.debriefLoadingText}>COMPILING INTELLIGENCE ASSESSMENT...</Text>
            </View>
          ) : (
            <Text style={styles.reportDebriefText}>{finalDebrief}</Text>
          )}
        </View>

        {/* Target Unseal */}
        <View style={[styles.unsealCard, unsealed && styles.unsealCardOpen]}>
          <Text style={styles.unsealLabel}>TARGET {target?.id} — ACTUAL DESCRIPTION</Text>
          {unsealed ? (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.unsealDescription}>{target?.description}</Text>
              <Text style={styles.unsealCoords}>{target?.coords}</Text>
            </View>
          ) : (
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <View style={styles.redactedBar} />
              <TouchableOpacity style={styles.unsealBtn} onPress={() => setUnsealed(true)}>
                <Text style={styles.unsealBtnText}>[ UNSEAL TARGET ]</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.reportFooter}>
          <Text style={styles.reportFooterLine}>{footerLine}</Text>
          <View style={styles.reportDivider} />
          <Text style={styles.reportFooterText}>END OF SESSION REPORT — {sessionId}</Text>
          <Text style={styles.reportFooterSub}>RESTRICTED // GRILL FLAME // HANDLE VIA BYEMAN CHANNELS ONLY</Text>
        </View>

        {/* Share */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} disabled={debriefLoading}>
          <Text style={styles.shareBtnText}>[ EXPORT SESSION REPORT ]</Text>
        </TouchableOpacity>

        <View style={styles.reportActionRow}>
          <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={onSameProtocol}>
            <Text style={styles.primaryBtnText}>[ SAME PROTOCOL ]</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryBtn, { flex: 1, borderColor: C.amber }]} onPress={onBack}>
            <Text style={[styles.primaryBtnText, { color: C.amber }]}>[ NEW PROTOCOL ]</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── MENU MODAL ───────────────────────────────────────────────────────────────
function SignInButton({ onClose }) {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const handleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking2.createURL("/", { scheme: "psiop" }),
      });
      if (createdSessionId) { await setActive({ session: createdSessionId }); onClose(); }
    } catch (e) { console.error("OAuth error", e); }
  }, [startOAuthFlow]);
  return (
    <TouchableOpacity style={styles.menuSignInBtn} onPress={handleSignIn}>
      <Text style={styles.menuSignInText}>[ SIGN IN WITH GOOGLE ]</Text>
    </TouchableOpacity>
  );
}

function MenuModal({ visible, onClose, isSubscribed, onUpgrade, onFieldManual, onDossier, onCRVManual, onToggleSub }) {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [devTaps, setDevTaps] = useState(0);
  const handleDevTap = () => {
    const next = devTaps + 1;
    setDevTaps(next);
    if (next >= 5) { onToggleSub(); setDevTaps(0); }
  };
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.menuDrawer} onPress={() => {}}>
          {/* Header */}
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>⬟ STARGATE</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.menuClose}>✕</Text></TouchableOpacity>
          </View>
          <View style={styles.menuDivider} />

          {/* Auth row */}
          {isSignedIn ? (
            <View style={styles.menuAuthRow}>
              <Text style={styles.menuAuthEmail} numberOfLines={1}>
                {user?.emailAddresses?.[0]?.emailAddress?.toUpperCase()}
              </Text>
              <TouchableOpacity onPress={() => { signOut(); onClose(); }} style={styles.menuSignOutBtn}>
                <Text style={styles.menuSignOutText}>SIGN OUT</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <SignInButton onClose={onClose} />
          )}

          <View style={styles.menuDivider} />

          {/* Clearance status */}
          <View style={styles.menuClearanceRow}>
            <Text style={styles.menuClearanceLabel}>OPERATIVE CLEARANCE</Text>
            <Text style={[styles.menuClearanceBadge, isSubscribed && { color: C.green }]}>
              {isSubscribed ? "● ACTIVE — FULL ACCESS" : "● RESTRICTED — GRILL FLAME ONLY"}
            </Text>
          </View>

          {/* Upgrade CTA — hidden when subscribed */}
          {!isSubscribed && (
            <TouchableOpacity style={styles.menuUpgradeBtn} onPress={() => { onClose(); onUpgrade(); }}>
              <Text style={styles.menuUpgradeBtnLabel}>EXPAND CLEARANCE</Text>
              <Text style={styles.menuUpgradeBtnSub}>Unlock all 12 protocols · Full target archive · Dossier</Text>
              <Text style={styles.menuUpgradeBtnCta}>[ UPGRADE TO STARGATE ]</Text>
            </TouchableOpacity>
          )}

          <View style={styles.menuDivider} />

          {/* Nav items */}
          <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onFieldManual(); }}>
            <Text style={styles.menuItemIcon}>◈</Text>
            <View>
              <Text style={styles.menuItemTitle}>FIELD MANUAL</Text>
              <Text style={styles.menuItemSub}>CRV methodology · Protocol guides · Resources</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onCRVManual(); }}>
            <Text style={styles.menuItemIcon}>⬟</Text>
            <View>
              <Text style={styles.menuItemTitle}>CRV MANUAL — 1986</Text>
              <Text style={styles.menuItemSub}>Declassified DIA training document · Paul H. Smith</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onDossier(); }}>
            <Text style={styles.menuItemIcon}>▣</Text>
            <View>
              <Text style={styles.menuItemTitle}>DOSSIER</Text>
              <Text style={styles.menuItemSub}>Session archive · Review past transmissions</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Footer / dev toggle */}
          <TouchableOpacity onPress={handleDevTap} activeOpacity={1}>
            <Text style={styles.menuVersion}>STARGATE v1.0 · psiop.io{devTaps > 0 ? ` · ${devTaps}` : ""}</Text>
          </TouchableOpacity>
          {isSubscribed && (
            <Text style={styles.menuDevNote}>DEV: subscription active</Text>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── UPGRADE MODAL ────────────────────────────────────────────────────────────
function UpgradeModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.upgradeOverlay}>
        <View style={styles.upgradeSheet}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>⬟ EXPAND CLEARANCE</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.menuClose}>✕</Text></TouchableOpacity>
          </View>
          <View style={styles.menuDivider} />

          <Text style={styles.upgradeTagline}>FULL ACCESS TO THE STARGATE PROGRAMME</Text>

          <View style={styles.upgradeFeatureList}>
            {[
              "All 12 viewer protocols",
              "315+ sealed targets — and growing",
              "Full Stage I–VI CRV structure",
              "ERV, ARV, Dream State & more",
              "Advanced Monitor AI evaluation",
              "Personal dossier & session archive",
              "PDF dossier export",
            ].map((f, i) => (
              <Text key={i} style={styles.upgradeFeature}>► {f}</Text>
            ))}
          </View>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.upgradePriceBtn}>
            <Text style={styles.upgradePriceBtnTitle}>[ MONTHLY ACCESS ]</Text>
            <Text style={styles.upgradePriceBtnPrice}>$19.99 / MONTH</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.upgradePriceBtn, styles.upgradePriceBtnAnnual]}>
            <Text style={styles.upgradePriceBtnTitle}>[ ANNUAL ACCESS ]  ★ BEST VALUE</Text>
            <Text style={styles.upgradePriceBtnPrice}>$99.99 / YEAR — SAVE 58%</Text>
          </TouchableOpacity>

          <Text style={styles.upgradeDisclaimer}>Payments handled securely via Stripe. Cancel anytime.</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.upgradeCancel}>[ CONTINUE WITH LIMITED ACCESS ]</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── CRV MANUAL SCREEN ───────────────────────────────────────────────────────
const CRV_MANUAL_PDF = "https://www.cia.gov/readingroom/docs/CIA-RDP96-00789R002200220001-4.pdf";
const CRV_MANUAL_READING_ROOM = "https://www.cia.gov/readingroom/collection/stargate";

const CRV_DOCUMENTS = [
  {
    key: "crv",
    badge: "⬟",
    title: "THE CONTROLLED REMOTE VIEWING MANUAL",
    subtitle: "STAGES I THROUGH VI",
    meta: ["Defense Intelligence Agency · May 1986", "Paul H. Smith · CW3, U.S. Army"],
    desc: "The primary training document of the Stargate programme. Written by Paul H. Smith and the unit's trained remote viewers, compiled from notes taken during training with Ingo Swann and printed at the DIA press in May 1986. Swann reviewed a copy and described it as comprehensive and accurate. The protocol this app is built on.",
    contents: [
      "Stage I — Ideogram and gestalt contact",
      "Stage II — Sensory data: texture, temperature, sound, smell, color",
      "Stage III — Dimensional data and sketching",
      "Stage IV — Analytical overlay (AOL) discipline and deep contact",
      "Stage V — Interrogation and enhanced perception",
      "Stage VI — 3D modeling and intelligence summary",
      "Monitor protocol and session management",
      "AOL/Drive identification and management",
      "Signal line theory and noise suppression",
      "Glossary of CRV terms and notation",
    ],
    ref: "CIA-RDP96-00789R002200220001-4",
    pdfUrl: "https://archive.org/details/cia-readingroom-document-cia-rdp96-00789r002200220001-4",
  },
  {
    key: "rvtp",
    badge: "◈",
    title: "A SUGGESTED REMOTE VIEWING TRAINING PROCEDURE",
    subtitle: "SUPPLEMENTAL TRAINING DOCUMENT",
    meta: ["Defense Intelligence Agency · December 1986", "Hubbard / Langford"],
    desc: "An 80-page supplemental training procedure document from December 1986, produced within the same DIA Stargate program. Provides additional structure and procedural guidance for remote viewing training alongside the core CRV manual.",
    contents: [
      "Supplemental training procedure overview",
      "Session setup and administrative protocol",
      "Viewer preparation and state induction",
      "Target handling and coordinate assignment",
      "Monitor role and feedback structure",
      "Training progression and evaluation criteria",
    ],
    ref: "CIA-RDP96-00789R002200070001-0",
    pdfUrl: "https://www.cia.gov/readingroom/docs/CIA-RDP96-00789R002200070001-0.pdf",
  },
];

function CRVManualScreen({ onBack, onMenuOpen }) {
  const [opening, setOpening] = useState(null);
  const [expanded, setExpanded] = useState("crv");

  const openDoc = async (url, key) => {
    setOpening(key);
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("LINK UNAVAILABLE", "Could not open the document. Check your connection and try again.");
    }
    setOpening(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TouchableOpacity onPress={onBack}><Text style={styles.backBtn}>← FIELD MANUAL</Text></TouchableOpacity>
          <TouchableOpacity onPress={onMenuOpen} style={styles.menuIconBtn}><Text style={styles.menuIcon}>≡</Text></TouchableOpacity>
        </View>
        <Text style={styles.headerLabel}>CIA CREST ARCHIVE // STARGATE PROGRAMME DOCUMENTS</Text>
        <Text style={styles.headerTitle}>DOCUMENT ARCHIVE</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Global stamp */}
        <View style={styles.crvStampCard}>
          <Text style={styles.crvStampClass}>THE CONTROLLED REMOTE VIEWING MANUAL</Text>
        </View>

        {CRV_DOCUMENTS.map((doc) => {
          const isOpen = expanded === doc.key;
          return (
            <View key={doc.key} style={[styles.crvDocCard, isOpen && styles.crvDocCardOpen]}>

              {/* Header row — tap to expand/collapse */}
              <TouchableOpacity style={styles.crvDocHeaderRow} onPress={() => setExpanded(isOpen ? null : doc.key)} activeOpacity={0.8}>
                <Text style={styles.crvDocBadge}>{doc.badge}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.crvDocSubtitle}>{doc.subtitle}</Text>
                  {doc.meta.map((m, i) => <Text key={i} style={styles.crvDocMeta}>{m}</Text>)}
                </View>
                <Text style={styles.crvChevron}>{isOpen ? "▲" : "▼"}</Text>
              </TouchableOpacity>

              {isOpen && (
                <>
                  <View style={styles.crvDocDivider} />
                  <Text style={styles.crvDocDesc}>{doc.desc}</Text>

                  <View style={[styles.crvCard, { marginTop: 10 }]}>
                    <Text style={styles.crvCardLabel}>DOCUMENT CONTENTS</Text>
                    {doc.contents.map((item, i) => (
                      <View key={i} style={styles.crvContentRow}>
                        <Text style={styles.crvContentDot}>►</Text>
                        <Text style={styles.crvContentText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.crvOpenBtn}
                    onPress={() => openDoc(doc.pdfUrl, doc.key)}
                    disabled={opening === doc.key}
                  >
                    {opening === doc.key
                      ? <ActivityIndicator color={C.bg} size="small" />
                      : <Text style={styles.crvOpenBtnText}>[ OPEN PDF — CIA READING ROOM ]</Text>
                    }
                  </TouchableOpacity>

                  <Text style={styles.crvCitationText}>{doc.ref}</Text>
                </>
              )}
            </View>
          );
        })}

        <TouchableOpacity style={styles.crvOpenBtnSecondary} onPress={() => openDoc(CRV_MANUAL_READING_ROOM, "archive")}>
          <Text style={styles.crvOpenBtnSecondaryText}>[ BROWSE FULL STARGATE ARCHIVE — CIA CREST ]</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── FIELD MANUAL DATA ────────────────────────────────────────────────────────
const FM_FIGURES = [
  { callsign: "VIEWER PRIME", name: "Joseph McMoneagle", years: "1950–present", role: "Remote Viewer No. 1 — U.S. Army Intelligence", summary: "McMoneagle was the program's most decorated operative, completing over 450 documented intelligence missions between 1978 and 1984. Awarded the Legion of Merit. Among his most cited sessions: accurately describing a classified Soviet submarine under construction far from water before it was launched, and providing descriptions of hostage locations in Iran. Trained extensively at the Monroe Institute using the Gateway Process.", books: ["Mind Trek (1993)", "Remote Viewing Secrets (2000)"], link: "https://en.wikipedia.org/wiki/Joseph_McMoneagle" },
  { callsign: "PROTOCOLS LEAD", name: "Ingo Swann", years: "1933–2013", role: "Protocol Architect — Stanford Research Institute", summary: "Swann coined the term 'remote viewing' and developed the Coordinate Remote Viewing (CRV) protocol — the structured, stage-based methodology that became the backbone of Stargate. A New York artist tested at SRI under Targ and Puthoff. His most famous claimed feat: describing the ring system of Jupiter before Voyager confirmed it in 1979. Swann insisted remote viewing was a trainable skill, not an innate gift.", books: ["Natural ESP (1987)", "Penetration (1998)"], link: "https://en.wikipedia.org/wiki/Ingo_Swann" },
  { callsign: "FIELD OPERATIVE", name: "Pat Price", years: "1918–1975", role: "Operational Viewer — CIA / SRI Program", summary: "A former Burbank police commissioner and natural psychic. His blind description of a Soviet underground installation at Semipalatinsk — including specific equipment, personnel, and structural details — was rated by CIA analysts as one of the most accurate sessions on record. Died suddenly in 1975 under circumstances that remain unexplained.", books: ["Documented in: Mind Reach (1977)"], link: "https://en.wikipedia.org/wiki/Pat_Price" },
  { callsign: "SIGNAL AMPLIFIER", name: "Uri Geller", years: "1946–present", role: "Psychic Subject — Stanford Research Institute", summary: "Tested at SRI by Targ and Puthoff in 1972–73, producing results described as statistically significant in controlled trials. Became the most publicly visible — and controversial — figure associated with the program. CIA declassified documents confirm he was tested under the early SCANATE program.", books: ["My Story (1975)", "The Geller Effect (1986)"], link: "https://en.wikipedia.org/wiki/Uri_Geller" },
  { callsign: "SRI RESEARCH LEAD", name: "Russell Targ & Hal Puthoff", years: "1934–present / 1936–present", role: "Research Scientists — Stanford Research Institute", summary: "Physicists who ran the original remote viewing research at SRI from 1972, funded by the CIA under SCANATE. Their landmark 1974 paper in Nature was one of the first peer-reviewed publications on remote viewing. Their book Mind Reach (1977) brought the research to public attention.", books: ["Mind Reach (1977)", "The Mind Race (1984)"], link: "https://en.wikipedia.org/wiki/Russell_Targ" },
];

const FM_RESOURCES = [
  // ── In-app readers ──────────────────────────────────────────────────────────
  { title: "DIA CRV Manual", author: "Paul H. Smith / DIA", year: "1986", type: "ARCHIVE", desc: "The 1986 Defense Intelligence Agency Controlled Remote Viewing training manual. The protocol this app is built on.", link: null, inApp: true },
  { title: "A Suggested Remote Viewing Training Procedure", author: "Hubbard / Langford / DIA", year: "1986", type: "ARCHIVE", desc: "Supplemental 80-page DIA training procedure document from December 1986. Additional structure and procedural guidance for remote viewing training.", link: null, inApp: true },

  // ── CIA Declassified Documents ───────────────────────────────────────────────
  { title: "Analysis and Assessment of Gateway Process", author: "Lt. Col. Wayne M. McDonnell / U.S. Army INSCOM", year: "1983", type: "CIA", desc: "The most widely circulated CIA document on the internet. Army INSCOM's formal analysis of the Monroe Institute's Hemi-Sync altered state induction technique — its neurological mechanics, theoretical basis, and applicability to remote viewing viewer preparation. Covers OBE, consciousness, transcendental meditation, and holographic brain theory.", ref: "CIA-RDP96-00788R001700210016-5", link: "https://archive.org/details/cia-readingroom-document-cia-rdp96-00788r001700210016-5" },
  { title: "Soviet and Czechoslovakian Parapsychology Research", author: "Defense Intelligence Agency", year: "1975", type: "CIA", desc: "The DIA intelligence assessment that directly triggered the U.S. program. Comprehensive survey of Soviet and Czech research into ESP, telepathy, psychokinesis, psychotronic generators, out-of-body phenomena, and Kirlian photography. The document that told Washington the Soviets were spending 60 million rubles annually on psychic warfare research.", ref: "CIA-RDP96-00787R000500420001-2", link: "https://archive.org/details/CIA-RDP96-00787R000500420001-2" },
  { title: "Star Gate Project: An Overview", author: "Defense Intelligence Agency", year: "1993", type: "CIA", desc: "Comprehensive internal program overview covering the full operational history of Stargate — viewer performance statistics, mission tasking examples including counternarcotics operations, the role of the Monroe Institute, and the program's organizational evolution from GRILL FLAME through CENTER LANE and SUN STREAK.", ref: "CIA-RDP96-00789R002800180001-2", link: "https://archive.org/details/cia-readingroom-document-cia-rdp96-00789r002800180001-2" },
  { title: "Coordinate Remote Viewing Technology 1981–1983", author: "Ingo Swann / SRI International", year: "1983", type: "CIA", desc: "Swann's own three-year briefing paper on the development of CRV methodology at SRI. Documents the evolution of the coordinate targeting system, the ideogram protocol, and the theoretical model underpinning the stages. The foundational document behind the CRV manual.", ref: "CIA-RDP96-00788R001100520001-3", link: "https://archive.org/details/CIA-RDP96-00788R001100520001-3" },
  { title: "Controlled Offensive Behavior — USSR", author: "Defense Intelligence Agency", year: "1972", type: "CIA", desc: "One of the earliest CIA/DIA assessments of Soviet research into psychoenergetics for offensive applications — mind control, behavior modification at range, and remote influence. The document that set the Cold War paranoia about Soviet psychic warfare in motion. Released 2003.", ref: "CIA-RDP96-00788R001300020001-6", link: "https://archive.org/details/cia-readingroom-document-cia-rdp96-00788r001300020001-6" },
  { title: "Soviet and East European Parapsychology Research", author: "DIA / NSA", year: "1975", type: "CIA", desc: "NSA and DIA joint assessment of parapsychology research programs across the Soviet Union and Eastern Bloc. Covers telepathy, psychokinesis, biocommunications, and the Soviet use of the term 'psychoenergetics' in place of parapsychology. Companion document to the Czech/Soviet survey.", ref: "NSA-RDP96X00790R000100010041-2", link: "https://www.cia.gov/readingroom/docs/NSA-RDP96X00790R000100010041-2.pdf" },
  { title: "Soviet Brief Bibliography — Parapsychology Literature", author: "CIA (Special Translation)", year: "1976", type: "CIA", desc: "CIA translation and bibliography of Soviet scientific literature on parapsychology, telepathy, psychotronics, psychokinesis, Kirlian photography, and bioenergy. Includes references to classified Soviet research journals unavailable in the West — a window into what Moscow was publishing internally.", ref: "CIA-RDP96-00787R000400010012-6", link: "https://archive.org/details/cia-readingroom-document-cia-rdp96-00787r000400010012-6" },
  { title: "An Evaluation of the Remote Viewing Program", author: "American Institutes for Research / CIA", year: "1995", type: "CIA", desc: "The AIR report commissioned by CIA that formally ended the program. Authored by statistician Jessica Utts (who found the results statistically significant) and psychologist Ray Hyman (who disputed them). The tension between their conclusions is the document's most interesting feature — the program was terminated despite evidence the effect was real.", ref: "CIA-RDP96-00791R000200180005-5", link: "https://archive.org/details/cia-readingroom-document-cia-rdp96-00791r000200180005-5" },
  { title: "CIA Remote Viewing Declassification Memo", author: "CIA Office of Research and Development", year: "1995", type: "CIA", desc: "Internal CIA memo from June 1995 preparing public affairs staff for media questions ahead of the program's declassification. Frank internal Q&A format — includes admissions about what was known, what was spent, and what the CIA believed. A rare glimpse at the institutional response to disclosure.", ref: "CIA-RDP96-00791R000100030062-7", link: "https://archive.org/details/cia-readingroom-document-cia-rdp96-00791r000100030062-7" },

  // ── Books ─────────────────────────────────────────────────────────────────────
  { title: "Mind Reach", author: "Russell Targ & Hal Puthoff", year: "1977", type: "BOOK", desc: "The foundational text from the SRI physicists who launched the program. Essential starting point.", link: "https://www.amazon.com/Mind-Reach-Scientists-Psychic-Abilities-Consciousness/dp/1571744142" },
  { title: "Remote Viewers: The Secret History", author: "Jim Schnabel", year: "1997", type: "BOOK", desc: "The most comprehensive journalistic account of Stargate. Hundreds of interviews with participants.", link: "https://www.amazon.com/Remote-Viewers-History-Americas-Psychic/dp/0440614058" },
  { title: "Reading the Enemy's Mind", author: "Paul H. Smith", year: "2005", type: "BOOK", desc: "Written by one of the program's primary CRV trainers. The most technically detailed account of how the structured protocol was developed and used.", link: "https://www.amazon.com/Reading-Enemys-Mind-Americas-Espionage/dp/0812578554" },
  { title: "Mind Trek", author: "Joseph McMoneagle", year: "1993", type: "BOOK", desc: "McMoneagle's first book — part memoir, part instructional. Describes his experiences as the program's most decorated viewer.", link: "https://www.amazon.com/Mind-Trek-Joseph-McMoneagle/dp/1937530787" },
  { title: "The Reality of ESP", author: "Russell Targ", year: "2012", type: "BOOK", desc: "Targ's definitive late-career argument for the scientific validity of remote perception. Includes extensive declassified transcripts.", link: "https://www.amazon.com/Reality-ESP-Physicists-Psychic-Abilities/dp/0835608840" },
  { title: "The Men Who Stare at Goats", author: "Jon Ronson", year: "2004", type: "BOOK", desc: "Gonzo investigation into psychic soldier programs. Dark, funny, and stranger than fiction.", link: "https://www.amazon.com/Men-Who-Stare-Goats/dp/1439181772" },
  { title: "Psychic Warrior", author: "David Morehouse", year: "1996", type: "BOOK", desc: "Memoir by a former U.S. Army remote viewer. Describes his training, sessions, and psychological aftermath.", link: "https://www.amazon.com/Psychic-Warrior-Americas-Foremost-Top-Secret/dp/0312964137" },
  { title: "The Conscious Universe", author: "Dean Radin", year: "1997", type: "BOOK", desc: "Comprehensive meta-analysis of psi research including remote viewing. Statistically rigorous and widely cited.", link: "https://www.amazon.com/Conscious-Universe-Scientific-Psychic-Phenomena/dp/0061778990" },
  { title: "The Star Gate Archives (4 vols.)", author: "Edwin C. May & Sonali Bhatt Marwaha", year: "2018", type: "BOOK", desc: "Four-volume academic collection of the primary research documents. The most authoritative scholarly resource.", link: "https://www.amazon.com/s?k=star+gate+archives+edwin+may+mcfarland" },

  // ── Films ─────────────────────────────────────────────────────────────────────
  { title: "Third Eye Spies", author: "Lance Mungia (dir.)", year: "2019", type: "FILM", desc: "Documentary featuring Targ, Puthoff, Swann, and CIA officers. The definitive film on the program.", link: "https://www.imdb.com/title/tt5112424/" },
  { title: "The Reality of Remote Viewing (Banned TEDx)", author: "Russell Targ", year: "2013", type: "FILM", desc: "Targ's TEDx talk, pulled before broadcast. Presents the statistical case for remote viewing. 7M+ YouTube views.", link: "https://www.youtube.com/watch?v=hBl0cwyn5GY" },
  { title: "Phenomena", author: "Netflix", year: "2023", type: "FILM", desc: "Spanish documentary examining government-funded parapsychology research, including remote viewing.", link: "https://www.netflix.com/title/81444229" },

  // ── Archives ──────────────────────────────────────────────────────────────────
  { title: "Stargate Project — CIA CREST Archive", author: "CIA / National Archives", year: "1995–2017", type: "ARCHIVE", desc: "12 million pages of declassified documents. Raw session transcripts, Monitor evaluations, target packages.", link: "https://www.cia.gov/readingroom/collection/stargate" },
  { title: "Monroe Institute — Gateway Process", author: "Monroe Institute", year: "1983–present", type: "ARCHIVE", desc: "The altered state preparation protocol used by program viewers. Binaural beat technology for state induction.", link: "https://www.monroeinstitute.org/" },
];

const FM_TIMELINE = [
  { year: "1970", event: "CIA becomes aware of Soviet 'psychotronic' research. Estimated Soviet spend: 60 million rubles/year. SCANATE program initiated." },
  { year: "1972", event: "Remote viewing research begins at Stanford Research Institute (SRI). Early subjects include Ingo Swann, who coins the term and begins developing the CRV protocol." },
  { year: "1973", event: "Uri Geller tested at SRI. Results described as statistically significant in controlled conditions. CIA documents this as early SCANATE data." },
  { year: "1974", event: "SRI researchers publish in Nature — one of the first peer-reviewed papers on remote viewing. Pat Price produces famous blind description of Soviet underground facility at Semipalatinsk." },
  { year: "1975", event: "Pat Price dies suddenly. Program loses its most operationally active viewer. GONDOLA WISH expands Army involvement." },
  { year: "1977", event: "'Mind Reach' published by Targ & Puthoff. Program now operating as GRILL FLAME." },
  { year: "1978", event: "Army veteran Joseph McMoneagle joins as Viewer No. 1. Program relocates to classified Army installation and becomes CENTER LANE." },
  { year: "1979", event: "Ingo Swann claims a session accurately described Jupiter's ring system before Voyager confirmed it. McMoneagle describes a Soviet submarine under construction far from water — later confirmed." },
  { year: "1983", event: "Monroe Institute Gateway Process adopted for viewer preparation. Program renamed SUN STREAK." },
  { year: "1984", event: "McMoneagle awarded Legion of Merit. Program at peak operation with 7 full-time viewers. Renamed STARGATE." },
  { year: "1990", event: "CIA resumes direct oversight. Program reduced to 3 full-time viewers. Cold War winds down; funding pressure increases." },
  { year: "1995", event: "CIA commissions AIR review. Program officially terminated and declassified. 23 years of data released." },
  { year: "2017", event: "CIA publishes 12 million pages of STARGATE documents online via CREST archive. Full session transcripts become publicly accessible." },
];

const FM_PROTOCOL_DETAIL = {
  "RV-001": { badge: "⬟", name: "COORDINATE TARGETING", callsign: "VIEWER PRIME", overview: "The foundational CRV protocol. Developed at Stanford Research Institute in the 1970s under Targ and Puthoff. The viewer is given only geographic coordinates — no map, no image, no context — and asked to perceive the location blind. This is the purest test of the signal line.", stages: ["IDEOGRAM — First spontaneous gestalt impression of the coordinate.", "SENSORY DATA — Temperature, texture, sound, smell, color. No nouns.", "DIMENSIONAL SKETCH — Spatial layout, geometry, height, depth.", "AOL BREAK / DEEP CONTACT — Declare overlays, then penetrate beneath them.", "INTERROGATE — Active probing of function, occupants, activity, threat.", "INTELLIGENCE SUMMARY — Full session compiled into an operational report."], note: "Pat Price's blind session on the Soviet facility at Semipalatinsk was rated by CIA analysts as one of the most accurate sessions in the program's history. He had only coordinates." },
  "RV-002": { badge: "◈", name: "DEEP TIME", callsign: "PROTOCOLS LEAD", overview: "Temporal displacement viewing. The viewer is tasked not to a location but to a point in time. AOL here is not just visual assumption — it is historical knowledge itself, which must be actively set aside.", stages: ["TEMPORAL GESTALT — First impression of the era, its atmosphere and energy.", "ENVIRONMENTAL DATA — Physical world as it exists at that moment in time.", "CIVILIZATION SKETCH — What humans or other beings have built at this period.", "AOL BREAK / TEMPORAL DEPTH — Declare historical knowledge, then perceive beyond it.", "EVENT INTERROGATION — What specific event drew the tasking?", "HISTORICAL DEBRIEF — Full session compiled into a coherent temporal account."], note: "Ingo Swann described the ring system of Jupiter before Voyager confirmed it in 1979. He was given coordinates in space, not a planet name." },
  "RV-003": { badge: "⬡", name: "EMOTIONAL / HUMAN", callsign: "FIELD OPERATIVE", overview: "Human intelligence targeting. The viewer is directed at a specific person or group — their location, emotional state, intent, and behavior. The most interpersonally sensitive protocol, and the most prone to projection.", stages: ["PRESENCE CONTACT — First impression of the subject's energy, state, movement.", "EMOTIONAL FIELD — Dominant and suppressed emotions surrounding the subject.", "PHYSICAL IMPRESSION — Environment, appearance, activity, immediate surroundings.", "AOL BREAK / DEEP INTENT — Release preconceptions. Perceive actual motivation.", "INTERROGATE INTENT — What does this person want? What are they hiding?", "HUMAN INTELLIGENCE SUMMARY — State, intent, threat level, location if perceivable."], note: "Operational HUMINT sessions included blind targeting of hostages in Iran, Soviet military personnel, and unidentified subjects from photographs. Emotional data was often rated more reliable than spatial data." },
  "RV-004": { badge: "◇", name: "ANOMALOUS / SUBSPACE", callsign: "SIGNAL AMPLIFIER", overview: "Anomalous phenomena targeting. Designed for targets that do not conform to ordinary physical categories — UAP events, non-human intelligence, classified phenomena. The viewer's mind will attempt to label what it encounters using known frameworks. That labeling is the enemy.", stages: ["ANOMALY CONTACT — First impression of the phenomenon. Do not rationalize.", "FIELD PERCEPTION — Energetic, electromagnetic, and environmental effects.", "FORM AND ORIGIN — Shape, structure, apparent point of origin, presence of intelligence.", "AOL BREAK / SUBSPACE CONTACT — Declare frameworks, move beneath them.", "INTERROGATE THE UNKNOWN — Purpose, origin, intent, what is being concealed.", "ANOMALOUS INTELLIGENCE REPORT — All impressions including those that defy explanation."], note: "Uri Geller's SRI trials in 1972–73 included targets that researchers described as genuinely anomalous. CIA declassified files confirm he was tested at the boundary of what the protocol was designed to handle." },
  "RV-005": { badge: "▽", name: "SUBSPACE / CONCEALED", callsign: "SUBSURFACE ANALYST", overview: "Concealed intelligence targeting. The viewer is directed at something deliberately hidden. The target is defined by its concealment — and the suppression layer is a feature of the target, not an obstacle.", stages: ["SURFACE LAYER — First impression of the concealment itself.", "SUPPRESSION FIELD — Who maintains the concealment? What does it feel like from inside?", "PENETRATION — Move beneath the surface. What shape does the hidden thing take?", "AOL BREAK / DISINFORMATION FILTER — Declare narrative overlays.", "INTERROGATE THE CONCEALED — Why is it buried? Who benefits?", "COUNTERINTELLIGENCE SUMMARY — What was hidden, how, by whom."], note: "GONDOLA WISH sessions were explicitly tasked against buried Soviet installations. The premise that concealment is itself perceivable was operationally validated." },
  "RV-006": { badge: "◉", name: "PSYCHOMETRIC CONTACT", callsign: "PSYCHOMETRIST", overview: "Object and place memory targeting. Physical matter retains informational and emotional residue from significant events. The psychometrist makes contact with that residue and reads backward through time along event layers.", stages: ["FIRST CONTACT IMPRESSION — Dominant charge of the object or place.", "SURFACE RESIDUE — Most recent significant event this place or object remembers.", "LAYERED TIME — Older impressions. How many event layers are present?", "AOL BREAK / HISTORICAL FILTER — Declare known history, return to direct impression.", "INTERROGATE THE RESIDUE — Most significant event stored here.", "FORENSIC DEBRIEF — Timeline of events, key figures, chronology."], note: "Psychometric sessions were used forensically — given objects or photographs with no identifying information. Some of the highest-rated sessions involved objects whose histories could be verified against classified records." },
  "RV-007": { badge: "∞", name: "ERV — EXTENDED REMOTE VIEWING", callsign: "DEEP OPERATIVE", overview: "The unstructured counterpart to CRV. The viewer descends into a deeply relaxed, near-hypnagogic state and allows the signal to flow without imposed structure. ERV was used operationally for complex targets where CRV felt too constraining.", stages: ["PHASE I — STATE INDUCTION. Analytical awareness recedes. Record what arises.", "PHASE II — FREE SIGNAL STREAM. Open to the target without structure.", "PHASE III — DEEP CONTACT. Extend contact with the strongest impression.", "PHASE IV — INTEGRATION. Review the stream. What was signal? What was noise?"], note: "ERV was the preferred mode for some of the program's most experienced viewers. The Monroe Institute's Gateway Process was used to induce and stabilize the required altered states." },
  "RV-008": { badge: "⊗", name: "ARV — ASSOCIATIVE REMOTE VIEWING", callsign: "ORACLE ANALYST", overview: "Associative Remote Viewing is designed for binary outcome prediction. The viewer perceives an associative image pre-linked to a future outcome rather than the outcome directly. This sidesteps direct future perception by converting outcome into object.", stages: ["OUTCOME CONTACT — First impression of the associative image.", "IMAGE ATTRIBUTES — Texture, colour, weight, movement, emotional tone.", "EMOTIONAL FIELD — Does the image feel open or closed? Like arrival or obstruction?", "AOL BREAK / SIGNAL CLARITY — Strip away wish and fear.", "BINARY ASSESSMENT — Which outcome image does your signal most closely resemble?", "ARV SUMMARY — Image, attributes, emotional field, binary outcome assessment."], note: "Russell Targ and Keith Harary conducted ARV experiments in the 1980s that reportedly generated significant positive returns in silver futures trading over a series of trials." },
  "RV-009": { badge: "☽", name: "DREAM STATE", callsign: "DREAM ARCHITECT", overview: "Dream state viewing uses the hypnagogic threshold and REM sleep as the access mode. Perception is inherently symbolic — the target is encoded in dream imagery and archetype. The discipline is translation.", stages: ["THRESHOLD CROSSING — Hypnagogic state entry. Record all fragments and symbols.", "DREAM FIELD ENTRY — Allow the dream to orient around the coordinate.", "SYMBOLIC LAYER — What symbols and archetypes appear?", "DIRECT PERCEPTION — What literal details cut through the symbolic encoding?", "DREAM INTERROGATION — Ask the target a direct question. Follow the response.", "DREAM DEBRIEF — Threshold imagery, symbols, direct data, assessment."], note: "The Maimonides Medical Center dream telepathy experiments (1964–1979) produced statistically significant results across hundreds of trials. This research preceded and informed Stargate's interest in altered state access modes." },
  "RV-010": { badge: "⊕", name: "COLLECTIVE FIELD", callsign: "FIELD RESONATOR", overview: "Collective field viewing targets the shared emotional field of a mass event — an election, a disaster, a war. The viewer tunes not to any individual within the field but to the field itself — its dominant emotion, coherence level, and directional momentum.", stages: ["FIELD CONTACT — Dominant quality of the shared field. Coherent or fragmented?", "EMOTIONAL TOPOLOGY — Map the field. Where is the intensity?", "DOMINANT SIGNAL — What single emotion is most coherent across the mass?", "AOL BREAK / FIELD CLARITY — Release political narrative. Return to raw field.", "TRAJECTORY ASSESSMENT — Is this field building, dissipating, or transforming?", "COLLECTIVE FIELD REPORT — Quality, topology, dominant signal, projected outcome."], note: "Global Consciousness Project research at Princeton has documented statistically significant correlations between major mass events and random number generator deviations." },
  "RV-011": { badge: "◬", name: "GEOGRAPHIC SURVEY", callsign: "TERRAIN OPERATIVE", overview: "Geographic survey viewing applies remote viewing methodology to large-scale terrain and environmental mapping. The viewer approaches from altitude, descends to surface level, then penetrates subsurface to identify geological structures and anomalies.", stages: ["APPROACH — Large-scale impression from altitude. Landmass, water, colour, scale.", "SURFACE DATA — Terrain at ground level. Geology, climate, sensory environment.", "SUBSURFACE PROBE — Below the surface. Cavities, water, geological structures.", "AOL BREAK / DIRECT PERCEPTION — Declare geographic knowledge.", "ANOMALY IDENTIFICATION — What is unusual here?", "SURVEY REPORT — Terrain, subsurface, anomalies, significance."], note: "Early Stargate sessions included geographic surveys of Soviet missile sites and underground facilities. In documented cases, viewer-described underground structures were confirmed by satellite inspection." },
  "RV-012": { badge: "⟶", name: "SIGNAL TRACE", callsign: "SIGNAL TRACER", overview: "Signal trace viewing targets a subject in active motion — a person, object, or phenomenon whose current position is unknown. The viewer locks onto a movement vector and tracks it across time and space.", stages: ["LOCK ON — Direction and quality of movement.", "CURRENT ENVIRONMENT — Where is the target right now?", "TEMPORAL TRACE — Where were they 6 hours ago? What does the path reveal?", "AOL BREAK / SIGNAL LOCK — Release target assumptions.", "PROJECTED DESTINATION — Where is this trajectory terminating?", "TRACKING REPORT — Origin, current position, projected destination, confidence."], note: "Some of the program's most operationally sensitive sessions involved tracking moving subjects — both human assets and unidentified aerial phenomena." },
};

// ─── FIELD MANUAL SCREEN ──────────────────────────────────────────────────────
function FieldManualScreen({ onBack, onMenuOpen, onUpgrade, onCRVManual }) {
  const [section, setSection] = useState("what");
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [resourceFilter, setResourceFilter] = useState("ALL");
  const scrollRef = useRef(null);

  const sections = [
    { id: "what", label: "WHAT IS THIS" },
    { id: "how", label: "HOW IT WORKS" },
    { id: "protocols", label: "PROTOCOLS" },
    { id: "uses", label: "USE CASES" },
    { id: "figures", label: "KEY FIGURES" },
    { id: "resources", label: "RESOURCES" },
    { id: "timeline", label: "TIMELINE" },
  ];

  const changeSection = (id) => {
    setSection(id);
    setSelectedProtocol(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TouchableOpacity onPress={onBack}><Text style={styles.backBtn}>← BACK</Text></TouchableOpacity>
          <TouchableOpacity onPress={onMenuOpen} style={styles.menuIconBtn}><Text style={styles.menuIcon}>≡</Text></TouchableOpacity>
        </View>
        <Text style={styles.headerLabel}>RESTRICTED REFERENCE ARCHIVE</Text>
        <Text style={styles.headerTitle}>FIELD MANUAL</Text>
      </View>

      {/* Section tabs — horizontal scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fmTabBar} contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}>
        {sections.map(s => (
          <TouchableOpacity key={s.id} onPress={() => changeSection(s.id)} style={[styles.fmTab, section === s.id && styles.fmTabActive]}>
            <Text style={[styles.fmTabText, section === s.id && styles.fmTabTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* WHAT IS THIS */}
        {section === "what" && (
          <View style={{ marginTop: 12 }}>
            <View style={styles.fmLeadCard}>
              <Text style={styles.fmLeadTitle}>STARGATE is a remote viewing training and simulation platform.</Text>
              <Text style={styles.fmLeadBold}>Remote viewing is a skill. Like any skill, it can be developed.</Text>
              <Text style={styles.fmBody}>{"Think of it like being an artist. A great choreographer might never paint like Michelangelo — but if they pick up a brush and practice seriously, they will get better. They will surprise themselves. They may even produce work that astonishes them. The ceiling varies. The floor moves every time you practice.\n\nRemote viewing works the same way. Everyone who approaches it seriously improves. What separates good viewers from poor ones is rarely talent — it is discipline, repetition, and honesty about what came from the signal versus what came from the mind filling in the gaps."}</Text>
            </View>
            <View style={styles.fmCard}>
              <Text style={styles.fmSectionLabel}>WHAT THIS IS BUILT ON</Text>
              <Text style={styles.fmBody}>{"STARGATE is built on the actual methodology developed during a classified U.S. government psychoenergetics research program that ran from 1972 to 1995. The program employed trained military and civilian remote viewers to gather intelligence on targets conventional methods could not access.\n\nThe program has been fully declassified. The session transcripts, training manuals, and research papers are part of the public record via the CIA's CREST archive. What you practice here is the same protocol they used — not a simulation of it."}</Text>
            </View>
            <View style={[styles.fmCard, { borderLeftWidth: 3, borderLeftColor: C.amber }]}>
              <Text style={styles.fmSectionLabel}>THE HONEST TRUTH ABOUT WHAT TO EXPECT</Text>
              <Text style={styles.fmBody}>{"Your first sessions will probably be messy. Analytical overlay — the mind's tendency to label and guess — will intrude constantly. That is normal.\n\nOver time, if you practice consistently, you will notice something shift. Impressions will arrive faster, more cleanly, before the analytical mind can interfere. You will start to recognize what signal feels like — different from imagination, different from guessing. That distinction is the whole game."}</Text>
            </View>
            {[
              { icon: "◈", title: "STRUCTURED PROTOCOL", desc: "Every session follows a rigorous stage framework used by trained program viewers. No guesswork. The protocol is the practice." },
              { icon: "⬟", title: "AI MONITOR", desc: "MONITOR evaluates each stage in real time — signal quality, AOL contamination, intelligence value. Specific feedback after every transmission." },
              { icon: "⬡", title: "BLIND TARGETING", desc: "Targets are completely sealed — assigned by coordinate, temporal marker, or reference code only. True operational conditions." },
              { icon: "◇", title: "PERSONAL ARCHIVE", desc: "Every completed session is saved to your dossier. Watch your signal line develop. The archive is your training record." },
            ].map(c => (
              <View key={c.title} style={styles.fmMiniCard}>
                <Text style={styles.fmMiniIcon}>{c.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fmMiniTitle}>{c.title}</Text>
                  <Text style={styles.fmMiniBody}>{c.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* HOW IT WORKS */}
        {section === "how" && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.fmIntro}>A STARGATE session follows a defined operational sequence. Each step is deliberate.</Text>
            {[
              { n: "01", title: "SELECT SESSION PROTOCOL", desc: "Choose from 12 session protocols, each built around a distinct collection mode. Your protocol determines the type of targets you receive, the stage structure you work with, and the Monitor AI persona evaluating your session." },
              { n: "02", title: "RECEIVE YOUR MISSION BRIEFING", desc: "You are assigned a sealed target — a coordinate, a temporal marker, a subject designation, an anomaly reference, or an object designation. No description. No image. No context beyond the reference code." },
              { n: "03", title: "ENTER THE SESSION", desc: "Work through all six CRV stages in sequence. Do not skip stages. Each stage accesses progressively deeper layers of target contact — from raw gestalt impression to detailed analytical data." },
              { n: "04", title: "TRANSMIT TO MONITOR", desc: "After each stage, submit your data to MONITOR — the AI session handler. MONITOR evaluates your signal quality, flags analytical overlays, and assesses the intelligence value of your data." },
              { n: "05", title: "CLOSE THE SESSION", desc: "After Stage VI, receive your full debrief report. MONITOR compiles all stage data into a final intelligence assessment. Your session is archived in your personal dossier." },
            ].map(step => (
              <View key={step.n} style={styles.fmStepCard}>
                <Text style={styles.fmStepNumber}>{step.n}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fmStepTitle}>{step.title}</Text>
                  <Text style={styles.fmStepBody}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PROTOCOLS */}
        {section === "protocols" && !selectedProtocol && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.fmIntro}>12 distinct collection protocols. Each built around a different mode of non-local perception.</Text>
            {Object.entries(FM_PROTOCOL_DETAIL).map(([id, p]) => (
              <TouchableOpacity key={id} style={styles.fmProtocolRow} onPress={() => setSelectedProtocol(id)}>
                <Text style={styles.fmProtocolBadge}>{p.badge}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fmProtocolId}>{id}</Text>
                  <Text style={styles.fmProtocolName}>{p.name}</Text>
                  <Text style={styles.fmProtocolCallsign}>{p.callsign}</Text>
                </View>
                <Text style={styles.fmProtocolChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* PROTOCOL DETAIL */}
        {section === "protocols" && selectedProtocol && (() => {
          const p = FM_PROTOCOL_DETAIL[selectedProtocol];
          return (
            <View style={{ marginTop: 12 }}>
              <TouchableOpacity onPress={() => setSelectedProtocol(null)} style={{ marginBottom: 12 }}>
                <Text style={styles.fmBackLink}>← ALL PROTOCOLS</Text>
              </TouchableOpacity>
              <View style={styles.fmLeadCard}>
                <Text style={styles.fmProtocolDetailBadge}>{p.badge}</Text>
                <Text style={styles.fmProtocolDetailId}>{selectedProtocol}</Text>
                <Text style={styles.fmProtocolDetailName}>{p.name}</Text>
                <Text style={styles.fmProtocolDetailCallsign}>{p.callsign}</Text>
              </View>
              <View style={styles.fmCard}>
                <Text style={styles.fmSectionLabel}>OVERVIEW</Text>
                <Text style={styles.fmBody}>{p.overview}</Text>
              </View>
              <View style={styles.fmCard}>
                <Text style={styles.fmSectionLabel}>SESSION STAGES</Text>
                {p.stages.map((s, i) => (
                  <View key={i} style={styles.fmStageRow}>
                    <Text style={styles.fmStageNum}>S-{["I","II","III","IV","V","VI"][i] || (i+1)}</Text>
                    <Text style={styles.fmStageText}>{s}</Text>
                  </View>
                ))}
              </View>
              <View style={[styles.fmCard, { borderLeftWidth: 3, borderLeftColor: C.amber }]}>
                <Text style={styles.fmSectionLabel}>HISTORICAL NOTE</Text>
                <Text style={styles.fmBody}>{p.note}</Text>
              </View>
            </View>
          );
        })()}

        {/* USE CASES */}
        {section === "uses" && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.fmIntro}>STARGATE has been designed to serve a wide range of practitioners and purposes.</Text>
            {[
              { icon: "⬟", title: "PERSONAL SIGNAL DEVELOPMENT", protocols: ["COORD TARGETING", "ERV"], desc: "Use STARGATE as a structured daily or weekly practice. Track your accuracy over time. Identify your signal strengths and AOL patterns. The dossier archives every session — over time, it becomes a map of your mind's signal profile." },
              { icon: "◈", title: "MEDITATION & ALTERED STATE WORK", protocols: ["ERV", "DREAM STATE"], desc: "The CRV protocol produces a non-analytical state adjacent to deep meditative absorption. ERV and Dream State require genuine altered state entry. Many practitioners report that consistent STARGATE practice deepens their broader contemplative work." },
              { icon: "⬡", title: "CREATIVE & GENERATIVE APPLICATIONS", protocols: ["PSYCHOMETRIC", "COLLECTIVE FIELD", "DEEP TIME"], desc: "Writers, artists, and designers use remote viewing as a source of raw, unfiltered material that bypasses the inner critic. Session a location that doesn't exist yet. View a character before you write them. The signal generates material the analytical mind cannot." },
              { icon: "⊗", title: "FORECASTING & OUTCOME ASSESSMENT", protocols: ["ARV — ASSOCIATIVE", "SIGNAL TRACE", "COLLECTIVE FIELD"], desc: "ARV was used with documented positive results for financial forecasting and binary outcome prediction. Collective Field allows assessment of mass event trajectories. Signal Trace extends perception to moving targets." },
              { icon: "◉", title: "FORENSIC & HISTORICAL INVESTIGATION", protocols: ["PSYCHOMETRIC", "DEEP TIME", "SUBSPACE / CONCEALED"], desc: "Access the residue of events embedded in objects, places, and time. Read backward through history along event layers. Penetrate suppressed information from the inside out. These protocols were used operationally for forensic intelligence." },
              { icon: "◬", title: "GEOGRAPHIC & TERRAIN INTELLIGENCE", protocols: ["GEOGRAPHIC SURVEY", "COORD TARGETING"], desc: "Survey inaccessible, unmapped, or anomalous locations without satellite data. Identify subsurface structures and geological features. Replicate the program's original mandate." },
            ].map(u => (
              <View key={u.title} style={styles.fmCard}>
                <Text style={styles.fmUseCaseTitle}>{u.icon}  {u.title}</Text>
                <View style={styles.fmTagRow}>
                  {u.protocols.map(pr => <Text key={pr} style={styles.fmTag}>{pr}</Text>)}
                </View>
                <Text style={styles.fmBody}>{u.desc}</Text>
              </View>
            ))}
          </View>
        )}

        {/* KEY FIGURES */}
        {section === "figures" && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.fmIntro}>The following individuals are real historical figures documented in declassified U.S. government records and peer-reviewed research.</Text>
            {FM_FIGURES.map(fig => (
              <View key={fig.name} style={styles.fmCard}>
                <Text style={styles.fmFigureCallsign}>PROGRAM CALLSIGN: {fig.callsign}</Text>
                <Text style={styles.fmFigureName}>{fig.name}</Text>
                <Text style={styles.fmFigureRole}>{fig.role} · {fig.years}</Text>
                <View style={styles.fmDivider} />
                <Text style={styles.fmBody}>{fig.summary}</Text>
                <View style={styles.fmDivider} />
                <Text style={styles.fmSectionLabel}>NOTABLE WORKS</Text>
                <View style={styles.fmTagRow}>
                  {fig.books.map(b => <Text key={b} style={styles.fmTag}>{b}</Text>)}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* RESOURCES */}
        {section === "resources" && (
          <View style={{ marginTop: 12 }}>
            {/* Featured: CRV Manual */}
            <TouchableOpacity style={styles.crvFeaturedCard} onPress={onCRVManual}>
              <View style={{ flex: 1 }}>
                <Text style={styles.crvFeaturedLabel}>DIA DOCUMENT ARCHIVE · 2 DOCUMENTS</Text>
                <Text style={styles.crvFeaturedTitle}>STARGATE TRAINING DOCUMENTS</Text>
                <Text style={styles.crvFeaturedAuthor}>Defense Intelligence Agency · 1986</Text>
                <Text style={styles.crvFeaturedDesc}>The primary CRV manual and supplemental training procedure — the complete DIA documentation of the Stargate remote viewing methodology. Read both in-app.</Text>
              </View>
              <Text style={styles.crvFeaturedCta}>[ READ IN-APP ]</Text>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }} contentContainerStyle={{ gap: 6, paddingHorizontal: 0 }}>
              {["ALL", "CIA", "BOOK", "FILM", "ARCHIVE"].map(f => (
                <TouchableOpacity key={f} onPress={() => setResourceFilter(f)} style={[styles.fmTab, resourceFilter === f && styles.fmTabActive]}>
                  <Text style={[styles.fmTabText, resourceFilter === f && styles.fmTabTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {FM_RESOURCES.filter(r => resourceFilter === "ALL" || r.type === resourceFilter).map(r => (
              r.inApp ? (
                <TouchableOpacity key={r.title} style={[styles.fmCard, { borderColor: C.amber, borderLeftWidth: 3, borderLeftColor: C.amber }]} onPress={onCRVManual}>
                  <View style={styles.fmResourceHeader}>
                    <Text style={styles.fmResourceType}>{r.type} · IN-APP</Text>
                    <Text style={styles.fmResourceYear}>{r.year}</Text>
                  </View>
                  <Text style={styles.fmResourceTitle}>{r.title} ↗</Text>
                  <Text style={styles.fmResourceAuthor}>{r.author}</Text>
                  <Text style={[styles.fmBody, { marginTop: 8 }]}>{r.desc}</Text>
                  <Text style={{ color: C.amber, fontSize: 10, letterSpacing: 2, marginTop: 10, fontWeight: "900" }}>[ OPEN IN-APP READER ]</Text>
                </TouchableOpacity>
              ) : r.link ? (
                <TouchableOpacity key={r.title} style={[styles.fmCard, r.type === "CIA" && { borderLeftWidth: 2, borderLeftColor: "rgba(240,192,64,0.3)" }]} onPress={() => Linking.openURL(r.link)} activeOpacity={0.75}>
                  <View style={styles.fmResourceHeader}>
                    <Text style={styles.fmResourceType}>{r.type}</Text>
                    <Text style={styles.fmResourceYear}>{r.year}</Text>
                  </View>
                  <Text style={styles.fmResourceTitle}>{r.title}</Text>
                  <Text style={styles.fmResourceAuthor}>{r.author}</Text>
                  <Text style={[styles.fmBody, { marginTop: 8 }]}>{r.desc}</Text>
                  {r.ref && <Text style={styles.fmResourceRef}>{r.ref}</Text>}
                  <Text style={styles.fmResourceLink}>[ VIEW → ]</Text>
                </TouchableOpacity>
              ) : (
                <View key={r.title} style={styles.fmCard}>
                  <View style={styles.fmResourceHeader}>
                    <Text style={styles.fmResourceType}>{r.type}</Text>
                    <Text style={styles.fmResourceYear}>{r.year}</Text>
                  </View>
                  <Text style={styles.fmResourceTitle}>{r.title}</Text>
                  <Text style={styles.fmResourceAuthor}>{r.author}</Text>
                  <Text style={[styles.fmBody, { marginTop: 8 }]}>{r.desc}</Text>
                </View>
              )
            ))}
          </View>
        )}

        {/* TIMELINE */}
        {section === "timeline" && (
          <View style={{ marginTop: 12, paddingLeft: 20 }}>
            <View style={styles.fmTimelineLine} />
            {FM_TIMELINE.map((item, i) => (
              <View key={i} style={styles.fmTimelineItem}>
                <View style={styles.fmTimelineDot} />
                <Text style={styles.fmTimelineYear}>{item.year}</Text>
                <Text style={styles.fmTimelineEvent}>{item.event}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── DOSSIER SCREEN ───────────────────────────────────────────────────────────
function DossierScreen({ onBack, onMenuOpen, sessionCount }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const raw = await AsyncStorage.getItem("sg_sessions");
      if (raw) setSessions(JSON.parse(raw));
    } catch {}
    setLoading(false);
  };

  const clearAll = () => {
    Alert.alert(
      "PURGE ARCHIVE",
      "All session records will be permanently destroyed. This cannot be undone.",
      [
        { text: "CANCEL", style: "cancel" },
        {
          text: "PURGE", style: "destructive", onPress: async () => {
            await AsyncStorage.removeItem("sg_sessions").catch(() => {});
            await AsyncStorage.setItem("sg_session_count", "0").catch(() => {});
            setSessions([]);
          }
        }
      ]
    );
  };

  const protocols = [...new Set(sessions.map(s => s.protocolId))];
  const avgStages = sessions.length
    ? (sessions.reduce((a, s) => a + (s.stagesCompleted || 0), 0) / sessions.length).toFixed(1)
    : "—";
  const mostUsed = sessions.length
    ? Object.entries(sessions.reduce((acc, s) => { acc[s.protocolId] = (acc[s.protocolId] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TouchableOpacity onPress={onBack}><Text style={styles.backBtn}>← BACK</Text></TouchableOpacity>
          <TouchableOpacity onPress={onMenuOpen} style={styles.menuIconBtn}><Text style={styles.menuIcon}>≡</Text></TouchableOpacity>
        </View>
        <Text style={styles.headerLabel}>PERSONAL INTELLIGENCE ARCHIVE</Text>
        <Text style={styles.headerTitle}>DOSSIER</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={[styles.dossierEmptyCard, { marginTop: 32 }]}>
            <ActivityIndicator color={C.amber} size="small" />
            <Text style={[styles.dossierEmptyBody, { marginTop: 10 }]}>ACCESSING ARCHIVE...</Text>
          </View>
        ) : sessions.length === 0 ? (
          <View style={styles.dossierEmptyCard}>
            <Text style={styles.dossierEmptyIcon}>▣</Text>
            <Text style={styles.dossierEmptyTitle}>ARCHIVE EMPTY</Text>
            <Text style={styles.dossierEmptyBody}>{"No sessions on record.\n\nComplete your first remote viewing session\nto begin building your intelligence archive."}</Text>
          </View>
        ) : (
          <>
            {/* Stats row */}
            <View style={styles.dossierStatsRow}>
              <View style={styles.dossierStatCell}>
                <Text style={styles.dossierStatValue}>{sessions.length}</Text>
                <Text style={styles.dossierStatLabel}>SESSIONS</Text>
              </View>
              <View style={styles.dossierStatCell}>
                <Text style={styles.dossierStatValue}>{protocols.length}</Text>
                <Text style={styles.dossierStatLabel}>PROTOCOLS</Text>
              </View>
              <View style={styles.dossierStatCell}>
                <Text style={styles.dossierStatValue}>{avgStages}</Text>
                <Text style={styles.dossierStatLabel}>AVG STAGES</Text>
              </View>
            </View>
            {mostUsed && (
              <Text style={[styles.dossierSectionLabel, { marginTop: 8 }]}>
                PRIMARY PROTOCOL: {mostUsed}
              </Text>
            )}

            <Text style={styles.dossierSectionLabel}>SESSION ARCHIVE — MOST RECENT FIRST</Text>

            {[...sessions].reverse().map((s, i) => {
              const isOpen = expanded === s.sessionId;
              return (
                <TouchableOpacity key={s.sessionId} style={styles.dossierCard} onPress={() => setExpanded(isOpen ? null : s.sessionId)} activeOpacity={0.85}>
                  <View style={styles.dossierCardHeader}>
                    <Text style={styles.dossierCardId}>{s.sessionId}</Text>
                    <Text style={styles.dossierCardDate}>{s.date}</Text>
                  </View>
                  <Text style={styles.dossierCardProtocol}>{s.protocolId} — {s.protocolName}</Text>
                  <Text style={styles.dossierCardCallsign}>{s.callsign}</Text>
                  <View style={styles.dossierCardStats}>
                    <View style={styles.dossierCardStat}>
                      <View style={styles.dossierCardStatDot} />
                      <Text style={styles.dossierCardStatText}>{s.stagesCompleted}/6 STAGES</Text>
                    </View>
                    <View style={styles.dossierCardStat}>
                      <View style={[styles.dossierCardStatDot, { backgroundColor: C.midGreen }]} />
                      <Text style={styles.dossierCardStatText}>{s.targetId}</Text>
                    </View>
                  </View>
                  {s.targetDescription && (
                    <Text style={styles.dossierCardTarget} numberOfLines={isOpen ? undefined : 1}>
                      TARGET: {s.targetDescription}
                    </Text>
                  )}

                  {isOpen && (
                    <View style={styles.dossierExpandedBody}>
                      <Text style={styles.dossierSectionLabel}>SESSION TRANSCRIPT</Text>
                      {(s.responses || []).map((r, ri) => (
                        <View key={ri} style={styles.dossierStageRow}>
                          <Text style={styles.dossierStageLabel}>S-{["I","II","III","IV","V","VI"][ri]} — {r.stage}</Text>
                          <Text style={styles.dossierStageViewer}>{r.input}</Text>
                          <Text style={styles.dossierStageMonitor}>{r.monitor}</Text>
                        </View>
                      ))}
                      {s.finalDebrief && (
                        <>
                          <View style={{ height: 1, backgroundColor: C.darkGreen, marginVertical: 10 }} />
                          <Text style={styles.dossierSectionLabel}>MONITOR — FINAL DEBRIEF</Text>
                          <Text style={[styles.dossierStageMonitor, { opacity: 0.6 }]}>{s.finalDebrief}</Text>
                        </>
                      )}
                    </View>
                  )}

                  <Text style={{ color: C.green, fontSize: 9, opacity: 0.3, textAlign: "right", marginTop: 8, letterSpacing: 1 }}>
                    {isOpen ? "▲ COLLAPSE" : "▼ EXPAND SESSION"}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.dossierClearBtn} onPress={clearAll}>
              <Text style={styles.dossierClearText}>[ PURGE ARCHIVE ]</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
function AppInner() {
  const { user } = useUser();
  const [screen, setScreen] = useState("boot");
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [sessionResponses, setSessionResponses] = useState([]);
  const [sessionTarget, setSessionTarget] = useState(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Real subscription check from Clerk publicMetadata
  const isSubscribed = user?.publicMetadata?.subscribed === true;

  // Dev toggle — tap version 5x to override locally during testing
  const [devOverride, setDevOverride] = useState(false);
  const effectiveSubscribed = isSubscribed || devOverride;

  useEffect(() => {
    AsyncStorage.getItem("sg_session_count").then(val => {
      if (val) setSessionCount(parseInt(val, 10));
    }).catch(() => {});
  }, []);

  const handleSessionComplete = (r, t) => {
    const newCount = sessionCount + 1;
    setSessionCount(newCount);
    AsyncStorage.setItem("sg_session_count", String(newCount)).catch(() => {});
    setSessionResponses(r);
    setSessionTarget(t);
    setScreen("report");
  };

  const openMenu = () => setMenuOpen(true);
  const openUpgrade = () => { setMenuOpen(false); setUpgradeOpen(true); };
  const goTo = (s) => { setMenuOpen(false); setScreen(s); };

  return (
    <View style={{ flex: 1 }}>
      {screen === "boot" && <BootScreen onComplete={() => setScreen("select")} />}
      {screen === "select" && (
        <ProtocolSelect
          onSelect={(p) => { setSelectedProtocol(p); setScreen("brief"); }}
          sessionCount={sessionCount}
          isSubscribed={effectiveSubscribed}
          onMenuOpen={openMenu}
          onUpgrade={openUpgrade}
        />
      )}
      {screen === "brief" && (
        <SessionBrief
          protocol={selectedProtocol}
          onStart={() => setScreen("session")}
          onBack={() => setScreen("select")}
          onMenuOpen={openMenu}
        />
      )}
      {screen === "session" && (
        <Session
          protocol={selectedProtocol}
          onComplete={handleSessionComplete}
          onBack={() => setScreen("select")}
        />
      )}
      {screen === "report" && (
        <Report
          protocol={selectedProtocol}
          responses={sessionResponses}
          target={sessionTarget}
          onBack={() => setScreen("select")}
          onSameProtocol={() => setScreen("session")}
          onMenuOpen={openMenu}
        />
      )}
      {screen === "fieldmanual" && (
        <FieldManualScreen onBack={() => setScreen("select")} onMenuOpen={openMenu} onUpgrade={openUpgrade} onCRVManual={() => setScreen("crv-manual")} />
      )}
      {screen === "dossier" && (
        <DossierScreen onBack={() => setScreen("select")} onMenuOpen={openMenu} sessionCount={sessionCount} />
      )}
      {screen === "crv-manual" && (
        <CRVManualScreen onBack={() => setScreen("fieldmanual")} onMenuOpen={openMenu} />
      )}

      <MenuModal
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        isSubscribed={effectiveSubscribed}
        onUpgrade={openUpgrade}
        onFieldManual={() => goTo("fieldmanual")}
        onDossier={() => goTo("dossier")}
        onCRVManual={() => goTo("crv-manual")}
        onToggleSub={() => setDevOverride(s => !s)}
      />
      <UpgradeModal
        visible={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
      />
    </View>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <AppInner />
    </ClerkProvider>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1, paddingHorizontal: 16 },

  // Boot
  bootContainer: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", padding: 32 },
  bootTitle: { color: C.amber, fontSize: 42, fontWeight: "900", letterSpacing: 8, marginBottom: 8 },
  bootSub: { color: C.green, fontSize: 10, letterSpacing: 3, opacity: 0.6, marginBottom: 40 },
  bootLines: { width: "100%", borderTopWidth: 1, borderColor: C.darkGreen, paddingTop: 20 },
  bootLine: { color: C.green, fontSize: 11, letterSpacing: 1, lineHeight: 22, opacity: 0.7 },
  bootEnterWrap: { width: "100%", alignItems: "center", marginTop: 32 },
  bootEnterDivider: { height: 1, width: "100%", backgroundColor: C.amber, opacity: 0.25, marginBottom: 20 },
  bootEnterText: { color: C.amber, fontSize: 14, fontWeight: "900", letterSpacing: 4 },

  // Header
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: C.darkGreen },
  headerLabel: { color: C.amber, fontSize: 10, letterSpacing: 3, opacity: 0.7 },
  headerTitle: { color: C.green, fontSize: 18, fontWeight: "900", letterSpacing: 2, marginTop: 2 },
  backBtn: { color: C.green, fontSize: 12, letterSpacing: 2, opacity: 0.6, marginBottom: 4 },

  sessionCountBadge: { color: C.amber, fontSize: 9, letterSpacing: 2, opacity: 0.6, fontWeight: "900" },

  // Menu icon
  menuIconBtn: { padding: 4 },
  menuIcon: { color: C.green, fontSize: 24, opacity: 0.8, fontWeight: "900" },

  // Upgrade banner
  upgradeBanner: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "rgba(240,192,64,0.08)", borderBottomWidth: 1, borderColor: "rgba(240,192,64,0.3)",
    paddingHorizontal: 16, paddingVertical: 10,
  },
  upgradeBannerText: { color: C.amber, fontSize: 9, letterSpacing: 1.5, opacity: 0.9, flex: 1 },
  upgradeBannerCta: { color: C.amber, fontSize: 9, letterSpacing: 2, fontWeight: "900" },

  // Lock
  protocolCardLocked: { borderColor: "rgba(74,222,128,0.15)" },
  lockIcon: { color: C.amber, fontSize: 18, opacity: 0.4 },

  // Menu modal
  menuOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)" },
  menuDrawer: {
    position: "absolute", top: 0, right: 0, bottom: 0, width: "82%",
    backgroundColor: "#030d03", borderLeftWidth: 1, borderColor: C.darkGreen,
    paddingTop: 52, paddingHorizontal: 20, paddingBottom: 32,
  },
  menuHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  menuTitle: { color: C.amber, fontSize: 18, fontWeight: "900", letterSpacing: 4 },
  menuClose: { color: C.green, fontSize: 18, opacity: 0.6, paddingLeft: 16 },
  menuDivider: { height: 1, backgroundColor: C.darkGreen, marginVertical: 14 },
  menuClearanceRow: { marginBottom: 12 },
  menuClearanceLabel: { color: C.amber, fontSize: 8, letterSpacing: 3, opacity: 0.5, marginBottom: 4 },
  menuClearanceBadge: { color: "rgba(240,192,64,0.5)", fontSize: 10, letterSpacing: 1.5, fontWeight: "700" },
  menuUpgradeBtn: {
    borderWidth: 1, borderColor: C.amber, borderRadius: 2,
    padding: 14, backgroundColor: "rgba(240,192,64,0.06)", marginBottom: 4,
  },
  menuUpgradeBtnLabel: { color: C.amber, fontSize: 12, fontWeight: "900", letterSpacing: 3, marginBottom: 6 },
  menuUpgradeBtnSub: { color: C.green, fontSize: 10, opacity: 0.6, lineHeight: 16, marginBottom: 10 },
  menuUpgradeBtnCta: { color: C.amber, fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  menuItem: { flexDirection: "row", alignItems: "flex-start", gap: 14, paddingVertical: 12 },
  menuItemIcon: { color: C.amber, fontSize: 18, marginTop: 1, opacity: 0.8 },
  menuItemTitle: { color: C.green, fontSize: 12, fontWeight: "900", letterSpacing: 2, marginBottom: 3 },
  menuItemSub: { color: C.green, fontSize: 10, opacity: 0.5, lineHeight: 15 },
  menuVersion: { color: C.green, fontSize: 9, opacity: 0.25, letterSpacing: 1, textAlign: "center", marginTop: 8 },
  menuDevNote: { color: C.amber, fontSize: 8, opacity: 0.4, letterSpacing: 1, textAlign: "center", marginTop: 4 },
  menuSignInBtn: { marginHorizontal: 16, marginVertical: 10, padding: 12, borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2, alignItems: "center" },
  menuSignInText: { color: C.green, fontSize: 11, letterSpacing: 2, fontWeight: "900" },
  menuAuthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10 },
  menuAuthEmail: { color: C.green, fontSize: 10, letterSpacing: 1, opacity: 0.7, flex: 1, marginRight: 8 },
  menuSignOutBtn: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2 },
  menuSignOutText: { color: C.green, fontSize: 9, letterSpacing: 2, opacity: 0.6 },

  // Upgrade modal
  upgradeOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "flex-end" },
  upgradeSheet: {
    backgroundColor: "#030d03", borderTopWidth: 1, borderColor: C.darkGreen,
    paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40,
    borderTopLeftRadius: 8, borderTopRightRadius: 8,
  },
  upgradeTagline: { color: C.green, fontSize: 11, letterSpacing: 2, opacity: 0.7, marginBottom: 16, textAlign: "center" },
  upgradeFeatureList: { marginBottom: 8 },
  upgradeFeature: { color: C.green, fontSize: 11, lineHeight: 22, opacity: 0.75 },
  upgradePriceBtn: {
    borderWidth: 1, borderColor: C.midGreen, borderRadius: 2,
    padding: 14, marginTop: 10, alignItems: "center",
    backgroundColor: "rgba(0,40,0,0.5)",
  },
  upgradePriceBtnAnnual: { borderColor: C.amber, backgroundColor: "rgba(240,192,64,0.06)" },
  upgradePriceBtnTitle: { color: C.green, fontSize: 11, fontWeight: "900", letterSpacing: 2, marginBottom: 4 },
  upgradePriceBtnPrice: { color: C.amber, fontSize: 13, fontWeight: "900", letterSpacing: 1 },
  upgradeDisclaimer: { color: C.green, fontSize: 9, opacity: 0.4, textAlign: "center", marginTop: 14, letterSpacing: 1 },
  upgradeCancel: { color: C.green, fontSize: 10, opacity: 0.45, textAlign: "center", marginTop: 14, letterSpacing: 2 },
  startHereCard: {
    borderWidth: 1, borderColor: C.amber, borderRadius: 2,
    padding: 10, marginTop: 12, backgroundColor: "rgba(240,192,64,0.06)",
  },
  startHereText: { color: C.amber, fontSize: 10, letterSpacing: 1.5, opacity: 0.9 },
  protocolCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 14, marginTop: 8,
  },
  protocolCardHighlight: { borderColor: C.midGreen, backgroundColor: "rgba(0,30,0,0.7)" },
  protocolLeft: { flexDirection: "row", alignItems: "flex-start", gap: 12, flex: 1 },
  protocolBadge: { color: C.amber, fontSize: 22, width: 30, marginTop: 2 },
  protocolId: { color: C.amber, fontSize: 9, letterSpacing: 2, opacity: 0.7 },
  protocolName: { color: C.green, fontSize: 13, fontWeight: "900", letterSpacing: 1, marginTop: 2 },
  protocolCallsign: { color: C.green, fontSize: 10, opacity: 0.45, marginTop: 1 },
  protocolFocus: { color: C.green, fontSize: 10, opacity: 0.55, marginTop: 4, lineHeight: 15 },
  protocolRight: { alignItems: "center", paddingTop: 2 },
  protocolTargets: { color: C.amber, fontSize: 20, fontWeight: "900" },
  protocolTargetsLabel: { color: C.green, fontSize: 8, letterSpacing: 2, opacity: 0.5 },

  // Brief
  briefCard: {
    backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 20, marginTop: 16,
  },
  briefBadge: { color: C.amber, fontSize: 36, marginBottom: 8 },
  briefId: { color: C.amber, fontSize: 10, letterSpacing: 2, opacity: 0.7 },
  briefName: { color: C.green, fontSize: 20, fontWeight: "900", letterSpacing: 2, marginTop: 4 },
  divider: { height: 1, backgroundColor: C.darkGreen, marginVertical: 16 },
  briefLabel: { color: C.amber, fontSize: 9, letterSpacing: 3, opacity: 0.6, marginBottom: 4, marginTop: 10 },
  briefValue: { color: C.green, fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  briefMissionText: { color: C.green, fontSize: 12, lineHeight: 20, opacity: 0.8, marginTop: 4 },
  briefInstructions: { color: C.green, fontSize: 11, lineHeight: 20, opacity: 0.65, marginTop: 4 },

  // Session
  sessionCard: {
    backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 20, marginTop: 16, alignItems: "center",
  },
  coordinateLabel: { color: C.amber, fontSize: 9, letterSpacing: 3, opacity: 0.6 },
  coordinate: { color: C.amber, fontSize: 18, fontWeight: "900", letterSpacing: 3, marginVertical: 8, textAlign: "center" },
  stageBar: { flexDirection: "row", gap: 5, marginVertical: 10 },
  stagePip: { width: 18, height: 3, backgroundColor: C.darkGreen, borderRadius: 2 },
  stagePipDone: { backgroundColor: "rgba(74,222,128,0.35)" },
  stagePipActive: { backgroundColor: C.green },
  stageName: { color: C.green, fontSize: 12, fontWeight: "900", letterSpacing: 3 },

  // ARV Image
  arvImageCard: {
    backgroundColor: "rgba(240,192,64,0.05)", borderWidth: 1, borderColor: C.amber,
    borderRadius: 2, padding: 16, marginTop: 8,
  },
  arvImageLabel: { color: C.amber, fontSize: 9, letterSpacing: 3, opacity: 0.8, marginBottom: 10 },
  arvImageText: { color: C.green, fontSize: 14, lineHeight: 22, opacity: 0.95, fontStyle: "italic" },
  arvImageSub: { color: C.amber, fontSize: 10, lineHeight: 16, opacity: 0.6, marginTop: 10 },

  // Instructions
  instructionToggle: {
    borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2,
    padding: 8, marginTop: 8, backgroundColor: C.dimGreen,
  },
  instructionToggleText: { color: C.amber, fontSize: 9, letterSpacing: 3, opacity: 0.7 },
  instructionCard: {
    backgroundColor: C.dimGreen, borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 14, marginTop: 0,
  },
  instructionText: { color: C.green, fontSize: 12, lineHeight: 21, opacity: 0.8 },

  // Input
  inputCard: {
    backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 16, marginTop: 8,
  },
  inputLabel: { color: C.amber, fontSize: 9, letterSpacing: 3, opacity: 0.6, marginBottom: 10 },
  textInput: {
    backgroundColor: "rgba(0,30,0,0.5)", borderWidth: 1, borderColor: C.darkGreen,
    color: C.green, fontSize: 13, lineHeight: 22, padding: 12,
    minHeight: 120, textAlignVertical: "top", borderRadius: 2,
  },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
  loadingText: { color: C.green, fontSize: 11, letterSpacing: 2, opacity: 0.6 },
  submitBtn: {
    borderWidth: 1, borderColor: C.green, padding: 12, marginTop: 12,
    alignItems: "center", borderRadius: 2, backgroundColor: "rgba(0,50,0,0.5)",
  },
  submitBtnText: { color: C.green, fontSize: 12, letterSpacing: 3, fontWeight: "900" },

  // Review + Monitor
  reviewCard: {
    backgroundColor: "rgba(0,8,0,0.6)", borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 14, marginTop: 8,
  },
  reviewLabel: { color: C.amber, fontSize: 9, letterSpacing: 3, opacity: 0.5, marginBottom: 8 },
  reviewInput: { color: C.green, fontSize: 13, lineHeight: 22, opacity: 0.7 },
  monitorCard: {
    backgroundColor: "rgba(0,22,0,0.9)", borderWidth: 1, borderColor: C.midGreen,
    borderRadius: 2, padding: 16, marginTop: 4,
  },
  monitorLabel: { color: C.amber, fontSize: 9, letterSpacing: 3, marginBottom: 10, opacity: 0.8 },
  monitorText: { color: C.green, fontSize: 13, lineHeight: 23, opacity: 0.95 },
  nextBtn: {
    borderWidth: 1, borderColor: C.green, padding: 13, marginTop: 18,
    alignItems: "center", borderRadius: 2, backgroundColor: "rgba(0,50,0,0.6)",
  },
  nextBtnText: { color: C.green, fontSize: 11, letterSpacing: 2, fontWeight: "900" },
  reviseBtn: { borderWidth: 1, borderColor: C.darkGreen, padding: 10, marginTop: 8, alignItems: "center", borderRadius: 2 },
  reviseBtnText: { color: C.green, fontSize: 11, letterSpacing: 2, opacity: 0.45 },
  prevBtn: { borderWidth: 1, borderColor: C.darkGreen, padding: 10, marginTop: 6, alignItems: "center", borderRadius: 2 },
  prevBtnText: { color: C.green, fontSize: 10, letterSpacing: 2, opacity: 0.4 },

  // Report
  reportHeaderCard: {
    backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.midGreen,
    borderRadius: 2, padding: 20, marginTop: 16,
  },
  reportClassification: { color: "#c0392b", fontSize: 9, letterSpacing: 3, textAlign: "center", fontWeight: "900" },
  reportTitle: { color: C.green, fontSize: 16, fontWeight: "900", letterSpacing: 4, textAlign: "center", marginTop: 8 },
  reportSubtitle: { color: C.amber, fontSize: 11, letterSpacing: 2, textAlign: "center", marginTop: 4, opacity: 0.8 },
  reportStatsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  reportStatCell: {
    flex: 1, backgroundColor: "rgba(0,20,0,0.4)", borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 10, alignItems: "center",
  },
  reportStatLabel: { color: C.green, fontSize: 7, letterSpacing: 2, opacity: 0.5, marginBottom: 4 },
  reportStatValue: { color: C.amber, fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  reportProtocolName: { color: C.green, fontSize: 14, fontWeight: "900", letterSpacing: 2, marginTop: 4 },
  reportFocus: { color: C.green, fontSize: 11, opacity: 0.6, marginTop: 4, lineHeight: 17 },
  reportSectionLabel: { marginTop: 16, marginBottom: 0 },
  reportSectionText: { color: C.amber, fontSize: 10, letterSpacing: 3, opacity: 0.7 },
  reportStageCard: {
    backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 16, marginTop: 6,
  },
  reportStageHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  reportStageId: { color: C.amber, fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  reportStageName: { color: C.green, fontSize: 11, fontWeight: "700", letterSpacing: 2, opacity: 0.7 },
  reportDivider: { height: 1, backgroundColor: C.darkGreen, marginVertical: 10 },
  reportTransmissionLabel: { color: C.amber, fontSize: 8, letterSpacing: 3, opacity: 0.55, marginBottom: 6 },
  reportViewer: { color: C.green, fontSize: 12, lineHeight: 20, opacity: 0.9, marginBottom: 12 },
  reportMonitorLabel: { color: C.midGreen, fontSize: 8, letterSpacing: 3, opacity: 0.8, marginBottom: 6 },
  reportMonitor: { color: C.green, fontSize: 12, lineHeight: 20, opacity: 0.55, fontStyle: "italic" },
  reportDebriefCard: {
    backgroundColor: "rgba(0,0,0,0.7)", borderWidth: 1, borderColor: C.midGreen,
    borderLeftWidth: 3, borderLeftColor: C.amber,
    borderRadius: 2, padding: 18, marginTop: 12,
  },
  reportDebriefLabel: { color: C.amber, fontSize: 10, letterSpacing: 3, marginBottom: 14, opacity: 0.9 },
  debriefLoadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  debriefLoadingText: { color: C.green, fontSize: 11, letterSpacing: 2, opacity: 0.6 },
  reportDebriefText: { color: C.green, fontSize: 13, lineHeight: 24, opacity: 0.95 },
  unsealCard: {
    borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2,
    padding: 16, marginTop: 12, alignItems: "center",
    backgroundColor: "rgba(0,10,0,0.6)",
  },
  unsealCardOpen: { borderColor: C.amber },
  unsealLabel: { color: C.green, fontSize: 8, letterSpacing: 3, opacity: 0.5 },
  unsealDescription: { color: C.amber, fontSize: 14, fontWeight: "900", letterSpacing: 1, textAlign: "center", lineHeight: 22 },
  unsealCoords: { color: C.green, fontSize: 11, opacity: 0.6, textAlign: "center", marginTop: 6, letterSpacing: 1 },
  redactedBar: { height: 12, width: 200, backgroundColor: C.midGreen, opacity: 0.25, borderRadius: 2, marginBottom: 12 },
  unsealBtn: { borderWidth: 1, borderColor: C.amber, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 2 },
  unsealBtnText: { color: C.amber, fontSize: 11, letterSpacing: 3 },
  shareBtn: {
    backgroundColor: "rgba(0,20,0,0.6)", borderWidth: 1, borderColor: C.amber,
    borderRadius: 2, padding: 14, alignItems: "center", marginTop: 10,
  },
  shareBtnText: { color: C.amber, fontSize: 12, letterSpacing: 3, fontWeight: "900" },
  reportFooter: {
    borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2,
    padding: 16, marginTop: 16, alignItems: "center",
  },
  reportFooterLine: { color: C.green, fontSize: 11, lineHeight: 18, opacity: 0.45, textAlign: "center", fontStyle: "italic", marginBottom: 12 },
  reportFooterText: { color: C.amber, fontSize: 9, letterSpacing: 3, opacity: 0.7 },
  reportFooterSub: { color: C.green, fontSize: 8, letterSpacing: 1, opacity: 0.3, marginTop: 4, textAlign: "center" },

  reportActionRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  primaryBtn: {
    borderWidth: 1, borderColor: C.green, padding: 16, marginTop: 16,
    alignItems: "center", borderRadius: 2, backgroundColor: "rgba(0,60,0,0.6)",
  },
  primaryBtnText: { color: C.green, fontSize: 13, letterSpacing: 3, fontWeight: "900" },

  // ── Field Manual ──────────────────────────────────────────────────────────
  fmTabBar: { borderBottomWidth: 1, borderColor: C.darkGreen, paddingVertical: 8, flexGrow: 0 },
  fmTab: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2 },
  fmTabActive: { borderColor: C.amber, backgroundColor: "rgba(240,192,64,0.07)" },
  fmTabText: { color: C.green, fontSize: 9, letterSpacing: 2, opacity: 0.55 },
  fmTabTextActive: { color: C.amber, opacity: 1, fontWeight: "900" },
  fmIntro: { color: C.green, fontSize: 11, lineHeight: 19, opacity: 0.5, marginBottom: 10, letterSpacing: 0.5 },
  fmLeadCard: {
    backgroundColor: "rgba(0,15,0,0.5)", borderWidth: 1, borderColor: C.midGreen,
    borderLeftWidth: 3, borderLeftColor: C.amber,
    borderRadius: 2, padding: 20, marginBottom: 10,
  },
  fmLeadTitle: { color: C.amber, fontSize: 14, fontWeight: "900", lineHeight: 22, marginBottom: 10 },
  fmLeadBold: { color: "#ffffff", fontSize: 12, fontWeight: "900", marginBottom: 10, letterSpacing: 0.5 },
  fmCard: {
    backgroundColor: "rgba(0,12,0,0.4)", borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 16, marginBottom: 10,
  },
  fmSectionLabel: { color: C.amber, fontSize: 8, letterSpacing: 3, opacity: 0.65, marginBottom: 8, fontWeight: "900" },
  fmBody: { color: C.green, fontSize: 12, lineHeight: 21, opacity: 0.8 },
  fmDivider: { height: 1, backgroundColor: C.darkGreen, marginVertical: 12 },
  fmMiniCard: { flexDirection: "row", gap: 12, backgroundColor: "rgba(0,12,0,0.4)", borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2, padding: 14, marginBottom: 8, alignItems: "flex-start" },
  fmMiniIcon: { color: C.amber, fontSize: 20, marginTop: 1, width: 26 },
  fmMiniTitle: { color: C.amber, fontSize: 10, fontWeight: "900", letterSpacing: 2, marginBottom: 4 },
  fmMiniBody: { color: C.green, fontSize: 11, lineHeight: 18, opacity: 0.7 },
  fmStepCard: { flexDirection: "row", gap: 16, backgroundColor: "rgba(0,12,0,0.4)", borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2, padding: 16, marginBottom: 8 },
  fmStepNumber: { color: C.amber, fontSize: 26, fontWeight: "900", opacity: 0.25, lineHeight: 32, width: 32, flexShrink: 0 },
  fmStepTitle: { color: C.amber, fontSize: 10, fontWeight: "900", letterSpacing: 2, marginBottom: 6 },
  fmStepBody: { color: C.green, fontSize: 11, lineHeight: 19, opacity: 0.75 },
  fmProtocolRow: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "rgba(0,12,0,0.4)", borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 14, marginBottom: 8,
  },
  fmProtocolBadge: { color: C.amber, fontSize: 22, width: 30, textAlign: "center" },
  fmProtocolId: { color: C.amber, fontSize: 9, letterSpacing: 2, opacity: 0.7, marginBottom: 2 },
  fmProtocolName: { color: C.green, fontSize: 13, fontWeight: "900", letterSpacing: 1, marginBottom: 2 },
  fmProtocolCallsign: { color: C.green, fontSize: 10, opacity: 0.45, letterSpacing: 1 },
  fmProtocolChevron: { color: C.green, fontSize: 20, opacity: 0.3 },
  fmBackLink: { color: C.green, fontSize: 10, letterSpacing: 2, opacity: 0.5, marginBottom: 4 },
  fmProtocolDetailBadge: { color: C.amber, fontSize: 36, textAlign: "center", marginBottom: 8 },
  fmProtocolDetailId: { color: C.amber, fontSize: 10, letterSpacing: 3, textAlign: "center", opacity: 0.7, marginBottom: 4 },
  fmProtocolDetailName: { color: C.green, fontSize: 18, fontWeight: "900", letterSpacing: 2, textAlign: "center", marginBottom: 4 },
  fmProtocolDetailCallsign: { color: C.green, fontSize: 11, opacity: 0.4, letterSpacing: 2, textAlign: "center" },
  fmStageRow: { flexDirection: "row", gap: 10, marginBottom: 10, alignItems: "flex-start" },
  fmStageNum: { color: C.amber, fontSize: 9, fontWeight: "900", letterSpacing: 1, width: 28, flexShrink: 0, opacity: 0.8, marginTop: 2 },
  fmStageText: { color: C.green, fontSize: 11, lineHeight: 18, opacity: 0.8, flex: 1 },
  fmUseCaseTitle: { color: C.amber, fontSize: 11, fontWeight: "900", letterSpacing: 1.5, marginBottom: 8 },
  fmTagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  fmTag: { color: C.green, fontSize: 9, borderWidth: 1, borderColor: C.darkGreen, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 2, opacity: 0.65 },
  fmFigureCallsign: { color: C.amber, fontSize: 8, letterSpacing: 3, opacity: 0.5, marginBottom: 4 },
  fmFigureName: { color: C.amber, fontSize: 16, fontWeight: "900", letterSpacing: 1, marginBottom: 2 },
  fmFigureRole: { color: C.green, fontSize: 10, opacity: 0.5, marginBottom: 2 },
  fmResourceHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  fmResourceType: { color: C.amber, fontSize: 8, letterSpacing: 3, opacity: 0.6, fontWeight: "900" },
  fmResourceYear: { color: C.green, fontSize: 8, opacity: 0.35, letterSpacing: 1 },
  fmResourceTitle: { color: C.green, fontSize: 13, fontWeight: "900", letterSpacing: 1, marginBottom: 2 },
  fmResourceAuthor: { color: C.green, fontSize: 10, opacity: 0.45 },
  fmResourceLink: { color: C.amber, fontSize: 10, letterSpacing: 2, marginTop: 10, fontWeight: "900", opacity: 0.8 },
  fmResourceRef: { color: C.green, fontSize: 8, opacity: 0.25, letterSpacing: 0.5, marginTop: 8, fontStyle: "italic" },
  fmTimelineLine: { position: "absolute", left: 20, top: 0, bottom: 0, width: 1, backgroundColor: C.darkGreen },
  fmTimelineItem: { position: "relative", paddingLeft: 28, marginBottom: 22 },
  fmTimelineDot: { position: "absolute", left: -24, top: 4, width: 9, height: 9, borderRadius: 5, backgroundColor: C.amber, borderWidth: 2, borderColor: C.bg },
  fmTimelineYear: { color: C.amber, fontSize: 13, fontWeight: "900", letterSpacing: 1, marginBottom: 4 },
  fmTimelineEvent: { color: C.green, fontSize: 11, lineHeight: 19, opacity: 0.75 },

  // ── Dossier ───────────────────────────────────────────────────────────────
  dossierEmptyCard: { borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2, padding: 32, marginTop: 16, alignItems: "center" },
  dossierEmptyIcon: { color: C.amber, fontSize: 32, marginBottom: 14 },
  dossierEmptyTitle: { color: C.amber, fontSize: 11, letterSpacing: 3, marginBottom: 8 },
  dossierEmptyBody: { color: C.green, fontSize: 11, lineHeight: 19, opacity: 0.6, textAlign: "center" },
  dossierStatsRow: { flexDirection: "row", gap: 8, marginTop: 12, marginBottom: 4 },
  dossierStatCell: { flex: 1, backgroundColor: "rgba(0,12,0,0.4)", borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2, padding: 12, alignItems: "center" },
  dossierStatValue: { color: C.amber, fontSize: 18, fontWeight: "900", letterSpacing: 1 },
  dossierStatLabel: { color: C.green, fontSize: 7, letterSpacing: 2, opacity: 0.45, marginTop: 3 },
  dossierCard: {
    backgroundColor: "rgba(0,12,0,0.4)", borderWidth: 1, borderColor: C.darkGreen,
    borderRadius: 2, padding: 16, marginBottom: 8,
  },
  dossierCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  dossierCardId: { color: C.amber, fontSize: 9, letterSpacing: 2, opacity: 0.7 },
  dossierCardDate: { color: C.green, fontSize: 9, opacity: 0.35, letterSpacing: 1 },
  dossierCardProtocol: { color: C.green, fontSize: 12, fontWeight: "900", letterSpacing: 1, marginBottom: 2 },
  dossierCardCallsign: { color: C.green, fontSize: 10, opacity: 0.45, letterSpacing: 1, marginBottom: 8 },
  dossierCardStats: { flexDirection: "row", gap: 8 },
  dossierCardStat: { flexDirection: "row", gap: 4, alignItems: "center" },
  dossierCardStatDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.amber },
  dossierCardStatText: { color: C.green, fontSize: 9, opacity: 0.5, letterSpacing: 1 },
  dossierCardTarget: { color: C.green, fontSize: 10, opacity: 0.4, marginTop: 8, fontStyle: "italic", letterSpacing: 0.5 },
  dossierSectionLabel: { color: C.amber, fontSize: 8, letterSpacing: 3, opacity: 0.5, marginTop: 16, marginBottom: 8, fontWeight: "900" },
  dossierExpandedBody: { backgroundColor: "rgba(0,6,0,0.5)", borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2, padding: 14, marginTop: 10 },
  dossierStageRow: { marginBottom: 12 },
  dossierStageLabel: { color: C.amber, fontSize: 8, letterSpacing: 2, opacity: 0.6, marginBottom: 4, fontWeight: "900" },
  dossierStageViewer: { color: C.green, fontSize: 11, lineHeight: 18, opacity: 0.8, marginBottom: 4 },
  dossierStageMonitor: { color: C.green, fontSize: 10, lineHeight: 17, opacity: 0.4, fontStyle: "italic" },
  dossierClearBtn: { borderWidth: 1, borderColor: "#3a1a1a", borderRadius: 2, padding: 12, alignItems: "center", marginTop: 16 },
  dossierClearText: { color: "#c0392b", fontSize: 10, letterSpacing: 2, opacity: 0.6 },

  // ── CRV Document Archive screen ───────────────────────────────────────────
  crvDocCard: {
    borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2,
    marginTop: 10, overflow: "hidden", backgroundColor: "rgba(0,12,0,0.4)",
  },
  crvDocCardOpen: { borderColor: C.amber },
  crvStampCard: {
    backgroundColor: "rgba(240,192,64,0.07)", borderBottomWidth: 1, borderColor: "rgba(240,192,64,0.2)",
    paddingHorizontal: 16, paddingVertical: 10, alignItems: "center",
  },
  crvStampClass: { color: C.amber, fontSize: 10, letterSpacing: 2, fontWeight: "900", textAlign: "center" },
  crvDocHeaderRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  crvDocBadge: { color: C.amber, fontSize: 26, width: 32, textAlign: "center" },
  crvDocSubtitle: { color: C.green, fontSize: 10, opacity: 0.55, letterSpacing: 1.5, marginBottom: 4 },
  crvDocMeta: { color: C.green, fontSize: 10, opacity: 0.4, letterSpacing: 0.5, marginBottom: 1 },
  crvChevron: { color: C.amber, fontSize: 11, opacity: 0.5 },
  crvDocDivider: { height: 1, backgroundColor: C.darkGreen, marginHorizontal: 14 },
  crvDocDesc: { color: C.green, fontSize: 11, lineHeight: 20, opacity: 0.75, padding: 14, paddingTop: 12 },
  crvCard: {
    borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2,
    padding: 14, marginHorizontal: 14, backgroundColor: "rgba(0,8,0,0.4)",
  },
  crvCardLabel: { color: C.amber, fontSize: 8, letterSpacing: 3, opacity: 0.65, marginBottom: 10, fontWeight: "900" },
  crvContentRow: { flexDirection: "row", gap: 10, marginBottom: 7, alignItems: "flex-start" },
  crvContentDot: { color: C.amber, fontSize: 9, opacity: 0.45, marginTop: 2, width: 12 },
  crvContentText: { color: C.green, fontSize: 11, lineHeight: 18, opacity: 0.75, flex: 1 },
  crvOpenBtn: {
    backgroundColor: C.amber, borderRadius: 2,
    padding: 14, alignItems: "center", margin: 14, marginTop: 12,
  },
  crvOpenBtnText: { color: C.bg, fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  crvOpenBtnSecondary: {
    borderWidth: 1, borderColor: C.darkGreen, borderRadius: 2,
    padding: 12, alignItems: "center", marginTop: 10,
  },
  crvOpenBtnSecondaryText: { color: C.green, fontSize: 10, letterSpacing: 1.5, opacity: 0.45 },
  crvCitationText: { color: C.green, fontSize: 8, opacity: 0.2, letterSpacing: 1, textAlign: "center", fontStyle: "italic", marginBottom: 14 },

  // Featured CRV card in Resources
  crvFeaturedCard: {
    borderWidth: 1, borderColor: C.amber, borderLeftWidth: 3, borderLeftColor: C.amber,
    borderRadius: 2, padding: 18, marginBottom: 14,
    backgroundColor: "rgba(240,192,64,0.05)",
  },
  crvFeaturedLabel: { color: C.amber, fontSize: 8, letterSpacing: 3, opacity: 0.6, marginBottom: 6 },
  crvFeaturedTitle: { color: C.amber, fontSize: 15, fontWeight: "900", letterSpacing: 2, marginBottom: 4 },
  crvFeaturedAuthor: { color: C.green, fontSize: 10, opacity: 0.55, marginBottom: 10 },
  crvFeaturedDesc: { color: C.green, fontSize: 11, lineHeight: 19, opacity: 0.75, marginBottom: 12 },
  crvFeaturedCta: { color: C.amber, fontSize: 11, fontWeight: "900", letterSpacing: 3, textAlign: "center", borderWidth: 1, borderColor: C.amber, paddingVertical: 8, borderRadius: 2 },
});
