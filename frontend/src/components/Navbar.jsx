import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../assets/logo2.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // LIMIT scroll range za shrink (0-100px)
  const scrollLimit = 100;
  const shrinkRatio = Math.min(scrollY / scrollLimit, 1); // 0 → 1

  return (
    <nav className="navbar" style={{
      padding: `${20 - 12 * shrinkRatio}px 24px`, // top/bottom padding
      backdropFilter: `blur(${20 - 8 * shrinkRatio}px)` // opcionalno blur efekt
    }}>
      <div className='navbar-container' style={{ gap: `${8 - 4 * shrinkRatio}px` }}>
        <Link to='/' className='navbar-logo'>
          <img
            src={logo}
            alt='Frizerski Salon'
            className='navbar-logo-img'
            style={{ height: `${130 - 70 * shrinkRatio}px` }} // glatko smanjuje logo
          />
        </Link>

        <div className='navbar-links'>
          <Link
            to='/'
            className={`navbar-link ${
              location.pathname === "/" ? "active" : ""
            }`}
            style={{ padding: `${10 - 4 * shrinkRatio}px ${20 - 10 * shrinkRatio}px` }}
          >
            Početna
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to='/admin'
                className={`navbar-link ${
                  location.pathname === "/admin" ? "active" : ""
                }`}
                style={{ padding: `${10 - 4 * shrinkRatio}px ${20 - 10 * shrinkRatio}px` }}
              >
                Admin Panel
              </Link>
              <span
                className='navbar-user'
                style={{ padding: `${8 - 4 * shrinkRatio}px 16px`, fontSize: `${13 - 3 * shrinkRatio}px` }}
              >
                👤 {user?.username}
              </span>
              <button
                className='btn btn-outline btn-sm'
                onClick={handleLogout}
              >
                Odjavi se
              </button>
            </>
          ) : (
            <Link
              to='/login'
              className={`navbar-link ${
                location.pathname === "/login" ? "active" : ""
              }`}
              style={{ padding: `${10 - 4 * shrinkRatio}px ${20 - 10 * shrinkRatio}px` }}
            >
              Prijava
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
