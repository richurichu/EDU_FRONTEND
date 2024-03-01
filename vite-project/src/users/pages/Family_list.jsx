import React from 'react'
import { useState,useEffect } from 'react'
import useApi from '../../Axios_instance/axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Lottie from 'lottie-react'
import homeanimation  from '../../lottieani/Animation - 1700565356400 (1).json'
import {useNavigate} from 'react-router-dom'
import { useSpring, animated } from 'react-spring';

// import Loader from '../../General/loader';
import Loader from '../../General/NewLoader';

function Family_list() {
    const user_id = localStorage.getItem('user_id');
    const [isLoading, setIsLoading] = useState(false);
    const fam_name = localStorage.getItem('fam_name');
   
   
    const [Families, setFamilies] = useState([])
    const [ispaid, setispaid] = useState('')
    const [ismodel, setIsmodel] = useState(false);
    const [hasFamily, sethasFamily] = useState(false)
    const [isowner, setIsowner] = useState('')
    const [name, setName] = useState('');
    const [instruction, setInstruction] = useState('')
    const [image, setImage] = useState(null);
    const api = useApi()
    const navigate = useNavigate();
    localStorage.setItem('is_owner', isowner);
    const loadFamilylist = async () => {
        try {
          setIsLoading(true)
            const response = await api.get(`families/get-families-and-check-payment/${user_id}/`);
         
          setFamilies(response.data.families)
          setispaid(response.data.is_user_paid)
          sethasFamily(response.data.has_family)
          setIsowner(response.data.is_owner)
          console.log(response.data , 'response))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))')
          setIsLoading(false)
         
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };
    
      useEffect(() => {
        loadFamilylist()
       
      }, [])

      
      

      

      console.log('-------------------------------------------------$$444444444444444444',Families)
      console.log('-------------------------------------------------$$444444444444444444',hasFamily)
    
      const handleclose = () => {
        setIsmodel(false);
        setImage(null);
        setName(null)
        setInstruction(null)

        

    };
    const handlenameChange = (e) => {
      setName(e.target.value);
  };
  const handleinstructionChange = (e) => {
    setInstruction(e.target.value);
};


  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
};
const handleModelOpen = (e) => {
  if (!ispaid ){
    toast.error( "Unlock FAMILY creation by purchasing at least one Course", {
      position: toast.POSITION.BOTTOM_CENTER,
      theme: "colored"
  })
  return
  }
  setIsmodel(true)
  
};



const handleSubmit = async () => {
  if (/\s/.test(name) ) {
    toast.error("Invalid charectors in Family Name ", {
      position: toast.POSITION.TOP_CENTER,
      theme: "colored"
    });
    return;
  }
  const formData = new FormData();
  console.log(name,instruction,user_id)
  formData.append('name', name);
  formData.append('instruction', instruction);
  if (image) {
      formData.append('image', image);
  }
  formData.append('user', user_id);

  
  console.log('started request')
  console.log(formData)

  try {
      
     const response = await api.post(
        `families/create-family/`,
        formData,
        
        {
            headers: {
                
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        }
    );
      if (response) {
          
          toast.success("You have applied successfully", {
            position: toast.POSITION.BOTTOM_CENTER,
            theme: "colored"
        });
        loadFamilylist()
        setIsmodel(false);
        setImage(null);
        setName(null)
        setInstruction(null)

          
      }
  } catch (error) {
    toast.error(error.response.data[0] || 'You already have a family. You cannot create a new one.', {
      position: toast.POSITION.BOTTOM_CENTER,
      theme: "colored"
  })
  setIsmodel(false);
  setImage(null);
  setName(null)
  setInstruction(null)
    
  }
}
useEffect(() => {
 
  loadFamilylist()
  
}, [])


const pulsatingProps = useSpring({
  loop: { reverse: true },
  from: { scale: 1},
  to: { scale: 1.4 },
  config: { duration: 550, tension: 100, friction: 20 },
  reset: true,
});


const fetchFamily = async () => {
  
  try {
      const response = await api.get(`families/get-family/${user_id}/`, {
          
      });
      if (response) {
          console.log(response.data,'==============================')
          const cleanedFamName = response.data.fam_name.replace(/\s/g, '');
          
          localStorage.setItem('fam_name',cleanedFamName);
          localStorage.setItem('fam_idd',response.data.fam_id);
          localStorage.setItem('members_count',response.data.members_count);
          localStorage.setItem('owner_id',response.data.owner_id);
          navigate('/group-chat')
              
      } else {
          
      }
  } catch (error) {
      console.error("Error fetching the family :", error);
  }
}

const JoinFamily = async (fam_Id) => {
  
  try {
      const response = await api.post(`families/join-family/${user_id}/${fam_Id}/`, {
          
      });
      if (response) {
          console.log(response.data,'==============================')
          loadFamilylist()
          toast.success(" successfully Joined", {
            position: toast.POSITION.BOTTOM_CENTER,
            theme: "colored"
        });
        
      } else {
          
      }
  } catch (error) {
      console.error("Error joining :", error);
  }
}

  return (
    <>
   {isLoading ? (<Loader />):(
    
    <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="flex flex-col items-center md:flex-row md:items-center">
        <h2 className="text-4xl font-bold mb-4 text-center text-sky-700 tracking-wide md:text-left md:mr-4">
          Families
        </h2>
        <Lottie animationData={homeanimation} className="w-16 h-16 mb-6 md:mb-4 " />
      </div>
    <button onClick={handleModelOpen} className="bg-green-500 text-white font-bold px-4 py-2 rounded-md ml-auto hover:bg-green-700 transition duration-300">
        Create
    </button>
      
      
    {(hasFamily || isowner)  &&  <animated.button  style={{
            transform: pulsatingProps.scale.to(scale => `scale(${scale})`),
            // Add other styles as needed
          }} onClick={fetchFamily} className="bg-sky-500 text-white font-bold px-4 py-2 rounded-md ml-4 hover:bg-sky-700 transition duration-300">
        Your Family
      </animated.button> }
  
      <div className="flex flex-col mb-16">
        {Families && Families.map((family)=>(
        <div key ={family.id} className="bg-white w-full md:w-10/12 p-2 py-6 rounded-xl shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4 flex flex-col md:flex-row items-center mt-6">
          <img
            className="w-20 h-20 rounded-full md:mr-2 md:ml-4 mb-4 md:mb-0"
            
            src={family.family_image ? `${family.family_image.split('?')[0]}` : 'https://d3cif2hu95s88v.cloudfront.net/blog/wp-content/uploads/2020/06/21073807/Tullips.jpg'}
            alt="User Profile"
          />
  
          <div className="ml-4 md:ml-6">
            <h3 className="text-lg font-semibold mb-2">{family.name}</h3>
            <p className="text-gray-600 inline font-medium md:block md:ml-0 md:mb-2">Owner:<span className='font-bold ml-2'>{family.owner.username}</span> </p>
            {/* <p className="text-gray-600 inline ml-4 md:ml-0 md:mr-4 md:mb-2 font-semimedium">Rank:</p>
            <p className="text-gray-600 inline ml-4 md:ml-0 md:mr-4 font-semimedium">Points: </p> */}
          </div>
  
         { !hasFamily && (!isowner) && <button onClick={()=>JoinFamily(family.id)}
            className="bg-sky-500 text-white px-6 py-2 font-bold rounded-md mt-4 md:ml-auto md:mt-0 md:mr-4 hover:bg-sky-600 transition duration-300"
          >
            JOIN
          </button>}
        </div>
        ))}
      </div>
  
      {ismodel && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60">
                <div className="relative bg-white p-4 lg:p-12 rounded-md w-full lg:w-2/3 h-2/3 shadow-2xl flex flex-col justify-between">
                  <div>
                    <button onClick={handleclose} className="absolute top-2 right-2 px-3 py-1">
                      ✖️
                    </button>
                    <h2 className="text-2xl lg:text-3xl font-semibold mb-6">Create Your FAMILY</h2>
                    <label htmlFor="question" className="mb-2 block">
                      Family Name:
                    </label>
                    <textarea
                      id="name"
                      value={name}
                      onChange={handlenameChange}
                      className="w-full h-12 p-2 border border-gray-300 rounded"
                    ></textarea>
                    <label htmlFor="instructions" className="mb-2 block">
                      Instructions for your family members:
                    </label>
                    <textarea
                      id="instructions"
                      value={instruction}
                      onChange={handleinstructionChange}
                      className="w-full h-24 p-2 border border-gray-300 rounded"
                    ></textarea>
                    <label htmlFor="image" className="mb-2 mt-8 block">
                      Family Cover Picture (optional):
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border border-gray-300 rounded p-2"
                    ></input>
                    {image && <p>Image Selected: {image.name}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded mt-4"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
    </div>)}
  </>
  
  )
}

export default Family_list