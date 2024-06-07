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
      orderId: `#${order._id}`,
      customerName: order.customerName,
      date: new Date(order.time).toLocaleDateString(), // Correctly format the date
      time: new Date(order.time).toLocaleTimeString(), // Correctly format the time
      amount: `$${order.amount.toFixed(2)}`,
      paymentType: order.paymentType,
      status: order.status,
      details: '...', // Placeholder for details column
      mealName: order.mealName,
      carbs: order.carbs,
      proteins: order.proteins,
      fats: order.fats 
    }));
  };

  const columns = [
    { header: 'Customer Name', accessor: 'customerName' },
    { header: "Meal Item", accessor: 'mealName'},
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
          data={formatOrders(orders)} 
          columns={columns}
          itemsPerPage={15}
          maxItemsPerPage={30}
          setItems={setOrders} 
        />
      )}
    </div>
  );
};

export default MyOrders;
