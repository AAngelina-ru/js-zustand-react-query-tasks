import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App.jsx';

const mountNode = document.getElementById('container');
const root = ReactDOM.createRoot(mountNode);
root.render(<App />);
// components/App.jsx
export default function App() {
  return <h1>Hello</h1>;
}
