async function loadListings() {
  try {
    // 👇 matches your folder structure
    const response = await fetch('data/airbnb_sf_listings_500.json');
    const json = await response.json();

    // Get first 50
    const listings = Array.isArray(json) ? json : (json.listings || []);
    const first50 = listings.slice(0, 50);

    const grid = document.getElementById('grid');
    grid.innerHTML = "";

    first50.forEach(listing => {
      const title = listing.name || "Airbnb Listing";
      const desc = listing.description || "";
      const price = listing.price || "";
      const host = listing.host_name || "Host";
      const image = listing.picture_url || "https://via.placeholder.com/300x200?text=No+Image";

      const card = `
        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="${image}" class="card-img-top" alt="${title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${title}</h5>
              <p class="card-text truncate-3">${desc}</p>
              <p class="text-muted mb-1">Host: ${host}</p>
              <p class="fw-bold">${price}</p>
              <a href="#" class="btn btn-primary mt-auto">Book Now</a>
            </div>
          </div>
        </div>
      `;
      grid.innerHTML += card;
    });
  } catch (err) {
    console.error("Error loading JSON:", err);
    document.getElementById('grid').innerHTML = 
      `<div class="col"><div class="alert alert-danger">Could not load listings</div></div>`;
  }
}

// Run when page loads
loadListings();
