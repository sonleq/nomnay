// ===== STATE =====
let mapping = {};
let singleWordMapping = {};
let allKeys = [];
let filteredKeys = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 20;
let currentView = 'grid';
let selectedChars = [];
let selectedGroups = [[]];
let isTraditionalLayout = false;
let outputChars = [];
let outputCharMapping = {};
let pendingResults = [];

// ===== FONT CONTROLS STATE =====
let currentFontSize = 2.5;
let currentFontWeight = 600;

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
const outputDisplay = document.getElementById('outputDisplay');

// ============================================
// BUILD SINGLE WORD DICTIONARY
// ============================================
function buildSingleWordDictionary(data) {
  console.log('Building single-word dictionary...');
  const result = {};
  
  Object.keys(data).forEach(function(phrase) {
    const words = phrase.split(' ');
    const chunomChars = data[phrase];
    
    words.forEach(function(word, index) {
      const wordLower = word.toLowerCase();
      const chars = chunomChars.join(' ').split(' ');
      
      if (chars[index]) {
        if (!result[wordLower]) {
          result[wordLower] = chars[index];
        }
      }
    });
  });
  
  Object.keys(data).forEach(function(phrase) {
    const words = phrase.split(' ');
    if (words.length === 1) {
      const word = words[0].toLowerCase();
      const chars = data[phrase];
      if (chars && chars.length > 0) {
        result[word] = chars[0];
      }
    }
  });
  
  console.log('Built ' + Object.keys(result).length + ' single-word mappings');
  return result;
}

// ============================================
// LOAD DATA
// ============================================
async function loadData() {
  try {
    console.log('Loading mapping_chunom.json...');
    
    const response = await fetch("mapping_chunom.json");
    if (!response.ok) {
      throw new Error('HTTP error! status: ' + response.status);
    }
    
    const data = await response.json();
    console.log('Data loaded successfully!', Object.keys(data).length, 'entries');
    
    mapping = data;
    allKeys = Object.keys(mapping);
    
    singleWordMapping = buildSingleWordDictionary(data);
    
    totalEntriesEl.textContent = allKeys.length;
    let totalChars = 0;
    allKeys.forEach(function(key) {
      totalChars += mapping[key].length;
    });
    totalCharactersEl.textContent = totalChars;
    
    filteredKeys = [...allKeys];
    renderResults();
    
    const savedLayout = localStorage.getItem('chunom-layout');
    if (savedLayout === 'traditional') {
      setTraditionalLayout(true);
    }
    
    console.log('Loaded ' + allKeys.length + ' entries, ' + totalChars + ' characters');
    console.log('Single-word mappings: ' + Object.keys(singleWordMapping).length);
    
  } catch (error) {
    console.error('Error loading JSON:', error);
    
    resultsContainer.innerHTML = `
      <div style="text-align:center;padding:40px;color:#ef4444;">
        <div style="font-size:3rem;margin-bottom:16px;">??</div>
        <h3>Failed to load dictionary</h3>
        <p style="color:#6b7280;">${error.message}</p>
        <button onclick="location.reload()" style="margin-top:16px;padding:10px 24px;border:none;border-radius:8px;background:#4f46e5;color:white;cursor:pointer;font-size:1rem;">
          Retry
        </button>
      </div>
    `;
  }
}

// ============================================
// LAYOUT TOGGLE
// ============================================
function toggleLayout() {
  isTraditionalLayout = !isTraditionalLayout;
  setTraditionalLayout(isTraditionalLayout);
}

function setTraditionalLayout(enabled) {
  isTraditionalLayout = enabled;
  const toggle = document.getElementById('layoutToggle');
  const status = document.getElementById('layoutStatus');

  if (!toggle || !status) return;

  if (enabled) {
    toggle.classList.add('active');
    status.innerHTML = '<span class="highlight">Traditional</span> (Top to Bottom, Right to Left)';
    outputDisplay.className = 'output-traditional';
    localStorage.setItem('chunom-layout', 'traditional');
  } else {
    toggle.classList.remove('active');
    status.innerHTML = '<span class="highlight">Modern</span> (Left to Right)';
    outputDisplay.className = 'output-modern';
    localStorage.setItem('chunom-layout', 'modern');
  }

  const currentText = searchInput ? searchInput.value : '';
  if (currentText) {
    updateOutput(currentText);
  }
  updateSelectedDisplay();
}

// ============================================
// FIND MATCH
// ============================================
function findMatch(word) {
  const lower = word.toLowerCase();
  if (singleWordMapping[lower]) {
    return singleWordMapping[lower];
  }
  for (const key in singleWordMapping) {
    if (key.includes(lower) || lower.includes(key)) {
      return singleWordMapping[key];
    }
  }
  return null;
}

