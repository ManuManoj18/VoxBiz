import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import TextField from '@mui/material/TextField';
import DownloadIcon from '@mui/icons-material/Download';
import { Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import MicOffIcon from '@mui/icons-material/MicOff';
import BarChartIcon from '@mui/icons-material/BarChart';
import DialogActions from '@mui/material/DialogActions';
import MicIcon from '@mui/icons-material/Mic';
import {ButtonBase} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import EmailIcon from '@mui/icons-material/Email';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import FormGroup from '@mui/material/FormGroup';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import EmailDataModal from '../components/EmailDataModal';
import ScheduleEmailModal from '../components/ScheduleEmail';
import { API_BASE_URL } from '../lib/api';

function createData(id, name, calories, fat, carbs, protein) {
  return { id, name, calories, fat, carbs, protein };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Generate table headers dynamically based on the first data row
// Add this if your generateHeadCells function is missing or not working
const generateHeadCells = (data, translations) => {
  if (!data || data.length === 0) return [];
  
  // Get first row to extract column names
  const firstRow = data[0];
  return Object.keys(firstRow)
    .filter(key => key !== 'id')
    .map(key => ({
      id: key,
      numeric: typeof firstRow[key] === 'number',
      disablePadding: false,
      label: translations[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
    }));
};

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;
  
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell 
          padding="checkbox"
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            color: 'white'
          }}
        >
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all items',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              color: 'white',
              fontWeight: 600
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{
                '&.MuiTableSortLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '&.MuiTableSortLabel-root.Mui-active': {
                  color: 'white',
                },
                '& .MuiTableSortLabel-icon': {
                  color: 'rgba(255, 255, 255, 0.5) !important',
                }
              }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


function EnhancedTableToolbar(props) {
  const { 
    numSelected, 
    title, 
    onSearch, 
    searchQuery, 
    setSearchQuery, 
    translations,
    onFilter,
    filterOptions
  } = props;
  
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterSelections, setFilterSelections] = useState({});

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterApply = () => {
    onFilter(filterSelections);
    handleFilterClose();
  };

  const handleFilterChange = (category, value) => {
    setFilterSelections(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const filterOpen = Boolean(filterAnchorEl);

  // Use the title from props or translations, with a fallback
  const displayTitle = title || (translations && translations.title) || 'Data Table';

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          py: 1, 
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
        {
          bgcolor: numSelected > 0 ? 
            'rgba(144, 202, 249, 0.16)' : 
            'rgb(18, 18, 18)',
          color: 'white'
        }
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 30%', fontWeight: 600 }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {displayTitle}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
        <Paper
          component="form"
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.12)',
          }}
          elevation={1}
        >
          <InputBase
            sx={{ 
              ml: 1, 
              flex: 1, 
              color: 'white',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
              }
            }}
            placeholder={translations?.search || "Search..."}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon sx={{ color: 'white' }} />
          </IconButton>
        </Paper>
      </Box>

      {numSelected > 0 ? (
        <Tooltip title={translations?.delete || "Delete"}>
          <IconButton>
            <DeleteIcon sx={{ color: 'white' }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={translations?.filter || "Filter list"}>
          <IconButton onClick={handleFilterClick}>
            <FilterListIcon sx={{ color: 'white' }} />
          </IconButton>
        </Tooltip>
      )}

      <Popover
        open={filterOpen}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
      <Box
  sx={{
    p: 2,
    width: 250,
    bgcolor: 'rgba(18, 18, 18, 0.9)',
    color: 'white',
    borderRadius: 2,
    boxShadow: 3,
  }}
>
  <Typography variant="h6" sx={{ mb: 2 }}>
    {translations?.filterOptions || "Filter Options"}
  </Typography>

  {filterOptions && Object.keys(filterOptions).map((category) => (
    <Box key={category} sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, color: 'white' }}
      >
        {category}
      </Typography>
      <FormGroup>
        {filterOptions[category].map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={filterSelections[category] === option}
                onChange={() => handleFilterChange(category, option)}
                sx={{
                  color: 'white',
                  '&.Mui-checked': {
                    color: '#90caf9',
                  },
                }}
              />
            }
            label={option}
            sx={{ color: 'white' }}
          />
        ))}
      </FormGroup>
    </Box>
  ))}

  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
    <Button onClick={handleFilterClose} sx={{ mr: 1, color: '#90caf9' }}>
      {translations?.cancel || "Cancel"}
    </Button>
    <Button
      onClick={handleFilterApply}
      variant="contained"
      color="primary"
    >
      {translations?.apply || "Apply"}
    </Button>
  </Box>
