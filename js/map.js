/**
 * Interactive Map Functionality
 * Uses Leaflet.js for map rendering
 */

// Map initialization
let map = null;
let markers = [];

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
});

function initializeMap() {
    const mapElement = document.getElementById('interactive-map');
    if (!mapElement) return;

    // Create simple custom map without external dependencies
    createCustomMap();
}

function createCustomMap() {
    const mapContainer = document.getElementById('interactive-map');
    if (!mapContainer) return;

    // Clear placeholder
    mapContainer.innerHTML = '';

    // Create SVG-based simple map
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 1000 600");
    svg.style.background = "#e8f4f8";

    // Simplified Izmir coastline shape (decorative)
    const coastPath = document.createElementNS(svgNS, "path");
    coastPath.setAttribute("d", "M 100 300 Q 200 250, 300 280 T 500 260 T 700 290 T 900 280");
    coastPath.setAttribute("stroke", "#2c5f7c");
    coastPath.setAttribute("stroke-width", "3");
    coastPath.setAttribute("fill", "none");
    svg.appendChild(coastPath);

    // Add water area
    const water = document.createElementNS(svgNS, "rect");
    water.setAttribute("x", "0");
    water.setAttribute("y", "300");
    water.setAttribute("width", "1000");
    water.setAttribute("height", "300");
    water.setAttribute("fill", "#b3d9e8");
    water.setAttribute("opacity", "0.5");
    svg.appendChild(water);

    // Add site markers
    const sitePositions = [
        { name: "Ephesus", x: 600, y: 350, category: "unesco" },
        { name: "Pergamon", x: 450, y: 150, category: "unesco" },
        { name: "Smyrna", x: 380, y: 290, category: "major" },
        { name: "Metropolis", x: 520, y: 320, category: "lesser" },
        { name: "Teos", x: 320, y: 340, category: "lesser" },
        { name: "Claros", x: 560, y: 380, category: "major" },
        { name: "Erythrai", x: 280, y: 260, category: "major" },
        { name: "Klazomenai", x: 340, y: 300, category: "major" },
        { name: "Lebedos", x: 310, y: 360, category: "lesser" },
        { name: "Notion", x: 590, y: 360, category: "lesser" },
        { name: "Magnesia", x: 650, y: 420, category: "major" },
        { name: "Allianoi", x: 470, y: 180, category: "lesser" }
    ];

    sitePositions.forEach((site, index) => {
        const group = document.createElementNS(svgNS, "g");
        group.style.cursor = "pointer";
        group.setAttribute("class", "map-marker");

        // Marker circle
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", site.x);
        circle.setAttribute("cy", site.y);
        circle.setAttribute("r", "8");

        // Color based on category
        let color;
        switch(site.category) {
            case 'unesco': color = '#dc2626'; break;
            case 'major': color = '#c17817'; break;
            case 'lesser': color = '#2c5f7c'; break;
            default: color = '#6b7280';
        }

        circle.setAttribute("fill", color);
        circle.setAttribute("stroke", "white");
        circle.setAttribute("stroke-width", "2");

        // Pulse animation
        const pulseCircle = document.createElementNS(svgNS, "circle");
        pulseCircle.setAttribute("cx", site.x);
        pulseCircle.setAttribute("cy", site.y);
        pulseCircle.setAttribute("r", "8");
        pulseCircle.setAttribute("fill", "none");
        pulseCircle.setAttribute("stroke", color);
        pulseCircle.setAttribute("stroke-width", "2");
        pulseCircle.setAttribute("opacity", "0.6");

        const animate = document.createElementNS(svgNS, "animate");
        animate.setAttribute("attributeName", "r");
        animate.setAttribute("from", "8");
        animate.setAttribute("to", "20");
        animate.setAttribute("dur", "2s");
        animate.setAttribute("begin", `${index * 0.2}s`);
        animate.setAttribute("repeatCount", "indefinite");

        const animateOpacity = document.createElementNS(svgNS, "animate");
        animateOpacity.setAttribute("attributeName", "opacity");
        animateOpacity.setAttribute("from", "0.6");
        animateOpacity.setAttribute("to", "0");
        animateOpacity.setAttribute("dur", "2s");
        animateOpacity.setAttribute("begin", `${index * 0.2}s`);
        animateOpacity.setAttribute("repeatCount", "indefinite");

        pulseCircle.appendChild(animate);
        pulseCircle.appendChild(animateOpacity);

        // Label
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", site.x);
        text.setAttribute("y", site.y - 15);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "12");
        text.setAttribute("font-weight", "600");
        text.setAttribute("fill", "#1f2937");
        text.textContent = site.name;

        // Tooltip background
        const textBg = document.createElementNS(svgNS, "rect");
        const bbox = text.getBBox ? text.getBBox() : { x: site.x - 30, y: site.y - 30, width: 60, height: 20 };
        textBg.setAttribute("x", bbox.x - 4);
        textBg.setAttribute("y", bbox.y - 2);
        textBg.setAttribute("width", bbox.width + 8);
        textBg.setAttribute("height", bbox.height + 4);
        textBg.setAttribute("fill", "white");
        textBg.setAttribute("opacity", "0.9");
        textBg.setAttribute("rx", "4");

        // Add hover effects
        group.addEventListener('mouseenter', function() {
            circle.setAttribute("r", "12");
            text.setAttribute("font-size", "14");
            text.setAttribute("font-weight", "700");
        });

        group.addEventListener('mouseleave', function() {
            circle.setAttribute("r", "8");
            text.setAttribute("font-size", "12");
            text.setAttribute("font-weight", "600");
        });

        // Click to view site
        group.addEventListener('click', function() {
            const siteData = archaeologicalSites.find(s => s.name === site.name);
            if (siteData) {
                navigateToSite(siteData.id);
            }
        });

        group.appendChild(pulseCircle);
        group.appendChild(circle);
        group.appendChild(textBg);
        group.appendChild(text);
        svg.appendChild(group);
    });

    // Add title
    const title = document.createElementNS(svgNS, "text");
    title.setAttribute("x", "500");
    title.setAttribute("y", "30");
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("font-size", "20");
    title.setAttribute("font-weight", "700");
    title.setAttribute("fill", "#1f2937");
    title.textContent = "Archaeological Sites of Izmir Province";
    svg.appendChild(title);

    // Add compass rose
    createCompassRose(svg, 920, 520);

    mapContainer.appendChild(svg);
}

function createCompassRose(svg, x, y) {
    const svgNS = "http://www.w3.org/2000/svg";

    // Outer circle
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "40");
    circle.setAttribute("fill", "white");
    circle.setAttribute("stroke", "#c17817");
    circle.setAttribute("stroke-width", "2");
    circle.setAttribute("opacity", "0.9");
    svg.appendChild(circle);

    // North arrow
    const arrow = document.createElementNS(svgNS, "path");
    arrow.setAttribute("d", `M ${x} ${y-30} L ${x-8} ${y} L ${x} ${y-10} L ${x+8} ${y} Z`);
    arrow.setAttribute("fill", "#dc2626");
    arrow.setAttribute("stroke", "#1f2937");
    arrow.setAttribute("stroke-width", "1");
    svg.appendChild(arrow);

    // N label
    const nLabel = document.createElementNS(svgNS, "text");
    nLabel.setAttribute("x", x);
    nLabel.setAttribute("y", y - 35);
    nLabel.setAttribute("text-anchor", "middle");
    nLabel.setAttribute("font-size", "16");
    nLabel.setAttribute("font-weight", "700");
    nLabel.setAttribute("fill", "#1f2937");
    nLabel.textContent = "N";
    svg.appendChild(nLabel);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeMap };
}
