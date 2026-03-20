import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';
import api from './lib/api.js';
import splashIcon from './assets/icon.ico';

function App() {
  const [health, setHealth] = useState("loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "ArkNotes";

    api.get('/health')
      .then((response) => {
        console.log("Backend response: ", response.data);
        setHealth(response.data.status);
      })
      .catch((error) => {
        console.log("API Error: ", error);
        setHealth("error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <HashRouter>
      {loading && (
        <div className="splash-screen">
          <img src={splashIcon} alt="ArkNotes" className="splash-icon" />
        </div>
      )}

      {!loading && (
        <>
          {health === "error" && (
            <p className="status text-sm text-[hsl(0,0%,50%)] absolute bottom-1 right-1">
              Status: <span id={`status-${health}`}>{health}</span>
            </p>
          )}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/projectdetail" element={<ProjectDetail />} />
          </Routes>
        </>
      )}
    </HashRouter>
  );
}

export default App;
