import React, { useState, useEffect, useContext } from 'react';
import { fetchOrders } from '../services/api';
import Widget from './Widget';
import Chart from './Chart';
import TableWidget from './TableWidget';
import '../assets/styles/Dashboard.css';
import { formatOrders } from '../utils/formatOrders';
import { WebSocketContext } from '../contexts/WebSocketContext';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersChartData, setOrdersChartData] = useState([]);
  const { notifications } = useContext(WebSocketContext);

  useEffect(() => {
    setLoading(true);
    fetchOrders()
      .then((response) => {
        const sortedOrders = response.sort((a, b) => new Date(b.time) - new Date(a.time));
        const formattedOrders = formatOrders(sortedOrders);
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
    notifications.forEach((notification) => {
      if (notification.type === 'NEW_ORDER') {
        const formattedOrder = formatOrders([notification.order])[0];
        setOrders((prevOrders) => {
          const newOrders = [formattedOrder, ...prevOrders];
          return newOrders;
        });

        // Update revenue data
        const month = new Date(notification.order.time).toLocaleString('default', { month: 'short' });
        setRevenueData((prevRevenue) => {
          const existingMonth = prevRevenue.find(item => item.name === month);
          if (existingMonth) {
            existingMonth.revenue += parseFloat(notification.order.amount);
          } else {
            prevRevenue.push({ name: month, revenue: parseFloat(notification.order.amount) });
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
      } else if (notification.type === 'ORDER_CANCELLED') {
        console.log('Order cancelled:', notification.orderId);
        setOrders((prevOrders) => prevOrders.filter(order => order.id !== notification.orderId));

        // Update revenue data
        setRevenueData((prevRevenue) => {
          return prevRevenue.map(item => {
            const month = new Date(notification.order.time).toLocaleString('default', { month: 'short' });
            if (item.name === month) {
              return { ...item, revenue: item.revenue - parseFloat(notification.order.amount) };
            }
            return item;
          });
        });

        // Update orders chart data
        setOrdersChartData((prevOrdersChart) => {
          return prevOrdersChart.map(item => {
            const month = new Date(notification.order.time).toLocaleString('default', { month: 'short' });
            if (item.name === month) {
              return { ...item, orders: item.orders - 1 };
            }
            return item;
          });
        });
      }
    });
  }, [notifications]);

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