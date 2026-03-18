"use client";

import React from "react";
import "./NavigationBar.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationBar: React.FC = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Designers", href: "/designers" },
    { name: "Blog", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="main-nav-container">
      <ul>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={mounted && pathname === link.href ? "active" : ""}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
