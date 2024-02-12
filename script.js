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
    <span class="title">Balance</span>
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
      tooltip: {
        y: {
          formatter: function (val) {
            return '$' + val.toFixed(2);
          }
        }
      }
    };
    
  const barChart = new ApexCharts(
    document.querySelector('#bar-chart'), barChartOptions
  );
  barChart.render();


  // DONUT CHART

  function calculateCategoryExp(transactions) {
    const categoryExpenses = {};

    transactions.forEach(transaction => {
      const category = transaction.trCategory;

      if (!categoryExpenses[category]) {
        categoryExpenses[category] = 0;
      }

      categoryExpenses[category] += transaction.trAmount;
    });

    return categoryExpenses;
  }

  const expItems = JSON.parse(localStorage.getItem('bizTrackTransactions')) || [];
  const categoryExpData = calculateCategoryExp(expItems);

  const donutChartOptions = {
    series: Object.values(categoryExpData),
    labels: Object.keys(categoryExpData),
    chart: {
      height: 350,
      type: 'donut',
      width: '100%',
      toolbar: {
        show: false,
      },
    },
    colors: ['#00D8B6','#008FFB',  '#FEB019', '#FF4560', '#775DD0'],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        donut: {
          size: '75%',
        },
        offsetY: 20,
      },
      stroke: {
        colors: undefined
      }
    },
    // title: {
    //   text: 'Expenses Category',
    //   style: {
    //     fontSize: '18px'
    //   }
    // },
    legend: {
      position: 'left',
      offsetY: 80,
    }
  };
  
  const donutChart = new ApexCharts(
    document.querySelector('#donut-chart'),
    donutChartOptions
  );
  donutChart.render();
};