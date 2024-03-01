
import React from 'react'
import { useState, useEffect } from 'react'
import useApi from '../../Axios_instance/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DiscussionReplies from '../components/DiscussionReplies';
// import Loader from '../../General/loader';
import Loader from '../../General/NewLoader';




function Discussion_page() {
  const api = useApi()
  const [ismodel, setIsmodel] = useState(false);
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState(null);
  const [Editmode, setEditmode] = useState(false)
  const [question_id, setQuestion_id] = useState(null);
  const [repliesOpen, setRepliesOpen] = useState(null);
  const [Loading, setLoading] = useState(false)



  const [Loadquestions, setLoadquestions] = useState([]);

  const user_id = localStorage.getItem('user_id');
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const loadquestions = async () => {
    setLoading(true)
    try {
      const response = await api.get(`comments-about/discussion/`);
      console.log(response.data)
      setLoadquestions(response.data)
      setLoading(false)

    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false)
    }
  };
  //  

  const HandleEdit = (question, image, quesId) => {
    setEditmode(true)
    setQuestion(question)
    setQuestion_id(quesId)
    console.log(question_id, 'pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp')
    if (image) {
      setImage(image)
    }
    setIsmodel(true)


  }
  const handlereply = (questionId) => {
    setRepliesOpen(true)
    setQuestion_id(questionId)

  };

  const handlereplyClose = () => {
    setRepliesOpen(false)
    setQuestion_id(null)

  };


  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleclose = () => {
    setIsmodel(false);
    setImage(null);
    setQuestion('');

  };



  useEffect(() => {
    loadquestions()


  }, [])

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('content', question);
    if (image) {
      formData.append('image', image);
    }
    formData.append('user', user_id);

    console.log(formData)
    console.log('started request ')

    try {

      const response = await api.post(
        `comments-about/discussion/`,
        formData,
        {
          headers: {

            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );
      if (response) {

        toast.success("You have posted successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          theme: "colored"
        });
        setIsmodel(false);
        loadquestions()

      }
    } catch (error) {
      toast.error(error.response.data[0] || "Fields Required", {
        position: toast.POSITION.BOTTOM_CENTER,
        theme: "colored"
      })

    }
  }

  const EditSubmit = async () => {
    const formData = new FormData();
    formData.append('content', question);
    if (image) {
      formData.append('image', image);
    }


    console.log(formData)
    console.log('started request ')

    try {

      const response = await api.put(
        `comments-about/discussion/${question_id}/`,
        formData,
        {
          headers: {

            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );
      if (response) {

        toast.success("You have posted successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          theme: "colored"
        });
        setIsmodel(false);
        loadquestions()

      }
    } catch (error) {
      toast.error(error.response.data[0] || "Fields Required", {
        position: toast.POSITION.BOTTOM_CENTER,
        theme: "colored"
      })

    }
  }


  const handleDeletePost = async (pk) => {


    try {

      const response = await api.delete(
        `comments-about/discussion-delete/${pk}/`,

        {

          withCredentials: true
        }
      );
      if (response) {

        toast.success("You have Deleted successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          theme: "colored"
        });

        loadquestions()

      }
    } catch (error) {
      toast.error("error occured", {
        position: toast.POSITION.BOTTOM_CENTER,
        theme: "colored"
      })

    }
  }

  return (
    <>
      {Loading ? (<Loader />) : (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
          <div className="flex justify-between items-center p-8 lg:p-12">
            <h1 className="text-4xl font-bold">Discussions</h1>
            <div>
              <button
                onClick={() => setIsmodel(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
              >
                Ask a Question
              </button>
            </div>
          </div>
          <div className="p-4">
            {/* Other content */}
          </div>
          {ismodel && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60">
              <div className="relative bg-white p-4 lg:p-12 rounded-md w-full lg:w-2/3 h-2/3 shadow-2xl flex flex-col justify-between">
                <div>
                  <button onClick={handleclose} className="absolute top-2 right-2 px-3 py-1">
                    ✖️
                  </button>
                  <h2 className="text-2xl lg:text-3xl font-semibold mb-6">Ask Your Doubt</h2>
                  <label htmlFor="question" className="mb-2 block">
                    Your Question:
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={handleQuestionChange}
                    className="w-full h-24 p-2 border border-gray-300 rounded"
                  ></textarea>
                  <label htmlFor="image" className="mb-2 mt-8 block">
                    Post Image (optional):
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
                {Editmode ? (
                  <button
                    type="button"
                    onClick={EditSubmit}
                    className="bg-sky-300 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded mt-4"
                  >
                    Save Changes                </button>
                ) : (<button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Submit
                </button>)}
              </div>
            </div>
          )}





          <ul className="p-4">
            {Loadquestions.map((question) => (
              <li key={question.id} className="mb-4 bg-slate-100 p-4 lg:p-6 rounded-md flex items-start">
                <div className="mr-4 bg-slate-100">
                  <img
                    src={question.user.profile_image ? `${question.user.profile_image.split('?')[0]}` : 'https://i0.wp.com/vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png?fit=860%2C681&ssl=1'}

                    alt="Profile"
                    className="rounded-full h-12 w-12 object-cover mb-4"
                  />
                </div>
                <div className="flex-grow ">
                  <span className="text-sm font-regular mt-2 ml-4 block lg:inline">
                    <span className="font-semibold text-lg mr-2">{question.user.username}</span> {question.created_at}
                  </span>
                  <div className="border border-gray-200 p-4 lg:p-6">
                    <div className="text-gray-700 text-lg font-semibold mt-4" style={{ wordWrap: 'break-word' }}>
                      {question.content}
                    </div>

                     {question.image !== null && ( <div className="image-container mt-8">
                      <img onClick={() => handlepicture(question.image)} src={question.image} style={{ maxWidth: '30%', maxHeight: '30%' }} />
                    </div>)}
                  </div>
                  {/* Placeholder for reply, edit, and delete functionality */}
                  <div className="mt-4 ml-4">
                    {question.id === question_id && repliesOpen ? (
                      <button onClick={handlereplyClose} className="text-blue-500 cursor-pointer mr-2">
                        Hide
                      </button>
                    ) : (
                      <button onClick={() => handlereply(question.id)} className="text-blue-500 cursor-pointer mr-2">
                        View
                      </button>
                    )}
                    {question.user.id == user_id && <button onClick={() => HandleEdit(question.content, question.image, question.id)} className="text-blue-500 cursor-pointer mr-2">Edit</button>}
                    {question.user.id == user_id && <button onClick={() => handleDeletePost(question.id)} className="text-red-500 cursor-pointer">Delete</button>}
                  </div>
                  {question_id && repliesOpen && question.id === question_id && <DiscussionReplies Question_id={question_id} />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </>
  );
}

export default Discussion_page