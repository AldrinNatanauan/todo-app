import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [health, setHealth] = useState("loading...");

  useEffect(() => {
    axios.get("http://localhost:5000/api/health")
      .then((response) => {
        console.log("Backend response: ", response.data);
        setHealth(response.data.status);
      })
      .catch((error) => {
        console.log("API Error: ", error);
        setHealth("error");
      });
  }, []);

  return (
    <HashRouter>
      {/* Status bar outside of Routes */}
      <p className="status text-sm text-[hsl(0,0%,50%)]">
        Status: <span id={`status-${health}`}>{health}</span>
      </p>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/projectdetail" element={<ProjectDetail />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
