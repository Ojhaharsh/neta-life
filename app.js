// ============================================
// NetaLife — Main Application (Real Data + Phase 1.5 Fairness Fixes)
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    initNavbar();
    initMobileMenu();
    showLoadingState();

    const ok = await fetchRealData();
    if (!ok) { showError(); return; }

    hideLoadingState();
    showDataPeriodBanner();
    updateHeroStats();
    updateNationalStats();
    initSearch();
    initLeaderboard();
    initPromises();
    initStates();
    initMethodology();
    initScrollAnimations();
});

// --- Data period banner (transparency) ---
function showDataPeriodBanner() {
    const banner = document.getElementById('data-period-banner');
    if (banner) {
        banner.innerHTML = `
            <span class="dpb-icon">📅</span>
            <span class="dpb-text">
                <strong>Data Period:</strong> ${DATA_PERIOD.start} – ${DATA_PERIOD.end} &nbsp;|&nbsp;
                <strong>Sessions:</strong> ${DATA_PERIOD.sessions} &nbsp;|&nbsp;
                <strong>Source:</strong> <a href="https://prsindia.org" target="_blank">${DATA_PERIOD.source}</a>
            </span>
        `;
        banner.style.display = 'flex';
    }
}

// --- Loading state ---
function showLoadingState() {
    document.querySelectorAll('.stat-value').forEach(el => { el.textContent = '...'; });
}
function hideLoadingState() {}
function showError() {
    const hero = document.querySelector('.hero-subtitle');
    if (hero) hero.textContent = 'Failed to load data. Please refresh or check your connection.';
}

// --- Update hero counters ---
function updateHeroStats() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(el => {
        const key = el.dataset.count;
        let val;
        if (key === '543') val = NATIONAL_STATS.totalMPs || 543;
        else if (key === '4036') val = 4036;
        else if (key === '245') val = 245;
        else val = parseInt(key);
        animateCount(el, val);
    });
}

function animateCount(el, target) {
    const duration = 1500, start = performance.now();
    function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// --- Update national stats with real data ---
function updateNationalStats() {
    const s = NATIONAL_STATS;
    const cards = document.querySelectorAll('.stat-card');
    const data = [
        { value: s.avgAtt + '%', label: 'Average Parliament Attendance', badge: s.avgAtt < 70 ? 'Below Average' : 'Good', badgeClass: s.avgAtt < 70 ? 'stat-badge-warn' : 'stat-badge-success', icon: '🏛️', detail: DATA_PERIOD.sessions, bar: s.avgAtt },
        { value: s.totalQuestions.toLocaleString(), label: 'Total Questions Raised', badge: 'Verified', badgeClass: 'stat-badge-info', icon: '❓', detail: 'By non-minister, non-exempt MPs' },
        { value: s.totalDebates.toLocaleString(), label: 'Total Debate Participations', badge: 'Verified', badgeClass: 'stat-badge-info', icon: '🗣️', detail: DATA_PERIOD.start + ' – ' + DATA_PERIOD.end },
        { value: s.women, label: 'Women MPs', badge: Math.round(s.women / s.totalMPs * 100) + '%', badgeClass: 'stat-badge-warn', icon: '👩', detail: 'Of ' + s.totalMPs + ' total MPs' },
        { value: s.ministerCount, label: 'Ministers (Graded N/A)', badge: 'Exempt', badgeClass: 'stat-badge-info', icon: '🏅', detail: 'PRS does not track minister activity' },
        { value: s.uniqueParties, label: 'Political Parties', badge: 'All Tracked', badgeClass: 'stat-badge-success', icon: '🏳️', detail: 'Equal treatment regardless of party' },
    ];
    cards.forEach((card, i) => {
        if (!data[i]) return;
        const d = data[i];
        card.querySelector('.stat-icon').textContent = d.icon;
        card.querySelector('.stat-value').textContent = d.value;
        card.querySelector('.stat-label').textContent = d.label;
        const badge = card.querySelector('.stat-badge');
        badge.textContent = d.badge; badge.className = 'stat-badge ' + d.badgeClass;
        card.querySelector('.stat-detail').textContent = d.detail;
        const bar = card.querySelector('.stat-bar-fill');
        if (bar && d.bar) bar.style.width = d.bar + '%';
    });
}

// --- Navbar ---
function initNavbar() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
}

// --- Mobile Menu ---
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    btn.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => menu.classList.remove('open')));
}

