import React from 'react'
import useApi from '../../Axios_instance/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import Lottie from 'lottie-react'
import animationData from '../../lottieani/Animation - 1704965843739.json'



function SavedQuestions() {
  const [answerresponse, setAnswerresponse] = useState([])
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const api = useApi()

  const user_id = localStorage.getItem('user_id');




  const [showDropdown, setShowDropdown] = useState(() => Array(answerresponse.length).fill(false));

  const getAnswerkey = async () => {
    try {
      const response = await api.get(`testseries/saved-questions/${user_id}/`);

      setAnswerresponse(response.data)

    } catch (error) {
      console.error('Error fetching answerkey:', error);
    }
  };
  useEffect(() => {

    getAnswerkey()

  }, [bookmarkedIds])


  const handlebookmark = async (questionId) => {
    try {
      const response = await api.post(`testseries/toggle_bookmark/${questionId}/`);
      console.log(response.data)
      console.log(bookmarkedIds)

      setBookmarkedIds((prevIds) => {
        if (response.data.is_bookmarked) {
          return [...prevIds, questionId];
        } else {
          return prevIds.filter((id) => id !== questionId);
        }
      });

      console.log(response.data, 'response))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))')



    } catch (error) {
      console.error('Error bookmarking:', error);
    }
  };




  const toggleDropdown = (index) => {
    setShowDropdown((prevShowDropdown) => {
      const updatedState = [...prevShowDropdown];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  };

  console.log(answerresponse)


  return (
    <>
      <h2 className="text-4xl font-bold  text-center text-sky-700 tracking-wide md:text-left md:mr-4 mt-8 ml-6 mb-12">
        Bookmarked Questions
      </h2>
      {answerresponse.length > 0 ? (answerresponse.map((answer, index) => (

        <div key={answer.id}
          className=" rounded-md  mt-6 bg-gradient-to-r from-rose-100 via-purple-200 to-green-300 shadow-xl p-8 mr-16 ml-6  hover:transform transition-transform duration-300 hover:-translate-y-2">


          <div className="flex items-center justify-between">

            <span className="text-lg font-bold">{answer.question.text}</span>
            <div className="flex items-center space-x-4 ">
              <button
                onClick={() => toggleDropdown(answer.id)}
                className=" text-black text-2xl focus:outline-none"
              >
                {showDropdown[answer.id] ? '-' : '+'}
              </button>
              <FontAwesomeIcon onClick={() => handlebookmark(answer.id)}
                icon={faBookmark}
                className={answer.is_bookmarked ? 'text-blue-500' : 'text-gray-500'}

              />
            </div>
          </div>

          {showDropdown[answer.id] && (
            <div className="mt-4">
              <label className="block font-semibold mb-1">Correct Answer:</label>
              <span className="text-green-500 font-bold">{answer.correct_option.text}</span>

              <label className="block font-semibold mt-2 mb-1">Selected Option:</label>
              <span className={`font-bold ${bookmarkedIds.includes(answer.id) || answer.is_bookmarked ? 'text-blue-500' : 'text-gray-500'}`}>
                {answer.selected_option ? answer.selected_option.text : 'Not Attempted'}
              </span>


            </div>
          )}

        </div>
      ))) :

        (
          <div className='flex items-center  ml-96'>
            <Lottie animationData={animationData} className="w-2/4 h-2/4 mt-2" />
            <h2 className="text-4xl font-bold mb-4 text-center text-stone-500 tracking-wide md:text-left md:mr-4">
              Saved Notes is Empty
            </h2>
          </div>
        )}




    </>

  )
}

export default SavedQuestions