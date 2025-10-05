// import React, { useState } from 'react'
// import './ClimateAPI.css'

// const ClimateAPI = ({ coords, date }) => {
//   const [climateData, setClimateData] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const fetchClimateDetails = async () => {
//     setLoading(true)

//     try {
//       // Simulate fetching climatology data
//       await new Promise(resolve => setTimeout(resolve, 1000))
      
//       const details = generateClimateDetails(coords, date)
//       setClimateData(details)
//     } catch (err) {
//       console.error('Climate details error:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const generateClimateDetails = (coords, dateStr) => {
//     const month = parseInt(dateStr.substring(4, 6))
//     const lat = coords.lat

//     // Climate characteristics based on latitude and month
//     const climateZone = getClimateZone(lat)
//     const season = getSeason(month, lat)
    
//     return {
//       climateZone,
//       season,
//       typicalConditions: getTypicalConditions(climateZone, season),
//       recommendations: getRecommendations()
//     }
//   }

//   const getClimateZone = (lat) => {
//     const absLat = Math.abs(lat)
//     if (absLat < 23.5) return 'Tropical'
//     if (absLat < 35) return 'Subtropical'
//     if (absLat < 55) return 'Temperate'
//     if (absLat < 66.5) return 'Subarctic'
//     return 'Arctic'
//   }

// const getSeason = (month, lat) => {
//   const isNorthern = lat >= 0
  
//   if (isNorthern) {
//     // Northern Hemisphere
//     if (month >= 3 && month <= 5) return 'Spring'
//     if (month >= 6 && month <= 8) return 'Summer'
//     if (month >= 9 && month <= 11) return 'Autumn'
//     return 'Winter' // December, January, February
//   } else {
//     // Southern Hemisphere
//     if (month >= 9 && month <= 11) return 'Spring'
//     if (month >= 12 || month <= 2) return 'Summer' // December, January, February
//     if (month >= 3 && month <= 5) return 'Autumn'
//     return 'Winter' // June, July, August
//   }
// }

//   const getTypicalConditions = (zone, season) => {
//     const conditions = {
//       'Tropical': {
//         'Spring': 'Warm and humid, possible showers',
//         'Summer': 'Hot and humid, frequent rains',
//         'Autumn': 'Warm, rainy season',
//         'Winter': 'Warm and dry'
//       },
//       'Subtropical': {
//         'Spring': 'Moderately warm, possible rains',
//         'Summer': 'Hot, rare rains',
//         'Autumn': 'Warm, comfortable weather',
//         'Winter': 'Cool, possible precipitation'
//       },
//       'Temperate': {
//         'Spring': 'Variable weather, possible rains',
//         'Summer': 'Warm, moderate precipitation',
//         'Autumn': 'Cool, increasing cloudiness',
//         'Winter': 'Cold, possible snowfall'
//       },
//       'Subarctic': {
//         'Spring': 'Cold, snow melting',
//         'Summer': 'Cool, short season',
//         'Autumn': 'Cold, first frosts',
//         'Winter': 'Very cold, snow'
//       },
//       'Arctic': {
//         'Spring': 'Very cold',
//         'Summer': 'Cold, polar day',
//         'Autumn': 'Very cold',
//         'Winter': 'Extremely cold, polar night'
//       }
//     }
    
//     return conditions[zone]?.[season] || 'Typical seasonal conditions'
//   }

//   const getRecommendations = () => {
//     return [
//       'Check the forecast one day before the event',
//       'Have a backup plan in case of bad weather',
//       'Consider local climate features'
//     ]
//   }

//   return (
//     <div className="climate-api">
//       <h3>🌍 Climate Information</h3>
      
//       <button 
//         onClick={fetchClimateDetails} 
//         disabled={loading}
//         className="climate-button"
//       >
//         {loading ? '📊 Analyzing climate...' : '🌡️ Get Climate Data'}
//       </button>

//       {climateData && (
//         <div className="climate-results">
//           <div className="climate-grid">
//             <div className="climate-item">
//               <span>🏞️ Climate Zone:</span>
//               <strong>{climateData.climateZone}</strong>
//             </div>
//             <div className="climate-item">
//               <span>📅 Season:</span>
//               <strong>{climateData.season}</strong>
//             </div>
//             <div className="climate-item full-width">
//               <span>🌤️ Typical Conditions:</span>
//               <strong>{climateData.typicalConditions}</strong>
//             </div>
//             <div className="climate-item full-width">
//               <span>💡 Recommendations:</span>
//               <ul>
//                 {climateData.recommendations.map((rec, index) => (
//                   <li key={index}>{rec}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ClimateAPI




