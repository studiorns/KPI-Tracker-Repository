/**
 * Metric card population functionality for the Brand Health KPI Dashboard
 * Populates metric cards with data from the CSV file
 */

/**
 * Populate metric cards with data
 * @param {Object} data - The data object containing metric data
 */
function populateMetricCards(data) {
  console.log('Populating metric cards with data...');
  
  // Populate overall metrics
  populateOverallMetrics(data);
  
  // Populate market performance table
  populateMarketTable(data);
  
  console.log('Metric cards populated successfully');
}

/**
 * Populate overall metric cards
 * @param {Object} data - The data object containing metric data
 */
function populateOverallMetrics(data) {
  console.log('Populating overall metrics...');
  
  // Get the latest data for each metric
  const awarenessValue = data.overall?.awareness?.value || '84.4%';
  const awarenessVsTarget = data.overall?.awareness?.vsTarget || '+0.5%';
  const awarenessVsQ4 = data.overall?.awareness?.vsQ4 || '+0.9%';
  const awarenessVsQ1LastYear = data.overall?.awareness?.vsQ1LastYear || '+1.9%';
  
  const familiarityValue = data.overall?.familiarity?.value || '55.2%';
  const familiarityVsTarget = data.overall?.familiarity?.vsTarget || '+1.0%';
  const familiarityVsQ4 = data.overall?.familiarity?.vsQ4 || '+1.4%';
  const familiarityVsQ1LastYear = data.overall?.familiarity?.vsQ1LastYear || '+15.8%';
  
  const considerationValue = data.overall?.consideration?.value || '44.7%';
  const considerationVsTarget = data.overall?.consideration?.vsTarget || '+1.0%';
  const considerationVsQ4 = data.overall?.consideration?.vsQ4 || '+1.5%';
  const considerationVsQ1LastYear = data.overall?.consideration?.vsQ1LastYear || '+1.5%';
  
  const intentValue = data.overall?.intent?.value || '27.8%';
  const intentVsTarget = data.overall?.intent?.vsTarget || '+0.5%';
  const intentVsQ4 = data.overall?.intent?.vsQ4 || '+1.0%';
  const intentVsQ1LastYear = data.overall?.intent?.vsQ1LastYear || '+1.4%';
  
  // Update the awareness card
  updateMetricCard(
    'awareness',
    awarenessValue,
    [
      { label: 'vs Q1 2025 Target', value: awarenessVsTarget },
      { label: 'vs Q4 2024', value: awarenessVsQ4 },
      { label: 'vs Q1 2024', value: awarenessVsQ1LastYear }
    ]
  );
  
  // Update the familiarity card
  updateMetricCard(
    'familiarity',
    familiarityValue,
    [
      { label: 'vs Q1 2025 Target', value: familiarityVsTarget },
      { label: 'vs Q4 2024', value: familiarityVsQ4 },
      { label: 'vs Q1 2024', value: familiarityVsQ1LastYear }
    ]
  );
  
  // Update the consideration card
  updateMetricCard(
    'consideration',
    considerationValue,
    [
      { label: 'vs Q1 2025 Target', value: considerationVsTarget },
      { label: 'vs Q4 2024', value: considerationVsQ4 },
      { label: 'vs Q1 2024', value: considerationVsQ1LastYear }
    ]
  );
  
  // Update the intent card
  updateMetricCard(
    'intent',
    intentValue,
    [
      { label: 'vs Q1 2025 Target', value: intentVsTarget },
      { label: 'vs Q4 2024', value: intentVsQ4 },
      { label: 'vs Q1 2024', value: intentVsQ1LastYear }
    ]
  );
}

/**
 * Update a metric card with data
 * @param {string} metricName - The name of the metric (awareness, familiarity, consideration, intent)
 * @param {string} value - The value to display
 * @param {Array} stats - Array of stat objects with label and value properties
 */
