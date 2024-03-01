import React from 'react'
import useApi from '../../Axios_instance/axios'
import {useNavigate} from 'react-router-dom'
import { useEffect,useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import './Signup.css';
// import Loader from '../../General/loader';
import Loader from '../../General/NewLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react'
import animationData from '../../lottieani/animation_lo5okwp7.json'


function Signup() {
    const [loading, setLoading] = useState(false);
    const api = useApi()
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const debouncedUsername = useDebounce(username, 500); 
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [hasStartedTyping, setHasStartedTyping] = useState(false);

    const passwordStrengthColor = {
      weak: { color: '#D50000' },   // red
      moderate: { color: '#FFA000' },  // orange
      strong: { color: '#007D00' }   // green
     };
    const isValidEmail = (email) => {
      const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,4}$/;
      return pattern.test(email);
     };

     const getPasswordStrength = (pwd) => {
      if (pwd.length < 6) return 'weak';
      if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[@$!%*#?&]/.test(pwd)) return 'strong';
      return 'moderate';
      };

      const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);
    
        setPasswordStrength(getPasswordStrength(passwordValue));
        checkPasswordMatch(passwordValue, passwordConfirm);
        setHasStartedTyping(true);
        };
    
        const handlePasswordConfirmChange = (e) => {
        const passwordConfirmValue = e.target.value;
        setPasswordConfirm(passwordConfirmValue);
    
        checkPasswordMatch(password, passwordConfirmValue);
    };
    
    const checkPasswordMatch = (pwd, pwdConfirm) => {
        setPasswordMatch(pwd === pwdConfirm);
    };

    const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (!isValidEmail(emailValue)) {
        setEmailError('Please enter a valid email address.');
    } else {
        setEmailError('');  // clear the error if the email is valid
    }
    };

    useEffect(() => {
      if (debouncedUsername) {
          checkUsernameAvailability(debouncedUsername);
      }
    }, [debouncedUsername, api]);
  
    const checkUsernameAvailability = async (usernameToCheck) => {
      try {
          const response = await api.get('check_username/', { params: { username: usernameToCheck } });
          setIsUsernameAvailable(response.data.isAvailable); // Assuming your API responds with a boolean `isAvailable`
      } catch (error) {
          console.error('Error checking username availability:', error.response.data);
      }
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        if (/\s/.test(username) || /\s/.test(password)) {
          toast.error("Invalid charectors ", {
            position: toast.POSITION.TOP_CENTER,
            theme: "colored"
          });
          return;
        }
        if (password !== passwordConfirm) {
            setErrorMessage("Passwords do not match!");
            console.log('password not match ');
            return;
        }
        if (emailError) {
       
          return;
            }
            if (isUsernameAvailable === false) {
              // Handle username not available
              console.log('Username is not available');
              setErrorMessage('The username is already taken.'); 
              return;
          }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);

       
        try {
           setLoading(true)
            const response = await api.post('UserRegistrationView/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log('Otp has send:', response.data);
            setLoading(false)
            localStorage.setItem('registrationusername', username);
            localStorage.setItem('pass', passwordConfirm);
            toast.success(" OTP has been send to your Email", {
              position: toast.POSITION.TOP_CENTER,
              theme: "colored"
            });
            navigate('/otp');
            
        } catch (error) {
          setLoading(false)
            
          toast.error('Error registering user:', error.response.data);
        }
    };

    const handlelogin =()=>{
      navigate('/login')
    }


  return (
    <>
    { loading ? (<Loader />):(
   <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-t from-rose-300 to-indigo-300 first-letter">
    <div className="w-full lg:w-1/2 ml-10 py-20 lg:py-0 flex items-center">
        <div className='w-3/4 h-3/4 mx-auto lg:mt-4' >
            <Lottie animationData={animationData} className="w-full h-full" />
        </div>
    </div>

    <div className="w-full lg:w-1/2 flex items-center justify-center   ">
        <div className="rounded-md w-10/12 mx-auto shadow-2xl px-6 lg:px-12 py-6 mb-4 lg:mb-0 bg-gradient-to-r from-rose-100 via-purple-200 to-pink-300 max-h-screen overflow-y-auto ">
            <form onSubmit={handleSubmit}>
                <div className="   lg:text-3xl text-4xl font-bold mb-4  text-sky-700 tracking-wide">Signup</div>
      
      <div className="mb-4">
        <label htmlFor="username" className="block font-medium text-black" required style={{ fontSize: "20px" }}>Username</label>
        <textarea id="username" value={username}onChange={e => setUsername(e.target.value)}   style={{ resize: "none" }} className="w-full p-1 rounded-lg bg-white " required></textarea>
        {debouncedUsername && (  // Ensure there's a username to check before showing feedback
        isUsernameAvailable ? 
        <p className="text-green-500 mt-1 text-lg font-medium">Username is available!</p> : 
        <p className="text-red-500 mt-1 text-lg font-medium">Username is already taken.</p>
    )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block font-medium text-black" required style={{ fontSize: "20px" }}>Email </label>
        <textarea id="email" value={email} onChange={handleEmailChange} style={{ resize: "none" }} className="w-full p-1 rounded-lg bg-white " required></textarea>
        {emailError && <p className="text-red-500 mt-1 text-lg font-medium">{emailError}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block font-medium text-black" required style={{ fontSize: "20px" }}>Password</label>
        <textarea id="password"  value={password} onChange={handlePasswordChange}style={{ resize: "none" }} className="w-full p-1 rounded-lg bg-white " required></textarea>
        {hasStartedTyping && (
       <div style={{  ...passwordStrengthColor[passwordStrength] }}>
        Password Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
       </div>
       )}
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword"  className="block font-medium text-black" required style={{ fontSize: "20px" }}>Confirm Password</label>
        <textarea id="confirmPassword" value={passwordConfirm} onChange={handlePasswordConfirmChange}  style={{ resize: "none" }} className="w-full p-1 rounded-lg bg-white " required></textarea>
        {!passwordMatch && <div className="text-lg font-medium mt-1 text-red-500">Passwords do not match!</div>}
      </div>

      <div className="flex justify-center items-center mt-9">
    <button type="submit" className="bg-sky-600 text-white px-6 py-2 font-medium rounded-md transform hover:scale-105 hover:shadow-xl transition-all duration-300">
        Submit
    </button>
       </div>
    
    <div className="flex justify-center items-center mt-5">
        <p onClick={handlelogin} className='font-medium cursor-pointer'>Already Have an Account ? </p>
    </div>
    </form>
    <ToastContainer />
    </div>
    </div>
    </div>
   ) }
   
   </>
  )
}

export default Signup