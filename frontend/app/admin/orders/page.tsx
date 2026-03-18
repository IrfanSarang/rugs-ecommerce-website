"use client";
import React from 'react';
import AdminLayout from '../AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCall } from '@/utils/api';
import './Orders.css';

const AdminOrders = () => {
    const queryClient = useQueryClient();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const res = await apiCall('/admin/orders');
            return res;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: string }) => {
            return await apiCall(`/admin/orders/${id}/status`, 'PUT', { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        }
    });

    if (isLoading) return <AdminLayout>Retrieving Royal Orders...</AdminLayout>;

    return (
        <AdminLayout>
            <div className="orders-header">
                <h2 className="persian-title">Order Management</h2>
                <div className="bulk-actions">
                    <button className="btn-secondary">Bulk Mark Delivered</button>
                    <button className="btn-secondary">Export CSV</button>
                </div>
            </div>

            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((order: any) => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>
                                    <div className="customer-info">
                                        <p className="name">{order.customerName}</p>
                                        <p className="email">{order.customerEmail}</p>
                                    </div>
                                </td>
                                <td>{order.phone || 'N/A'}</td>
                                <td>
                                    <div className="location-info">
                                        <p className="address">{order.address}</p>
                                        <p className="city-zip">{order.city}, {order.zip}</p>
                                    </div>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>₹{order.totalAmount.toLocaleString()}</td>
                                <td>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        value={order.status}
                                        onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                                        className="status-select"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
