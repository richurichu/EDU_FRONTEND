import React from 'react'
import useApi from '../Axios_instance/axios';
import { useState, useEffect,useRef } from 'react';
import ReactPlayer from 'react-player';



function Testingnotes() {
    
    const [notes, setNotes] = useState([])
    const [videoUrl, setVideoUrl] = useState(null);
    const [videoTimestamp, setVideoTimestamp] = useState(0);
    // const [playerReady, setPlayerReady] = useState(false);

    const playerRef = useRef(null);
    const api = useApi()
    const fetchChapters = async () => {
        
        try {
            const response = await api.get('notes-about/notes-list/');
            
            setNotes(response.data);
          
           
        } catch (error) {
            console.error("Error fetching chapters:", error);
            setIsLoading(false)
        }
    }
    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.seekTo(videoTimestamp, 'seconds');
        }
    
        
        
        fetchChapters();
    }, [ videoTimestamp]);

    // useEffect(() => {
    //     if (playerReady) {
    //         seekToTimestamp();
    //     }
    // }, [playerReady, videoTimestamp]);

    const seekToTimestamp = () => {
        if (playerRef && playerRef.current) {
            console.log("Attempting to seek to:", videoTimestamp);
            playerRef.current.seekTo(videoTimestamp, 'seconds');
        }
    }
    

    const handleTimestampClick = (videoUrl, timestamp) => {
        if (videoUrl !== setVideoUrl) {
            setVideoUrl(videoUrl);
        }
        setVideoTimestamp(timestamp);
    };
    
  return (
    
    
    
    <>
    <div>
    {notes.map(note => (
        <div key={note.id}>
          <h3>{note.chapter_details.title}</h3>
          <p>{note.content}</p>
          <button onClick={() => handleTimestampClick(note.chapter_details.video, note.timestamp)}>
            Go to {note.timestamp} seconds
          </button>
        </div>
      ))}
      </div>
      <ReactPlayer
   key={videoUrl}
   url={videoUrl}
   controls={true}
   playing={true}
   ref={playerRef}
   config={{
    file: {
        forceVideo: true
    }
}}
//    onReady={() => {
//        console.log('Player is ready!');
//        setPlayerReady(true);
//    }}
onStart={seekToTimestamp}
/>
</>

        

      
  )
}

export default Testingnotes