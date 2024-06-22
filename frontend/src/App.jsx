// src/OwnerApp.js
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
import Login from './components/Login';
import Signup from './components/Signup';
import EmailVerification from './components/EmailVerification';
import ContactUs from './components/ContactUs';
import NotificationBar from './components/NotificationBar';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/owner/login" element={<Login />} />
      <Route path="/owner/signup" element={<Signup />} />
      <Route path="/owner/email-verification" element={<EmailVerification />} />
      <Route path="/owner/contact-us" element={<ContactUs />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/owner/*"
          element={
            <>
              <Header />
              <NotificationBar /> 
              <main>
                <Sidebar />
                <div className="content">
                  <Routes>
                    <Route path="/owner" element={<Dashboard />} />
                    <Route path="/owner/dashboard" element={<Dashboard />} />
                    <Route path="/owner/my-orders" element={<MyOrders />} />
                    <Route path="/owner/menu-items" element={<MenuItems />} />
                    <Route path="/owner/transactions" element={<Transactions />} />
                    <Route path="/owner/my-profile" element={<MyProfile />} />
                    <Route path="/owner/reports" element={<Reports />} />
                    <Route path="/owner/settings" element={<Settings />} />
                    <Route path="/owner/contact-us" element={<ContactUs />} />
                  </Routes>
                </div>
              </main>
            </>
          }
        />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App;
