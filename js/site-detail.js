/**
 * Site detail page functionality
 * Display detailed information about a specific site
 */

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Get site ID from URL
const urlParams = new URLSearchParams(window.location.search);
const siteId = parseInt(urlParams.get('id'));

// Load site details
document.addEventListener('DOMContentLoaded', function() {
    if (!siteId || isNaN(siteId)) {
        showError();
        return;
    }

    const site = archaeologicalSites.find(s => s.id === siteId);

    if (!site) {
        showError();
        return;
    }

    displaySiteDetails(site);
});

// Display site details
function displaySiteDetails(site) {
    const container = document.getElementById('site-detail-container');
    const loadingState = document.getElementById('loading-state');

    // Hide loading
    loadingState.style.display = 'none';

    // Update page title
    document.title = `${site.turkish} | Arkeo İzmir`;

    // Get category label
    const categoryLabels = {
        unesco: 'UNESCO Dünya Mirası',
        major: 'Büyük Arkeolojik Alan',
        lesser: 'Gizli Hazine',
        restricted: 'Kısıtlı Erişim'
    };

    const categoryLabel = categoryLabels[site.category] || '';

    // Create detail content
    const detailHTML = `
        <!-- Site Hero -->
        <section class="site-hero">
            <div class="site-hero-image" style="background-image: url('${site.images[0]}')"></div>
            <div class="site-hero-overlay"></div>
            <div class="site-hero-content container">
                <span class="category-badge category-${site.category}">${categoryLabel}</span>
                <h1 class="site-hero-title" data-aos="fade-up">${site.turkish}</h1>
                <p class="site-hero-subtitle" data-aos="fade-up" data-aos-delay="100">${site.name}</p>
                <div class="site-hero-meta" data-aos="fade-up" data-aos-delay="200">
                    <span><i class="fas fa-map-marker-alt"></i> ${site.district}</span>
                    <span><i class="fas fa-history"></i> ${site.mainPeriod}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${site.established}</span>
                </div>
            </div>
        </section>

        <!-- Site Content -->
        <section class="site-content section">
            <div class="container">
                <div class="site-layout">
                    <!-- Main Content -->
                    <div class="site-main">
                        <!-- Description -->
                        <div class="content-block" data-aos="fade-up">
                            <h2>Genel Bakış</h2>
                            <p class="lead">${site.description}</p>
                            <p><strong>Önem:</strong> ${site.significance}</p>
                        </div>

                        <!-- Highlights -->
                        <div class="content-block" data-aos="fade-up">
                            <h2>Öne Çıkan Özellikler</h2>
                            <ul class="highlights-list">
                                ${site.highlights.map(h => `<li><i class="fas fa-check-circle"></i> ${h}</li>`).join('')}
                            </ul>
                        </div>

                        <!-- Images Gallery -->
                        <div class="content-block" data-aos="fade-up">
                            <h2>Fotoğraf Galerisi</h2>
                            <div class="image-gallery">
                                ${site.images.map(img => `
                                    <div class="gallery-item">
                                        <img src="${img}" alt="${site.turkish}" loading="lazy">
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Excavation Info -->
                        <div class="content-block" data-aos="fade-up">
                            <h2>Kazı Bilgileri</h2>
                            <div class="info-grid">
                                <div class="info-item">
                                    <i class="fas fa-calendar-check"></i>
                                    <div>
                                        <strong>Kazı Başlangıcı</strong>
                                        <p>${site.excavation.startYear}</p>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-tools"></i>
                                    <div>
                                        <strong>Durum</strong>
                                        <p>${site.excavation.currentStatus}</p>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-university"></i>
                                    <div>
                                        <strong>Kazı Kurumu</strong>
                                        <p>${site.excavation.leadInstitution}</p>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-gem"></i>
                                    <div>
                                        <strong>Önemli Buluntular</strong>
                                        <p>${site.excavation.keyFindings}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Bibliography -->
                        ${site.bibliography && site.bibliography.length > 0 ? `
                        <div class="content-block" data-aos="fade-up">
                            <h2>Kaynakça</h2>
                            <ul class="bibliography-list">
                                ${site.bibliography.map(ref => `<li>${ref}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Sidebar -->
                    <aside class="site-sidebar">
                        <!-- Visitor Info -->
                        <div class="sidebar-card" data-aos="fade-left">
                            <h3>Ziyaretçi Bilgileri</h3>
                            <div class="visitor-info">
                                <div class="info-row">
                                    <i class="fas fa-door-open"></i>
                                    <div>
                                        <strong>Erişim</strong>
                                        <p>${site.visitorInfo.accessibility}</p>
                                    </div>
                                </div>
                                <div class="info-row">
                                    <i class="fas fa-ticket-alt"></i>
                                    <div>
                                        <strong>Giriş</strong>
                                        <p>${site.visitorInfo.admission}</p>
                                    </div>
                                </div>
                                <div class="info-row">
                                    <i class="fas fa-clock"></i>
                                    <div>
                                        <strong>Süre</strong>
                                        <p>${site.visitorInfo.duration}</p>
                                    </div>
                                </div>
                                <div class="info-row">
                                    <i class="fas fa-sun"></i>
                                    <div>
                                        <strong>En İyi Zaman</strong>
                                        <p>${site.visitorInfo.bestTime}</p>
                                    </div>
                                </div>
                            </div>
                            ${site.visitorInfo.facilities && site.visitorInfo.facilities.length > 0 ? `
                            <div class="facilities">
                                <strong>Olanaklar:</strong>
                                <ul>
                                    ${site.visitorInfo.facilities.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                                </ul>
                            </div>
                            ` : ''}
                        </div>

                        <!-- Periods -->
                        <div class="sidebar-card" data-aos="fade-left" data-aos-delay="100">
                            <h3>Tarihi Dönemler</h3>
                            <div class="periods-list">
                                ${site.periods.map(p => `
                                    <span class="period-badge">${p}</span>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Statistics -->
                        ${site.annualVisitors ? `
                        <div class="sidebar-card" data-aos="fade-left" data-aos-delay="200">
                            <h3>İstatistikler</h3>
                            <div class="stat-large">
                                <div class="stat-number">${(site.annualVisitors / 1000).toFixed(0)}K</div>
                                <div class="stat-label">Yıllık Ziyaretçi</div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Back button -->
                        <a href="sites.html" class="btn btn-secondary btn-block" data-aos="fade-left" data-aos-delay="300">
                            <i class="fas fa-arrow-left"></i>
                            <span>Tüm Alanlara Dön</span>
                        </a>
                    </aside>
                </div>
            </div>
        </section>
    `;

    container.innerHTML = detailHTML;

    // Reinitialize AOS after content is loaded
    setTimeout(() => {
        AOS.refresh();
    }, 100);
}

// Show error state
function showError() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');

    loadingState.style.display = 'none';
    errorState.style.display = 'flex';
}