// ============================================
// UPDATE OUTPUT
// ============================================
function updateOutput(text) {
  if (!outputDisplay) return;

  const words = text.split(/\s+/);
  outputChars = [];
  outputCharMapping = {};
  let charIndex = 0;

  if (!text.trim()) {
    outputDisplay.innerHTML = `
      <div class="output-empty">
        <span class="icon">??</span> Type Quoc Ngu above to convert
      </div>
    `;
    return;
  }

  let html = '';
  let hasMatch = false;

  if (isTraditionalLayout) {
    words.forEach(function(word, idx) {
      const cleanWord = word.trim();
      if (!cleanWord) return;

      const match = findMatch(cleanWord);

      html += '<div class="column-group">';
      if (match) {
        hasMatch = true;
        charIndex++;
        outputChars.push(match);
        outputCharMapping[charIndex] = match;
        html += '<span class="char-item" onclick="addCharacter(\'' + escapeString(match) + '\')" title="' + escapeHtml(cleanWord) + '">';
        html += '<span class="char-number">' + charIndex + '</span>';
        html += escapeHtml(match);
        html += '<span class="quoc-ngu-hint">' + escapeHtml(cleanWord) + '</span>';
        html += '</span>';
      } else {
        html += '<span class="unknown-word">' + escapeHtml(cleanWord) + '</span>';
      }
      html += '</div>';
      if (idx < words.length - 1) {
        html += '<span class="column-break"></span>';
      }
    });
  } else {
    words.forEach(function(word, idx) {
      const cleanWord = word.trim();
      if (!cleanWord) return;

      const match = findMatch(cleanWord);

      if (match) {
        hasMatch = true;
        charIndex++;
        outputChars.push(match);
        outputCharMapping[charIndex] = match;
        html += '<span class="char-item" onclick="addCharacter(\'' + escapeString(match) + '\')" title="' + escapeHtml(cleanWord) + '">';
        html += '<span class="char-number">' + charIndex + '</span>';
        html += escapeHtml(match);
        html += '<span class="quoc-ngu-hint">' + escapeHtml(cleanWord) + '</span>';
        html += '</span>';
        if (idx < words.length - 1) {
          html += '<span class="word-separator"></span>';
        }
      } else {
        html += '<span class="unknown-word">' + escapeHtml(cleanWord) + '</span>';
        if (idx < words.length - 1) {
          html += ' ';
        }
      }
    });
  }

  if (!hasMatch && outputChars.length === 0) {
    html = `
      <div class="output-empty">
        <span class="icon">??</span> No matches found. Try different words.
      </div>
    `;
  }

  outputDisplay.innerHTML = html;
  
  const hint = document.querySelector('.keyboard-hint');
  if (hint && outputChars.length > 0) {
    const numbers = Object.keys(outputCharMapping).join(', ');
    hint.innerHTML = 'Press <kbd>' + numbers + '</kbd> to select &nbsp;|&nbsp; Press <kbd>Enter</kbd> for new column';
  }
}

// ============================================
// SEARCH
// ============================================
function searchSingleWord(query) {
  const searchTerm = query.trim().toLowerCase();
  
  if (searchTerm === '') {
    filteredKeys = [...allKeys];
    renderResults();
    updateOutput(query);
    pendingResults = [];
    return;
  }

  updateOutput(query);
  
  if (singleWordMapping[searchTerm]) {
    const chunomChar = singleWordMapping[searchTerm];
    pendingResults = [{ word: searchTerm, char: chunomChar }];
    displaySingleResult(searchTerm, chunomChar);
    return;
  }
  
  const matches = Object.keys(singleWordMapping).filter(function(word) {
    return word.includes(searchTerm) || searchTerm.includes(word);
  });
  
  if (matches.length > 0) {
    const results = matches.slice(0, 50).map(function(word) {
      return {
        word: word,
        char: singleWordMapping[word]
      };
    });
    pendingResults = results;
    displayMultipleResults(results);
    return;
  }
  
  const phraseMatches = allKeys.filter(function(key) {
    return key.toLowerCase().includes(searchTerm);
  });
  
  if (phraseMatches.length > 0) {
    const phraseResults = phraseMatches.slice(0, 20).map(function(key) {
      const chars = mapping[key];
      return {
        word: key,
        char: chars[0] || chars.join(' ')
      };
    });
    pendingResults = phraseResults;
    displayMultipleResults(phraseResults);
    return;
  }
  
  pendingResults = [];
  filteredKeys = [];
  renderResults();
}

// ============================================
// DISPLAY SINGLE RESULT
// ============================================
function displaySingleResult(word, chunomChar) {
  resultsContainer.innerHTML = `
    <div style="padding:20px;text-align:center;">
      <div style="font-size:1.2rem;color:#6b7280;margin-bottom:8px;">
        ${escapeHtml(word)} ?
      </div>
      <div style="font-family:'Noto Serif TC','Han Nom',serif;font-size:4rem;color:#4f46e5;font-weight:bold;display:inline-block;margin:0 10px;padding:10px 20px;background:#f8f7ff;border-radius:12px;border:2px solid #e5e7eb;">
        ${escapeHtml(chunomChar)}
      </div>
      <div style="margin-top:12px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button onclick="addCharacter('${escapeString(chunomChar)}')" style="padding:10px 24px;border:none;border-radius:8px;background:#4f46e5;color:white;cursor:pointer;font-size:1rem;">
          Add to Selection
        </button>
      </div>
      <div style="margin-top:12px;font-size:0.85rem;color:#9ca3af;">
        Press <kbd>1</kbd> to select this character
      </div>
    </div>
  `;
  pagination.innerHTML = '';
  resultCount.textContent = '1 match for "' + word + '"';
}

