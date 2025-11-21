/**
 * Archaeological Heritage of Izmir - Main JavaScript
 * Interactive functionality and dynamic content loading
 * Author: Berkay Gülbeyaz
 */

// ===================================
// State Management
// ===================================
const AppState = {
    currentFilter: 'all',
    searchQuery: '',
    featuredSites: [],
    allSites: []
};

// ===================================
// DOM Content Loaded
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===================================
// Initialize Application
// ===================================
function initializeApp() {
    // Load site data
    AppState.allSites = archaeologicalSites;
    AppState.featuredSites = archaeologicalSites.filter(site => site.featured);

    // Initialize components
    initNavigation();
    initSearch();
    initFeaturedSites();
    initPeriodFilters();
    initScrollEffects();

    // Add event listeners
    addEventListeners();

    console.log('Archaeological Heritage Platform initialized successfully');
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// Search Functionality
// ===================================
function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchToggle) {
        searchToggle.addEventListener('click', (e) => {
            e.preventDefault();
            openSearch();
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }

    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Escape key to close search
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });
}

function openSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');

    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
}

function closeSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
}

function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    const searchResults = document.getElementById('searchResults');

    if (!query) {
        searchResults.innerHTML = '';
        return;
    }

    const results = AppState.allSites.filter(site =>
        site.name.toLowerCase().includes(query) ||
        site.turkish.toLowerCase().includes(query) ||
        site.district.toLowerCase().includes(query) ||
        site.description.toLowerCase().includes(query) ||
        site.periods.some(period => period.toLowerCase().includes(query))
    );

    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');

    if (results.length === 0) {
        searchResults.innerHTML = '<p style="padding: 1rem; text-align: center; color: #6b7280;">No sites found matching your search.</p>';
        return;
    }

    const html = results.map(site => `
        <div class="search-result-item" onclick="navigateToSite(${site.id})">
            <h4 style="margin-bottom: 0.5rem; color: #111827;">${site.name}</h4>
            <p style="margin-bottom: 0.5rem; font-size: 0.875rem; color: #6b7280;">
                <i class="fas fa-map-marker-alt" style="color: #c17817;"></i> ${site.district} |
                <i class="fas fa-clock" style="color: #c17817;"></i> ${site.mainPeriod}
            </p>
            <p style="margin: 0; font-size: 0.875rem; color: #4b5563;">
                ${site.description.substring(0, 100)}...
            </p>
        </div>
    `).join('');

    searchResults.innerHTML = html;
}

// ===================================
// Featured Sites Display
// ===================================
function initFeaturedSites() {
    const featuredContainer = document.getElementById('featuredSites');
    if (!featuredContainer) return;

    displaySites(AppState.featuredSites, featuredContainer);
}

function displaySites(sites, container) {
    if (!container) return;

    const html = sites.map(site => createSiteCard(site)).join('');
    container.innerHTML = html;
}

function createSiteCard(site) {
    const badgeClass = site.category === 'unesco' ? 'unesco' : '';
    const badgeText = categoryLabels[site.category] || 'Archaeological Site';

    return `
        <div class="site-card" data-period="${site.mainPeriod}" onclick="navigateToSite(${site.id})">
            <div class="site-card-image">
                <img src="${site.images[0]}" alt="${site.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800'">
                <span class="site-badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="site-card-content">
                <h3 class="site-card-title">${site.name}</h3>
                <span class="site-card-period">${site.mainPeriod} Period</span>
                <p class="site-card-description">${site.description.substring(0, 120)}...</p>
                <div class="site-card-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${site.district}</span>
                    <span><i class="fas fa-calendar"></i> ${site.established}</span>
                </div>
            </div>
        </div>
    `;
}

// ===================================
// Period Filtering
// ===================================
function initPeriodFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Get selected period
            const period = this.getAttribute('data-period');
            AppState.currentFilter = period;

            // Filter sites
            filterSitesByPeriod(period);
        });
    });
}

function filterSitesByPeriod(period) {
    const featuredContainer = document.getElementById('featuredSites');
    if (!featuredContainer) return;

    let filteredSites;

    if (period === 'all') {
        filteredSites = AppState.featuredSites;
    } else {
        filteredSites = AppState.featuredSites.filter(site =>
            site.periods.includes(period) || site.mainPeriod === period
        );
    }

    // Animate filter
    featuredContainer.style.opacity = '0';

    setTimeout(() => {
        displaySites(filteredSites, featuredContainer);
        featuredContainer.style.opacity = '1';
    }, 200);
}

// ===================================
// Scroll Effects
// ===================================
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe animated elements
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// Navigation Functions
// ===================================
function navigateToSite(siteId) {
    // Store site ID in sessionStorage for site-detail page
    sessionStorage.setItem('selectedSiteId', siteId);
    window.location.href = 'site-detail.html';
}

function navigateToSites() {
    window.location.href = 'sites.html';
}

function navigateToAbout() {
    window.location.href = 'about.html';
}

// ===================================
// Utility Functions
// ===================================
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

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ===================================
// Event Listeners
// ===================================
function addEventListeners() {
    // Add smooth transitions to grid items
    const featuredContainer = document.getElementById('featuredSites');
    if (featuredContainer) {
        featuredContainer.style.transition = 'opacity 0.3s ease';
    }

    // Log analytics (placeholder for future implementation)
    console.log('Analytics tracking initialized');
}

// ===================================
// Loading Animation
// ===================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// ===================================
// Error Handling
// ===================================
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// ===================================
// Export Functions (for other pages)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateToSite,
        createSiteCard,
        AppState
    };
}

// Make functions globally available
window.navigateToSite = navigateToSite;
window.AppState = AppState;
