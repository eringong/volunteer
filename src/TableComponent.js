import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, useFilters, useGlobalFilter} from 'react-table';
import Papa from 'papaparse';
import Select, { components } from 'react-select';
import './TableComponent.css';



// Helper function to calculate minimum column width based on header text length
const calculateColumnWidth = (headerText, padding = 20) => {
  return headerText.length * 12 + padding;
};

// Custom multi-select dropdown with checkboxes
const CheckboxOption = ({ children, ...props }) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
        style={{ marginRight: 8 }}
      />
      {children}
    </components.Option>
  );
};

// Refined styles for React Select to remove extra boxes or borders
const customStyles = {
  control: (base) => ({
    ...base,
    minHeight: '35px', // Match the height of the input boxes
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxShadow: 'none', // Remove the shadow effect
    width: '100%', // Ensure the width matches the input boxes
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '2px 8px', // Adjust padding to match the input box style
  }),
  input: (base) => ({
    ...base,
    margin: '0px', // Remove margin from the input element
    padding: '0px', // Remove padding from the input element
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '0px 8px', // Match dropdown arrow padding
  }),
  option: (provided) => ({
    ...provided,
    textAlign: 'left',
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: '0px', // Remove unwanted top margin
    borderRadius: '0 0 5px 5px', // Match border radius for dropdown
  }),
  indicatorSeparator: () => ({
    display: 'none', // Remove the vertical separator line in the dropdown
  }),
};

// Multi-select filter with checkboxes and left-aligned dropdown
const MultiSelectColumnFilter = ({ column: { filterValue = [], setFilter, preFilteredRows, id } }) => {
  const options = useMemo(() => {
    const uniqueOptions = new Set();
    preFilteredRows.forEach((row) => {
      uniqueOptions.add(row.values[id]);
    });
    return [...uniqueOptions].map((option) => ({ value: option, label: option }));
  }, [id, preFilteredRows]);

  const handleChange = (selectedOptions) => {
    setFilter(selectedOptions.map((option) => option.value) || []);
  };

  // Show a custom placeholder when filters are applied
  const customPlaceholder = filterValue.length > 0 ? "Filters Applied" : "Filter...";


  return (
    <div
      onClick={(e) => e.stopPropagation()} // Prevent sorting on click
    >
      <Select
        value={filterValue.map((val) => ({ value: val, label: val }))}
        onChange={handleChange}
        options={options}
        isMulti
        components={{ Option: CheckboxOption }} // Add CheckboxOption component here
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        placeholder="Filter..."
        classNamePrefix="react-select"
        styles={customStyles}
      />
    </div>
  );
};



// Custom filter function to handle multi-select filtering
function multiSelectFilterFn(rows, columnIds, filterValue) {
  if (filterValue.length === 0) return rows;
  return rows.filter((row) => {
    const rowValue = row.values[columnIds[0]];
    return filterValue.includes(rowValue);
  });
}

// Tell React Table that this is a custom filter function
multiSelectFilterFn.autoRemove = (val) => !val || val.length === 0;

// Custom sort function to handle integer sorting
const sortNumeric = (rowA, rowB, columnId) => {
  const a = rowA.values[columnId] ? parseInt(rowA.values[columnId], 10) : 0;
  const b = rowB.values[columnId] ? parseInt(rowB.values[columnId], 10) : 0;
  return a > b ? 1 : a < b ? -1 : 0;
};

