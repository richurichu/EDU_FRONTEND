import React, { useState,useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import useApi from '../../Axios_instance/axios';
import TooltipWrapper from '../../users/Tooltip'
import { Modal, Button, Label, Textarea } from 'flowbite-react';
import { useSpring, animated } from 'react-spring';

function Faculty_course_management() {
    const api = useApi()
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState(null);
    const [notes, setNotes] = useState(null);
    const [chapters, setChapters] = useState([])
    const [file, setFile] = useState(null)
    const [isVideoUploading , setisVideoUploading ] = useState(false)

    const [editingChapterId, setEditingChapterId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [chapterTitle, setChapterTitle] = useState('');
    const [chapterDescription, setChapterDescription] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [chapterToDelete, setChapterToDelete] = useState(null);
    const [textIndex, setTextIndex] = useState(0);

    const textVariants = [
    
        '.',
        '..',
        '...',
        '....'
        
      ];
    
      const textmultipleAnimation = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        reset: true,
        config: { duration: 1000 ,tension: 300, friction: 20  },
        onRest: () => {
          // Change text when the animation finishes
          setTextIndex((prevIndex) => (prevIndex + 1) % textVariants.length);
        },
      });
    

    const seechapter = async () => {
        try {
            const response = await api.get('courses-about/chapters/');
            if(response) {
                setChapters(response.data);
            }
        } catch (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
                theme: "colored"
            });
        }
    };
    
    const handleimage = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post(`courses-about/img-upload/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Image uploaded successfully", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            console.log(response.data);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }

    const handleEdit = (chapterId, chapterTitle, chapterDescription) => {
        setEditingChapterId(chapterId);
        setChapterTitle(chapterTitle);
        setChapterDescription(chapterDescription);
        setIsModalOpen(true);
    };
    
    const handleSave = async () => {
        const updatedData = {
            title: chapterTitle,
            description: chapterDescription
        };
        
        try {
            const response = await api.put(`courses-about/chapter/${editingChapterId}/`, updatedData);
            console.log(response.data);
            setIsModalOpen(false); 
            toast.success("You have successfully edited chapter", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            seechapter()

        } catch (error) {
            console.error("Error updating chapter:", error);
           
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);

        setChapterTitle('');
        setChapterDescription('');
    };

    const handleDeleteRequest = (chapterId) => {
        setChapterToDelete(chapterId);
        setIsConfirmModalOpen(true);
    };


    const handleDelete = async () => {
        try {
            await api.delete(`courses-about/chapter/${chapterToDelete}/`);
            
           
            setIsConfirmModalOpen(false);
            setChapterToDelete(null);
            seechapter()
            
            toast.success("You have successfully Deleted chapter", {
                position: toast.POSITION.BOTTOM_CENTER,
                theme: "colored"
            });
            
        } catch (error) {
            console.error("Error deleting chapter:", error);
            
        }
    };
    

    const handleSubmit = async (e) => {
        console.log('enteered')
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', video);
        formData.append('notes', notes);

        try {
            setisVideoUploading(true)
      
            const response = await api.post(
               `courses-about/create-chapter/`,
               formData,
               {
                   headers: {
                    //    'Authorization': `Bearer ${token}`,
                       'Content-Type': 'multipart/form-data'
                   },
                   withCredentials: true
               }
           );
             if (response) {
                seechapter()
               
                setTitle('')
                setDescription('')
                setisVideoUploading(false)
                
                 toast.success("You have successfully uploaded chapter", {
                   position: toast.POSITION.BOTTOM_CENTER,
                   theme: "colored"
               });
           
                 
             }
         } catch (error) {
            if (error.response && error.response.data) {
                // Extracting error messages from the response
                const errorMessages = Object.values(error.response.data)
                    .map(fieldErrors => 
                        // This ensures fieldErrors is always an array
                        (Array.isArray(fieldErrors) ? fieldErrors : [fieldErrors])
                            .join(', ')
                    )
                    .join('; ');
    
                // This will toast the error message, for instance "Adding cover image is compulsory"
                toast.error(errorMessages || "An error occurred", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    theme: "colored"
                });
            }
        }
    };

    return (
        
        <div className="flex h-screen bg-gray-100 p-8 items-start">
            {/* Left Side - Form */}
            <div className="w-4/12 bg-white p-8 rounded-md shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Title"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Description"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Video</label>
                        <input
                            type="file"
                            onChange={(e) => setVideo(e.target.files[0])}
                            className="w-full py-2 px-3"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">PDF Notes</label>
                        <input
                            type="file"
                            onChange={(e) => setNotes(e.target.files[0])}
                            className="w-full py-2 px-3"
                        />
                    </div>
                    {isVideoUploading ? (<animated.button  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline ml-36 mt-8" style={textmultipleAnimation} type="submit">
                        Uploading<span className='text-white font-extrabold text-xl'></span>...
                    </animated.button>) : (<button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline ml-36 mt-8" type="submit">
                        Submit
                    </button>)}
                </form>
                <form onSubmit={handleimage}>
                <hr className="border-gray-300 mb-8 mt-8" /> {/* Dividing line with top and bottom margin */}
                
                <div className="mt-8"> {/* Top margin here for clear separation */}
               
                    <label className="block text-gray-700 text-lg font-bold mb-2">Upload Cover Image</label>
                    <input
                        type="file"
                        className="w-full py-2 px-3"
                        accept="image/*"
                        onChange={e => setFile(e.target.files[0])}
                    />
                    <TooltipWrapper content="This will be Cover photo of Course.    Please Upload !"> 
                   
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-32" type="submit">
                        Upload Image
                    </button>
                    </TooltipWrapper>
                    
                </div>
                </form>
            </div>
           
            <div className="w-8/12 p-4 bg-slate-100 flex flex-col items-center mb-10">
            <div className="flex items-center"> {/* Added flex and items-center for alignment */}
    <h2 className="text-2xl font-semibold mb-4 mr-4">Uploaded Chapters</h2> {/* Added right margin for spacing */}
   
         </div>
    <button onClick={seechapter} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        View Chapters
    </button>
    <div className="w-full h-96 overflow-y-auto bg-gray-100 rounded mt-10">  {/* This is the scrollable container */}
            {chapters && chapters.length > 0 ? (
        chapters.map(chapter => (
            <div className="w-full flex items-center border bold mt-5 bg-slate-200">
                <div className="flex-shrink-0">
                    <img src="\Video-Icon.png" alt="Sample" className="w-16 h-16 r" />
                </div>
                <div className="flex-grow pl-4">
                    <h1 className="text-xl font-bold">{chapter.title}</h1>
                    <p>{chapter.description}</p>
                </div>
                <button  onClick={() => handleEdit(chapter.id, chapter.title, chapter.description)}  className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                <button onClick={() => handleDeleteRequest(chapter.id)}  className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </div>
            ))
            ) : (
              <p>No chapters available.</p>
            )}
            </div>
            </div>
            <ToastContainer />
            {isModalOpen && (
                <Modal show={isModalOpen} size="md" onClose={handleCloseModal}>
                    <Modal.Header>Chapter Details</Modal.Header>
                    <Modal.Body>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Provide chapter details</h3>
                            
                            {/* Field for Title */}
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="title" value="Title" />
                                </div>
                                <Textarea 
                                    id="title" 
                                    value={chapterTitle} 
                                    onChange={e => setChapterTitle(e.target.value)} 
                                />
                            </div>

                            {/* Field for Description */}
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="description" value="Description" />
                                </div>
                                <Textarea 
                                    id="description" 
                                    value={chapterDescription} 
                                    onChange={e => setChapterDescription(e.target.value)} 
                                />
                            </div>

                            <div className="w-full">
                                <Button onClick={handleSave}>Submit</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
            {isConfirmModalOpen && (
    <Modal show={isConfirmModalOpen} size="md" onClose={() => setIsConfirmModalOpen(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
            <div className="space-y-4">
                <h3 className="text-xl font-medium text-red-600">Are you sure?</h3>
                <p className="text-gray-700">Do you really want to delete this chapter? This action cannot be undone.</p>

                <div className="w-full flex justify-end space-x-4">
                    <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Confirm</Button>
                    <Button onClick={() => setIsConfirmModalOpen(false)} className="bg-gray-500 hover:bg-gray-600">Cancel</Button>
                </div>
            </div>
        </Modal.Body>
    </Modal>
)}
</div>

    );
    
}

export default Faculty_course_management;
