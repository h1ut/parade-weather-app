import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './MapPicker.css'

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

function LocationMarker({ setCoords }) {
  const [position, setPosition] = useState(null)

  useMapEvents({
    click(e) {
      const newPosition = e.latlng
      setPosition(newPosition)
      setCoords({
        lat: newPosition.lat,
        lng: newPosition.lng
      })
    },
  })

  return position ? (
    <Marker position={position} icon={customIcon} />
  ) : null
}

function MapPicker({ setCoords }) {
  return (
    <div className="map-picker">
      <h3>🗺️ Click on the map to select location</h3>
      <div className="map-container">
        <MapContainer
          center={[40, -95]}
          zoom={3}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker setCoords={setCoords} />
        </MapContainer>
      </div>
    </div>
  )
}

export default MapPicker