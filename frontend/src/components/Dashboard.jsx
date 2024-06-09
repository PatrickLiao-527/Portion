import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Widget from './Widget';
import Chart from './Chart';
import TableWidget from './TableWidget';
import '../assets/styles/Dashboard.css';
import { formatOrders } from '../utils/formatOrders';
import { useWebSocket } from '../WebSocketContext';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersChartData, setOrdersChartData] = useState([]);
  const socket = useWebSocket();

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/orders', { withCredentials: true })
      .then((response) => {
        const sortedOrders = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
        const formattedOrders = formatOrders(sortedOrders);
        //console.log('Formatted Orders:', formattedOrders);
        setOrders(formattedOrders);

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

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        console.log('Dashboard has received socket message');
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_ORDER') {
          console.log('New order received:', data.order);
          const formattedOrder = formatOrders([data.order])[0];
          console.log('Formatted New Order:', formattedOrder);
          setOrders((prevOrders) => {
            const newOrders = [formattedOrder, ...prevOrders];
            console.log('Updated Orders:', newOrders);
            return newOrders;
          });

          // Update revenue data
          const month = new Date(data.order.time).toLocaleString('default', { month: 'short' });
          setRevenueData((prevRevenue) => {
            const existingMonth = prevRevenue.find(item => item.name === month);
            if (existingMonth) {
              existingMonth.revenue += parseFloat(data.order.amount);
            } else {
              prevRevenue.push({ name: month, revenue: parseFloat(data.order.amount) });
            }
            return [...prevRevenue];
          });

          // Update orders chart data
          setOrdersChartData((prevOrdersChart) => {
            const existingMonth = prevOrdersChart.find(item => item.name === month);
            if (existingMonth) {
              existingMonth.orders += 1;
            } else {
              prevOrdersChart.push({ name: month, orders: 1 });
            }
            return [...prevOrdersChart];
          });
        }
      };
    }
  }, [socket]);

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
          data={orders} 
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
