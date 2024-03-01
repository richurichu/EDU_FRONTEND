import React from 'react'
import Lottie from 'lottie-react'
import useApi from '../../Axios_instance/axios'
import { useEffect,useState } from 'react'
import Piechart_admin from '../../General/piechart_admin'

import ApexChart from '../../General/ApexChart'


function Admin_dashboard() {
  const api = useApi()
  const [users, setusers] = useState('0')
  const [courses, setcourses] = useState('0')
  const [Quizes, setQuizes] = useState('0')
  const [Revenue, setRevenue] = useState('0')
  const [paiduser, setpaiduser] = useState('')
  const [courserevenue, setcourserevenue] = useState([])






  const FetchAllDetails = async (e) => {
       
    try {
        const response = await api.get('admin-dashboard/', {
            
            
        });
       
        console.log(response.data)
        setusers(response.data.user_count)
        setQuizes(response.data.testseries)
        setcourses(response.data.course)
        setRevenue(response.data.total_sum)
        setpaiduser(response.data.unique_user_count
          )
          setcourserevenue(response.data.courses_with_total_amount
            )
        }

    catch(error){
        toast.error("error in fetching ", {
            position: toast.POSITION.BOTTOM_CENTER,
            theme: "colored"
        });
    }
};
  
useEffect(() => {
  FetchAllDetails()
}, [])

  return (
    <>
    <div className="flex items-start justify-center w-full space-x-32 mt-16  ">
    <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 shadow-xl p-12  rounded-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <h2 className="text-2xl font-bold mb-4"> Total Users</h2>
          <div className="mb-4 space-y-2">
            <p className='text-3xl font-semibold text-center'>{users}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 shadow-xl p-12 rounded-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <h2 className="text-2xl font-bold mb-4"> Total Courses</h2>
          <div className="mb-4 space-y-2">
            <p className='text-3xl font-semibold text-center'>{courses}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 shadow-xl p-12 rounded-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <h2 className="text-2xl font-bold mb-4"> Total Quizes</h2>
          <div className="mb-4 space-y-2">
            <p className='text-3xl font-semibold text-center'>{Quizes}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 shadow-xl p-12  rounded-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <h2 className="text-2xl font-bold mb-4"> Total Revenue</h2>
          <div className="mb-4 space-y-2">
            <p className='text-3xl font-semibold text-center'>$ {Revenue}</p>
          </div>
        </div>
  </div>
  <div className="flex space-x-10">
  <div className="w-2/12 ml-24 mt-28 ">
  <Piechart_admin
  users={users}
  
  paiduser={paiduser}
/>
       <div className="mt-6 ml-16">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-green-400 mr-2 mt-2"></div>
            <span className='font-semibold'>Total PAID USERS </span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-gray-600 mr-2 mt-2"></div>
            <span className='font-semibold'>Total  USERS  </span>
          </div>
        </div>
      
       
        

        
</div>
<div className='w-8/12 mt-24 ml-32'>
 {courserevenue && <ApexChart  coursesWithTotalAmount={courserevenue}/> }
 </div>
 </div>

</>
  
  )
}

export default Admin_dashboard