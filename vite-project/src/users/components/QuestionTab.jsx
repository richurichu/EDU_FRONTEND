import React from 'react'


function QuestionTab({questions,setCurrentquestionid ,currentquestionid, attempted ,handlesubmitclick,minutes,seconds ,timeOver}) {

   
    const questionArray = Object.values(questions);
    
    console.log(questionArray.length)
    const attemptedCount = attempted.length
    console.log(attemptedCount,'attempted count')
   

    const unattemptedCount = questionArray.length - attemptedCount 
    console.log(unattemptedCount,'unattempted count')
   

   
   
    
    const handleidclick=(id)=>{
        setCurrentquestionid(id)
        console.log(id,'from the tab ')

    }

    const handlesubmit = () =>{
        handlesubmitclick()

    }

    const timerStyle = {
      color: minutes < 1 ? 'white' : 'white',
      backgroundColor: minutes < 1 ? 'red' : 'gray',
    };

    
    
    
  return (
    <>
   <div className="bg-red-200 p-4 rounded-lg flex flex-wrap mt-10 ml-8 shadow-2xl border-solid border-red-500" style={{ width: '400px', height: '380px' }}>
  <div className="w-full flex flex-wrap">
    
    {questionArray.map((question,index) =>(
      <div key={index} className="w-1/5 p-2 flex items-center justify-center">
        <div onClick={()=>handleidclick(index)} className={`w-12 h-12 bg-${attempted.includes(index) ? 'green-200' : 'white'} rounded-full flex items-center justify-center ${index===currentquestionid ? 'border-4 border-sky-500' : ''}`}>
          <span className="text-black font-bold">{ index +1 }</span>
        </div>
      </div>
      ))}
   
  </div>
</div>
<div className="bg-red-200 p-4 rounded-lg mt-12 ml-8 shadow-lg border-solid border-red-500" style={{ width: '400px', height: '80px' }}>
  <div className="flex justify-center items-center mt-2">
    
      <div className="mb-2 mr-12 ">
        <span className="text-black text-xl font-semibold">Answered:</span>
        <span className="text-green-500 text-2xl font-bold ml-2">{attemptedCount}</span>
      </div>
      <div className="mb-2 ml-12">
        <span className="text-black text-xl font-semibold">Unanswered:</span>
        
        <span className="text-red-500 text-2xl font-bold ml-2">{unattemptedCount}</span>
      </div>
  </div>
</div>
<div className=" p-4 rounded-lg mt-8 ml-8 shadow-lg border-solid" style={{ width: '400px', height: '50px',...timerStyle }}>
{timeOver ?(<span className="font-semibold ml-32 mr-8">Time Over</span>)
:(<span className="font-semibold ml-24 mr-8">Time Remaining: <span className="font-extrabold">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span></span>)}

</div>

<div className=" mt-8 ml-8">
  <button onClick={handlesubmit} className="bg-sky-600 text-white  rounded-lg text-xl font-semibold hover:bg-sky-700" style={{ width: '400px', height: '50px' }}>
    Finish Quiz
  </button>
</div>

    </>
  )
}

export default QuestionTab