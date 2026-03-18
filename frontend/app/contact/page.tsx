"use client";
import React from "react";
import "./contact.css";

const ContactPage: React.FC = () => {
  return (
    <main className="contact-main">
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-header-mini">
            <span>Get In Touch</span>
            <h2>Let's Start a Conversation</h2>
          </div>

          <div className="contact-grid">
            {/* LEFT: FORM */}
            <div className="contact-form-card fade-in">
              <div className="card-header">
                <h3>Send Us a Message</h3>
              </div>

              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter your full name" required />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Enter your phone number" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email address" required />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <select className="form-select">
                    <option>General Inquiry</option>
                    <option>Custom Rug Request</option>
                    <option>Order Status</option>
                    <option>Wholesale Partnership</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>How can we help?</label>
                  <textarea placeholder="Enter your message or inquiry..."></textarea>
                </div>

                <button type="submit" className="btn-send">
                  Send Message
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN */}
            <div className="contact-info-column fade-in delay-1">
              {/* CONTACT INFO CARD */}
              <div className="info-card gold-border">
                <h3>Contact Details</h3>

                <div className="info-list">
                  <div className="info-item-enhanced">
                    <div className="icon-box">📞</div>
                    <div className="info-text">
                      <strong>Call Us At</strong>
                      <a href="tel:+917733651240" className="contact-link">+91-773 365 1240</a>
                    </div>
                  </div>

                  <div className="info-item-enhanced">
                    <div className="icon-box">📍</div>
                    <div className="info-text">
                      <strong>Visit Our Studio</strong>
                      <a href="https://maps.google.com/?q=Mira+Road,Thane,Maharashtra" target="_blank" rel="noopener noreferrer" className="contact-link">Mira Road, Thane, Maharashtra</a>
                    </div>
                  </div>

                  <div className="info-item-enhanced">
                    <div className="icon-box">✉️</div>
                    <div className="info-text">
                      <strong>Email Inquiries</strong>
                      <a href="mailto:office@Farshe.com" className="contact-link">office@Farshe.com</a>
                    </div>
                  </div>
                </div>

                <div className="social-connect">
                  <h4>Follow Our Journey</h4>
                  <div className="social-links">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon ig" title="Instagram">IG</a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon fb" title="Facebook">FB</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon tw" title="Twitter">TW</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon in" title="LinkedIn">IN</a>
                  </div>
                </div>
              </div>

              {/* HOURS CARD */}
              <div className="info-card dark-bg">
                <h3>Business Hours</h3>
                <div className="hours-list">
                  <div className="hour-row">
                    <span>Monday - Friday</span>
                    <strong>9:00 AM - 8:00 PM</strong>
                  </div>
                  <div className="hour-row">
                    <span>Saturday</span>
                    <strong>11:00 AM - 11:00 PM</strong>
                  </div>
                  <div className="hour-row highlight">
                    <span>Sunday</span>
                    <strong>9:00 AM - 11:00 PM</strong>
                  </div>
                </div>
                <div className="availability-notice">
                  <span className="dot pulse"></span> Online support available 24/7
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
