// ============================================
// NetaLife — REAL DATA from PRS Legislative Research
// Source: data/prs_18th.csv — downloaded directly from prsindia.org
// Auto-refreshed weekly via GitHub Actions (.github/workflows/refresh-data.yml)
// License: Data © PRS Legislative Research. Used for non-commercial public interest.
// ============================================

// Local CSV — served from same origin (no CORS issues)
// Updated automatically by GitHub Actions every Sunday
const DATA_URL = './data/prs_18th.csv';

// Data transparency: exact period covered by the dataset
const DATA_PERIOD = {
    start: '9 June 2024',
    end: '18 April 2026',
    sessions: 'Budget 2024, Monsoon 2024, Winter 2024, Budget 2025, Monsoon 2025, Winter 2025, Budget 2026',
    lastUpdated: 'Auto-refreshed weekly via GitHub Actions',
    source: 'PRS Legislative Research (prsindia.org)',
    license: 'Data © PRS Legislative Research — used for non-commercial public interest',
};

const PARTY_COLORS = {
    "Bharatiya Janata Party": "#ff6b35",
    "Indian National Congress": "#00bcd4",
    "All India Trinamool Congress": "#4caf50",
    "Aam Aadmi Party": "#2196f3",
    "Samajwadi Party": "#f44336",
    "Dravida Munnetra Kazhagam": "#d32f2f",
    "Telugu Desam Party": "#fdd835",
    "Janata Dal (United)": "#43a047",
    "Shiv Sena": "#ff8f00",
    "Shiv Sena (Uddhav Balasaheb Thackeray)": "#e65100",
    "Nationalist Congress Party Sharadchandra Pawar": "#1565c0",
    "Yuvajana Sramika Rythu Congress Party": "#0d47a1",
    "Communist Party of India (Marxist)": "#b71c1c",
    "Communist Party of India": "#c62828",
    "Rashtriya Janata Dal": "#2e7d32",
    "Lok Janshakti Party (Ram Vilas)": "#1976d2",
    "Indian Union Muslim League": "#388e3c",
    "All India Majlis-E-Ittehadul Muslimeen": "#2e7d32",
    "Jharkhand Mukti Morcha": "#558b2f",
    "Shiromani Akali Dal": "#ff6f00",
    "Janata Dal (Secular)": "#689f38",
    "Jana Sena Party": "#d84315",
    "Rashtriya Lok Dal": "#00695c",
    "Rashtriya Loktantrik Party": "#5d4037",
    "Sikkim Krantikari Morcha": "#e91e63",
    "AJSU Party": "#7b1fa2",
    "Apna Dal (Soneylal)": "#6a1b9a",
    "Marumalarchi Dravida Munnetra Kazhagam": "#ad1457",
    "Viduthalai Chiruthaigal Katchi": "#880e4f",
    "Aazad Samaj Party (Kanshi Ram)": "#4a148c",
    "Voice of the People Party": "#00838f",
    "Independent": "#757575",
};

const PARTY_SHORT = {
    "Bharatiya Janata Party": "BJP",
    "Indian National Congress": "INC",
    "All India Trinamool Congress": "TMC",
    "Aam Aadmi Party": "AAP",
    "Samajwadi Party": "SP",
    "Dravida Munnetra Kazhagam": "DMK",
    "Telugu Desam Party": "TDP",
    "Janata Dal (United)": "JDU",
    "Shiv Sena": "SHS",
    "Shiv Sena (Uddhav Balasaheb Thackeray)": "SHS(UBT)",
    "Nationalist Congress Party Sharadchandra Pawar": "NCP(SP)",
    "Yuvajana Sramika Rythu Congress Party": "YSRCP",
    "Communist Party of India (Marxist)": "CPI(M)",
    "Communist Party of India": "CPI",
    "Rashtriya Janata Dal": "RJD",
    "Lok Janshakti Party (Ram Vilas)": "LJPRV",
    "Indian Union Muslim League": "IUML",
    "All India Majlis-E-Ittehadul Muslimeen": "AIMIM",
    "Jharkhand Mukti Morcha": "JMM",
    "Shiromani Akali Dal": "SAD",
    "Janata Dal (Secular)": "JDS",
    "Jana Sena Party": "JSP",
    "Rashtriya Lok Dal": "RLD",
    "Rashtriya Loktantrik Party": "RLP",
    "Independent": "IND",
};

