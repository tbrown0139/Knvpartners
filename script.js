const vendorCards = document.getElementById("vendor-cards");
const searchInput = document.getElementById("search");

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
    .map((vendor) => {
      const statusClass = vendor.Status.toLowerCase();
      const logo = vendor["Logo URL"]
        ? vendor["Logo URL"]
        : "https://via.placeholder.com/50?text=🏢";
      const contractLink = vendor["Contract Link"] || "#";
      const siteLink = vendor["Website"] || "#";
      return `
        <div class="card">
          <img src="${logo}" alt="${vendor['Vendor Name']}">
          <div class="info">
            <h3>${vendor['Vendor Name']}</h3>
            <span class="status ${statusClass}">${vendor.Status}</span>
            <p>Email: <a href="mailto:${vendor.Email}">${vendor.Email}</a></p>
          </div>
          <div class="actions">
            <div class="dropdown">
              <button class="dropdown-button">Options</button>
              <div class="dropdown-menu">
                <a href="tel:${vendor.Phone}">Call</a>
                <a href="mailto:${vendor.Email}">Email</a>
                <a href="${siteLink}" target="_blank">Visit Site</a>
                <a href="${contractLink}" target="_blank">Contract Link</a>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

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
