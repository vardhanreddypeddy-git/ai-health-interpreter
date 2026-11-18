import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ClerkWrapper from './ClerkWrapper.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkWrapper>
      <App />
    </ClerkWrapper>
  </React.StrictMode>
);
