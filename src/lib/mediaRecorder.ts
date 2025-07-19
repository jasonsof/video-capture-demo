export type mediaRecorderType = {
  mediaRecorder: MediaRecorder | null,
  stream: MediaStream | null
}

export const getMediaRecorder = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const mediaRecorder = new MediaRecorder(stream)
    return { mediaRecorder, stream };
  } catch (err) {
    if(err == "NotAllowedError" || err == "NotFoundError") {
      return {
        mediaRecorder: null,
        stream: null,
      };
    }
  }

  return {
    mediaRecorder: null,
    stream: null,
  };
}