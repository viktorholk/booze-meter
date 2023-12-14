function createChart(id, options) {
  const chartContext = document.getElementById(id);

  return new Chart(chartContext, {
    type: 'bar',
    data: {
      datasets: [
        {
          type: 'line',
          label: 'BAC',
          data: options.calculations,
          fill: false,
          borderColor: '#fff',
          borderWidth: 2
        },
        {
          type: 'bar',
          label: 'Amount of Drinks',
          data: options.entries,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ],
      labels: options.hours.map((hour) => `${hour}:00`)
    },
    options: {
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        y: {
          ticks: {
            color: '#fff',
            font: {}
          }
        },
        x: {
          ticks: {
            color: '#fff',
            font: {}
          }
        }
      },

      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#fff'
          }
        }
      }
    }
  });
}