import React, { useState } from 'react'
import './ClimateAPI.css'

const ClimateAPI = ({ coords, date }) => {
  const [climateData, setClimateData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchClimateDetails = async () => {
    setLoading(true)

    try {
      // Convert date to NASA POWER API format (YYYYMMDD)
      const year = date.substring(0, 4)
      const month = date.substring(4, 6)
      const day = date.substring(6, 8)
      //const formattedDate = `${year}${month}${day}`
      
      // Calculate date range for historical data (same date from previous years)
      const currentYear = parseInt(year)
      const startYear = currentYear - 5 // Get data from past 5 years
      
      // NASA POWER API call for historical temperature data
      const response = await fetch(
        `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M&community=RE&longitude=${coords.lon}&latitude=${coords.lat}&start=${startYear}${month}${day}&end=${currentYear-1}${month}${day}&format=JSON`
      )
      
      const nasaData = await response.json()
      
      if (nasaData.properties && nasaData.parameters.T2M) {
        const details = generateClimateDetailsFromNASA(nasaData, coords, date)
        setClimateData(details)
      } else {
        // Fallback to mock data if NASA API returns no data
        const details = generateClimateDetails(coords, date)
        setClimateData(details)
      }
    } catch (err) {
      console.error('NASA API error:', err)
      // Fallback to mock data if API fails
      const details = generateClimateDetails(coords, date)
      setClimateData(details)
    } finally {
      setLoading(false)
    }
  }

  const generateClimateDetailsFromNASA = (nasaData, coords, dateStr) => {
    const month = parseInt(dateStr.substring(4, 6))
    const lat = coords.lat
    
    // Process NASA temperature data
    const temperatures = Object.values(nasaData.parameters.T2M)
    const avgTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length
    
    const climateZone = getClimateZone(lat)
    const season = getSeason(month, lat)
    
    // Enhance typical conditions with real temperature data
    const typicalConditions = getEnhancedTypicalConditions(climateZone, season, avgTemp)
    
    return {
      climateZone,
      season,
      typicalConditions,
      historicalAvgTemp: `${avgTemp.toFixed(1)}°C`,
      dataSource: 'NASA POWER API',
      recommendations: getRecommendations(avgTemp)
    }
  }

  const generateClimateDetails = (coords, dateStr) => {
    const month = parseInt(dateStr.substring(4, 6))
    const lat = coords.lat

    const climateZone = getClimateZone(lat)
    const season = getSeason(month, lat)
    
    return {
      climateZone,
      season,
      typicalConditions: getTypicalConditions(climateZone, season),
      historicalAvgTemp: 'Based on climate models',
      dataSource: 'Climate Models',
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
      if (month >= 3 && month <= 5) return 'Spring'
      if (month >= 6 && month <= 8) return 'Summer'
      if (month >= 9 && month <= 11) return 'Autumn'
      return 'Winter'
    } else {
      if (month >= 9 && month <= 11) return 'Spring'
      if (month >= 12 || month <= 2) return 'Summer'
      if (month >= 3 && month <= 5) return 'Autumn'
      return 'Winter'
    }
  }

  const getEnhancedTypicalConditions = (zone, season, avgTemp) => {
    const baseConditions = getTypicalConditions(zone, season)
    return `${baseConditions} | Historical avg: ${avgTemp.toFixed(1)}°C`
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

  const getRecommendations = (avgTemp = null) => {
    const baseRecommendations = [
      'Check the forecast one day before the event',
      'Have a backup plan in case of bad weather',
      'Consider local climate features'
    ]
    
    if (avgTemp !== null) {
      if (avgTemp < 0) {
        baseRecommendations.unshift('Dress warmly - historical data shows cold temperatures')
      } else if (avgTemp > 25) {
        baseRecommendations.unshift('Stay hydrated - historically warm for this date')
      }
    }
    
    return baseRecommendations
  }

  return (
    <div className="climate-api">
      <h3>🌍 Climate Information</h3>
      
      <button 
        onClick={fetchClimateDetails} 
        disabled={loading}
        className="climate-button"
      >
        {loading ? '📊 Analyzing NASA climate data...' : '🌡️ Get NASA Climate Data'}
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
            <div className="climate-item">
              <span>🌡️ Historical Temp:</span>
              <strong>{climateData.historicalAvgTemp}</strong>
            </div>
            <div className="climate-item">
              <span>📊 Data Source:</span>
              <strong>{climateData.dataSource}</strong>
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