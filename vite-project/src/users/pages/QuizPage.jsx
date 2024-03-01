import React from 'react'
import { useEffect,useState } from 'react';
import QuestionTab from '../components/QuestionTab'
import QuizQuestion from '../components/QuizQuestion'
import useApi from '../../Axios_instance/axios';
import { useParams } from 'react-router-dom';





function QuizPage() {
    const { id: quizId } = useParams(); 

    const [questions, setQuestions] = useState([])
    const [attempted, setAttempted] = useState([])

    
    const [timeOver, setTimeOver] = useState(false)
    
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const [currentquestionid, setCurrentquestionid] = useState('')
   
    const [openModal, setOpenModal] = useState(false);
    
    
    
    const api = useApi()
    
    const loadquiz = async () => {
    
        try {
          const response = await api.get(`testseries/get-quiz/${quizId}/`);
         
          setQuestions(response.data)
          console.log(response.data , 'response))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))')
         
         
        } catch (error) {
          console.error('Error fetching comments:', error);
        } 
      };

    useEffect(() => {
        loadquiz()
        
        if (!currentquestionid){
            setCurrentquestionid(0)
        }
        console.log(currentquestionid,' id of the question ')

        const countdown = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(countdown);
                    handleTimerZero();
  
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
    
    }, [minutes, seconds])

    const handleTimerZero = () => {
     
        setTimeOver(true)
      };

    const handleindexchange = (index)=>{
        setCurrentquestionid(index)

    }

    const handlesubmitclick = ()=>{
        setOpenModal(true)
    }
   
    
    
    
  return (
    <>
    
      <div className="flex flex-wrap sm:flex-nowrap ">
      <div className="w-full sm:w-full lg:w-1/5 mt-4   sm:mt-0">
      {questions && <QuestionTab questions = {questions} setCurrentquestionid= {setCurrentquestionid} currentquestionid ={currentquestionid} attempted={attempted} handlesubmitclick={handlesubmitclick} minutes={minutes}  seconds ={seconds} timeOver={timeOver}/>} 
      </div>
      <div className="w-full sm:w-full lg:w-4/5 mt-8 sm:mt-0  sm:ml-10 lg:ml-24">
        <QuizQuestion currentquestionid = {currentquestionid} questionArray={questions} handleindexchange = {handleindexchange} setAttempted = {setAttempted} attempted={attempted}  openModal ={openModal} setOpenModal={setOpenModal} timeOver={timeOver} setTimeOver={setTimeOver} quizId={quizId}/>
      </div>
    </div>
    
    
    </>
  )
}

export default QuizPage