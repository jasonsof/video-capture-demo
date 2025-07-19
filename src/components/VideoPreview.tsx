type VideoPreviewProps = {
  file: File | null
}

function VideoPreview({ file }: VideoPreviewProps) {
  return (
    <div className="video-preview">
      {file && (
        <video controls autoPlay src={URL.createObjectURL(file)} />
      )}
    </div>
  )
}
export default VideoPreview;