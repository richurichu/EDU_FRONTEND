import React from 'react'
import { useState,useEffect } from 'react';
import useApi from '../../Axios_instance/axios';
import { Button, Modal } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';



function Admin_faculty() {
    const api = useApi()
    const [Faculties, setFaculties] = useState([])
    const [quizlist, setQuizlist] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuizModal, setIsQuizModal] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isQuizDeleteModalOpen, setIsQuizDeleteModalOpen] = useState(false);
    
    const [chapterToDelete, setChapterToDelete] = useState(null);
    const [quizToDelete, setQuizToDelete] = useState(null);
    const [currentChapters, setCurrentChapters] = useState([])
    const [openRoleModal, setRoleModal] = useState(false)
    const [facultyid, setFacultyid] = useState('')
    const [action, setAction] = useState(null); 

    const fetchFaculty = async () => {
          
    
        try {
            const response = await api.get('courses-about/approved-applications/',);
            setFaculties(response.data);
        
        } catch (error) {
            console.error("Error fetching faculty:", error);
        }
    };
     
    
    useEffect(() => {
        
    
        fetchFaculty();
      
    
     
    }, [])

    
    async function openModal(application_id) {
        try {
            const response = await api.get(`courses-about/applications/${application_id}/chapters`);
            setCurrentChapters(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    }


    async function openModalQuiz(application_id) {
        try {
            const response = await api.get(`testseries/get-quiz_admin/?application_id=${application_id}` );
            setQuizlist(response.data)
            console.log(response.data)
            setIsQuizModal(true)
           
        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    }

    

    const promptDeleteChapter = (chapterId) => {
        setChapterToDelete(chapterId);
        setIsDeleteModalOpen(true);
    }

    const promptDeleteQuiz = (QuizId) => {
        setQuizToDelete(QuizId);
        setIsQuizDeleteModalOpen(true);
    }
    
    const handleChapterDelete = async () => {
        try {
            await api.delete(`courses-about/chapter/${chapterToDelete}/`);
            setIsDeleteModalOpen(false);
            setIsModalOpen(false)
            setChapterToDelete(null);
            toast.success("Chapter deleted successfully", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            // Reload or refresh your chapters here or remove the deleted chapter from the state
        } catch (error) {
            console.error("Error deleting chapter:", error);
        }
    }

    const handleQuizUnpublish = async () => {
        try {
            await api.patch(`testseries/unpublish-quiz_faculty/?currentquizid=${quizToDelete}` );
            setIsQuizDeleteModalOpen(false)
            setIsQuizModal(false)
            
            
            toast.success("Chapter deleted successfully", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            
        } catch (error) {
            console.error("Error deleting chapter:", error);
        }
    }

    const handleBan=(id,action)=>{
        setFacultyid(id)
        console.log(facultyid)
        setAction(action)
        setRoleModal(true)
        

    }

    const handleAction = async () => {
        try {
            let response;
            if (action === 'BAN') {
                response = await api.patch(`change-faculty-role/${facultyid}/`, { role: 'BAN' });
            } else if (action === 'UNBAN') {
                response = await api.patch(`change-faculty-role/${facultyid}/`, { role: 'TEACHER' }); 
            }
    
            if (response.status === 200) {
                toast.success(action === 'BAN' ? "Successfully Banned" : "Successfully Unbanned", {
                    position: toast.POSITION.TOP_RIGHT,
                    theme: "colored"
                });
                setRoleModal(false)
                setAction(null)
                fetchFaculty()
                
            }
        } catch (error) {
            console.error("Error updating the status:", error);
        }
    }


  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-10">
        
         
    <thead className="bg-violet-200">
        <tr>
            <th className="text-left py-3 px-4 font-semibold">Name</th>
            <th className="text-left py-3 px-4 font-semibold">Course</th>
            <th className="text-left py-3 px-4 font-semibold">PhoneNumber</th>
            <th className="text-left py-3 px-4 font-semibold">Videos</th>
            <th className="text-left py-3 px-4 font-semibold">TestSeries</th>
            <th className="text-left py-3 px-4 font-semibold">Action</th>
        </tr>
    </thead>
    <tbody>
        {Faculties.map((faculty, index) => (
            <tr key={faculty.id} className={`${index % 2 === 0 ? 'bg-violet-50' : 'bg-white'} hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1`}>
                <td className="border-t py-2 px-4">{faculty.aply_name}</td>
                <td className="border-t py-2 px-4">{faculty.course_id.name}</td>
                <td className="border-t py-2 px-4">{faculty.phonenumber}</td>
                <td className="border-t py-2 px-4"> <button  onClick={()=>openModal(faculty.id)}   className="bg-violet-500 hover:bg-violet-600 text-white py-1 px-3 rounded transition duration-200">View</button></td>
                <td className="border-t py-2 px-4"> <button onClick={()=>openModalQuiz(faculty.id)} className="bg-violet-500 hover:bg-violet-600 text-white py-1 px-3 rounded transition duration-200" >View</button></td>
                <td className="border-t py-2 px-4">
                {faculty.user_id.role=='BAN' ?(<button  className="flex justify-center items-center bg-green-500 hover:bg-green-600 text-white min-w-[60px] rounded transition duration-200 "onClick={() => handleBan(faculty.user_id.id,'UNBAN')} >     
                        UnBan
                    </button>)
                    :(
                        <button  className="flex justify-center items-center bg-red-500 hover:bg-red-600 text-white min-w-[60px] rounded transition duration-200"onClick={() => handleBan(faculty.user_id.id,'BAN')} >     
                        Ban
                    </button>)}
                   
                </td>
            </tr>
        ))}
    </tbody>


    <Modal show={isQuizModal} onClose={() => setIsQuizModal(false)}>
    <Modal.Header>
       
    </Modal.Header>
    <Modal.Body>
    <div style={{maxHeight: '400px', overflowY: 'auto'}} className="w-full lg:w-full bg-slate-100 shadow-lg p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-4">Quiz</h3>
    <ul>
        {quizlist.length >0 ?(quizlist.map(quiz => (
            <li key={quiz.id} className="mb-4 bg-white shadow-lg p-4 rounded flex items-center justify-start transform transition-transform duration-900 hover:scale-104 hover:bg-gray-200 cursor-pointer">
                
               
                
                <h3 className="flex-grow text-gray-700 ml-4 text-xl font-bold">{quiz.name}</h3>

                <button 
                    className="text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 ml-4 flex-none"
                    onClick={() => promptDeleteQuiz(quiz.id)}
                >
                    Delete
                </button>
            </li>
        )))
        :(
            <p className="text-gray-500 text-xl font-semibold mt-4 bg-gray-100 p-4 rounded-md shadow-lg border border-gray-200">There are no Quiz.</p>

        )}
    </ul>
</div>
    </Modal.Body>
    <Modal.Footer>
        <Button className="bg-violet-500" onClick={() => setIsModalOpen(false)}>
            Close
        </Button>
    </Modal.Footer>
</Modal>


<Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
    <Modal.Header>
       
    </Modal.Header>
    <Modal.Body>
    <div style={{maxHeight: '400px', overflowY: 'auto'}} className="w-full lg:w-full bg-slate-100 shadow-lg p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-4">Chapters</h3>
    <ul>
        {currentChapters.length >0 ?(currentChapters.map(chapter => (
            <li key={chapter.id} className="mb-4 bg-white shadow-lg p-4 rounded flex items-center justify-start transform transition-transform duration-900 hover:scale-104 hover:bg-gray-200 cursor-pointer">
                
                <img src="/Video-Icon.png" alt="Video Player" className="w-12 h-12 mr-4 flex-none" /> {/* Replace '/path-to-your-video-icon.svg' with the correct path to your image or SVG */}
                
                <h3 className="flex-grow text-gray-700 ml-4 text-xl font-bold">{chapter.title}</h3>

                <button 
                    className="text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 ml-4 flex-none"
                    onClick={() => promptDeleteChapter(chapter.id)}
                >
                    Delete
                </button>
            </li>
        )))
        :(
            <p className="text-gray-500 text-xl font-semibold mt-4 bg-gray-100 p-4 rounded-md shadow-lg border border-gray-200">There are no chapters.</p>

        )}
    </ul>
</div>
    </Modal.Body>
    <Modal.Footer>
        <Button className="bg-violet-500" onClick={() => setIsModalOpen(false)}>
            Close
        </Button>
    </Modal.Footer>
</Modal>


<Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
    <Modal.Header>
        Delete Chapter
    </Modal.Header>
    <Modal.Body>
        Are you sure you want to delete this chapter?
    </Modal.Body>
    <Modal.Footer>
        <Button className="bg-violet-500" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
        </Button>
        <Button className="bg-red-600" onClick={handleChapterDelete}>
            Delete
        </Button>
    </Modal.Footer>
</Modal>

<Modal show={isQuizDeleteModalOpen} onClose={() => setIsQuizDeleteModalOpen(false)}>
    <Modal.Header>
        Unpublish Quiz
    </Modal.Header>
    <Modal.Body>
        Are you sure you want to Unpublish this Quiz?
    </Modal.Body>
    <Modal.Footer>
        <Button className="bg-violet-500" onClick={() => setIsQuizDeleteModalOpen(false)}>
            Cancel
        </Button>
        <Button className="bg-red-600" onClick={handleQuizUnpublish}>
            Delete
        </Button>
    </Modal.Footer>
</Modal>

<Modal show={openRoleModal} size="md" popup onClose={() => setRoleModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className="mb-10 text-lg font-normal text-gray-500 dark:text-white">
                        {action === 'BAN' ? "Are you sure you want to ban this Faculty ?" : "Are you sure you want to unban this Faculty ?"}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleAction} >
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setRoleModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                </div>
         </Modal.Body>
 </Modal>
</table>

  )
}

export default Admin_faculty