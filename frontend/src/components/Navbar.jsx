import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-gray-900 border-gray-700 z-50 relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-1 rtl:space-x-reverse ml-4">
          <img
            src="https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/ultimate_final.png"
            className="h-8"
            alt="Leaf Logic Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Leaf Coders
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 bg-gray-900 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded-sm md:p-0 ${
                  location.pathname === '/'
                    ? 'text-blue-500 bg-blue-800 md:bg-transparent'
                    : 'text-white hover:bg-gray-700'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/problemset"
                className={`block py-2 px-3 rounded-sm md:p-0 ${
                  location.pathname === '/problemset'
                    ? 'text-blue-500 bg-blue-800 md:bg-transparent'
                    : 'text-white hover:bg-gray-700'
                }`}
              >
                Problemset
              </Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/login"
                    className={`block py-2 px-3 rounded-sm md:p-0 ${
                      location.pathname === '/login'
                        ? 'text-blue-500 bg-blue-800 md:bg-transparent'
                        : 'text-white hover:bg-gray-700'
                    }`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={`block py-2 px-3 rounded-sm md:p-0 ${
                      location.pathname === '/register'
                        ? 'text-blue-500 bg-blue-800 md:bg-transparent'
                        : 'text-white hover:bg-gray-700'
                    }`}
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="block py-2 px-3 rounded-sm md:p-0 text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

