import React from 'react';
import '../assets/styles/Widget.css';

const Widget = ({ title, value }) => (
  <div className="widget-wrapper">
    <div className="green-rectangle" />
    <div className="text-wrapper">
      <div className="title">{title}</div>
      <div className="value">{value}</div>
    </div>
  </div>
);

export default Widget;
