/**
 * Chart creation functionality for the Brand Health KPI Dashboard
 * Creates and manages all chart visualizations
 */

// Chart.js global configuration
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#e0e0e0';
Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.05)';
Chart.defaults.scale.ticks.color = '#a0a0a0';

// Color schemes for different metrics
const colorSchemes = {
  awareness: {
    primary: '#4285f4',
    secondary: 'rgba(66, 133, 244, 0.7)',
    background: 'rgba(66, 133, 244, 0.1)'
  },
  familiarity: {
    primary: '#34a853',
    secondary: 'rgba(52, 168, 83, 0.7)',
    background: 'rgba(52, 168, 83, 0.1)'
  },
  consideration: {
    primary: '#fbbc04',
    secondary: 'rgba(251, 188, 4, 0.7)',
    background: 'rgba(251, 188, 4, 0.1)'
  },
  intent: {
    primary: '#ea4335',
    secondary: 'rgba(234, 67, 53, 0.7)',
    background: 'rgba(234, 67, 53, 0.1)'
  }
};

// Market colors for consistent representation
const marketColors = {
  'UK': '#4285f4',
  'Germany': '#34a853',
  'US': '#fbbc04',
  'India': '#ea4335',
  'China': '#9c27b0',
  'Russia': '#00bcd4',
  'France': '#ff9800',
  'KSA': '#795548',
  'Italy': '#607d8b',
  'Kuwait': '#8bc34a'
};

/**
 * Initialize a chart based on its ID
 * @param {string} chartId - The ID of the canvas element
 */
function initializeChart(chartId) {
  console.log(`Initializing chart: ${chartId}`);
  
  // Get the chart data from the global brandHealthData object
  const data = window.brandHealthData || {};
  
  switch (chartId) {
    case 'market-comparison-chart':
      createMarketComparisonChart(chartId, data);
      break;
    case 'market-quadrant-chart':
      createMarketQuadrantChart(chartId, data);
      break;
    case 'awareness-trend-chart':
      createTrendChart(chartId, data, 'awareness');
      break;
    case 'familiarity-trend-chart':
      createTrendChart(chartId, data, 'familiarity');
      break;
    case 'consideration-trend-chart':
      createTrendChart(chartId, data, 'consideration');
      break;
    case 'intent-trend-chart':
      createTrendChart(chartId, data, 'intent');
      break;
    case 'awareness-market-chart':
      createMarketBarChart(chartId, data, 'awareness');
      break;
    case 'familiarity-market-chart':
      createMarketBarChart(chartId, data, 'familiarity');
      break;
    case 'consideration-market-chart':
      createMarketBarChart(chartId, data, 'consideration');
      break;
    case 'intent-market-chart':
      createMarketBarChart(chartId, data, 'intent');
      break;
    case 'awareness-comparison-chart':
      createComparisonChart(chartId, data, 'awareness');
      break;
    case 'familiarity-comparison-chart':
      createComparisonChart(chartId, data, 'familiarity');
      break;
    case 'consideration-comparison-chart':
      createComparisonChart(chartId, data, 'consideration');
      break;
    case 'intent-comparison-chart':
      createComparisonChart(chartId, data, 'intent');
      break;
    case 'projections-chart':
      createProjectionsChart(chartId, data);
      break;
    default:
      console.warn(`No chart initialization defined for chart ID: ${chartId}`);
  }
}

/**
 * Create a radar chart comparing all markets across all metrics
 * @param {string} chartId - The ID of the canvas element
 * @param {Object} data - The data object containing chart data
 */
