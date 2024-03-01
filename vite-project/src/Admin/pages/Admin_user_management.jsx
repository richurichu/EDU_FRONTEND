import React, { useEffect, useState } from 'react'
import useApi from '../../Axios_instance/axios';
import { Button, Modal } from 'flowbite-react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


function Admin_user_management() {
    const [users, setUsers] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [action, setAction] = useState(null); 

    const [ID, setID] = useState('')
    const api = useApi()
    const fetchusers = async () => {
          
    
        try {
            const response = await api.get('users/users/',);
            setUsers(response.data);
        
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    
    useEffect(() => {
        
    
        fetchusers();
      
    
     
    }, [])

    const handleAction = async () => {
        try {
            let response;
            if (action === 'BAN') {
                response = await api.patch(`users/users/${ID}/`, { role: 'BAN' });
            } else if (action === 'UNBAN') {
                response = await api.patch(`users/users/${ID}/`, { role: 'USER' }); 
            }
    
            if (response.status === 200) {
                toast.success(action === 'ban' ? "Successfully Banned" : "Successfully Unbanned", {
                    position: toast.POSITION.TOP_RIGHT,
                    theme: "colored"
                });
                setOpenModal(false)
                setAction(null)
                fetchusers();
            }
        } catch (error) {
            console.error("Error updating the status:", error);
        }
    }
    
    const handlemodal=(id,action)=>{
        setOpenModal(true)
        setID(id)
        setAction(action)


    }
    
  return (
    <>
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-10">
    <thead className="bg-violet-200 p-24">
        <tr>
            <th className="text-left py-3 px-4 font-semibold">Name</th>
            <th className="text-left py-3 px-4 font-semibold">Email</th>
            <th className="text-left py-3 px-4 font-semibold">No of Courses Taken</th>
            <th className="text-left py-3 px-4 font-semibold">Total Points</th>
            <th className="text-left py-3 px-4 font-semibold">Action</th>
        </tr>
    </thead>
    <tbody>
        {users.map((user, index) => (
            <tr key={user.id} className={`${index % 2 === 0 ? 'bg-violet-50 ' : 'bg-white'} hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1`}>
                <td className="border-t py-2 px-4">{user.username}</td>
                <td className="border-t py-2 px-4">{user.email}</td>
                <td className="border-t py-2 px-4 ">0</td> 
                <td className="border-t py-2 px-4">0</td> 
                <td className="border-t py-2 px-4">
                    
                   {user.role=='BAN' ?(<button  className="flex justify-center items-center bg-green-500 hover:bg-green-600 text-white min-w-[60px] rounded transition duration-200 "onClick={() => handlemodal(user.id,'UNBAN')} >     
                        UnBan
                    </button>)
                    :(
                        <button  className="flex justify-center items-center bg-red-500 hover:bg-red-600 text-white min-w-[60px] rounded transition duration-200"onClick={() => handlemodal(user.id,'BAN')} >     
                        Ban
                    </button>)}
                </td>
            </tr>
        ))}
       
    </tbody>
    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className="mb-10 text-lg font-normal text-gray-500 dark:text-white">
                        {action === 'BAN' ? "Are you sure you want to ban this user?" : "Are you sure you want to unban this user?"}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleAction}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
</table>
<ToastContainer />

        </>
    );
  
}

export default Admin_user_management