export const getMediaRecorder = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return new MediaRecorder(stream);
  } catch (err) {
    if(err == "NotAllowedError" || err == "NotFoundError") {
      return null;
    }
  }

  return null;
}