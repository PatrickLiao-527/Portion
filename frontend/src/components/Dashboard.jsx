import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Widget from './Widget';
import Chart from './Chart';
import TableWidget from './TableWidget';
import '../assets/styles/Dashboard.css';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersChartData, setOrdersChartData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/orders', { withCredentials: true })
      .then((response) => {
        const sortedOrders = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
        setOrders(sortedOrders);


        // Generate revenue data
        const revenue = sortedOrders.reduce((acc, order) => {
          const month = new Date(order.time).toLocaleString('default', { month: 'short' });
          const existingMonth = acc.find(item => item.name === month);
          if (existingMonth) {
            existingMonth.revenue += parseFloat(order.amount);
          } else {
            acc.push({ name: month, revenue: parseFloat(order.amount) });
          }
          return acc;
        }, []);
        setRevenueData(revenue);

        // Generate orders chart data
        const ordersChart = sortedOrders.reduce((acc, order) => {
          const month = new Date(order.time).toLocaleString('default', { month: 'short' });
          const existingMonth = acc.find(item => item.name === month);
          if (existingMonth) {
            existingMonth.orders += 1;
          } else {
            acc.push({ name: month, orders: 1 });
          }
          return acc;
        }, []);
        setOrdersChartData(ordersChart);

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
    <div className="dashboard">
      <div className="widgets">
        <Widget title="Total Revenue" value={`$${revenueData.reduce((acc, item) => acc + item.revenue, 0).toFixed(2)}`} />
        <Widget title="Total Orders" value={orders.length} />
        <Widget title="Total Menu Items" value="12" />
      </div>
      <Chart title="Total Revenue" data={revenueData} dataKey="revenue" yAxisLabel="Revenue" />
      <Chart title="Total Orders" data={ordersChartData} dataKey="orders" yAxisLabel="Orders" />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <TableWidget
          title="New Orders"
          data={formatOrders(orders)} 
          columns={columns}
          itemsPerPage={5}
          maxItemsPerPage={30}
          setItems={setOrders}
        />
      )}
    </div>
  );
};

export default Dashboard;
