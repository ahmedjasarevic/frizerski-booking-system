import { Link, useLocation, useNavigate } from "react-router-dom";
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

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-logo'>
          <img src={logo} alt='Frizerski Salon' className='navbar-logo-img' />
        </Link>

        <div className='navbar-links'>
          <Link
            to='/'
            className={`navbar-link ${
              location.pathname === "/" ? "active" : ""
            }`}
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
              >
                Admin Panel
              </Link>
              <span className='navbar-user'>👤 {user?.username}</span>
              <button className='btn btn-outline btn-sm' onClick={handleLogout}>
                Odjavi se
              </button>
            </>
          ) : (
            <Link
              to='/login'
              className={`navbar-link ${
                location.pathname === "/login" ? "active" : ""
              }`}
            >
              Prijava
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
