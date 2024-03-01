import React from 'react'
import { Link } from 'react-router-dom';
import { Dropdown, Navbar } from 'flowbite-react'

import useApi from '../../Axios_instance/axios';
// import { isAuthenticated } from '../../Routes/authh';
import { isAuthenticated } from '../../Routes/NewAuth';

import { useNavigate } from 'react-router-dom'

import TooltipWrapper from '../Tooltip';
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentRole, setMainRole, setLogout } from '../../Redux/Slices/rolesSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react'
import animationData from '../../lottieani/animation_lo5qlz87.json'




function Nav() {
  const dispatch = useDispatch()
  // const [mainRole, setMainRole] = useState(localStorage.getItem('main_role'));
  // const [currentRole, setCurrentRole] = useState(localStorage.getItem('temp_role'));
  const mainRole = useSelector(state => state.roles.mainRole);
  const currentRole = useSelector(state => state.roles.currentRole);
  const profileImage = useSelector(state => state.roles.profileImage);
  const api = useApi()
  const baseUrl = "http://localhost:8000";
  // const profileImg = localStorage.getItem('profile_image');



  const navigate = useNavigate();
  const gotoregister = () => {
    navigate('/signup')

  }

  const handleRoleSwitch = () => {
    api.post('switch-role/')
      .then(response => {
        localStorage.setItem('temp_role', response.data.new_role);
        const temp_role = response.data.new_role
        dispatch(setCurrentRole(temp_role));
        // setCurrentRole(response.data.new_role)

      })
      .catch(error => {
        console.error("Error while switching role:", error);
      });
  }

  const username = localStorage.getItem('registrationusername');

  const logout = async () => {
    console.log('fromm local storage logout view ', localStorage.getItem('refresh_token'));
    const refreshToken = localStorage.getItem('refresh_token');




    try {

      await api.post('logout/', {
        refresh_token: refreshToken
      });


      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('registrationusername');
      localStorage.removeItem('main_role');
      localStorage.removeItem('user_id');
      localStorage.removeItem('temp_role');
      localStorage.clear();
      dispatch(setCurrentRole('USER'));
      dispatch(setMainRole('USER'));
      dispatch(setLogout());

      delete api.defaults.headers.common["Authorization"];
      toast.success(" Logout Successfull", {
        position: toast.POSITION.BOTTOM_CENTER,
        theme: "colored"
      });

      navigate('/')

    } catch (error) {
      console.error("Error during logout:", error);
    }
  }
  let nav_colour = ''

  if (currentRole === 'TEACHER') {
    nav_colour = 'bg-sky-300';
  }
  else if (currentRole === 'ADMIN') {
    nav_colour = 'bg-violet-300';
  }
  else if (currentRole === 'USER') {
    nav_colour = 'bg-indigo-300'
  }



  return (
    <Navbar fluid rounded className={nav_colour}>
      <Navbar.Brand href="">
        <img src="instruc.webp" className=" mr-3 h-14 w-14 sm:h-18 sm:w-18" alt="" />
        <span className="self-center whitespace-nowrap text-2xl font-bold dark:text-white  text-black">EduNest</span>
      </Navbar.Brand>

      <div className="flex md:order-2">
        <div className="flex md:order-2">
          {isAuthenticated() ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <img
                  src={profileImage ? `${profileImage}` : 'https://i0.wp.com/vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png?fit=860%2C681&ssl=1'}

                  alt="Profile"
                  className="rounded-full h-12 w-12 object-cover mb-4"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">Username : {username}</span>

              </Dropdown.Header>

              <Dropdown.Item>
                <Navbar.Link as={Link} to="/profile" className='text-sm'>Profile</Navbar.Link>
              </Dropdown.Item>

              <Dropdown.Divider />
              <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <button onClick={gotoregister} className="bg-rose-500  text-white px-4 py-2 font-medium rounded-md  hover:bg-rose-600">Register</button>
          )}
          <Navbar.Toggle />
        </div>
      </div>
      <Navbar.Collapse>
        <div className="flex flex-col md:flex-row md:space-x-16   md:ml-32">


          {/* <Navbar.Link as={Link} to="/faculty-dash" className='text-lg'>notes</Navbar.Link> */}

          {(!currentRole || (currentRole !== 'TEACHER' && currentRole !== 'ADMIN')) && <Navbar.Link as={Link} to="/" className='text-lg font-bold text-black'>Home</Navbar.Link>}
          {(!currentRole || (currentRole !== 'TEACHER' && currentRole !== 'ADMIN')) && <Navbar.Link as={Link} to="/courses" className='text-lg font-bold text-black'>Courses</Navbar.Link>}

          {(!currentRole || (currentRole !== 'TEACHER' && currentRole !== 'ADMIN')) && <Navbar.Link as={Link} to="discussion_page" className='text-lg font-bold text-black'>Discuss</Navbar.Link>}
          {(!currentRole || (currentRole !== 'TEACHER' && currentRole !== 'ADMIN')) && <Navbar.Link as={Link} to="/Quizlist" className='text-lg font-bold text-black'>Testseries</Navbar.Link>}
          {(!currentRole || (currentRole !== 'TEACHER' && currentRole !== 'ADMIN')) && <Navbar.Link as={Link} to="/family" className='text-lg font-bold text-black'>Family</Navbar.Link>}


          {/* {currentRole === "TEACHER" && <Navbar.Link as={Link} to="/faculty-dash" className='text-lg'>Dashboard</Navbar.Link>} */}
          {currentRole === "TEACHER" && <Navbar.Link as={Link} to="/faculty-course-manage" className='text-lg'>Course Management</Navbar.Link>}
          {currentRole === "TEACHER" && <Navbar.Link as={Link} to="/faculty-testseries" className='text-lg'>Quiz Management</Navbar.Link>}

          {(mainRole === 'TEACHER' && currentRole !== 'USER') && <TooltipWrapper content="This switches to user side"> <button onClick={handleRoleSwitch} className="  text-lg  px-1 py-1  border-2 border-white rounded-lg  hover:bg-red-400 font-bold text-black "> User side</button> </TooltipWrapper>}
          {(mainRole === 'TEACHER' && currentRole === 'USER') && <TooltipWrapper content="This switches to Faculty side"> <button onClick={handleRoleSwitch} className="  text-lg  px-1 py-1  border-2 border-white rounded-lg  hover:bg-red-400 font-bold text-black "> Faculty side</button> </TooltipWrapper>}



          {currentRole === "ADMIN" && <Navbar.Link as={Link} to="/admin-dash" className='text-lg'> Dashboard</Navbar.Link>}
          {currentRole === "ADMIN" && <Navbar.Link as={Link} to="/admin-courses-manage" className='text-lg'>Course Management</Navbar.Link>}
          {currentRole === "ADMIN" && <Navbar.Link as={Link} to="/admin-user-manage" className='text-lg'>Users</Navbar.Link>}
          {currentRole === "ADMIN" && <Navbar.Link as={Link} to="/admin-faculties" className='text-lg'>Faculties</Navbar.Link>}

          {(!currentRole || (currentRole !== 'TEACHER' && currentRole !== 'ADMIN')) && <div className="flex items-center ">
            <Navbar.Link as={Link} to="/careers" className='text-lg mb-2 font-bold text-black'>Careers</Navbar.Link>
            {/* <div className="w-10 h-10">
              <Lottie animationData={animationData} className="w-full h-full mb-1" />
            </div> */}
          </div>}
          {(mainRole === 'ADMIN' && currentRole !== 'USER') && <TooltipWrapper content="This switches to user side"> <button onClick={handleRoleSwitch} className=" text-black font-semibold text-lg  px-1 py-1  border-2 border-white rounded-lg  hover:bg-red-400 "> User side</button> </TooltipWrapper>}
          {(mainRole === 'ADMIN' && currentRole === 'USER') && <TooltipWrapper content="This switches to Admin side"> <button onClick={handleRoleSwitch} className=" text-black font-semibold text-lg  px-1 py-1  border-2 border-white rounded-lg  hover:bg-red-400 "> Admin side</button> </TooltipWrapper>}

        </div>
      </Navbar.Collapse>
      <ToastContainer />

    </Navbar>
  )
}

export default Nav