// --- Search ---
function initSearch() {
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');
    const filters = document.querySelectorAll('.filter-chip');
    let activeFilter = 'all';

    filters.forEach(f => f.addEventListener('click', () => {
        filters.forEach(x => x.classList.remove('active'));
        f.classList.add('active');
        activeFilter = f.dataset.filter;
        if (input.value.trim()) performSearch(input.value, activeFilter);
    }));

    btn.addEventListener('click', () => performSearch(input.value, activeFilter));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') performSearch(input.value, activeFilter); });
    input.addEventListener('input', () => { if (!input.value.trim()) hideResults(); });
}

function performSearch(query, filter) {
    query = query.trim().toLowerCase();
    if (!query) { hideResults(); return; }
    let results = POLITICIANS.filter(p => {
        const match = p.name.toLowerCase().includes(query) ||
            p.constituency.toLowerCase().includes(query) ||
            p.state.toLowerCase().includes(query) ||
            p.party.toLowerCase().includes(query) ||
            p.partyFull.toLowerCase().includes(query);
        if (!match) return false;
        if (filter === 'mp') return true;
        if (filter === 'state') return p.state.toLowerCase().includes(query);
        if (filter === 'party') return p.party.toLowerCase().includes(query) || p.partyFull.toLowerCase().includes(query);
        return true;
    });
    showResults(results.slice(0, 50));
}

function showResults(results) {
    const section = document.getElementById('search-results');
    const grid = document.getElementById('results-grid');
    section.style.display = 'block';
    if (!results.length) {
        grid.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-muted);grid-column:1/-1;">No politicians found. Try a different search.</div>';
    } else {
        grid.innerHTML = results.map(p => createPoliticianCard(p)).join('');
        grid.querySelectorAll('.politician-card').forEach(card => {
            card.addEventListener('click', () => showProfile(parseInt(card.dataset.id)));
        });
    }
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResults() { document.getElementById('search-results').style.display = 'none'; }

function createPoliticianCard(p) {
    const color = getPartyColor(p.partyFull);
    const gc = getGradeClass(p.grade);
    const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const isExempt = p.isExempt;
    const attDisplay = isExempt ? 'N/A' : (p.attendance + '%');
    const qDisplay = p.questionsRaised;
    const dDisplay = p.debatesParticipated;
    const roleTag = p.isMinister ? ' · Minister' : (p.specialRole === 'lop' ? ' · LoP' : (p.specialRole === 'speaker' ? ' · Speaker' : ''));

    return `<div class="politician-card" data-id="${p.id}">
        <div class="pc-header">
            <div class="pc-avatar" style="background:${color}">${initials}</div>
            <div class="pc-info">
                <div class="pc-name">${p.name}</div>
                <div class="pc-constituency">📍 ${p.constituency}, ${p.state}</div>
                <span class="pc-party" style="background:${color}22;color:${color}">${p.party}${roleTag}</span>
            </div>
            <div class="pc-grade ${gc}">${p.grade}</div>
        </div>
        <div class="pc-metrics">
            <div class="pc-metric"><span class="pc-metric-value">${attDisplay}</span><span class="pc-metric-label">Attendance</span></div>
            <div class="pc-metric"><span class="pc-metric-value">${qDisplay}</span><span class="pc-metric-label">Questions</span></div>
            <div class="pc-metric"><span class="pc-metric-value">${dDisplay}</span><span class="pc-metric-label">Debates</span></div>
        </div>
    </div>`;
}

function getGradeClass(grade) {
    if (['M', 'LoP', 'SP', 'DSP'].includes(grade)) return 'grade-exempt';
    if (grade.startsWith('A')) return 'grade-a';
    if (grade.startsWith('B')) return 'grade-b';
    if (grade.startsWith('C')) return 'grade-c';
    if (grade.startsWith('D')) return 'grade-d';
    return 'grade-f';
}

