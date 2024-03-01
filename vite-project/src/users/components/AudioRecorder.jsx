import React from 'react';
import { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

import { FaMicrophone } from 'react-icons/fa';


const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio : true });


    const handleStartRecording = () => {
        startRecording();
        setIsRecording(true);
      };
    
      
      const handleStopRecording = () => {
        stopRecording();
        setIsRecording(false);
      };
    
  return (
    <div>
      <p>{status}</p>
      
      <button
        onMouseDown={handleStartRecording}
        onMouseUp={handleStopRecording}
      >
        <FaMicrophone /> {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
      <button onClick={stopRecording}>Stop Recording</button>
      <audio src={mediaBlobUrl} controls autoPlay loop />
    </div>
  );
};

export default AudioRecorder;
