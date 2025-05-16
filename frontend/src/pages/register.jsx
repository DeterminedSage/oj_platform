import React,{useState} from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError } from '../utils'

function Register(){

  const [signupInfo,setSignupInfo] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const copySignupInfo = { ...signupInfo };
    if (type === "checkbox") {
      copySignupInfo[name] = checked;
      console.log('handleChange:', name, checked);
    } else {
      copySignupInfo[name] = value;
      console.log('handleChange:', name, value);
    }
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const {fullName,email,password,confirmPassword,termsAccepted} = signupInfo;
    if(!fullName || !email || !password || !confirmPassword){
      return handleError('All fields are required');
    }
    if(password !== confirmPassword){
      return handleError('Passwords do not match');
    }
    if(!termsAccepted){
      return handleError('Please accept the terms and conditions');
    }
  }


  return (
    <div className="py-10">
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Create an account
                    </h1>
                    <form className="space-y-2 md:space-y-3" action="#" onSubmit={handleSignup}>
                        <div>
                            <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                            <input onChange={handleChange} value={signupInfo.fullName} type="text" name="fullName" autoFocus id="fullName" autoComplete="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input onChange={handleChange} value={signupInfo.email} type="email" name="email" autoFocus id="email" autoComplete="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input onChange={handleChange} value={signupInfo.password} type="password" name="password" autoFocus id="password" autoComplete="new-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                            <input onChange={handleChange} value={signupInfo.confirmPassword} type="password" name="confirmPassword" autoFocus id="confirmPassword" autoComplete="new-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="terms"
                                aria-describedby="terms"
                                type="checkbox"
                                name="termsAccepted"
                                onChange={handleChange}
                                checked={signupInfo.termsAccepted}
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                            </div>
                        </div>
                        <button type="submit" className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                        </p>
                    </form>

                    <ToastContainer/>

                </div>
            </div>
        </div>
      </section>
    </div>
  )
}

export default Register
