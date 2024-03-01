import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../Axios_instance/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react'
import animationData from '../../lottieani/Animation - 1704965843739.json'
// import Loader from '../../General/loader';
import Loader from '../../General/NewLoader';


function NotesView() {
  const api = useApi()
  const [notes, setNotes] = useState([])
  const [loading, setloading] = useState(false)
  const [editNote, setEditNote] = useState('')
  const [chapter, setChapter] = useState('')
  const [EditId, setEditId] = useState('')
  const [ismodel, setIsmodel] = useState(false);
  const user_id = localStorage.getItem('user_id');
  const [showDropdown, setShowDropdown] = useState(() => Array(notes.length).fill(false));

  const { uniqueChapterTitle: chaptername } = useParams();

  const fetchNotes = async () => {

    try {
      setloading(true)
      const response = await api.get(`notes-about/chapters-notes-view/${chaptername}/${user_id}/`);

      setNotes(response.data);
      setChapter(response.data[0].chapter.title)
      setloading(false)



    } catch (error) {
      console.error("Error fetching errors:", error);

    }
  }
  const toggleDropdown = (index) => {
    setShowDropdown((prevShowDropdown) => {
      const updatedState = [...prevShowDropdown];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  };
  const handleclose = () => {
    setIsmodel(false);
    setEditNote(null)
  };


  const handlenoteChange = (e) => {
    setEditNote(e.target.value);
  };

  const handledit = (id, content) => {
    setIsmodel(true)
    setEditNote(content)
    setEditId(id)
  };



  useEffect(() => {
    fetchNotes()
  }, [])

  const confirmEdit = async () => {

    try {
      setloading(true)
      const response = await api.patch(`notes-about/notes-update-delete/${EditId}/`, { content: editNote });
      fetchNotes()
      setNotes(response.data);
      setIsmodel(false);
      setEditNote(null)


      toast.success("You have Edited successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
        theme: "colored"
      });
      setloading(false)



    } catch (error) {
      console.error("Error fetching errors:", error);

    }
  }

  const confirmDelete = async (Id) => {

    try {
      const response = await api.delete(`notes-about/notes-update-delete/${Id}/`);


      fetchNotes()
      toast.success("You have Deleted successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
        theme: "colored"
      });


    } catch (error) {
      console.error("Error fetching errors:", error);

    }
  }

  const formatTimeInMinutesAndSeconds = (timestamp) => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = timestamp % 60;
    return `${minutes} min ${seconds} sec`;
  };


  return (

    <>
      {notes.length > 0 && <h2 className="text-4xl font-bold mt-8 ml-6 text-center text-black tracking-wide md:text-left md:mr-4">
        Chapter : <span className="text-4xl font-bold mt-8   text-center text-sky-700" >{chapter}</span> 
      </h2>}

      {notes.length > 0 ? (notes.map((note, index) => (

          <div key={note.id}
            className="p-4 rounded-md shadow-md mb-4 bg-gradient-to-r from-blue-200 to-green-200 mt-8">

            <span className="text-green-500 font-semibold">
              <span className="text-red-500 font-bold ">TIME :</span> {formatTimeInMinutesAndSeconds(note.timestamp)}
            </span>
            <div className="flex items-center justify-between">

              <span className="text-lg font-bold">{note.content.split(' ').slice(0, 5).join(' ')}<span onClick={() => toggleDropdown(note.id)} className='text-blue-500 text-sm cursor-pointer'>...read {showDropdown[note.id] ? 'less' : 'more'}</span></span>
              <div className="flex items-center space-x-4 ">
                <button
                  onClick={() => toggleDropdown(note.id)}
                  className=" text-black text-4xl focus:outline-none "
                >
                  {showDropdown[note.id] ? '-' : '+'}
                </button>

              </div>
            </div>

            {showDropdown[note.id] && (
              <div className="mt-4">

                <span className="text-black font-bold">{note.content}</span>
                <div className=" justify-end flex space-x-4 mt-4 ">
                  <p onClick={() => { handledit(note.id, note.content) }} className=" text-green-500 font-bold cursor-pointer ">
                    Edit
                  </p>
                  <p onClick={() => { confirmDelete(note.id) }} className=" text-red-500 font-bold  cursor-pointer">
                    Delete
                  </p>
                </div>
              </div>
            )}
          </div>
        ))) : (
          <div className='flex items-center  ml-96'>
            <Lottie animationData={animationData} className="w-2/4 h-2/4 mt-2" />
            <h2 className="text-4xl font-bold mb-4 text-center text-sky-700 tracking-wide md:text-left md:mr-4">
             Empty Notes
        </h2>
           
          </div>
        )

      }


      {ismodel && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-white p-4 lg:p-12 rounded-md w-full lg:w-2/3 h-2/3 shadow-2xl flex flex-col justify-between">
            <div>
              <button onClick={handleclose} className="absolute top-2 right-2 px-3 py-1">
                ✖️
              </button>
              <h2 className="text-2xl lg:text-3xl font-semibold mb-6">Edit the Note</h2>
              <label htmlFor="question" className="mb-2 block">
                Note:
              </label>
              <textarea
                id="text"
                value={editNote}
                onChange={handlenoteChange}
                className="w-full h-64 p-2 border border-gray-300 rounded resize-none"
              ></textarea>

            </div>
            <button
              type="button"
              onClick={confirmEdit}


              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );

}
export default NotesView