import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label
} from 'recharts';
import '../assets/styles/Chart.css';
import { ReactComponent as FilterIcon } from '../assets/icons/filters_icon.svg';

const Chart = ({ title, data, dataKey, yAxisLabel }) => {
  const xAxisDataKey = 'name';
  const xAxisTick = { fontFamily: 'Poppins', fontWeight: '600', fontSize: 12 };
  const yAxisTick = { fontFamily: 'Poppins', fontWeight: '600', fontSize: 12 };
  const yAxisLabelStyle = { textAnchor: 'middle', fontFamily: 'Poppins', fontWeight: '600', fontSize: 14 };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        <div className="filter-container">
          <span className="filter-text">Filter</span>
          <FilterIcon className="filter-icon" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} tick={xAxisTick} />
          <YAxis tick={yAxisTick}>
            <Label
              value={yAxisLabel}
              angle={-90}
              position="insideLeft"
              style={yAxisLabelStyle}
            />
          </YAxis>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
