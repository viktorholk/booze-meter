
const ctx = document.getElementById('myChart');

const data = {
    gender: 0,
    weight: 80,
    entries: [
        { amount: 3, date: new Date("01/01/2024 09:00") },
        { amount: 1, date: new Date("01/01/2024 10:00") },
        { amount: 2, date: new Date("01/01/2024 13:00") },
        { amount: 1, date: new Date("01/01/2024 15:00") },
    ]
};

function calculateBAC(gender, amount, weight) {
    const widmarkFactor = gender === 0 ? 0.68 : 0.55;
    return Math.max((amount * 12) / (weight * widmarkFactor), 0);
}

function generateDatasets(entry) {
    const hours = _.range(0, 24); // Create an array representing all hours in a day
    const metabolismRate = 0.015;

    
    // Generate bar set (Amount of drinks)
    const amountPerHour = hours.map(hour => {
        const entriesForHour = entry.entries.filter(e => e.date.getHours() === hour);
        return _.sumBy(entriesForHour, 'amount');
    });

    const datasets = [];

    for (let i = 0; i < hours.length; i++) {
        let BAC = 0;

        if (amountPerHour[i] > 0) {
            BAC = calculateBAC(entry.gender, amountPerHour[i], entry.weight);

            if (i > 0) {
                const previousBAC = datasets[i - 1] || 0;
                BAC += previousBAC;
                BAC -= metabolismRate * (hours[i] - hours[i - 1]);
            }
        } else if (i > 0) {
            // If no drinks were consumed during this hour, but it's not the first hour,
            // then decrease BAC due to metabolism
            BAC = datasets[i - 1] - metabolismRate;
        }

        // Store the BAC values in an array for later use in the chart
        datasets.push(Math.max(BAC, 0));
    }

    return { hours, amountPerHour, datasets };
}

const { hours, amountPerHour, datasets } = generateDatasets(data);

const chartData = {
    datasets: [
        {
            type: 'bar',
            label: 'Amount of Drinks',
            data: amountPerHour,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        },
        {
            type: 'line',
            label: 'BAC',
            data: datasets,
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
        }
    ],
    labels: hours.map(hour => `${hour}:00`)
};

const mixedChart = new Chart(ctx, {
    type: 'bar',
    data: chartData
});