// --- Profile ---
function showProfile(id) {
    const p = POLITICIANS.find(x => x.id === id);
    if (!p) return;
    const section = document.getElementById('profile-section');
    const card = document.getElementById('profile-card');
    const color = getPartyColor(p.partyFull);
    const gc = getGradeClass(p.grade);
    const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    // Context notes for exempt MPs
    let exemptNote = '';
    if (p.isMinister) {
        exemptNote = `<div class="exempt-note exempt-minister">
            ℹ️ <strong>This MP is a Minister.</strong> Ministers represent the government in debates, so PRS India does not report their individual participation metrics. Attendance, questions, and debate data are not applicable. This is standard PRS methodology, not a data gap.
        </div>`;
    } else if (p.specialRole === 'lop') {
        exemptNote = `<div class="exempt-note exempt-lop">
            ℹ️ <strong>This MP is the Leader of Opposition.</strong> Per parliamentary convention, the LoP does not sign the attendance register. The 0% attendance shown by PRS is a methodological artifact, not actual absence. This MP participates actively in debates and questions as shown below.
        </div>`;
    } else if (p.specialRole === 'speaker' || p.specialRole === 'deputy-speaker') {
        exemptNote = `<div class="exempt-note exempt-speaker">
            ℹ️ <strong>This MP is the ${p.specialRole === 'speaker' ? 'Speaker' : 'Deputy Speaker'} of Lok Sabha.</strong> The Speaker presides over parliamentary proceedings and does not participate as a regular MP. Activity data is not applicable.
        </div>`;
    }

    const gradeExpl = p.isExempt
        ? p.gradeLabel
        : `Score: ${p.score}/100`;

    card.innerHTML = `
    <div class="profile-data-period">📅 Data Period: ${DATA_PERIOD.start} – ${DATA_PERIOD.end} (${DATA_PERIOD.sessions})</div>
    <div class="profile-top">
        <div class="profile-avatar" style="background:${color}">${initials}</div>
        <div class="profile-info">
            <div class="profile-name">${p.name}</div>
            <div class="profile-meta">
                <span class="profile-meta-item">📍 ${p.constituency}, ${p.state}</span>
                <span class="profile-meta-item" style="color:${color}">● ${p.partyFull}</span>
                <span class="profile-meta-item">🎓 ${p.education}</span>
                <span class="profile-meta-item">🗳️ ${p.terms} (since ${p.startOfTerm})</span>
                <span class="profile-meta-item">👤 ${p.gender}, Age ${p.age}</span>
                ${p.endOfTerm === 'In Office' ? '<span class="profile-meta-item" style="color:var(--success)">✅ Currently In Office</span>' : `<span class="profile-meta-item" style="color:var(--danger)">Term ended: ${p.endOfTerm}</span>`}
            </div>
        </div>
        <div class="profile-grade-box ${gc}">
            <span class="profile-grade-letter">${p.grade}</span>
            <span class="profile-grade-label">${gradeExpl}</span>
        </div>
    </div>
    ${exemptNote}
    <div class="profile-metrics-grid">
        ${pm('Attendance', p.isExempt ? 'Exempt' : p.attendance + '%', p.isExempt ? 0 : p.attendance, 'var(--accent-1)')}
        ${pm('Questions Raised', p.questionsRaised, Math.min((p.questionsRaised || 0) / 1, 100), 'var(--accent-2)')}
        ${pm('Debates', p.debatesParticipated, Math.min((p.debatesParticipated || 0) * 4, 100), 'var(--accent-3)')}
        ${pm('Private Member Bills', p.billsIntroduced, Math.min(p.billsIntroduced * 25, 100), 'var(--success)')}
        ${pm('Age', p.age, (p.age / 100) * 100, 'var(--text-secondary)')}
        ${pm('Education', p.education, 50, 'var(--info)')}
    </div>
    
    ${renderDetails(p)}

    <div class="profile-source-note">
        <h4>📋 Data Source & Transparency</h4>
        <p>${p.comment || 'No additional notes from PRS.'}</p>
        <p class="profile-source-meta">Source: ${DATA_PERIOD.source} · License: ${DATA_PERIOD.license} · 
        <a href="https://prsindia.org/mptrack/18th-lok-sabha/${p.name.toLowerCase().replace(/\s+/g, '-')}" target="_blank">View on PRS India →</a></p>
    </div>`;

    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function pm(label, value, pct, color) {
    return `<div class="profile-metric-card">
        <div class="pm-value" style="color:${color}">${value}</div>
        <div class="pm-label">${label}</div>
        <div class="pm-bar"><div class="pm-bar-fill" style="width:${Math.max(pct, 2)}%;background:${color}"></div></div>
    </div>`;
}

function renderDetails(p) {
    if (!MP_DETAILS[p.prsId]) return '';
    const details = MP_DETAILS[p.prsId];
    
    let html = '';
    
    if (details.debates && details.debates.length > 0) {
        html += `<div class="details-section">
            <h4 style="margin-bottom: 12px; font-size: 1.1rem;">🎙️ Recent Debates</h4>
            <div class="details-list">
                ${details.debates.map(d => `
                    <div class="details-item" style="background: rgba(255,255,255,0.03); border-left: 3px solid var(--accent-3); padding: 12px; margin-bottom: 8px; border-radius: 4px;">
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">${d.date} · ${d.type}</div>
                        <div style="font-size: 0.95rem;">${d.title}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }
    
    if (details.questions && details.questions.length > 0) {
        html += `<div class="details-section" style="margin-top: 24px;">
            <h4 style="margin-bottom: 12px; font-size: 1.1rem;">❓ Recent Questions</h4>
            <div class="details-list">
                ${details.questions.map(q => `
                    <div class="details-item" style="background: rgba(255,255,255,0.03); border-left: 3px solid var(--accent-2); padding: 12px; margin-bottom: 8px; border-radius: 4px;">
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">${q.date} · ${q.ministry} · ${q.type}</div>
                        <div style="font-size: 0.95rem;">${q.title}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }
    
    if (html) {
        html = `<div class="profile-details-container" style="margin-top: 32px;">${html}</div>`;
    }
    
    return html;
}

document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('profile-section').style.display = 'none';
});

