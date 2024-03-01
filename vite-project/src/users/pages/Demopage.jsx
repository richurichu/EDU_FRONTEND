import React from 'react'

function Demopage() {
  return (
    <>
    <div className="w-full  sm:w-3/4 lg:w-1/2 p-8  mt-4 sm:mt-16 mx-auto bg-slate-100">
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
          12: What is the capital of France?
        </p>
        <div className="space-y-4 p-4">
          <div className="bg-gray-200 p-6 rounded-lg">
            Option A: <span className="text-lg sm:text-xl font-semibold ml-2">Paris</span>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg">
            Option B: <span className="text-lg sm:text-xl font-semibold ml-2">London</span>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg">
            Option C: <span className="text-lg sm:text-xl font-semibold ml-2">Berlin</span>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg">
            Option D: <span className="text-lg sm:text-xl font-semibold ml-2">Madrid</span>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg ml-4 hover:bg-sky-600">
            Prev
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg mr-4 hover:bg-sky-600">
            Next
          </button>
        </div>
      </div>


   
    </>
  )
}

export default Demopage