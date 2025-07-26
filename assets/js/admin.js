
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
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}`;

            getLiveMapInfoButton.onclick = () => {
                window.open(directionsUrl, '_blank', 'noopener noreferrer');
            };
            getLiveMapInfoButton.classList.remove('opacity-50', 'cursor-not-allowed'); // Enable button
        }

        // New: Function to display road alerts
        // New: Function to display road alerts
function displayRoadAlerts(alerts) {
    const alertsList = document.getElementById('alerts-list');
    if (!alertsList) {
        console.error("Could not find alerts-list element");
        return;
    }
    
    alertsList.innerHTML = ''; // Clear previous alerts
    document.getElementById('road-alerts-panel').classList.remove('hidden');

    if (!alerts || alerts.length === 0) {
        alertsList.innerHTML = '<p class="text-gray-600">No active road alerts at this time.</p>';
        return;
    }

    alerts.forEach(alert => {
        const alertCard = document.createElement('div');
        alertCard.className = 'bg-white p-4 rounded-lg shadow-md relative mb-4 border-l-4';
        
        // Set border color based on alert type
        const borderColors = {
            vip: 'border-blue-500',
            construction: 'border-amber-500', 
            protest: 'border-red-500',
            other: 'border-gray-500'
        };
        alertCard.classList.add(borderColors[alert.type] || 'border-gray-300');

        const statusText = alert.status === 'active' ? 
            '<span class="text-red-600 font-bold">Active</span>' : 
            '<span class="text-green-600 font-bold">Resolved</span>';

        let buttonHtml = '';
        if (isControllerLoggedIn && alert.status === 'active') {
            buttonHtml = `
                <div class="absolute top-2 right-2">
                    <button class="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-2 rounded transition"
                            data-alert-id="${alert.id}">
                        Mark Resolved
                    </button>
                </div>
            `;
        }

        alertCard.innerHTML = `
            ${buttonHtml}
            <div class="pr-12">
                <h3 class="text-lg font-semibold text-gray-800 capitalize">${alert.type.replace('_', ' ')}: ${alert.reason}</h3>
                <p class="text-gray-600 text-sm mt-1"><strong>Location:</strong> ${alert.location}</p>
                <p class="text-gray-600 text-sm"><strong>Time:</strong> ${alert.startTime} - ${alert.endTime}</p>
                <p class="text-gray-600 text-sm mt-2"><strong>Status:</strong> ${statusText}</p>
            </div>
        `;

        alertsList.appendChild(alertCard);

        // Add click handler if button exists
        const button = alertCard.querySelector('button');
        if (button) {
            button.addEventListener('click', () => {
                const alertId = button.dataset.alertId;
                const targetAlert = alerts.find(a => a.id === alertId);
                if (targetAlert) {
                    targetAlert.status = 'resolved';
                    displayRoadAlerts(alerts); // Refresh
                    showMessage(`Alert resolved: ${targetAlert.reason}`, 'success');
                }
            });
        }
    });
}
document.getElementById('road-alerts-panel').classList.remove('hidden');

        // Function for Gemini API call to get traffic briefing
        async function getTrafficBriefing() {
            hideMessage(); // Hide any previous messages

            const start = document.getElementById("start").value;
            const end = document.getElementById("end").value;
            const briefingPanel = document.getElementById("briefing-panel");
            const dailyTrafficPanel = document.getElementById("daily-traffic-panel");
            const mapPreviewPanel = document.getElementById("map-preview-panel");
            const historicalTrafficPanel = document.getElementById("historical-traffic-panel"); // New panel
            const issueDistributionPanel = document.getElementById("issue-distribution-panel"); // New panel
            const fixedRouteTravelPanel = document.getElementById("fixed-route-travel-panel"); // New panel
            const alternativeRoutesPanel = document.getElementById("alternative-routes-panel"); // New panel
            const roadAlertsPanel = document.getElementById("road-alerts-panel"); // New panel

            const briefingSummary = document.getElementById("briefing-summary");
            const briefingTextContent = document.getElementById("briefing-text-content");
            const keyCongestionAreasDiv = document.getElementById("key-congestion-areas");

            if (!start || !end) {
                showMessage("Please enter both a starting point and a destination before getting a briefing.", 'error');
                // Hide all panels if inputs are empty
                [briefingPanel, dailyTrafficPanel, mapPreviewPanel, historicalTrafficPanel, issueDistributionPanel, fixedRouteTravelPanel, alternativeRoutesPanel, roadAlertsPanel].forEach(panel => panel.classList.add('hidden', 'panel-transition'));
                setLiveMapInfoButtonLink('', ''); // Disable button
                return;
            }

            // Show all panels and clear previous content
            // Add 'show' class for fade-in effect
            [briefingPanel, dailyTrafficPanel, mapPreviewPanel, historicalTrafficPanel, issueDistributionPanel, fixedRouteTravelPanel, alternativeRoutesPanel, roadAlertsPanel].forEach(panel => {
                panel.classList.remove('hidden');
                setTimeout(() => panel.classList.add('show'), 10); // Small delay to trigger transition
            });


            briefingSummary.innerHTML = '<p class="text-blue-500">Generating detailed briefing... <span class="animate-pulse">...</span></p>';
            briefingTextContent.innerHTML = '';
            keyCongestionAreasDiv.innerHTML = '';
            document.getElementById('dailyTrafficChart').getContext('2d').clearRect(0, 0, document.getElementById('dailyTrafficChart').width, document.getElementById('dailyTrafficChart').height);
            // Clear new chart areas
            document.getElementById('historicalTrafficChart').getContext('2d').clearRect(0, 0, document.getElementById('historicalTrafficChart').width, document.getElementById('historicalTrafficChart').height);
            document.getElementById('issueDistributionChart').getContext('2d').clearRect(0, 0, document.getElementById('issueDistributionChart').width, document.getElementById('issueDistributionChart').height);
            document.getElementById('fixedRouteTravelChart').getContext('2d').clearRect(0, 0, document.getElementById('fixedRouteTravelChart').width, document.getElementById('fixedRouteTravelChart').height);
            document.getElementById('alternativeRoutesChart').getContext('2d').clearRect(0, 0, document.getElementById('alternativeRoutesChart').width, document.getElementById('alternativeRoutesChart').height);
            document.getElementById('alerts-list').innerHTML = '<p class="text-blue-500">Loading alerts...</p>'; // Clear alerts list


            // Set the Google Maps directions link for the button
            setLiveMapInfoButtonLink(start, end);

            // Display sample road alerts (hardcoded for demo)
            displayRoadAlerts(sampleAlerts);


            // UPDATED PROMPT to request all new data points
            const prompt = `Generate a JSON object containing a detailed traffic briefing for a commute from "${start}" to "${end}" in Kottakkal, Kerala, India. The JSON should have the following fields:
            \`trafficScore\` (an integer from 0 to 10, where 0 is no traffic and 10 is severe congestion),
            \`estimatedTravelTime\` (a concise string describing the estimated travel time, e.g., "25-30 minutes" or "approximately 1 hour"),
            \`mostEfficientRouteDescription\` (a concise textual description of the most efficient route, mentioning key roads or landmarks, under 50 words),
            \`briefingText\` (a general textual summary of the traffic conditions, under 100 words, advising on common congestion issues in Kottakkal),
            \`keyCongestionAreas\` (an array of strings listing specific congestion points, if any, or an empty array if none),
            \`dailyTrafficOutlook\` (an array of 24 objects, each representing an hour of the day from "00:00" to "23:00" and an associated \`score\` (integer from 0 to 10) representing expected traffic congestion for that hour in Kottakkal, based on typical daily patterns),
            \`historicalTrafficTrends\` (an array of 7 objects, each for a day of the week from Monday to Sunday, with an associated \`score\` (integer from 0 to 10) representing the typical average traffic congestion for that day in Kottakkal),
            \`issueDistribution\` (an object with keys "accident", "pothole", "road_block", "other", and integer values representing their simulated percentage distribution of reported issues, summing to 100),
            \`fixedRouteHourlyTravelTimes\` (an array of 24 objects for the route from "Kottakkal Bus Stand" to "Kottakkal Ayurveda Hospital", each with an \`hour\` (e.g., "06:00") and \`travelTimeMinutes\` (integer) representing typical travel time),
            \`alternativeRoutesComparison\` (an array of 2-3 objects, each with a \`routeName\` (string, e.g., "Main Road Route"), \`estimatedTimeMinutes\` (integer), and \`trafficScore\` (integer from 0-10) for alternative routes between "${start}" and "${end}").
            Focus on helpful advice and typical traffic patterns for Kottakkal.`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = {
                contents: chatHistory,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "trafficScore": { "type": "INTEGER" },
                            "estimatedTravelTime": { "type": "STRING" },
                            "mostEfficientRouteDescription": { "type": "STRING" },
                            "briefingText": { "type": "STRING" },
                            "keyCongestionAreas": { "type": "ARRAY", "items": { "type": "STRING" } },
                            "dailyTrafficOutlook": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": { "hour": { "type": "STRING" }, "score": { "type": "INTEGER" } }
                                }
                            },
                            "historicalTrafficTrends": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": { "day": { "type": "STRING" }, "score": { "type": "INTEGER" } }
                                }
                            },
                            "issueDistribution": {
                                "type": "OBJECT",
                                "properties": {
                                    "accident": { "type": "INTEGER" },
                                    "pothole": { "type": "INTEGER" },
                                    "road_block": { "type": "INTEGER" },
                                    "other": { "type": "INTEGER" }
                                }
                            },
                            "fixedRouteHourlyTravelTimes": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": { "hour": { "type": "STRING" }, "travelTimeMinutes": { "type": "INTEGER" } }
                                }
                            },
                            "alternativeRoutesComparison": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "routeName": { "type": "STRING" },
                                        "estimatedTimeMinutes": { "type": "INTEGER" },
                                        "trafficScore": { "type": "INTEGER" }
                                    }
                                }
                            }
                        },
                        "required": ["trafficScore", "estimatedTravelTime", "mostEfficientRouteDescription", "briefingText", "keyCongestionAreas", "dailyTrafficOutlook", "historicalTrafficTrends", "issueDistribution", "fixedRouteHourlyTravelTimes", "alternativeRoutesComparison"]
                    }
                }
            };

            const geminiApiKey = "AIzaSyAOew8jVpBMTP-P6vuj7CryfQjzWTPLFsI"; // The API key is automatically provided by the Canvas environment.

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const jsonString = result.candidates[0].content.parts[0].text;
                    try {
                        const briefingData = JSON.parse(jsonString);
                        const {
                            trafficScore,
                            estimatedTravelTime,
                            mostEfficientRouteDescription,
                            briefingText,
                            keyCongestionAreas,
                            dailyTrafficOutlook,
                            historicalTrafficTrends, // New data
                            issueDistribution,       // New data
                            fixedRouteHourlyTravelTimes, // New data
                            alternativeRoutesComparison // New data
                        } = briefingData;

                        // Update route-specific traffic chart
                        updateTrafficChart(trafficScore);

                        // Update new summary details
                        briefingSummary.innerHTML = `
                            <p class="font-semibold text-lg mb-2">Estimated Travel Time: <span class="text-blue-900">${estimatedTravelTime}</span></p>
                            <p class="font-semibold text-lg mb-4">Most Efficient Route: <span class="text-blue-900">${mostEfficientRouteDescription}</span></p>
                        `;

                        // Update general briefing text
                        briefingTextContent.innerHTML = `<p>${briefingText}</p>`;

                        // Update key congestion areas
                        if (keyCongestionAreas && keyCongestionAreas.length > 0) {
                            keyCongestionAreasDiv.innerHTML = `<h3 class="font-semibold text-blue-800 mt-4 mb-2">Key Congestion Areas:</h3><ul class="list-disc list-inside">` +
                                keyCongestionAreas.map(area => `<li>${area}</li>`).join('') + `</ul>`;
                        } else {
                            keyCongestionAreasDiv.innerHTML = `<p class="text-blue-500 mt-4">No specific congestion areas highlighted.</p>`;
                        }

                        // Update daily traffic outlook chart
                        if (dailyTrafficOutlook && dailyTrafficOutlook.length === 24) {
                            updateDailyTrafficChart(dailyTrafficOutlook);
                        } else {
                            console.warn("Daily traffic outlook data is missing or incomplete.", dailyTrafficOutlook);
                            document.getElementById('dailyTrafficChart').getContext('2d').clearRect(0, 0, document.getElementById('dailyTrafficChart').width, document.getElementById('dailyTrafficChart').height);
                        }

                        // New: Update historical traffic chart
                        if (historicalTrafficTrends && historicalTrafficTrends.length > 0) {
                            updateHistoricalTrafficChart(historicalTrafficTrends);
                        } else {
                            console.warn("Historical traffic trends data is missing or incomplete.", historicalTrafficTrends);
                            document.getElementById('historicalTrafficChart').getContext('2d').clearRect(0, 0, document.getElementById('historicalTrafficChart').width, document.getElementById('historicalTrafficChart').height);
                        }

                        // New: Update issue distribution chart
                        if (issueDistribution && Object.keys(issueDistribution).length > 0) {
                            updateIssueDistributionChart(issueDistribution);
                        } else {
                            console.warn("Issue distribution data is missing or incomplete.", issueDistribution);
                            document.getElementById('issueDistributionChart').getContext('2d').clearRect(0, 0, document.getElementById('issueDistributionChart').width, document.getElementById('issueDistributionChart').height);
                        }

                        // New: Update fixed route hourly travel chart
                        if (fixedRouteHourlyTravelTimes && fixedRouteHourlyTravelTimes.length === 24) {
                            updateFixedRouteHourlyTravelChart(fixedRouteHourlyTravelTimes);
                        } else {
                            console.warn("Fixed route hourly travel times data is missing or incomplete.", fixedRouteHourlyTravelTimes);
                            document.getElementById('fixedRouteTravelChart').getContext('2d').clearRect(0, 0, document.getElementById('fixedRouteTravelChart').width, document.getElementById('fixedRouteTravelChart').height);
                        }

                        // New: Update alternative routes comparison chart
                        if (alternativeRoutesComparison && alternativeRoutesComparison.length > 0) {
                            updateAlternativeRoutesChart(alternativeRoutesComparison);
                        } else {
                            console.warn("Alternative routes comparison data is missing or incomplete.", alternativeRoutesComparison);
                            document.getElementById('alternativeRoutesChart').getContext('2d').clearRect(0, 0, document.getElementById('alternativeRoutesChart').width, document.getElementById('alternativeRoutesChart').height);
                        }


                    } catch (parseError) {
                        briefingSummary.innerHTML = '';
                        briefingTextContent.innerHTML = '<p class="text-red-500">Failed to parse briefing data. Please try again.</p>';
                        dailyTrafficPanel.classList.add('hidden');
                        mapPreviewPanel.classList.add('hidden');
                        historicalTrafficPanel.classList.add('hidden'); // Hide new panels on parse error
                        issueDistributionPanel.classList.add('hidden');
                        fixedRouteTravelPanel.classList.add('hidden');
                        alternativeRoutesPanel.classList.add('hidden');
                        roadAlertsPanel.classList.add('hidden'); // Hide alerts panel on parse error
                        console.error("Error parsing Gemini API JSON response:", parseError, jsonString);
                    }
                } else {
                    briefingSummary.innerHTML = '';
                    briefingTextContent.innerHTML = '<p class="text-red-500">Failed to generate briefing. Please try again.</p>';
                    dailyTrafficPanel.classList.add('hidden');
                    mapPreviewPanel.classList.add('hidden');
                    historicalTrafficPanel.classList.add('hidden'); // Hide new panels on API response error
                    issueDistributionPanel.classList.add('hidden');
                    fixedRouteTravelPanel.classList.add('hidden');
                    alternativeRoutesPanel.classList.add('hidden');
                    roadAlertsPanel.classList.add('hidden'); // Hide alerts panel on API response error
                    console.error("Gemini API response structure unexpected:", result);
                }
            } catch (error) {
                briefingSummary.innerHTML = '';
                briefingTextContent.innerHTML = '<p class="text-red-500">Error connecting to briefing service. Please check your network.</p>';
                dailyTrafficPanel.classList.add('hidden');
                mapPreviewPanel.classList.add('hidden');
                historicalTrafficPanel.classList.add('hidden'); // Hide new panels on network error
                issueDistributionPanel.classList.add('hidden');
                fixedRouteTravelPanel.classList.add('hidden');
                alternativeRoutesPanel.classList.add('hidden');
                roadAlertsPanel.classList.add('hidden'); // Hide alerts panel on network error
                console.error("Error fetching Gemini API:", error);
            }
        }

        // Event listener for image file input change
        document.addEventListener('DOMContentLoaded', () => {
            const issueImageInput = document.getElementById('issue-image');
            const reportImagePreview = document.getElementById('report-image-preview');
            const submitReportButton = document.getElementById('submit-report');
            const reportMessageDiv = document.getElementById('report-message');
            const loginControllerButton = document.getElementById('login-controller-button'); // Get the new button

            issueImageInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        reportImagePreview.src = e.target.result;
                        reportImagePreview.style.display = 'block'; // Show the image preview
                    };
                    reader.readAsDataURL(file);
                } else {
                    reportImagePreview.src = '#';
                    reportImagePreview.style.display = 'none'; // Hide if no file selected
                }
            });

            submitReportButton.addEventListener('click', () => {
                const issueType = document.getElementById('issue-type').value;
                const issueDescription = document.getElementById('issue-description').value;
                const issueLocation = document.getElementById('issue-location').value; // Get the new location field
                const issueImage = document.getElementById('issue-image').files[0];

                if (!issueType) {
                    reportMessageDiv.className = 'mt-4 text-center text-red-700';
                    reportMessageDiv.textContent = 'Please select an issue type.';
                    reportMessageDiv.classList.remove('hidden');
                    return;
                }

                // Construct report details for display
                let reportDetails = `Report submitted successfully! Thank you for your contribution.<br>`;
                reportDetails += `Issue Type: ${issueType}<br>`;
                if (issueDescription) reportDetails += `Description: ${issueDescription}<br>`;
                if (issueLocation) reportDetails += `Location: ${issueLocation}<br>`;
                if (issueImage) reportDetails += `Image: ${issueImage.name}<br>`;


                // Simulate report submission for hackathon demo
                reportMessageDiv.className = 'mt-4 text-center text-green-700';
                reportMessageDiv.innerHTML = reportDetails; // Use innerHTML for line breaks
                reportMessageDiv.classList.remove('hidden');

                // Clear the form after submission
                document.getElementById('issue-type').value = '';
                document.getElementById('issue-description').value = '';
                document.getElementById('issue-location').value = ''; // Clear the new location field
                document.getElementById('issue-image').value = ''; // Clear file input
                reportImagePreview.src = '#';
                reportImagePreview.style.display = 'none'; // Hide image preview

                // Hide message after a few seconds
                setTimeout(() => {
                    reportMessageDiv.classList.add('hidden');
                }, 5000);
            });

            // Attach event listener for the briefing button
            document.getElementById("get-briefing").addEventListener("click", getTrafficBriefing);

            
            document.getElementById("login-controller-button").addEventListener("click", function () {
                window.location.href = "login-page.html"; // Replace with your actual login page URL
            });
        });
