import React from "react";
import "./contact.css";

const AboutPage: React.FC = () => {
  return (
    <main>
      <section className="contact-section">
        <div className="contact-grid">
          {/* LEFT: FORM */}
          <div className="contact-card">
            <h2>Get in Touch</h2>

            <form className="contact-form">
              <div className="row">
                <div>
                  <label>Name</label>
                  <input type="text" placeholder="Enter your name*" />
                </div>

                <div>
                  <label>Phone Number</label>
                  <input type="tel" placeholder="Enter your phone number*" />
                </div>
              </div>

              <label>Email</label>
              <input type="email" placeholder="Enter your email*" />

              <label>Your Message</label>
              <textarea placeholder="Write your message"></textarea>

              <button type="submit">Send Message</button>
            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="right-column">
            {/* CONTACT INFO */}
            <div className="contact-card">
              <h2>Contact Information</h2>

              <div className="info-item">
                <span>📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>+91-773 365 1240</p>
                </div>
              </div>

              <div className="info-item">
                <span>📍</span>
                <div>
                  <strong>Address</strong>
                  <p>Mira Road, Thane</p>
                </div>
              </div>

              <div className="info-item">
                <span>✉️</span>
                <div>
                  <strong>Email</strong>
                  <p>office@Farshe.com</p>
                </div>
              </div>
            </div>

            {/* BUSINESS HOURS */}
            <div className="contact-card">
              <h2>Business Hours</h2>

              <div className="hours">
                <div>
                  <strong>Monday - Friday</strong>
                  <p>9:00 am - 8:00 pm</p>
                </div>
                <div>
                  <strong>Saturday</strong>
                  <p>11:00 am -11:00 pm</p>
                </div>
                <div>
                  <strong>Sunday</strong>
                  <p>9:00 am - 11:00 pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