// ============================================
// DISPLAY MULTIPLE RESULTS
// ============================================
function displayMultipleResults(results) {
  const maxDisplay = Math.min(results.length, 9);
  
  let html = `
    <div style="padding:10px 0;">
      <div style="font-size:0.9rem;color:#6b7280;margin-bottom:12px;">
        Found ${results.length} matching words. Press <kbd>1</kbd>-<kbd>${Math.min(results.length, 9)}</kbd> to select.
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">
  `;
  
  results.slice(0, maxDisplay).forEach(function(item, index) {
    const num = index + 1;
    html += `
      <div style="background:#f8f7ff;border:2px solid #e5e7eb;border-radius:10px;padding:12px 16px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;"
           onclick="addCharacter('${escapeString(item.char)}')"
           onmouseover="this.style.borderColor='#4f46e5';this.style.background='#f0eeff';"
           onmouseout="this.style.borderColor='#e5e7eb';this.style.background='#f8f7ff';">
        <span style="position:absolute;top:-8px;right:-8px;background:#4f46e5;color:white;font-size:0.65rem;font-weight:700;padding:2px 8px;border-radius:10px;font-family:'Inter',monospace;">${num}</span>
        <div style="font-size:0.9rem;color:#1a1a2e;">${escapeHtml(item.word)}</div>
        <div style="font-family:'Noto Serif TC','Han Nom',serif;font-size:2rem;color:#4f46e5;margin-top:4px;">${escapeHtml(item.char)}</div>
      </div>
    `;
  });
  
  if (results.length > 9) {
    html += `<div style="grid-column:span 2;text-align:center;padding:10px;color:#6b7280;font-size:0.85rem;">
      + ${results.length - 9} more results
    </div>`;
  }
  
  html += '</div></div>';
  resultsContainer.innerHTML = html;
  pagination.innerHTML = '';
  resultCount.textContent = results.length + ' matches';
}

// ============================================
// RENDER RESULTS
// ============================================
function renderResults() {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = filteredKeys.slice(start, end);
  
  resultCount.textContent = filteredKeys.length + ' entries';
  
  if (filteredKeys.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align:center;padding:40px;color:#6b7280;">
        <div style="font-size:3rem;margin-bottom:16px;">??</div>
        <h3>No results found</h3>
        <p>Try a different search term</p>
        <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          ${['truyen','hoa','ai','troi','nuoc','nguoi'].map(function(word) {
            return '<button onclick="document.getElementById(\'searchInput\').value=\'' + word + '\';document.getElementById(\'searchInput\').dispatchEvent(new Event(\'input\'));" style="padding:6px 14px;border:1px solid #e5e7eb;border-radius:6px;background:white;cursor:pointer;font-size:0.85rem;">' + word + '</button>';
          }).join('')}
        </div>
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

// ============================================
// GRID VIEW
// ============================================
function renderGridView(items) {
  let html = '<div class="grid-view">';
  items.forEach(function(key) {
    const chars = mapping[key];
    html += `
      <div class="entry-card" onclick="handleEntryClick('${escapeString(key)}')">
        <span class="quoc-ngu">${escapeHtml(key)}</span>
        <span class="chunom">${chars.map(function(c) {
          return '<span onclick="event.stopPropagation();addCharacter(\'' + escapeString(c) + '\')" style="cursor:pointer;padding:0 3px;">' + escapeHtml(c) + '</span>';
        }).join(' ')}</span>
      </div>
    `;
  });
  html += '</div>';
  resultsContainer.innerHTML = html;
}

// ============================================
// LIST VIEW
// ============================================
function renderListView(items) {
  let html = '<div class="list-view">';
  items.forEach(function(key) {
    const chars = mapping[key];
    html += `
      <div class="entry-row" onclick="handleEntryClick('${escapeString(key)}')">
        <span class="quoc-ngu">${escapeHtml(key)}</span>
        <span class="chunom">${chars.map(function(c) {
          return '<span onclick="event.stopPropagation();addCharacter(\'' + escapeString(c) + '\')" style="cursor:pointer;padding:0 4px;">' + escapeHtml(c) + '</span>';
        }).join(' ')}</span>
      </div>
    `;
  });
  html += '</div>';
  resultsContainer.innerHTML = html;
}

// ============================================
// ALL VIEW
// ============================================
function renderAllView(items) {
  let html = '<div class="grid-view" style="grid-template-columns:1fr;">';
  items.forEach(function(key) {
    const chars = mapping[key];
    html += `
      <div class="entry-card" onclick="handleEntryClick('${escapeString(key)}')" style="flex-wrap:wrap;">
        <span class="quoc-ngu">${escapeHtml(key)}</span>
        <span class="chunom chunom-small" style="font-size:1.2rem;">${chars.map(function(c) {
          return '<span onclick="event.stopPropagation();addCharacter(\'' + escapeString(c) + '\')" style="cursor:pointer;padding:0 3px;">' + escapeHtml(c) + '</span>';
        }).join(' ')}</span>
      </div>
    `;
  });
  html += '</div>';
  resultsContainer.innerHTML = html;
}

// ============================================
// PAGINATION
// ============================================
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

// ============================================
// NAVIGATION
// ============================================
function goToPage(page) {
  currentPage = page;
  renderResults();
  document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// SEARCH HANDLER
// ============================================
if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value;
    currentPage = 1;
    searchSingleWord(query);
  });
}

