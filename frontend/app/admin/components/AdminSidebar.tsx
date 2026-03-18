"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './AdminSidebar.css';

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: '🏠', path: '/admin' },
        { name: 'Products', icon: '📦', path: '/admin/inventory' },
        { name: 'Orders', icon: '🛒', path: '/admin/orders' },
        { name: 'Customers', icon: '👥', path: '/admin/users' },
        { name: 'Marketing', icon: '🎫', path: '/admin/marketing' },
        { name: 'Settings', icon: '⚙️', path: '/admin/settings' },
        { name: 'Back to Store', icon: '🏪', path: '/' },
    ];

    return (
        <aside className={`admin-sidebar ${isOpen ? 'mobile-active' : ''}`}>
            <div className="admin-logo">
                <h2>Fārshē <span>Admin</span></h2>
                <button className="admin-sidebar-close only-mobile" onClick={() => setIsOpen(false)}>×</button>
            </div>
            <nav className="admin-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link 
                                href={item.path} 
                                className={pathname === item.path ? 'active' : ''}
                            >
                                <span className="icon">{item.icon}</span>
                                <span className="label">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
