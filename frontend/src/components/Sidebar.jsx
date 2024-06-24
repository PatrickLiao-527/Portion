import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/styles/Sidebar.css';
import { ReactComponent as DashboardIcon } from '../assets/icons/dashBoard_icon.svg';
import { ReactComponent as OrdersIcon } from '../assets/icons/myOrders_icon.svg';
import { ReactComponent as MenuItemsIcon } from '../assets/icons/menuItems_icon.svg';
//import { ReactComponent as TransactionsIcon } from '../assets/icons/transactions.svg';
//import { ReactComponent as ReportsIcon } from '../assets/icons/reports_icon.svg';
// import { ReactComponent as SettingsIcon } from '../assets/icons/settings_icon.svg';
import sidebarToggleIcon from '../assets/icons/sidebarToggle_icon.svg';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <img src={sidebarToggleIcon} alt="Toggle Sidebar" />
            </div>
            <div className={`sidebar-wrapper ${isOpen ? 'open' : 'closed'}`}>
                <NavLink to="/owner/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <div className="icon-wrapper">
                        <DashboardIcon />
                    </div>
                    Dashboard
                </NavLink>
                <NavLink to="/owner/my-orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <div className="icon-wrapper">
                        <OrdersIcon />
                    </div>
                    My Orders
                </NavLink>
                <NavLink to="/owner/menu-items" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <div className="icon-wrapper">
                        <MenuItemsIcon />
                    </div>
                    Menu Items
                </NavLink>
                {/*
                <NavLink to="/owner/transactions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <div className="icon-wrapper">
                        <TransactionsIcon />
                    </div>
                    Transactions
                </NavLink>
                */}
                {/*
                <NavLink to="/owner/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <div className="icon-wrapper">
                        <ReportsIcon />
                    </div>
                    Reports
                </NavLink>*/}
                {/*<NavLink to="/owner/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <div className="icon-wrapper">
                        <SettingsIcon />
                    </div>
                    Settings
                </NavLink>*/}
            </div>
        </>
    );
};

export default Sidebar;
