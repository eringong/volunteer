import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Table.css'; // Import the CSS file

const Table = () => {
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterTraining, setFilterTraining] = useState('all'); // New state for filter

  // Fetch and parse CSV data when the component mounts
  useEffect(() => {
    fetch('/data.csv') // Path to your CSV file in the public folder
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true, // Parses the first row as column names
          skipEmptyLines: true, // Skip empty lines
          complete: (result) => {
            setData(result.data); // Store the parsed CSV data in the state
          }
        });
      });
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  // Filter data based on "Training required" field
  const filteredData = data.filter((item) => {
    if (filterTraining === 'all') return true; // No filter applied
    if (filterTraining === 'yes') return item['Training required'].toLowerCase() === 'yes';
    if (filterTraining === 'no') return item['Training required'].toLowerCase() === 'no';
    return true;
  });

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField) {
      if (sortField === 'Minimum age') {
        const aValue = parseInt(a[sortField], 10);
        const bValue = parseInt(b[sortField], 10);
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div>
      {/* Dropdown to select filter for "Training required" */}
      <label htmlFor="filter">Filter by Training Required: </label>
      <select id="filter" value={filterTraining} onChange={(e) => setFilterTraining(e.target.value)}>
        <option value="all">All</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('Organization')}>Organization</th>
            <th onClick={() => handleSort('Service')}>Service</th>
            <th onClick={() => handleSort('Description')}>Description</th>
            <th onClick={() => handleSort('Training required')}>Training Required</th>
            <th onClick={() => handleSort('Minimum age')}>Minimum Age</th>
            {/* New columns added to the header */}
            <th onClick={() => handleSort('Commitment')}>Commitment</th>
            <th onClick={() => handleSort('Group size')}>Group Size</th>
            <th onClick={() => handleSort('Hours available')}>Hours Available</th>
            <th onClick={() => handleSort('Other')}>Other</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index}>
              <td>{item.Organization}</td>
              <td>
                <a href={item['Service URL']} target="_blank" rel="noopener noreferrer">
                  {item.Service}
                </a>
              </td>
              <td>{item.Description}</td>
              <td>{item['Training required']}</td>
              <td>{item['Minimum age']}</td>
              {/* New columns displayed in the body */}
              <td>{item.Commitment}</td>
              <td>{item['Group size']}</td>
              <td>{item['Hours available']}</td>
              <td>{item.Other}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
