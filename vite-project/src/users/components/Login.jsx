import React from 'react'
import axios from 'axios';
import  { useState } from 'react'
import useApi from '../../Axios_instance/axios';
import {useNavigate} from 'react-router-dom'
import { useDispatch ,useSelector} from 'react-redux'
import {setCurrentRole,setMainRole,setProfileImage} from '../../Redux/Slices/rolesSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Lottie from 'lottie-react'
// import animationData from '../../lottieani/animation_lo5zanlx.json'
// import animationData from '../../lottieani/Animation - 1704970076712.json'
import animationData from '../../lottieani/Animation - 1704970830610.json'

// import Loader from '../../General/loader';
import Loader from '../../General/NewLoader';
import { Modal, Button, Label, Textarea, FileInput } from 'flowbite-react';



function Login() {
   
    
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const api = useApi()
    const [Otp, setOtp] = useState('')
    const [name, setName] = useState('')
    const [changepassword, setchangepassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [ispasswordModalOpen, setIsPassModalOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isConfirmOtpModalOpen, setIsConfirmOtpModalOpen] = useState(false);
    

    const handleSubmit = async e => {
        setLoading(true)
        e.preventDefault();

        const user = {
            username: username,
            password: password
        };

        let isLoginSuccessful = false;
        try {
            const { data } = await api.post(
                'token/',
                user,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            // Storing tokens in localstorage
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('registrationusername', username);
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
            try {
                const isOtpVerified = await api.post(`check-otp-verified/`,{ username: username }, {
                    headers: {
                        'Authorization': `Bearer ${data.access}`
                    }
                });
                if (!isOtpVerified.data.is_verified) {
                    toast.error("OTP not verified. Redirecting to resend OTP...", {
                        position: toast.POSITION.BOTTOM_CENTER,
                        theme: "colored"
                    });
                    
                        toast.success("OTP has been succesfully send to your Email", {
                            position: toast.POSITION.BOTTOM_CENTER,
                            theme: "colored"
                        });

                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');

                    navigate('/resend_otp');
                    return;
                }
                
               
               
            } catch (roleError) {
                console.log(roleError)
                toast.error(" Sorry Admin has Blocked You !", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    theme: "colored"
                  });
                  
                  
            }

            try {
                const roleResponse = await api.get('get-user-role/', {
                    headers: {
                        'Authorization': `Bearer ${data.access}`
                    }
                });
                
                localStorage.setItem('temp_role', roleResponse.data.temp_role);
                localStorage.setItem('main_role', roleResponse.data.role);
                localStorage.setItem('user_id', roleResponse.data.id);
                localStorage.setItem('fam_id', roleResponse.data.fam_id);
                // localStorage.setItem('profile_image', roleResponse.data.profile_image);
                const temp_role = roleResponse.data.temp_role
                const main_role = roleResponse.data.role
                const profile_image = roleResponse.data.profile_image
                
                if (profile_image === null) {
                    const defaultProfileImage = 'https://i0.wp.com/vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png?fit=860%2C681&ssl=1'; // Replace with your default image path
                    dispatch(setProfileImage(defaultProfileImage));
                }
                else{dispatch(setProfileImage(profile_image));}

                dispatch(setCurrentRole(temp_role));
                dispatch(setMainRole(main_role));
                
                // const mainRole = useSelector(state => state.roles.mainRole);
                // console.log(mainRole)

                console.log(roleResponse.data.temp_role)
                console.log(roleResponse.data.role)
                isLoginSuccessful = true;
            } catch (roleError) {
                console.log(roleError)
                toast.error(" Sorry Admin has Blocked You !", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    theme: "colored"
                  });
                  localStorage.clear()
                  setLoading(false)
                   navigate('/login');
                  
            }
            console.log(localStorage.getItem('access_token'));
            console.log(localStorage.getItem('refresh_token'));
        } catch (error) {
            toast.error("Username and password not matching ", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
              });
            setLoading(false)
        }
        if (isLoginSuccessful) {
            toast.success("Login Successful", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            navigate('/');
            setLoading(false)
        } else {
            setLoading(false)
            navigate('/login');
        }
    };

    const HandleForgotPassword = async (e) => {
       

        try {
            const response = await api.post('Otp-ForgotPassword/', {
                
                username: name
            });
            toast.success("OTP has been send to your EmailId", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            localStorage.setItem('registrationusername', name);
            setIsEmailModalOpen(false);
            setIsConfirmOtpModalOpen(true)
            }

        catch(error){
            toast.error("No user found in that Username", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            

        }
       
    };
    

    const handlepasswordSumbit = async (e) => {
        if (/\s/.test(changepassword) || /\s/.test(confirmpassword)) {
            toast.error("Invalid charectors ", {
              position: toast.POSITION.TOP_CENTER,
              theme: "colored"
            });
            return;
          }
       if (changepassword !== confirmpassword){
        toast.error("Password is not matching ", {
            position: toast.POSITION.BOTTOM_CENTER,
            theme: "colored"
        });
        return

       }
       const usernam = localStorage.getItem('registrationusername');

        try {
            const response = await api.post('Newpassword-changing/', {
                Newpassword: confirmpassword,
                username: usernam
            });
            toast.success(" Password successfully changed ", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
           
            
            setIsPassModalOpen(false)
    
            }

        catch(error){
            toast.error("error occured", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored"
            });
            

        }
       
    };
    const handleOTPSumbit = async (e) => {
        const usernam = localStorage.getItem('registrationusername');
        e.preventDefault();

        try {
            const response = await api.post('verify-ResendOTPView/', {
                otp: Otp,
                username: usernam
            });
            toast.success(" OTP successfully verified ", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            setOtp(null);
            setIsConfirmOtpModalOpen(false)
            setIsPassModalOpen(true)
    
            }

        catch(error){
            toast.error("Please enter Correct OTP", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored"
            });
            

        }
       
    };

    
    
    const handleCloseModal = () => {
        setIsConfirmOtpModalOpen(false);
        
        setOtp(null);
      }

      const handleCloseEmailModal = () => {
        setIsEmailModalOpen(false);
        
        // setEmail(null);
      }

      const ForgotPassword = () => {
        setIsEmailModalOpen(true);
       
        
      }

      
      

  return (
    <>
    { loading ? (<Loader />):(
    <div className="flex h-screen bg-gradient-to-t from-rose-300 to-indigo-300">

    {/* Left Side - Vacant */}
    <div className="hidden lg:block lg:w-1/2 flex-col items-center justify-center h-full ml-48 mt-48 p-12 ">
    {/* <h1 className="text-3xl font-bold   text-sky-700 tracking-wide mb-4 ml-32">Welcome Back</h1> */}
    
    <div className="w-1/2 mb-8 ml-24">
    <Lottie animationData={animationData} className="w-full h-full" />
    </div>

    <h2 className="text-3xl font-bold mb-10 text-center text-sky-700 tracking-wide md:text-left md:mr-4 ml-4 " >Shaping the Future of Education</h2>
</div>

    

    {/* Right Side - Login Form */}
    <div className="w-full lg:w-1/2 flex items-center justify-center h-full  ">
        <div className="p-12 rounded-md w-full lg:w-6/12 border border-gray-300 shadow-2xl bg-gradient-to-r from-rose-100 via-purple-200 to-pink-300">
            <form onSubmit={handleSubmit}>
                <div className="text-4xl font-bold tracking-wider text-black text-shadow mb-6">Login</div>
    
    <div className="mb-4 mt-10">
      <label htmlFor="username" className="block font-medium text-black" style={{ fontSize: "20px" }}>Username</label>
      <textarea id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={{ resize: "none" }} className="w-full p-2 rounded-lg bg-white "></textarea>
    </div>

    <div className="mb-4">
      <label htmlFor="Password" className="block font-medium text-black" style={{ fontSize: "20px" }}>Password</label>
      <textarea id="Password"placeholder="Password" value={password}  onChange={e => setPassword(e.target.value)} style={{ resize: "none" }} className="w-full p-2 rounded-lg bg-white "></textarea> 
      <div>
      <p onClick={()=>ForgotPassword()} className="block font-semibold text-right cursor-pointer  text-black" style={{ fontSize: "15px" }}>Forgot Password</p>
      </div>
    </div>



    <div className="flex justify-center items-center mt-9">
  <button type="submit" className="bg-sky-600 text-white px-8 py-2 font-medium rounded-md transform hover:scale-105 hover:shadow-xl transition-all duration-300">
      Submit
  </button>
     </div>
  
  <div className="flex justify-center items-center mt-5">
      <p  onClick={()=>navigate('/signup')} className='font-medium cursor-pointer'>Not yet registered ?  </p>
  </div>
  </form>
  </div>
  <ToastContainer />
  </div>
  {isEmailModalOpen && (
    <Modal show={isEmailModalOpen} size="md" onClose={() => setIsEmailModalOpen(handleCloseEmailModal)}>
    <Modal.Header>Enter Email</Modal.Header>
    <Modal.Body>
        <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Enter the registered username </h3>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="name" value="UserName" />
                </div>
                <input
                    className="border rounded w-full py-2 px-3"
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div>
        </div>
        <div className="w-full mt-8">
                <Button onClick={HandleForgotPassword}>Send OTP</Button>
            </div>
    </Modal.Body>
</Modal>
  )}
  {isConfirmOtpModalOpen && (
    <Modal show={isConfirmOtpModalOpen} size="md" onClose={() => setIsConfirmOtpModalOpen(handleCloseModal)}>
    <Modal.Header>Enter OTP</Modal.Header>
    <Modal.Body>
        <div className="space-y-6">
            {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white">Enter the OTP</h3> */}

          
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="otp" value="Received OTP" />
                </div>
                <input
                    className="border rounded w-full py-2 px-3"
                    type="text"
                    id="name"
                    value={Otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                />
            </div>
        </div>
        <div className="w-full mt-8">
                <Button onClick={handleOTPSumbit}>Send OTP</Button>
            </div>
    </Modal.Body>
</Modal>
  )}

{ispasswordModalOpen && (
    <Modal show={ispasswordModalOpen} size="md" onClose={() => setIsPassModalOpen(handleCloseModal)}>
    <Modal.Header>Enter New password</Modal.Header>
    <Modal.Body>
        <div className="space-y-6">
            {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white">Enter the OTP</h3> */}

          
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="ot" value="New Password" />
                </div>
                <input
                    className="border rounded w-full py-2 px-3"
                    type="text"
                    id="name"
                    value={changepassword}
                    onChange={e => setchangepassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="otp" value="Confirm Password" />
                </div>
                <input
                    className="border rounded w-full py-2 px-3"
                    type="text"
                    id="name"
                    value={confirmpassword}
                    onChange={e => setconfirmpassword(e.target.value)}
                    required
                />
            </div>
        </div>

        <div className="w-full mt-8">
                <Button onClick={handlepasswordSumbit}>Confirm</Button>
            </div>
    </Modal.Body>
</Modal>
  )}
  </div>
  ) }
  </>
  )
}

export default Login