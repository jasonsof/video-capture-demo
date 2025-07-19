import { useState, useRef, useEffect } from 'react'

import './App.css'
import RecordButton from './components/RecordButton'
import VideoPreview from './components/VideoPreview'
import { getMediaRecorder } from './lib/mediaRecorder'

function App() {
  const [recorderState, setRecorderState] = useState<"notready" | "ready" | "recording">("notready");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedFile, setRecordedFile] = useState<File | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const blobChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    setupRecorder();
  }, []);

  const setupRecorder = async () => {
    if(!mediaRecorderRef.current) {
      const {mediaRecorder, stream} = await getMediaRecorder();
      if(!mediaRecorder || !stream) return;
  
      mediaRecorderRef.current = mediaRecorder;
      setMediaStream(stream);
      setRecorderState("ready");

      mediaRecorderRef.current.ondataavailable = (e) => {
        if(e.data && e.data.size > 0) blobChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(blobChunksRef.current);
        const file = new File([blob], "file1.webm", { type: "video/webm" });
        setRecordedFile(file);
        setRecorderState("ready");
      };
    }
  }

  const toggleRecording = async () => {
    if(mediaRecorderRef.current?.state == "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
      return;
    }

    if(recordedFile) {
      setRecordedFile(null);
      setMediaStream(null);
      blobChunksRef.current = [];
    }

    await setupRecorder();
    mediaRecorderRef.current?.start();
    setRecorderState("recording");
  };

  return (
    <div className='container'>
      <VideoPreview finalFile={recordedFile} previewStream={mediaStream} />
      <RecordButton 
        state={recorderState}
        onClick={toggleRecording}
      />
    </div>
  )
}

export default App
