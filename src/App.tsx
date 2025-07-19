import { useState, useRef } from 'react'

import './App.css'
import RecordButton from './components/RecordButton'
import VideoPreview from './components/VideoPreview'
import { getMediaRecorder } from './lib/mediaRecorder'

function App() {
  const [mediaRecorderState, setMediaRecorderState] = useState("inactive");
  const [recordedFile, setRecordedFile] = useState<File | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const blobChunksRef = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    if(!mediaRecorderRef.current) {
      const mediaRecorder = await getMediaRecorder();
      if(!mediaRecorder) return;
  
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorderRef.current.ondataavailable = (e) => {
        if(e.data && e.data.size > 0) blobChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(blobChunksRef.current);
        const file = new File([blob], "file1.webm", { type: "video/webm" });
        setRecordedFile(file);
      };
    }

    if(mediaRecorderRef.current.state == "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
      setMediaRecorderState("inactive");
    } else {
      mediaRecorderRef.current.start();
      setMediaRecorderState("recording");
    }
  };

  return (
    <div className='container'>
      <VideoPreview file={recordedFile} />
      <RecordButton 
        state={mediaRecorderState}
        onClick={toggleRecording}
      />
    </div>
  )
}

export default App
