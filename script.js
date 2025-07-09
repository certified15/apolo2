// Floating emoji hearts
const heartOverlay = document.getElementById("heartOverlay");
const heartEmojis = ["❤️", "💗", "💕", "💞", "💓"];

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.top = Math.random() * 100 + "vh";
  heart.style.fontSize = Math.random() * 20 + 20 + "px";
  heartOverlay.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}
setInterval(spawnHeart, 500);

// Audio visualizer glow
const audioEl = document.getElementById("audio");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let audioCtx, analyser, source, bufferLength, dataArray;

function setupVisualizer() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audioEl);

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 64;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  drawPulsingGlow();
}

function drawPulsingGlow() {
  requestAnimationFrame(drawPulsingGlow);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const avg = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const maxRadius = Math.min(canvas.width, canvas.height) / 2.5;
  const radius = maxRadius * (0.5 + avg / 256);

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, 'rgba(255, 182, 193, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 182, 193, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  const image = document.getElementById("centerImage");
  if (image) {
    const glowSize = 20 + avg / 2;
  image.style.boxShadow = `
    0 0 ${glowSize}px rgba(155, 93, 229, 1),
    0 0 ${glowSize * 1.2}px rgba(255, 105, 180, 0.5)`;
}
} 
audioEl.addEventListener("play", () => {
  if (!audioCtx) setupVisualizer();
});