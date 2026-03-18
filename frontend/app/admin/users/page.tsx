"use client";
import React from 'react';
import AdminLayout from '../AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCall } from '@/utils/api';
import './Users.css';

const AdminUsers = () => {
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await apiCall('/admin/users');
            return res;
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id: number) => {
            return await apiCall(`/admin/users/${id}`, 'DELETE');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }
    });

    const toggleRoleMutation = useMutation({
        mutationFn: async ({ id, isAdmin }: { id: number; isAdmin: boolean }) => {
            return await apiCall(`/admin/users/${id}/role`, 'PUT', { isAdmin: !isAdmin });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }
    });

    if (isLoading) return <AdminLayout>Listing Fārshē Patrons...</AdminLayout>;

    return (
        <AdminLayout>
            <div className="section-header">
                <h2 className="persian-title">Customer Base</h2>
                <p className="section-subtitle">Manage user roles and spiritual lineage</p>
            </div>
            
            <div className="users-table-container section-dark">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Patron Name</th>
                            <th>Email Address</th>
                            <th>Joined Date</th>
                            <th>Master Status</th>
                            <th style={{ textAlign: 'right' }}>Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((u: any) => (
                            <tr key={u.id}>
                                <td className="font-bold">{u.name}</td>
                                <td className="text-muted">{u.email}</td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        className={`role-toggle-btn ${u.isAdmin ? 'is-admin' : 'is-customer'}`}
                                        onClick={() => {
                                            if(window.confirm(`Change access for ${u.name}?`)) {
                                                toggleRoleMutation.mutate({ id: u.id, isAdmin: u.isAdmin });
                                            }
                                        }}
                                        disabled={toggleRoleMutation.isPending}
                                    >
                                        <span className={`role-badge ${u.isAdmin ? 'admin' : 'customer'}`}>
                                            {u.isAdmin ? 'Master' : 'Customer'}
                                        </span>
                                    </button>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    {!u.isAdmin && (
                                        <button 
                                            className="btn-danger-minimal"
                                            onClick={() => {
                                                if(window.confirm('Excommunicate this patron?')) {
                                                    deleteUserMutation.mutate(u.id);
                                                }
                                            }}
                                            disabled={deleteUserMutation.isPending}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;
