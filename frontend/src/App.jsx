import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
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
import EditItem from './components/EditItem';
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
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5555/menus');
        const transformedData = response.data.data.map(item => ({
          ...item,
          carbsPrice: parseFloat(item.carbsPrice.$numberDecimal),
          proteinsPrice: parseFloat(item.proteinsPrice.$numberDecimal),
          baseFat: parseFloat(item.baseFat.$numberDecimal),
        }));
        setItems(transformedData);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const updateItem = async (updatedItem) => {
    try {
      const response = await axios.put(`http://localhost:5555/menus/${updatedItem._id}`, updatedItem);
      setItems(items.map(item => item._id === updatedItem._id ? response.data : item));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5555/menus/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

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
                      <Route path="/menu-items" element={<MenuItems items={items} />} />
                      <Route path="/menu-items/edit/:itemId" element={<EditItem items={items} updateItem={updateItem} deleteItem={deleteItem} />} />
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
