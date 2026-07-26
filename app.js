// ===== STATE =====
let mapping = {};
let singleWordMapping = {}; // New: word ? Chunom character
let allKeys = [];
let filteredKeys = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 20;
let currentView = 'grid';
let selectedChars = [];
let currentSearchMode = 'word'; // 'word' or 'phrase'

// ===== DOM REFS =====
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const pagination = document.getElementById('pagination');
const resultCount = document.getElementById('resultCount');
const selectedDisplay = document.getElementById('selectedDisplay');
const selectedSection = document.getElementById('selectedSection');
const clearSelectedBtn = document.getElementById('clearSelected');
const totalEntriesEl = document.getElementById('totalEntries');
const totalCharactersEl = document.getElementById('totalCharacters');
const selectedCountEl = document.getElementById('selectedCount');

// ===== BUILD SINGLE WORD DICTIONARY =====
function buildSingleWordDictionary(data) {
  console.log('?? Building single-word dictionary...');
  const result = {};
  
  Object.keys(data).forEach(phrase => {
    const words = phrase.split(' ');
    const chunomChars = data[phrase];
    
    // For each word in the phrase, map it to the Chunom characters
    // But we need to handle cases where multiple words map to multiple characters
    // We'll use the first character for the first word, second for second, etc.
    words.forEach((word, index) => {
      const wordLower = word.toLowerCase();
      const chars = chunomChars.join(' ').split(' ');
      
      // If we have a character for this position, use it
      if (chars[index]) {
        // If multiple words map to same Chunom, we'll keep the first
        if (!result[wordLower]) {
          result[wordLower] = chars[index];
        }
      }
    });
  });
  
  // Also add single-word entries from the JSON
  Object.keys(data).forEach(phrase => {
    const words = phrase.split(' ');
    if (words.length === 1) {
      const word = words[0].toLowerCase();
      const chars = data[phrase];
      if (chars && chars.length > 0) {
        result[word] = chars[0];
      }
    }
  });
  
  console.log(`? Built ${Object.keys(result).length} single-word mappings`);
  return result;
}