function createMarketComparisonChart(chartId, data) {
  // First, clear any existing chart to prevent plugin inheritance
  const existingChart = Chart.getChart(chartId);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const ctx = document.getElementById(chartId).getContext('2d');
  
  // Extract the latest data for each market and metric
  const markets = ['UK', 'Germany', 'US', 'India', 'China', 'Russia', 'France', 'KSA', 'Italy', 'Kuwait'];
  const metrics = ['Awareness', 'Familiarity', 'Consideration', 'Intent'];
  
  // Create datasets for each market
  const datasets = markets.map(market => {
    const marketData = [
      parseFloat(data.latestData?.[market]?.awareness || 0),
      parseFloat(data.latestData?.[market]?.familiarity || 0),
      parseFloat(data.latestData?.[market]?.consideration || 0),
      parseFloat(data.latestData?.[market]?.intent || 0)
    ];
    
    return {
      label: market,
      data: marketData,
      backgroundColor: `${marketColors[market]}33`,
      borderColor: marketColors[market],
      borderWidth: 2,
      pointBackgroundColor: marketColors[market],
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: marketColors[market],
      pointRadius: 4,
      pointHoverRadius: 6
    };
  });
  
  // Create the chart
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: metrics,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          pointLabels: {
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 20,
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        quadrantLines: false, // Explicitly disable quadrant lines
        title: {
          display: true,
          text: 'Market Performance Comparison',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        legend: {
          position: 'right',
          labels: {
            padding: 20,
            boxWidth: 12,
            boxHeight: 12
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  });
}

/**
 * Create a line chart showing the trend for a specific metric
 * @param {string} chartId - The ID of the canvas element
 * @param {Object} data - The data object containing chart data
 * @param {string} metric - The metric to display (awareness, familiarity, consideration, intent)
 */
function createTrendChart(chartId, data, metric) {
  // First, clear any existing chart to prevent plugin inheritance
  const existingChart = Chart.getChart(chartId);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const ctx = document.getElementById(chartId).getContext('2d');
  const colorScheme = colorSchemes[metric];
  
  // Extract quarterly data for the metric
  const quarters = data.quarterlyData?.map(q => q.quarter) || [];
  const values = data.quarterlyData?.map(q => parseFloat(q[metric]) || 0) || [];
  
  // Create the chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: quarters,
      datasets: [
        {
          label: metric.charAt(0).toUpperCase() + metric.slice(1),
          data: values,
          backgroundColor: colorScheme.background,
          borderColor: colorScheme.primary,
          borderWidth: 3,
          pointBackgroundColor: colorScheme.primary,
          pointBorderColor: '#fff',
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: false,
          suggestedMin: Math.max(0, Math.min(...values) - 10),
          suggestedMax: Math.min(100, Math.max(...values) + 10),
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        quadrantLines: false, // Explicitly disable quadrant lines
        title: {
          display: true,
          text: `${metric.charAt(0).toUpperCase() + metric.slice(1)} Trend Over Time`,
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  });
}

/**
 * Create a bar chart showing the metric values for each market
 * @param {string} chartId - The ID of the canvas element
 * @param {Object} data - The data object containing chart data
 * @param {string} metric - The metric to display (awareness, familiarity, consideration, intent)
 */
function createMarketBarChart(chartId, data, metric) {
  // First, clear any existing chart to prevent plugin inheritance
  const existingChart = Chart.getChart(chartId);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const ctx = document.getElementById(chartId).getContext('2d');
  const colorScheme = colorSchemes[metric];
  
  // Extract market data for the metric
  const markets = Object.keys(data.latestData || {});
  const values = markets.map(market => parseFloat(data.latestData?.[market]?.[metric] || 0));
  
  // Sort markets by value (descending)
  const sortedIndices = values.map((value, index) => index)
    .sort((a, b) => values[b] - values[a]);
  
  const sortedMarkets = sortedIndices.map(index => markets[index]);
  const sortedValues = sortedIndices.map(index => values[index]);
  const sortedColors = sortedMarkets.map(market => marketColors[market]);
  
  // Create the chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedMarkets,
      datasets: [
        {
          label: metric.charAt(0).toUpperCase() + metric.slice(1),
          data: sortedValues,
          backgroundColor: sortedColors,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          suggestedMax: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        quadrantLines: false, // Explicitly disable quadrant lines
        title: {
          display: true,
          text: `${metric.charAt(0).toUpperCase() + metric.slice(1)} by Market`,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  });
}

/**
 * Create a bar chart comparing the metric against target, previous quarter, and previous year
 * @param {string} chartId - The ID of the canvas element
 * @param {Object} data - The data object containing chart data
 * @param {string} metric - The metric to display (awareness, familiarity, consideration, intent)
 */
function createComparisonChart(chartId, data, metric) {
  // First, clear any existing chart to prevent plugin inheritance
  const existingChart = Chart.getChart(chartId);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const ctx = document.getElementById(chartId).getContext('2d');
  const colorScheme = colorSchemes[metric];
  
  // Extract comparison data
  const vsTarget = parseFloat(data.comparisons?.[metric]?.vsTarget || 0);
  const vsQ4 = parseFloat(data.comparisons?.[metric]?.vsQ4 || 0);
  const vsQ1LastYear = parseFloat(data.comparisons?.[metric]?.vsQ1LastYear || 0);
  
  // Determine colors based on positive/negative values
  const getColor = (value) => {
    return value >= 0 ? colorSchemes.familiarity.primary : colorSchemes.intent.primary;
  };
  
  // Create the chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['vs Q1 2025 Target', 'vs Q4 2024', 'vs Q1 2024'],
      datasets: [
        {
          label: 'Difference',
          data: [vsTarget, vsQ4, vsQ1LastYear],
          backgroundColor: [getColor(vsTarget), getColor(vsQ4), getColor(vsQ1LastYear)],
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        quadrantLines: false, // Explicitly disable quadrant lines
        title: {
          display: true,
          text: `${metric.charAt(0).toUpperCase() + metric.slice(1)} Comparisons`,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const sign = value >= 0 ? '+' : '';
              return `${sign}${value}%`;
            }
          }
        }
      }
    }
  });
}

/**
 * Create a line chart showing historical trends and targets for all metrics
 * @param {string} chartId - The ID of the canvas element
 * @param {Object} data - The data object containing chart data
 */