// --- Leaderboard ---
function initLeaderboard() {
    const tabs = document.querySelectorAll('.lb-tab');
    renderLeaderboard('top');
    tabs.forEach(tab => tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderLeaderboard(tab.dataset.tab);
    }));
}

function renderLeaderboard(tab) {
    const table = document.getElementById('leaderboard-table');
    // Exclude ministers AND special roles (LoP, Speaker) — they have different duties
    const gradable = POLITICIANS.filter(p => !p.isExempt);
    let sorted;
    switch (tab) {
        case 'top': sorted = [...gradable].sort((a, b) => (b.score || 0) - (a.score || 0)); break;
        case 'bottom': sorted = [...gradable].sort((a, b) => (a.score || 0) - (b.score || 0)); break;
        case 'attendance': sorted = [...gradable].sort((a, b) => (b.attendance || 0) - (a.attendance || 0)); break;
        case 'funds': sorted = [...gradable].sort((a, b) => b.questionsRaised - a.questionsRaised); break;
        default: sorted = gradable;
    }
    sorted = sorted.slice(0, 25);

    table.innerHTML = `
    <div class="lb-note">Excludes ${NATIONAL_STATS.ministerCount} Ministers + LoP + Speaker (exempt from grading — <a href="#methodology-section">see methodology</a>)</div>
    <div class="lb-row lb-header"><span>#</span><span>Politician</span><span>Attendance</span><span>Questions</span><span>Debates</span><span>Grade</span></div>
    ${sorted.map((p, i) => {
        const color = getPartyColor(p.partyFull);
        const gc = getGradeClass(p.grade);
        const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        const rc = i < 3 ? ` lb-rank-${i + 1}` : '';
        return `<div class="lb-row" onclick="showProfile(${p.id})">
            <span class="lb-rank${rc}">${i + 1}</span>
            <div class="lb-name-cell">
                <div class="lb-mini-avatar" style="background:${color}">${initials}</div>
                <div><div class="lb-name">${p.name}</div><div class="lb-constituency">${p.constituency} · ${p.party}</div></div>
            </div>
            <span class="lb-value">${p.attendance}%</span>
            <span class="lb-value">${p.questionsRaised}</span>
            <span class="lb-value">${p.debatesParticipated}</span>
            <span class="lb-value"><span class="pc-grade ${gc}" style="width:36px;height:36px;font-size:0.9rem;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;">${p.grade}</span></span>
        </div>`;
    }).join('')}`;
}

// --- Promises ---
function initPromises() {
    const filters = document.querySelectorAll('.promise-filter-btn');
    renderPromises('all');
    filters.forEach(f => f.addEventListener('click', () => {
        filters.forEach(x => x.classList.remove('active'));
        f.classList.add('active');
        renderPromises(f.dataset.status);
    }));
}

