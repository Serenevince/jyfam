// Jesus Youth Family Gathering 2026 - Route Map & Venue Guide

document.addEventListener('DOMContentLoaded', () => {
  initLeafletMap();
  initRouteTabs();
});

function initLeafletMap() {
  const mapElement = document.getElementById('venue-leaflet-map');
  if (!mapElement || typeof L === 'undefined') return;

  // St. Paul's CEHSS Kuriachira coordinates
  const venueCoords = [10.5030242, 76.2229106];
  const thrissurTownCoords = [10.5190, 76.2165]; // Sakthan Stand area
  const nh544BypassCoords = [10.4990, 76.2620]; // Kuttanellur / Ollur NH 544 bypass

  // Initialize map centered between town and venue
  const map = L.map('venue-leaflet-map', {
    center: [10.5075, 76.2300],
    zoom: 14,
    scrollWheelZoom: false
  });

  // OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Custom Icons
  const venueIcon = L.divIcon({
    className: 'custom-venue-icon',
    html: `
      <div style="background:#dc2626; color:white; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(220,38,38,0.6); border:3px solid white; font-size:18px;">
        ✝️
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

  const townIcon = L.divIcon({
    className: 'custom-town-icon',
    html: `
      <div style="background:#2563eb; color:white; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px rgba(37,99,235,0.5); border:2px solid white; font-size:14px;">
        🏙️
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const nhIcon = L.divIcon({
    className: 'custom-nh-icon',
    html: `
      <div style="background:#059669; color:white; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px rgba(5,150,105,0.5); border:2px solid white; font-size:14px;">
        🛣️
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  // Markers
  const venueMarker = L.marker(venueCoords, { icon: venueIcon }).addTo(map);
  venueMarker.bindPopup(`
    <div class="p-1">
      <span class="inline-block px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full mb-1">OFFICIAL VENUE</span>
      <h4 class="font-bold text-slate-900 text-base">St. Paul's C.E.H.S.S.</h4>
      <p class="text-xs text-slate-600 mt-1">Kuriachira, Thrissur - 680006</p>
      <p class="text-xs text-amber-700 font-semibold mt-1">Jesus Youth Family Gathering 2026</p>
      <a href="https://maps.app.goo.gl/uFgYVPFwXmHn9VBo7" target="_blank" class="inline-block mt-2 text-xs bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-red-700">Open Google Maps &rarr;</a>
    </div>
  `).openPopup();

  const townMarker = L.marker(thrissurTownCoords, { icon: townIcon }).addTo(map);
  townMarker.bindPopup(`
    <div class="p-1">
      <h4 class="font-bold text-slate-900 text-sm">Thrissur Town / Sakthan Stand</h4>
      <p class="text-xs text-slate-600 mt-1">Distance to Venue: ~3.5 km (8-10 mins)</p>
      <p class="text-xs text-blue-600 font-medium">Frequent town buses via Koorkenchery</p>
    </div>
  `);

  const nhMarker = L.marker(nh544BypassCoords, { icon: nhIcon }).addTo(map);
  nhMarker.bindPopup(`
    <div class="p-1">
      <h4 class="font-bold text-slate-900 text-sm">NH 544 (Kuttanellur Bypass)</h4>
      <p class="text-xs text-slate-600 mt-1">Distance to Venue: ~4.5 km (10-12 mins)</p>
      <p class="text-xs text-emerald-600 font-medium">Direct highway access for outstation attendees</p>
    </div>
  `);

  // Route 1 (Blue): Town -> Kokkalai -> Koorkenchery -> Kuriachira St. Paul's
  const routeTownToVenue = [
    [10.5190, 76.2165], // Sakthan
    [10.5140, 76.2175], // Kokkalai
    [10.5105, 76.2195], // Koorkenchery Junction
    [10.5050, 76.2215], // Kuriachira North
    [10.5030242, 76.2229106] // St Paul's CEHSS
  ];

  // Route 2 (Green): NH 544 Kuttanellur Bypass -> Ollur -> Kuriachira
  const routeNHToVenue = [
    [10.4990, 76.2620], // Kuttanellur NH 544
    [10.4985, 76.2510], // Towards Ollur Road
    [10.4970, 76.2410], // Ollur Industrial / Town area
    [10.4995, 76.2310], // Ollur-Kuriachira stretch
    [10.5030242, 76.2229106] // St Paul's CEHSS
  ];

  L.polyline(routeTownToVenue, {
    color: '#2563eb',
    weight: 5,
    opacity: 0.85,
    dashArray: '8, 8'
  }).addTo(map);

  L.polyline(routeNHToVenue, {
    color: '#059669',
    weight: 5,
    opacity: 0.85,
    dashArray: '8, 8'
  }).addTo(map);

  // Fit bounds to display both routes
  const bounds = L.latLngBounds([thrissurTownCoords, nh544BypassCoords, venueCoords]);
  map.fitBounds(bounds, { padding: [50, 50] });
}

function initRouteTabs() {
  const tabs = document.querySelectorAll('.route-tab-btn');
  const panels = document.querySelectorAll('.route-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-navy-900', 'text-white', 'shadow-md');
        t.classList.add('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      });
      tab.classList.remove('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      tab.classList.add('bg-navy-900', 'text-white', 'shadow-md');

      const target = tab.getAttribute('data-route');
      panels.forEach(p => {
        if (p.id === `route-panel-${target}`) {
          p.classList.remove('hidden');
        } else {
          p.classList.add('hidden');
        }
      });
    });
  });
}
