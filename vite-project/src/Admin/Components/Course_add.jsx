import React from 'react'
import { useState, useEffect } from 'react';
import useApi from '../../Axios_instance/axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function Course_add({ onCourseAdded, initialData}) {
    const api = useApi()
    const [courseName, setCourseName] = useState('');
    const [coursedescription, setCoursedescription] = useState( '');
    const [price, setPrice] = useState('');
    const token = localStorage.getItem('access_token');

    useEffect(() => {
      if (initialData) {
          setCourseName(initialData.name);
          setCoursedescription(initialData.description);
          setPrice(initialData.price);
      }
  }, [initialData]);
  

    const handleCourseChange = (e) => {
        setCourseName(e.target.value);
    };
    const handledescriptionChange = (e) => {
      setCoursedescription(e.target.value);
  };
    const handlesetprice = (e) => {
        setPrice(e.target.value);
    };

    const handleSubmit = async e => {
      e.preventDefault();
  
      const courseData = {
          name: courseName,
          price: price,
          description: coursedescription,
      };
  
      try {
          let response;
          if (initialData && initialData.id) {
              // Update (PUT) the course
              response = await api.put(
                  `courses-about/courses-adv/${initialData.id}/`,
                  courseData,
                  {
                      headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                      },
                      withCredentials: true
                  }
              );
          } else {
              // Add (POST) a new course
              response = await api.post(
                  'courses-about/courses-adv/', 
                  courseData,
                  {
                      headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                      },
                      withCredentials: true
                  }
              );
          }
  
          if (response.data.id) {
              setCourseName('');
              setPrice('');
              setCoursedescription('');
              toast.success(
                  initialData && initialData.id ? "Course Successfully updated" : "Course Successfully added",
                  {
                      position: toast.POSITION.TOP_LEFT,
                      theme: "colored"
                  }
              );
              if (onCourseAdded) {
                  onCourseAdded();
              }
          } else {
              toast.error("Failed request", {
                  position: toast.POSITION.TOP_LEFT,
                  theme: "colored"
              });
          }
      } catch (error) {
          if (error.response && error.response.data && error.response.data.name) {
              toast.error(error.response.data.name[0], {
                  position: toast.POSITION.TOP_LEFT,
                  theme: "colored"
              });
          } else {
              toast.error("Failed request", {
                  position: toast.POSITION.TOP_LEFT,
                  theme: "colored"
              });
          }
      }
  };
  
  return (

    <div className="w-full max-w-md mx-5 mt-10">
  <form onSubmit={handleSubmit}  className="bg-slate-200 shadow-md rounded-lg  px-8 pt-4 pb-4 mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course">
        Course:
      </label>
      <textarea 
        value={courseName}
        onChange={handleCourseChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none" 
        id="course" 
        type="text" 
        placeholder="Add a New Course..."
        rows="2"
      ></textarea>

<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course">
        Description:
      </label>
      <textarea 
        value={coursedescription}
        onChange={handledescriptionChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none" 
        id="description" 
        type="text" 
        placeholder="Add a Description ..."
        rows="4"
      ></textarea>
      
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course">
        Price:
      </label>
      <textarea 
         value={price}
         onChange={handlesetprice}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none" 
        id="price" 
        type="integer" 
        placeholder="Give a Price"
        rows="2"
      ></textarea>
    </div>
    <div className="flex items-center justify-between">
      <button className="bg-indigo-500 hover:bg-red-500 text-white font-bold ml-20 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
        Submit
      </button>
    </div>
  </form>
  <ToastContainer />
</div>

  )
}

export default Course_add