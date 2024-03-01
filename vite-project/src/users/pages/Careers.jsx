import React from 'react'
import useApi from '../../Axios_instance/axios';
import { useState,useEffect } from 'react';
import { Modal, Button, Label, Textarea, FileInput } from 'flowbite-react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
// import { isAuthenticated } from '../../Routes/authh';
import { isAuthenticated } from '../../Routes/NewAuth';
import {useNavigate} from 'react-router-dom'
// import Loader from '../../General/loader';
import Loader from '../../General/NewLoader';

function Careers() {
 
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi()
  const navigate = useNavigate()
  const [invitations, setInvitations] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDescription, setUserDescription] = useState("");
  const [userName, setUserName] = useState('')
  const [userPhoneNumber, setUserPhoneNumber] = useState('')
  const [userPincode, setUserPincode] = useState('')
  const [selectedFiletwo, setSelectedFiletwo] = useState('')
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [isPincodeValid, setIsPincodeValid] = useState(true);
  

  const [userAddress, setUserAddress] = useState('')
  
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const token = localStorage.getItem('access_token');
  const mainrole = localStorage.getItem('main_role');
  const check = isAuthenticated()
  
  useEffect(() => {
    
    const fetchCourses = async () => {
        setIsLoading(true)

        try {
            const response = await api.get('courses-about/courses-adv/',);
            setInvitations(response.data);
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    fetchCourses();
}, []);

const handleCloseModal = () => {
  setIsModalOpen(false);
  setUserDescription("");
  setSelectedFile(null);
}

const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
};

const handleAdditionalFileChange = (event) => {
    setSelectedFiletwo(event.target.files[0]);
  };

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('course_id', currentCourseId);
  formData.append('description', userDescription);
  formData.append('aply_name', userName);
  formData.append('phonenumber', userPhoneNumber);
  formData.append('pincode', userPincode);
  formData.append('address', userAddress);
  formData.append('addi_document',selectedFiletwo);
  
  
  formData.append('document', selectedFile);

  console.log('action')
  
  const userData = {
    course_id: currentCourseId,
    
      description: userDescription,
      document :selectedFile

     
  };
  console.log(formData)

  try {
      
     const response = await api.post(
        `courses-about/apply/`,
        formData,
        {
            headers: {
                
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        }
    );
      if (response) {
          // Handle success
          toast.success("You have applied successfully", {
            position: toast.POSITION.BOTTOM_CENTER,
            theme: "colored"
        });
          handleCloseModal();
          
      }
  } catch (error) {
    toast.error(error.response.data[0] || "Fields Required", {
      position: toast.POSITION.BOTTOM_CENTER,
      theme: "colored"
  })
    
      // Handle the error
  }
}
const handleclick = (id) =>{

    if(!check){
        navigate('/login')
        return;
    }
    if(mainrole==='TEACHER'){
        toast.error(" YOU CANT APPLY , Since you are a faculty  ", {
            position: toast.POSITION.BOTTOM_CENTER,
            theme: "colored"
          });

        return;
    }
    setIsModalOpen(true);
    setCurrentCourseId(id);

}


  return (
    <>
    {isLoading ? (<Loader/>) : (
    invitations.map((invitation,id)=>(<div className=" mt-5 left-0 right-0 mb-4 bg-indigo-100 border-t-4 border-red-300 rounded-t-lg text-blue-900 px-4 py-3 shadow-md w-full flex justify-between items-center hover:bg-indigo-100 transition-all duration-300">
    <div key = {id}className="flex items-center space-x-4">
        <svg className="fill-current h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>
        <div className="w-1/2">
            <p className="font-bold">New Vacancy Available!</p>
            <p className="text-2xl font-bold mb-2">{invitation.name}</p>
            <p className="text-sm">{invitation.description}</p>
        </div>
    </div>
    <button onClick={() =>handleclick(invitation.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
        Apply
        
    </button>
    {isModalOpen && (
    <Modal show={isModalOpen} size="md" onClose={() => setIsModalOpen(handleCloseModal)}>
    <Modal.Header>Application Form</Modal.Header>
    <Modal.Body>
        <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Provide your details</h3>

            {/* Name Field */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="name" value="Name" />
                </div>
                <input
                    className="border rounded w-full py-2 px-3"
                    type="text"
                    id="name"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    required
                />
            </div>

            {/* Phone Number Field */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="phoneNumber" value="Phone Number" />
                </div>
                <input
                    className={`border rounded w-full py-2 px-3 ${!isPhoneNumberValid ? 'border-red-500' : 'border-gray-300'}`}
                    type="tel"
                    id="phoneNumber"
                    value={userPhoneNumber}
                    onChange={e => {
                        const pattern = /^[1-9][0-9]{9}$/;
                        if (pattern.test(e.target.value) || e.target.value === '') {
                            setIsPhoneNumberValid(true);
                        } else {
                            setIsPhoneNumberValid(false);
                        }
                        setUserPhoneNumber(e.target.value);
                    }}
                    
                    required
                />
                {!isPhoneNumberValid && <p className="text-red-500 text-sm mt-1"> Invalid Phone number !</p>}
            </div>

            {/* Address Field */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="address" value="Address" />
                </div>
                <input
                    className="border rounded w-full py-2 px-3"
                    type="text"
                    id="address"
                    value={userAddress}
                    onChange={e => setUserAddress(e.target.value)}
                    required
                />
            </div>
                            <div>
                    <div className="mb-2 block">
                        <Label htmlFor="pincode" value="Pincode" />
                    </div>
                    <input
                        className={`border rounded w-full py-2 px-3 ${!isPincodeValid ? 'border-red-500' : 'border-gray-300'}`}
                        type="text"
                        id="pincode"
                        value={userPincode}
                        onChange={e => {
                            const pattern = /^\d{6}$/;
                            if (pattern.test(e.target.value) || e.target.value === '') {
                                setIsPincodeValid(true);
                            } else {
                                setIsPincodeValid(false);
                            }
                            setUserPincode(e.target.value);
                        }}
                        required
                        
                        
                    />
                    {!isPincodeValid && <p className="text-red-500 text-sm mt-1"> Invalid Pincode </p>}
                </div>


            {/* Description Field */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="description" value="Description about you" />
                </div>
                <textarea
                    className="border rounded w-full py-2 px-3"
                    value={userDescription}
                    onChange={e => setUserDescription(e.target.value)}
                    required
                />
            </div>

            {/* Qualification Photo Input */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="qualification-photo" value="Upload photo of your qualification" />
                </div>
                <FileInput 
                    helperText="A Document to prove your qualification "
                    id="qualification-photo" 
                    name="qualification-photo"
                    onChange={handleFileChange}
                    required
                />
            </div>

            {/* Additional File Input */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="additional-file" value="Upload additional file (optional)" />
                </div>
                <FileInput 
                    helperText="Any additional documents you want to share"
                    id="additional-file" 
                    name="additional-file"
                    onChange={handleAdditionalFileChange}
                />
            </div>

            <div className="w-full">
                <Button onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    </Modal.Body>
</Modal>

)}
  <ToastContainer />
</div>
)))}
    



</>


  )
}

export default Careers