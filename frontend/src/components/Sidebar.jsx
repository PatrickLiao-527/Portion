import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/styles/Sidebar.css';
import { ReactComponent as DashboardIcon } from '../assets/icons/dashBoard_icon.svg';
import { ReactComponent as OrdersIcon } from '../assets/icons/myOrders_icon.svg';
import { ReactComponent as MenuItemsIcon } from '../assets/icons/menuItems_icon.svg';
import { ReactComponent as TransactionsIcon } from '../assets/icons/transactions.svg';
import { ReactComponent as ReportsIcon } from '../assets/icons/reports_icon.svg';
import { ReactComponent as SettingsIcon } from '../assets/icons/settings_icon.svg';

const Sidebar = () => {
  return (
    <div className="sidebar-wrapper">
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <div className="icon-wrapper">
          <DashboardIcon />
        </div>
        Dashboard
      </NavLink>
      <NavLink to="/my-orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <div className="icon-wrapper">
          <OrdersIcon />
        </div>
        My Orders
      </NavLink>
      <NavLink to="/menu-items" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <div className="icon-wrapper">
          <MenuItemsIcon />
        </div>
        Menu Items
      </NavLink>
      <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <div className="icon-wrapper">
          <TransactionsIcon />
        </div>
        Transactions
      </NavLink>
      <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <div className="icon-wrapper">
          <ReportsIcon />
        </div>
        Reports
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <div className="icon-wrapper">
          <SettingsIcon />
        </div>
        Settings
      </NavLink>
    </div>
  );
};

export default Sidebar;