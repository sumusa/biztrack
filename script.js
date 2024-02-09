// SIDEBAR TOGGLE

let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

window.onload = function () {
  const expenses = JSON.parse(localStorage.getItem('bizTrackTransactions')) || [];
  const revenues = JSON.parse(localStorage.getItem('bizTrackOrders')) || [];

  const totalExpenses = calculateExpTotal(expenses);
  const totalRevenues = calculateRevTotal(revenues);
  const totalBalance = totalRevenues - totalExpenses;
  const numOrders = revenues.length;

  const revDiv = document.getElementById('rev-amount');
  const expDiv = document.getElementById('exp-amount');
  const balDiv = document.getElementById('balance');
  const ordDiv = document.getElementById('num-orders');

  revDiv.innerHTML = `
      <span class="title">Revenue</span>
      <span class="amount-value">$${totalRevenues.toFixed(2)}</span> 
  `;

  expDiv.innerHTML = `
    <span class="title">Expenses</span>
    <span class="amount-value">$${totalExpenses.toFixed(2)}</span>
  `;

  balDiv.innerHTML = `
    <span class="title">Net Balance</span>
    <span class="amount-value">$${totalBalance.toFixed(2)}</span>
  `;

  ordDiv.innerHTML = `
    <span class="title">Orders</span>
    <span class="amount-value">${numOrders}</span>
  `;
};

function calculateExpTotal(transactions) {
  return transactions.reduce((total, transaction) => total + transaction.trAmount, 0);
}
function calculateRevTotal(orders) {
  return orders.reduce((total, order) => total + order.orderTotal, 0);
}


// ---------- CHARTS ----------

// BAR CHART

function calculateCategorySales(products) {
  const categorySales = {};

  products.forEach(product => {
    const category = product.prodCat;

    if (!categorySales[category]) {
      categorySales[category] = 0;
    }

    categorySales[category] += product.prodPrice * product.prodSold;
  });

  return categorySales;
}


function initializeChart() {
  const items = JSON.parse(localStorage.getItem('bizTrackProducts')) || [];
  const categorySalesData = calculateCategorySales(items);

  const sortedCategorySales = Object.entries(categorySalesData)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  const barChartOptions = {
      series: [{
          name: "Total Sales",
          data: Object.values(sortedCategorySales),
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {show: false},
      },
      colors: ['#247BA0', '#A37A74', '#249672', '#e49273', '#9AADBF'],
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 3,
          horizontal: false,
          columnWidth: '50%',
          },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      fill: {
        opacity: 0.7,
      },
      xaxis: {
        categories: Object.keys(sortedCategorySales),
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        title: {
          text: 'Total Sales ($)',
        },
        axisTicks: {
          show: false,
        },
      },
    };
    
  const barChart = new ApexCharts(
    document.querySelector('#bar-chart'), barChartOptions
  );
  barChart.render();





  // AREA CHART
const areaChartOptions = {
    series: [
      {
        name: 'Revenue',
        data: [35, 40, 28, 51, 42, 109, 100],
      },
      {
        name: 'Expenses',
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    colors: ['#e49273', '#247BA0'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024'],
    markers: {
      size: 0,
    },
    yaxis: [
      {
        title: {
          text: 'Revenue ($)',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Expenses ($)',
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
    },
  };
  
  const areaChart = new ApexCharts(
    document.querySelector('#area-chart'),
    areaChartOptions
  );
  areaChart.render();
};