// Manifesto promises — editorially maintained, multi-party for neutrality
// IMPORTANT: Promises tracked across ALL major parties equally. Status based on verifiable evidence only.
const MANIFESTO_PROMISES = [
    // --- BJP (Ruling party — 2024 manifesto + prior commitments) ---
    { id: 1, party: "BJP", category: "Economy", promise: "Make India a $5 Trillion economy", status: "in-progress", evidence: "GDP reached ~$4.2T by 2026. Originally targeted 2025, now projected 2027-28.", datePromised: "2019-04-08", lastUpdated: "2026-03-15" },
    { id: 2, party: "BJP", category: "Infrastructure", promise: "Bullet Train (Mumbai-Ahmedabad)", status: "in-progress", evidence: "~40% civil works completed. Revised timeline to 2028-29.", datePromised: "2019-04-08", lastUpdated: "2026-03-01" },
    { id: 3, party: "BJP", category: "Agriculture", promise: "Double farmer income by 2022", status: "broken", evidence: "Farmer income grew 59% nominally (2015-22), only ~10.9% real terms per NABARD.", datePromised: "2016-02-28", lastUpdated: "2025-12-01" },
    { id: 4, party: "BJP", category: "Healthcare", promise: "Ayushman Bharat — cover 50 Cr citizens", status: "fulfilled", evidence: "55 Cr+ Ayushman cards issued. 7.3 Cr+ hospital treatments provided.", datePromised: "2018-09-23", lastUpdated: "2026-03-15" },
    { id: 5, party: "BJP", category: "Digital", promise: "5G rollout across India", status: "fulfilled", evidence: "5G active in 700+ cities. 98% urban coverage achieved.", datePromised: "2022-10-01", lastUpdated: "2025-08-15" },
    // --- INC (Principal opposition — 2024 Nyay Patra manifesto) ---
    { id: 6, party: "INC", category: "Economy", promise: "Legal guarantee for MSP on crops", status: "not-started", evidence: "INC is in opposition. Bill not introduced. MSP continues as administrative price, not legal right.", datePromised: "2024-04-05", lastUpdated: "2026-04-01" },
    { id: 7, party: "INC", category: "Employment", promise: "Fill 30 lakh government vacancies in 1 year", status: "not-started", evidence: "INC is in opposition. Central govt recruitment continues at existing pace through SSC/UPSC.", datePromised: "2024-04-05", lastUpdated: "2026-04-01" },
    { id: 8, party: "INC", category: "Welfare", promise: "Mahalakshmi — ₹1 lakh/year to poorest women", status: "not-started", evidence: "INC is in opposition at Centre. Cannot implement central scheme. Some state-level variants exist.", datePromised: "2024-04-05", lastUpdated: "2026-04-01" },
    // --- AAP (Delhi + Punjab governance) ---
    { id: 9, party: "AAP", category: "Education", promise: "Transform Delhi government schools", status: "fulfilled", evidence: "190+ schools rebuilt. Pass rates improved. International recognition from multiple bodies.", datePromised: "2015-02-14", lastUpdated: "2025-09-01" },
    { id: 10, party: "AAP", category: "Healthcare", promise: "Mohalla clinics in every neighbourhood", status: "in-progress", evidence: "500+ Aam Aadmi Mohalla Clinics operational in Delhi. Target was 1,000.", datePromised: "2015-02-14", lastUpdated: "2025-06-01" },
    // --- TMC (West Bengal governance) ---
    { id: 11, party: "TMC", category: "Welfare", promise: "Lakshmir Bhandar — income support for women", status: "fulfilled", evidence: "₹500-1000/month transferred to 2.1 Cr+ women in West Bengal. Scheme operational since 2021.", datePromised: "2021-03-01", lastUpdated: "2026-02-01" },
    // --- DMK (Tamil Nadu governance) ---
    { id: 12, party: "DMK", category: "Welfare", promise: "Kalaignar Magalir Urimai Thogai — ₹1,000/month to women", status: "fulfilled", evidence: "₹1,000/month transferred to 1.06 Cr eligible women in Tamil Nadu since Sept 2023.", datePromised: "2021-03-01", lastUpdated: "2026-01-15" },
];

// NOTE: Opposition parties' national promises are marked "not-started" because they are not in power
// at the Centre. This is factual, not editorial. State-level promises are tracked where parties govern.

// --- CSV Parser ---
// Auto-detects delimiter: PRS direct CSV uses commas; old GitHub CSV used semicolons
function parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) return [];

    const delimiter = lines[0].includes(',') ? ',' : ';';

    const parseRow = (line) => {
        const values = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { inQuotes = !inQuotes; }
            else if (ch === delimiter && !inQuotes) { values.push(current.trim()); current = ''; }
            else { current += ch; }
        }
        values.push(current.trim());
        return values;
    };

    const headers = parseRow(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const vals = parseRow(lines[i]);
        if (vals.length >= 10 && vals[0]) {
            const obj = {};
            headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
            rows.push(obj);
        }
    }
    return rows;
}