</Box>
      </Popover>
    </Toolbar>
  );
}

export default function DataTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
const [customColumns, setCustomColumns] = useState([]);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [headCells, setHeadCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableTitle, setTableTitle] = useState('');
  const [translations, setTranslations] = useState({});
  const [customQuery, setCustomQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
  });
  const [densePaddingLabel, setDensePaddingLabel] = useState('Dense padding');

  const handleClearHistory = async () => {
    try {
      // Get the database ID from wherever it's available
      const databaseId = location.state?.databaseId || localStorage.getItem('dbId');
      
      if (!databaseId) {
        console.error("No database ID available");
        return;
      }
      
      // Show confirmation dialog
      if (!window.confirm('Are you sure you want to clear your query history?')) {
        return;
      }
      
      // Call the backend API to delete history
  const response = await fetch(`${API_BASE_URL}/api/databases/${databaseId}/history`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to clear history: ${response.status}`);
      }
      
      // Clear local state
      setQueryHistory([]);
      
      // Clear from localStorage too
      localStorage.removeItem('queryHistory');
      
      // Optionally show a success notification
      if (typeof showNotification === 'function') {
        showNotification('Query history cleared successfully', 'success');
      }
    } catch (error) {
      console.error("Error clearing history:", error);
      
      // Optionally show an error notification
      if (typeof showNotification === 'function') {
        showNotification('Failed to clear history', 'error');
      }
    }
  };

  const handleDownloadCSV= () => {
    try {
      // Create CSV from filtered rows (current view data)
      const headers = Object.keys(filteredRows[0] || {}).filter(key => 
        customColumns && customColumns.length > 0 
          ? customColumns.includes(key) 
          : true
      ).join(',');
      
      const csvRows = filteredRows.map(row => {
        return Object.keys(row)
          .filter(key => 
            customColumns && customColumns.length > 0 
              ? customColumns.includes(key) 
              : true
          )
          .map(key => {
            // Handle CSV special characters
            let cellValue = row[key];
            
            // Convert to string and handle nulls/undefined
            cellValue = cellValue === null || cellValue === undefined ? '' : String(cellValue);
            
            // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
            if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
              cellValue = '"' + cellValue.replace(/"/g, '""') + '"';
            }
            
            return cellValue;
          })
          .join(',');
      });
      
      const csvContent = [headers, ...csvRows].join('\n');
      
      // Create blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${tableTitle.replace(/\s+/g, '_')}_data_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success notification (if you have notification system)
      // setNotification({ open: true, message: 'Download successful', severity: 'success' });
    } catch (error) {
      console.error('Error downloading data:', error);
      // Show error notification (if you have notification system)
      // setNotification({ open: true, message: 'Download failed', severity: 'error' });
    }
  };
  let data;
  // Fetch data from backend
  useEffect(() => {
    const processData = async () => {
      try {
        setLoading(true);
        
        // Use the data passed as prop instead of fetching
         data = location.state?.visualizationData;
        
        if (!data || data.length === 0) {
          console.log("No data received from props");
          // Instead of using sample data, just set empty arrays
          setRows([]);
          setFilteredRows([]);
          setTableTitle('No Data Available');
          
          // Set empty headCells when no data
          setHeadCells([]);
          setCustomColumns([]);
        } else {
          // Process the data passed from props
          const title = 'Visualization Data';
  
          if (window.currentPageTranslationKeys && 
              !window.currentPageTranslationKeys.includes('title')) {
            window.currentPageTranslationKeys.push('title');
          }
    
          if (window.currentPageDefaultTexts) {
            window.currentPageDefaultTexts.title = title;
          }
          
          setRows(data);
          setFilteredRows(data);
          setTableTitle(title);
          
          // Generate head cells dynamically based on data
          const dynamicHeadCells = generateHeadCells(data, translations);
          setHeadCells(dynamicHeadCells);
          setCustomColumns(dynamicHeadCells.map(cell => cell.id));
          
          // Set default orderBy to the first column (after id)
          if (dynamicHeadCells.length > 0) {
            setOrderBy(dynamicHeadCells[0].id);
          }
          
          // Extract filter options from visualization data if they exist
          if (data && data.length > 0) {
            // Find all tag properties in the first data item
            const firstItem = data[0];
            const tagKeys = Object.keys(firstItem?.tags || {});
            
            // Create dynamic filters for each tag type
            const dynamicFilters = {};
            
            tagKeys.forEach(tagKey => {
              // For each tag type, collect all unique values across all data items
              const uniqueValues = [...new Set(
                data
                  .map(item => {
                    const tagValue = item.tags?.[tagKey];
                    // Handle both array and string values
                    return Array.isArray(tagValue) ? tagValue : (tagValue ? [tagValue] : []);
                  })
                  .flat()
                  .filter(Boolean)
              )];
              
              // Only add to filters if values exist
              if (uniqueValues.length > 0) {
                dynamicFilters[tagKey] = uniqueValues;
              }
            });
            
            setFilterOptions(dynamicFilters);
          }
        }
        console.log("Navigating with data:", data);
        setLoading(false);
      } catch (err) {
        setError('Failed to process data');
        setLoading(false);
        console.error('Error processing data:', err);
      }
    };
  
    processData();
  }, [location.state?.visualizationData, translations]);
  useEffect(() => {
    const fetchQueryHistoryFromBackend = async () => {
      try {
        // Get the database ID from wherever it's available in your component
        const databaseId = localStorage.getItem('dbId')
        
        if (!databaseId) {
          console.warn("No database ID available, cannot fetch query history");
          return;
        }
        
  const response = await fetch(`${API_BASE_URL}/api/databases/${databaseId}/history`, {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch query history: ${response.status}`);
        }
        
        const data = await response.json();
        setQueryHistory(data.data);
        
        // Optionally save to localStorage for offline access
        localStorage.setItem('queryHistory', JSON.stringify(data.data));
      } catch (error) {
        console.error("Error fetching query history:", error);
        
        // Fallback to localStorage if API fails
        const savedQueries = localStorage.getItem('queryHistory');
        if (savedQueries) {
          setQueryHistory(JSON.parse(savedQueries));
        }
      }
    };
    
    fetchQueryHistoryFromBackend();
  }); 

