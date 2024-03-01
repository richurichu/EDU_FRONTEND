
import { FaSearch } from 'react-icons/fa';
import { useState,useEffect } from 'react';
import useApi from '../../Axios_instance/axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Ranklist from '../components/Ranklist';
// import Loader from '../../General/loader';
import Loader from '../../General/NewLoader';




function QuizList() {
    const api = useApi()
    
    const user_id = localStorage.getItem('user_id')
    const [testseriesid, setTestseriesid] = useState('')
    const [quizlist, setQuizlist] = useState([])
    const [isLoading, setisLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState(null);


    const loadquizlist = async () => {
      setisLoading(true)
      
      try {
       
        setTimeout(async () => {
          const response = await api.get(`testseries/get-quizlist/`, { user_id: user_id });
          setQuizlist(response.data);
          console.log(response.data, 'response))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))');
          setisLoading(false);
        }, 1000); 
      } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };

    useEffect(() => {
        loadquizlist()
      
    }, [])


    const handleSearch = (event) => {
      setSearchQuery(event.target.value);
    };

    const handleFilterChange = (option) => {
      setFilterOption(option);
    };
  
   
    const filteredQuizList = quizlist.filter((quiz) =>
      quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).filter((quiz) => {
      if (filterOption === 'attempted') {
        return quiz.has_attended;
      } else if (filterOption === 'unattempted') {
        return !quiz.has_attended;
      }
      return true;
    });



  return (
    <>
    {isLoading ? (< Loader />):( <div className="flex flex-col md:flex-row">
  <div className="w-full md:w-3/4 p-4 ">
  <div className="flex items-center space-x-2">
  
  <input
    type="text"
    placeholder="Search quizzes..."
    value={searchQuery}
    onChange={handleSearch}
    className="border  rounded-md p-2 outline-none font-bold"
  />

</div>
<div className="flex items-center mt-4 space-x-4">
        <label>
          <input
            type="checkbox"
            className='mr-2 font-bold'
            checked={filterOption === 'attempted'}
            onChange={() => handleFilterChange('attempted')}
          />
          Attempted
        </label>
        <label>
          <input
            type="checkbox"
            className='mr-2 font-bold'
            checked={filterOption === 'unattempted'}
            onChange={() => handleFilterChange('unattempted')}
          />
          Unattempted
        </label>
      </div>
    <div className="flex flex-wrap -mx-2 mt-8">
   
      {filteredQuizList && filteredQuizList.map((quiz) => (
      
      <div key={quiz.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
      <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 shadow-xl p-8 rounded-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <h2 className="text-2xl font-bold mb-4">{quiz.name}</h2>
          <div className="mb-4 space-y-2">
            <p>Total Questions: 10</p>
            <p>Total Marks: 10</p>
            <p>Total Time: 5 minutes</p>
          </div>
          
         {quiz.has_attended ?(<button
          
          className="bg-sky-700 text-white py-1 px-2 rounded hover:bg-sky-500 focus:outline-none mt-2"
        >
            <Link to={`/answerkey/${quiz.id}`}>
            Answer key
            </Link>
        
        </button>):(<button
          
          className="bg-sky-700 text-white py-1 px-2 rounded hover:bg-sky-500 focus:outline-none mt-2"
        >
         <Link to={`/quizstart/${quiz.id}`}>
              Start Quiz
          </Link>
        </button>) } 
        </div>
      </div>
       ))}
    </div>
  </div>
  <div className="w-full md:w-1/4 border bottom-2 shadow-lg mr-4 mt-20" >
    <Ranklist />

  </div>
</div>)}
</>
   
  );
}

export default QuizList;
