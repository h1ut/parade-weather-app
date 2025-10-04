import React from 'react'
import './WeatherCard.css'

const weatherConfig = {
  hot: { label: 'Hot', emoji: '🔥', color: '#ff7675' },
  cold: { label: 'Cold', emoji: '❄️', color: '#74b9ff' },
  wet: { label: 'Rain', emoji: '🌧️', color: '#0984e3' },
  windy: { label: 'Windy', emoji: '💨', color: '#00cec9' },
  cloudy: { label: 'Cloudy', emoji: '☁️', color: '#636e72' },
  uncomfortable: { label: 'Uncomfortable', emoji: '😣', color: '#fdcb6e' }
}

function WeatherCard({ type, probability }) {
  const config = weatherConfig[type] || { label: type, emoji: '❓', color: '#666' }

  return (
    <div 
      className="weather-card"
      style={{ 
        background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`
      }}
    >
      <div className="weather-emoji">{config.emoji}</div>
      <h3 className="weather-label">{config.label}</h3>
      <div className="weather-probability">{probability}%</div>
    </div>
  )
}

export default WeatherCard