// ============================================
// VIEW TOGGLES
// ============================================
document.querySelectorAll('.filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    currentView = btn.dataset.view;
    currentPage = 1;
    renderResults();
  });
});

// ============================================
// CHARACTER SELECTION - FIXED Traditional
// ============================================
function addCharacter(char) {
  selectedChars.push(char);
  // In Traditional mode, we want to add to the current column
  // The "current" column is the first one (most recently created)
  // Since we unshift new columns, the first group is the newest
  const targetGroup = isTraditionalLayout ? selectedGroups[0] : selectedGroups[selectedGroups.length - 1];
  if (targetGroup) {
    targetGroup.push(char);
  }
  updateSelectedDisplay();
  localStorage.setItem('chunom-selected', JSON.stringify(selectedChars));
  showToast('Added "' + char + '"');
  updateExportButton();
}

function addColumnBreak() {
  if (selectedChars.length === 0) {
    showToast('Add some characters first');
    return;
  }
  
  // In Traditional mode, new columns should be added to the BEGINNING
  // so they appear on the LEFT when displayed
  if (isTraditionalLayout) {
    // Traditional: Add new column at the beginning (will appear on the left)
    selectedGroups.unshift([]);
  } else {
    // Modern: Add new column at the end (appears on the right)
    selectedGroups.push([]);
  }
  
  updateSelectedDisplay();
  showToast('New column created');
}

function handleEntryClick(key) {
  const chars = mapping[key];
  const targetGroup = isTraditionalLayout ? selectedGroups[0] : selectedGroups[selectedGroups.length - 1];
  chars.forEach(function(char) {
    selectedChars.push(char);
    if (targetGroup) {
      targetGroup.push(char);
    }
  });
  updateSelectedDisplay();
  localStorage.setItem('chunom-selected', JSON.stringify(selectedChars));
  showToast('Added ' + chars.length + ' character(s)');
  updateExportButton();
}

function removeCharacter(char) {
  // Find and remove the LAST occurrence of this character
  const index = selectedChars.lastIndexOf(char);
  if (index !== -1) {
    selectedChars.splice(index, 1);
    // Also remove from groups - find the last occurrence in groups
    for (let g = selectedGroups.length - 1; g >= 0; g--) {
      const group = selectedGroups[g];
      const groupIndex = group.lastIndexOf(char);
      if (groupIndex !== -1) {
        group.splice(groupIndex, 1);
        break;
      }
    }
    // Clean up empty groups
    const nonEmptyGroups = selectedGroups.filter(function(g) {
      return g.length > 0;
    });
    if (nonEmptyGroups.length === 0) {
      selectedGroups = [[]];
    } else {
      selectedGroups = nonEmptyGroups;
    }
  }
  updateSelectedDisplay();
  localStorage.setItem('chunom-selected', JSON.stringify(selectedChars));
  updateExportButton();
}

function clearSelected() {
  if (selectedChars.length === 0) return;
  if (confirm('Clear all selected characters?')) {
    selectedChars = [];
    selectedGroups = [[]];
    updateSelectedDisplay();
    localStorage.setItem('chunom-selected', JSON.stringify(selectedChars));
    showToast('Cleared');
    updateExportButton();
  }
}

// ===== CLEAR BUTTON EVENT LISTENER =====
clearSelectedBtn.addEventListener('click', clearSelected);

// ============================================
// UPDATE SELECTED DISPLAY - FIXED Traditional right-to-left
// ============================================
function updateSelectedDisplay() {
  if (selectedChars.length === 0) {
    selectedDisplay.textContent = '';
    selectedDisplay.className = isTraditionalLayout ? 'selected-traditional' : 'selected-modern';
    selectedSection.classList.remove('has-items');
    selectedCountEl.textContent = '0';
    return;
  }

  selectedSection.classList.add('has-items');
  selectedCountEl.textContent = selectedChars.length;

  selectedDisplay.className = isTraditionalLayout ? 'selected-traditional' : 'selected-modern';
  
  // Apply font size and weight
  selectedDisplay.style.fontSize = currentFontSize + 'rem';
  selectedDisplay.style.fontWeight = currentFontWeight;

  if (isTraditionalLayout) {
    // Get non-empty groups
    var groups = [];
    selectedGroups.forEach(function(group) {
      if (group.length > 0) {
        groups.push(group);
      }
    });
    
    // REVERSE the groups for right-to-left display
    var reversedGroups = groups.slice().reverse();
    
    var html = '';
    reversedGroups.forEach(function(group, groupIndex) {
      html += '<div class="column-group">';
      group.forEach(function(char) {
        html += '<span class="char-item" onclick="removeCharacter(\'' + escapeString(char) + '\')" title="Click to remove" style="font-size:' + currentFontSize + 'rem;font-weight:' + currentFontWeight + ';">';
        html += escapeHtml(char);
        html += '<span class="remove-icon">?</span>';
        html += '</span>';
      });
      html += '</div>';
      if (groupIndex < reversedGroups.length - 1) {
        html += '<span class="column-break"></span>';
      }
    });
    selectedDisplay.innerHTML = html;
    
  } else {
    // MODERN: Left to Right
    var html = '';
    selectedGroups.forEach(function(group, groupIndex) {
      if (group.length === 0) return;
      group.forEach(function(char) {
        html += '<span class="char-item" onclick="removeCharacter(\'' + escapeString(char) + '\')" title="Click to remove" style="font-size:' + currentFontSize + 'rem;font-weight:' + currentFontWeight + ';">';
        html += escapeHtml(char);
        html += '<span class="remove-icon">?</span>';
        html += '</span>';
      });
      if (groupIndex < selectedGroups.length - 1) {
        var nextGroup = selectedGroups[groupIndex + 1];
        if (nextGroup && nextGroup.length > 0) {
          html += ' ';
        }
      }
    });
    selectedDisplay.innerHTML = html;
  }
}

