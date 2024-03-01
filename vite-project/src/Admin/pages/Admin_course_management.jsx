import React from 'react'
// import Course_add from '../Components/course_add'
import Course_add from '../Components/Course_adding'
import { useState,useEffect } from 'react';
import useApi from '../../Axios_instance/axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Modal } from 'flowbite-react';
import {useNavigate} from 'react-router-dom'


function Admin_course_management() {
    const navigate = useNavigate()
    const api = useApi()
    const [courses, setCourses] = useState([]);
    const [refreshCourses, setRefreshCourses] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState(null);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    


    
    useEffect(() => {
        const fetchCourses = async () => {
    
            try {
                const response = await api.get('courses-about/courses-adv/',);
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
    
        fetchCourses();
    }, [refreshCourses]);
    
    const handleDeleteCourseClick = (courseId) => {
        setCourseToDelete(courseId);
        setOpenModal(true);
    };

    const seerequest = () => {
        navigate('/admin-courses-requests');
       
    };


    const handleEditClick = (course) => {
        setCourseToEdit(course);
        console.log('edit started ')
        console.log(course)
    };
    

    const confirmDeleteCourse = async () => {
        try {
            const response = await api.delete(`courses-about/courses-adv/${courseToDelete}/`);
            if(response.status === 204) {
                const updatedCourses = courses.filter(course => course.id !== courseToDelete);
                setCourses(updatedCourses);
                setOpenModal(false);
                toast.success("Course deleted successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    theme: "colored"
                });
            }
        } catch (error) {
            toast.error("Error deleting course", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "colored"
            });
        }
    };
    
    


  return (
    <div className="flex h-full p-10">

    <div className="flex-none w-1/4 pr-10">
      <Course_add  initialData={courseToEdit} onCourseAdded={() => setRefreshCourses(prev => !prev)} />
      <div className="mt-4"> 
        <button onClick={seerequest}  className="mt-24 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 ml-24  rounded" >See all Applications</button>
      </div>
    </div>
   
   
    <div className="flex-1 p-5 bg-white rounded shadow-lg">
      <h2 className="mb-6 text-xl font-bold">Courses List</h2>

      {courses.length === 0 ? (
    <div className="text-center text-gray-500">No courses available</div>
) : ( courses.map(course => (
        <div key={course.id} className="flex justify-between mb-4 p-4 bg-gray-100 rounded">
            <div>
                <h3 className="text-lg">Course Name: {course.name}</h3>
                <h5 className="text-lg truncate w-64 h-10">Description: {course.description}</h5>
                
                <h3 className="text-lg">Course Price: {course.price}</h3>
                
            </div>
            <div className="space-x-4">
                 <button onClick={() => handleEditClick(course)}className="text-blue-500 hover:underline text-lg">Edit</button>
              
                 <button onClick={() => handleDeleteCourseClick(course.id)} className="text-red-500 hover:underline">Delete</button>

            </div>
        </div>
    ))
)}
      <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className="mb-10 text-lg font-normal text-gray-500 dark:text-white">
                            Are you sure you want to delete this course?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={confirmDeleteCourse}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
    </div>
    <ToastContainer />
  </div>
    )
    }


  


export default Admin_course_management