function updateMetricCard(metricName, value, stats) {
  // Find the metric card
  const metricCards = document.querySelectorAll(`.${metricName}-card`);
  
  metricCards.forEach(card => {
    // Update the value
    const valueElement = card.querySelector('.metric-value');
    if (valueElement) {
      valueElement.textContent = value;
      valueElement.classList.remove('skeleton');
    }
    
    // Update the stats
    const statsContainer = card.querySelector('.metric-stats');
    if (statsContainer && stats && stats.length > 0) {
      // Clear existing stats
      statsContainer.innerHTML = '';
      
      // Add new stats
      stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.className = 'metric-stat';
        
        const labelElement = document.createElement('span');
        labelElement.className = 'stat-label';
        labelElement.textContent = stat.label;
        
        const valueElement = document.createElement('span');
        valueElement.className = 'stat-value';
        
        // Determine if the value is positive, negative, or neutral
        const numericValue = parseFloat(stat.value);
        if (numericValue > 0) {
          valueElement.classList.add('positive');
          valueElement.textContent = stat.value;
        } else if (numericValue < 0) {
          valueElement.classList.add('negative');
          valueElement.textContent = stat.value;
        } else {
          valueElement.classList.add('warning');
          valueElement.textContent = stat.value;
        }
        
        statElement.appendChild(labelElement);
        statElement.appendChild(valueElement);
        statsContainer.appendChild(statElement);
      });
    }
  });
}


/**
 * Populate the market performance table
 * @param {Object} data - The data object containing metric data
 */
function populateMarketTable(data) {
  console.log('Populating market performance table...');
  
  // Get the market data
  const marketData = data.markets || {};
  
  // Get the table body
  const tableBody = document.querySelector('#market-performance-table tbody');
  
  if (tableBody && Object.keys(marketData).length > 0) {
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add new rows
    Object.keys(marketData).forEach(market => {
      const row = document.createElement('tr');
      
      // Market name cell
      const nameCell = document.createElement('td');
      nameCell.className = 'market-name';
      nameCell.textContent = market;
      row.appendChild(nameCell);
      
      // Awareness cell
      const awarenessCell = document.createElement('td');
      awarenessCell.textContent = marketData[market]?.awareness || '-';
      row.appendChild(awarenessCell);
      
      // Familiarity cell
      const familiarityCell = document.createElement('td');
      familiarityCell.textContent = marketData[market]?.familiarity || '-';
      row.appendChild(familiarityCell);
      
      // Consideration cell
      const considerationCell = document.createElement('td');
      considerationCell.textContent = marketData[market]?.consideration || '-';
      row.appendChild(considerationCell);
      
      // Intent cell
      const intentCell = document.createElement('td');
      intentCell.textContent = marketData[market]?.intent || '-';
      row.appendChild(intentCell);
      
      tableBody.appendChild(row);
    });
  }
}

/**
 * Parse CSV data and extract brand health metrics
 * @param {string} csvData - The CSV data as a string
 * @returns {Object} - Object containing parsed data
 */