// ============================================
// OUTPUT ACTIONS
// ============================================
function clearOutput() {
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
    updateOutput('');
  }
}

function copyOutput() {
  if (!outputDisplay) return;
  const text = outputDisplay.textContent;
  if (!text || text.includes('Type Quoc Ngu') || text.includes('No matches')) {
    showToast('Nothing to copy');
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    showToast('Copied to clipboard!');
  }).catch(function() {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast('Copied to clipboard!');
  });
}

function addAllOutput() {
  if (outputChars.length === 0) {
    showToast('No characters to add');
    return;
  }

  let added = 0;
  outputChars.forEach(function(char) {
    selectedChars.push(char);
    const targetGroup = isTraditionalLayout ? selectedGroups[0] : selectedGroups[selectedGroups.length - 1];
    if (targetGroup) {
      targetGroup.push(char);
    }
    added++;
  });

  updateSelectedDisplay();
  localStorage.setItem('chunom-selected', JSON.stringify(selectedChars));
  updateExportButton();
  showToast('Added ' + added + ' character(s) to collection');
}

// ============================================
// TOAST
// ============================================
let toastTimeout;

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(function() {
    toast.classList.remove('show');
  }, 2500);
}

// ============================================
// UTILITY
// ============================================
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeString(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ============================================
// FONT CONTROLS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  var slider = document.getElementById('fontSizeSlider');
  var display = document.getElementById('fontSizeDisplay');
  if (slider) {
    slider.addEventListener('input', function() {
      currentFontSize = parseFloat(this.value);
      display.textContent = currentFontSize + 'rem';
      updateSelectedDisplay();
    });
  }
});

function setFontWeight(weight) {
  currentFontWeight = weight;
  var btns = document.querySelectorAll('.weight-btn');
  btns.forEach(function(btn) {
    btn.classList.remove('active');
    if (parseInt(btn.dataset.weight) === weight) {
      btn.classList.add('active');
    }
  });
  updateSelectedDisplay();
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (searchInput) searchInput.focus();
  }
  
  if (e.key === 'Escape' && document.activeElement === searchInput) {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.blur();
  }
  
  if (document.activeElement === searchInput) {
    const key = parseInt(e.key);
    
    if (key >= 1 && key <= 9 && outputCharMapping[key]) {
      e.preventDefault();
      const char = outputCharMapping[key];
      addCharacter(char);
      showToast('Added "' + char + '"');
      searchInput.value = '';
      updateOutput('');
      searchInput.focus();
      return;
    }
    
    if (key >= 1 && key <= 9 && pendingResults.length > 0 && key <= pendingResults.length) {
      e.preventDefault();
      const result = pendingResults[key - 1];
      if (result) {
        addCharacter(result.char);
        searchInput.value = '';
        updateOutput('');
        searchInput.focus();
      }
      return;
    }
    
    if (e.key === 'Enter') {
      if (selectedChars.length > 0) {
        e.preventDefault();
        addColumnBreak();
        searchInput.value = '';
        updateOutput('');
        searchInput.focus();
        return;
      }
    }
  }
  
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    addColumnBreak();
  }
});

// ============================================
// EXPORT FUNCTIONS
// ============================================

