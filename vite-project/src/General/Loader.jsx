import React from 'react'
import Lottie from 'lottie-react'
import loaderani from '../lottieani/Animation - 1700043427785.json'


function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
    <Lottie animationData={loaderani} className="w-full h-full mb-48 " />
    </div>
  )
}

export default Loader