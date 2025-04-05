// Chart Service: Handles chart creation and rendering
export class ChartService {
    constructor() {
        // Store references to created charts
        this.charts = {};
    }
    
    /**
     * Creates a bar chart
     * @param {string} containerId - The ID of the container element
     * @param {Array} labels - Chart labels (x-axis)
     * @param {Array} datasets - Chart datasets
     * @returns {Object} Chart instance
     */
    createBarChart(containerId, labels, datasets) {
        // Destroy existing chart if it exists
        this.destroyChart(containerId);
        
        const ctx = document.getElementById(containerId);
        if (!ctx) {
            console.error(`Container with ID ${containerId} not found`);
            return null;
        }
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Store reference
        this.charts[containerId] = chart;
        
        return chart;
    }
    
    /**
     * Creates a line chart
     * @param {string} containerId - The ID of the container element
     * @param {Array} labels - Chart labels (x-axis)
     * @param {Array} datasets - Chart datasets
     * @returns {Object} Chart instance
     */
    createLineChart(containerId, labels, datasets) {
        // Destroy existing chart if it exists
        this.destroyChart(containerId);
        
        const ctx = document.getElementById(containerId);
        if (!ctx) {
            console.error(`Container with ID ${containerId} not found`);
            return null;
        }
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Store reference
        this.charts[containerId] = chart;
        
        return chart;
    }
    
    /**
     * Creates a doughnut/pie chart
     * @param {string} containerId - The ID of the container element
     * @param {Array} labels - Chart labels
     * @param {Array} data - Chart data
     * @param {Array} backgroundColor - Background colors
     * @returns {Object} Chart instance
     */
    createDoughnutChart(containerId, labels, data, backgroundColor) {
        // Destroy existing chart if it exists
        this.destroyChart(containerId);
        
        const ctx = document.getElementById(containerId);
        if (!ctx) {
            console.error(`Container with ID ${containerId} not found`);
            return null;
        }
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColor,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
        
        // Store reference
        this.charts[containerId] = chart;
        
        return chart;
    }
    
    /**
     * Destroys a chart instance
     * @param {string} containerId - The ID of the container element
     */
    destroyChart(containerId) {
        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
            delete this.charts[containerId];
        }
    }
    
    /**
     * Updates an existing chart
     * @param {string} containerId - The ID of the container element
     * @param {Array} labels - New labels
     * @param {Array} datasets - New datasets
     */
    updateChart(containerId, labels, datasets) {
        const chart = this.charts[containerId];
        if (!chart) {
            console.error(`Chart with container ID ${containerId} not found`);
            return;
        }
        
        chart.data.labels = labels;
        chart.data.datasets = datasets;
        chart.update();
    }
}