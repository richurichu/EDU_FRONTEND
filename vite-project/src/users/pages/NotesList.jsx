import React from 'react'
import useApi from '../../Axios_instance/axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react'

import emptyani from '../../lottieani/Animation - 1704965843739.json'




function NotesList() {
  const api = useApi()
  const [chapters, setchapters] = useState([])
  const user_id = localStorage.getItem('user_id');
  const fetchChapters = async () => {

    try {
      const response = await api.get(`notes-about/available-chapters/${user_id}/`);

      setchapters(response.data);
      console.log(chapters)


    } catch (error) {
      console.error("Error fetching chapters:", error);
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchChapters()
  }, [])


  return (

    <>

      <h2 className="text-4xl font-bold mt-8 ml-6 text-center text-sky-700 tracking-wide md:text-left md:mr-4">
        Your Saved Notes
      </h2>
      <div className="flex items-start justify-normal w-full space-x-32 mt-16 ml-8  ">
        {chapters.length > 0 ? (Array.from(new Set(chapters.map((chapter) => chapter.chapter.title))).map((uniqueChapterTitle) => (
          <Link
            to={`/notes-views/${uniqueChapterTitle}`} key={uniqueChapterTitle}>
            <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 shadow-xl p-4  rounded-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-[100px] w-[200px]">

              <div className="mb-4 space-y-2 ">
                <p className='text-3xl font-semibold text-center mt-4'>{uniqueChapterTitle}</p>
              </div>
            </div>
          </Link>
        ))) : (<div className='flex items-center  ml-96'>

          <Lottie animationData={emptyani} className="w-6/12 h-6/12 mb-12  " />
          <h2 className="text-4xl font-bold mb-4 text-center text-stone-500 tracking-wide md:text-left md:mr-4">
             Saved Notes is Empty
          </h2>
          
        </div>)}
      </div>
    </>




  )
}

export default NotesList