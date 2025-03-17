let financialData = [];
let chart;

document.addEventListener('DOMContentLoaded', () => {
  // Handle form submission
  document.getElementById('financial-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const date = document.getElementById('entry-date').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!date || !category || isNaN(amount)) return;

    // Add the entry to the financial data
    financialData.push({ date, category, amount });

    // Update the chart
    updateChart();

    // Reset the form
    document.getElementById('financial-form').reset();
  });

  // Handle forecast button click
  document.getElementById('forecast-btn').addEventListener('click', () => {
    const growthRate = parseFloat(document.getElementById('growth-rate').value);
    if (isNaN(growthRate)) {
      alert("Please enter a valid growth rate.");
      return;
    }

    const lastEntry = financialData[financialData.length - 1];
    const forecastedRevenue = lastEntry.category === 'revenue' ? lastEntry.amount * (1 + growthRate / 100) : 0;
    const forecastedExpenses = lastEntry.category === 'expenses' ? lastEntry.amount * (1 + growthRate / 100) : 0;

    // Display forecast result
    document.getElementById('forecast-result').textContent = `
      Forecasted Revenue: $${forecastedRevenue.toFixed(2)}, 
      Forecasted Expenses: $${forecastedExpenses.toFixed(2)}
    `;
  });
});

// Function to update chart
function updateChart() {
  const categories = ['revenue', 'expenses'];
  const chartData = {
    labels: financialData.map(entry => entry.date),
    datasets: categories.map(category => {
      const amounts = financialData
        .filter(entry => entry.category === category)
        .map(entry => entry.amount);

      return {
        label: category.charAt(0).toUpperCase() + category.slice(1),
        data: amounts,
        fill: false,
        borderColor: category === 'revenue' ? 'green' : 'red',
        tension: 0.1
      };
    })
  };

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(document.getElementById('financial-chart'), {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Financial Overview'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Amount ($)'
          }
        }
      }
    });
}
