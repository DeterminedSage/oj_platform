import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const baseURL = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('Email and password are required');
    }

    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, jwtToken, name } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setTimeout(() => navigate('/'), 1000);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="py-10">
      <section className="bg-gray-50">
        <div className="flex flex-col md:flex-row items-center justify-center gap-x-2 px-4 py-8 mx-auto md:h-screen lg:py-0 mt-6 mb-16">
          {/* Left-side Image */}
          <div
            className="hidden md:block w-[30%]"
            style={{ height: '100%', overflow: 'hidden' }}
          >
            <img
              src="https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/ntp1_bgr.png"
              alt="Login Illustration"
              className="scale-[1.00] object-contain"
              style={{ height: '100%' }}
            />
          </div>

          {/* Login Box */}
          <div className="w-full md:w-[38%] bg-gray-900 rounded-lg shadow border border-gray-700 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                Sign in to your account
              </h1>
              <form className="space-y-3" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    onChange={handleChange}
                    value={loginInfo.email}
                    type="email"
                    name="email"
                    id="email"
                    autoFocus
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                    Password
                  </label>
                  <input
                    onChange={handleChange}
                    value={loginInfo.password}
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign In
                </button>
                <p className="text-sm font-light text-gray-300">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-primary-500 hover:underline"
                  >
                    SignUp here
                  </Link>
                </p>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;








