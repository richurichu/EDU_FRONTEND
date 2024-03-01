import React, { useState, useEffect,useRef } from 'react';
import ReactPlayer from 'react-player';
import useApi from '../../Axios_instance/axios';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';

// import animationData from '../../lottieani/animation_lo607feh.json'
import animationData from '../../lottieani/animation_lo607feh.json'
import PayPalComponent from '../components/PayPalComponent';
import Lottie from 'lottie-react'
import  animationDataa from '../../lottieani/animation_lobt01oj.json'

import Confetti from 'react-confetti';
// import Loader from '../../General/loader';
import Loader from '../../General/NewLoader';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import ChapterLikes from '../components/ChapterLikes';



function CourseDetailsView() {
   
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [teacher, setTeacher] = useState('')
    const [Title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [paymentmodal, setPaymentmodal] = useState(false);
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
    const [noteContent, setNoteContent] = useState("");
    const [currentTimestamp, setCurrentTimestamp] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    
    
    const [liked, setLiked] = useState(false);
    const [likesCount, SetlikesCount] = useState('');
    const api = useApi();
    const { id: courseId } = useParams(); 
    
    const [chapters, setChapters] = useState([]);
    const [ispurchased, setIspurchased] = useState('');
    console.log(ispurchased)
    
    const [currentVideo, setCurrentVideo] = useState('');
    const [currentVideo_id, setCurrentVideo_id] = useState('');
    
    
    const baseUrl = "http://127.0.0.1:8000"; 

   
    const fetchChapters = async () => {
        setIsLoading(true)
        try {
            const response = await api.get(`courses-about/courses/${courseId}/chapters`);
            
            setChapters(response.data.chapters);
            setIspurchased(response.data.purchased);
            
            const videoUrlFromJson = response.data.chapters[0]?.video || '';
            const modifiedVideoUrl = videoUrlFromJson.split('?')[0];

            setCurrentVideo(modifiedVideoUrl)

            // setCurrentVideo(baseUrl + response.data.chapters[0]?.video || '');  
            setTitle(response.data.chapters[0]?.title || '');  
            setDescription(response.data.chapters[0]?.description || '');  
            setTeacher(response.data.chapters[0]?.course.teacher.username || '');  
            setCurrentVideo_id(response.data.chapters[0]?.id || '');  
            SetlikesCount(response.data.chapters[0]?.Likes_count )
            setIsLoading(false)
           
        } catch (error) {
            console.error("Error fetching chapters:", error);
            setIsLoading(false)
        }
    }
    useEffect(() => {
        
        
        fetchChapters();
    }, [courseId,liked]);

    const handleSaveNote = async () => {
        console.log('video_id',currentVideo_id)
        console.log('time',currentTimestamp)
        console.log('content',noteContent)
        try {
            const response = await api.post('notes-about/notes/', {
                
                chapter: currentVideo_id, 
                timestamp: Math.round(currentTimestamp),
                content: noteContent
            });
            if (response.status === 201) {
                toast.success("Your Note have been saved ", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    theme: "colored"
                });

                setIsNoteModalVisible(false)
                setIsPlaying(true)
                setNoteContent('')
                
                
            } else {
              
            }
        } catch (error) {
            console.error("Error saving the note:", error);
        }
    };
    
    const takenote = () => {
        console.log('clicked ------------------------------------------------')
        setIsNoteModalVisible(true)
        setIsPlaying(false)
        
        
    }
    const Closenote = () => {

        setIsNoteModalVisible(false)
        setIsPlaying(true)
        setNoteContent('')

        
    }
    
    

    console.log(currentVideo_id)

    return (
        <>
        {isLoading ? (<Loader /> ) : (
        
        <div className="flex flex-col mt-10 lg:flex-row items-start bg-slate-100">
          <div className="w-full lg:w-2/3 lg:mr-6 mb-6 lg:mb-0">
            <div className="ml-4 ">
                <ReactPlayer url={currentVideo}   controls={true}   playing={isPlaying} volume={true} onProgress={(progress) => setCurrentTimestamp(progress.playedSeconds)} width="100%" height="100%" />
                </div>
                <div className="flex ">
                {currentVideo_id &&(<ChapterLikes  chapter_id ={currentVideo_id}/>)}
                <div className="flex-grow"></div>
                <button className="bg-indigo-500 text-white font-semibold px-4 py-2 rounded-full  hover:bg-indigo-600 mt-4 mr-2 " onClick={takenote}>Take Notes </button>
                </div>
                <h5 className="text-xl font-bold  ml-4 mt-4">  {Title}</h5>
                {/* <h5 className="text-xl font-bold ml-4 mt-4">{teacher}</h5> */}
                <h5 className="text-xl font-normal  ml-4 mt-4">{description}</h5>
                
               {currentVideo_id &&(<Comments  chapter_id ={currentVideo_id}/>)} 
          </div>
            
        
            <div className="w-full lg:w-1/3 bg-slate-100 shadow-lg p-4 rounded-lg ">
                <h3 className="text-xl font-bold mb-4">Chapters</h3>
                <ul>
                    {chapters.map(chapter => (
                        <li key={chapter.id} className={`mb-4 bg-white shadow-lg p-4 rounded flex items-center justify-between transform transition-transform duration-900 hover:scale-104 hover:bg-gray-200 cursor-pointer ${currentVideo_id === chapter.id ? 'border-green-500 border-2' : ''}`}>
                            <Lottie animationData={animationData} className="w-12 h-12" />
                            <h3 className="flex-grow text-gray-700 ml-4 text-xl font-bold">{chapter.title}</h3>
                           {chapter.is_free || ispurchased  ?( <button 
                                className="text-white bg-indigo-500 px-4 py-2 rounded-full hover:bg-indigo-600 w-20"
                                onClick={() => {setCurrentVideo(chapter.video.split('?')[0]),setCurrentVideo_id(chapter.id),SetlikesCount(chapter.Likes_count),setTitle(chapter.title),setDescription(chapter.description)}}
                            >
                                Play
                            </button>)
                            :( <button 
                                className="text-white bg-indigo-500 px-4 py-2 rounded-full hover:bg-indigo-600 w-20"
                                  onClick={()=>setShowModal(true) }
                            >
                                Unlock
                            </button>)}
                        </li>
                         
                    ))}
                </ul>
            </div>
            
                        {showModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60">
                    <div className="relative bg-white p-12 rounded-md w-1/3 shadow-2xl">
                        <h2 className="text-3xl font-semibold mb-6">Unlock Full Course</h2>
                        <p className="mb-6 text-lg">🎥 Access to 20+ exclusive videos</p>
                        <p className="mb-6 text-lg">📄 Get 20+ premium PDF notes</p>
                        <p className="mb-8 text-lg">🕒 Enjoy lifetime validity for all content</p>
                        
                        <PayPalComponent course={chapters[0]?.course }refresh ={fetchChapters} setmodal={setShowModal} paymodal ={setPaymentmodal} />

                        {/* Close Button */}
                        <button 
                            onClick={() => setShowModal(false)} 
                            className="absolute top-2 right-2 px-3 py-1 mr-0 mt-2"
                        >
                            ✖️
                        </button>
                    </div>
                </div>
            )}
             {paymentmodal &&  <Confetti /> }
                        {paymentmodal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60">
                    <div className="relative bg-slate-100 p-8 rounded-md w-1/3 shadow-3xl mr-32">
                        <Lottie animationData={animationDataa} className="w-full h-full mt-2" loop={false} />
                        <button 
                            onClick={() => setPaymentmodal(false)} 
                            className="absolute top-2 right-2 px-3 py-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors duration-300"
                        >
                            ✖️
                        </button>
                    </div>
                </div>
            )}
                        {isNoteModalVisible && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md w-2/3">
                    <h3 className="text-xl mb-4">Take a Note at<span className='text-red-500 font-bold text-xl ml-2'>{Math.floor(currentTimestamp)} seconds</span>  </h3>
                        <textarea 
                            value={noteContent} 
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Your note..."
                            className="w-full p-2 mb-4 border rounded"
                            rows={5}
                        />
                        <button 
                            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                            onClick={handleSaveNote}
                        >
                            Save Note
                        </button>
                        <button 
                            className="ml-4 text-indigo-500"
                            onClick={Closenote}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
         )}
        
    </>
    
    );
}

export default CourseDetailsView;
