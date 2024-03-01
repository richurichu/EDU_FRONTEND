import React from 'react'
import { useState, useEffect } from 'react';
import useApi from '../../Axios_instance/axios';
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch ,useSelector} from 'react-redux'
import {setCurrentRole,setMainRole} from '../../Redux/Slices/rolesSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Otp() {
    const dispatch = useDispatch()
    console.log('otp is running ')
    const api = useApi()
    const navigate = useNavigate();
    const username = localStorage.getItem('registrationusername');
    const initialMinutes = parseInt(localStorage.getItem('minutes')) || 4;
    const initialSeconds = parseInt(localStorage.getItem('seconds')) || 59;

    const [showTooltip, setShowTooltip] = useState(false);
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(initialSeconds);

    const [enteredOTP, setEnteredOTP] = useState('');

    useEffect(() => {
        const countdown = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(countdown);

                }
                else if (minutes > 0) {
                    setMinutes(prevMinutes => prevMinutes - 1);
                    setSeconds(59);
                }
                else {
                    setMinutes(prevMinutes => prevMinutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000);

        return () => clearInterval(countdown);
    }, [minutes, seconds]);

    useEffect(() => {
        localStorage.setItem('minutes', minutes);
        localStorage.setItem('seconds', seconds);
    }, [minutes, seconds]);



    const handleOTPChange = (e) => {
        setEnteredOTP(e.target.value);
    };

    const handleOTPSumbit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('VerifyOTPView/', {
                otp: enteredOTP,
                username: username
            });

            if (response.status === 200) {


                const storedUsername = localStorage.getItem('registrationusername');
                const storedPassword = localStorage.getItem('pass');

                if (storedUsername && storedPassword) {
                    try {
                        const jwtResponse = await api.post('token/', {
                            username: storedUsername,
                            password: storedPassword
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            withCredentials: true
                        });

                        if (jwtResponse.status === 200) {
                            localStorage.setItem('access_token', jwtResponse.data.access);
                            localStorage.setItem('refresh_token', jwtResponse.data.refresh);

                            // Fetch user roles after successfully obtaining JWT tokens
                            try {
                                const roleResponse = await api.get('get-user-role/', {
                                    headers: {
                                        'Authorization': `Bearer ${jwtResponse.data.access}`
                                    }
                                });
                                console.log('enteredddddddddddddddddddddddddddddddd')
                                localStorage.setItem('temp_role', roleResponse.data.temp_role);
                                localStorage.setItem('main_role', roleResponse.data.role);
                                localStorage.setItem('user_id', roleResponse.data.id);
                                
                                console.log('22222222222222222222222222222222222222222')
                                const temp_role = roleResponse.data.temp_role;
                                const main_role = roleResponse.data.role;
                                console.log('23333333333333333333333333333333333333')

                                dispatch(setCurrentRole(temp_role));
                                dispatch(setMainRole(main_role));
                                console.log('44444444444444444444444444444444444444444')
                                // const mainRole = useSelector(state => state.roles.mainRole);
                                
                                console.log('555555555555555555555555555555555555')
                                
                                console.log('666666666666666666666666666666')
                                toast.success("Login Success", {
                                    position: toast.POSITION.TOP_CENTER,
                                    theme: "colored"
                                });
                                navigate('/')
                                
                                localStorage.removeItem('pass');
                               
                            } catch (roleError) {
                                toast.error("Failed to fetch user roles  why.", {
                                    position: toast.POSITION.TOP_CENTER,
                                    theme: "colored"
                                });
                            }

                           
                            localStorage.removeItem('pass');

                        } else {
                            toast.error("Failed to get JWT tokens.", {
                                position: toast.POSITION.TOP_CENTER,
                                theme: "colored"
                            });
                        }

                    } catch (jwtError) {
                        toast.error("Error during JWT token request.", {
                            position: toast.POSITION.TOP_CENTER,
                            theme: "colored"
                        });
                    }
                } else {
                    toast.error("Stored credentials missing.", {
                        position: toast.POSITION.TOP_CENTER,
                        theme: "colored"
                    });

                }

            }

        }catch(error){
            toast.error("Please enter Correct OTP", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored"
            });
            

        }
       
    };


    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">

            <div className="p-12 bg-white rounded-lg shadow-lg w-96">
                <p className="mb-4 text-2xl font-bold text-center">Verify your OTP</p>

                <p className="mb-4 text-center text-blue-800">Time remaining: <span className="font-bold">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span></p>

                <form onSubmit={handleOTPSumbit} className="flex flex-col">
                    <label htmlFor="otp-input" className="text-lg font-medium mb-2">Enter OTP:</label>
                    <input
                        type="text"
                        id="otp-input"
                        value={enteredOTP}
                        onChange={handleOTPChange}
                        maxLength={6}
                        className="mb-4 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="self-center py-2 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-700 active:bg-blue-800"
                    >
                        Verify OTP
                    </button>
                </form>

            </div>
            <ToastContainer />
        </div>

    )
}

export default Otp