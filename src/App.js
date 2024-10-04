import React from 'react';
import Table from './Table'; // Assuming your Table component is named Table
import './App.css'; // Include your CSS file if needed


function App() {
  return (
    <div className="content-wrapper">
      <h1 className="title">Volunteer Opportunities Near Salt Lake City</h1>
      
      {/* Add the description below the title */}
      <p className="description">
        Explore a variety of volunteer opportunities in the Salt Lake City area. You can sort by column or click on a service opportunity to go to the organization's website.
      </p>

      <Table />
    </div>
  );
}

export default App;