// ===== LOAD DATA =====
async function loadData() {
  try {
    console.log('?? Loading mapping_chunom.json...');
    
    const response = await fetch("mapping_chunom.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('? Data loaded successfully!', Object.keys(data).length, 'entries');
    
    mapping = data;
    allKeys = Object.keys(mapping);
    
    // Build single-word dictionary
    singleWordMapping = buildSingleWordDictionary(data);
    
    // Update stats
    totalEntriesEl.textContent = allKeys.length;
    let totalChars = 0;
    allKeys.forEach(key => {
      totalChars += mapping[key].length;
    });
    totalCharactersEl.textContent = totalChars;
    
    // Show all entries initially
    filteredKeys = [...allKeys];
    renderResults();
    
    console.log(`? Loaded ${allKeys.length} entries, ${totalChars} characters`);
    console.log(`?? Single-word mappings: ${Object.keys(singleWordMapping).length}`);
    
    // Show some examples
    const examples = ['truy?n', 'hoa', 'ai', 'tr?i', 'nu?c'];
    const found = examples.filter(w => singleWordMapping[w]);
    console.log('?? Examples:', found.map(w => `${w} ? ${singleWordMapping[w]}`));
    
  } catch (error) {
    console.error('? Error loading JSON:', error);
    
    resultsContainer.innerHTML = `
      <div style="text-align:center;padding:40px;color:#ef4444;">
        <div style="font-size:3rem;margin-bottom:16px;">??</div>
        <h3>Failed to load dictionary</h3>
        <p style="color:#6b7280;">${error.message}</p>
        <button onclick="location.reload()" style="margin-top:16px;padding:10px 24px;border:none;border-radius:8px;background:#4f46e5;color:white;cursor:pointer;font-size:1rem;">
          ?? Retry
        </button>
      </div>
    `;
  }
}

// ===== SEARCH - SINGLE WORD =====
function searchSingleWord(query) {
  const searchTerm = query.trim().toLowerCase();
  
  if (searchTerm === '') {
    filteredKeys = [...allKeys];
    return;
  }
  
  // First, try to find exact match in single-word mapping
  if (singleWordMapping[searchTerm]) {
    // Show just the single character
    const chunomChar = singleWordMapping[searchTerm];
    displaySingleResult(searchTerm, chunomChar);
    return;
  }
  
  // Try partial match - find words that start with the search term
  const matches = Object.keys(singleWordMapping).filter(word => 
    word.includes(searchTerm) || searchTerm.includes(word)
  );
  
  if (matches.length > 0) {
    const results = matches.slice(0, 50); // Limit to 50 results
    displayMultipleResults(results);
    return;
  }
  
  // Fallback: search in full phrases
  const phraseMatches = allKeys.filter(key => 
    key.toLowerCase().includes(searchTerm)
  );
  
  if (phraseMatches.length > 0) {
    filteredKeys = phraseMatches;
    renderResults();
    return;
  }
  
  // No results
  filteredKeys = [];
  renderResults();
}

// ===== DISPLAY SINGLE RESULT =====
function displaySingleResult(word, chunomChar) {
  resultsContainer.innerHTML = `
    <div style="padding:20px;text-align:center;">
      <div style="font-size:1.2rem;color:#6b7280;margin-bottom:8px;">
        ${word} ? 
        <span style="font-family:'Noto Serif TC','Han Nom',serif;font-size:3rem;color:#4f46e5;font-weight:bold;display:inline-block;margin:0 10px;">
          ${escapeHtml(chunomChar)}
        </span>
      </div>
      <button onclick="addCharacter('${escapeString(chunomChar)}')" style="margin-top:12px;padding:10px 24px;border:none;border-radius:8px;background:#4f46e5;color:white;cursor:pointer;font-size:1rem;">
        ? Add to Selection
      </button>
      <div style="margin-top:16px;font-size:0.85rem;color:#9ca3af;">
        <span id="searchInfo"></span>
      </div>
    </div>
  `;
  
  // Show info about where this came from
  const sources = Object.keys(mapping).filter(key => 
    key.toLowerCase().includes(word) && 
    mapping[key].join(' ').includes(chunomChar)
  );
  
  document.getElementById('searchInfo').textContent = 
    sources.length > 0 ? `Found in ${sources.length} phrase(s)` : '';
  
  pagination.innerHTML = '';
  resultCount.textContent = `1 match for "${word}"`;
}

// ===== DISPLAY MULTIPLE RESULTS =====
function displayMultipleResults(words) {
  let html = `
    <div style="padding:10px 0;">
      <div style="font-size:0.9rem;color:#6b7280;margin-bottom:12px;">
        Found ${words.length} words matching your search
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;">
  `;
  
  words.forEach(word => {
    const chunomChar = singleWordMapping[word];
    html += `
      <div style="background:#f8f7ff;border:1px solid #e5e7eb;border-radius:10px;padding:12px 16px;text-align:center;cursor:pointer;transition:all 0.2s;" 
           onclick="addCharacter('${escapeString(chunomChar)}')"
           onmouseover="this.style.borderColor='#4f46e5';this.style.background='#f0eeff';"
           onmouseout="this.style.borderColor='#e5e7eb';this.style.background='#f8f7ff';">
        <div style="font-size:0.9rem;color:#1a1a2e;">${escapeHtml(word)}</div>
        <div style="font-family:'Noto Serif TC','Han Nom',serif;font-size:2rem;color:#4f46e5;margin-top:4px;">
          ${escapeHtml(chunomChar)}
        </div>
      </div>
    `;
  });
  
  html += '</div></div>';
  resultsContainer.innerHTML = html;
  pagination.innerHTML = '';
  resultCount.textContent = `${words.length} matches`;
}

// ===== RENDER RESULTS =====
function renderResults() {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = filteredKeys.slice(start, end);
  
  resultCount.textContent = `${filteredKeys.length} entries`;
  
  if (filteredKeys.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align:center;padding:40px;color:#6b7280;">
        <div style="font-size:3rem;margin-bottom:16px;">??</div>
        <h3>No results found</h3>
        <p>Try a different search term</p>
        <p style="font-size:0.85rem;color:#9ca3af;margin-top:8px;">
          ?? Try typing: <strong>truy?n</strong>, <strong>hoa</strong>, <strong>ai</strong>, <strong>tr?i</strong>, <strong>nu?c</strong>
        </p>
      </div>
    `;
    pagination.innerHTML = '';
    return;
  }
  
  if (currentView === 'grid') {
    renderGridView(pageItems);
  } else if (currentView === 'list') {
    renderListView(pageItems);
  } else {
    renderAllView(pageItems);
  }
  
  renderPagination();
}

// ===== GRID VIEW =====
function renderGridView(items) {
  let html = '<div class="grid-view">';
  items.forEach(key => {
    const chars = mapping[key];
    html += `
      <div class="entry-card" onclick="handleEntryClick('${escapeString(key)}')">
        <span class="quoc-ngu">${escapeHtml(key)}</span>
        <span class="chunom">${chars.map(c => `<span onclick="event.stopPropagation();addCharacter('${escapeString(c)}')" style="cursor:pointer;padding:0 3px;">${escapeHtml(c)}</span>`).join(' ')}</span>
      </div>
    `;
  });
  html += '</div>';
  resultsContainer.innerHTML = html;
}

// ===== LIST VIEW =====
function renderListView(items) {
  let html = '<div class="list-view">';
  items.forEach(key => {
    const chars = mapping[key];
    html += `
      <div class="entry-row" onclick="handleEntryClick('${escapeString(key)}')">
        <span class="quoc-ngu">${escapeHtml(key)}</span>
        <span class="chunom">${chars.map(c => `<span onclick="event.stopPropagation();addCharacter('${escapeString(c)}')" style="cursor:pointer;padding:0 4px;">${escapeHtml(c)}</span>`).join(' ')}</span>
      </div>
    `;
  });
  html += '</div>';
  resultsContainer.innerHTML = html;
}

// ===== ALL VIEW =====
function renderAllView(items) {
  let html = '<div class="grid-view" style="grid-template-columns:1fr;">';
  items.forEach(key => {
    const chars = mapping[key];
    html += `
      <div class="entry-card" onclick="handleEntryClick('${escapeString(key)}')" style="flex-wrap:wrap;">
        <span class="quoc-ngu">${escapeHtml(key)}</span>
        <span class="chunom chunom-small" style="font-size:1.2rem;">${chars.map(c => `<span onclick="event.stopPropagation();addCharacter('${escapeString(c)}')" style="cursor:pointer;padding:0 3px;">${escapeHtml(c)}</span>`).join(' ')}</span>
      </div>
    `;
  });
  html += '</div>';
  resultsContainer.innerHTML = html;
}

// ===== PAGINATION =====
function renderPagination() {
  const totalPages = Math.ceil(filteredKeys.length / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let html = '';
  html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">?</button>`;
  
  const maxVisible = 7;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  if (startPage > 1) {
    html += `<button onclick="goToPage(1)">1</button>`;
    if (startPage > 2) html += `<button disabled>…</button>`;
  }
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += `<button disabled>…</button>`;
    html += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }
  
  html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">?</button>`;
  pagination.innerHTML = html;
}

// ===== NAVIGATION =====
function goToPage(page) {
  currentPage = page;
  renderResults();
  document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== SEARCH HANDLER =====
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  currentPage = 1;
  searchSingleWord(query);
});

