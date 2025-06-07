import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) return null;

  const links = [
    { path: '/', label: 'Home' },
    { path: '/profile', label: 'Profile' },
    { path: '/problemset', label: 'Problemset' },
    { path: '/contribute', label: 'Contribute' },
    { path: '/report', label: 'Report' },
  ];

  return (
    <div className="group fixed top-0 left-0 z-40 h-full flex items-start">
      
      {/* Arrow Icon - Always visible */}
      <div
        className="w-6 h-full flex items-center justify-center z-50"
        style={{ backgroundColor: 'rgb(255,215,0)' }}
      >
        <svg
          className="w-4 h-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Sidebar - Appears only on hover */}
      <aside className="h-full w-0 overflow-hidden group-hover:w-32 transition-all duration-300">
        <div className="h-full bg-white dark:bg-gray-900 border-r dark:border-gray-700 p-4 w-32">
          {/* <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Navigation</h2> */}
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-sm ${
                    location.pathname === link.path
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white font-medium'
                      : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
