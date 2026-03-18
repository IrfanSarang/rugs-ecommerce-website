"use client";
import React, { useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import './AdminLayout.css';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    useEffect(() => {
        if (!isLoading && (!user || !user.isAdmin)) {
            router.push('/admin/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || !user.isAdmin) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Authenticating Master Access...</p>
            </div>
        );
    }

    return (
        <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            {isSidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
            
            <main className="admin-main">
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button className="admin-mobile-toggle only-mobile" onClick={() => setIsSidebarOpen(true)}>
                            <div className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </div>
                        </button>
                        <div className="search-bar">
                            <input type="text" placeholder="Enter search query..." />
                        </div>
                    </div>
                    <div className="admin-profile">
                        <span>{user.name}</span>
                        <div className="avatar">{user.name.substring(0, 2).toUpperCase()}</div>
                    </div>
                </header>
                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