// ===== VIEW TOGGLES =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = btn.dataset.view;
    currentPage = 1;
    renderResults();
  });
});

// ===== CHARACTER SELECTION =====
function addCharacter(char) {
  if (!selectedChars.includes(char)) {
    selectedChars.push(char);
    updateSelectedDisplay();
  }
}

function handleEntryClick(key) {
  const chars = mapping[key];
  chars.forEach(char => {
    if (!selectedChars.includes(char)) {
      selectedChars.push(char);
    }
  });
  updateSelectedDisplay();
}

function removeCharacter(char) {
  selectedChars = selectedChars.filter(c => c !== char);
  updateSelectedDisplay();
}

function clearSelected() {
  selectedChars = [];
  updateSelectedDisplay();
}

function updateSelectedDisplay() {
  if (selectedChars.length === 0) {
    selectedDisplay.textContent = '';
    selectedSection.classList.remove('has-items');
    selectedCountEl.textContent = '0';
    return;
  }
  
  selectedSection.classList.add('has-items');
  selectedCountEl.textContent = selectedChars.length;
  
  selectedDisplay.innerHTML = selectedChars.map(char => 
    `<span style="display:inline-block;margin:4px 6px;padding:4px 12px;background:#e0e7ff;border-radius:8px;cursor:pointer;position:relative;" 
          onclick="removeCharacter('${escapeString(char)}')" 
          title="Click to remove">
      ${escapeHtml(char)}
      <span style="font-size:0.6rem;color:#6b7280;margin-left:4px;">?</span>
    </span>`
  ).join('');
}

// ===== CLEAR BUTTON =====
clearSelectedBtn.addEventListener('click', clearSelected);

// ===== UTILITY FUNCTIONS =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeString(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === 'Escape' && document.activeElement === searchInput) {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.blur();
  }
});

// ===== INIT =====
loadData();

// Expose functions to global scope
window.addCharacter = addCharacter;
window.removeCharacter = removeCharacter;
window.clearSelected = clearSelected;
window.goToPage = goToPage;
window.handleEntryClick = handleEntryClick;
window.escapeString = escapeString;
window.escapeHtml = escapeHtml;

console.log('?? Chunom Dictionary loaded!');
console.log('?? Type a single word to see its Chunom character');
console.log('?? Examples: "truy?n", "hoa", "ai", "tr?i", "nu?c"');
