/*eslint-disable*/
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2hyaXNoYWxsZXk4NiIsImEiOiJja2FzZ242aHUwanVjMnBvNW43ZHFwZXQwIn0.OCr_KnBZPF3GUEn8UvqVYw';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/chrishalley86/ckasgrgeqalhh1iqt04a31me4',
    scrollZoom: false
  });

  // Create map bounding box
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 100,
      left: 100,
      right: 100
    }
  });
};
