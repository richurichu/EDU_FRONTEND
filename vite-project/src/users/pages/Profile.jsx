import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useApi from '../../Axios_instance/axios';
// import Loader from '../../General/loader';
import Loader from '../../General/NewLoader';
import { setProfileImage } from '../../Redux/Slices/rolesSlice';


function Profile() {

  const navigate = useNavigate();
  const api = useApi()
  const dispatch = useDispatch()
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImg, setprofileImg] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isloading, setIsloading] = useState(false)
  const [quizpoints, setQuizpoints] = useState('')
  const user_id = localStorage.getItem('user_id');

  const baseUrl = "http://localhost:8000";


  const handleEditClick = () => {

    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {

    const file = event.target.files[0];
    if (file) {

      submitFile(file);
    }
  };

  const submitFile = async (pic) => {
    const formData = new FormData();

    if (pic) {
      formData.append('pic', pic);
    }


    console.log(formData)
    console.log('started request ')

    try {

      const response = await api.post(
        `set-profile-image/${user_id}/`,
        formData,
        {
          headers: {

            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );
      if (response) {

        toast.success("You have posted successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          theme: "colored"
        });
        loadprofile()


      }
    } catch (error) {
      toast.error(error.response.data[0] || "error", {
        position: toast.POSITION.BOTTOM_CENTER,
        theme: "colored"
      })

    }
  }


  const loadprofile = async () => {



    try {
      setIsloading(true)

      const response = await api.get(
        `profile-details/${user_id}/`,

        {

          withCredentials: true
        }
      );

      if (response.data) {

        console.log(response.data)
        if (response.data.profile_image === null) {
          const profileImage = 'https://i0.wp.com/vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png?fit=860%2C681&ssl=1'
          console.log(profileImage, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
          setprofileImg(profileImage)

        }
        else {
          const profile_imag = response.data.profile_image
          const cleanurl = profile_imag.split('?')[0];
          setprofileImg(cleanurl)
          dispatch(setProfileImage(cleanurl));

        }

        // localStorage.setItem('profile_image', response.data.profile_image);
        // const profile_image = response.data.profile_image
        // const cleanUrl = profile_image.split('?')[0];
        // console.log('---------------------------------------------', cleanUrl)
        // dispatch(setProfileImage(cleanUrl));
        setName(response.data.username)
        setEmail(response.data.email)
        setQuizpoints(response.data.quiz_points)
        setIsloading(false)


      }
    } catch (error) {
      toast.error(error.response.data[0] || "error", {
        position: toast.POSITION.BOTTOM_CENTER,
        theme: "colored"
      })

    }
  }

  useEffect(() => {

    loadprofile()

  }, [])


  return (
    <>
      {isloading ? (
  <Loader />
) : (
  <div className="flex items-center justify-center h-screen bg-stone-100" >
    <div className="bg-gradient-to-r from-violet-200 via-red-300 to-yellow-100 p-6 md:p-12 lg:p-24 rounded-md shadow-2xl flex flex-col items-center justify-center mb-8 mx-2 sm:mx-4 lg:mx-8 xl:mx-16">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <FontAwesomeIcon
        icon={faEdit}
        className="absolute top-10 right-6 md:top-10 md:right-50 lg:top-2/4 lg:right-2/4 sm:top-96 sm:right-1/4 text-xl text-white cursor-pointer"
        onClick={handleEditClick}
      />

      <img
        src={profileImg}
        alt="Profile"
        className="rounded-full h-28 w-28 object-cover mb-4"
      />
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{name}</h2>
      <div className="flex flex-col md:flex-row space-y-2 md:space-x-4 md:space-y-0 mt-4 md:mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
          {email}
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-full">
          Quiz Points: {quizpoints}
        </button>
      </div>

      {/* Additional buttons */}
      <div className="flex flex-col md:flex-row mt-6 md:mt-8 space-y-2 md:space-y-0 md:space-x-4">
        <button onClick={() => navigate('/saved-questions')} className="bg-yellow-500 text-white px-4 py-2 rounded-full">
          Saved Questions
        </button>
        <button onClick={() => navigate('/notes')} className="bg-purple-500 text-white px-4 py-2 rounded-full">
          Saved Notes
        </button>
        <button onClick={() => navigate('/purchased-courses')} className="bg-indigo-500 text-white px-4 py-2 rounded-full">
          Purchased Courses
        </button>
      </div>
    </div>
  </div>
)}

    </>
  )
}

export default Profile