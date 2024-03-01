import React from 'react'
import Lottie from 'lottie-react'
import notavailable from '../../lottieani/Animation - 1704962816750.json'


function NotAvailabepage() {

  return (
     <div className="flex items-center justify-center h-screen">
    <Lottie animationData={notavailable} className="w-full h-full mb-12 " />
    </div>
  )
}

export default NotAvailabepage