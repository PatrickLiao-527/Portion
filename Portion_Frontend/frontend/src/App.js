import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MyOrders from './components/MyOrders';
import MenuItems from './components/MenuItems';
import Transactions from './components/Transactions';
import MyProfile from './components/MyProfile';
import Reports from './components/Reports';
import Settings from './components/Settings';
import OrderDetails from './components/OrderDetails';
import mealImage from './assets/icons/chickenBreast.png';
import './App.css';

// Sample data (replace with your actual data)
const ordersData = [
  {
    orderId: '#1',
    customerName: 'James Smith',
    date: 'May 13th, 2024',
    time: '9:15 AM',
    amount: '$12.29',
    paymentType: 'Online',
    status: 'Complete',
    mealImage: mealImage, // Using the imported image
    mealName: 'Grilled Chicken Salad',
    carbs: 20,
    proteins: 30,
    fats: 10,
  },
  // Add more orders here...
];

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-orders" element={<MyOrders data={ordersData} />} />
              <Route path="/menu-items" element={<MenuItems />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route
                path="/orders/:orderId"
                element={<OrderDetails data={ordersData} />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
