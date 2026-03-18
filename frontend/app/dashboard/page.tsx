"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiCall } from '@/utils/api';
import NavigationBar from '@/components/NavigationBar/NavigationBar';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const { user, isLoading: authLoading } = useAuth();
    
    const { data: orders, isLoading: ordersLoading } = useQuery({
        queryKey: ['my-orders'],
        queryFn: () => apiCall('/auth/my-orders'),
        enabled: !!user
    });

    if (authLoading) return <div className="loading-state">Identifying Heritage Patron...</div>;
    if (!user) return <div className="auth-required">Please login to view your collection.</div>;

    return (
        <div className="customer-dashboard-page">
            <NavigationBar />
            <main className="dashboard-container">
                <header className="dashboard-header">
                    <div className="welcome-text">
                        <h1 className="persian-title">Loyalty Hub</h1>
                        <p>Welcome back, Master <span className="patron-name">{user.name}</span></p>
                    </div>
                    <div className="loyalty-card">
                        <div className="card-top">
                            <span className="card-label">Heritage Points</span>
                            <span className="points-value">2,450 HP</span>
                        </div>
                        <div className="card-bottom">
                            <p>Next Reward: 5,000 HP for 15% Archive Discount</p>
                            <div className="points-bar">
                                <div className="fill" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="dashboard-grid">
                    {/* Zone 1: Acquisition History */}
                    <section className="dashboard-section history-section">
                        <div className="section-header">
                            <h2>Your Acquisitions</h2>
                            <p>Tracking your heritage collection</p>
                        </div>
                        <div className="order-list">
                            {ordersLoading ? (
                                <p>Retrieving acquisition records...</p>
                            ) : orders?.length > 0 ? (
                                orders.map((order: any) => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-info">
                                            <span className="order-id">#ORD-{order.id.toString().padStart(4, '0')}</span>
                                            <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="order-status">
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="order-total">
                                            ₹{order.totalAmount.toLocaleString()}
                                        </div>
                                        <div className="order-actions">
                                            <button className="btn-track">Track Package</button>
                                            <Link href={`/orders/${order.id}`} className="btn-details">Details</Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-history">
                                    <p>Your archive is currently empty.</p>
                                    <Link href="/shop" className="btn-browse">Browse Collection</Link>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Zone 2: Profile & Wishlist */}
                    <aside className="dashboard-sidebar">
                        <div className="sidebar-widget profile-widget">
                            <h3>Patron Profile</h3>
                            <div className="profile-details">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Status:</strong> Global Collector</p>
                                <button className="btn-outline">Edit Profile</button>
                            </div>
                        </div>

                        <div className="sidebar-widget address-widget">
                            <h3>Saved Addresses</h3>
                            <p className="empty-text">No addresses saved.</p>
                            <button className="btn-link">+ Add New Address</button>
                        </div>

                        <div className="sidebar-widget wishlist-preview">
                            <h3>Wishlist Insight</h3>
                            <p className="empty-text">Your list is a blank canvas.</p>
                            <Link href="/shop" className="btn-link">Save Masterpieces</Link>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CustomerDashboard;