// Main table component
const TableComponent = () => {
  const [data, setData] = useState([]);
  
  // Add the state variables for the dropdown filters
  const [trainingFilter, setTrainingFilter] = useState([]); // State for Training Required filter
  const [recommendedFilter, setRecommendedFilter] = useState([]); // State for Recommended For filter  

  // Parse CSV data from the public folder
  useEffect(() => {
    fetch('/data.csv') // Fetching the CSV from the public directory
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
          },
        });
      });
  }, []);

  // Define table columns with custom dropdown filters for "Training required" and "Recommended for"
  const columns = useMemo(
    () => [
      {
        Header: 'Organization',
        accessor: 'Organization',
        disableFilters: true, // Disable filters for this column        
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Service',
        accessor: 'Service',
        disableFilters: true, // Disable filters for this column
        Cell: ({ cell: { value }, row: { original } }) => (
          <a href={original['Service URL']} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ),
      },
      {
        Header: 'Description',
        accessor: 'Description',
        disableFilters: true, // Disable filters for this column
        disableSortBy: true, // Disable sorting for this column
      },
      {
        Header: 'Training required',
        accessor: 'Training required',
        disableFilters: true, // Disable filters for this column
        Filter: MultiSelectColumnFilter,
        filter: 'multiSelectFilterFn',
        minWidth: 50,
      },
      {
        Header: 'Minimum age',
        accessor: 'Minimum age',
        sortType: sortNumeric, // Use custom numeric sort function
        disableFilters: true, // Disable filter box for this column
      },
      {
        Header: 'Commitment',
        accessor: 'Commitment',
        disableFilters: true, // Disable filters for this column        
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Max group size',
        accessor: 'Max group size',
        sortType: sortNumeric, // Use custom numeric sort function
        disableFilters: true, // Disable filter box for this column
      },
      {
        Header: 'Hours available',
        accessor: 'Hours available',
        disableFilters: true, // Disable filters for this column
        disableSortBy: true, // Disable sorting for this column
      },
      // {
      //   Header: 'Other',
      //   accessor: 'Other',
      //   disableFilters: true, // Disable filters for this column
      //   disableSortBy: true, // Disable sorting for this column
      // },
      {
        Header: 'Recommended for',
        accessor: 'Recommended for',
        disableFilters: true, // Disable filters for this column
        Filter: MultiSelectColumnFilter,
        filter: 'multiSelectFilterFn',
        minWidth: 150,
      },
    ],
    []
  );

  // Define a default filter UI component
  function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
    return (
      <div
        onClick={(e) => e.stopPropagation()} // Prevent click from triggering sorting
      >
        <input
          value={filterValue || ''}
          onChange={(e) => setFilter(e.target.value || undefined)}
          placeholder={`Search...`}
          className="filter-box"
        />
      </div>
    );
  }


  // Use React Table hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter, // `setFilter` is used for setting individual column filters
    preFilteredRows,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns, // Pass columns definition
      data, // Pass table data
      defaultColumn: { Filter: DefaultColumnFilter }, // Default filter component
      filterTypes: { multiSelectFilterFn }, // Custom filter type
    },
    useFilters, // Hook for column filters
    useGlobalFilter, // Hook for global search
    useSortBy // Hook for sorting
  );

  // Step 3: Helper Function 1 - Extract Unique Options for Dropdowns
  const getUniqueOptions = (rows, id) => {
    const uniqueOptions = new Set();
    rows.forEach((row) => {
      uniqueOptions.add(row.values[id]);
    });
    return [...uniqueOptions].map((option) => ({ value: option, label: option }));
  };

  // Step 3: Helper Function 2 - Set Filters Based on Dropdown Selection
  const setAllFilters = (columnId, selectedValues) => {
    setFilter(columnId, selectedValues.length ? selectedValues : undefined);
  };

  return (
    <div className="container">
      <h2>Volunteer Opportunities Near Salt Lake City</h2>
      <p>
        Explore a variety of volunteer opportunities in the Salt Lake City area. 
        You can sort by column or click on a service opportunity to go to the organization's website.<br /><br />
        Please verify any information here with the organization directly.
      </p>
      
    <div className="filters-container">
      <h3>Filters</h3>
      <div className="filter-row">
        {/* Dropdown Filter for Training Required */}
        <div className="filter-box-container">
          <Select
            value={trainingFilter}
            onChange={(selectedOptions) => {
              setTrainingFilter(selectedOptions || []);
              setAllFilters('Training required', selectedOptions ? selectedOptions.map(option => option.value) : []);
            }}
            options={getUniqueOptions(preFilteredRows, 'Training required')}
            isMulti
            closeMenuOnSelect={false}
            components={{ Option: CheckboxOption }}
            placeholder="Training Required"
            classNamePrefix="react-select"
            styles={customStyles}
          />
        </div>

        {/* Dropdown Filter for Recommended For */}
        <div className="filter-box-container">
          <Select
            value={recommendedFilter}
            onChange={(selectedOptions) => {
              setRecommendedFilter(selectedOptions || []);
              setAllFilters('Recommended for', selectedOptions ? selectedOptions.map(option => option.value) : []);
            }}
            options={getUniqueOptions(preFilteredRows, 'Recommended for')}
            isMulti
            closeMenuOnSelect={false}
            components={{ Option: CheckboxOption }}
            placeholder="Recommended For"
            classNamePrefix="react-select"
            styles={customStyles}
          />
        </div>
      </div>      
    </div>

      <input
        value={state.globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value || undefined)}
        placeholder="Search table ..."
        className="filter-box" // Apply common class to global search
        style={{ marginBottom: '10px', width: '100%' }}
      />

      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps([
                    column.getSortByToggleProps(),
                    {
                      style: { minWidth: column.minWidth || 'auto' }, // Apply the minWidth if defined
                    },
                  ])}
                  key={column.id}
                >
                  <div className="column-header">
                    {column.render('Header')}
                    {/* Always show the sorting arrows */}
                    {!column.disableSortBy && (
                      <span className="sort-arrows">
                        <span className={`arrow ${column.isSorted && !column.isSortedDesc ? 'active' : ''}`}>
                          ▲
                        </span>
                        <span className={`arrow ${column.isSortedDesc ? 'active' : ''}`}>
                          ▼
                        </span>
                      </span>
                    )}
                  </div>
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
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
