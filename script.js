const vendorCards = document.getElementById("vendor-cards");
const searchInput = document.getElementById("search");
const overlay = document.getElementById("overlay");
const closeOverlay = document.getElementById("close-overlay");

const vendorName = document.getElementById("vendor-name");
const vendorID = document.getElementById("vendor-id");
const vendorOwner = document.getElementById("vendor-owner");
const companyEmail = document.getElementById("company-email");
const contractLink = document.getElementById("contract-link");

// Replace with your Google Sheets CSV link
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQClSTXfBj0dP4OqdtKF5uYTV4GydYRlEMR-Mbp2aP8qgHZZFIJVeTKFj1amANnwe8kBq8SDWLKwZKa/pub?output=csv";

// Function to fetch CSV data
async function fetchVendors() {
  const response = await fetch(csvUrl);
  const text = await response.text();
  const data = parseCSV(text);
  displayVendors(data);
}

// Parse CSV into JSON
function parseCSV(text) {
  const lines = text.split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((acc, header, i) => {
      acc[header.trim()] = values[i]?.trim();
      return acc;
    }, {});
  });
}

// Render vendors as cards
function displayVendors(vendors) {
  vendorCards.innerHTML = vendors
    .map((vendor, index) => {
      const statusClass = vendor.Status.toLowerCase();
      const logo = vendor["Logo URL"]
        ? vendor["Logo URL"]
        : "https://via.placeholder.com/50?text=🏢";
      return `
        <div class="card" data-index="${index}">
          <img src="${logo}" alt="${vendor['Vendor Name']}">
          <div class="info">
            <h3>${vendor['Vendor Name']}</h3>
            <span class="status ${statusClass}">${vendor.Status}</span>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".card").forEach((card, index) => {
    card.addEventListener("click", () => {
      showVendorOverlay(vendors[index]);
    });
  });
}

// Show overlay with vendor details
function showVendorOverlay(vendor) {
  vendorName.textContent = vendor["Vendor Name"];
  vendorID.textContent = vendor["Vendor ID"];
  vendorOwner.textContent = vendor["Owner"];
  companyEmail.textContent = vendor["CO-Email"];
  companyEmail.href = `mailto:${vendor["CO-Email"]}`;
  contractLink.href = vendor["Contract Link"];
  overlay.classList.remove("hidden");
}

// Hide overlay
closeOverlay.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// Search functionality
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(query) ? "flex" : "none";
  });
});

// Load data on page load
fetchVendors();
