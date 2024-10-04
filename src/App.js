import React from 'react';
import Table from './Table'; // Assuming your Table component is named Table
import './App.css'; // Include your CSS file if needed


function App() {
  return (
    <div className="content-wrapper">
      <h1 className="title">Volunteer Opportunities Near Salt Lake City</h1>
      
      {/* Add the description below the title */}
      <p className="description">
        Explore a variety of volunteer opportunities in the Salt Lake City area. 
        Whether you're looking for community service, training opportunities, or ways to give back, 
        we have compiled a list of organizations that could use your help.
      </p>

      <Table />
    </div>
  );
}

export default App;
