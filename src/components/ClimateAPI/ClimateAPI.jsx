import React, { useState } from 'react'
import './ClimateAPI.css'

const ClimateAPI = ({ coords, date }) => {
  const [climateData, setClimateData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchClimateDetails = async () => {
    setLoading(true)

    try {
      // Simulate fetching climatology data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const details = generateClimateDetails(coords, date)
      setClimateData(details)
    } catch (err) {
      console.error('Climate details error:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateClimateDetails = (coords, dateStr) => {
    const month = parseInt(dateStr.substring(4, 6))
    const lat = coords.lat

    // Climate characteristics based on latitude and month
    const climateZone = getClimateZone(lat)
    const season = getSeason(month, lat)
    
    return {
      climateZone,
      season,
      typicalConditions: getTypicalConditions(climateZone, season),
      recommendations: getRecommendations()
    }
  }

  const getClimateZone = (lat) => {
    const absLat = Math.abs(lat)
    if (absLat < 23.5) return 'Tropical'
    if (absLat < 35) return 'Subtropical'
    if (absLat < 55) return 'Temperate'
    if (absLat < 66.5) return 'Subarctic'
    return 'Arctic'
  }

const getSeason = (month, lat) => {
  const isNorthern = lat >= 0
  
  if (isNorthern) {
    // Northern Hemisphere
    if (month >= 3 && month <= 5) return 'Spring'
    if (month >= 6 && month <= 8) return 'Summer'
    if (month >= 9 && month <= 11) return 'Autumn'
    return 'Winter' // December, January, February
  } else {
    // Southern Hemisphere
    if (month >= 9 && month <= 11) return 'Spring'
    if (month >= 12 || month <= 2) return 'Summer' // December, January, February
    if (month >= 3 && month <= 5) return 'Autumn'
    return 'Winter' // June, July, August
  }
}

  const getTypicalConditions = (zone, season) => {
    const conditions = {
      'Tropical': {
        'Spring': 'Warm and humid, possible showers',
        'Summer': 'Hot and humid, frequent rains',
        'Autumn': 'Warm, rainy season',
        'Winter': 'Warm and dry'
      },
      'Subtropical': {
        'Spring': 'Moderately warm, possible rains',
        'Summer': 'Hot, rare rains',
        'Autumn': 'Warm, comfortable weather',
        'Winter': 'Cool, possible precipitation'
      },
      'Temperate': {
        'Spring': 'Variable weather, possible rains',
        'Summer': 'Warm, moderate precipitation',
        'Autumn': 'Cool, increasing cloudiness',
        'Winter': 'Cold, possible snowfall'
      },
      'Subarctic': {
        'Spring': 'Cold, snow melting',
        'Summer': 'Cool, short season',
        'Autumn': 'Cold, first frosts',
        'Winter': 'Very cold, snow'
      },
      'Arctic': {
        'Spring': 'Very cold',
        'Summer': 'Cold, polar day',
        'Autumn': 'Very cold',
        'Winter': 'Extremely cold, polar night'
      }
    }
    
    return conditions[zone]?.[season] || 'Typical seasonal conditions'
  }

  const getRecommendations = () => {
    return [
      'Check the forecast one day before the event',
      'Have a backup plan in case of bad weather',
      'Consider local climate features'
    ]
  }

  return (
    <div className="climate-api">
      <h3>🌍 Climate Information</h3>
      
      <button 
        onClick={fetchClimateDetails} 
        disabled={loading}
        className="climate-button"
      >
        {loading ? '📊 Analyzing climate...' : '🌡️ Get Climate Data'}
      </button>

      {climateData && (
        <div className="climate-results">
          <div className="climate-grid">
            <div className="climate-item">
              <span>🏞️ Climate Zone:</span>
              <strong>{climateData.climateZone}</strong>
            </div>
            <div className="climate-item">
              <span>📅 Season:</span>
              <strong>{climateData.season}</strong>
            </div>
            <div className="climate-item full-width">
              <span>🌤️ Typical Conditions:</span>
              <strong>{climateData.typicalConditions}</strong>
            </div>
            <div className="climate-item full-width">
              <span>💡 Recommendations:</span>
              <ul>
                {climateData.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClimateAPI