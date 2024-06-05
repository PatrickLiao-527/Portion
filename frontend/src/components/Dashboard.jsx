import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Widget from './Widget';
import Chart from './Chart';
import TableWidget from './TableWidget';
import '../assets/styles/Dashboard.css';
import mealImage from '../assets/icons/chickenBreast.png';

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

const Dashboard = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersChartData, setOrdersChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrdersData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5555/orders', { withCredentials: true });
        const orders = response.data;

        // Format the orders data for the table
        const formattedOrders = orders.map(order => ({
          orderId: `#${order._id}`,
          customerName: order.customerName,
          date: new Date(order.time).toLocaleDateString(),
          time: new Date(order.time).toLocaleTimeString(),
          amount: `$${order.amount.toFixed(2)}`,
          paymentType: order.paymentType,
          status: order.status,
          details: '...', // Placeholder for details column
          mealImage: mealImage,
          mealName: order.mealName,
          carbs: order.carbs,
          proteins: order.proteins,
          fats: order.fats
        }));

        setOrdersData(formattedOrders);

        // Generate revenue data
        const revenue = orders.reduce((acc, order) => {
          const month = new Date(order.time).toLocaleString('default', { month: 'short' });
          const existingMonth = acc.find(item => item.name === month);
          if (existingMonth) {
            existingMonth.revenue += order.amount;
          } else {
            acc.push({ name: month, revenue: order.amount });
          }
          return acc;
        }, []);

        setRevenueData(revenue);

        // Generate orders chart data
        const ordersChart = orders.reduce((acc, order) => {
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
      } catch (error) {
        console.error('Failed to load orders:', error);
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  return (
    <div className="dashboard">
      <div className="widgets">
        <Widget title="Total Revenue" value={`$${revenueData.reduce((acc, item) => acc + item.revenue, 0).toFixed(2)}`} />
        <Widget title="Total Orders" value={ordersData.length} />
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
          data={ordersData}
          columns={columns}
          itemsPerPage={5}
          maxItemsPerPage={20}
          setItems={setOrdersData}
        />
      )}
    </div>
  );
};

export default Dashboard;
