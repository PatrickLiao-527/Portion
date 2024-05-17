import React, { useState } from 'react';
import TableWidget from './TableWidget';
import '../assets/styles/MyOrders.css';

const MyOrders = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const data = Array.from({ length: 110 }, (_, index) => ({
    orderId: `#${index + 1}`,
    customerName: 'James Smith',
    date: 'May 13th, 2024',
    time: '9:15 AM',
    amount: '$12.29',
    paymentType: 'Online',
    status: index % 2 === 0 ? 'Complete' : 'In Progress',
    details: '...' // Placeholder for details column
  }));

  const columns = [
    { header: 'Order ID', accessor: 'orderId' },
    { header: 'Customer Name', accessor: 'customerName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Payment Type', accessor: 'paymentType' },
    { header: 'Status', accessor: 'status' },
    { header: 'Details', accessor: 'details' }
  ];

  return (
    <div className="my-orders-page">
      <TableWidget
        title="New Orders"
        data={data}
        columns={columns}
        itemsPerPage={itemsPerPage}
        maxItemsPerPage={30}
      />
    </div>
  );
};

export default MyOrders;
