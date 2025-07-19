type VideoPreviewProps = {
  file: File | null
}

function VideoPreview({ file }: VideoPreviewProps) {
  return (
    <div className="video-preview">
      {file ? (
        <video className="video-element" controls autoPlay src={URL.createObjectURL(file)} />
      ) : (
        <div className="video-placeholder">Waiting for camera access...</div>
      )}
    </div>
  )
}
export default VideoPreview;