/**
 * Sites listing page functionality
 * Filtering and search
 */

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

let allSites = [];
let filteredSites = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    allSites = [...archaeologicalSites];
    filteredSites = [...allSites];

    // Check URL parameters for category filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    if (categoryParam) {
        document.getElementById('category-filter').value = categoryParam;
    }

    // Load sites
    applyFilters();

    // Setup event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('period-filter').addEventListener('change', applyFilters);
    document.getElementById('district-filter').addEventListener('change', applyFilters);
    document.getElementById('search-input').addEventListener('input', debounce(applyFilters, 300));
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
}

// Apply filters
function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const period = document.getElementById('period-filter').value;
    const district = document.getElementById('district-filter').value;
    const search = document.getElementById('search-input').value.toLowerCase();

    filteredSites = allSites.filter(site => {
        // Category filter
        if (category !== 'all' && site.category !== category) return false;

        // Period filter
        if (period !== 'all' && !site.periods.includes(period)) return false;

        // District filter
        if (district !== 'all' && site.district !== district) return false;

        // Search filter
        if (search) {
            const searchFields = [
                site.name.toLowerCase(),
                site.turkish.toLowerCase(),
                site.district.toLowerCase(),
                site.description.toLowerCase()
            ].join(' ');

            if (!searchFields.includes(search)) return false;
        }

        return true;
    });

    updateResults();
}

// Update results
function updateResults() {
    const container = document.getElementById('all-sites');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');

    // Update count
    const count = filteredSites.length;
    resultsCount.textContent = `${count} alan bulundu`;

    // Clear container
    container.innerHTML = '';

    if (count === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';

        // Create cards
        filteredSites.forEach((site, index) => {
            const card = createSiteCard(site, index);
            container.appendChild(card);
        });
    }
}

// Create site card
function createSiteCard(site, index) {
    const card = document.createElement('div');
    card.className = 'site-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', Math.min(index * 50, 300));

    // Get category label
    const categoryLabels = {
        unesco: 'UNESCO Mirası',
        major: 'Büyük Alan',
        lesser: 'Gizli Hazine',
        restricted: 'Kısıtlı Erişim'
    };

    const categoryLabel = categoryLabels[site.category] || '';
    const categoryClass = `category-badge category-${site.category}`;

    card.innerHTML = `
        <div class="site-card-image">
            <img src="${site.images[0]}" alt="${site.turkish}" loading="lazy">
            <span class="${categoryClass}">${categoryLabel}</span>
        </div>
        <div class="site-card-content">
            <h3 class="site-card-title">${site.turkish}</h3>
            <p class="site-card-subtitle">${site.name}</p>
            <div class="site-card-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${site.district}</span>
                <span><i class="fas fa-history"></i> ${site.mainPeriod}</span>
            </div>
            <p class="site-card-description">${truncateText(site.description, 120)}</p>
            <a href="site-detail.html?id=${site.id}" class="btn btn-primary btn-sm">
                <span>Detaylı İncele</span>
                <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;

    return card;
}

// Clear filters
function clearFilters() {
    document.getElementById('category-filter').value = 'all';
    document.getElementById('period-filter').value = 'all';
    document.getElementById('district-filter').value = 'all';
    document.getElementById('search-input').value = '';

    applyFilters();
}

// Truncate text
function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
