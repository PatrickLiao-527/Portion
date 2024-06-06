import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableWidget from './TableWidget';
import '../assets/styles/MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/orders', { withCredentials: true })
      .then((response) => {
        const sortedOrders = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load orders:', error);
        setError('Failed to load orders');
        setLoading(false);
      });
  }, []);

  const formatOrders = (orders) => {
    return orders.map(order => ({
      ...order,
      date: new Date(order.time).toLocaleDateString(), // Extracting date part from data.time
      time: new Date(order.time).toLocaleTimeString() // Extracting time part from data.time
    }));
  };

  const columns = [
    { header: 'Order ID', accessor: '_id' },
    { header: 'Customer Name', accessor: 'customerName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Payment Type', accessor: 'paymentType' },
    { header: 'Status', accessor: 'status' },
    { header: 'Details', accessor: 'details' },
  ];

  return (
    <div className="my-orders-page">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <TableWidget
          title="New Orders"
          data={formatOrders(orders)} // Format orders before passing to TableWidget
          columns={columns}
          itemsPerPage={15}
          maxItemsPerPage={30}
          setItems={setOrders} // Pass setOrders to allow updates from the TableWidget
        />
      )}
    </div>
  );
};

export default MyOrders;
