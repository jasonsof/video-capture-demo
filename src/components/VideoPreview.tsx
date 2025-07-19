import { useRef, useEffect } from 'react'

type VideoPreviewProps = {
  finalFile: File | null
  previewStream: MediaStream | null
}

function VideoPreview({ finalFile, previewStream }: VideoPreviewProps) {
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const isLivePreview = !finalFile && !!previewStream;

  useEffect(() => {
    if(!videoPlayerRef.current) return

    if(finalFile) {
      videoPlayerRef.current.srcObject = null;
      videoPlayerRef.current.src = URL.createObjectURL(finalFile)
    } else if(previewStream) {
      videoPlayerRef.current.srcObject = previewStream
    }
  }, [previewStream, finalFile]);

  return (
    <div className="video-preview">
      {finalFile || previewStream ? (
        <video ref={videoPlayerRef} className="video-element" controls autoPlay muted={isLivePreview} />
      ) : (
        <div className="video-placeholder">Waiting for camera access...</div>
      )}
    </div>
  )
}
export default VideoPreview;