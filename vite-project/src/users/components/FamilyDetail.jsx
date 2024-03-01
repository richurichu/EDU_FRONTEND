import React from 'react'
import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import useApi from '../../Axios_instance/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

function FamilyDetail() {
    const api = useApi()
    const navigate = useNavigate();
    const roomname = localStorage.getItem('fam_name');
    const room_id = localStorage.getItem('fam_idd');
    const owner_id = localStorage.getItem('owner_id');

    const is_owner = localStorage.getItem('is_owner')
    const user_id = localStorage.getItem('user_id');
    const members_count = localStorage.getItem('members_count');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAdminLeavingModalOpen, setIsAdminLeavingModalOpen] = useState(false);

    const [members, setMembers] = useState([])
    const [membersmodal, setMembersmodal] = useState(false)
    const [leaveMemberModal, setLeaveMemberModal] = useState(false)
    const [membersAssignRolemodal, setMembersAssignRolemodal] = useState(false)
    const [userBanId, setUserBanId] = useState('')
    const [toBeOwnerId, setToBeOwnerId] = useState('')


    const loadMembers = async () => {
        try {
            const response = await api.get(`families/get-members/${room_id}/`);

            setMembers(response.data)
            console.log(response.data, 'response))))))))********************************))))))))))))')


        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const getMembers = () => {
        setMembersmodal(true)
        loadMembers()
    }
    const getMembersAssignRole = () => {
        setMembersAssignRolemodal(true)
        loadMembers()
    }



    const handleBlockMember = (ID) => {
        setUserBanId(ID)
        setIsDeleteModalOpen(true)
    }

    const handleOwnershipAdminLeaving = (ID) => {
        setToBeOwnerId(ID)
        setIsAdminLeavingModalOpen(true)
    }

    const handleLeaveFamily = () => {
        setLeaveMemberModal(true)
    }


    // const handleAdminLeaveFamily = () => {
    //     setLeaveAdminMemberModal(true)
    // }


    const ConfirmBlockMember = async () => {
        try {
            await api.post(`families/block-members/${userBanId}/`);

            toast.success("User Deleted successfully", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            setIsDeleteModalOpen(false)
            setMembersmodal(false)

        } catch (error) {
            console.error("Error deleting chapter:", error);
        }
    }

    const ConfirmDeleteFamily = async () => {
        try {
            await api.post(`families/delete-family/${room_id}/`);

            toast.success("Family Deleted successfully", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            setMembersAssignRolemodal(false)
            localStorage.removeItem('is_owner');
            localStorage.removeItem('fam_name');
            localStorage.removeItem('fam_idd');
            navigate('/family')

        } catch (error) {
            console.error("Error deleting family:", error);
        }
    }




    const ConfirmLeaveFamily = async () => {
        try {
            await api.post(`families/leave-family/${user_id}/${room_id}/`);

            toast.success("Leaved family successfully", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            localStorage.removeItem('is_owner');
            localStorage.removeItem('fam_name');
            localStorage.removeItem('fam_idd');

            setLeaveMemberModal(false)
            navigate('/family')

        } catch (error) {
            console.error("Error deleting chapter:", error);
        }
    }

    const ConfirmOwnerLeaveFamily = async () => {
        try {
            await api.post(`families/Owner-leave-family/${user_id}/${toBeOwnerId}/${room_id}/`);

            toast.success("Leaved family successfully", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            localStorage.removeItem('is_owner');
            localStorage.removeItem('fam_name');
            localStorage.removeItem('fam_idd');

            setIsAdminLeavingModalOpen(false)
            navigate('/family')

        } catch (error) {
            console.error("Error in leaving:", error);
        }
    }


    return (
        <>
            <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 p-2 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4 mt-8 text-center"
            >
                <h1 className="text-4xl font-bold mb-4 text-center text-sky-700 tracking-wide  ">{roomname}</h1>
            </div>
            {/* <div className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4  mt-12"
            >
                <h3 className="text-lg font-semibold mb-2 ">Rank : 6</h3>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4  mt-12"
            >
                <h3 className="text-lg font-semibold mb-2">Total Points : 17</h3>
            </div> */}
            <div onClick={() => navigate('/call')} className="bg-indigo-500 p-2 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4  mt-20 text-center">
                <h3 className="text-lg font-semibold mb-2 text-white ">Video Call</h3>
            </div>

            {is_owner == 'true' ? (<div onClick={getMembers} className="bg-green-500 p-2 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4  mt-20 text-center">
                <h3 className="text-lg font-semibold mb-2 text-white ">Actions</h3>
            </div>) : (<div onClick={getMembers} className="bg-green-500 p-2 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4  mt-20 text-center">
                <h3 className="text-lg font-semibold mb-2 text-white "> Group Members <span className='absolute top-1 right-11 bg-yellow-200 rounded-full px-2  text-black text-sm font-semibold'>{members_count}</span></h3>
            </div>)}

            {is_owner !== 'true' ? (<div onClick={() => handleLeaveFamily()} className="bg-red-500 p-2 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4  mt-20 text-center">
                <h3 className="text-lg font-semibold mb-2 text-white  ">Leave Family</h3>
            </div>) : (<div onClick={() => getMembersAssignRole()} className="bg-stone-500 p-2 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2 mb-4  mt-20 text-center">
                <h3 className="text-lg font-semibold mb-2 text-white  ">Leave Family</h3>
            </div>)}

            <Modal show={membersmodal} onClose={() => setMembersmodal(false)}>
                <Modal.Header>

                </Modal.Header>
                <Modal.Body>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="w-full lg:w-full bg-slate-100 shadow-lg p-4 rounded-lg">
                        <h3 className="text-xl font-bold  text-center text-sky-700 tracking-wide mb-4">Members<span className='absolute top-28 right-62 bg-yellow-300 rounded-full px-2  text-black text-sm font-semibold'>{members_count}</span></h3>
                        <ul>

                            {members.length > 0 ? (members.map((member) => (
                                <li className="mb-4 bg-white shadow-lg p-4 rounded flex items-center justify-start transform transition-transform duration-900 hover:scale-104 hover:bg-gray-200 cursor-pointer">

                                    <h3 className="flex-grow text-gray-700 ml-4 text-xl font-bold">{member.username}</h3>

                                    {is_owner === 'true' && member.pk != owner_id && (<button onClick={() => handleBlockMember(member.pk)}
                                        className="text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 ml-4 flex-none"

                                    >
                                        Ban
                                    </button>)}
                                </li>

                            ))) : (<span className='text-md font-bold  text-center text-red-500 tracking-wide '>No Members </span>)}

                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="bg-violet-500" onClick={() => setMembersmodal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>




            <Modal show={membersAssignRolemodal} onClose={() => setMembersAssignRolemodal(false)}>
                <Modal.Header>

                </Modal.Header>
                <Modal.Body>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="w-full lg:w-full bg-slate-200 shadow-lg p-4 rounded-lg">
                        {members_count > 0 && <span className="text-md font-bold  text-center text-red-500 tracking-wide mb-4">Since you are Owner assign this Role to any one Before Leaving the Family</span>}
                        <h3 className="text-xl font-bold  text-center text-sky-700 tracking-wide mb-4">Members<span className='absolute top-22 right-62 bg-yellow-300 rounded-full px-2  text-black text-sm font-semibold'>{members_count}</span></h3>
                        <ul>

                            {members.length > 0 ? (members.map((member) => (
                                <li className="mb-4 bg-white shadow-lg p-4 rounded flex items-center justify-start transform transition-transform duration-900 hover:scale-104 hover:bg-gray-200 cursor-pointer">

                                    <h3 className="flex-grow text-gray-700 ml-4 text-xl font-bold">{member.username}</h3>

                                    {is_owner == 'true' && member.pk != owner_id && (<button onClick={() => handleOwnershipAdminLeaving(member.pk)}
                                        className="text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 ml-4 flex-none"

                                    >
                                        Make Owner
                                    </button>)}

                                </li>

                            ))) : (<span className='text-md font-bold  text-center text-red-500 tracking-wide '>No Members</span>)}

                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>

                    {members_count == 0 && <Button className="bg-red-500" onClick={() => ConfirmDeleteFamily()}>
                        Delete Family
                    </Button>}

                </Modal.Footer>
            </Modal>



            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <Modal.Header>
                    Ban Member
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to Ban Member?
                </Modal.Body>
                <Modal.Footer>
                    <Button className="bg-violet-500" onClick={() => setIsDeleteModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-red-600" onClick={ConfirmBlockMember}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={leaveMemberModal} onClose={() => setLeaveMemberModal(false)}>
                <Modal.Header>
                    Leave Family
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to Leave Family ?
                </Modal.Body>
                <Modal.Footer>
                    <Button className="bg-violet-500" onClick={() => setLeaveMemberModal(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-red-600" onClick={ConfirmLeaveFamily}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={isAdminLeavingModalOpen} onClose={() => setIsAdminLeavingModalOpen(false)}>
                <Modal.Header>
                    Leave Family
                </Modal.Header>
                <Modal.Body>
                    As Owner , Are you sure you want to Leave Family ?
                </Modal.Body>
                <Modal.Footer>
                    <Button className="bg-violet-500" onClick={() => setIsAdminLeavingModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-red-600" onClick={ConfirmOwnerLeaveFamily}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

        </>



    )
}

export default FamilyDetail