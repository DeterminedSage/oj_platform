import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const baseURL = import.meta.env.VITE_BACKEND_URL;

function Register() {
  const [signupInfo, setSignupInfo] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupInfo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, termsAccepted } = signupInfo;

    if (!fullName || !email || !password || !confirmPassword) {
      return handleError('All fields are required');
    }
    if (password !== confirmPassword) {
      return handleError('Passwords do not match');
    }
    if (!termsAccepted) {
      return handleError('Please accept the terms and conditions');
    }

    try {
      const url = `${baseURL}/auth/signup`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const result = await response.json();
      const { success, message } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate('/login'), 1000);
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
        <div className="ml-12 md:ml-32 lg:ml-52 flex flex-col md:flex-row md:gap-x-48 items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          {/* Register Box */}
          <div className="w-full md:w-2/3 bg-gray-900 rounded-lg shadow border border-gray-700 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                Create an account
              </h1>
              <form className="space-y-2 md:space-y-3" onSubmit={handleSignup}>
                <div>
                  <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-white">Full Name</label>
                  <input
                    onChange={handleChange}
                    value={signupInfo.fullName}
                    type="text"
                    name="fullName"
                    id="fullName"
                    autoComplete="name"
                    placeholder="John Doe"
                    className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                  <input
                    onChange={handleChange}
                    value={signupInfo.email}
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                  <input
                    onChange={handleChange}
                    value={signupInfo.password}
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-white">Confirm password</label>
                  <input
                    onChange={handleChange}
                    value={signupInfo.confirmPassword}
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      name="termsAccepted"
                      onChange={handleChange}
                      checked={signupInfo.termsAccepted}
                      className="w-4 h-4 border border-gray-600 rounded bg-gray-800 focus:ring-3 focus:ring-primary-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-light text-gray-300">
                      I accept the <a href="#" className="font-medium text-primary-500 hover:underline">Terms and Conditions</a>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Create an account
                </button>
                <p className="text-sm font-light text-gray-300">
                  Already have an account? <Link to="/login" className="font-medium text-primary-500 hover:underline">Login here</Link>
                </p>
              </form>
              <ToastContainer />
            </div>
          </div>

          {/* Right-side Image */}
          <div className="hidden md:block w-1/3" style={{ height: '100%', overflow: 'hidden' }}>
            <img
              src="https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/sasuke2_bgr.png"
              alt="Register Illustration"
              className="scale-[1.0] object-contain"
              style={{ height: '100%' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;



