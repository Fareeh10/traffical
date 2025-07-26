let trafficChart; // Variable to hold the route traffic score Chart.js instance
        let dailyTrafficChart; // Variable to hold the daily traffic outlook Chart.js instance
        let historicalTrafficChart; // New: Historical traffic chart instance
        let issueDistributionChart; // New: Issue distribution chart instance
        let fixedRouteTravelChart; // New: Fixed route travel time chart instance
        let alternativeRoutesChart; // New: Alternative routes chart instance

        // Sample alerts for demonstration - now a mutable array
        const sampleAlerts = [
            {
                id: 'alert1',
                type: 'vip',
                reason: 'VIP Movement',
                location: 'Kottakkal Bypass near Bus Stand',
                startTime: '10:00 AM',
                endTime: '10:30 AM',
                status: 'active'
            },
            {
                id: 'alert2',
                type: 'construction',
                reason: 'Road Construction',
                location: 'Near Kottakkal Ayurveda Hospital entrance',
                startTime: '09:00 AM',
                endTime: '05:00 PM',
                status: 'active'
            },
            {
                id: 'alert3',
                type: 'protest',
                reason: 'Local Protest',
                location: 'Town Square',
                startTime: '02:00 PM',
                endTime: '03:00 PM',
                status: 'active'
            },
            {
                id: 'alert4',
                type: 'other',
                reason: 'Fallen Tree',
                location: 'Road to Changuvetty',
                startTime: '08:00 AM',
                endTime: '09:00 AM',
                status: 'resolved' // Example of a resolved alert
            }
        ];

        let isControllerLoggedIn = false; // New flag to track login status

        // Function to display messages to the user
        function showMessage(message, type = 'error') {
            const messageBox = document.getElementById('message-box');
            const messageText = document.getElementById('message-text');
            messageText.textContent = message;
            messageBox.classList.remove('hidden');
            if (type === 'error') {
                messageBox.classList.remove('bg-green-100', 'border-green-400', 'text-green-700');
                messageBox.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                messageBox.classList.remove('bg-red-100', 'border-red-400', 'text-green-700');
                messageBox.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }
        }

        // Function to hide messages
        function hideMessage() {
            document.getElementById('message-box').classList.add('hidden');
        }

        // Function to create or update the single traffic score chart
        function updateTrafficChart(score) {
            const ctx = document.getElementById('trafficChart').getContext('2d');

            if (trafficChart) {
                trafficChart.destroy(); // Destroy existing chart if it exists
            }

            // Determine bar color based on score
            let barColor;
            if (score <= 3) {
                barColor = '#4CAF50'; // Green for low traffic
            } else if (score <= 7) {
                barColor = '#FFC107'; // Amber for moderate traffic
            } else {
                barColor = '#F44336'; // Red for high traffic
            }

            trafficChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Traffic Score'],
                    datasets: [{
                        label: 'Congestion Level (0-10)',
                        data: [score],
                        backgroundColor: [barColor],
                        borderColor: [barColor],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Allow canvas to resize freely
                    indexAxis: 'y', // Make it a horizontal bar chart
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 10, // Max score is 10
                            ticks: {
                                stepSize: 1
                            },
                            grid: {
                                display: false // Hide x-axis grid lines
                            }
                        },
                        y: {
                            grid: {
                                display: false // Hide y-axis grid lines
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Hide legend
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Traffic Score: ${context.raw}`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Function to create or update the daily traffic outlook chart
        function updateDailyTrafficChart(dailyOutlook) {
            const ctx = document.getElementById('dailyTrafficChart').getContext('2d');

            if (dailyTrafficChart) {
                dailyTrafficChart.destroy(); // Destroy existing chart if it exists
            }

            const labels = dailyOutlook.map(item => item.hour);
            const data = dailyOutlook.map(item => item.score);

            dailyTrafficChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Expected Traffic Score',
                        data: data,
                        borderColor: 'rgb(102, 51, 153)', // A shade of purple
                        backgroundColor: 'rgba(102, 51, 153, 0.2)',
                        fill: true,
                        tension: 0.3, // Smooth the line
                        pointBackgroundColor: 'rgb(102, 51, 153)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(102, 51, 153)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time of Day'
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Traffic Score (0-10)'
                            },
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Traffic Score: ${context.raw}`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // New: Function to create or update the historical traffic chart
        function updateHistoricalTrafficChart(historicalData) {
            const ctx = document.getElementById('historicalTrafficChart').getContext('2d');

            if (historicalTrafficChart) {
                historicalTrafficChart.destroy();
            }

            const labels = historicalData.map(item => item.day);
            const data = historicalData.map(item => item.score);

            historicalTrafficChart = new Chart(ctx, {
                type: 'line', // Line chart for trends
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Average Traffic Score',
                        data: data,
                        borderColor: 'rgb(76, 175, 80)', // Green color
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: 'rgb(76, 175, 80)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(76, 175, 80)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Day of Week'
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Traffic Score (0-10)'
                            },
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Score: ${context.raw}`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // New: Function to create or update the issue distribution chart
        function updateIssueDistributionChart(distributionData) {
            const ctx = document.getElementById('issueDistributionChart').getContext('2d');

            if (issueDistributionChart) {
                issueDistributionChart.destroy();
            }

            const labels = Object.keys(distributionData);
            const data = Object.values(distributionData);
            const backgroundColors = [
                'rgb(244, 67, 54)', // Red for Accident
                'rgb(255, 193, 7)', // Amber for Pothole
                'rgb(33, 150, 243)', // Blue for Road Block
                'rgb(158, 158, 158)' // Grey for Other
            ];

            issueDistributionChart = new Chart(ctx, {
                type: 'pie', // Pie chart for distribution
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right', // Place legend on the right
                            labels: {
                                boxWidth: 20 // Smaller color boxes
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += context.parsed + '%'; // Assuming data is in percentage
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }

        // New: Function to create or update the fixed route hourly travel chart
        function updateFixedRouteHourlyTravelChart(hourlyTravelData) {
            const ctx = document.getElementById('fixedRouteTravelChart').getContext('2d');

            if (fixedRouteTravelChart) {
                fixedRouteTravelChart.destroy();
            }

            const labels = hourlyTravelData.map(item => item.hour);
            const data = hourlyTravelData.map(item => item.travelTimeMinutes);

            fixedRouteTravelChart = new Chart(ctx, {
                type: 'line', // Line chart for time series
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Travel Time (minutes)',
                        data: data,
                        borderColor: 'rgb(63, 81, 181)', // Indigo color
                        backgroundColor: 'rgba(63, 81, 181, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: 'rgb(63, 81, 181)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(63, 81, 181)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time of Day'
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Travel Time (minutes)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + ' min';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Travel Time: ${context.raw} min`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // New: Function to create or update the alternative routes comparison chart
        function updateAlternativeRoutesChart(routesComparisonData) {
            const ctx = document.getElementById('alternativeRoutesChart').getContext('2d');

            if (alternativeRoutesChart) {
                alternativeRoutesChart.destroy();
            }

            const labels = routesComparisonData.map(item => item.routeName);
            const travelTimes = routesComparisonData.map(item => item.estimatedTimeMinutes);
            const trafficScores = routesComparisonData.map(item => item.trafficScore);

            alternativeRoutesChart = new Chart(ctx, {
                type: 'bar', // Bar chart for comparison
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Estimated Travel Time (min)',
                            data: travelTimes,
                            backgroundColor: 'rgba(255, 159, 64, 0.8)', // Orange
                            borderColor: 'rgb(255, 159, 64)',
                            borderWidth: 1
                        },
                        {
                            label: 'Traffic Score (0-10)',
                            data: trafficScores,
                            backgroundColor: 'rgba(75, 192, 192, 0.8)', // Teal
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Route'
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Value'
                            },
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top', // Legend at the top
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y;
                                        if (context.dataset.label.includes('Time')) {
                                            label += ' min';
                                        }
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }


        // Function to set the Google Maps directions link for the button
        function setLiveMapInfoButtonLink(start, end) {
            const getLiveMapInfoButton = document.getElementById('get-live-map-info');

            if (!start || !end) {
                getLiveMapInfoButton.onclick = null; // Disable button click
                getLiveMapInfoButton.classList.add('opacity-50', 'cursor-not-allowed'); // Visually disable
                return;
            }
            // Google Maps directions URL for click-through
            const directionsUrl = `https://www.google.com/map