// --- Detect special parliamentary roles from PRS comments ---
// These MPs have valid reasons for 0% attendance or N/A data:
// - Leader of Opposition (LoP): Does not sign attendance register per convention
// - Speaker: Presides over the house, does not participate as regular MP
// - Deputy Speaker: Similar to Speaker
function detectSpecialRole(comment) {
    const c = (comment || '').toLowerCase();
    if (c.includes('leader of opposition') || c.includes('lop does not sign')) return 'lop';
    if (c.includes('speaker') && !c.includes('deputy')) return 'speaker';
    if (c.includes('deputy speaker')) return 'deputy-speaker';
    return null;
}

// --- Grade computation ---
// METHODOLOGY (transparent, applied equally to all MPs regardless of party):
// - Attendance: 40% weight (0-100 scale from PRS attendance %)
// - Questions: 30% weight (normalized: 100 questions = max score)
// - Debates: 20% weight (normalized: 25 debates = max score)
// - Private Member Bills: 10% weight (each bill = 25 pts, max 100)
// EXCLUSIONS (with explanation):
// - Ministers: Graded 'M' — PRS does not track their individual participation
// - Leader of Opposition: Graded 'LoP' — does not sign attendance register per convention
// - Speaker/Deputy Speaker: Graded 'SP' — presides over house, different role
function computeGrade(p) {
    if (p.isMinister) return { grade: 'M', score: null, label: 'Minister' };
    if (p.specialRole === 'lop') return { grade: 'LoP', score: null, label: 'Leader of Opposition' };
    if (p.specialRole === 'speaker') return { grade: 'SP', score: null, label: 'Speaker' };
    if (p.specialRole === 'deputy-speaker') return { grade: 'DSP', score: null, label: 'Deputy Speaker' };
    
    const attScore = p.attendance; // 0-100
    const qScore = Math.min(p.questions / 1.0, 100); // normalize: 100 questions = 100 score
    const dScore = Math.min(p.debates / 0.25, 100); // normalize: 25 debates = 100 score
    const billScore = Math.min(p.bills * 25, 100); // each bill = 25 pts
    
    const composite = (attScore * 0.40) + (qScore * 0.30) + (dScore * 0.20) + (billScore * 0.10);
    const score = Math.round(composite);
    
    let grade;
    if (score >= 85) grade = 'A+';
    else if (score >= 75) grade = 'A';
    else if (score >= 65) grade = 'B+';
    else if (score >= 55) grade = 'B';
    else if (score >= 45) grade = 'C+';
    else if (score >= 35) grade = 'C';
    else if (score >= 25) grade = 'D';
    else grade = 'F';
    
    return { grade, score, label: grade };
}

// --- Transform raw CSV row to politician object ---
// Auto-detects format: PRS direct (mp_name) vs GitHub CSV (Name)
function transformRow(row, id) {
    const isPRS = 'mp_name' in row;  // PRS direct format uses snake_case columns

    let note, attRaw, attendance, isMinister, questions, debates, bills, partyFull, name, constituency, state, age, gender, education, terms, startOfTerm, endOfTerm;

    if (isPRS) {
        // === PRS Direct Download format ===
        note = row['mp_note'] || '';
        attRaw = parseFloat(row['attendance']) || 0;
        attendance = Math.round(attRaw * 100 * 10) / 10; // 0.9259 → 92.6
        isMinister = note.toLowerCase().includes('is a minister');
        questions  = parseInt(row['questions']) || 0;
        debates    = parseInt(row['debates']) || 0;
        bills      = parseInt(row['private_member_bills']) || 0;
        partyFull  = row['mp_political_party'] || 'Unknown';
        name       = row['mp_name'] || '';
        constituency = row['pc_name'] || '';
        state      = row['state'] || '';
        age        = parseInt(row['mp_age']) || 0;
        gender     = row['mp_gender'] || '';
        education  = row['educational_qualification'] || '';
        terms      = row['term'] || '';
        startOfTerm = row['term_start_date'] || '';
        endOfTerm  = row['term_end_date'] || 'In Office';
    } else {
        // === GitHub CSV / legacy format ===
        note = row['Comment'] || '';
        const attStr = row['Attendance'] || '0';
        // GitHub CSV stores attendance as percentage string (e.g. "92.59%") or decimal
        const raw = parseFloat(attStr.replace('%', ''));
        attendance = raw > 1 ? raw : raw * 100; // handle both formats
        isMinister = (row['Minister'] || '').toLowerCase() === 'yes';
        questions  = parseInt(row['Questions']) || 0;
        debates    = parseInt(row['Debates']) || 0;
        bills      = parseInt(row['Private Member Bills']) || 0;
        partyFull  = row['Party'] || 'Unknown';
        name       = row['Name'] || '';
        constituency = row['Constituency'] || '';
        state      = row['State'] || '';
        age        = parseInt(row['Age']) || 0;
        gender     = row['Gender'] || '';
        education  = row['Education'] || '';
        terms      = row['No. of Term'] || '';
        startOfTerm = row['Start of Term'] || '';
        endOfTerm  = row['End of Term'] || '';
    }

    const specialRole = detectSpecialRole(note);
    const isExempt = isMinister || specialRole !== null;

    const p = {
        id,
        name,
        constituency,
        state,
        party: PARTY_SHORT[partyFull] || partyFull.substring(0, 8),
        partyFull,
        type: 'mp',
        chamber: 'Lok Sabha',
        attendance: isExempt ? null : attendance,
        questionsRaised: questions,
        debatesParticipated: debates,
        billsIntroduced: bills,
        questions, debates, bills,
        age,
        gender,
        education,
        terms,
        startOfTerm,
        endOfTerm,
        isMinister,
        isExempt,
        specialRole,
        comment: note,
        lokSabha: '18th',
    };

    const gradeInfo = computeGrade(p);
    p.grade = gradeInfo.grade;
    p.score = gradeInfo.score;
    p.gradeLabel = gradeInfo.label;

    return p;
}