useEffect(() => {
    window.currentPageTranslationKeys = [
      'noData', 'search',
      'filter', 'filterOptions', 'apply', 'cancel', 'delete', 
      'rowsPerPage', 'back', 'densePadding'
    ];
    
    window.currentPageDefaultTexts = {

      noData: 'No data found',
      search: 'Search...',
      filter: 'Filter list',
      filterOptions: 'Filter Options',
      apply: 'Apply',
      cancel: 'Cancel',
      delete: 'Delete',
      rowsPerPage: 'Rows per page:',
      back: 'Back',
      densePadding: 'Dense padding'
    };
    
    setDensePaddingLabel(window.currentPageDefaultTexts.densePadding);

    return () => {
      delete window.currentPageTranslationKeys;
      delete window.currentPageDefaultTexts;
    };
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredRows(rows);
      return;
    }
    
    const searchableColumns = headCells.map(cell => cell.id);
    
    const filtered = rows.filter(row => 
      searchableColumns.some(column => {
        const value = row[column];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(query);
        }
        return false;
      })
    );
    
    setFilteredRows(filtered);
    setPage(0);
  };

  const handleFilter = (filterSelections) => {
    // Implement the filter logic here
    console.log("Applying filters:", filterSelections);
    
    // This is just a simple example - modify based on your needs
    let filtered = [...rows];
    
    // Apply actual filters if they were implemented for real data
    // For now just log the selected filters
    
    setFilteredRows(filtered);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleBackClick = () => {
    navigate('/visChoice');
  };
// State variables
const [notExpectedDialogOpen, setNotExpectedDialogOpen] = useState(false);
const [refinementFeedback, setRefinementFeedback] = useState('');
const [currentQuery, setCurrentQuery] = useState('');
const [sidebarOpen, setSidebarOpen] = useState(false); // Default to closed
const [voiceCommandActive, setVoiceCommandActive] = useState(false);
const [transcribedCommand, setTranscribedCommand] = useState('');
const [isListening, setIsListening] = useState(false);
const [transcript, setTranscript] = useState('');
const [message, setMessage] = useState('Click the microphone to start speaking');
const recognitionRef = useRef(null);

// Toggle voice recognition on/off
const toggleVoiceCommand = () => {
  if (voiceCommandActive) {
    stopVoiceRecording();
  } else {
    startVoiceRecording();
  }
  setVoiceCommandActive(!voiceCommandActive);
};

// Start listening to voice input
const startVoiceRecording = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setMessage('Voice recognition is not supported in your browser.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false; // stop after pause
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    setIsListening(true);
    setMessage('Listening... Speak your query');
    setTranscript('');
  };

  recognition.onresult = (event) => {
    const finalTranscript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
      console.log("Final transcript:", finalTranscript);
    setTranscript(finalTranscript);
    setTranscribedCommand(finalTranscript);
    setMessage('Transcription complete. You can submit your query.');
  };

  recognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
    setMessage(`Error: ${event.error}`);
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
    setMessage('Recording stopped.');
  };

  recognition.start(); // 👈 ACTUALLY START RECOGNITION
  recognitionRef.current = recognition;
};