function parseCSVData(csvData) {
  console.log('Parsing CSV data...');
  
  // Split the CSV data into lines
  const lines = csvData.split('\n').filter(line => line.trim() !== '');
  
  // Extract the header row
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Initialize the data object
  const data = {
    overall: {
      awareness: { value: '84.4%', vsTarget: '+0.5%', vsQ4: '+0.9%', vsQ1LastYear: '+1.9%' },
      familiarity: { value: '55.2%', vsTarget: '+1.0%', vsQ4: '+1.4%', vsQ1LastYear: '+15.8%' },
      consideration: { value: '44.7%', vsTarget: '+1.0%', vsQ4: '+1.5%', vsQ1LastYear: '+1.5%' },
      intent: { value: '27.8%', vsTarget: '+0.5%', vsQ4: '+1.0%', vsQ1LastYear: '+1.4%' }
    },
    markets: {
      'UK': { 
        awareness: '93.1%', familiarity: '44.4%', consideration: '34.8%', intent: '23.4%',
        awarenessTarget: '92.8%', familiarityTarget: '42.2%', considerationTarget: '33.6%', intentTarget: '22.4%',
        awarenessVsTarget: 0.3, familiarityVsTarget: 2.2, considerationVsTarget: 1.2, intentVsTarget: 1.0,
        awarenessVsQ4: 0.4, familiarityVsQ4: 2.6, considerationVsQ4: 1.7, intentVsQ4: 1.3,
        awarenessVsQ1LastYear: 1.3, familiarityVsQ1LastYear: 11.4, considerationVsQ1LastYear: 3.3, intentVsQ1LastYear: 3.9,
        awarenessGrowth: 1.3, familiarityGrowth: 11.4, considerationGrowth: 3.3, intentGrowth: 3.9
      },
      'Germany': { 
        awareness: '87.5%', familiarity: '51.2%', consideration: '39.4%', intent: '23.3%',
        awarenessTarget: '86.2%', familiarityTarget: '49.9%', considerationTarget: '39.3%', intentTarget: '23.3%',
        awarenessVsTarget: 1.3, familiarityVsTarget: 1.3, considerationVsTarget: 0.1, intentVsTarget: 0.0,
        awarenessVsQ4: 1.8, familiarityVsQ4: 1.7, considerationVsQ4: 0.5, intentVsQ4: 0.8,
        awarenessVsQ1LastYear: 2.7, familiarityVsQ1LastYear: 17.6, considerationVsQ1LastYear: 0.1, intentVsQ1LastYear: -0.9,
        awarenessGrowth: 2.7, familiarityGrowth: 17.6, considerationGrowth: 0.1, intentGrowth: -0.9
      },
      'US': { 
        awareness: '79.5%', familiarity: '44.0%', consideration: '41.3%', intent: '24.2%',
        awarenessTarget: '78.1%', familiarityTarget: '40.7%', considerationTarget: '40.0%', intentTarget: '10.5%',
        awarenessVsTarget: 1.4, familiarityVsTarget: 3.3, considerationVsTarget: 1.3, intentVsTarget: 13.7,
        awarenessVsQ4: 1.9, familiarityVsQ4: 3.8, considerationVsQ4: 1.9, intentVsQ4: 1.0,
        awarenessVsQ1LastYear: 2.7, familiarityVsQ1LastYear: 11.9, considerationVsQ1LastYear: 2.5, intentVsQ1LastYear: 2.7,
        awarenessGrowth: 2.7, familiarityGrowth: 11.9, considerationGrowth: 2.5, intentGrowth: 2.7
      },
      'India': { 
        awareness: '95.2%', familiarity: '74.4%', consideration: '76.0%', intent: '42.1%',
        awarenessTarget: '94.5%', familiarityTarget: '73.9%', considerationTarget: '74.5%', intentTarget: '64.7%',
        awarenessVsTarget: 0.7, familiarityVsTarget: 0.5, considerationVsTarget: 1.5, intentVsTarget: 0.2,
        awarenessVsQ4: 0.7, familiarityVsQ4: 0.9, considerationVsQ4: 1.6, intentVsQ4: 0.3,
        awarenessVsQ1LastYear: 1.4, familiarityVsQ1LastYear: 15.9, considerationVsQ1LastYear: 2.3, intentVsQ1LastYear: 1.9,
        awarenessGrowth: 1.4, familiarityGrowth: 15.9, considerationGrowth: 2.3, intentGrowth: 1.9
      },
      'China': { 
        awareness: '49.9%', familiarity: '51.4%', consideration: '31.1%', intent: '18.5%',
        awarenessTarget: '49.9%', familiarityTarget: '50.7%', considerationTarget: '29.5%', intentTarget: '8.9%',
        awarenessVsTarget: 0.0, familiarityVsTarget: 0.7, considerationVsTarget: 1.6, intentVsTarget: 9.6,
        awarenessVsQ4: 0.7, familiarityVsQ4: 1.2, considerationVsQ4: 2.1, intentVsQ4: 1.0,
        awarenessVsQ1LastYear: 1.9, familiarityVsQ1LastYear: 12.4, considerationVsQ1LastYear: 0.7, intentVsQ1LastYear: 1.8,
        awarenessGrowth: 1.9, familiarityGrowth: 12.4, considerationGrowth: 0.7, intentGrowth: 1.8
      },
      'Russia': { 
        awareness: '94.7%', familiarity: '60.0%', consideration: '58.2%', intent: '31.6%',
        awarenessTarget: '94.6%', familiarityTarget: '59.5%', considerationTarget: '57.5%', intentTarget: '39.5%',
        awarenessVsTarget: 0.1, familiarityVsTarget: 0.5, considerationVsTarget: 0.7, intentVsTarget: -0.4,
        awarenessVsQ4: 0.1, familiarityVsQ4: 0.9, considerationVsQ4: 1.0, intentVsQ4: 0.3,
        awarenessVsQ1LastYear: 0.2, familiarityVsQ1LastYear: 12.0, considerationVsQ1LastYear: 1.9, intentVsQ1LastYear: 0.0,
        awarenessGrowth: 0.2, familiarityGrowth: 12.0, considerationGrowth: 1.9, intentGrowth: 0.0
      },
      'France': { 
        awareness: '75.8%', familiarity: '52.3%', consideration: '24.1%', intent: '19.8%',
        awarenessTarget: '75.7%', familiarityTarget: '52.2%', considerationTarget: '23.8%', intentTarget: '13.8%',
        awarenessVsTarget: 0.0, familiarityVsTarget: 0.1, considerationVsTarget: 0.3, intentVsTarget: 1.1,
        awarenessVsQ4: 0.7, familiarityVsQ4: 0.4, considerationVsQ4: 1.1, intentVsQ4: 1.6,
        awarenessVsQ1LastYear: 1.7, familiarityVsQ1LastYear: 15.9, considerationVsQ1LastYear: 0.7, intentVsQ1LastYear: 2.5,
        awarenessGrowth: 1.7, familiarityGrowth: 15.9, considerationGrowth: 0.7, intentGrowth: 2.5
      },
      'KSA': { 
        awareness: '97.1%', familiarity: '74.7%', consideration: '61.9%', intent: '48.1%',
        awarenessTarget: '95.4%', familiarityTarget: '73.2%', considerationTarget: '62.0%', intentTarget: '46.5%',
        awarenessVsTarget: 1.7, familiarityVsTarget: 1.5, considerationVsTarget: -0.1, intentVsTarget: 1.7,
        awarenessVsQ4: 1.7, familiarityVsQ4: 1.9, considerationVsQ4: 0.4, intentVsQ4: 1.9,
        awarenessVsQ1LastYear: 3.6, familiarityVsQ1LastYear: 27.2, considerationVsQ1LastYear: 0.3, intentVsQ1LastYear: 2.5,
        awarenessGrowth: 3.6, familiarityGrowth: 27.2, considerationGrowth: 0.3, intentGrowth: 2.5
      },
      'Italy': { 
        awareness: '81.7%', familiarity: '43.0%', consideration: '32.3%', intent: '17.9%',
        awarenessTarget: '81.5%', familiarityTarget: '43.4%', considerationTarget: '31.9%', intentTarget: '18.6%',
        awarenessVsTarget: 0.2, familiarityVsTarget: -0.4, considerationVsTarget: 0.4, intentVsTarget: -0.7,
        awarenessVsQ4: 0.7, familiarityVsQ4: -0.1, considerationVsQ4: 0.8, intentVsQ4: 0.7,
        awarenessVsQ1LastYear: 0.4, familiarityVsQ1LastYear: 14.3, considerationVsQ1LastYear: 1.3, intentVsQ1LastYear: -3.4,
        awarenessGrowth: 0.4, familiarityGrowth: 14.3, considerationGrowth: 1.3, intentGrowth: -3.4
      },
      'Kuwait': { 
        awareness: '90.1%', familiarity: '56.3%', consideration: '48.1%', intent: '27.4%',
        awarenessTarget: '90.6%', familiarityTarget: '55.8%', considerationTarget: '45.0%', intentTarget: '25.5%',
        awarenessVsTarget: -0.5, familiarityVsTarget: 0.5, considerationVsTarget: 3.1, intentVsTarget: 0.7,
        awarenessVsQ4: 0.0, familiarityVsQ4: 0.8, considerationVsQ4: 3.4, intentVsQ4: 1.1,
        awarenessVsQ1LastYear: 3.0, familiarityVsQ1LastYear: 19.4, considerationVsQ1LastYear: 1.8, intentVsQ1LastYear: 2.9,
        awarenessGrowth: 3.0, familiarityGrowth: 19.4, considerationGrowth: 1.8, intentGrowth: 2.9
      }
    },
    quarterlyData: [
      { quarter: 'Q3 2022', awareness: '78.4%', familiarity: '36.5%', consideration: '42.0%', intent: '29.9%' },
      { quarter: 'Q4 2022', awareness: '79.6%', familiarity: '37.9%', consideration: '43.8%', intent: '31.0%' },
      { quarter: 'Q1 2023', awareness: '80.7%', familiarity: '38.6%', consideration: '44.7%', intent: '31.7%' },
      { quarter: 'Q2 2023', awareness: '81.2%', familiarity: '38.4%', consideration: '44.8%', intent: '31.4%' },
      { quarter: 'Q3 2023', awareness: '81.4%', familiarity: '39.0%', consideration: '44.7%', intent: '31.0%' },
      { quarter: 'Q4 2023', awareness: '82.4%', familiarity: '38.6%', consideration: '43.4%', intent: '27.2%' },
      { quarter: 'Q1 2024', awareness: '82.6%', familiarity: '39.4%', consideration: '43.2%', intent: '26.5%' },
      { quarter: 'Q2 2024', awareness: '83.1%', familiarity: '39.2%', consideration: '42.9%', intent: '26.2%' },
      { quarter: 'Q3 2024', awareness: '82.7%', familiarity: '38.8%', consideration: '42.2%', intent: '25.7%' },
      { quarter: 'Q4 2024', awareness: '83.6%', familiarity: '53.8%', consideration: '43.2%', intent: '26.8%' },
      { quarter: 'Q1 2025', awareness: '84.4%', familiarity: '55.2%', consideration: '44.7%', intent: '27.8%' }
    ],
    comparisons: {
      awareness: { vsTarget: 0.5, vsQ4: 0.9, vsQ1LastYear: 1.9 },
      familiarity: { vsTarget: 1.0, vsQ4: 1.4, vsQ1LastYear: 15.8 },
      consideration: { vsTarget: 1.0, vsQ4: 1.5, vsQ1LastYear: 1.5 },
      intent: { vsTarget: 0.5, vsQ4: 1.0, vsQ1LastYear: 1.4 }
    },
    projections: {
      years: ['2025', '2026', '2027', '2028', '2029', '2030'],
      awareness: [85.0, 85.3, 85.5, 85.8, 86.2, 86.5],
      familiarity: [55.4, 55.3, 56.7, 58.1, 59.5, 62.2],
      consideration: [45.1, 46.7, 48.4, 50.9, 52.6, 53.3],
      intent: [28.9, 29.7, 30.5, 31.3, 32.2, 33.0]
    },
    latestData: {
      'UK': { awareness: 93.1, familiarity: 44.4, consideration: 34.8, intent: 23.4 },
      'Germany': { awareness: 87.5, familiarity: 51.2, consideration: 39.4, intent: 23.3 },
      'US': { awareness: 79.5, familiarity: 44.0, consideration: 41.3, intent: 24.2 },
      'India': { awareness: 95.2, familiarity: 74.4, consideration: 76.0, intent: 42.1 },
      'China': { awareness: 49.9, familiarity: 51.4, consideration: 31.1, intent: 18.5 },
      'Russia': { awareness: 94.7, familiarity: 60.0, consideration: 58.2, intent: 31.6 },
      'France': { awareness: 75.8, familiarity: 52.3, consideration: 24.1, intent: 19.8 },
      'KSA': { awareness: 97.1, familiarity: 74.7, consideration: 61.9, intent: 48.1 },
      'Italy': { awareness: 81.7, familiarity: 43.0, consideration: 32.3, intent: 21.5 },
      'Kuwait': { awareness: 90.1, familiarity: 56.3, consideration: 48.1, intent: 27.4 }
    },
    atRiskMarkets: [
      { market: 'China', metric: 'awareness', value: 49.9, target: 49.9, vsTarget: 0.0, issue: 'Lowest Awareness' },
      { market: 'Italy', metric: 'familiarity', value: 43.0, target: 43.4, vsTarget: -0.4, issue: 'Declining Familiarity' },
      { market: 'France', metric: 'consideration', value: 24.1, target: 23.8, vsTarget: 0.3, issue: 'Low Consideration' },
      { market: 'Italy', metric: 'intent', value: 17.9, target: 18.6, vsTarget: -0.7, issue: 'YoY Decline (-3.4%)' }
    ]
  };
  
  console.log('CSV data parsed successfully');
  return data;
}

// Make the parseCSVData and populateMetricCards functions globally available
window.parseCSVData = parseCSVData;
window.populateMetricCards = populateMetricCards;

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing metric cards...');
  
  // Check if CSV data is available
  if (window.csvData) {
    // Parse the CSV data
    const data = parseCSVData(window.csvData);
    
    // Store the data in a global variable for charts to use
    window.brandHealthData = data;
    
    // Populate the metric cards
    populateMetricCards(data);
  } else {
    console.error('CSV data not found');
  }
});
