import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './Map.css';

export default function Map() {
  const mapRef = useRef(null);
  const legendRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const maxBounds = [
      [-85, -180],
      [85, 180]
    ];

    mapRef.current = L.map('map', {
      center: [20, 0], // Center the map to display all continents
      zoom: 3,
      minZoom: 3,      // Minimum zoom level
      maxZoom: 8,      // Maximum zoom level
      maxBounds: maxBounds,
      maxBoundsViscosity: 1.0 // Ensures that the map cannot be zoomed out beyond the bounds
    });

    mapRef.current.on('drag', function () {
      mapRef.current.panInsideBounds(maxBounds, { animate: false });
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    const fetchGeoJSON = async () => {
      const response = await fetch('/countries.geojson');
      return response.json();
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1');
        const data = response.data;

        const vaccineData = {};
        data.forEach(country => {
          const countryName = country.country;
          const vaccines = country.timeline[Object.keys(country.timeline)[0]];
          vaccineData[countryName] = vaccines;
        });

        const getColor = (d) => {
          return d > 1000000000 ? '#800026' :
                 d > 500000000  ? '#BD0026' :
                 d > 200000000  ? '#E31A1C' :
                 d > 100000000  ? '#FC4E2A' :
                 d > 50000000   ? '#FD8D3C' :
                 d > 20000000   ? '#FEB24C' :
                 d > 10000000   ? '#FED976' :
                                  '#FFEDA0';
        };

        const geojson = await fetchGeoJSON();

        const geojsonLayer = L.geoJSON(geojson, {
          style: (feature) => {
            const countryName = feature.properties.ADMIN || feature.properties.name;
            const vaccines = vaccineData[countryName] || 0;
            return {
              fillColor: getColor(vaccines),
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            };
          },
          onEachFeature: (feature, layer) => {
            const countryName = feature.properties.ADMIN || feature.properties.name;
            const vaccines = vaccineData[countryName] || 0;
            layer.bindTooltip(`<b>${countryName}</b><br>Vaccines distributed: ${vaccines}`, {
                permanent: false,
                direction: 'auto'
            });
          }
        }).addTo(mapRef.current);

        // Add legend to the map if it doesn't already exist
        if (!legendRef.current) {
          legendRef.current = L.control({ position: 'bottomright' });

          legendRef.current.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'info legend');
            const grades = [0, 10000000, 20000000, 50000000, 100000000, 200000000, 500000000, 1000000000];
            const labels = ['0-10 million', '10-20 million', '20-50 million', '50-100 million', '100-200 million', '200-500 million', '500-1000 million', '1 billion+'];

            div.innerHTML = '<h4>Vaccines Given</h4>';
            for (let i = 0; i < grades.length; i++) {
              div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                labels[i] + '<br>';
            }

            return div;
          };

          legendRef.current.addTo(mapRef.current);
        }

        mapRef.current.setView([10, 5], 3);

      } catch (error) {
        console.error('Error fetching vaccine data:', error);
      }
    };

    fetchData();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id="map" className="map-container"></div>;
}
