import { useState, useRef, useEffect } from 'react'

import './App.css'
import RecordButton from './components/RecordButton'
import VideoPreview from './components/VideoPreview'
import { getMediaRecorder } from './lib/mediaRecorder'

function App() {
  const [mediaRecorderState, setMediaRecorderState] = useState("inactive");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedFile, setRecordedFile] = useState<File | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const blobChunksRef = useRef<Blob[]>([]);

  const setupRecorder = async () => {
    if(!mediaRecorderRef.current) {
      const {mediaRecorder, stream} = await getMediaRecorder();
      if(!mediaRecorder || !stream) return;
  
      mediaRecorderRef.current = mediaRecorder;
      setMediaStream(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if(e.data && e.data.size > 0) blobChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(blobChunksRef.current);
        const file = new File([blob], "file1.webm", { type: "video/webm" });
        setRecordedFile(file);
      };
    }
  }

  useEffect(() => {
    setupRecorder();
  }, []);

  const toggleRecording = async () => {
    if(mediaRecorderRef.current?.state == "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
      setMediaRecorderState("inactive");
      return;
    }

    if(recordedFile) {
      setRecordedFile(null);
      setMediaStream(null);
      blobChunksRef.current = [];
    }

    await setupRecorder();
    mediaRecorderRef.current?.start();
    setMediaRecorderState("recording");
  };

  return (
    <div className='container'>
      <VideoPreview finalFile={recordedFile} previewStream={mediaStream} />
      <RecordButton 
        state={mediaRecorderState}
        onClick={toggleRecording}
      />
    </div>
  )
}

export default App
