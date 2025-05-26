// ===== SCREEN NAVIGATION =====
function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    if (screenName === 'projects') {
        document.getElementById('projects-screen').classList.add('active');
    } else {
        document.getElementById(screenName + '-screen').classList.add('active');
    }

    // Update nav button states
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Set active state for current screen
    event.target.classList.add('active');
}

// ===== TAB NAVIGATION =====
function showAdviceTab(tabName) {
    // Hide all advice content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected content
    document.getElementById(tabName + '-tab').classList.add('active');

    // Update tab states
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });
    
    event.target.classList.add('active');
}

function showUploadTab(tabName) {
    // Hide all upload content
    document.querySelectorAll('#upload-screen .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected content
    document.getElementById(tabName + '-upload-content').classList.add('active');

    // Update tab states
    document.querySelectorAll('#upload-screen .tab-button').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName + '-upload-tab').classList.add('active');
}

// ===== MODAL MANAGEMENT =====
function openClusterModal() {
    document.getElementById('cluster-modal').classList.remove('hidden');
}

function closeClusterModal() {
    document.getElementById('cluster-modal').classList.add('hidden');
}

function openExportModal() {
    document.getElementById('export-modal').classList.remove('hidden');
}

function closeExportModal() {
    document.getElementById('export-modal').classList.add('hidden');
}

function openConflictResolution() {
    document.getElementById('conflict-modal').classList.remove('hidden');
}

function closeConflictModal() {
    document.getElementById('conflict-modal').classList.add('hidden');
}

// ===== COLUMN SELECTOR =====
function toggleColumnSelector() {
    const selector = document.getElementById('column-selector');
    if (selector.style.display === 'none') {
        selector.style.display = 'block';
    } else {
        selector.style.display = 'none';
    }
}

// ===== EXPORT FUNCTIONALITY =====
function startExport() {
    // Hide export form, show progress
    document.getElementById('export-progress').style.display = 'block';
    
    // Simulate export progress
    setTimeout(() => {
        document.getElementById('export-progress').style.display = 'none';
        document.getElementById('export-complete').style.display = 'block';
    }, 3000);
}

// ===== CONFLICT RESOLUTION =====
function resolveAllConflicts(resolution) {
    // Apply resolution to all conflicts
    const radios = document.querySelectorAll('#conflict-modal input[type="radio"]');
    radios.forEach(radio => {
        if (resolution === 'keep_existing' && radio.value === 'existing') {
            radio.checked = true;
        } else if (resolution === 'use_new' && radio.value === 'new') {
            radio.checked = true;
        } else if (resolution === 'best_metrics') {
            // Logic to select best metrics automatically
            // For demo, just select new data
            if (radio.value === 'new') {
                radio.checked = true;
            }
        }
    });
}

function applyConflictResolutions() {
    // Collect all resolution choices and apply them
    closeConflictModal();
    
    // Show update preview with resolved conflicts
    const updatePreview = document.getElementById('update-preview');
    updatePreview.style.display = 'block';
    
    // Hide the resolve conflicts button since conflicts are resolved
    document.getElementById('resolve-conflicts-btn').style.display = 'none';
    
    // Update the conflicts count to 0
    const conflictsDiv = updatePreview.querySelector('[style*="background: #fecaca"]');
    if (conflictsDiv) {
        conflictsDiv.querySelector('.stat-value, [class*="font-weight: 700"]').textContent = '0';
    }
}

// ===== UPLOAD PREVIEW FUNCTIONS =====
function showUpdatePreview() {
    // Simulate file selection and show preview
    document.getElementById('update-preview').style.display = 'block';
}

function showSchemaPreview() {
    // Simulate file selection and schema detection
    document.getElementById('schema-preview').style.display = 'block';
    
    // After a delay, show processing status
    setTimeout(() => {
        document.getElementById('processing-status').style.display = 'block';
    }, 2000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Set upload as default active screen
    const uploadBtn = document.querySelector('.nav-item');
    if (uploadBtn) {
        uploadBtn.classList.add('active');
    }
});

// ===== UTILITY FUNCTIONS =====
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// ===== EVENT DELEGATION FOR DYNAMIC CONTENT =====
document.addEventListener('click', function(e) {
    // Handle clicks on dynamically added elements
    if (e.target.matches('.keyword-row')) {
        // Handle keyword row clicks
        console.log('Keyword clicked:', e.target);
    }
    
    if (e.target.matches('.filter-checkbox')) {
        // Handle filter changes
        applyFilters();
    }
});

// ===== FORM VALIDATION =====
function validateCSVUpload(file) {
    const validTypes = ['text/csv', 'application/vnd.ms-excel'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid CSV file');
        return false;
    }
    
    if (file.size > maxSize) {
        alert('File size must be less than 50MB');
        return false;
    }
    
    return true;
}

// ===== PROGRESS TRACKING =====
function updateProgress(current, total) {
    const percentage = Math.round((current / total) * 100);
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = `${current} / ${total} (${percentage}%)`;
    }
}

// ===== FILTER MANAGEMENT =====
function applyFilters() {
    const filters = {
        search: document.querySelector('input[placeholder="Search keywords, URLs..."]')?.value || '',
        opportunityTypes: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
        volumeMin: document.querySelector('input[placeholder="Min"]')?.value || '',
        volumeMax: document.querySelector('input[placeholder="Max"]')?.value || '',
        // Add more filters as needed
    };
    
    console.log('Applying filters:', filters);
    // In real implementation, this would trigger an API call
}

function clearFilters() {
    // Clear all filter inputs
    document.querySelectorAll('.filters-sidebar input').forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    document.querySelectorAll('.filters-sidebar select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    applyFilters();
}