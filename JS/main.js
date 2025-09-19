

// Parse amenities: dataset stores it as a JSON string (e.g. "[\"Kitchen\", ...]")
function parseAmenities(raw) {
  if (!raw) return [];
  try {
    // handles strings like '["A","B"]'
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    // if it's already an array or a weird format, fallback safely
    return Array.isArray(raw) ? raw : String(raw).split(',').map(s => s.trim());
  }
}

async function loadListings() {
  try {
    const res = await fetch('data/airbnb_sf_listings_500.json'); // <- keep this path
    const data = await res.json();

    // If file is an array, use it; if it wraps under .listings, use that
    const listings = Array.isArray(data) ? data : (data.listings || []);
    const first51 = listings.slice(0, 51);

    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // clear

    first51.forEach(item => {
      const title = item.name || 'Airbnb Listing';
      const desc = item.description || '';
      const image = item.picture_url || 'https://via.placeholder.com/600x400?text=No+Image';
      const price = item.price || '';
      const hostName = item.host_name || 'Host';
      const hostPic = item.host_picture_url || item.host_thumbnail_url || '';
      const link = item.listing_url || (item.id ? `https://www.airbnb.com/rooms/${item.id}` : '#');
      const amenities = parseAmenities(item.amenities).slice(0, 6); // show top 6
      const neighborhood = item.neighbourhood_cleansed || "Unknown Area";

      const cardHTML = `
        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="${image}" class="card-img-top" alt="Thumbnail for ${title}" loading="lazy">
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title">${title}</h5>
                ${price ? `<span class="badge text-bg-primary">${price}</span>` : ''}
              </div>

               <!-- Neighborhood Tag extra addition-->
              <span class="badge text-bg-info mb-2">${neighborhood}</span>

              ${desc ? `<p class="card-text text-muted truncate-3">${desc}</p>` : ''}

              <!-- description contains <br /> in dataset; render as HTML -->
              ${desc ? `<p class="card-text text-muted truncate-3">${desc}</p>` : ''}

              ${amenities.length ? `
                <div class="mb-2">
                  ${amenities.map(a => `<span class="badge rounded-pill text-bg-secondary amenity-badge">${a}</span>`).join('')}
                </div>` : ''}

              <div class="mt-auto d-flex justify-content-between align-items-center">
                <span class="host-chip">
                  ${hostPic ? `<img src="${hostPic}" alt="${hostName}">` : ''}
                  <span>By ${hostName}</span>
                </span>
                ${link !== '#' ? `<a class="btn btn-sm btn-primary" href="${link}" target="_blank" rel="noopener">Book Now</a>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;

      grid.insertAdjacentHTML('beforeend', cardHTML);
    });
  } catch (err) {
    console.error(err);
    document.getElementById('grid').innerHTML = `
      <div class="col">
        <div class="alert alert-danger">Failed to load listings. Check JSON path/format.</div>
      </div>`;
  }
}

// Run on load
loadListings();
