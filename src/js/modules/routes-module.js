export class RoutesModule {
    constructor() {
        this.routes = [];
        this.map = null;
        this.markers = [];
        this.routeLayer = null;
    }

    initMap() {
        // Initialize the map
        this.map = L.map('map').setView([51.505, -0.09], 13); // Default to London

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);
    }

    renderRouteOnMap(route) {
        const [startLng, startLat] = route.start.split(',').map(coord => parseFloat(coord.trim()));
        const [endLng, endLat] = route.end.split(',').map(coord => parseFloat(coord.trim()));

        // Add markers for start and end locations
        const startMarker = L.marker([startLat, startLng]).addTo(this.map);
        startMarker.bindPopup(`<b>Start:</b> ${route.start}`).openPopup();
        this.markers.push(startMarker);

        const endMarker = L.marker([endLat, endLng]).addTo(this.map);
        endMarker.bindPopup(`<b>End:</b> ${route.end}`).openPopup();
        this.markers.push(endMarker);

        // Draw line between start and end
        this.routeLayer = L.polyline([[startLat, startLng], [endLat, endLng]], { color: 'blue' }).addTo(this.map);

        // Fit map bounds to the route
        this.map.fitBounds(this.routeLayer.getBounds());
    }

    addRoute(route) {
        this.routes.push(route);
        this.renderRoutesList(document.getElementById('routesListContainer'));
        this.renderRouteOnMap(route);
    }

    deleteRoute(index) {
        // Remove route from the array and re-render the list
        this.routes.splice(index, 1);
        this.renderRoutesList(document.getElementById('routesListContainer'));
    }

    renderRoutesList(container) {
        if (this.routes.length === 0) {
            container.innerHTML = '<p class="no-data">No routes saved yet. Add your first route!</p>';
            return;
        }

        let html = '<ul class="routes-list">';
        this.routes.forEach((route, index) => {
            html += `
                <li class="route-item">
                    <h3>${route.name}</h3>
                    <p>Start: ${route.start}</p>
                    <p>End: ${route.end}</p>
                    ${route.notes ? `<p>Notes: ${route.notes}</p>` : ''}
                    <button class="btn delete-btn" data-index="${index}">Delete</button>
                </li>
            `;
        });
        html += '</ul>';

        container.innerHTML = html;

        // Attach delete event listeners
        const deleteButtons = container.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                this.deleteRoute(index);
            });
        });
    }

    initUI() {
        this.initMap();

        const addRouteBtn = document.getElementById('addRouteBtn');
        const modal = document.getElementById('addRouteModal');
        const closeBtn = document.querySelector('.route-close-btn');
        const addRouteForm = document.getElementById('addRouteForm');

        // Open modal
        addRouteBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        // Close modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Handle form submission
        addRouteForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const newRoute = {
                name: document.getElementById('routeName').value,
                start: document.getElementById('routeStart').value,
                end: document.getElementById('routeEnd').value,
                notes: document.getElementById('routeNotes').value
            };

            this.addRoute(newRoute);
            addRouteForm.reset();
            modal.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const routesModule = new RoutesModule();
    routesModule.initUI();
});