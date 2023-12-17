function createChart(id, groupedEntries, calculations) {
  const chartContext = document.getElementById(id);

  return new Chart(chartContext, {
    type: 'bar',
    data: {
      datasets: [
        {
          type: 'line',
          label: 'BAC',
          data: calculations,
          fill: false,
          borderColor: 'rgba(99, 132, 255, 0.8)',
          backgroundColor: 'rgba(99, 132, 255, 1)',
          borderWidth: 2
        },
        {
          type: 'bar',
          label: 'Amount of Drinks',
          data: _.map(groupedEntries, (entries) => _.sumBy(entries, 'amount')),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ],
      labels: _.map(Object.keys(groupedEntries), (d) => moment(d).format('HH:mm'))
    },
    options: {
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'BAC / Amounts',
            color: '#fff'
          },
          ticks: {
            color: '#fff'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time (Hour)',
            color: '#fff'
          },
          ticks: {
            // Highlight the tick being the current hour
            color: (c) => {
              if (c['tick']['label'][0] == new Date().getHours().toString()) {
                return 'rgba(255, 99, 132, 1)';
              } else return '#fff';
            }
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
          // If there is no data, instead of plotting an empty graph, just prompt with No data to display
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
