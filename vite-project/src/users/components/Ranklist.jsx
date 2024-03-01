import React from 'react'
import useApi from '../../Axios_instance/axios';
import { useState, useEffect } from 'react';
import Lottie from 'lottie-react'
import animationdata from '../../lottieani/Animation - 1700033639734 (1).json'



function Ranklist() {
  const api = useApi()
  const [ranks, setRanks] = useState([])

  const loadRanklist = async () => {
    try {
      const response = await api.get(`testseries/top-users/`);

      setRanks(response.data)
      console.log(response.data, 'response))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))')


    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    loadRanklist()

  }, [])



  return (
    <>

      <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 p-6 rounded-3xl">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold mb-4 mr-2">Leaderboard</h2>
          <Lottie animationData={animationdata} className="w-75 h-75 mb-12" />
        </div>
        <div className="flex flex-col mb-16">
          {ranks && ranks.map((rank, index) => (
            <div
              key={index}
              className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4"
            >
              <div className="flex items-center">
                <img
                  src={rank.profile_image ? `${rank.profile_image.split('?')[0]}` : 'https://i0.wp.com/vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png?fit=860%2C681&ssl=1'}
                  alt="Profile"
                  className="rounded-full h-10 w-10 object-cover mb-2 mr-2"
                />
                <h3 className="text-lg font-semibold mb-2">{rank.username}</h3>
              </div>
              <p className="text-gray-600 inline font-medium">Rank: {index + 1}</p>
              <p className="text-gray-600 inline ml-4 font-semimedium">Points: {rank.quiz_points}</p>

            </div>
          ))}
        </div>
      </div>

    </>
  )
}

export default Ranklist