"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import "./orders.css";

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    id: number;
    totalAmount: number;
    status: string;
    items: string; // JSON string
    address: string;
    phone: string;
    city: string;
    zip: string;
    createdAt: string;
}

const OrdersPage = () => {
    const { user, isLoading: authLoading } = useAuth();

    const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
        queryKey: ["my-orders"],
        queryFn: () => apiCall("/orders/my-orders"),
        enabled: !!user,
    });

    if (authLoading) return (
        <div className="orders-loading">
            <div className="persian-spinner">
                <div className="spinner-inner"></div>
                <div className="spinner-center">✦</div>
            </div>
            <p>Verifying Heritage Identity...</p>
        </div>
    );

    if (!user) {
        return (
            <div className="orders-empty-state">
                <div className="empty-icon">🛡️</div>
                <h1>Restricted Access</h1>
                <p>Please log in to view your collection acquisition history.</p>
                <Link href="/login" className="btn-primary">Log In</Link>
            </div>
        );
    }

    return (
        <main className="user-orders-main">
            <div className="orders-container">
                <div className="orders-header-section">
                    <h1 className="persian-title">My Collection Acquisitions</h1>
                    <p className="subtitle">Tracking your journey through Fārshē's heritage.</p>
                </div>

                {ordersLoading ? (
                    <div className="orders-loading-inline">
                        <div className="persian-spinner small">
                            <div className="spinner-inner"></div>
                        </div>
                        <p>Retrieving your masterpieces...</p>
                    </div>
                ) : orders && orders.length > 0 ? (
                    <div className="orders-list">
                        {orders.map((order) => {
                            const items: OrderItem[] = JSON.parse(order.items);
                            return (
                                <div key={order.id} className="order-card">
                                    <div className="order-card-header">
                                        <div className="order-meta">
                                            <span className="order-number">Order #{order.id}</span>
                                            <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className={`status-badge ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </div>
                                    </div>
                                    <div className="order-delivery-info">
                                        <div className="info-group">
                                            <span className="label">Delivery Destination:</span>
                                            <span className="value">{order.address}, {order.city} - {order.zip}</span>
                                        </div>
                                        <div className="info-group">
                                            <span className="label">Contact Number:</span>
                                            <span className="value">{order.phone}</span>
                                        </div>
                                    </div>
                                    <div className="order-card-content">
                                        <div className="order-items-preview">
                                            {items.map((item, idx) => (
                                                <div key={idx} className="order-item-row">
                                                    <img src={item.image} alt={item.name} className="item-thumb" />
                                                    <div className="item-details">
                                                        <span className="item-name">{item.name}</span>
                                                        <span className="item-qty">Quantity: {item.quantity}</span>
                                                    </div>
                                                    <span className="item-subtotal">₹{item.price.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="order-card-footer">
                                            <div className="total-label">Acquisition Value</div>
                                            <div className="total-value">₹{order.totalAmount.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="orders-empty-state">
                        <div className="empty-icon">🏛️</div>
                        <h2>Your Collection is Empty</h2>
                        <p>Begin your heritage journey by exploring our curated galleries.</p>
                        <Link href="/shop" className="btn-primary">View Collection</Link>
                    </div>
                )}
            </div>
        </main>
    );
};

export default OrdersPage;
