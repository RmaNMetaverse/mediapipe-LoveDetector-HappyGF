How to run this web app locally

Option 1 — Python (quick, no install if Python is present):

1. Open a terminal in this project folder (where index.html lives).
2. Run:

```powershell
python -m http.server 8000
```

3. Open your browser to http://localhost:8000

Option 2 — Node/npm (if you have Node):

```powershell
npm install -g serve
serve -s . -l 8000
```

Option 3 — VS Code Live Server extension:

- Install the Live Server extension and click "Go Live".

Notes:
- Allow camera access when prompted.
- Replace the placeholder images in `images/` with your own photos named `neutral.svg` and `happy.svg` (or update the `src` attributes in `index.html`).