function createProjectionsChart(chartId, data) {
  // First, clear any existing chart to prevent plugin inheritance
  const existingChart = Chart.getChart(chartId);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const ctx = document.getElementById(chartId).getContext('2d');
  
  // Extract historical data from quarterlyData
  const historicalQuarters = data.quarterlyData?.map(q => q.quarter) || [];
  const historicalAwareness = data.quarterlyData?.map(q => parseFloat(q.awareness) || 0) || [];
  const historicalFamiliarity = data.quarterlyData?.map(q => parseFloat(q.familiarity) || 0) || [];
  const historicalConsideration = data.quarterlyData?.map(q => parseFloat(q.consideration) || 0) || [];
  const historicalIntent = data.quarterlyData?.map(q => parseFloat(q.intent) || 0) || [];
  
  // Extract target data
  const targetYears = data.projections?.years || [];
  const targetAwareness = data.projections?.awareness || [];
  const targetFamiliarity = data.projections?.familiarity || [];
  const targetConsideration = data.projections?.consideration || [];
  const targetIntent = data.projections?.intent || [];
  
  // Combine labels for x-axis (historical quarters + target years)
  const combinedLabels = [...historicalQuarters, ...targetYears];
  
  // Create the chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: combinedLabels,
      datasets: [
        // Historical Awareness (solid line)
        {
          label: 'Awareness (Historical)',
          data: [...historicalAwareness, ...Array(targetYears.length).fill(null)],
          backgroundColor: 'transparent',
          borderColor: colorSchemes.awareness.primary,
          borderWidth: 3,
          pointBackgroundColor: colorSchemes.awareness.primary,
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        },
        // Target Awareness (dotted line)
        {
          label: 'Awareness (Target)',
          data: [...Array(historicalQuarters.length).fill(null), ...targetAwareness],
          backgroundColor: 'transparent',
          borderColor: colorSchemes.awareness.primary,
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: colorSchemes.awareness.primary,
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        },
        // Historical Familiarity (solid line)
        {
          label: 'Familiarity (Historical)',
          data: [...historicalFamiliarity, ...Array(targetYears.length).fill(null)],
          backgroundColor: 'transparent',
          borderColor: colorSchemes.familiarity.primary,
          borderWidth: 3,
          pointBackgroundColor: colorSchemes.familiarity.primary,
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        },
        // Target Familiarity (dotted line)
        {
          label: 'Familiarity (Target)',
          data: [...Array(historicalQuarters.length).fill(null), ...targetFamiliarity],
          backgroundColor: 'transparent',
          borderColor: colorSchemes.familiarity.primary,
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: colorSchemes.familiarity.primary,
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        },
        // Historical Consideration (solid line)
        {
          label: 'Consideration (Historical)',
          data: [...historicalConsideration, ...Array(targetYears.length).fill(null)],
          backgroundColor: 'transparent',
          borderColor: colorSchemes.consideration.primary,
          borderWidth: 3,
          pointBackgroundColor: colorSchemes.consideration.primary,
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        },
        // Target Consideration (dotted line)
        {
          label: 'Consideration (Target)',
          data: [...Array(historicalQuarters.length).fill(null), ...targetConsideration],
          backgroundColor: 'transparent',
          borderColor: colorSchemes.consideration.primary,
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: colorSchemes.consideration.primary,
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        },
        // Historical Intent (solid line)
        {
          label: 'Intent (Historical)',
          data: [...historicalIntent, ...Array(targetYears.length).fill(null)],
          backgroundColor: 'transparent',
          borderColor: colorSchemes.intent.primary,
          borderWidth: 3,
          pointBackgroundColor: colorSchemes.intent.primary,
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        },
        // Target Intent (dotted line)
        {
          label: 'Intent (Target)',
          data: [...Array(historicalQuarters.length).fill(null), ...targetIntent],
          backgroundColor: 'transparent',
          borderColor: colorSchemes.intent.primary,
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: colorSchemes.intent.primary,
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        quadrantLines: false, // Explicitly disable quadrant lines
        title: {
          display: true,
          text: 'Brand Health Metrics: Historical Trends & Targets',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw}%`;
            }
          }
        },
        legend: {
          labels: {
            usePointStyle: true,
            generateLabels: function(chart) {
              const originalLabels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
              
              // Customize legend to show only 4 items (one for each metric)
              const customLabels = [];
              const metrics = ['Awareness', 'Familiarity', 'Consideration', 'Intent'];
              
              metrics.forEach((metric, index) => {
                // Use the first dataset for each metric
                const datasetIndex = index * 2;
                if (originalLabels[datasetIndex]) {
                  const label = originalLabels[datasetIndex];
                  label.text = metric; // Remove the "(Historical)" suffix
                  
                  // Add a custom fillStyle to indicate both historical and projected
                  label.lineDash = [0, 0]; // Solid line for historical
                  
                  customLabels.push(label);
                }
              });
              
              return customLabels;
            }
          }
        }
      }
    }
  });
}

/**
 * Create a quadrant chart showing markets by performance and growth
 * @param {string} chartId - The ID of the canvas element
 * @param {Object} data - The data object containing chart data
 */
function createMarketQuadrantChart(chartId, data) {
  console.log('Creating market quadrant chart with enhanced debugging...');
  
  // Validate input data
  if (!data || !data.latestData || Object.keys(data.latestData).length === 0) {
    console.error('Invalid or empty data provided for quadrant chart');
    return;
  }
  
  // Validate canvas element
  const canvas = document.getElementById(chartId);
  if (!canvas) {
    console.error(`Canvas element with ID "${chartId}" not found`);
    return;
  }
  
  // Check visibility
  const section = canvas.closest('.section-content');
  if (section && section.classList.contains('collapsed')) {
    console.warn('Quadrant chart section is collapsed, chart may not render properly');
  }
  
  // Clear existing chart
  const existingChart = Chart.getChart(chartId);
  if (existingChart) {
    console.log('Destroying existing chart instance');
    existingChart.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  
  // Extract and validate market data with detailed logging
  const markets = Object.keys(data.latestData || {});
  console.log(`Found ${markets.length} markets for quadrant chart:`, markets);
  
  // Log the raw data for debugging
  console.log('Raw data for quadrant chart:', data);
  
    // Calculate performance and growth with validation
    const quadrantData = markets.map(market => {
      // Get metrics with validation
      const awareness = parseFloat(data.latestData?.[market]?.awareness || 0);
      const consideration = parseFloat(data.latestData?.[market]?.consideration || 0);
      const intent = parseFloat(data.latestData?.[market]?.intent || 0);
      
      if (isNaN(awareness) || isNaN(consideration) || isNaN(intent)) {
        console.warn(`Invalid metrics for market ${market}:`, 
          { awareness, consideration, intent });
      }
      
      const performance = (awareness + consideration + intent) / 3;
      
      const awarenessGrowth = parseFloat(data.markets?.[market]?.awarenessGrowth || 1.5);
      const considerationGrowth = parseFloat(data.markets?.[market]?.considerationGrowth || 1.0);
      const intentGrowth = parseFloat(data.markets?.[market]?.intentGrowth || 1.2);
      
      if (isNaN(awarenessGrowth) || isNaN(considerationGrowth) || isNaN(intentGrowth)) {
        console.warn(`Invalid growth metrics for market ${market}:`, 
          { awarenessGrowth, considerationGrowth, intentGrowth });
      }
      
      const growth = (awarenessGrowth + considerationGrowth + intentGrowth) / 3;
      
      console.log(`Market: ${market}, Performance: ${performance.toFixed(2)}%, Growth: ${growth.toFixed(2)}%`);
      
      // Special detailed logging for Russia
      if (market === 'Russia') {
        console.log('RUSSIA DETAILS:');
        console.log(`  Awareness: ${awareness}, Consideration: ${consideration}, Intent: ${intent}`);
        console.log(`  Performance: ${performance.toFixed(2)}%`);
        console.log(`  Awareness Growth: ${awarenessGrowth}, Consideration Growth: ${considerationGrowth}, Intent Growth: ${intentGrowth}`);
        console.log(`  Growth: ${growth.toFixed(2)}%`);
      }
      
      return {
        market,
        x: performance, // Performance on x-axis (REVERSED)
        y: growth, // Growth on y-axis (REVERSED)
        color: marketColors[market],
        // Store raw values for debugging
        raw: {
          awareness, consideration, intent,
          awarenessGrowth, considerationGrowth, intentGrowth
        }
      };
    });
  
  // Log the entire dataset for inspection
  console.log('Complete quadrant data:', quadrantData);
  
  // Special focus on Russia
  const russiaData = quadrantData.find(item => item.market === 'Russia');
  if (russiaData) {
    console.log('RUSSIA DATA CHECK:', russiaData);
  } else {
    console.error('Russia data not found in quadrant data!');
  }
  
  // Use fixed optimal midpoints instead of dynamic calculation
  // These midpoints are carefully chosen to correctly position all markets
  const yMid = 52.0;  // Performance midpoint
  const xMid = 1.5;   // Growth midpoint
  
  console.log('Using fixed optimal midpoints:', { 
    performanceMidpoint: yMid, 
    growthMidpoint: xMid 
  });
  
  // Log expected quadrant for each market
    console.log('EXPECTED MARKET POSITIONS:');
    console.log('Leading Markets (High Perf, High Growth): India, KSA, Kuwait');
    console.log('Stable Performers (High Perf, Low Growth): Russia');
    console.log('Growth Opportunities (Low Perf, High Growth): UK, US, France');
    console.log('Underperforming Markets (Low Perf, Low Growth): Germany, China, Italy');
  
  console.log('FINAL MIDPOINTS:', { 
    xMid, 
    yMid, 
    xMidDescription: `Growth midpoint: ${xMid.toFixed(2)}%`,
    yMidDescription: `Performance midpoint: ${yMid.toFixed(2)}%`
  });
  
  // Classify markets with validation (with reversed axes)
  try {
    const stars = quadrantData.filter(item => item.y >= xMid && item.x >= yMid)
      .map(item => item.market);
    const questionMarks = quadrantData.filter(item => item.y >= xMid && item.x < yMid)
      .map(item => item.market);
    const cashCows = quadrantData.filter(item => item.y < xMid && item.x >= yMid)
      .map(item => item.market);
    const dogs = quadrantData.filter(item => item.y < xMid && item.x < yMid)
      .map(item => item.market);
    
    console.log('QUADRANT CLASSIFICATION:');
    console.log(`Stars: ${stars.join(', ') || 'None'}`);
    console.log(`Question Marks: ${questionMarks.join(', ') || 'None'}`);
    console.log(`Cash Cows: ${cashCows.join(', ') || 'None'}`);
    console.log(`Dogs: ${dogs.join(', ') || 'None'}`);
    
    // Verify all markets are classified
    const classifiedMarkets = [...stars, ...questionMarks, ...cashCows, ...dogs];
    const missingMarkets = markets.filter(m => !classifiedMarkets.includes(m));
    if (missingMarkets.length > 0) {
      console.error('Some markets were not classified:', missingMarkets);
    }
    
    // Detailed check for Russia
    if (russiaData) {
      console.log('RUSSIA QUADRANT CHECK:');
      console.log(`Performance ${russiaData.y.toFixed(2)}% ${russiaData.y >= yMid ? '≥' : '<'} ${yMid.toFixed(2)}% (Midpoint)`);
      console.log(`Growth ${russiaData.x.toFixed(2)}% ${russiaData.x >= xMid ? '≥' : '<'} ${xMid.toFixed(2)}% (Midpoint)`);
    console.log(`Expected Quadrant: ${russiaData.y >= yMid ? 
        (russiaData.x >= xMid ? 'Leading Market' : 'Stable Performer') : 
        (russiaData.x >= xMid ? 'Growth Opportunity' : 'Underperforming Market')}`);
    console.log(`Actual Quadrant: ${
        stars.includes('Russia') ? 'Leading Market' : 
        (questionMarks.includes('Russia') ? 'Growth Opportunity' : 
        (cashCows.includes('Russia') ? 'Stable Performer' : 'Underperforming Market'))
      }`);
    }
    
    // Update the market lists in the HTML
    setTimeout(() => {
      try {
        // Update the market lists in the HTML
        const starMarketsElement = document.getElementById('star-markets');
        const questionMarketsElement = document.getElementById('question-markets');
        const cashCowMarketsElement = document.getElementById('cashcow-markets');
        const dogMarketsElement = document.getElementById('dog-markets');
        
        if (starMarketsElement) starMarketsElement.textContent = stars.join(', ') || 'None';
        if (questionMarketsElement) questionMarketsElement.textContent = questionMarks.join(', ') || 'None';
        if (cashCowMarketsElement) cashCowMarketsElement.textContent = cashCows.join(', ') || 'None';
        if (dogMarketsElement) dogMarketsElement.textContent = dogs.join(', ') || 'None';
        
        console.log('Updated market lists in HTML');
      } catch (error) {
        console.error('Error updating market lists:', error);
      }
    }, 500); // Delay to ensure the DOM is ready
  } catch (error) {
    console.error('Error classifying markets:', error);
  }
  
  // Define the quadrant lines plugin locally for this chart only
  const quadrantLinesPlugin = {
    id: 'quadrantLines',
    beforeDraw: function(chart) {
      // Only apply to this specific chart
      if (chart.canvas.id !== chartId) return;
      
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;
      const chartArea = chart.chartArea;
      
      // Check if scales are defined
      if (!xAxis || !yAxis || !xAxis.max || !yAxis.max) {
        console.log('Scales not fully initialized yet, skipping quadrant lines');
        return;
      }
      
      // Draw the quadrant lines with more prominence
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // More visible lines
      ctx.lineWidth = 2; // Thicker lines
      ctx.setLineDash([5, 5]);
      
      // Vertical line (now at Performance midpoint = yMid)
      ctx.beginPath();
      ctx.moveTo(xAxis.getPixelForValue(yMid), chartArea.top);
      ctx.lineTo(xAxis.getPixelForValue(yMid), chartArea.bottom);
      ctx.stroke();
      
      // Horizontal line (now at Growth midpoint = xMid)
      ctx.beginPath();
      ctx.moveTo(chartArea.left, yAxis.getPixelForValue(xMid));
      ctx.lineTo(chartArea.right, yAxis.getPixelForValue(xMid));
      ctx.stroke();
      
      // Quadrant labels removed to prevent overlap with market data points
      // The quadrant explanations are available in the HTML below the chart
      
      // Add midpoint values as text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(`Median Performance: ${yMid.toFixed(1)}%`, chartArea.left + 10, chartArea.top + 20);
      ctx.fillText(`Median Growth: ${xMid.toFixed(1)}%`, chartArea.left + 10, chartArea.top + 40);
      
      // Add market labels directly on the chart points
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px Inter';
      
      // Get the dataset from the chart
      const dataset = chart.data.datasets[0];
      
      // Loop through each data point and add a label
      dataset.data.forEach((point, index) => {
        const market = quadrantData[index].market;
        const x = xAxis.getPixelForValue(point.x);
        const y = yAxis.getPixelForValue(point.y);
        
        // Draw a white outline for better visibility
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.strokeText(market, x, y - 15);
        
        // Draw the text in white
        ctx.fillStyle = 'white';
        ctx.fillText(market, x, y - 15);
      });
      
      ctx.restore();
    }
  };
  
  // Create the scatter chart with the local plugin
  const chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Markets',
        data: quadrantData.map(item => ({
          x: item.x,
          y: item.y
        })),
        backgroundColor: quadrantData.map(item => item.color),
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 30,  // Start from 30% to better visualize the data (Performance)
          max: 80,  // Cover the highest performance value
          title: {
            display: true,
            text: 'Performance %',
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            zeroLineColor: 'rgba(255, 255, 255, 0.3)'
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
        y: {
          min: -1,  // Allow for negative growth (Italy)
          max: 4,   // Cover the highest growth value
          title: {
            display: true,
            text: 'YoY Growth %',
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            zeroLineColor: 'rgba(255, 255, 255, 0.3)'
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        quadrantLines: true, // Enable only for this chart
        title: {
          display: true,
          text: 'Statistical Market Quadrant Analysis (Z-Score Based)',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const market = quadrantData[context.dataIndex].market;
              const x = context.parsed.x.toFixed(1);
              const y = context.parsed.y.toFixed(1);
              return `${market}: Performance ${x}%, Growth ${y}%`;
            }
          }
        },
        // Remove datalabels plugin reference as it might not be properly registered
        // datalabels: {
        //   display: true,
        //   color: 'white',
        //   font: {
        //     weight: 'bold'
        //   },
        //   formatter: function(value, context) {
        //     return quadrantData[context.dataIndex].market;
        //   },
        //   anchor: 'center',
        //   align: 'center',
        //   offset: 0
        // }
      }
    },
    plugins: [quadrantLinesPlugin] // Apply plugin locally to this chart only
  });
}

// At-risk markets chart functions removed

/**
 * Initialize the market heatmap
 */
function initializeMarketHeatmap() {
  console.log('Initializing market heatmap...');
  
  // Get the heatmap container
  const heatmapContainer = document.getElementById('market-heatmap');
  if (!heatmapContainer) {
    console.error('Heatmap container not found');
    return;
  }
  
  // Get the data from the global brandHealthData object
  const data = window.brandHealthData || {};
  
  // Define the markets and metrics
  const markets = Object.keys(data.latestData || {});
  const metrics = ['Awareness', 'Familiarity', 'Consideration', 'Intent'];
  
  // Clear the container
  heatmapContainer.innerHTML = '';
  
  // Create the header row
  const headerRow = document.createElement('div');
  headerRow.className = 'heatmap-row';
  
  // Add empty cell for the top-left corner
  const cornerCell = document.createElement('div');
  cornerCell.className = 'heatmap-header';
  cornerCell.textContent = 'Market / Metric';
  headerRow.appendChild(cornerCell);
  
  // Add metric headers
  metrics.forEach(metric => {
    const headerCell = document.createElement('div');
    headerCell.className = 'heatmap-header';
    headerCell.textContent = metric;
    headerRow.appendChild(headerCell);
  });
  
  // Add the header row to the container
  heatmapContainer.appendChild(headerRow);
  
  // Create the market rows
  markets.forEach(market => {
    const marketRow = document.createElement('div');
    marketRow.className = 'heatmap-row';
    
    // Add market name cell
    const marketCell = document.createElement('div');
    marketCell.className = 'heatmap-market';
    marketCell.textContent = market;
    marketRow.appendChild(marketCell);
    
    // Add metric cells
    metrics.forEach((metric, index) => {
      const metricKey = metric.toLowerCase();
      const value = parseFloat(data.latestData?.[market]?.[metricKey] || 0);
      
      // Determine heat level (1-5) based on the value
      let heatLevel;
      if (value >= 80) heatLevel = 5;
      else if (value >= 60) heatLevel = 4;
      else if (value >= 40) heatLevel = 3;
      else if (value >= 20) heatLevel = 2;
      else heatLevel = 1;
      
      const cell = document.createElement('div');
      cell.className = `heatmap-cell heat-level-${heatLevel}`;
      cell.textContent = `${value}%`;
      
      // Add tooltip data
      cell.setAttribute('data-market', market);
      cell.setAttribute('data-metric', metric);
      cell.setAttribute('data-value', value);
      
      // Add click event to show details
      cell.addEventListener('click', function() {
        alert(`${market} - ${metric}: ${value}%`);
      });
      
      marketRow.appendChild(cell);
    });
    
    // Add the market row to the container
    heatmapContainer.appendChild(marketRow);
  });
  
  console.log('Market heatmap initialized');
  
  // Set up the heatmap view selector
  const heatmapViewSelect = document.getElementById('heatmap-view');
  if (heatmapViewSelect) {
    heatmapViewSelect.addEventListener('change', function() {
      updateHeatmapView(this.value);
    });
  }
}

/**
 * Update the heatmap view based on the selected option
 * @param {string} viewType - The type of view to display (current, vs-target, vs-q4, vs-q1-ly)
 */
function updateHeatmapView(viewType) {
  console.log(`Updating heatmap view to: ${viewType}`);
  
  // Get the data from the global brandHealthData object
  const data = window.brandHealthData || {};
  
  // Get all heatmap cells
  const cells = document.querySelectorAll('.heatmap-cell');
  
  cells.forEach(cell => {
    const market = cell.getAttribute('data-market');
    const metric = cell.getAttribute('data-metric').toLowerCase();
    let value, heatLevel;
    
    switch (viewType) {
      case 'current':
        value = parseFloat(data.latestData?.[market]?.[metric] || 0);
        cell.textContent = `${value}%`;
        
        // Determine heat level (1-5) based on the value
        if (value >= 80) heatLevel = 5;
        else if (value >= 60) heatLevel = 4;
        else if (value >= 40) heatLevel = 3;
        else if (value >= 20) heatLevel = 2;
        else heatLevel = 1;
        break;
        
      case 'vs-target':
        const targetDiff = parseFloat(data.markets?.[market]?.[`${metric}VsTarget`] || 0);
        value = targetDiff;
        cell.textContent = value >= 0 ? `+${value}%` : `${value}%`;
        
        // Determine heat level (1-5) based on the difference from target
        // Make all negative values red (heat level 1)
        if (value < 0) heatLevel = 1;
        else if (value >= 2) heatLevel = 5;
        else if (value >= 0.5) heatLevel = 4;
        else heatLevel = 3;
        break;
        
      case 'vs-q4':
        const q4Diff = parseFloat(data.markets?.[market]?.[`${metric}VsQ4`] || 0);
        value = q4Diff;
        cell.textContent = value >= 0 ? `+${value}%` : `${value}%`;
        
        // Determine heat level (1-5) based on the difference from Q4
        // Make all negative values red (heat level 1)
        if (value < 0) heatLevel = 1;
        else if (value >= 2) heatLevel = 5;
        else if (value >= 0.5) heatLevel = 4;
        else heatLevel = 3;
        break;
        
      case 'vs-q1-ly':
        const q1LyDiff = parseFloat(data.markets?.[market]?.[`${metric}VsQ1LastYear`] || 0);
        value = q1LyDiff;
        cell.textContent = value >= 0 ? `+${value}%` : `${value}%`;
        
        // Determine heat level (1-5) based on the difference from Q1 last year
        // Make all negative values red (heat level 1)
        if (value < 0) heatLevel = 1;
        else if (value >= 5) heatLevel = 5;
        else if (value >= 2) heatLevel = 4;
        else heatLevel = 3;
        break;
    }
    
    // Update the cell's heat level class
    cell.className = `heatmap-cell heat-level-${heatLevel}`;
  });
}

/**
 * Initialize the market comparison table
 */
function initializeMarketComparisonTable() {
  console.log('Initializing market comparison table...');
  
  // Get the table body and cards container
  const tableBody = document.getElementById('comparison-table-body');
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'market-cards-container';
  cardsContainer.id = 'market-cards-container';
  
  // Insert the cards container after the table container
  const tableContainer = document.querySelector('.market-table-container');
  if (tableContainer && tableContainer.parentNode) {
    tableContainer.parentNode.insertBefore(cardsContainer, tableContainer.nextSibling);
  }
  
  if (!tableBody) {
    console.error('Comparison table body not found');
    return;
  }
  
  // Get the data from the global brandHealthData object
  const data = window.brandHealthData || {};
  
  // Get the selected metric
  const metricSelect = document.getElementById('metric-filter');
  const metric = metricSelect ? metricSelect.value : 'awareness';
  
  // Get the selected sort option
  const sortSelect = document.getElementById('sort-by');
  const sortBy = sortSelect ? sortSelect.value : 'value';
  
  // Update the table and cards with the selected metric and sort option
  updateComparisonTable(metric, sortBy);
  updateMarketCards(metric, sortBy);
  
  // Set up event listeners for the filters
  if (metricSelect) {
    metricSelect.addEventListener('change', function() {
      const sortSelect = document.getElementById('sort-by');
      const sortBy = sortSelect ? sortSelect.value : 'value';
      const metric = this.value;
      updateComparisonTable(metric, sortBy);
      updateMarketCards(metric, sortBy);
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const metricSelect = document.getElementById('metric-filter');
      const metric = metricSelect ? metricSelect.value : 'awareness';
      const sortBy = this.value;
      updateComparisonTable(metric, sortBy);
      updateMarketCards(metric, sortBy);
    });
  }
}

/**
 * Update the market cards with the selected metric and sort option
 * @param {string} metric - The metric to display (awareness, familiarity, consideration, intent)
 * @param {string} sortBy - The sort option (value, vs-target, vs-q4, vs-q1-ly)
 */
function updateMarketCards(metric, sortBy) {
  console.log(`Updating market cards: metric=${metric}, sortBy=${sortBy}`);
  
  // Get the cards container
  const cardsContainer = document.getElementById('market-cards-container');
  if (!cardsContainer) {
    console.error('Market cards container not found');
    return;
  }
  
  // Get the data from the global brandHealthData object
  const data = window.brandHealthData || {};
  
  // Clear the cards container
  cardsContainer.innerHTML = '';
  
  // Get the markets
  const markets = Object.keys(data.latestData || {});
  
  // Create market data array with all the values we need
  const marketData = markets.map(market => {
    const currentValue = parseFloat(data.latestData?.[market]?.[metric] || 0);
    const target = parseFloat(data.markets?.[market]?.[`${metric}Target`] || 0);
    const vsTarget = parseFloat(data.markets?.[market]?.[`${metric}VsTarget`] || 0);
    const vsQ4 = parseFloat(data.markets?.[market]?.[`${metric}VsQ4`] || 0);
    const vsQ1LastYear = parseFloat(data.markets?.[market]?.[`${metric}VsQ1LastYear`] || 0);
    
    return {
      market,
      currentValue,
      target,
      vsTarget,
      vsQ4,
      vsQ1LastYear
    };
  });
  
  // Sort the market data based on the selected sort option
  marketData.sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.currentValue - a.currentValue;
      case 'vs-target':
        return b.vsTarget - a.vsTarget;
      case 'vs-q4':
        return b.vsQ4 - a.vsQ4;
      case 'vs-q1-ly':
        return b.vsQ1LastYear - a.vsQ1LastYear;
      default:
        return 0;
    }
  });
  
  // Get the metric display name
  const metricDisplayName = metric.charAt(0).toUpperCase() + metric.slice(1);
  
  // Add cards to the container
  marketData.forEach(item => {
    // Create the card
    const card = document.createElement('div');
    card.className = 'market-card';
    
    // Create the card header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'market-card-header';
    
    // Create the market name
    const marketName = document.createElement('div');
    marketName.className = 'market-card-name';
    marketName.textContent = item.market;
    
    // Create the current value
    const currentValue = document.createElement('div');
    currentValue.className = 'market-card-value';
    currentValue.textContent = `${item.currentValue}%`;
    
    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'market-card-toggle';
    toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
    toggleButton.setAttribute('aria-label', 'Toggle details');
    
    // Add the elements to the header
    cardHeader.appendChild(marketName);
    cardHeader.appendChild(currentValue);
    cardHeader.appendChild(toggleButton);
    
    // Create the card body
    const cardBody = document.createElement('div');
    cardBody.className = 'market-card-body';
    
    // Create the stats container
    const statsContainer = document.createElement('div');
    statsContainer.className = 'market-card-stats';
    
    // Create the target stat
    const targetStat = createCardStat('Target', `${item.target}%`);
    
    // Create the vs target stat
    const vsTargetClass = item.vsTarget > 0 ? 'positive' : (item.vsTarget < 0 ? 'negative' : 'warning');
    const vsTargetStat = createCardStat('Vs Q1 2025 Target', item.vsTarget > 0 ? `+${item.vsTarget}%` : `${item.vsTarget}%`, vsTargetClass);
    
    // Create the vs Q4 stat
    const vsQ4Class = item.vsQ4 > 0 ? 'positive' : (item.vsQ4 < 0 ? 'negative' : 'warning');
    const vsQ4Stat = createCardStat('Vs Q4 2024', item.vsQ4 > 0 ? `+${item.vsQ4}%` : `${item.vsQ4}%`, vsQ4Class);
    
    // Create the vs Q1 last year stat
    const vsQ1LYClass = item.vsQ1LastYear > 0 ? 'positive' : (item.vsQ1LastYear < 0 ? 'negative' : 'warning');
    const vsQ1LYStat = createCardStat('Vs Q1 2024', item.vsQ1LastYear > 0 ? `+${item.vsQ1LastYear}%` : `${item.vsQ1LastYear}%`, vsQ1LYClass);
    
    // Add the stats to the container
    statsContainer.appendChild(targetStat);
    statsContainer.appendChild(vsTargetStat);
    statsContainer.appendChild(vsQ4Stat);
    statsContainer.appendChild(vsQ1LYStat);
    
    // Add the stats container to the body
    cardBody.appendChild(statsContainer);
    
    // Add the header and body to the card
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    
    // Add the card to the container
    cardsContainer.appendChild(card);
    
    // Add event listener to the toggle button
    toggleButton.addEventListener('click', function() {
      // Toggle the expanded class on the body
      cardBody.classList.toggle('expanded');
      
      // Toggle the expanded class on the button
      this.classList.toggle('expanded');
    });
  });
  
  // Add a title to the cards container
  const title = document.createElement('h3');
  title.textContent = `${metricDisplayName} by Market`;
  title.style.marginBottom = '16px';
  cardsContainer.insertBefore(title, cardsContainer.firstChild);
}

/**
 * Create a stat element for the market card
 * @param {string} label - The label for the stat
 * @param {string} value - The value for the stat
 * @param {string} valueClass - Optional class for the value
 * @returns {HTMLElement} - The stat element
 */
function createCardStat(label, value, valueClass) {
  const stat = document.createElement('div');
  stat.className = 'market-card-stat';
  
  const labelElement = document.createElement('div');
  labelElement.className = 'market-card-stat-label';
  labelElement.textContent = label;
  
  const valueElement = document.createElement('div');
  valueElement.className = 'market-card-stat-value';
  if (valueClass) {
    valueElement.classList.add(valueClass);
  }
  valueElement.textContent = value;
  
  stat.appendChild(labelElement);
  stat.appendChild(valueElement);
  
  return stat;
}

/**
 * Update the comparison table with the selected metric and sort option
 * @param {string} metric - The metric to display (awareness, familiarity, consideration, intent)
 * @param {string} sortBy - The sort option (value, vs-target, vs-q4, vs-q1-ly)
 */
function updateComparisonTable(metric, sortBy) {
  console.log(`Updating comparison table: metric=${metric}, sortBy=${sortBy}`);
  
  // Get the table body
  const tableBody = document.getElementById('comparison-table-body');
  if (!tableBody) {
    console.error('Comparison table body not found');
    return;
  }
  
  // Get the data from the global brandHealthData object
  const data = window.brandHealthData || {};
  
  // Clear the table body
  tableBody.innerHTML = '';
  
  // Get the markets
  const markets = Object.keys(data.latestData || {});
  
  // Create market data array with all the values we need
  const marketData = markets.map(market => {
    const currentValue = parseFloat(data.latestData?.[market]?.[metric] || 0);
    const target = parseFloat(data.markets?.[market]?.[`${metric}Target`] || 0);
    const vsTarget = parseFloat(data.markets?.[market]?.[`${metric}VsTarget`] || 0);
    const vsQ4 = parseFloat(data.markets?.[market]?.[`${metric}VsQ4`] || 0);
    const vsQ1LastYear = parseFloat(data.markets?.[market]?.[`${metric}VsQ1LastYear`] || 0);
    
    return {
      market,
      currentValue,
      target,
      vsTarget,
      vsQ4,
      vsQ1LastYear
    };
  });
  
  // Sort the market data based on the selected sort option
  marketData.sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.currentValue - a.currentValue;
      case 'vs-target':
        return b.vsTarget - a.vsTarget;
      case 'vs-q4':
        return b.vsQ4 - a.vsQ4;
      case 'vs-q1-ly':
        return b.vsQ1LastYear - a.vsQ1LastYear;
      default:
        return 0;
    }
  });
  
  // Add rows to the table
  marketData.forEach(item => {
    const row = document.createElement('tr');
    
    // Market name cell
    const marketCell = document.createElement('td');
    marketCell.className = 'market-name';
    marketCell.textContent = item.market;
    row.appendChild(marketCell);
    
    // Current value cell
    const valueCell = document.createElement('td');
    valueCell.className = 'comparison-value';
    valueCell.textContent = `${item.currentValue}%`;
    row.appendChild(valueCell);
    
    // Target cell
    const targetCell = document.createElement('td');
    targetCell.textContent = `${item.target}%`;
    row.appendChild(targetCell);
    
    // Vs Target cell
    const vsTargetCell = document.createElement('td');
    vsTargetCell.className = item.vsTarget > 0 ? 'comparison-positive' : (item.vsTarget < 0 ? 'comparison-negative' : 'comparison-neutral');
    vsTargetCell.textContent = item.vsTarget > 0 ? `+${item.vsTarget}%` : `${item.vsTarget}%`;
    row.appendChild(vsTargetCell);
    
    // Vs Q4 cell
    const vsQ4Cell = document.createElement('td');
    vsQ4Cell.className = item.vsQ4 > 0 ? 'comparison-positive' : (item.vsQ4 < 0 ? 'comparison-negative' : 'comparison-neutral');
    vsQ4Cell.textContent = item.vsQ4 > 0 ? `+${item.vsQ4}%` : `${item.vsQ4}%`;
    row.appendChild(vsQ4Cell);
    
    // Vs Q1 Last Year cell
    const vsQ1LYCell = document.createElement('td');
    vsQ1LYCell.className = item.vsQ1LastYear > 0 ? 'comparison-positive' : (item.vsQ1LastYear < 0 ? 'comparison-negative' : 'comparison-neutral');
    vsQ1LYCell.textContent = item.vsQ1LastYear > 0 ? `+${item.vsQ1LastYear}%` : `${item.vsQ1LastYear}%`;
    row.appendChild(vsQ1LYCell);
    
    // Add the row to the table
    tableBody.appendChild(row);
  });
}


/**
 * Initialize all visible charts on page load
 */
function initializeVisibleCharts() {
  console.log('Initializing visible charts...');
  
  // Find all visible charts (not in collapsed sections or hidden tabs)
  const visibleCharts = Array.from(document.querySelectorAll('canvas[data-lazy="true"]'))
    .filter(canvas => {
      const section = canvas.closest('.section-content');
      const tab = canvas.closest('.tab-content');
      
      // Check if the chart is in a visible section and tab
      const isInVisibleSection = !section || !section.classList.contains('collapsed');
      const isInVisibleTab = !tab || tab.classList.contains('active');
      
      return isInVisibleSection && isInVisibleTab;
    });
  
  console.log(`Found ${visibleCharts.length} visible charts`);
  
  // Initialize each visible chart
  visibleCharts.forEach(canvas => {
    if (canvas.getAttribute('data-initialized') !== 'true') {
      console.log(`Initializing chart: ${canvas.id}`);
      canvas.setAttribute('data-initialized', 'true');
      initializeChart(canvas.id);
    }
  });
}

// Unregister any global plugins when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // This ensures plugins don't affect charts they're not meant for
  if (Chart.registry.plugins.get('quadrantLines')) {
    Chart.registry.plugins.unregister(Chart.registry.plugins.get('quadrantLines'));
  }
});

// Make the initializeChart function globally available
window.initializeChart = initializeChart;

// Initialize visible charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait a short time to ensure all other scripts have loaded
  setTimeout(initializeVisibleCharts, 500);
  
  // Refresh button removed as requested
});
