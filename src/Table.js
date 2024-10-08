import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import Papa from 'papaparse';
import './Table.css'; // Import your CSS file

// A simple text filter function for the header
const DefaultColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value || undefined)} // Set undefined to remove the filter entirely
      placeholder={`Search ${id}`}
    />
  );
};

const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const uniqueOptions = new Set();
    preFilteredRows.forEach((row) => {
      uniqueOptions.add(row.values[id]);
    });
    return [...uniqueOptions];
  }, [id, preFilteredRows]);

  return (
    <select
      value={filterValue}
      onChange={(e) => setFilter(e.target.value || undefined)}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};


const Table = () => {
  const [data, setData] = useState([]);

  // Fetch and parse CSV data
  useEffect(() => {
    fetch('/data.csv') // Adjust the path to your CSV file
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true, // Parse the first row as column names
          skipEmptyLines: true, // Skip empty lines
          complete: (result) => {
            setData(result.data); // Store parsed data
          },
        });
      });
  }, []);

  // Define table columns and setup filters
  const columns = React.useMemo(
    () => [
      {
        Header: 'Organization',
        accessor: 'Organization',
        Filter: DefaultColumnFilter, // Add the default filter
      },
      {
        Header: 'Service',
        accessor: 'Service',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Description',
        accessor: 'Description',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Training Required',
        accessor: 'Training required',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Minimum Age',
        accessor: 'Minimum age',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Commitment',
        accessor: 'Commitment',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Group Size',
        accessor: 'Group size',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Hours Available',
        accessor: 'Hours available',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Other',
        accessor: 'Other',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Recommended For',
        accessor: 'Recommended for',
        Filter: SelectColumnFilter,
      },
    ],
    []
  );

  // Set up react-table instance with sorting and filtering
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter }, // Default filter setup
    },
    useFilters, // Enable filters
    useSortBy // Enable sorting
  );

  return (
    <div>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
