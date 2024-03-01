import React from 'react'
import { useState, useEffect } from 'react';
import useApi from '../../Axios_instance/axios';
import { Link } from 'react-router-dom';
// import Loader from '../../General/loader';
import Loader from '../../General/NewLoader';
import Lottie from 'lottie-react'
import emptyani from '../../lottieani/Animation - 1704965843739.json'



function PurchasedCourse() {
    const [isLoading, setIsLoading] = useState(true);
    const user_id = localStorage.getItem('user_id');

    const api = useApi()

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        setIsLoading(true)
        async function fetchCourses() {
            try {
                const response = await api.get(`courses-about/purchased-courses/${user_id}/`);
                setCourses(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching courses:", error);
                setIsLoading(false)
            }
        }

        fetchCourses();

    }, []);

    return (
        <div className="container mx-auto  mt-12 px-4">
            <h1 className="text-4xl font-bold mt-8 ml-4 text-center text-sky-700 tracking-wide md:text-left md:mr-4"> Purchased Courses</h1>
            {isLoading ? (<Loader />) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">



                {courses.length > 0 ? (courses.map(course => (
                    course.image &&
                    (<div key={course.id} className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300  p-4 rounded shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                        <img
                            src={course.image}
                            alt={course.name}
                            className="w-full h-40 object-cover rounded-t"
                        />
                        <Link to={`/chapters/${course.id}`} className="block mt-4">
                            <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                                {course.name}
                            </h5>
                            <h5 className="text-lg font-medium text-gray-600 mt-2">
                                {course.teacher.username}
                            </h5>
                        </Link>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-2xl font-bold text-gray-900">
                                ${course.price}
                            </span>
                            <Link
                                to={`/chapters/${course.id}`}
                                className="text-white bg-cyan-700 px-4 py-2 rounded hover:bg-cyan-800 focus:outline-none inline-block"
                            >
                                Watch Now
                            </Link>
                        </div>
                    </div>
                    )

                ))) : (
                    <div >


                        <h1 className='text-2xl font-bold mt-8  text-center text-red-700 tracking-wide '> No  Purchased Courses </h1>


                        <Lottie animationData={emptyani} className="w-full h-full mb-12  " />
                    </div>)}

            </div>)}

        </div>
    );

}

export default PurchasedCourse