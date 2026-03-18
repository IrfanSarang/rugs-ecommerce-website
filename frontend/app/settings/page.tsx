"use client";

import React from "react";
import Link from "next/link";
import "./settings.css";

const SettingsPage = () => {
    return (
        <main className="settings-main">
            <div className="settings-container fade-in">
                <div className="settings-header">
                    <h1 className="persian-title">Account Settings</h1>
                    <p className="subtitle">Manage your heritage acquisition profile and preferences.</p>
                </div>

                <div className="settings-grid">
                    <div className="settings-section">
                        <h3>Profile Information</h3>
                        <div className="settings-card">
                            <div className="settings-item placeholder">
                                <span className="label">Profile Customization</span>
                                <p>Personalize your experience within the Fārshē collection.</p>
                                <div className="status-tag">Coming Soon</div>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>Security & Privacy</h3>
                        <div className="settings-card">
                            <div className="settings-item placeholder">
                                <span className="label">Access Vault</span>
                                <p>Adjust your security credentials and heritage identity protection.</p>
                                <div className="status-tag">Coming Soon</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-footer">
                    <Link href="/" className="btn-secondary">Return to Gallery</Link>
                </div>
            </div>
        </main>
    );
};

export default SettingsPage;
