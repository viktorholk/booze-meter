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
    },
    plugins: [
      {
        afterDraw: function (chart) {
          if (chart.data.datasets[0].data.length == 0) {
            let ctx = chart.ctx;
            let width = chart.width;
            let height = chart.height;

            chart.clear();
            ctx.save();
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.fillText('No data to display', width / 2, height / 2);
            ctx.restore();
          }
        }
      }
    ]
  });
}
