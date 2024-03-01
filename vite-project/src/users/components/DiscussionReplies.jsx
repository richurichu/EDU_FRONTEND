import React from 'react'
import { useState,useEffect } from 'react';
import useApi from '../../Axios_instance/axios';
import {Avatar} from 'flowbite-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReactMediaRecorder } from 'react-media-recorder';
// import { FaMicrophone } from 'react-icons/fa';
// import { FaStop } from 'react-icons/fa';
import Lottie from 'lottie-react'
import  animationData from '../../lottieani/Animation - 1699268857209 (1).json'



function DiscussionReplies({Question_id}) {
    const user_id = localStorage.getItem('user_id');
    console.log(user_id,'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    console.log('from comment ' , Question_id)
    const api = useApi()
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [parentCommentId, setParentCommentId] = useState(null); 
    const [showReplies, setShowReplies] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editedCommentText, setEditedCommentText] = useState('');
    const [commentBeingEdited, setCommentBeingEdited] = useState('');
    const [audioData, setAudioData] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isReplyRecording, setIsReplyRecording] = useState(false);
    const [nocommentvoice, setNoCommentVoice] = useState(true);
    const [noreplyvoice, setNoReplyVoice] = useState(true);
 

   



    const loadComments = async () => {
        try {
          const response = await api.get(`comments-about/discussions-replies/?Question_id=${Question_id}`);
          console.log(response.data)
          const structuredComments = structureComments(response.data); 
          setComments(structuredComments);
          console.log(structuredComments)
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };

    useEffect(() => {
        loadComments();
      }, [Question_id]);


    const { status, startRecording, stopRecording, mediaBlobUrl,clearBlobUrl  } =
      useReactMediaRecorder({ audio : true });


    const handleStartRecording = () => {
        setNoReplyVoice(false)
        
        startRecording();
        setIsRecording(true);
      };

      const handleStopRecording = () => {
       
        stopRecording();
        setIsRecording(false);
      };

      const commentvoiceclear = () => {
        setNoReplyVoice(true)
        
        clearBlobUrl()
      };



      const handleReplyStartRecording = () => {
        setNoCommentVoice(false)
        startRecording();
        setIsReplyRecording(true);
      };

      const handleReplyStopRecording = () => {
        
        stopRecording();
        setIsReplyRecording(false);
        
       
        console.log(mediaBlobUrl,'recorded audio from  media  ')
      };

      const replyvoiceclear = () => {
        setNoCommentVoice(true)
        
        clearBlobUrl()
      };

     
      
      
    
      
     
         
      console.log(parentCommentId)

      const structureComments = (commentsData) => {
     
        const commentsDictionary = {};
    
        const rootComments = [];
    
        for (const comment of commentsData) {
          comment.replies = []; 
    
          commentsDictionary[comment.id] = comment;
          if (comment.parent_comment) {
            
            commentsDictionary[comment.parent_comment].replies.push(comment);
          } else {
           
            rootComments.push(comment);
          }
        }
    
        return rootComments;
      };
      console.log(comments)
    
    
      const handleCommentSubmit = async () => {
        setNoReplyVoice(true)
        console.log(Question_id)
        console.log(commentText)
        try {
            const formData = new FormData();
            formData.append('text', commentText);

        
           if (mediaBlobUrl) {
               const audioBlob = await fetch(mediaBlobUrl).then((res) => res.blob());
              formData.append('audio', audioBlob, 'audio.wav');
            }
            const response = await api.post(`comments-about/response-create/${Question_id}/`, formData );
            if (response.status === 201) {
               
                console.log('successfull')
                setCommentText('')
                setParentCommentId(null)
                setAudioData(null)
                
                toast.success("Successfully Commented", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    
                });
                loadComments();
                clearBlobUrl()
            } else {
              
            }
        } catch (error) {
            console.error("Error saving the comment:", error);
        }
    }

  

    const toggleReplies = (commentId) => {
        setShowReplies({
          ...showReplies,
          [commentId]: !showReplies[commentId],
        });
      };


    const findCommentToEdit = (commentsList, commentId) => {
        for (const comment of commentsList) {
          if (comment.id === commentId) {
            return comment; // Return the comment to edit
          }
          if (comment.replies.length > 0) {
            const foundInReplies = findCommentToEdit(comment.replies, commentId);
            if (foundInReplies) {
              return foundInReplies; // Return the comment found in replies
            }
          }
        }
        return null; // Comment not found
      };


    const handleEdit = (commentId) => {
    
         const commentToEdit = findCommentToEdit(comments, commentId);
        console.log(commentToEdit,'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
        console.log(commentId,'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
        console.log(editedCommentText,'[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[')
        if (commentToEdit) {
            console.log(commentToEdit.text)
          setEditedCommentText(commentToEdit.text);
          setCommentBeingEdited(commentId)
        }
      
        setEditMode(true);
      }


      const handleEditCancel = () => {
    
        setEditedCommentText('')
        setCommentBeingEdited('')
        setEditMode(false);
      }
      
    
      const handleEditSubmit = async () => {
        console.log ('reached editsubmit ')
       
         try {
             const response = await api.patch(`comments-about/discussion-edit-delete/${commentBeingEdited}/`, {
                 
                 text: editedCommentText
             });
             if (response.status === 200) {
                 setEditMode(false)
                 console.log('successfull')
                 setEditedCommentText('')
                 setCommentBeingEdited('')
                 loadComments();
                 toast.success("Successfully Edited", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    
                });
              
             } else {
               
             }
         } catch (error) {
             console.error("Error saving the comment:", error);
         }
     
 };

 const handleDelete = async (Id) => {
    
   
     try {
         const response = await api.delete(`comments-about/discussion-edit-delete/${Id}/`, {
             
           
         });
         if (response.status === 204) {
             
             console.log('successfull')
             loadComments();
             toast.success("Successfully Deleted", {
                position: toast.POSITION.BOTTOM_CENTER,
                
            });
          
         } else {
           
         }
     } catch (error) {
         console.error("Error saving the comment:", error);
     }
 
};
 
const handleNestedReplySubmit = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData();
        formData.append('text', replyText);
        formData.append('parentid', parentCommentId);

    
       if (mediaBlobUrl) {
           const audioBlob = await fetch(mediaBlobUrl).then((res) => res.blob());
          formData.append('audio', audioBlob, 'audio.wav');
        }
        const response = await api.post(`comments-about/nested-response-create/${Question_id}/`, formData );
        if (response.status === 201) {
           
            console.log('successfull')
            setReplyText('')
            setParentCommentId(null)
            setAudioData(null)
            setNoCommentVoice(true)
            
            
            toast.success("Successfully Commented", {
                position: toast.POSITION.BOTTOM_CENTER,
                
            });
            loadComments();
            clearBlobUrl()
        } else {
          
        }
    } catch (error) {
        console.error("Error saving the comment:", error);
    }
 
};
      const renderComments = (commentsList) => {
        return commentsList.map((comment) => (
          <li key={comment.id} className="mb-4 p-4 rounded-md flex items-start  ">
            <div className="mr-4 ">
            <img
                    src={comment.user.profile_image ? `${comment.user.profile_image.split('?')[0]}` : 'https://i0.wp.com/vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png?fit=860%2C681&ssl=1'}

                    alt="Profile"
                    className="rounded-full h-12 w-12 object-cover mb-4"
                  />
            </div>
            <div className="flex-grow ">
              <span className="text-sm font-regular mt-2 ml-4">
                <span className="font-semibold text-lg mr-2">{comment.user.username}</span> {comment.created_at}
              </span>
    
              <p className="text-gray-700 text-lg font-bold border bg-white border-gray-300 p-4 rounded-3xl">
                {editMode && commentBeingEdited == comment.id ? (
                    <input
                    type="text"
                    value={editedCommentText}
                    onChange={(e) => setEditedCommentText(e.target.value)}
                    style={{ width: '800px' }} 
                    />
                ) : comment.audio ? ( // Check if comment.audio is present
                <audio controls >
                <source src={comment.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
                </audio>
              ) : (
                comment.text
              )}
                </p>
                
             {comment.user.id != user_id && (<button
                onClick={() => setParentCommentId(comment.id)}
                className="text-blue-500  cursor-pointer ml-4 mt-4"
              >
                Reply
              </button>)} 
                   {comment.replies.length > 0 &&(<button
                    onClick={() => toggleReplies(comment.id)} 
                    className="text-blue-500  cursor-pointer ml-4 mt-4"
                >
                    {showReplies[comment.id] ? 'Hide Replies' : 'View Replies'}
                </button>)} 
                {comment.id === parentCommentId && (
  <div key={`reply-${comment.id}`}>
    <form onSubmit={handleNestedReplySubmit}>
      <div className="text-sm font-regular mt-2 ml-4">
        <div style={{ display: 'flex' }}>
          {isReplyRecording ? (
            <div className='ml-10' style={{ display: 'flex', alignItems: 'center', maxWidth: '600px' }}>
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px',  }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px', }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px',  }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px',  }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px', }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px',  }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px', }} />
              
            </div>
          ) : mediaBlobUrl && noreplyvoice ? (
            <>
              <audio src={mediaBlobUrl} controls />
              <button
                className='bg-slate-200 rounded-md p-1 px-2 hover:bg-sky-600 hover:text-white transition duration-300'
                onClick={replyvoiceclear}
              >
                Clear Audio
              </button>
            </>
          ) : (
            <textarea
              id="commentInput"
              className="w-6/12 p-2 rounded-3xl border border-violet-900 mt-2 ml-10"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{ resize: 'none' }}
              required
            ></textarea>
          )}
         {noreplyvoice && ( <button className='ml-8 mt-8' style={{ fontSize: '30px' ,color :'red' }}
        onMouseDown={handleReplyStartRecording}
        onMouseUp={handleReplyStopRecording}
      >
         {/* {isReplyRecording ? <FaStop /> : <FaMicrophone />} */}
      </button >)}
        </div>
      </div>

      <div className="flex items-center mt-4">
        <button type="submit" className="text-blue-500 cursor-pointer ml-4">
          Send
        </button>
        <button
          type="button"
          onClick={() => {setParentCommentId(null), setNoCommentVoice(true) , clearBlobUrl() , setReplyText('')}}
          className="text-gray-500 cursor-pointer ml-2"
        >
          Cancel
        </button>
      </div>
    </form>
    <button
      onClick={() => toggleReplies(comment.id)} // Add this to toggle show/hide replies
      className="text-blue-500 hover:underline cursor-pointer ml-4 mt-4"
    >
      {showReplies[comment.id] ? 'Hide Replies' : 'View Replies'}
    </button>
  </div>
)}
      {showReplies[comment.id] && comment.replies.length > 0 && (
            <ul className="list-none p-0 ml-8">
                {renderComments(comment.replies)}
            </ul>
            )}
            {comment.user.id == user_id && (
                    <div className="ml-4 mt-4 space-x-8">
                        {editMode ? (
                <>
                    <button onClick={handleEditSubmit}  className="text-blue-500 cursor-pointer">
                    Save
                    </button>
                    <button onClick={handleEditCancel} className="text-gray-500 cursor-pointer ml-2">
                    Cancel
                    </button>
                </>
                ) : (
                <>
                    {comment.text && <button onClick={()=>handleEdit(comment.id)} className="text-blue-500 cursor-pointer">
                    <FontAwesomeIcon icon={faEdit} />Edit
                    </button>}
                    <button onClick={()=>handleDelete(comment.id)}  className="text-red-500 cursor-pointer ml-2">
                    <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                </>
                )}
                    </div>
                    )}
            </div>
          </li>
        ));
      };
    
      return (
    <div className="bg-slate-200 mt-8" style={{ overflow: 'hidden' }}>
          <h1 className="text-3xl font-semibold mb-4 mt-12 ml-10">Comments</h1>
          
    <div  style={{display:'flex'}} >

        {isRecording ? (<div className='ml-10' style={{ display: 'flex', alignItems: 'center', maxWidth: '600px' }}>
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px',  }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px', }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px',  }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px',  }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px', }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px',  }} />
            <Lottie animationData={animationData} style={{ width: '400px', height: '70px', }} />
           
          
    </div >): mediaBlobUrl && nocommentvoice ?( <>
        <audio src={mediaBlobUrl} controls />
        <button className='bg-slate-200 rounded-md p-1 px-2 hover:bg-sky-600 hover:text-white transition duration-300'  onClick={commentvoiceclear}>Clear Audio</button>
        </>) :(<textarea 
                id="commentInput"
                className="w-6/12 p-2 rounded-3xl border border-violet-400 mt-2 ml-10"
                placeholder="Write your comment here..."
                
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ resize: 'none' }}
                required
                
         ></textarea>)}
         
      
     {nocommentvoice && ( <button className='ml-8 mt-8' style={{ fontSize: '30px' ,color :'red' }}
        onMouseDown={handleStartRecording}
        onMouseUp={handleStopRecording}
      >
         {/* {isRecording ? <FaStop /> : <FaMicrophone />} */}
      </button >)}
      
      {nocommentvoice && (<button
        onClick={handleCommentSubmit}
        className="bg-sky-600 text-white px-4 rounded-md  mt-8 ml-4"
        style={{ height: '40px' }}
        >
        Submit
      </button>)}




   {/* <div className='ml-28 mt-4 space-x-2'>
  
      {mediaBlobUrl && (
        <>
        <audio src={mediaBlobUrl} controls />
        <button className='bg-slate-200 rounded-md p-1 px-2 hover:bg-sky-600 hover:text-white transition duration-300'  onClick={clearBlobUrl}>Clear Audio</button>
        </>
      )}

      </div> */}
    </div>
          <ul className="list-none p-0 mt-8" style={{ maxHeight: '400px', overflow: 'hidden' }}>
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
              {renderComments(comments)}
            </div>
          </ul>
          <ToastContainer />
        </div>
      );
    }
    
    export default DiscussionReplies;
    