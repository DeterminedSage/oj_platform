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
    <nav className="bg-white border-gray-200 dark:bg-gray-900 z-50 relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-1 rtl:space-x-reverse ml-4">
          <img
            src="https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/ultimate_final.png"
            className="h-8"
            alt="Leaf Logic Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Leaf Coders
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded-sm md:p-0 ${
                  location.pathname === '/'
                    ? 'text-blue-700 bg-blue-100 md:bg-transparent dark:text-blue-500'
                    : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
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
                    ? 'text-blue-700 bg-blue-100 md:bg-transparent dark:text-blue-500'
                    : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
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
                        ? 'text-blue-700 bg-blue-100 md:bg-transparent dark:text-blue-500'
                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
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
                        ? 'text-blue-700 bg-blue-100 md:bg-transparent dark:text-blue-500'
                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
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
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 dark:text-white md:dark:hover:text-red-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
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

