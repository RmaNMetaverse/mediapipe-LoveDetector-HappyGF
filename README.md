
# Wink to Make yout girl happy

  

Small browser-based demo that uses MediaPipe Face Mesh to detect a wink and swap an image reaction.

  

Features

- Real-time wink detection using MediaPipe Face Mesh (runs in-browser).

- Shows a "neutral" image and switches to a "happy" version of the image when a wink is detected.

- Minimal, dependency-free static site (uses CDN for MediaPipe and Tailwind).

  

# Quick start

  

Prerequisites: modern browser with webcam access.

 

**Run Online (github pages):**  https://rmanmetaverse.github.io/WinkDetector-HappyGF/

   
**Run Locally**

clone the project on your system and use the options below to run the project loaclly:

Run with Python http.server (quick):
  

```powershell

python -m http.server 8000

# open http://localhost:8000

```

  

Or with Node `serve`:

  

```powershell

npm install -g serve

serve -s . -l 8000

```

  

Or use the VS Code Live Server extension.

  
  

Usage

- Allow camera access when prompted.

- Replace the placeholder images in `images/` with your own photos (keep filenames or update `index.html`).

  

Privacy

- Video frames are processed locally in the browser and are not sent to any server.

  

Troubleshooting

- If camera access is denied, reload the page and allow permissions.

- If the face isn't detected, ensure good lighting and that the face is in frame.

  

License

- MIT — feel free to fork and adapt.
