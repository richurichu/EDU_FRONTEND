import React from 'react'
import useApi from '../../Axios_instance/axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Modal } from 'flowbite-react';
import {useNavigate} from 'react-router-dom'
import { useState,useEffect } from 'react';
import { useMemo } from 'react';


function Admin_career() {
    const [requests, setrequests] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [teacher,setteacher] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [filter, setFilter] = useState('all');

    
    const api = useApi()


    const fetchrequest = async () => {
    
        try {
            const response = await api.get('courses-about/courses-requests/',);
            setrequests(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    }; 

    useEffect(() => {
        
    
        fetchrequest();
    }, []);

    const filteredRequests = useMemo(() => {
        return requests.filter(request => {
            switch (filter) {
                case 'all':
                    return true;
                case 'pending':
                    return !request.rejected && !request.approved;
                case 'rejected':
                    return request.rejected;
                case 'approved':
                    return request.approved;
                default:
                    return true;
            }
        });
    }, [filter, requests]);
    
    

    const handleConfirmClick = (requestId) => {
        console.log('clicked')
        setteacher(requestId);
        setOpenModal(true);
    };
     
    function handleViewClick(data) {
        setSelectedData(data);
        setIsModalVisible(true);
    }
    
    const handleRejectClick = async (id) => {
        try {
            const response = await api.patch(`courses-about/courses-requests/${id}/`, { rejected: true });
            if (response.status === 200) {
                toast.success(" successfully Removed ", {
                    position: toast.POSITION.TOP_RIGHT,
                    theme: "colored"
                });
                fetchrequest();
              
            }
        } catch (error) {
            console.error("Error updating the status:", error);
        }
    }
    
    const handledeleteClick = async (id) => {
        try {
            const response = await api.delete(`courses-about/courses-requests/${id}/`);
            if (response.status === 204) {
                toast.success(" successfully cleared ", {
                    position: toast.POSITION.BOTTOM_CENTER,
                   
                });
                fetchrequest();
              
            }
        } catch (error) {
            console.error("Error updating the status:", error);
        }
    }

    const confirmation = async () => {
        try {
            const response = await api.post(`courses-about/approve_application/${teacher}/`);
            if(response) {
                
                setOpenModal(false);
                toast.success(" successfully Appointed", {
                    position: toast.POSITION.TOP_RIGHT,
                    theme: "colored"
                });
                fetchrequest();
            }
        } catch (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
                theme: "colored"
            });
        }
    };
    
  return (
    <div className="flex h-full p-10">
    <div className="flex-1 p-5 bg-white rounded shadow-lg">
      <h2 className="mb-6 text-xl font-bold">Recieved Requests</h2>
      <div className="absolute top-6 right-10 mt-24 ml-16 p-3 bg-violet-100 rounded shadow-lg">

    <div className="flex items-center">
        <label className="mr-4">
            <input type="radio" className='mr-3' value="all" checked={filter === 'all'} onChange={() => setFilter('all')} />
            All
        </label>

        <label className="mr-4">
            <input type="radio" value="approved" className="mr-3" checked={filter === 'approved'} onChange={() => setFilter('approved')} />
            Approved
        </label>

        <label className="mr-4">
            <input type="radio" className='mr-3' value="pending" checked={filter === 'pending'} onChange={() => setFilter('pending')} />
            Pending
        </label>

        <label>
            <input type="radio" className='mr-3' value="rejected" checked={filter === 'rejected'} onChange={() => setFilter('rejected')} />
            Rejected
        </label>
    </div>
</div>

      {requests.length === 0 ? (
    <div className="text-center text-gray-500">No Requests Available</div>
) : ( filteredRequests.map(request => (
        <div key={request.id} className="flex justify-between mb-4 p-4 bg-violet-100 rounded">
            <div>
                <h3 className="text-lg">Course Name: {request.course_id.name}</h3>
                <h5 className="text-lg w-64 h-10">Applied by : {request.aply_name}</h5>
                
                <h3 className="text-lg">Application Status: {request.approved ? (
                        <span className="text-green-500 font-semibold">Approved</span>
                    ) : request.rejected ? (
                        <span className="text-red-500 font-semibold">Rejected</span>
                    ) : (
                        <span className="text-yellow-500 font-semibold">Pending</span>
                    )}
                </h3>
                
            </div>
            <div className="space-x-4">
               {request.approved && (
                 <button onClick={() => handleViewClick(request)} className="text-violet-500 hover:underline font-bold">View</button>
                 )}
                {request.rejected && (
                 <button onClick={() => handledeleteClick(request.id)} className="text-black hover:underline font-bold">clear</button>
                 )}
                  {!request.approved && !request.rejected && (
                    <>
                     <button onClick={() => handleViewClick(request)} className="text-violet-500 hover:underline font-bold">View</button>
                     <button onClick={() => handleConfirmClick(request.id)} className="text-green-500 hover:underline font-bold">Appoint </button>
                     <button onClick={() => handleRejectClick(request.id)} className="text-red-500 hover:underline font-bold ">Reject</button>
                 </>
                 )}
                
            </div>
            
        </div>
    ))
)}
      <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className="mb-10 text-lg font-normal text-gray-500 dark:text-white">
                            Are you sure you want Appoint him/her as Faculty ?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={confirmation}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            
            {isModalVisible && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-lg w-1/2 relative">
        <div className="absolute top-4 right-4">
                <button onClick={() => setIsModalVisible(false)} className="bg-red-500 text-white py-2 px-4 rounded">Close</button>
            </div>
            <h3 className="text-2xl mb-4 border-b pb-2">Applicant Details</h3>
            <p className="mt-4"><strong>Name:</strong> {selectedData.aply_name}</p>
            <p><strong>Phone Number:</strong> {selectedData.phonenumber}</p>
            <p><strong>Address:</strong> {selectedData.address}</p>
            <p><strong>Pincode:</strong> {selectedData.pincode}</p>
            <p><strong>Description:</strong> {selectedData.description}</p>
            <div className="flex mt-4 space-x-8">
                <img src={selectedData.document} alt="Document" className="w-80 h-80 object-cover border rounded mr-4" />
                {selectedData.addi_document && <img src={selectedData.addi_document} alt="Additional Document" className="w-80 h-80 object-cover border rounded" />}
            </div>

           
        </div>
        
    </div>
)}

    </div>
    <ToastContainer />
  </div>
  )
}

export default Admin_career