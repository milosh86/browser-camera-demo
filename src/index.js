import "./styles.css";
import "./image-capture-polyfill.js";

const fileInput = document.getElementById("file-input");
const imagePreview = document.getElementById("image-preview");

fileInput.addEventListener("change", handleImageSelect);

function handleImageSelect(e) {
  const fileList = e.target.files;
  let imageFile;

  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].type.match(/^image\//)) {
      imageFile = fileList[i];
      break;
    }
  }

  if (!imageFile) return;

  imagePreview.src = window.URL.createObjectURL(imageFile);
}

// WebRTC API
// Direct access to the camera requires consent from the user, and your site MUST be on a secure origin (HTTPS)
const isWebRtcSupported = "mediaDevices" in navigator;
document.getElementById("web-rtc-support").innerText = isWebRtcSupported
  ? "Yes"
  : "No";

if (isWebRtcSupported) {
  const player = document.getElementById("player");

  const constraints = {
    video: {
      facingMode: "environment"
    }
  };

  let imageCapture;
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(mediaStream => {
      player.srcObject = mediaStream;

      const mediaStreamTrack = mediaStream.getVideoTracks()[0];
      imageCapture = new ImageCapture(mediaStreamTrack);
    })
    .catch(error => console.error("getUserMedia() error:", error));

  document.getElementById("snapshoot-btn").addEventListener("click", () => {
    if (!imageCapture) return;

    imageCapture
      .takePhoto()
      .then(blob => {
        imagePreview.src = URL.createObjectURL(blob);
      })
      .catch(error => console.error("takePhoto() error:", error));
  });
}
