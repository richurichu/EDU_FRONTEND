import React, { useEffect, } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../Axios_instance/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function QuizAnswerkey() {
    const [answerresponse, setAnswerresponse] = useState([])
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    
    const api = useApi()
    
    const user_id =  localStorage.getItem('user_id');
    
    const { id: quizId } = useParams(); 
    

    const [showDropdown, setShowDropdown] = useState(() => Array(answerresponse.length).fill(false));

    const getAnswerkey = async () => {
            try {
              const response = await api.get(`testseries/get-answerkey/${user_id}/${quizId}/`);
                 
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
         
          console.log(response.data , 'response))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))')
          toast.success("successful", {
            position: toast.POSITION.BOTTOM_CENTER,
            
        });
        

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
        <h2 className="text-4xl font-bold  text-center text-sky-700 tracking-wide md:text-left md:mr-4 mt-12 mb-12 ml-6">
        Quiz Response
      </h2 >
        {answerresponse && answerresponse.map((answer,index)=>(
            
        <div key={answer.id}
        className=" rounded-md  mb-6 bg-gradient-to-r from-rose-100 via-purple-200 to-green-300 shadow-xl p-8 mr-16 ml-6 hover:transform transition-transform duration-300 hover:-translate-y-2">
            
            
        <div className="flex items-center justify-between">
        
          <span className="text-lg font-bold">{answer.question.text}</span>
          <div className="flex items-center space-x-4 ">
          <button
           onClick={() => toggleDropdown(answer.id)}
            className=" text-black text-2xl focus:outline-none"
          >
            {showDropdown[answer.id] ? '-' : '+'}
          </button>
          <FontAwesomeIcon onClick={()=>handlebookmark(answer.id)}
        icon={faBookmark}
        className={answer.is_bookmarked ? 'text-blue-500' : 'text-gray-500'}
       
      />
        </div>
        </div>
  
        {showDropdown[answer.id] && (
          <div className="mt-4">
            <label className="block font-semibold mb-1">Correct Answer:</label>
            <span className="text-green-500 font-bold">{answer.correct_option.text}</span>
  
            <label className="block font-semibold mt-2 mb-1">Selelcted Option:</label>
            <span className={`font-bold ${bookmarkedIds.includes(answer.id) || answer.is_bookmarked ? 'text-blue-500' : 'text-gray-500'}`}>
            {answer.selected_option ? answer.selected_option.text : 'Not Attempted'}
            </span>

           
            </div>
        )}
        
      </div>
      ))}

      
      
      </>
      

      
  )
}

export default QuizAnswerkey