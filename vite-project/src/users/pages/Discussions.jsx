import React from 'react'
import { useState,useEffect } from 'react';
import useApi from '../../Axios_instance/axios';
import {Avatar} from 'flowbite-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Discussion() {
    const chapter_id = 42
    const user_id = localStorage.getItem('user_id');
    console.log(user_id,'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    console.log('from comment ' , chapter_id)
    const api = useApi()
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [parentCommentId, setParentCommentId] = useState(null); 
    const [showReplies, setShowReplies] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editedCommentText, setEditedCommentText] = useState('');
    const [commentBeingEdited, setCommentBeingEdited] = useState('');
 
    
   



    const loadComments = async () => {
        try {
          const response = await api.get(`comments-about/comments/?chapter_id=${chapter_id}`);
          const structuredComments = structureComments(response.data); 
          setComments(structuredComments);
          console.log(structuredComments)
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };

    useEffect(() => {
        loadComments();
      }, [chapter_id]);
         
      console.log(parentCommentId)

      const structureComments = (commentsData) => {
        // Create a dictionary to quickly access comments by their IDs
        const commentsDictionary = {};
    
        // Organize comments into a hierarchy
        const rootComments = [];
    
        for (const comment of commentsData) {
          comment.replies = []; // Initialize an empty array for replies
    
          // Store the comment in the dictionary
          commentsDictionary[comment.id] = comment;
          if (comment.parent_comment) {
            // Add it as a reply to the parent comment
            commentsDictionary[comment.parent_comment].replies.push(comment);
          } else {
            // This is a top-level comment, add it to the root comments
            rootComments.push(comment);
          }
        }
    
        return rootComments;
      };
      console.log(comments)
    
    
      const handleCommentSubmit = async () => {
        console.log(chapter_id)
        console.log(commentText)
        try {
            const response = await api.post(`comments-about/create/${chapter_id}/`, {
                
                
                text: commentText
            });
            if (response.status === 201) {
                loadComments();
                console.log('successfull')
                setCommentText('')
                setParentCommentId(null)
                loadComments();
                toast.success("Successfully Commented", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    
                });
            } else {
              
            }
        } catch (error) {
            console.error("Error saving the comment:", error);
        }
    }

      const handleReplySubmit = async (e) => {
           e.preventDefault();
            try {
                const response = await api.post(`comments-about/reply/${chapter_id}/`, {
                    
                    parentid : parentCommentId,
                    text: replyText
                });
                if (response.status === 201) {
                
                    console.log('successfull')
                    setReplyText('')
                    setParentCommentId(null)
                    loadComments();
                    toast.success("Reply Posted", {
                        position: toast.POSITION.BOTTOM_CENTER,
                        
                    });
                } else {
                  
                }
            } catch (error) {
                console.error("Error saving the comment:", error);
            }
        
    };

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
             const response = await api.patch(`comments-about/edit-delete/${commentBeingEdited}/`, {
                 
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
         const response = await api.delete(`comments-about/edit-delete/${Id}/`, {
             
           
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
      

    
    
      const renderComments = (commentsList) => {
        return commentsList.map((comment) => (
          <li key={comment.id} className="mb-4 bg-slate-100 p-4 rounded-md flex items-start">
            <div className="mr-4 bg-slate-100">
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            </div>
            <div className="flex-grow">
              <span className="text-sm font-regular mt-2 ml-4">
                <span className="font-semibold text-lg mr-2">{comment.user.username}</span> {comment.created_at}
              </span>
    
              <p className="text-gray-700 text-lg font-bold border bg-white border-gray-200 p-4 rounded-3xl">
                {editMode && commentBeingEdited == comment.id ? (
                    <input
                    type="text"
                    value={editedCommentText}
                    onChange={(e) => setEditedCommentText(e.target.value)}
                    style={{ width: '800px' }} 
                    />
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
                  <form onSubmit={handleReplySubmit}>
                    <div className="text-sm font-regular mt-2 ml-4">

                    </div>
                    <p className="text-gray-700 text-lg font-bold border bg-slate-100 border-gray-200 p-4 rounded-3xl w-full">
                      <textarea
                        className="w-full rounded-2xl"
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                      />
                    </p>
                    <div className="flex items-center mt-4">
                      <button type="submit" className="text-blue-500 cursor-pointer ml-4">
                        Send
                      </button>
                      <button type="button" onClick={() => setParentCommentId(null)} className="text-gray-500  cursor-pointer ml-2">
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
                    <button onClick={()=>handleEdit(comment.id)} className="text-blue-500 cursor-pointer">
                    <FontAwesomeIcon icon={faEdit} />Edit
                    </button>
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
        <div className="bg-slate-100 mt-8" style={{ overflow: 'hidden' }}>
          <h1 className="text-3xl font-bold mb-4 mt-12 ml-20">Discussions</h1>
          <div className="flex items-center ml-20 mt-8">
            <textarea
              id="commentInput"
              className="w-full p-2 rounded-3xl border border-violet-400"
              placeholder="Write your comment here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            ></textarea>
            <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 ml-2" onClick={handleCommentSubmit}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17l5-5-5-5" />
              </svg>
            </button>
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
    
    export default Discussion;
    