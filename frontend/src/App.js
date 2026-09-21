import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import IncidentList from './components/IncidentList';
import CreateIncident from './components/CreateIncident';
import IncidentDetails from './components/IncidentDetails';

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/incidents" element={<IncidentList />} />
          <Route path="/incidents/new" element={<CreateIncident />} />
          <Route path="/incidents/:id" element={<IncidentDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
