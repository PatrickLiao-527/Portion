import React from 'react';
import {
  LineChart, Line, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label
} from 'recharts';
import '../assets/styles/Chart.css';
import { ReactComponent as FilterIcon } from '../assets/icons/filters_icon.svg';

// Custom XAxis Component
const CustomXAxis = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y + 10})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontFamily="Poppins" fontWeight="600" fontSize="12">
        {payload.value}
      </text>
    </g>
  );
};

// Custom YAxis Component
const CustomYAxis = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x - 10},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#666" fontFamily="Poppins" fontWeight="600" fontSize="12">
        {payload.value}
      </text>
    </g>
  );
};

const Chart = ({ title, data, dataKey, yAxisLabel }) => {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        {/*
        <div className="filter-container">
          <span className="filter-text">Filter</span>
          <FilterIcon className="filter-icon" />
        </div>
  */}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5, right: 30, left: 50, bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#82ca9d" />
          
          {data.map((entry, index) => (
            <g key={`x-tick-${index}`}>
              <CustomXAxis
                x={index * 50} // Adjust this based on your data
                y={350} // Adjust this based on your data
                payload={{ value: entry.name }}
              />
            </g>
          ))}

          {data.map((entry, index) => (
            <g key={`y-tick-${index}`}>
              <CustomYAxis
                x={0} // Adjust this based on your data
                y={350 - index * 50} // Adjust this based on your data
                payload={{ value: entry[dataKey] }}
              />
            </g>
          ))}

          <text
            x={0}
            y={200}
            transform="rotate(-90)"
            textAnchor="middle"
            style={{ textAnchor: 'middle', fontFamily: 'Poppins', fontWeight: '600', fontSize: 14 }}
          >
            {yAxisLabel}
          </text>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
