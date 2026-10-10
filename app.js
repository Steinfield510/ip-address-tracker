const API_KEY = "at_ibRqHq7sfr2VT6w7thhX6N6Dwvewl";
const API_URL = "https://geo.ipify.org/api/v2/country,city";

const form = document.getElementById("search-form");
const input = document.getElementById("query");
const errorEl = document.getElementById("error");
const fields = {
  ip: document.getElementById("ip"),
  location: document.getElementById("location"),
  timezone: document.getElementById("timezone"),
  isp: document.getElementById("isp"),
};

/* Mapa */
const map = L.map("map", { zoomControl: false }).setView([0, 0], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const marker = L.marker([0, 0]).addTo(map);


const isIp = (value) =>
  /^(\d{1,3}\.){3}\d{1,3}$/.test(value) || value.includes(":");

function buildUrl(query) {
  const params = new URLSearchParams({ apiKey: API_KEY });
  if (query) params.set(isIp(query) ? "ipAddress" : "domain", query);
  return `${API_URL}?${params}`;
}

function render(data) {
  const { ip, location, isp } = data;
  fields.ip.textContent = ip;
  fields.location.textContent =
    `${location.city}, ${location.region} ${location.postalCode}`.trim();
  fields.timezone.textContent = `UTC ${location.timezone}`;
  fields.isp.textContent = isp || "N/A";

  const coords = [location.lat, location.lng];
  map.setView(coords, 13);
  marker.setLatLng(coords);
  map.panBy([0, -80], { animate: false });
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = !message;
}

async function track(query = "") {
  showError("");
  try {
    const res = await fetch(buildUrl(query));
    if (!res.ok) throw new Error("No se encontró información para esa búsqueda.");
    render(await res.json());
  } catch (err) {
    showError(err.message);
  }
}

/* Eventos */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  track(input.value.trim());
});

track();