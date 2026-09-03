import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MapPin, Menu, X } from "lucide-react";

function NavbarSection() {
  const [showMenu, setShowMenu] = useState(false);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="site-nav">
        <div className="container nav-shell">
          <Link to="/" className="brand-mark">
            <span className="brand-icon"><MapPin size={22} /></span>
            <span><strong>ExplorePlace</strong></span>
          </Link>
          <div className="nav-links d-none d-lg-flex">
            {navLinks.map((item) => (
              <NavLink end={item.path === "/"} key={item.path} to={item.path} className={({ isActive }) => `nav-link-item${isActive ? " active" : ""}`}>
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="nav-actions">
            <button className="nav-icon-btn d-flex d-lg-none" onClick={() => setShowMenu(true)} aria-label="Open menu"><Menu size={21} /></button>
          </div>
        </div>
      </nav>
      <div className={`mobile-nav-backdrop${showMenu ? " show" : ""}`} onClick={() => setShowMenu(false)} />
      <aside className={`mobile-nav${showMenu ? " show" : ""}`}>
        <div className="mobile-nav-head">
          <Link to="/" className="brand-mark" onClick={() => setShowMenu(false)}>
            <span className="brand-icon"><MapPin size={20} /></span>
            <span><strong>ExplorePlace</strong></span>
          </Link>
          <button className="nav-icon-btn" onClick={() => setShowMenu(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <div className="mobile-nav-links">
          {navLinks.map((item) => (
            <NavLink end={item.path === "/"} key={item.path} to={item.path} onClick={() => setShowMenu(false)} className={({ isActive }) => isActive ? "active" : ""}>
              {item.name}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}

export default NavbarSection;
