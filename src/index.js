import "./styles.css";
import "./image-capture-polyfill.js";

const fileInput = document.getElementById("file-input");
const imagePreview = document.getElementById("image-preview");
const uploadStatus = document.getElementById("upload-status");

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

  document
    .getElementById("send-to-server-btn")
    .addEventListener("click", () => {
      if (!imagePreview.src) return;

      uploadStatus.innerText = "";

      fetch(imagePreview.src)
        .then(res => res.blob())
        .then(
          imageBlob =>
            console.log("imageBlob", imageBlob) ||
            fetch("https://m6k6o.sse.codesandbox.io/upload", {
              method: "POST",
              headers: {
                "Content-Type": imageBlob.type
              },
              body: new FormData().append("photo", imageBlob)
            })
              .then(res => {
                if (!res.ok) throw new Error("Not OK:" + res.status);
                console.log("Image uploaded!");
                uploadStatus.innerText = "Photo uploaded!";
              })
              .catch(e => {
                console.log("Image upload failed!", e.message);
                uploadStatus.innerText = "Photo upload failed! " + e.message;
              })
        );
    });
}
