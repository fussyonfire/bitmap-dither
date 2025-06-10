const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ditherRange = document.getElementById("ditherRange");
const rangeValue = document.getElementById("rangeValue");
const downloadBtn = document.getElementById("download");

let originalImage = null;

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    applyDither();
  };
  img.src = URL.createObjectURL(file);
});

ditherRange.addEventListener("input", () => {
  rangeValue.textContent = ditherRange.value;
  if (originalImage) applyDither();
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "dithered.png";
  link.href = canvas.toDataURL();
  link.click();
});

function applyDither() {
  const threshold = parseInt(ditherRange.value);
  const imageData = new ImageData(
    new Uint8ClampedArray(originalImage.data),
    originalImage.width,
    originalImage.height
  );

  for (let i = 0; i < imageData.data.length; i += 4) {
    const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    const val = avg < threshold ? 0 : 255;
    imageData.data[i] = val;
    imageData.data[i + 1] = val;
    imageData.data[i + 2] = val;
  }

  ctx.putImageData(imageData, 0, 0);
}