function toggleExportDropdown() {
  var dropdown = document.getElementById('exportDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

function closeExportDropdown() {
  var dropdown = document.getElementById('exportDropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
}

function updateExportButton() {
  var btn = document.getElementById('exportBtn');
  if (btn) {
    btn.disabled = selectedChars.length === 0;
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  var dropdown = document.getElementById('exportDropdown');
  if (dropdown && !e.target.closest('.export-dropdown')) {
    dropdown.classList.remove('show');
  }
});

function getQuocNguForChar(char) {
  for (var key in mapping) {
    if (mapping.hasOwnProperty(key)) {
      var chars = mapping[key];
      for (var i = 0; i < chars.length; i++) {
        if (chars[i] === char) {
          return key;
        }
      }
    }
  }
  return '';
}

function downloadBlob(blob, filename) {
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(function() {
    URL.revokeObjectURL(url);
  }, 1000);
}

// ============================================
// GENERATE EXPORT CONTENT - FIXED Traditional right-to-left
// ============================================
function generateExportContent() {
  var now = new Date().toLocaleString();
  
  var charDisplay = '';
  var isTraditional = isTraditionalLayout;
  
  var fontSize = currentFontSize + 'rem';
  var fontWeight = currentFontWeight;
  
  if (isTraditional) {
    // Get non-empty groups and REVERSE for right-to-left
    var groups = [];
    selectedGroups.forEach(function(group) {
      if (group.length > 0) {
        groups.push(group);
      }
    });
    var reversedGroups = groups.slice().reverse();
    
    charDisplay = '<div style="font-family:\'Noto Serif TC\',\'Han Nom\',serif;font-size:' + fontSize + ';font-weight:' + fontWeight + ';line-height:2.2;padding:16px 20px;background:#faf8f0;border:2px solid #d4a574;border-radius:4px;text-align:center;direction:rtl;">';
    charDisplay += '<table style="border-collapse:collapse;margin:0 auto;display:inline-table;">';
    charDisplay += '<tr>';
    
    // Use reversedGroups for right-to-left
    reversedGroups.forEach(function(group, index) {
      charDisplay += '<td style="vertical-align:top;padding:4px 16px;border:none;text-align:center;">';
      group.forEach(function(char) {
        charDisplay += '<div style="text-align:center;padding:4px 0;">';
        charDisplay += '<div style="font-size:' + fontSize + ';font-weight:' + fontWeight + ';font-family:\'Noto Serif TC\',\'Times New Roman\',serif;display:block;line-height:1.4;">' + escapeHtml(char) + '</div>';
        charDisplay += '</div>';
      });
      charDisplay += '</td>';
      if (index < reversedGroups.length - 1) {
        charDisplay += '<td style="padding:0 4px;width:2px;background:#f59e0b;border:none;min-height:100px;"></td>';
      }
    });
    
    charDisplay += '</tr>';
    charDisplay += '</table>';
    charDisplay += '</div>';
  } else {
    // MODERN: Left to Right
    charDisplay = '<div style="font-family:\'Noto Serif TC\',\'Han Nom\',serif;font-size:' + fontSize + ';font-weight:' + fontWeight + ';line-height:1.6;padding:8px;word-wrap:break-word;direction:ltr;text-align:left;">';
    selectedGroups.forEach(function(group, groupIndex) {
      if (group.length === 0) return;
      group.forEach(function(char) {
        charDisplay += '<span style="display:inline-block;margin:2px 4px;padding:2px 10px;background:#e0e7ff;border-radius:6px;font-size:' + fontSize + ';font-weight:' + fontWeight + ';">';
        charDisplay += escapeHtml(char);
        charDisplay += '</span>';
      });
      if (groupIndex < selectedGroups.length - 1) {
        var nextGroup = selectedGroups[groupIndex + 1];
        if (nextGroup && nextGroup.length > 0) {
          charDisplay += ' ';
        }
      }
    });
    charDisplay += '</div>';
  }

  return `
    <div style="text-align:center;border-bottom:2px solid #1a1a2e;padding-bottom:16px;margin-bottom:24px;">
      <h1 style="font-size:24pt;font-weight:bold;margin:0;">Chunom Dictionary Export</h1>
      <p style="font-size:10pt;color:#666;margin-top:4px;">${now}</p>
    </div>
    
    <div style="text-align:center;font-size:10pt;color:#666;margin:8px 0;">
      Total Characters: <strong>${selectedChars.length}</strong>
      | Columns: <strong>${selectedGroups.filter(function(g) { return g.length > 0; }).length}</strong>
      | Layout: <strong>${isTraditionalLayout ? 'Traditional (Vertical)' : 'Modern (Horizontal)'}</strong>
    </div>
    
    <h2 style="font-size:14pt;color:#4b5563;margin:16px 0 8px;">Character Display</h2>
    ${charDisplay}
  `;
}

// ============================================
// EXPORT AS DOC
// ============================================
function exportAsDoc() {
  if (selectedChars.length === 0) {
    showToast('No characters to export');
    return;
  }

  var content = generateExportContent();
  var fullHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">';
  fullHtml += '<head><meta charset="UTF-8"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
  fullHtml += '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->';
  fullHtml += '<style>body{font-family:"Noto Serif TC","Times New Roman",serif;padding:40px 50px;line-height:1.6;color:#1a1a2e;background:white;}@page{size:A4;margin:2cm;}</style>';
  fullHtml += '</head><body>' + content + '</body></html>';

  var blob = new Blob([fullHtml], { type: 'application/msword;charset=utf-8' });
  downloadBlob(blob, 'chunom_export_' + new Date().toISOString().slice(0,10) + '.doc');
  showToast('DOC file downloaded!');
  closeExportDropdown();
}

// ============================================
// EXPORT AS DOCX
// ============================================
function exportAsDocx() {
  if (selectedChars.length === 0) {
    showToast('No characters to export');
    return;
  }

  var content = generateExportContent();
  var fullHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">';
  fullHtml += '<head><meta charset="UTF-8"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
  fullHtml += '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->';
  fullHtml += '<style>body{font-family:"Noto Serif TC","Times New Roman",serif;padding:40px 50px;line-height:1.6;color:#1a1a2e;background:white;}@page{size:A4;margin:2cm;}</style>';
  fullHtml += '</head><body>' + content + '</body></html>';

  var blob = new Blob([fullHtml], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8' });
  downloadBlob(blob, 'chunom_export_' + new Date().toISOString().slice(0,10) + '.docx');
  showToast('DOCX file downloaded!');
  closeExportDropdown();
}

// ============================================
// EXPORT AS HTML
// ============================================
function exportAsHtml() {
  if (selectedChars.length === 0) {
    showToast('No characters to export');
    return;
  }

  var content = generateExportContent();
  var fullHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8">';
  fullHtml += '<title>Chunom Export</title>';
  fullHtml += '<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC&display=swap" rel="stylesheet">';
  fullHtml += '<style>body{font-family:"Noto Serif TC",serif;padding:40px;max-width:1000px;margin:0 auto;background:white;}</style>';
  fullHtml += '</head><body>' + content + '</body></html>';

  var blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, 'chunom_export_' + new Date().toISOString().slice(0,10) + '.html');
  showToast('HTML file downloaded!');
  closeExportDropdown();
}

// ============================================
// EXPORT AS TEXT - FIXED Traditional right-to-left
// ============================================
function exportAsText() {
  if (selectedChars.length === 0) {
    showToast('No characters to export');
    return;
  }

  var text = '';
  text += '--------------------------------------------------\n';
  text += '        CHUNOM DICTIONARY EXPORT\n';
  text += '        ' + new Date().toLocaleString() + '\n';
  text += '--------------------------------------------------\n';
  text += 'Total Characters: ' + selectedChars.length + '\n';
  text += 'Columns: ' + selectedGroups.filter(function(g) { return g.length > 0; }).length + '\n';
  text += 'Layout: ' + (isTraditionalLayout ? 'Traditional (Vertical)' : 'Modern (Horizontal)') + '\n';
  text += '--------------------------------------------------\n\n';

  if (isTraditionalLayout) {
    // Get non-empty groups and REVERSE for right-to-left
    var groups = [];
    selectedGroups.forEach(function(group) {
      if (group.length > 0) {
        groups.push(group);
      }
    });
    var reversedGroups = groups.slice().reverse();
    
    var maxHeight = 0;
    reversedGroups.forEach(function(group) {
      if (group.length > maxHeight) maxHeight = group.length;
    });
    
    var colWidths = [];
    reversedGroups.forEach(function(group) {
      var maxWidth = 0;
      group.forEach(function(char) {
        if (char.length > maxWidth) maxWidth = char.length;
      });
      colWidths.push(Math.max(maxWidth + 2, 6));
    });
    
    text += 'Character Display (Vertical Columns - Right to Left):\n\n';
    
    // Header with column numbers (right to left order)
    var headerLine = '';
    reversedGroups.forEach(function(group, index) {
      var colNum = index + 1;
      var label = 'Col ' + colNum;
      headerLine += label.padEnd(colWidths[index]);
      if (index < reversedGroups.length - 1) headerLine += ' ¦ ';
    });
    text += headerLine + '\n';
    text += '-'.repeat(headerLine.length) + '\n';
    
    // Each row (top to bottom)
    for (var row = 0; row < maxHeight; row++) {
      var line = '';
      reversedGroups.forEach(function(group, index) {
        var char = group[row] || '';
        line += char.padEnd(colWidths[index]);
        if (index < reversedGroups.length - 1) line += ' ¦ ';
      });
      text += line + '\n';
    }
    text += '\n';
    
    text += '--------------------------------------------------\n';
    text += 'FULL CHARACTER LIST (' + selectedChars.length + ' total):\n';
    text += '--------------------------------------------------\n\n';
    
    selectedChars.forEach(function(char, idx) {
      var pos = String(idx + 1).padStart(3);
      text += pos + '. ' + char + '\n';
    });
    
  } else {
    text += 'Character Display (Horizontal):\n\n';
    var line = '';
    selectedGroups.forEach(function(group, groupIndex) {
      if (group.length === 0) return;
      group.forEach(function(char) {
        line += char + ' ';
      });
      if (groupIndex < selectedGroups.length - 1) {
        var nextGroup = selectedGroups[groupIndex + 1];
        if (nextGroup && nextGroup.length > 0) {
          line += '  ';
        }
      }
    });
    text += line + '\n\n';
    
    text += '--------------------------------------------------\n';
    text += 'FULL CHARACTER LIST (' + selectedChars.length + ' total):\n';
    text += '--------------------------------------------------\n\n';
    
    selectedChars.forEach(function(char, idx) {
      var pos = String(idx + 1).padStart(3);
      text += pos + '. ' + char + '\n';
    });
  }

  text += '\n--------------------------------------------------\n';
  text += 'Exported from Chunom Dictionary\n';
  text += new Date().toISOString().slice(0,10) + '\n';

  var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, 'chunom_export_' + new Date().toISOString().slice(0,10) + '.txt');
  showToast('Text file downloaded!');
  closeExportDropdown();
}

// ============================================
// EXPORT AS PDF - FIXED Traditional right-to-left
// ============================================
function exportAsPdf() {
  if (selectedChars.length === 0) {
    showToast('No characters to export');
    return;
  }

  var isTraditional = isTraditionalLayout;
  var content = '';
  
  var fontSize = currentFontSize + 'rem';
  var fontWeight = currentFontWeight;
  
  if (isTraditional) {
    // Get non-empty groups and REVERSE for right-to-left
    var groups = [];
    selectedGroups.forEach(function(group) {
      if (group.length > 0) {
        groups.push(group);
      }
    });
    var reversedGroups = groups.slice().reverse();
    
    content += '<div style="font-family:\'Noto Serif TC\',\'Han Nom\',serif;font-size:' + fontSize + ';font-weight:' + fontWeight + ';line-height:2.2;display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;justify-content:flex-start;gap:0;direction:rtl;">';
    
    // Use reversedGroups for right-to-left
    reversedGroups.forEach(function(group, index) {
      content += '<div style="display:flex;flex-direction:column;align-items:center;padding:0 4px;flex-shrink:0;">';
      
      group.forEach(function(char) {
        content += '<div style="display:block;padding:4px 8px;font-size:' + fontSize + ';font-weight:' + fontWeight + ';writing-mode:vertical-rl;text-orientation:upright;color:#1a1a2e;letter-spacing:4px;text-align:center;flex-shrink:0;line-height:1;">';
        content += escapeHtml(char);
        content += '</div>';
      });
      
      content += '</div>';
      
      if (index < reversedGroups.length - 1) {
        content += '<div style="display:inline-block;width:12px;min-height:100%;flex-shrink:0;margin:0 2px;"></div>';
      }
    });
    
    content += '</div>';
    
  } else {
    // MODERN: Left to Right
    content += '<div style="font-family:\'Noto Serif TC\',\'Han Nom\',serif;font-size:' + fontSize + ';font-weight:' + fontWeight + ';line-height:1.6;padding:0;word-wrap:break-word;direction:ltr;text-align:left;">';
    
    selectedGroups.forEach(function(group, groupIndex) {
      if (group.length === 0) return;
      
      group.forEach(function(char) {
        content += '<span style="display:inline-block;margin:2px 4px;padding:0;font-size:' + fontSize + ';font-weight:' + fontWeight + ';">';
        content += escapeHtml(char);
        content += '</span>';
      });
      
      if (groupIndex < selectedGroups.length - 1) {
        var nextGroup = selectedGroups[groupIndex + 1];
        if (nextGroup && nextGroup.length > 0) {
          content += ' ';
        }
      }
    });
    
    content += '</div>';
  }

  var fullHtml = '<!DOCTYPE html>\n';
  fullHtml += '<html>\n';
  fullHtml += '<head>\n';
  fullHtml += '  <meta charset="UTF-8">\n';
  fullHtml += '  <title>Chunom Export</title>\n';
  fullHtml += '  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">\n';
  fullHtml += '  <style>\n';
  fullHtml += '    @page { size: A4; margin: 2cm; }\n';
  fullHtml += '    body { \n';
  fullHtml += '      margin: 0; \n';
  fullHtml += '      padding: 20px; \n';
  fullHtml += '      background: white; \n';
  fullHtml += '      display: flex; \n';
  fullHtml += '      align-items: center; \n';
  fullHtml += '      justify-content: center; \n';
  fullHtml += '      min-height: 100vh; \n';
  fullHtml += '      font-family: "Noto Serif TC", "Han Nom", serif;\n';
  fullHtml += '    }\n';
  fullHtml += '    .export-container { \n';
  fullHtml += '      width: 100%; \n';
  fullHtml += '      max-width: 800px; \n';
  fullHtml += '      margin: 0 auto; \n';
  fullHtml += '    }\n';
  fullHtml += '    @media print { \n';
  fullHtml += '      body { padding: 0; } \n';
  fullHtml += '      .export-container { max-width: 100%; } \n';
  fullHtml += '    }\n';
  fullHtml += '  </style>\n';
  fullHtml += '</head>\n';
  fullHtml += '<body>\n';
  fullHtml += '  <div class="export-container">\n';
  fullHtml += content;
  fullHtml += '  </div>\n';
  fullHtml += '  <script>\n';
  fullHtml += '    window.onload = function() { \n';
  fullHtml += '      setTimeout(function() { \n';
  fullHtml += '        window.print(); \n';
  fullHtml += '      }, 800); \n';
  fullHtml += '    };\n';
  fullHtml += '  <\/script>\n';
  fullHtml += '</body>\n';
  fullHtml += '</html>';

  var printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    showToast('Please allow popups for PDF export');
    return;
  }
  
  printWindow.document.write(fullHtml);
  printWindow.document.close();
  
  showToast('PDF preview opened - Click "Save as PDF" to download');
  closeExportDropdown();
}

// ============================================
// EXPOSE GLOBALLY
// ============================================
window.addCharacter = addCharacter;
window.removeCharacter = removeCharacter;
window.clearSelected = clearSelected;
window.goToPage = goToPage;
window.handleEntryClick = handleEntryClick;
window.escapeString = escapeString;
window.escapeHtml = escapeHtml;
window.toggleLayout = toggleLayout;
window.clearOutput = clearOutput;
window.copyOutput = copyOutput;
window.addAllOutput = addAllOutput;
window.addColumnBreak = addColumnBreak;
window.toggleExportDropdown = toggleExportDropdown;
window.closeExportDropdown = closeExportDropdown;
window.updateExportButton = updateExportButton;
window.exportAsDoc = exportAsDoc;
window.exportAsDocx = exportAsDocx;
window.exportAsHtml = exportAsHtml;
window.exportAsText = exportAsText;
window.exportAsPdf = exportAsPdf;
window.setFontWeight = setFontWeight;

// ============================================
// INIT - Load data at the very end
// ============================================
loadData();

console.log('Chunom Dictionary loaded!');
console.log('Type a word -> characters appear with numbers');
console.log('Press 1-9 to select characters');
console.log('Press Enter to add a new column');
console.log('Export selected characters to PDF/DOC/DOCX/HTML/TXT');