// Stop listening
const stopVoiceRecording = () => {
  if (recognitionRef.current) {
    recognitionRef.current.stop();
    setMessage('Voice input stopped.');
    setIsListening(false);
  }
};
// Process the voice command for query refinement
const processVoiceCommand = async () => {
  if (!transcribedCommand) return;
  
  setLoading(true);
  
  try {
  const response = await fetch(`${API_BASE_URL}/api/query/refine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentQuery: currentQuery || '',
        refinementCommand: transcribedCommand,
        currentResults: rows
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Update current query for potential refinement
    if (result.refinedQuery) {
      setCurrentQuery(result.refinedQuery);
      setCustomQuery(result.refinedQuery);
    }
    
    // Update data if available
    if (result.data) {
      setRows(result.data);
      setFilteredRows(result.data);
      
      // Update head cells if structure changed
      if (result.data.length > 0) {
        const dynamicHeadCells = generateHeadCells(result.data, translations);
        setHeadCells(dynamicHeadCells);
        setCustomColumns(dynamicHeadCells.map(cell => cell.id));
      }
    }
    
    // Add to query history
    setQueryHistory(prev => [transcribedCommand, ...prev.slice(0, 9)]);
    
    // Clear the transcribed command
    setTranscribedCommand('');
    
  } catch (error) {
    console.error("Error processing voice refinement:", error);
    setError("Failed to process voice refinement");
  } finally {
    setLoading(false);
  }
};

// Handle custom query submission
const handleCustomQuerySubmit = async () => {
  if (!customQuery.trim()) return;
  
  setLoading(true);
  
  try {
  const response = await fetch(`${API_BASE_URL}/api/query/custom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: customQuery
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Update current query for potential refinement
    setCurrentQuery(customQuery);
    
    // Update data if available
    if (result.data) {
      setRows(result.data);
      setFilteredRows(result.data);
      
      // Update head cells if structure changed
      if (result.data.length > 0) {
        const dynamicHeadCells = generateHeadCells(result.data, translations);
        setHeadCells(dynamicHeadCells);
      }
    }
    
    // Add to query history
    setQueryHistory(prev => [customQuery, ...prev.slice(0, 9)]);
    
  } catch (error) {
    console.error("Error processing custom query:", error);
    setError("Failed to process custom query");
  } finally {
    setLoading(false);
  }
};

// Handle column toggle in customization
const handleColumnToggle = (event, columnId) => {
  if (event.target.checked) {
    setCustomColumns(prev => [...prev, columnId]);
  } else {
    setCustomColumns(prev => prev.filter(id => id !== columnId));
  }
};

// Handle selecting a query from history
const handleHistoryItemClick = (query) => {
  setCustomQuery(query);
};

// Handle "Not What You Expected" button click
const handleNotWhatYouExpected = () => {
  setNotExpectedDialogOpen(true);
};

// Handle submission of refinement feedback
const handleRefinementSubmit = async () => {
  if (!refinementFeedback.trim()) return;
  
  setLoading(true);
  setNotExpectedDialogOpen(false);
  
  try {
  const response = await fetch(`${API_BASE_URL}/api/query/refine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentQuery: currentQuery || '',
        feedback: refinementFeedback,
        currentResults: rows
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Update query if a new one was generated
    if (result.refinedQuery) {
      setCurrentQuery(result.refinedQuery);
      setCustomQuery(result.refinedQuery);
    }
    
    // Update data if available
    if (result.data) {
      setRows(result.data);
      setFilteredRows(result.data);
      
      // Update head cells if structure changed
      if (result.data.length > 0) {
        const dynamicHeadCells = generateHeadCells(result.data, translations);
        setHeadCells(dynamicHeadCells);
        setCustomColumns(dynamicHeadCells.map(cell => cell.id));
        console.log(result.data.length||0)
      }
    }
    
    // Reset feedback
    setRefinementFeedback('');
    
  } catch (error) {
    console.error("Error processing refinement:", error);
    setError("Failed to refine query");
  } finally {
    setLoading(false);
  }
};

const navigateToGraphView = () => {
  navigate("/rendergraph", { state: { visualizationData: data } });
};

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      filteredRows
        .slice()
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows],
  );
  const {  naturalDescription, reasoning } = location.state || {};

  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupTitle, setPopupTitle] = useState('');

  const handleShowPopup = (type) => {
    if (type === 'description') {
      setPopupTitle('📊 Database Description');
      setPopupContent(naturalDescription || 'No description available.');
    } else if (type === 'reasoning') {
      setPopupTitle('🧠 Query Reasoning');
      setPopupContent(reasoning || 'No reasoning available.');
    }
    setShowInfoPopup(true);
  };

  return ( 
    <Box 
      sx={{ 
        width: '100vw',
        minHeight: '100vh',
        backgroundImage:'url(/table-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',     
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        pt: 0,
        transition: 'background-image 0.3s ease-in-out',
        bgcolor: '#121212',
      }}
    >
      <Navbar />
      <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        {/* Customization Sidebar */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            width: 320,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 320,
              boxSizing: 'border-box',
              bgcolor: '#1E1E1E',
              color: '#FFFFFF',
              borderLeft: '1px solid',
              borderColor: 'rgba(255,255,255,0.12)',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Customizations</Typography>
              <IconButton onClick={() => setSidebarOpen(false)} size="small">
                <CloseIcon sx={{ color: '#FFFFFF' }} />
              </IconButton>
            </Box>
            
            <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.12)' }} />
            
            {/* Custom SQL Query */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Custom SQL Query</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Enter custom SQL query..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 2, 
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  }
                }
              }}
            />
            
            <Button 
              variant="contained"
              color="primary"
              onClick={handleCustomQuerySubmit}
              fullWidth
              sx={{ mb: 2 }}
            >
              Apply Query
            </Button>
            
            <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.12)' }} />
            
            {/* Column Selection */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Display Columns</Typography>
            <FormGroup sx={{ mb: 2 }}>
              {headCells.map((cell) => (
                <FormControlLabel
                  key={cell.id}
                  control={
                    <Checkbox
                      checked={customColumns?.includes(cell.id)}
                      onChange={(e) => handleColumnToggle(e, cell.id)}
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        '&.Mui-checked': {
                          color: 'primary.light',
                        }
                      }}
                    />
                  }
                  label={cell.label}
                  sx={{ color: '#FFFFFF' }}
                />
              ))}
            </FormGroup>
            
            <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.12)' }} />
            
            {/* Voice Commands for Refinement */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Voice Query Refinement</Typography>
            <Button
              variant={voiceCommandActive ? "contained" : "outlined"}
              color={voiceCommandActive ? "error" : "primary"}
              startIcon={voiceCommandActive ? <MicIcon /> : <MicOffIcon />}
              onClick={toggleVoiceCommand}
              fullWidth
              sx={{ mb: 2 }}
            >
              {voiceCommandActive ? "Stop Recording" : "Start Voice Refinement"}
            </Button>
            
            {transcribedCommand && (
              <Paper
                variant="outlined"
                sx={{ 
                  p: 1, 
                  mb: 2, 
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.12)'
                }}
              >
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "{transcribedCommand}"
                </Typography>
              </Paper>
            )}
            
            <Button
              variant="outlined"
              color="primary"
              onClick={processVoiceCommand}
              fullWidth
              disabled={!transcribedCommand}
              sx={{ mb: 2 }}
            >
              Process Voice Refinement
            </Button>
            
            <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.12)' }} />
            
            {/* Query History */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Recent Queries</Typography>
            <Box>
            <List dense sx={{ mb: 2, maxHeight: 150, overflow: 'auto' }}>
  {(Array.isArray(queryHistory) ? queryHistory : []).map((query, index) => (
    <ListItem 
      key={index} 
      disablePadding
      secondaryAction={
        <Tooltip title="Schedule Email">
          <IconButton 
            edge="end" 
            size="small"
            onClick={(e) => handleScheduleClick(query, e)}
          >
            <ScheduleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }
    >
      <ListItemButton onClick={() => handleHistoryItemClick(query)}>
  <ListItemText 
    primary={
      typeof query.query === 'string'
        ? query.query.slice(0, 30) + (query.query.length > 30 ? '...' : '')
        : ''
    }
    sx={{ color: '#FFFFFF' }}
  />
</ListItemButton>
    </ListItem>
  ))}
</List>
  
  <ScheduleEmailModal 
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    query={selectedQuery || ''}
  />
  
  {queryHistory.length > 0 && (
    <Button
      variant="outlined"
      color="error"
      size="small"
      startIcon={<DeleteIcon />}
      onClick={handleClearHistory}
      sx={{ mt: 1 }}
    >
      Clear History
    </Button>
  )}
</Box>
          </Box>
        </Drawer>
        
        {/* Main content */}
        <Paper 
          sx={{ 
            width: '96%',
            margin: '1rem auto',
            mb: 2, 
            bgcolor: 'rgb(18, 18, 18)',
            color: 'white',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out', 
          }}
        >
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <EnhancedTableToolbar 
    numSelected={selected.length} 
    title={translations?.title || tableTitle}
    onSearch={handleSearch}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    translations={translations}
    onFilter={handleFilter}
    filterOptions={filterOptions}
  />

      {/* Buttons to trigger popup */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleShowPopup('description')}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          View Database Description
        </button>
        <button
          onClick={() => handleShowPopup('reasoning')}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          View Query Reasoning
        </button>
      </div>

      {/* The popup itself */}
      {showInfoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-800 text-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
            <button
              onClick={() => setShowInfoPopup(false)}
              className="absolute top-2 right-3 text-xl font-bold text-gray-300 hover:text-red-500"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-4">{popupTitle}</h2>
            <div className="max-h-96 overflow-y-auto whitespace-pre-wrap">
              {popupContent}
            </div>
          </div>
        </div>
      )}

      {/* Render visualization data here */}
      {/* ... */}
  
  {/* Navigation to Graphs Button with persistent text next to icon */}
  <ButtonBase
    onClick={() => navigate("/rendergraph", { state: { visualizationData: data } })}
    sx={{ 
      display: 'flex',
      alignItems: 'center',
      mx: 1,
      p: 1,
      borderRadius: 1,
      color: '#90caf9',
      '&:hover': {
        bgcolor: 'rgba(144, 202, 249, 0.08)'
      }
    }}
  >
    <BarChartIcon sx={{ color: 'white', mr: 1 }} />
    <Typography 
      variant="body2" 
      sx={{ color: 'white' }}
    >
      {translations?.viewGraphs || "View Graphs"}
    </Typography>
  </ButtonBase>
  
  <IconButton 
    onClick={() => setSidebarOpen(!sidebarOpen)}
    sx={{ 
      mr: 2, 
      color: 'white',
      bgcolor: 'action.selected',
      '&:hover': {
        bgcolor: 'action.focus',
      }
    }}
    aria-label="open customization panel"
  >
    <TuneIcon />
  </IconButton>
</Box>
          
          
          <TableContainer sx={{ flexGrow: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : filteredRows.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: 'white' }}>
                {translations.noData || 'No data found'}
              </Typography>
            </Box>
          ) : (
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
  <EnhancedTableHead
    numSelected={selected.length}
    order={order}
    orderBy={orderBy}
    onSelectAllClick={handleSelectAllClick}
    onRequestSort={handleRequestSort}
    rowCount={filteredRows.length}
    headCells={customColumns && customColumns.length > 0 
      ? headCells.filter(cell => customColumns.includes(cell.id)) 
      : headCells}
  />
  <TableBody>
    {visibleRows.map((row, index) => {
      const isItemSelected = isSelected(row.id);
      const labelId = `enhanced-table-checkbox-${index}`;

      return (
        <TableRow
          hover
          onClick={(event) => handleClick(event, row.id)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={row.id}
          selected={isItemSelected}
          sx={{ 
            cursor: 'pointer',
            bgcolor: 'rgb(18, 18, 18)',
            '&.Mui-selected': {
              bgcolor: 'rgba(144, 202, 249, 0.3)',
            },
            '&.Mui-selected:hover': {
              bgcolor: 'rgba(144, 202, 249, 0.4)',
            },
            '&:hover': {
              bgcolor: 'rgba(50, 50, 50, 1)',
            },
          }}
        >
          <TableCell 
            padding="checkbox"
            sx={{ 
              color: 'white',
              borderBottomColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <Checkbox
              color="primary"
              checked={isItemSelected}
              inputProps={{
                'aria-labelledby': labelId,
              }}
            />
          </TableCell>
          
          {(customColumns && customColumns.length > 0 
            ? headCells.filter(headCell => customColumns.includes(headCell.id))
            : headCells).map((headCell, idx) => (
            <TableCell 
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              component={idx === 0 ? 'th' : 'td'}
              id={idx === 0 ? labelId : undefined}
              scope={idx === 0 ? 'row' : undefined}
              padding={idx === 0 && !headCell.disablePadding ? 'none' : 'normal'}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.87)',
                borderBottomColor: 'rgba(255, 255, 255, 0.12)',
                fontWeight: idx === 0 ? 500 : 400,
              }}
            >
              {typeof row[headCell.id] === 'boolean' 
                ? row[headCell.id] ? 'True' : 'False' 
                : row[headCell.id]}
            </TableCell>
          ))}
        </TableRow>
      );
    })}
    {emptyRows > 0 && (
      <TableRow
        style={{
          height: (dense ? 33 : 53) * emptyRows,
        }}
      >
        <TableCell 
          colSpan={(customColumns && customColumns.length > 0 ? customColumns.length : headCells.length) + 1} 
          sx={{ 
            bgcolor: 'rgb(18, 18, 18)',
            borderBottom: 'none',
          }}
        />
      </TableRow>
    )}
  </TableBody>
</Table>
            )}
            {/* Debug display */}
{/* {!loading && !error && filteredRows.length > 0 && (
  <Box sx={{ p: 2, display: 'block' }}> 
    <Typography variant="caption">Data Sample (Debug): </Typography>
    <pre>{JSON.stringify(visibleRows[0], null, 2)}</pre>
  </Box>
)} */}
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ 
              color: 'white',
              '.MuiSvgIcon-root': {
                color: 'white'
              },
              '.MuiTablePagination-selectLabel': {
                color: 'white'
              },
              '.MuiTablePagination-displayedRows': {
                color: 'white'
              },
              '.MuiTablePagination-select': {
                color: 'white'
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
  {/* Dense Padding Toggle */}
  <FormControlLabel
    control={
      <Switch 
        checked={dense} 
        onChange={handleChangeDense} 
        color="primary"
      />
    }
    label={densePaddingLabel}
    sx={{ color: 'white' }}
  />

<Box sx={{ display: 'flex', gap: 2 }}>
  <Button
    variant="outlined"
    color="warning"
    size="small"
    onClick={handleNotWhatYouExpected}
    startIcon={<HelpOutlineIcon />}
  >
    Not What You Expected?
  </Button>

  <Button
    variant="outlined"
    color="warning"
    size="small"
    onClick={handleDownloadCSV}
    startIcon={<DownloadIcon />}
    disabled={filteredRows.length === 0}
  >
    Download CSV
  </Button>
  
  <Button
    variant="outlined"
    color="warning"
    size="small"
    onClick={() => setEmailModalOpen(true)}
    startIcon={<EmailIcon />}
    disabled={filteredRows.length === 0}
  >
    Email Data
  </Button>
</Box>
</Box>

        </Paper>
      </Box>
      <footer className="mt-auto py-4 text-center backdrop-blur-sm bg-black/30">
        <p className="text-sm">© 2025 Data Visualization Platform</p>
      </footer>
      
      {/* Dialog for "Not What You Expected" */}
      <Dialog
        open={notExpectedDialogOpen}
        onClose={() => setNotExpectedDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1E1E1E',
            color: '#FFFFFF',
          }
        }}
      >
        <DialogTitle>
          Refine Your Query
          <IconButton
            onClick={() => setNotExpectedDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Not seeing the results you expected? Describe what you're looking for, and we'll try to improve your query.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            label="What were you looking for?"
            fullWidth
            variant="outlined"
            value={refinementFeedback}
            onChange={(e) => setRefinementFeedback(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.23)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
              }
            }}
          />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Query:</Typography>
          <Paper
            variant="outlined"
            sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.12)',
              fontFamily: 'monospace'
            }}
          >
            <code>{currentQuery || 'No active query'}</code>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotExpectedDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleRefinementSubmit} variant="contained" color="primary">
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
      {/* Email Data Modal */}
<EmailDataModal
  open={emailModalOpen}
  onClose={() => setEmailModalOpen(false)}
  data={filteredRows}
  tableTitle={tableTitle}
/>
    </Box>
  );
}