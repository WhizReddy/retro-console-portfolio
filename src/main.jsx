import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';            // can stay empty
import * as THREE from 'three';
window.THREE = THREE;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App/></React.StrictMode>
);