function renderPromises(status) {
    const grid = document.getElementById('promises-grid');
    const filtered = status === 'all' ? MANIFESTO_PROMISES : MANIFESTO_PROMISES.filter(p => p.status === status);
    const statusConfig = { fulfilled: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Fulfilled' }, 'in-progress': { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', label: 'In Progress' }, broken: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'Broken' }, 'not-started': { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Not Started' } };
    
    const partyColorMap = {
        'BJP': PARTY_COLORS['Bharatiya Janata Party'],
        'INC': PARTY_COLORS['Indian National Congress'],
        'AAP': PARTY_COLORS['Aam Aadmi Party'],
        'TMC': PARTY_COLORS['All India Trinamool Congress'],
        'DMK': PARTY_COLORS['Dravida Munnetra Kazhagam'],
    };
    
    grid.innerHTML = `<div class="promise-disclaimer">⚠️ Promise tracking is editorially maintained with cited evidence. Opposition parties' national promises are marked "Not Started" because they are not in power at the Centre — this is factual, not editorial. <a href="#methodology-section">See methodology</a>.</div>` + 
    filtered.map(p => {
        const sc = statusConfig[p.status] || statusConfig['not-started'];
        const pc = partyColorMap[p.party] || '#666';
        return `<div class="promise-card">
            <div class="pmc-header"><span class="pmc-party" style="background:${pc}22;color:${pc}">${p.party}</span><span class="pmc-category">${p.category}</span></div>
            <div class="pmc-promise">${p.promise}</div>
            <div class="pmc-evidence">📋 ${p.evidence}</div>
            <div class="pmc-footer"><span class="pmc-date">Promised: ${p.datePromised} · Updated: ${p.lastUpdated}</span><span class="promise-status-label" style="background:${sc.bg};color:${sc.color}">${sc.label}</span></div>
        </div>`;
    }).join('');
}

// --- States ---
function initStates() {
    const grid = document.getElementById('state-cards-grid');
    grid.innerHTML = STATES_DATA.slice(0, 20).map(s => `
    <div class="state-card">
        <div class="sc-name">${s.name}</div>
        <div class="sc-code">${s.mps} MPs in Lok Sabha</div>
        <div class="sc-stats">
            <div class="sc-stat"><span class="sc-stat-value">${s.avgAttendance}%</span><span class="sc-stat-label">Avg Attendance</span></div>
            <div class="sc-stat"><span class="sc-stat-value" style="font-size:0.75rem">${s.topPerformer.split(' ').slice(0, 2).join(' ')}</span><span class="sc-stat-label">Top Performer</span></div>
        </div>
    </div>`).join('');
}

// --- Methodology ---
function initMethodology() {
    const section = document.getElementById('methodology-section');
    if (!section) return;
    const content = section.querySelector('.methodology-content');
    if (!content) return;
    content.innerHTML = `
    <div class="method-grid">
        <div class="method-card">
            <h4>📊 Grading Formula</h4>
            <p>Composite score (0-100) computed as:</p>
            <ul>
                <li><strong>Attendance:</strong> 40% weight</li>
                <li><strong>Questions Raised:</strong> 30% weight (100 questions = max)</li>
                <li><strong>Debate Participation:</strong> 20% weight (25 debates = max)</li>
                <li><strong>Private Member Bills:</strong> 10% weight (each bill = 25 pts)</li>
            </ul>
            <p>Grades: A+ (≥85), A (≥75), B+ (≥65), B (≥55), C+ (≥45), C (≥35), D (≥25), F (&lt;25)</p>
        </div>
        <div class="method-card">
            <h4>🚫 Exempt Categories</h4>
            <p>These MPs are <strong>excluded from grading</strong> (not scored, not ranked):</p>
            <ul>
                <li><strong>Ministers (${NATIONAL_STATS.ministerCount}):</strong> PRS does not track individual minister participation</li>
                <li><strong>Leader of Opposition:</strong> Does not sign attendance register per parliamentary convention</li>
                <li><strong>Speaker/Dy. Speaker:</strong> Preside over house, different constitutional role</li>
            </ul>
            <p>This applies equally regardless of which party holds these positions.</p>
        </div>
        <div class="method-card">
            <h4>📅 Data Freshness</h4>
            <p><strong>Current coverage:</strong> ${DATA_PERIOD.start} – ${DATA_PERIOD.end}</p>
            <p><strong>Sessions included:</strong> ${DATA_PERIOD.sessions}</p>
            <p><strong>Last updated:</strong> ${DATA_PERIOD.lastUpdated}</p>
            <p>Data is sourced from PRS Legislative Research and may not include the most recent sessions. Numbers will be lower than PRS's live website which has newer session data.</p>
        </div>
        <div class="method-card">
            <h4>⚖️ Neutrality Pledge</h4>
            <ul>
                <li>Same algorithm for <strong>every MP</strong>, every party</li>
                <li>No manual adjustments or editorial overrides on scores</li>
                <li>Promise tracking covers ruling + opposition parties equally</li>
                <li>All data linked to verifiable primary sources</li>
                <li>Open methodology — scrutinize our approach</li>
            </ul>
        </div>
    </div>`;
}

// --- Scroll Animations ---
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.stat-card, .politician-card, .promise-card, .state-card, .about-card, .method-card').forEach(el => {
        el.style.opacity = '0'; el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}
