/**
 * Collapsible functionality for the Brand Health KPI Dashboard
 * Handles collapsible cards and sections with expand/collapse all controls
 */

/**
 * Initialize collapsible functionality for all cards
 */
function initializeCollapsible() {
  console.log('Initializing collapsible functionality...');
  
  // Set up card headers as toggles
  const cardHeaders = document.querySelectorAll('.card-header');
  cardHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const card = this.closest('.collapsible');
      toggleCard(card);
    });
  });
  
  // Set up toggle buttons
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  toggleButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent triggering the header click
      const card = this.closest('.collapsible');
      toggleCard(card);
    });
  });
  
  // Set up expand/collapse all buttons
  setupSectionControls();
  
  // Initially collapse all cards except the first one in each section
  const sections = document.querySelectorAll('.dashboard-section');
  sections.forEach(section => {
    const cards = section.querySelectorAll('.collapsible');
    cards.forEach((card, index) => {
      if (index > 0) {
        card.classList.add('collapsed');
        updateToggleIcon(card);
      }
    });
  });
  
  console.log('Collapsible functionality initialized');
}

/**
 * Toggle a card's collapsed state
 * @param {HTMLElement} card - The card element to toggle
 */
function toggleCard(card) {
  card.classList.toggle('collapsed');
  updateToggleIcon(card);
}

/**
 * Update the toggle icon based on the card's collapsed state
 * @param {HTMLElement} card - The card element
 */
function updateToggleIcon(card) {
  const button = card.querySelector('.toggle-btn');
  if (!button) return;
  
  const icon = button.querySelector('i');
  if (!icon) return;
  
  if (card.classList.contains('collapsed')) {
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-right');
  } else {
    icon.classList.remove('fa-chevron-right');
    icon.classList.add('fa-chevron-down');
  }
}

/**
 * Set up section-wide expand/collapse controls
 */
function setupSectionControls() {
  // Expand all buttons
  const expandAllButtons = document.querySelectorAll('.expand-all-btn');
  expandAllButtons.forEach(button => {
    button.addEventListener('click', function() {
      const section = this.closest('.dashboard-section');
      const cards = section.querySelectorAll('.collapsible');
      
      cards.forEach(card => {
        card.classList.remove('collapsed');
        updateToggleIcon(card);
      });
    });
  });
  
  // Collapse all buttons
  const collapseAllButtons = document.querySelectorAll('.collapse-all-btn');
  collapseAllButtons.forEach(button => {
    button.addEventListener('click', function() {
      const section = this.closest('.dashboard-section');
      const cards = section.querySelectorAll('.collapsible');
      
      cards.forEach(card => {
        card.classList.add('collapsed');
        updateToggleIcon(card);
      });
    });
  });
}

/**
 * Initialize section toggle functionality
 */
function initializeSectionToggle() {
  console.log('Setting up section toggle functionality...');
  
  const sectionToggleButtons = document.querySelectorAll('.section-toggle');
  console.log(`Found ${sectionToggleButtons.length} section toggle buttons`);
  
  sectionToggleButtons.forEach((button, index) => {
    console.log(`Setting up button ${index + 1}`);
    
    button.addEventListener('click', function(e) {
      console.log('Toggle button clicked');
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle the collapsed class on the button
      this.classList.toggle('collapsed');
      
      // Get the parent section
      const section = this.closest('.dashboard-section');
      
      // Get the section content
      const content = section.querySelector('.section-content');
      
      if (content) {
        // Toggle the collapsed class on the section content
        content.classList.toggle('collapsed');
        
        // Update the aria-expanded attribute for accessibility
        const isExpanded = !content.classList.contains('collapsed');
        this.setAttribute('aria-expanded', isExpanded);
        
        // Update the icon
        const icon = this.querySelector('i');
        if (icon) {
          if (isExpanded) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
          } else {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
          }
        }
        
        console.log(`Section toggled: ${isExpanded ? 'expanded' : 'collapsed'}`);
      } else {
        console.error('Section content not found');
      }
    });
  });
  
  console.log('Section toggle functionality setup complete');
}

/**
 * Initialize tab functionality
 */
function initializeTabs() {
  console.log('Setting up tab functionality...');
  
  const tabButtons = document.querySelectorAll('.tab-btn');
  console.log(`Found ${tabButtons.length} tab buttons`);
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the tab to show
      const tabToShow = this.getAttribute('data-tab');
      console.log(`Switching to tab: ${tabToShow}`);
      
      // Get the tab container
      const tabContainer = this.closest('.tab-container');
      
      // Hide all tabs and remove active class from buttons
      tabContainer.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      
      tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Show the selected tab and add active class to button
      document.getElementById(`${tabToShow}-tab`).classList.add('active');
      this.classList.add('active');
      
      // Initialize any lazy-loaded charts in the newly visible tab
      const lazyCharts = document.querySelectorAll(`#${tabToShow}-tab canvas[data-lazy="true"]`);
      lazyCharts.forEach(canvas => {
        if (canvas.getAttribute('data-initialized') !== 'true') {
          console.log(`Initializing lazy chart: ${canvas.id}`);
          // Set the initialized attribute to prevent re-initialization
          canvas.setAttribute('data-initialized', 'true');
          // Trigger chart initialization if a global function exists
          if (window.initializeChart && typeof window.initializeChart === 'function') {
            window.initializeChart(canvas.id);
          }
        }
      });
      
      // Special handling for market comparison tab
      if (tabToShow === 'market-comparison' && tabContainer.classList.contains('market-performance-tabs')) {
        // Initialize the market comparison table if it hasn't been initialized yet
        if (window.updateComparisonTable && typeof window.updateComparisonTable === 'function') {
          const metricSelect = document.getElementById('metric-filter');
          const sortSelect = document.getElementById('sort-by');
          const metric = metricSelect ? metricSelect.value : 'awareness';
          const sortBy = sortSelect ? sortSelect.value : 'value';
          window.updateComparisonTable(metric, sortBy);
        }
      }
      
      // Special handling for market heatmap tab
      if (tabToShow === 'market-heatmap' && tabContainer.classList.contains('market-performance-tabs')) {
        // Initialize the market heatmap if it hasn't been initialized yet
        if (window.initializeMarketHeatmap && typeof window.initializeMarketHeatmap === 'function') {
          window.initializeMarketHeatmap();
        }
      }
    });
  });
  
  console.log('Tab functionality setup complete');
}

/**
 * Initialize print functionality
 */
function initializePrint() {
  console.log('Setting up print functionality...');
  
  const printButton = document.getElementById('print-dashboard');
  if (printButton) {
    printButton.addEventListener('click', function() {
      console.log('Print button clicked');
      window.print();
    });
    console.log('Print functionality setup complete');
  } else {
    console.error('Print button not found');
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing interactive elements...');
  initializeCollapsible();
  initializeSectionToggle();
  initializeTabs();
  initializePrint();
  console.log('All interactive elements initialized');
});
