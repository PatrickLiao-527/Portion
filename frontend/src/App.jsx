import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import AuthContext from './AuthContext';
import './App.css';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/email-verification" element={<EmailVerification />} /> 
          <Route
            path="/*"
            element={
              user ? (
                <>
                  <Header />
                  <main>
                    <Sidebar />
                    <div className="content">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/my-orders" element={<MyOrders />} />
                        <Route path="/menu-items" element={<MenuItems />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/my-profile" element={<MyProfile />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                      </Routes>
                    </div>
                  </main>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
