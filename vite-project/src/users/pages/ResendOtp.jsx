import React from 'react'
import { useState, useEffect } from 'react';
import useApi from '../../Axios_instance/axios';
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch ,useSelector} from 'react-redux'
// import {setCurrentRole,setMainRole} from '../../Redux/Slices/rolesSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ResendOtp() {
    const dispatch = useDispatch()
    console.log('otp is running')
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
        const handleResendOTPSumbit = async (e) => {
       

            try {
                const response = await api.post('resend-otp/', {
                    
                    username: username
                });
                
               
    
               
                }
    
            catch(error){
                toast.error("Please enter Correct OTP", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    theme: "colored"
                });
                
    
            }
           
        };
        handleResendOTPSumbit()
    }, [])
    
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
            const response = await api.post('verify-ResendOTPView/', {
                otp: enteredOTP,
                username: username
            });
            toast.success(" OTP successfully verified ", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            navigate('/login')

           
            }

        catch(error){
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

export default ResendOtp