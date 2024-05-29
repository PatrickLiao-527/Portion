import React from 'react';
import Widget from './Widget';
import Chart from './Chart';
import TableWidget from './TableWidget';
import '../assets/styles/Dashboard.css';
import mealImage from '../assets/icons/chickenBreast.png';

const revenueData = [
  { name: 'Jan', revenue: 2000 },
  { name: 'Feb', revenue: 4000 },
  { name: 'Mar', revenue: 6000 },
  { name: 'Apr', revenue: 8000 },
  { name: 'May', revenue: 10000 },
  { name: 'Jun', revenue: 12000 },
  { name: 'Jul', revenue: 14000 },
  { name: 'Aug', revenue: 16000 },
  { name: 'Sep', revenue: 18000 },
  { name: 'Oct', revenue: 16000 },
  { name: 'Nov', revenue: 18000 },
  { name: 'Dec', revenue: 20000 }
];

const ordersData = [
  { name: 'Jan', orders: 500 },
  { name: 'Feb', orders: 1000 },
  { name: 'Mar', orders: 1500 },
  { name: 'Apr', orders: 2000 },
  { name: 'May', orders: 2500 },
  { name: 'Jun', orders: 3000 },
  { name: 'Jul', orders: 3500 },
  { name: 'Aug', orders: 4000 },
  { name: 'Sep', orders: 4500 },
  { name: 'Oct', orders: 4000 },
  { name: 'Nov', orders: 4500 },
  { name: 'Dec', orders: 5000 }
];

const ordersTableData = Array.from({ length: 110 }, (_, index) => ({
  orderId: `#${index + 1}`,
  customerName: 'James Smith',
  date: 'May 13th, 2024',
  time: '9:15 AM',
  amount: '$12.29',
  paymentType: 'Online',
  status: index % 2 === 0 ? 'Complete' : 'In Progress',
  details: '...', // Placeholder for details column
  mealImage: mealImage, // Using the imported image
  mealName: 'Grilled Chicken Salad',
  carbs: 20,
  proteins: 30,
  fats: 10
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

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="widgets">
        <Widget title="Total Revenue" value="$16456" />
        <Widget title="Total Orders" value="4012" />
        <Widget title="Total Menu Items" value="12" />
      </div>
      <Chart title="Total Revenue" data={revenueData} dataKey="revenue" yAxisLabel="Revenue" />
      <Chart title="Total Orders" data={ordersData} dataKey="orders" yAxisLabel="Orders" />
      <TableWidget
        title="New Orders"
        data={ordersTableData}
        columns={columns}
        itemsPerPage={5}
        maxItemsPerPage={20}
      />
    </div>
  );
};

export default Dashboard;
