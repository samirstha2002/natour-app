// Initialize the map
// Read tour locations from Pug

export const displayMap = (locations) => {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json', // free public style
    scrollZoom: false, // optional: disable zoom by scroll
  });

  // Add markers and popups
  const bounds = new maplibregl.LngLatBounds();

  locations.forEach((loc) => {
    new maplibregl.Marker()
      .setLngLat(loc.coordinates)
      .setPopup(
        new maplibregl.Popup({ offset: 25 }).setText(
          `Day ${loc.day}: ${loc.description}`,
        ),
      )
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  // Fit map to all markers
  map.fitBounds(bounds, { padding: 100, maxZoom: 14, duration: 1000 });

  // Add zoom and rotation controls
  map.addControl(new maplibregl.NavigationControl());
};
