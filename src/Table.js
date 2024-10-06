import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Table.css'; // Import the CSS file

const Table = () => {
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterRecommendedFor, setFilterRecommendedFor] = useState('all'); // New state for filter

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

  // Filter data based on "Recommended for" field
  const filteredData = data.filter((item) => {
    if (filterRecommendedFor === 'all') return true; // No filter applied
    if (filterRecommendedFor === 'families') return item['Recommended for'].toLowerCase() === 'families';
    if (filterRecommendedFor === 'individuals') return item['Recommended for'].toLowerCase() === 'individuals';
    if (filterRecommendedFor === 'individuals (daytime)') return item['Recommended for'].toLowerCase() === 'individuals (daytime)';
    if (filterRecommendedFor === 'individuals (evening/weekend)') return item['Recommended for'].toLowerCase() === 'individuals (evening/weekend)';
    if (filterRecommendedFor === 'groups (any age)') return item['Recommended for'].toLowerCase() === 'groups (any age)';
    if (filterRecommendedFor === 'groups (youth or adult)') return item['Recommended for'].toLowerCase() === 'groups (youth or adult)';
    return true;
  });

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField) {
      if (sortField === 'Minimum age') {
        const aValue = a[sortField] ? parseInt(a[sortField], 10) : Infinity;
        const bValue = b[sortField] ? parseInt(b[sortField], 10) : Infinity;
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
      <label htmlFor="filter">Filter to recommended for: </label>
      <select id="filter" value={filterRecommendedFor} onChange={(e) => setFilterRecommendedFor(e.target.value)}>
        <option value="all">All</option>
        <option value="families">families</option>
        <option value="individuals">individuals</option>
        <option value="individuals (daytime)">individuals (daytime)</option>
        <option value="individuals (evenings/weekends)">individuals (evenings/weekends)</option>
        <option value="groups (any age)">groups (any age)</option>
        <option value="groups (youth or adult)">groups (youth or adult)</option>
      </select>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('Organization')}>Organization</th>
            <th onClick={() => handleSort('Service')}>Service</th>
            <th onClick={() => handleSort('Description')}>Description</th>
            <th onClick={() => handleSort('Training required')}>Training Required</th>
            <th onClick={() => handleSort('Minimum age')}>Minimum Age</th>
            <th onClick={() => handleSort('Commitment')}>Commitment</th>
            <th onClick={() => handleSort('Group size')}>Group Size</th>
            <th onClick={() => handleSort('Hours available')}>Hours Available</th>
            <th onClick={() => handleSort('Other')}>Other</th>
            <th onClick={() => handleSort('Recommended for')}>Recommended for</th>
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
              <td>{item.Commitment}</td>
              <td>{item['Group size']}</td>
              <td>{item['Hours available']}</td>
              <td>{item.Other}</td>
              <td>{item['Recommended for']}</td>              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
