import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Table.css'; // Import the CSS file

const Table = () => {
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

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
    
    // Sort data based on the field and order
    const sortedData = [...data].sort((a, b) => {
        if (field === 'minimum_age') {
            // Convert to integers for sorting
            return order === 'asc'
                ? parseInt(a[field], 10) - parseInt(b[field], 10)
                : parseInt(b[field], 10) - parseInt(a[field], 10);
        } else {
            // For other fields, sort as usual (assuming they are strings)
            return order === 'asc'
                ? a[field].localeCompare(b[field])
                : b[field].localeCompare(a[field]);
        }
    });
    
    setSortField(field);
    setSortOrder(order);
    setData(sortedData); // Update the state with the sorted data
  };

  // const sortedData = [...data].sort((a, b) => {
  //   if (sortField) {
  //     if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
  //     if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
  //   }
  //   return 0;
  // });

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => handleSort('Organization')}>Organization</th>
          <th onClick={() => handleSort('Service')}>Service</th>
          <th onClick={() => handleSort('Training required')}>Training Required</th>
          <th onClick={() => handleSort('Minimum age')}>Minimum Age</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item, index) => (
          <tr key={index}>
            <td>{item.Organization}</td>
            <td>{item.Service}</td>
            <td>{item['Training required']}</td>
            <td>{item['Minimum age']}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
