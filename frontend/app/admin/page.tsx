"use client";
import React from 'react';
import AdminLayout from './AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { apiCall } from '@/utils/api';
import './AdminDashboard.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const AdminDashboard = () => {
    const [isMounted, setIsMounted] = React.useState(false);
    
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await apiCall('/admin/stats');
            return res;
        }
    });

    if (isLoading) return <AdminLayout>Loading Heritage Stats...</AdminLayout>;

    return (
        <AdminLayout>
            {/* Zone A: The "Pulse" (Top Row) */}
            <div className="dashboard-pulse">
                <div className="pulse-card">
                    <div className="card-icon">₹</div>
                    <div className="card-info">
                        <h3>Gross Revenue</h3>
                        <p className="value">₹{stats?.totalRevenue?.toLocaleString()}</p>
                        <span className="trend positive">↑ 12% vs last week</span>
                    </div>
                </div>
                <div className="pulse-card">
                    <div className="card-icon">%</div>
                    <div className="card-info">
                        <h3>Conversion</h3>
                        <p className="value">{stats?.conversionRate}</p>
                        <span className="trend positive">↑ 2.1% growth</span>
                    </div>
                </div>
                <div className="pulse-card">
                    <div className="card-icon">Σ</div>
                    <div className="card-info">
                        <h3>AOV (Mastery)</h3>
                        <p className="value">₹{parseInt(stats?.aov || 0).toLocaleString()}</p>
                        <span className="trend">Per Acquisition</span>
                    </div>
                </div>
                <div className="pulse-card active-live">
                    <div className="card-icon live-dot"></div>
                    <div className="card-info">
                        <h3>Recent Orders</h3>
                        <p className="value">{stats?.recentActivity}</p>
                        <span className="trend">Last 24 Hours</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-grid">
                {/* Zone B: Operations (Middle Left) */}
                <div className="dashboard-column ops-column">
                    <div className="column-section fulfillment-widget">
                        <h3>Fulfillment Status</h3>
                        <div className="status-grid">
                            <div className="status-item">
                                <span className="label">Pending</span>
                                <span className="count">{stats?.fulfillmentStatus?.Pending || 0}</span>
                            </div>
                            <div className="status-item">
                                <span className="label">Processing</span>
                                <span className="count">{stats?.fulfillmentStatus?.Processing || 0}</span>
                            </div>
                            <div className="status-item active">
                                <span className="label">Shipped</span>
                                <span className="count">{stats?.fulfillmentStatus?.Shipped || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="column-section alerts-widget">
                        <h3>Inventory Alerts</h3>
                        <div className="low-stock-list">
                            {stats?.lowStockCount > 0 ? (
                                <div className="alert-banner">
                                    <span className="warning-icon">⚠️</span>
                                    <p>{stats.lowStockCount} masterpieces require restocking</p>
                                    <button className="btn-action-small">View List</button>
                                </div>
                            ) : (
                                <p className="success-msg">All items well stocked.</p>
                            )}
                        </div>
                    </div>

                    <div className="column-section disputes-widget">
                        <h3>Customer Liquidity</h3>
                        <div className="dispute-count">
                            <span className="value">0</span>
                            <span className="label">Active Disputes</span>
                        </div>
                    </div>
                </div>

                {/* Performance Graph (Analytics Integration) */}
                <div className="dashboard-column chart-column">
                    <div className="dashboard-section chart-section">
                        <div className="section-header">
                            <h2 className="persian-title">Revenue Insight</h2>
                            <p className="section-subtitle">Real-time Acquisition Trends</p>
                        </div>
                        <div className="chart-container">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={stats?.salesData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--persian-red)" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="var(--persian-red)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#888', fontSize: 10 }}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#888', fontSize: 10 }}
                                            tickFormatter={(value) => `₹${value/1000}k`}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                background: '#fff', 
                                                border: '1px solid var(--border-subtle)', 
                                                borderRadius: '15px',
                                                boxShadow: 'var(--soft-shadow)'
                                            }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="var(--persian-red)" 
                                            strokeWidth={3}
                                            fill="url(#colorRevenue)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : null}
                        </div>
                    </div>

                    {/* Zone C: Analytics (Middle Right / Bottom) */}
                    <div className="dashboard-section best-sellers-section">
                        <div className="section-header">
                            <h2 className="persian-title">Best Sellers</h2>
                            <p className="section-subtitle">Heritage Gems by Revenue</p>
                        </div>
                        <div className="best-sellers-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Masterpiece</th>
                                        <th>Acquisitions</th>
                                        <th>Gross</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.topProducts?.map((p: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="p-cell">
                                                <img src={p.image} alt="" className="p-thumb" />
                                                <span>{p.name}</span>
                                            </td>
                                            <td>{p.quantity} units</td>
                                            <td>₹{p.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Traffic & Cart Analytics */}
            <div className="dashboard-bottom-row">
                <div className="analytics-box">
                    <h3>Abandoned Cart Rate</h3>
                    <div className="rate-circle">
                        <span className="val">{stats?.abandonedRate || '68%'}</span>
                        <div className="progress-bar" style={{ width: stats?.abandonedRate }}></div>
                    </div>
                </div>
                <div className="analytics-box traffic-sources">
                    <h3>Category Distribution</h3>
                    <div className="sources-list">
                        {stats?.categoryBreakdown?.map((s: any, idx: number) => (
                            <div key={idx} className="source-item">
                                <span className="src-name">{s.category}</span>
                                <div className="src-bar-container">
                                    <div className="src-bar" style={{ width: `${(s.count / (stats?.categoryBreakdown?.reduce((a: number, b: any) => a + b.count, 0) || 1)) * 100}%` }}></div>
                                </div>
                                <span className="src-val">{s.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
