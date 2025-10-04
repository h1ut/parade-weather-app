import React, { useState } from 'react'
import MapPicker from './components/MapPicker/MapPicker'
import Dashboard from './components/Dashboard/Dashboard'
import './App.css'

function App() {
  const [coords, setCoords] = useState(null)
  const [date, setDate] = useState('2024-06-01') // Example future date

  const handleDateChange = (e) => {
    setDate(e.target.value)
  }

  const formatDateForAPI = (dateString) => {
    return dateString.replaceAll('-', '')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 Will it Rain on My Parade?</h1>
        <p>Select a location on the map and a future date to check weather condition probabilities</p>
      </header>

      <div className="app-controls">
        <MapPicker setCoords={setCoords} />
        
        <div className="date-selector">
          <label htmlFor="date-picker">Select a future date: </label>
          <input
            id="date-picker"
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]} // Only future dates
            onChange={handleDateChange}
          />
        </div>
      </div>

      {coords && (
        <Dashboard 
          coords={coords} 
          date={formatDateForAPI(date)} 
        />
      )}
    </div>
  )
}

export default App