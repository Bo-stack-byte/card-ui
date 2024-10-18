import React, { Suspense } from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';

const App = React.lazy(() => import('./App'));
const UI = React.lazy(() => import('./BACKapp'));



/*
function renderApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');

  // Render the appropriate component based on the mode
  root.render(


    <React.StrictMode>
      {mode === 'visualizer' ? <Visualizer /> : <App />}
    </React.StrictMode>
  );
}*/

// Function to load the appropriate CSS
function loadCSS(filename) {
  const head = document.head;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = process.env.PUBLIC_URL + filename;
  head.appendChild(link);
}


const container = document.getElementById('root');
const root = createRoot(container);
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
if (mode == "backup") {
  loadCSS('/BACKapp.css');
  root.render(
    <Suspense fallback={<div>Loading...</div>}>
      <UI />
    </Suspense>
  );
} else {
  loadCSS('/App.css');
  root.render(
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  );
}

//ReactDOM.render(<Visualizer />, document.getElementById('root'));


// renderApp();

