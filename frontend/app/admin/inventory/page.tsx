"use client";
import React, { useState } from 'react';
import AdminLayout from '../AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCall } from '@/utils/api';
import './Inventory.css';

const AdminInventory = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        sku: '', 
        category: 'Modern', 
        price: '', 
        stock: '', 
        image: '/bestseller1.png', 
        description: '' 
    });

    const { data: products, isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const res = await apiCall('/products');
            return res;
        }
    });

    const addProductMutation = useMutation({
        mutationFn: async (newProduct: any) => {
            if (isEditing && editId) {
                return await apiCall(`/admin/products/${editId}`, 'PUT', newProduct);
            }
            return await apiCall('/admin/products', 'POST', newProduct);
        },
        onSuccess: (data: any, variables: any) => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            setShowForm(false);
            resetForm();
            alert(isEditing ? "Masterpiece updated in the archives." : "New masterpiece integrated successfully.");
        }
    });

    const deleteProductMutation = useMutation({
        mutationFn: async (id: number) => {
            return await apiCall(`/admin/products/${id}`, 'DELETE');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            alert("Masterpiece permanently removed from archives.");
        }
    });

    const resetForm = () => {
        setFormData({ name: '', sku: '', category: 'Modern', price: '', stock: '', image: '/bestseller1.png', description: '' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price.toString(),
            stock: product.stock.toString(),
            image: product.image,
            description: product.description || ''
        });
        setIsEditing(true);
        setEditId(product.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const lowStockItems = products?.filter((p: any) => p.stock < 10) || [];

    if (isLoading) return <AdminLayout>Counting Heritage Inventory...</AdminLayout>;

    return (
        <AdminLayout>
            <div className="inventory-header">
                <h2 className="persian-title">Inventory Control</h2>
                <button 
                    className="btn-primary"
                    onClick={() => {
                        if (showForm) resetForm();
                        setShowForm(!showForm);
                    }}
                >
                    {showForm ? 'Close Editor' : 'Acquire New Heritage'}
                </button>
            </div>

            {showForm && (
                <div className="product-form-container fade-in">
                    <form className="admin-form" onSubmit={(e) => {
                        e.preventDefault();
                        addProductMutation.mutate(formData);
                    }}>
                        <h3 className="form-subtitle">{isEditing ? `Modifying: ${formData.name}` : 'New Masterpiece Entry'}</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Enter masterpiece name"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>SKU</label>
                                <input 
                                    type="text" 
                                    value={formData.sku}
                                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                    placeholder="Enter stock keeping unit"
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input 
                                    type="number" 
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    placeholder="Enter acquisition price"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Current Stock</label>
                                <input 
                                    type="number" 
                                    value={formData.stock}
                                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                    placeholder="Enter stock quantity"
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Heritage Description</label>
                            <textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Enter detailed technical and artistic description..."
                            ></textarea>
                        </div>
                        <div className="form-actions-row">
                            <button type="submit" className="btn-primary" disabled={addProductMutation.isPending}>
                                {addProductMutation.isPending ? 'Syncing...' : (isEditing ? 'Commit Changes' : 'Integrate Entry')}
                            </button>
                            {isEditing && <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>}
                        </div>
                    </form>
                </div>
            )}

            <div className="inventory-grid">
                <div className="inventory-section">
                    <h3>Low Stock Alerts</h3>
                    <div className="alert-list">
                        {lowStockItems.length > 0 ? lowStockItems.map((p: any) => (
                            <div key={p.id} className="alert-item">
                                <div className="p-info">
                                    <p className="p-name">{p.name}</p>
                                    <p className="p-sku">{p.sku}</p>
                                </div>
                                <span className="stock-count">{p.stock} units left</span>
                            </div>
                        )) : <p className="no-alerts">All items well stocked.</p>}
                    </div>
                </div>

                <div className="inventory-section">
                    <h3>Master Archive</h3>
                    <div className="p-table-container">
                        <table className="p-table">
                            <thead>
                                <tr>
                                    <th>Masterpiece</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                    <th style={{ textAlign: 'right' }}>Management</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((p: any) => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="p-cell-info">
                                                <span className="p-name-main">{p.name}</span>
                                                <span className="p-sku-sub">{p.sku}</span>
                                            </div>
                                        </td>
                                        <td>{p.category}</td>
                                        <td><span className={`stock-badge ${p.stock < 10 ? 'low' : ''}`}>{p.stock}</span></td>
                                        <td>₹{p.price.toLocaleString()}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="p-actions">
                                                <button className="btn-edit-inline" onClick={() => handleEdit(p)}>Edit</button>
                                                <button 
                                                    className="btn-delete-inline" 
                                                    onClick={() => {
                                                        if (window.confirm(`Permanently remove ${p.name} from the archives?`)) {
                                                            deleteProductMutation.mutate(p.id);
                                                        }
                                                    }}
                                                    disabled={deleteProductMutation.isPending}
                                                >
                                                    {deleteProductMutation.isPending ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminInventory;
