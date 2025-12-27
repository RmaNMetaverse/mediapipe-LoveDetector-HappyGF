// app.js - main application logic extracted from index.html
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const videoElement = document.getElementById('input_video');
  const canvasElement = document.getElementById('output_canvas');
  const canvasCtx = canvasElement.getContext('2d');
  const loadingScreen = document.getElementById('loading');
  const cameraWrapper = document.getElementById('camera-wrapper');
  const statusBadge = document.getElementById('status-badge');
  const debugText = document.getElementById('debug-text');

  const imgNeutral = document.getElementById('img-neutral');
  const imgHappy = document.getElementById('img-happy');
  const moodText = document.getElementById('mood-text');

  // State
  let isWinking = false;
  let isModelLoaded = false;

  // Constants for Wink Detection
  const WINK_THRESHOLD = 0.24;

  // Face Mesh Landmarks for Eyes
  const LEFT_EYE = [33, 160, 158, 133, 153, 144];
  const RIGHT_EYE = [362, 385, 387, 263, 373, 380];

  // Euclidean distance helper
  function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  // Calculate Eye Aspect Ratio
  function getEAR(landmarks, indices) {
    const p1 = landmarks[indices[0]];
    const p2 = landmarks[indices[1]];
    const p3 = landmarks[indices[2]];
    const p4 = landmarks[indices[3]];
    const p5 = landmarks[indices[4]];
    const p6 = landmarks[indices[5]];

    const v1 = distance(p2, p6);
    const v2 = distance(p3, p5);
    const h = distance(p1, p4);

    return (v1 + v2) / (2.0 * h);
  }

  // Handle Results from MediaPipe
  function onResults(results) {
    if (!isModelLoaded) {
      isModelLoaded = true;
      loadingScreen.style.display = 'none';
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];

      const leftEAR = getEAR(landmarks, LEFT_EYE);
      const rightEAR = getEAR(landmarks, RIGHT_EYE);
      debugText.innerText = `L: ${leftEAR.toFixed(2)} | R: ${rightEAR.toFixed(2)}`;

      const leftClosed = leftEAR < WINK_THRESHOLD;
      const rightClosed = rightEAR < WINK_THRESHOLD;

      let currentlyWinking = false;
      if ((leftClosed && !rightClosed) || (!leftClosed && rightClosed)) {
        currentlyWinking = true;
      }

      if (currentlyWinking) {
        isWinking = true;
        statusBadge.innerText = 'WINK DETECTED!';
        statusBadge.className = 'absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20';
        cameraWrapper.classList.add('active');

        imgHappy.classList.remove('hidden-img');
        imgHappy.classList.add('visible-img');
        imgNeutral.classList.remove('visible-img');
        imgNeutral.classList.add('hidden-img');

        moodText.innerText = 'She is Happy! ❤️';
        moodText.className = "text-3xl font-bold font-['Fredoka_One'] text-pink-400";
      } else {
        isWinking = false;
        statusBadge.innerText = 'Looking for wink...';
        statusBadge.className = 'absolute top-4 right-4 bg-gray-800/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold border border-gray-600 z-20';
        cameraWrapper.classList.remove('active');

        imgNeutral.classList.remove('hidden-img');
        imgNeutral.classList.add('visible-img');
        imgHappy.classList.remove('visible-img');
        imgHappy.classList.add('hidden-img');

        moodText.innerText = "She's not Happy";
        moodText.className = "text-3xl font-bold font-['Fredoka_One'] text-white";
      }

      // Highlight eyes
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#ff006e', lineWidth: 2});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#ff006e', lineWidth: 2});
    } else {
      statusBadge.innerText = 'No face detected';
      statusBadge.className = 'absolute top-4 right-4 bg-red-500/80 text-white px-3 py-1 rounded-full text-xs font-bold z-20';
    }

    canvasCtx.restore();
  }

  // Initialize FaceMesh
  const faceMesh = new FaceMesh({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  }});

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(onResults);

  // Initialize Camera
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await faceMesh.send({image: videoElement});
    },
    width: 640,
    height: 480
  });

  // Handle Canvas Resizing
  function resizeCanvas() {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
  }
  videoElement.addEventListener('loadedmetadata', resizeCanvas);

  camera.start().catch(err => {
    console.error('Camera error:', err);
    loadingScreen.innerHTML = `<div class='text-red-500 text-center p-4'>Error accessing camera.<br>Please ensure you gave permission and reload.</div>`;
  });
});
