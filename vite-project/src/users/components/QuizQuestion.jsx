
import { useState,useEffect } from 'react';
import { Button, Modal } from 'flowbite-react';
import useApi from '../../Axios_instance/axios';
import Piechart from '../../General/PiechartAnalysis';
import Lottie from 'lottie-react'
import animationData from '../../lottieani/Animation - 1699614231849 (2).json'
import animationSad from '../../lottieani/Animation - 1699676534015 (1).json'
import {useNavigate} from 'react-router-dom'



    


function QuizQuestion({currentquestionid,questionArray,handleindexchange,setAttempted,openModal,setOpenModal,timeOver,setTimeOver,quizId,attempted}) {
    const api = useApi()
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState( {});

    const [openresultmodal, setOpenresultmodal] = useState(false)

    const [answeredCount, setAnsweredCount] = useState(0);
    const [unattemptedCount, setUnattemptedCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
   
    const [marks, setMarks] = useState(0);
    
    const [shouldLeave, setShouldLeave] = useState(true);

    const user_id = localStorage.getItem('user_id')
    const testseries_id  = localStorage.getItem('testseries_id' )

   
    
    const question_option = Object.values(questionArray);
    
    
    const optionslist = [ 'A', 'B','C','D']
    const currentquestion = question_option[currentquestionid]

    useEffect(() => {
        const handleBeforeUnload = (event) => {
          const confirmationMessage = 'Are you sure you want to leave? Your quiz response will be lost.';

          if(shouldLeave){event.returnValue = confirmationMessage; 
            event.preventDefault(); 
            return confirmationMessage;}
          
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);
    
    const onsubmitQuiz = async () => {
        try {
            // setTimeOver(true)
            const response = await api.post('testseries/get-marks/', {
                testseries_id : quizId,
                user_id : user_id,
                selectedOptions: selectedOptions
            });
            
         
          setOpenModal(false)
          setAnsweredCount(response.data.correct_count);
          setUnattemptedCount(response.data.unattempted_count);
          setIncorrectCount(response.data.incorrect_count);
          setMarks(response.data.total_marks)
          setOpenresultmodal(true)
        //   localStorage.setItem('testseries_id'  , response.data.testseries_id )
          
          
         
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };
      console.log('correctanswer ',answeredCount, 'unattempted',unattemptedCount, 'incorrect',incorrectCount)

      const closeresultmodal = ()=>{
        setOpenresultmodal(false)
        setAnsweredCount('');
        setUnattemptedCount('');
        setIncorrectCount('');
        setMarks()
        setShouldLeave(false)
        setTimeOver(false)
        navigate('/Quizlist')

      }

    
    const handleprev = ()=>{
        console.log('currentquestionid:', currentquestionid);
        console.log('questionArray.length:', questionArray.length);

        if (currentquestionid >0){
            handleindexchange(currentquestionid-1)

        }
        
    }
    const handlenext = ()=>{
        if (currentquestionid < question_option.length -1){
            handleindexchange(currentquestionid+1)

        }
        
    }

    const handleOptionSelect = (questionId, selectedOptionId) => {
        setSelectedOptions((prevSelectedOptions) => ({
          ...prevSelectedOptions,
          [questionId]: selectedOptionId,
        }));
        // setAttempted((attemptedQuestions) => [...attemptedQuestions, currentquestionid]);
        setAttempted((attemptedQuestions) => {
           
            if (!attemptedQuestions.includes(currentquestionid)) {
            
              return [...attemptedQuestions, currentquestionid];
            }
         
            return attemptedQuestions;
          });
      };
    
      console.error(selectedOptions)
    
    const isOptionSelected = (questionId, optionId) => {
        return selectedOptions[questionId] === optionId;
      };
    
    const clearSelectedOptions = () => {
       
        const updatedSelectedOptions = { ...selectedOptions };
    
        delete updatedSelectedOptions[currentquestion.id];
    
        setSelectedOptions(updatedSelectedOptions);
        setAttempted((attemptedQuestions) => attemptedQuestions.filter((attempted) => attempted !== currentquestionid));

      };
    
      if (timeOver){
        onsubmitQuiz()

      }
    
    
   
  return (
   <>
    <div className="w-full  sm:w-3/4 lg:w-1/2 p-8  sm:mt-16 mx-auto shadow-2xl bg-slate-100">
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
          {currentquestion && currentquestionid +1}: {currentquestion && currentquestion.text}
        </p>
        <div   className="space-y-4 p-4">
            {currentquestion && currentquestion.options.map((option,index)=>(<div onClick={()=>handleOptionSelect(currentquestion.id,option.id)}  className={`bg-gray-200 p-6 rounded-lg ${
                  isOptionSelected(currentquestion.id, option.id) ? 'bg-green-200' : ''
                }`}>
            Option {optionslist[index]}: <span className="text-lg sm:text-xl font-semibold shadow-2xl ml-2">{option.text}</span>
          </div>))}
        </div>
        <div className="flex justify-between mt-4">
        {currentquestionid > 0 &&( <button onClick={handleprev} className="px-4 py-2 bg-gray-600 text-white rounded-lg ml-4 hover:bg-sky-600">
            Prev
          </button>)}
          <button onClick={clearSelectedOptions} className="px-4 py-2 bg-gray-400 text-white rounded-lg ml-4 hover:bg-sky-600">
            Clear
          </button>
          {currentquestionid <question_option.length-1 &&(<button onClick={handlenext} className="px-4 py-2 bg-gray-600 text-white rounded-lg mr-4 hover:bg-sky-600">
            Next
          </button>)}
         
        </div>
        <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className="mb-10 text-lg font-normal text-gray-500 dark:text-white">
                            Are you sure you want to finish this Quiz?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure"  onClick={onsubmitQuiz}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {openresultmodal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-64 bg-black bg-opacity-50">
    <div className="bg-white p-24 flex rounded shadow-lg w-4/5 relative">
      
      <div className="w-4/12 mr-16 mt-24">
        <Piechart
          answered={answeredCount}
          unattempted={unattemptedCount}
          incorrect={incorrectCount}
        />
        <div className="mt-6 ml-10">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-green-300 mr-2 mt-2"></div>
            <span className='font-semibold'>Correct ({answeredCount})</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-red-600 mr-2 mt-2"></div>
            <span className='font-semibold'>Incorrect  ({incorrectCount})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-slate-500 mr-2 mt-2"></div>
            <span className='font-semibold'>Unattempted ({unattemptedCount})</span>
          </div>
        </div>
      </div>

      
      <div className="w-8/12 ">
      <button
            className="absolute top-4 right-4 text-3xl font-bold text-gray-500 hover:text-red-500 "
            onClick={closeresultmodal}
          >
            X
          </button>
        <div className="bg-white  rounded  relative ">
        
          {marks>0 ?(<Lottie animationData={animationData} className="w-full h-full " />) :(<Lottie animationData={animationSad} className="w-full h-full " />)}
          <p className="text-lg font-bold text-center mt-4">Your Score is {marks}</p>
          
        </div>
      </div>
    </div>
  </div>
)}
      </div>
   </>
  )
}

export default QuizQuestion