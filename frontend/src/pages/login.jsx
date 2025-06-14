import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../utils'
const baseURL = process.env.REACT_APP_BACKEND_URL;

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name,value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {

    e.preventDefault();
    const { email,password } = loginInfo;

    if(!email || !password ){
      return handleError('email and password are required');
    }

    try {
      const url = `${baseURL}/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      console.log(result);
      const { success, message,jwtToken, name } = result;
      
      if(success){
          handleSuccess(message);
          localStorage.setItem('token', jwtToken);
          localStorage.setItem('loggedInUser', name);
          setTimeout(() => {
            navigate('/');
          }, 1000);
      }
      else{
          handleError(message);
      }

      console.log(result);

    } catch (err) {
      handleError(err);
    }
  };


  return (
    <div className="py-10">
      <section className="bg-gray-50">
        <div className="flex flex-col md:flex-row items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mt-10 mb-20">
          {/* Left-side Image */}
          <div className="hidden md:block w-1/3 p-4">
            <img
              src="https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/ntp1_bgr.png"
              alt="Login Illustration"
              className="scale-[0.60] object-contain"
            />
          </div>
          {/* Login Box */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-2 md:space-y-3" action="#" onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input onChange={handleChange} value={loginInfo.email} type="email" name="email" autoFocus id="email" autoComplete="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input onChange={handleChange} value={loginInfo.password} type="password" name="password" id="password" autoComplete="new-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <button type="submit" className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 my-2">SignIn</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don't have an account? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">SignUp here</Link>
                </p>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login







