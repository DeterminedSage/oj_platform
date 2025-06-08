import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../utils'

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

    // setSendInfo({
    //   name: fullName,
    //   email,
    //   password,
    // });

      try {
      const url = 'http://localhost:8080/auth/login';
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

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import { handleError, handleSuccess } from '../utils';

// function Register() {
//   const [signupInfo, setSignupInfo] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     termsAccepted: false
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSignupInfo((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     const { fullName, email, password, confirmPassword, termsAccepted } = signupInfo;

//     if (!fullName || !email || !password || !confirmPassword) {
//       return handleError('All fields are required');
//     }
//     if (password !== confirmPassword) {
//       return handleError('Passwords do not match');
//     }
//     if (!termsAccepted) {
//       return handleError('Please accept the terms and conditions');
//     }

//     try {
//       const url = 'http://localhost:8080/auth/signup';
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: fullName, email, password }),
//       });

//       const result = await response.json();
//       const { success, message } = result;

//       if (success) {
//         handleSuccess(message);
//         setTimeout(() => navigate('/login'), 1000);
//       } else {
//         handleError(message);
//       }
//     } catch (err) {
//       handleError(err.message || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="py-10">
//       <section className="bg-gray-50">
//         <div className="flex flex-col md:flex-row items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mt-10 mb-20">
//           {/* Register Box */}
//           <div className="w-full md:w-2/3 bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//             <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//               <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//                 Create an account
//               </h1>
//               <form className="space-y-2 md:space-y-3" onSubmit={handleSignup}>
//                 <div>
//                   <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
//                   <input
//                     onChange={handleChange}
//                     value={signupInfo.fullName}
//                     type="text"
//                     name="fullName"
//                     id="fullName"
//                     autoComplete="name"
//                     placeholder="John Doe"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
//                   <input
//                     onChange={handleChange}
//                     value={signupInfo.email}
//                     type="email"
//                     name="email"
//                     id="email"
//                     autoComplete="email"
//                     placeholder="name@company.com"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
//                   <input
//                     onChange={handleChange}
//                     value={signupInfo.password}
//                     type="password"
//                     name="password"
//                     id="password"
//                     autoComplete="new-password"
//                     placeholder="••••••••"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
//                   <input
//                     onChange={handleChange}
//                     value={signupInfo.confirmPassword}
//                     type="password"
//                     name="confirmPassword"
//                     id="confirmPassword"
//                     autoComplete="new-password"
//                     placeholder="••••••••"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
//                   />
//                 </div>
//                 <div className="flex items-start">
//                   <div className="flex items-center h-5">
//                     <input
//                       id="terms"
//                       type="checkbox"
//                       name="termsAccepted"
//                       onChange={handleChange}
//                       checked={signupInfo.termsAccepted}
//                       className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600"
//                     />
//                   </div>
//                   <div className="ml-3 text-sm">
//                     <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
//                       I accept the <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Terms and Conditions</a>
//                     </label>
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//                 >
//                   Create an account
//                 </button>
//                 <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//                   Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
//                 </p>
//               </form>
//               <ToastContainer />
//             </div>
//           </div>

//           {/* Right-side Image */}
//           <div className="hidden md:block w-1/3 p-4">
//             <img
//               src="https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/ntp1_bgr.png"
//               alt="Register Illustration"
//               className="scale-[0.60] object-contain"
//             />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Register;