// --- Aggregate state-level data ---
function computeStatesData(politicians) {
    const stateMap = {};
    politicians.forEach(p => {
        if (!p.state) return;
        if (!stateMap[p.state]) {
            stateMap[p.state] = { name: p.state, mps: 0, totalAtt: 0, attCount: 0, parties: {}, topScore: 0, topPerformer: '' };
        }
        const s = stateMap[p.state];
        s.mps++;
        if (!p.isMinister && p.attendance !== null) {
            s.totalAtt += p.attendance;
            s.attCount++;
        }
        s.parties[p.partyFull] = (s.parties[p.partyFull] || 0) + 1;
        if (p.score !== null && p.score > s.topScore) {
            s.topScore = p.score;
            s.topPerformer = p.name;
        }
    });
    
    return Object.values(stateMap)
        .map(s => ({
            name: s.name,
            mps: s.mps,
            avgAttendance: s.attCount > 0 ? Math.round(s.totalAtt / s.attCount) : 0,
            topPerformer: s.topPerformer || 'N/A',
            dominantParty: Object.entries(s.parties).sort((a, b) => b[1] - a[1])[0]?.[0] || '',
        }))
        .sort((a, b) => b.mps - a.mps);
}

// --- National stats ---
function computeNationalStats(politicians) {
    const nonMinisters = politicians.filter(p => !p.isMinister);
    const withAtt = nonMinisters.filter(p => p.attendance !== null);
    const avgAtt = withAtt.length ? Math.round(withAtt.reduce((s, p) => s + p.attendance, 0) / withAtt.length) : 0;
    const totalQuestions = nonMinisters.reduce((s, p) => s + p.questions, 0);
    const totalDebates = nonMinisters.reduce((s, p) => s + p.debates, 0);
    const totalBills = nonMinisters.reduce((s, p) => s + p.bills, 0);
    const ministerCount = politicians.filter(p => p.isMinister).length;
    const zeroAttendance = withAtt.filter(p => p.attendance === 0).length;
    const perfect = withAtt.filter(p => p.attendance === 100).length;
    const uniqueParties = new Set(politicians.map(p => p.partyFull)).size;
    const avgAge = Math.round(politicians.reduce((s, p) => s + p.age, 0) / politicians.length);
    const women = politicians.filter(p => p.gender === 'Female').length;

    return { avgAtt, totalQuestions, totalDebates, totalBills, ministerCount, zeroAttendance, perfect, totalMPs: politicians.length, uniqueParties, avgAge, women };
}

// --- Fetch & Initialize ---
// CSV is served locally (./data/prs_18th.csv) — same origin, zero CORS issues.
// GitHub Actions refreshes this file every Sunday from PRS India directly.
let POLITICIANS = [];
let STATES_DATA = [];
let NATIONAL_STATS = {};

async function fetchRealData() {
    try {
        const resp = await fetch(DATA_URL);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const text = await resp.text();
        const rows = parseCSV(text);
        POLITICIANS = rows.map((row, i) => transformRow(row, i + 1)).filter(p => p.name);
        STATES_DATA = computeStatesData(POLITICIANS);
        NATIONAL_STATS = computeNationalStats(POLITICIANS);
        console.log(`✅ NetaLife: Loaded ${POLITICIANS.length} MPs from PRS India (${DATA_PERIOD.end})`);
        return true;
    } catch (err) {
        console.error('❌ Failed to load MP data:', err);
        return false;
    }
}

function getPartyColor(partyFull) {
    return PARTY_COLORS[partyFull] || '#' + Math.floor(Math.abs(Math.sin(partyFull.length * 2654435761) * 16777215) % 16777215).toString(16).padStart(6, '0');
}
