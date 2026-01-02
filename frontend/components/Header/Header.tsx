import React from "react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <div className="header">
      {/* Left Side */}
      <div className="header-box-left">
        <div className="logo">
          <img src="/Farshe Logo.png" alt="Logo" />
        </div>
        <div className="heading">
          <h1>Fārshē</h1>
        </div>
      </div>

      {/* Right Side */}
      <div className="header-box-right">
        <div className="account-icon">
          <button>
            <img src="/account logo.svg" />
          </button>
        </div>
        <div className="cart-icon">
          <button>
            <img src="/cart logo.svg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
