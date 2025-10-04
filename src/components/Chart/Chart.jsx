import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import './Chart.css'

const weatherConfig = {
  hot: { label: 'Hot', color: '#ff7675' },
  cold: { label: 'Cold', color: '#74b9ff' },
  wet: { label: 'Rain', color: '#0984e3' },
  windy: { label: 'Windy', color: '#00cec9' },
  cloudy: { label: 'Cloudy', color: '#636e72' },
  uncomfortable: { label: 'Uncomfortable', color: '#fdcb6e' }
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <p className="label">{label}</p>
        <p className="value">
          Probability: <strong>{payload[0].value}%</strong>
        </p>
      </div>
    )
  }
  return null
}

function Chart({ data }) {
  const chartData = Object.entries(data).map(([type, probability]) => ({
    condition: weatherConfig[type]?.label || type,
    probability: Math.round(probability),
    color: weatherConfig[type]?.color || '#636e72'
  }))

  return (
    <div className="chart-container">
      <h3>📈 Weather Condition Probabilities</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <XAxis 
            dataKey="condition" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Probability (%)', 
              angle: -90, 
              position: 'insideLeft',
              offset: -10,
              style: { textAnchor: 'middle' }
            }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="probability" 
            radius={[6, 6, 0, 0]}
            barSize={50}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart