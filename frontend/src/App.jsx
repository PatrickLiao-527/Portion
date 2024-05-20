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
import Login from './components/Login';
import Signup from './components/Signup'; 
import mealImage from './assets/icons/chickenBreast.png';
import './App.css';

const ordersData = [
  {
    orderId: '#1',
    customerName: 'James Smith',
    date: 'May 13th, 2024',
    time: '9:15 AM',
    amount: '$12.29',
    paymentType: 'Online',
    status: 'Complete',
    mealImage: mealImage,
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <>
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
                      <Route path="/my-profile" element={<MyProfile />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/order-details/:id" element={<OrderDetails />} />
                    </Routes>
                  </div>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
