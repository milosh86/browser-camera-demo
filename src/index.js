import "./styles.css";

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use Parcel to bundle this sandbox, you can find more info about Parcel
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;

const fileInput = document.getElementById("file-input");

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

  document.getElementById("image-preview").src = window.URL.createObjectURL(
    imageFile
  );
}
