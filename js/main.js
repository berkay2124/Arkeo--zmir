/**
 * Main JavaScript for Arkeo İzmir
 * Homepage functionality
 */

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Load featured sites
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedSites();
});

// Load featured sites on homepage
function loadFeaturedSites() {
    const container = document.getElementById('featured-sites');
    if (!container) return;

    // Get featured sites (first 6)
    const featured = archaeologicalSites
        .filter(site => site.featured)
        .slice(0, 6);

    featured.forEach((site, index) => {
        const card = createSiteCard(site, index);
        container.appendChild(card);
    });
}

// Create site card
function createSiteCard(site, index) {
    const card = document.createElement('div');
    card.className = 'site-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', index * 100);

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

// Truncate text
function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero
window.addEventListener('scroll', function() {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const scrolled = window.pageYOffset;
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
