import React from 'react'
import { useState,useEffect } from 'react'
import useApi from '../../Axios_instance/axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Faculty_Testseries() {
  const api = useApi()
  const [ismodel, setIsmodel] = useState(false)
  const [title, setTitle] = useState('')

  const [editmode, seteditmode] = useState(false)
  const [description, setDescription] = useState('')
  const [isquestionmodel, setIsquestionmodel] = useState(false)
  const [quizviewmodal, setQuizviewmodel] = useState(false)
  const [quiz, setquiz] = useState([])
  const [quizquestions, setQuizquestions] = useState([])
  

  
  const user_id = localStorage.getItem('user_id');
  const [questionID, setQuestionID] = useState('')
  const [question, setQuestion] = useState('');
  const [currentquizid, setcurrentquizid] = useState('')

  const [options, setOptions] = useState([
    {id :'', text: '', isCorrect: false },
    {id :'', text: '', isCorrect: false },
    { id :'' ,text: '', isCorrect: false },
    { id :'',text: '', isCorrect: false },
  ]);

  

  
 
  const handleEditClick = (questionid) => {
    seteditmode(true)
    setQuestionID(questionid.id)
    setQuestion(questionid.text)
    setOptions([
      {id :questionid.options[0].id, text: questionid.options[0].text, isCorrect: false },
      {id :questionid.options[1].id, text: questionid.options[1].text, isCorrect: false },
      {id :questionid.options[2].id, text: questionid.options[2].text, isCorrect: false },
      {id :questionid.options[3].id, text: questionid.options[3].text, isCorrect: false },
    ]);
    
    setQuizviewmodel(false)
    
    

    
    console.log( currentquizid)

    console.log(options)
    console.log(question)
   
    
    setIsquestionmodel(true)
  };






  const handleeditquestion = async () => {
    const isAtLeastOneCorrect = options.some((option) => option.isCorrect);

  if (!isAtLeastOneCorrect) {
    console.error('At least one option must be marked as correct');
    toast.error("Not selected correct option", {
      position: toast.POSITION.BOTTOM_CENTER,
      
  });
    return;
  }
    try {
        const response = await api.put(
          `testseries/update-questions-quiz_faculty/`,
          {
               
                question_id : questionID,
                question: question,
                options: options,

            }
        );

        console.log(response.data); 
       
        setQuestion('')
        setOptions([
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ]);
        seteditmode(false)
        loadquizlist()
        setIsquestionmodel(false)
        toast.success("successfully uploaded", {
          position: toast.POSITION.BOTTOM_CENTER,
          
      });

    } catch (error) {
        console.error('Error submitting question:', error);
    }
  };



  const handlesubmitquestion = async () => {
    const isAtLeastOneCorrect = options.some((option) => option.isCorrect);

  if (!isAtLeastOneCorrect) {
    console.error('At least one option must be marked as correct');
    toast.error("Not selected correct option", {
      position: toast.POSITION.BOTTOM_CENTER,
      
  });
    return;
  }
    try {
        const response = await api.post(
          `testseries/create-questions-quiz_faculty/`,
          {
                quiz_id : currentquizid,
                user_id :user_id,
                question: question,
                options: options,

            }
        );

        console.log(response.data); // Handle the response as needed
       
        setQuestion('')
        setOptions([
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ]);
        loadquizlist()
        setIsquestionmodel(false)
        toast.success("successfully uploaded", {
          position: toast.POSITION.BOTTOM_CENTER,
          
      });

    } catch (error) {
        console.error('Error submitting question:', error);
    }
  };
  


  
  const handleOptionChange = (index) => {
    const updatedOptions = [...options];
    updatedOptions[index].isCorrect = !updatedOptions[index].isCorrect;
    setOptions(updatedOptions);
  };

  const handleOptionTextChange = (index, text) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = text;
    setOptions(updatedOptions);
  };


  
  const handletitle= (e)=>{
    setTitle(e.target.value)
  }

  
  const handledescription= (e)=>{
    setDescription(e.target.value)
  }
  
  const handleQuestionModalClose= ()=>{
    setIsquestionmodel(false)
    setQuestion('')
    // setcurrentquizid('')
    setOptions('')
    
  }

  
  const PublishQuiz = async (quizid) => {
    
    
    try {
    
        const response = await api.patch(`testseries/publish-quiz_faculty/?currentquizid=${quizid}` );
      
        
        loadquizlist()
        toast.success("Quiz published successfully ", {
          position: toast.POSITION.BOTTOM_CENTER,
          
      });
    } catch (error) {
        console.error('Error publishing the quiz:', error);
      }
    };





    const UnPublishQuiz = async (quizid) => {

      try {
      
          const response = await api.patch(`testseries/unpublish-quiz_faculty/?currentquizid=${quizid}` );
        
          
          loadquizlist()
          toast.success("Quiz Unpublished successfully ", {
            position: toast.POSITION.BOTTOM_CENTER,
            
        });
      } catch (error) {
          console.error('Error publishing the quiz:', error);
        }
      };

  
  
  
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', title);
    formData.append('faculty', user_id);
    formData.append('description', description);

    console.log(formData)
    console.log('started request ')
  
    try {
        
       const response = await api.post(
          `testseries/create-quiz/`,
          formData,
          {
              headers: {
                  
                  'Content-Type': 'multipart/form-data'
              },
              withCredentials: true
          }
      );
        if (response) {
         
          setIsmodel(false);
          setTitle('')
          setDescription('')
          loadquizlist()
            
        }
    } catch (error) {
    
      
    }
  }

  const loadquizlist = async () => {
  
    try {
    
        const response = await api.get(`testseries/get-quiz_faculty/?faculty_id=${user_id}` );
        setquiz(response.data);
        console.log(response.data, 'response))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))');
      
        
    } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

  const handleViewQuizlist = async (id) => {
    try {
        setcurrentquizid(id)
        console.log()
    
        const response = await api.get(`testseries/get-quiz_faculty/${id}` );
       
        console.log(response.data, 'response))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))');
        setQuizquestions(response.data)
        setQuizviewmodel(true)
        
        console.log(currentquizid)
        
    } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };


  useEffect(() => {
    loadquizlist()
    
  }, [])

  const question_option = Object.values(quizquestions);
  console.log(question_option)

  return (
    <>
  <div className="flex justify-center mt-6">
    <button onClick={()=> setIsmodel(true)}  className="bg-green-500 text-white px-6 py-3 rounded-xl">Create Quiz</button>
  </div>
  <div className=' flex flex-col sm:flex-row mt-4'>
    
    <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-sky-300 p-6 rounded-3xl w-full sm:w-6/12 mt-6 sm:ml-8 ">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold mb-4 mr-2">Quiz List</h2>
      </div>
      {quiz && quiz.map((quizz)=>(
        !quizz.is_published &&(
      <div className="flex flex-col mb-2">
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold mb-2 mr-4">{quizz.name}</h3>
            <div className="flex space-x-4 sm:space-x-6 ml-auto">
              { quizz.question_count <=9 ?(
                <button onClick={() => {setIsquestionmodel(true),setcurrentquizid(quizz.id)}} className="bg-purple-500 text-white px-4 py-2 rounded-md">Add Question</button>
              ):(
                <button onClick={() => {PublishQuiz(quizz.id)}} className="bg-purple-500 text-white px-4 py-2 rounded-md">Publish</button>
              )}
              <button onClick={()=>handleViewQuizlist(quizz.id) } className="bg-green-500 text-white px-4 py-2 rounded-md">View</button>
            </div>
          </div>
          <p className="text-gray-600 inline font-medium">uploaded:<span className='text-red-500 ml-2'>{quizz.question_count}/10</span>  </p>
          
        </div>
      </div>)))}
    </div>
  
    
    
    <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-sky-300 p-6 rounded-3xl w-full sm:w-6/12 mt-6 sm:ml-4 sm:mr-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold mb-4 mr-2">Published</h2>
      </div>
      {quiz && quiz.map((quizz)=>(
        quizz.is_published &&(
      <div className="flex flex-col mb-2">
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold mb-2 mr-4">{quizz.name}</h3>
            <div className="flex space-x-4 sm:space-x-6 ml-auto">
              <button onClick={()=>handleViewQuizlist(quizz.id) } className="bg-green-500 text-white px-4 py-2 rounded-md">View</button>
              <button onClick={() => UnPublishQuiz(quizz.id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Unpublish</button>
            </div>
          </div>
         
        </div>
      </div>)))}
    </div>


    {ismodel && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60">
    <div className="relative bg-white p-4 lg:p-12 rounded-md w-full lg:w-2/3 h-2/3 shadow-2xl flex flex-col justify-between">
      <div>
        <button onClick={() => setIsmodel(false)} className="absolute top-2 right-2 px-3 py-1">
          ✖️
        </button>
        <h2 className="text-2xl lg:text-3xl font-semibold mb-6">Upload a New Quiz</h2>
        <label htmlFor="question" className="mb-1 block">Title:</label>
        <textarea
          style={{ resize: 'none' }}
          id="question"
          className="w-full h-16 p-2 border rounded"
          value={title}
          onChange={handletitle}
          required
        ></textarea>

        <label htmlFor="question" className="mb-1 block mt-12">Description:</label>
        <textarea
          style={{ resize: 'none' }}
          id="question"
          className="w-full h-32 p-2 border rounded"
          value={description}
          onChange={handledescription}
          required
        ></textarea>
      </div>
      <button
      onClick={handleSubmit}
        type="button"
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded "
      >
        Submit
      </button>
    </div>
  </div>
)}



{isquestionmodel && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60">
    <div className="relative bg-white p-4 lg:p-12 rounded-md w-full lg:w-2/3 h-2/3 shadow-2xl flex flex-col justify-between">
      <div>
        <button onClick={handleQuestionModalClose} className="absolute top-2 right-2 px-3 py-1">
          ✖️
        </button>
        <h2 className="text-2xl lg:text-3xl font-semibold mb-6">Add a New Question</h2>

        <label htmlFor="question" className="mb-1 block">
          Question:
        </label>
        <textarea
          className="w-full h-16 p-2 border rounded mb-4"
          value={question}
          onChange={(e) => setQuestion( e.target.value)}
          required
          style={{ resize: 'none' }}
        ></textarea>

        <p className="mb-2">
          Options - Check the correct option
        </p>

        <div className="flex flex-col md:flex-row ">
          <div className="flex flex-col mr-4 mt-4 md:mt-0">
            <div className="flex items-center mb-2 w-full">
              <input
                type="checkbox"
                onChange={() => handleOptionChange(0)}
                className="mr-2"
              />
              <input
                type="text"
                value={options[0].text}
                onChange={(e) => handleOptionTextChange(0, e.target.value)}
                required
                className="w-full p-2 px-16 border rounded"
                
              />
            </div>
            <div className="flex items-center mb-2 w-full mt-4 md:mt-6">
              <input
                type="checkbox"
                onChange={() => handleOptionChange(1)}
                className="mr-2"
              />
              <input
                type="text"
                value={options[1].text}
                onChange={(e) => handleOptionTextChange(1, e.target.value)}
                required

                className="w-full p-2 px-16 border rounded shadow-2xl"
              />
            </div>
          </div>

          <div className="flex flex-col ml-0 md:ml-8 mt-4 md:mt-0 ">
            <div className="flex items-center mb-2 w-full">
              <input
                type="checkbox"
                onChange={() => handleOptionChange(2)}
                className="mr-2"
              />
              <input
                type="text"
                value={options[2].text}
                onChange={(e) => handleOptionTextChange(2, e.target.value)}
                required
                className="w-full p-2 px-16 border rounded"
              />
            </div>
            <div className="flex items-center mb-2 w-full mt-4 md:mt-6">
              <input
                type="checkbox"
                onChange={() => handleOptionChange(3)}
                className="mr-2"
              />
              <input
                type="text"
                value={options[3].text}
                onChange={(e) => handleOptionTextChange(3, e.target.value)}
                required
                className="w-full p-2  px-16 border rounded"
              />
            </div>
          </div>
        </div>
      </div>

     {editmode ? (
      <button
      onClick={handleeditquestion}
      type="button"
      className="bg-green-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded mt-4"
    >
      Submit
      </button>
      ):(
        <button 
          onClick={handlesubmitquestion}
          type="button"
          className="bg-sky-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Submit
            </button>
          )} 
          </div>
        </div>
      )}

{quizviewmodal && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60">
    <div className="relative bg-white p-4 lg:p-12 rounded-md w-full lg:w-2/3 h-2/3 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        <button onClick={()=>setQuizviewmodel(false)} className="absolute top-2 right-2 px-3 py-1">
          ✖️
        </button>
        <div className="mb-4">
        {question_option && question_option.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center">
                  <p className="text-lg lg:text-xl font-semibold mb-2">{item.text}</p>
                  <button onClick={() => handleEditClick(item)} className="bg-sky-300 px-2 py-1 rounded-xl ml-2">Edit</button>
                </div>

                <div className="flex flex-col items-center">
                  {item.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="inline-flex items-center mb-2 w-full">
                      <p className="text-sm lg:text-sm font-semibold">
                        {option.text} {option.is_correct ? "(Correct)" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
)}
  </div>
</>

  )
}

export default Faculty_Testseries