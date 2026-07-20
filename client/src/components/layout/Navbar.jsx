import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          Lost & Found
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>

          <NavLink to="/lost-items" className={navClass}>
            Lost Items
          </NavLink>

          <NavLink to="/found-items" className={navClass}>
            Found Items
          </NavLink>

          <NavLink to="/claims" className={navClass}>
            Claims
          </NavLink>

          <NavLink to="/profile" className={navClass}>
            Profile
          </NavLink>

        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">

          {isAuthenticated ? (
            <>
              <span className="font-medium text-gray-700">
                {user?.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Register
              </Link>
            </>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">

          <div className="flex flex-col p-4 gap-4">

            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/lost-items" className={navClass}>
              Lost Items
            </NavLink>

            <NavLink to="/found-items" className={navClass}>
              Found Items
            </NavLink>

            <NavLink to="/claims" className={navClass}>
              Claims
            </NavLink>

            <NavLink to="/profile" className={navClass}>
              Profile
            </NavLink>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 text-white py-2 rounded-lg text-center"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;