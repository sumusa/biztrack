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

function productForm() {
  document.getElementById("product-form").style.display = "block";
}

function closeForm() {
  document.getElementById("product-form").style.display = "none";
}

// ---------- CHARTS ----------

// BAR CHART
const barChartOptions = {
    series: [{
        name: "Orders",
        data: [45, 30, 25, 15, 10],
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
    xaxis: {
      categories: ['Hats', 'Sweatshirts', 'Mugs', 'Tshirts', 'Wall Arts'],
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Total Number of Orders',
      },
      axisTicks: {
        show: false,
      },
    },
  };
  
  const barChart = new ApexCharts(
    document.querySelector('#bar-chart'),
    barChartOptions
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