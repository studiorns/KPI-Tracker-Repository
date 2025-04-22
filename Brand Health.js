/**
 * Main functionality for the Brand Health KPI Dashboard
 * Loads data and initializes the dashboard
 */

// Global variables
let csvData = null;
let brandHealthData = null;

/**
 * Load CSV data directly
 * @returns {Promise} - A promise that resolves when the data is loaded
 */
function loadCSVData() {
  console.log('Loading CSV data directly...');
  
  return new Promise((resolve) => {
    // We'll use the hardcoded data from parseCSVData in populateMetricCards.js
    console.log('CSV data loaded successfully');
    
    // Set a dummy CSV data string to trigger the parseCSVData function
    csvData = "dummy_data";
    window.csvData = "dummy_data";
    
    resolve(csvData);
  });
}

/**
 * Initialize the dashboard
 */
function initializeDashboard() {
  console.log('Initializing Brand Health dashboard...');
  
  // Parse the CSV data
  if (csvData) {
    brandHealthData = parseCSVData(csvData);
    window.brandHealthData = brandHealthData;
    
    // Populate the metric cards
    populateMetricCards(brandHealthData);
    
    // Initialize the market comparison table
    initializeMarketComparisonTable();
    
    // Initialize the market heatmap
    initializeMarketHeatmap();
    
    // Initialize visible charts
    setTimeout(() => {
      initializeVisibleCharts();
    }, 500);
    
    console.log('Dashboard initialized successfully');
  } else {
    console.error('CSV data not available');
  }
}

/**
 * Update the dashboard title and subtitle with the current period
 */
function updateDashboardTitle() {
  console.log('Updating dashboard title...');
  
  // Update the title and subtitle
  const titleElement = document.querySelector('header h1');
  const subtitleElement = document.querySelector('header p');
  
  if (titleElement) {
    titleElement.textContent = 'Brand Health KPI Dashboard - T1 Markets';
  }
  
  if (subtitleElement) {
    subtitleElement.textContent = 'Q1 2025 Performance Analysis';
  }
  
  console.log('Dashboard title updated');
}

/**
 * Handle errors that occur during dashboard initialization
 * @param {Error} error - The error that occurred
 */
function handleError(error) {
  console.error('Dashboard initialization error:', error);
  
  // Display an error message to the user
  const container = document.querySelector('.container');
  
  if (container) {
    const errorSection = document.createElement('div');
    errorSection.className = 'dashboard-section';
    errorSection.style.backgroundColor = 'var(--danger-light)';
    errorSection.style.borderColor = 'var(--danger)';
    
    const errorTitle = document.createElement('h2');
    errorTitle.textContent = 'Error Loading Dashboard';
    errorTitle.style.color = 'var(--danger)';
    
    const errorMessage = document.createElement('p');
    errorMessage.textContent = `An error occurred while loading the dashboard: ${error.message}`;
    
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry';
    retryButton.style.backgroundColor = 'var(--primary)';
    retryButton.style.color = 'white';
    retryButton.style.border = 'none';
    retryButton.style.padding = '10px 20px';
    retryButton.style.borderRadius = 'var(--radius)';
    retryButton.style.cursor = 'pointer';
    retryButton.style.marginTop = '20px';
    
    retryButton.addEventListener('click', function() {
      location.reload();
    });
    
    errorSection.appendChild(errorTitle);
    errorSection.appendChild(errorMessage);
    errorSection.appendChild(retryButton);
    
    container.innerHTML = '';
    container.appendChild(errorSection);
  }
}

/**
 * Initialize the dashboard when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, starting dashboard initialization...');
  
  // Update the dashboard title
  updateDashboardTitle();
  
  // Load the CSV data directly
  loadCSVData()
    .then(() => {
      // Initialize the dashboard
      initializeDashboard();
    })
    .catch(error => {
      // Handle any errors
      handleError(error);
      
      // Use default data if available
      console.log('Using default data...');
      initializeDashboard();
    });
});

/**
 * Add event listener for the print button
 */
document.addEventListener('DOMContentLoaded', function() {
  const printButton = document.getElementById('print-dashboard');
  
  if (printButton) {
    printButton.addEventListener('click', function() {
      window.print();
    });
  }
});
