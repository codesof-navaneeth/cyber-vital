const state = { route: 'home', tracks: [], query: '' };
const view = document.querySelector('#view');
const fileInput = document.querySelector('#fileInput');

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderEmpty(title, text, button = true) {
  return `<div class="empty"><div class="empty-inner"><div class="empty-icon">◈</div><h3>${title}</h3><p>${text}</p>${button ? '<button class="primary" id="emptyImport">＋ Import Music</button>' : ''}</div></div>`;
}

function trackList(tracks) {
  if (!tracks.length) return renderEmpty('Your library is empty', 'Import music stored on your device. CYBER//TUNE keeps your library local.', true);
  return `<div class="track-list">${tracks.map((t, i) => `<button class="track" data-track="${i}" aria-label="Play ${escapeHtml(t.title)}"><span class="track-art">♪</span><span><span class="track-title">${escapeHtml(t.title)}</span><span class="track-sub">${escapeHtml(t.artist || 'Unknown artist')} · ${escapeHtml(t.album || 'Unknown album')}</span></span><span class="track-time">${formatDuration(t.duration)}</span></button>`).join('')}</div>`;
}

function renderHome() {
  view.innerHTML = `<div class="hero"><p class="eyebrow">Private audio / local-first</p><h1>Your music.<br>Nothing else.</h1><p>CYBER//TUNE is a personal music terminal built around the files you already own. No feeds, no streaming service, no noise.</p><button class="primary" id="heroImport">＋ Import Music</button></div><section class="section"><div class="section-head"><div><p class="eyebrow">Library</p><h2>${state.tracks.length ? 'Recently added' : 'Ready when you are'}</h2></div><span class="count">${state.tracks.length} TRACKS</span></div>${state.tracks.length ? trackList(state.tracks.slice(0, 8)) : renderEmpty('Start your collection', 'Choose audio files from your device. Your music never needs to leave it.', true)}</section>`;
}

function renderLibrary() {
  view.innerHTML = `<div class="library-head"><div><p class="eyebrow">Collection</p><h1>Library</h1></div><span class="count">${state.tracks.length} TRACKS</span></div><div class="tabs"><button class="tab is-active">Songs</button><button class="tab">Albums</button><button class="tab">Artists</button><button class="tab">Folders</button></div><section class="section">${trackList(state.tracks)}</section>`;
}

function renderSearch() {
  const q = state.query.trim().toLowerCase();
  const results = q ? state.tracks.filter(t => [t.title,t.artist,t.album,t.genre,t.folder].some(v => String(v || '').toLowerCase().includes(q))) : [];
  view.innerHTML = `<div class="hero"><p class="eyebrow">Local index</p><h1>Search.</h1><div class="search-wrap"><span class="search-symbol">⌕</span><input class="search-input" id="searchInput" value="${escapeHtml(state.query)}" placeholder="Search your music…" autocomplete="off" aria-label="Search local music"></div></div><section class="section">${q ? (results.length ? trackList(results) : renderEmpty('No matches', `Nothing in your local library matches “${escapeHtml(state.query)}”.`, false)) : renderEmpty('Search your library', 'Search titles, artists, albums and other local metadata.', false)}</section>`;
  document.querySelector('#searchInput')?.focus();
}

function render() {
  document.querySelectorAll('[data-route]').forEach(btn => {
    const active = btn.dataset.route === state.route;
    btn.classList.toggle('is-active', active);
    if (btn.closest('.sidebar')) btn.setAttribute('aria-current', active ? 'page' : 'false');
  });
  if (state.route === 'home') renderHome();
  if (state.route === 'library') renderLibrary();
  if (state.route === 'search') renderSearch();
}

function openImporter() { fileInput.click(); }

function importFiles(files) {
  const accepted = [...files].filter(file => file.type.startsWith('audio/') || /\.(mp3|wav|flac|m4a|aac|ogg)$/i.test(file.name));
  const newTracks = accepted.map(file => ({
    id: `${file.name}-${file.size}-${file.lastModified}`,
    title: file.name.replace(/\.[^.]+$/, ''),
    artist: '', album: '', genre: '', folder: '', duration: NaN,
    fileName: file.name
  }));
  const existing = new Set(state.tracks.map(t => t.id));
  state.tracks.push(...newTracks.filter(t => !existing.has(t.id)));
  render();
}

document.addEventListener('click', event => {
  const route = event.target.closest('[data-route]')?.dataset.route;
  if (route) { state.route = route; render(); return; }
  if (event.target.closest('#importButton, #heroImport, #emptyImport')) { openImporter(); return; }
  const track = event.target.closest('[data-track]');
  if (track) console.info('Playback foundation ready for track', state.tracks[Number(track.dataset.track)]);
});

document.addEventListener('input', event => {
  if (event.target.id === 'searchInput') { state.query = event.target.value; renderSearch(); }
});

fileInput.addEventListener('change', event => {
  importFiles(event.target.files);
  event.target.value = '';
});

render();
