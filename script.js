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


const products = [
  {prodID: "PD001",
  prodName: "Hat",
  prodDesc: "Trucker Hat",
  prodCat: "Clothing",
  prodPrice: 25.00,
  prodStock: 20,
}];

function newProduct(event) {
  event.preventDefault()
  const prodID = document.getElementById("product-id").value;
  const prodName = document.getElementById("product-name").value;
  const prodDesc = document.getElementById("product-desc").value;
  const prodCat = document.getElementById("product-cat").value;
  const prodPrice = parseFloat(document.getElementById("product-price").value);
  const prodStock = parseInt(document.getElementById("product-stock").value);

  const product = {
    prodID,
    prodName,
    prodDesc,
    prodCat,
    prodPrice,
    prodStock,
  };

  products.push(product);

  renderProducts(products);

  document.getElementById("product-form").reset();
  // // Get the table reference
  // const table = document.getElementById("product-table");

  // // Insert a new row at the end of the table
  // const newRow = table.insertRow(table.rows.length);

  // // Insert cells in the new row
  // const cell1 = newRow.insertCell(0);
  // const cell2 = newRow.insertCell(1);
  // const cell3 = newRow.insertCell(2);
  // const cell4 = newRow.insertCell(3);
  // const cell5 = newRow.insertCell(4);
  // const cell6 = newRow.insertCell(5);

  // // Populate cells with form values
  // cell1.innerHTML = prodID;
  // cell2.innerHTML = prodDesc;
  // cell3.innerHTML = prodCat;
  // cell4.innerHTML = prodPrice;
  // cell5.innerHTML = prodStock;

  // const editIcon = document.getElementById("edit-icon").cloneNode(true);
  // cell6.appendChild(editIcon);

  // const deleteIcon = document.getElementById("delete-icon").cloneNode(true);
  // cell6.appendChild(deleteIcon);

  // // Clear form fields
  // document.getElementById("product-form").reset();
}

function renderProducts(products) {
  const prodTableBody = document.getElementById("tableBody");
  prodTableBody.innerHTML = "";

  const prodToRender = products;

  prodToRender.forEach(product => {
      const prodRow = document.createElement("tr");
      prodRow.innerHTML = `
          <td>${product.prodID}</td>
          <td>${product.prodName}</td>
          <td>${product.prodDesc}</td>
          <td>${product.prodCat}</td>
          <td>$${product.prodPrice.toFixed(2)}</td>
          <td>${product.prodStock}</td>
          <td class="action">
            <button class="edit-icon">Edit</button>
            <i onclick="deleteProduct("${product.prodID}")" class="delete-icon fas fa-trash-alt"></i>
          </td>
      `;
      prodTableBody.appendChild(prodRow);
  });
  // updateSummary();
}

function deleteProduct(prodID) {
  products = products.filter(product => product.prodID != prodID);

  renderProducts(products);
}

// const editButton = document.getElementById("edit-icon");
// editButton.onclick = function() {
//     toggleEditMode(row);
// };

// function toggleEditMode(row) {
//   // Toggle the edit mode for the row
//   row.classList.toggle("edit-mode");

//   // If in edit mode, convert text content to input/select elements
//   const cells = row.cells;
//   for (let i = 0; i < cells.length - 1; i++) {
//       const cell = cells[i];
//       const currentValue = cell.textContent;

//       // Create input or select element based on cell content
//       const inputElement = (cell.children[0] && cell.children[0].tagName === "SELECT") ?
//           document.createElement("select") : document.createElement("input");

//       inputElement.type = "text";
//       inputElement.value = currentValue;

//       // Append the input or select element to the cell
//       cell.innerHTML = '';
//       cell.appendChild(inputElement);
//   }
// }

// ---------- CHARTS ----------

// BAR CHART
function initializeChart() {
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
};