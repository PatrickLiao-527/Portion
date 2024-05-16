import React, { useState } from 'react';
import TableWidget from './TableWidget';
import '../assets/styles/Reports.css';

const Reports = () => {
  const [itemsPerPage, setItemsPerPage] = useState(14);

  const data = Array.from({ length: 30 }, (_, index) => ({
    date: `May ${index + 1}th, 2024`,
    dailyRevenue: `$${(Math.random() * 1000).toFixed(2)}`,
    dailyOrders: Math.floor(Math.random() * 100),
    avgOrderValue: `$${(Math.random() * 100).toFixed(2)}`,
    topSellingItem: 'Chicken Breast',
    newCustomers: Math.floor(Math.random() * 10),
    returningCustomers: Math.floor(Math.random() * 20),
    cancelledOrders: Math.floor(Math.random() * 5)
  }));

  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Daily Revenue', accessor: 'dailyRevenue' },
    { header: 'Daily Orders', accessor: 'dailyOrders' },
    { header: 'Avg Order Value', accessor: 'avgOrderValue' },
    { header: 'Top Selling Item', accessor: 'topSellingItem' },
    { header: 'New Customers', accessor: 'newCustomers' },
    { header: 'Returning Customers', accessor: 'returningCustomers' },
    { header: 'Cancelled Orders', accessor: 'cancelledOrders' }
  ];

  return (
    <div className="reports-page">
      <TableWidget
        title="Daily Reports"
        data={data}
        columns={columns}
        itemsPerPage={itemsPerPage}
        maxItemsPerPage={30}
      />
    </div>
  );
};

export default Reports;
