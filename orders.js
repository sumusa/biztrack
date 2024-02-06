
function openForm() {
    var form = document.getElementById("order-form")
    form.style.display = (form.style.display === "block") ? "none" : "block";
}

function closeForm() {
    document.getElementById("order-form").style.display = "none";
}

let orders = [];

function init() {
  const storedOrders = localStorage.getItem("bizTrackOrders");
  if (storedOrders) {
      orders = JSON.parse(storedOrders);
  } else {
      orders = [
        {
            orderID: "1001",
            orderDate: "2024-01-05",
            itemName: "Baseball caps",
            itemPrice: 25.00,
            qtyBought: 2,
            shipping: 2.50,
            taxes: 9.00,
            orderTotal: 61.50,
            orderStatus: "Pending"
        },
        {
            orderID: "1002",
            orderDate: "2024-03-05",
            itemName: "Water bottles",
            itemPrice: 17.00,
            qtyBought: 3,
            shipping: 3.50,
            taxes: 6.00,
            orderTotal: 40.50,
            orderStatus: "Being Fulfilled"
        },
        {
            orderID: "1003",
            orderDate: "2024-02-05",
            itemName: "Tote bags",
            itemPrice: 20.00,
            qtyBought: 4,
            shipping: 2.50,
            taxes: 2.00,
            orderTotal: 30.50,
            orderStatus: "Shipped"
        },
        {
            orderID: "1004",
            orderDate: "2023-01-05",
            itemName: "Canvas prints",
            itemPrice: 55.00,
            qtyBought: 1,
            shipping: 2.50,
            taxes: 19.00,
            orderTotal: 21.50,
            orderStatus: "Delivered"
        },
        {
            orderID: "1005",
            orderDate: "2024-01-15",
            itemName: "Beanies",
            itemPrice: 15.00,
            qtyBought: 2,
            shipping: 3.90,
            taxes: 4.00,
            orderTotal: 11.50,
            orderStatus: "Pending"
        },
      ];

      localStorage.setItem("bizTrackOrders", JSON.stringify(orders));
    }

    renderOrders(orders);
}


function newOrder(event) {
  event.preventDefault();
  const orderID = document.getElementById("order-id").value;
  const orderDate = document.getElementById("order-date").value;
  const itemName = document.getElementById("item-name").value;
  const itemPrice = parseFloat(document.getElementById("item-price").value);
  const qtyBought = parseInt(document.getElementById("qty-bought").value);
  const shipping = parseFloat(document.getElementById("shipping").value);
  const taxes = parseFloat(document.getElementById("taxes").value);
  const orderTotal = ((itemPrice * qtyBought) + shipping + taxes);
  const orderStatus = document.getElementById("order-status").value;

  if (isDuplicateID(orderID, null)) {
    alert("Order ID already exists. Please use a unique ID.");
    return;
  }

  const order = {
    orderID,
    orderDate,
    itemName,
    itemPrice,
    qtyBought,
    shipping,
    taxes,
    orderTotal,
    orderStatus,
  };

  orders.push(order);

  renderOrders(orders);
  localStorage.setItem("bizTrackOrders", JSON.stringify(orders));

  document.getElementById("order-form").reset();
}

function renderOrders(orders) {
  const orderTableBody = document.getElementById("tableBody");
  orderTableBody.innerHTML = "";

  const orderToRender = orders;

  orderToRender.forEach(order => {
      const orderRow = document.createElement("tr");
      orderRow.className = "order-row";

      orderRow.dataset.orderID = order.orderID;
      orderRow.dataset.orderDate = order.orderDate;
      orderRow.dataset.itemName = order.itemName;
      orderRow.dataset.itemPrice = order.itemPrice;
      orderRow.dataset.qtyBought = order.qtyBought;
      orderRow.dataset.shipping = order.shipping;
      orderRow.dataset.taxes = order.taxes;
      orderRow.dataset.orderTotal = order.orderTotal;
      orderRow.dataset.orderStatus = order.orderStatus;

      orderRow.innerHTML = `
        <td>${order.orderID}</td>
        <td>${order.orderDate}</td>
        <td>${order.itemName}</td>
        <td>$${order.itemPrice.toFixed(2)}</td>
        <td>${order.qtyBought}</td>
        <td>$${order.shipping.toFixed(2)}</td>
        <td>$${order.taxes.toFixed(2)}</td>
        <td>$${order.orderTotal.toFixed(2)}</td>
        <td>
            <div class="status"><span>${order.orderStatus}</span></div>
        </td>
        <td class="action">
            <button class="edit-icon" onclick="editRow('${order.orderID}')">Edit</button>
            <i onclick="deleteOrder('${order.orderID}')" class="delete-icon fas fa-trash-alt"></i>
          </td> 
      `;
      orderTableBody.appendChild(orderRow);
  });
  // updateSummary();
}

function editRow(orderID) {
  const orderToEdit = orders.find(order => order.orderID === orderID);

  // Pre-fill the form fields with the existing data for editing
  document.getElementById("order-id").value = orderToEdit.orderID;
  document.getElementById("order-date").value = orderToEdit.orderDate;
  document.getElementById("item-name").value = orderToEdit.itemName;
  document.getElementById("item-price").value = orderToEdit.itemPrice;
  document.getElementById("qty-bought").value = orderToEdit.qtyBought;
  document.getElementById("shipping").value = orderToEdit.shipping;
  document.getElementById("taxes").value = orderToEdit.taxes;
  document.getElementById("order-total").value = orderToEdit.orderTotal;
  document.getElementById("order-status").value = orderToEdit.orderStatus;

  // Change the submit button to update mode
  document.getElementById("submitBtn").textContent = "Update";
  document.getElementById("submitBtn").onclick = function() {
      updateOrder(orderID);
  };

  document.getElementById("order-form").style.display = "block";
}

function deleteOrder(orderID) {
  // Find the index of the order with the given orderID
  const indexToDelete = orders.findIndex(order => order.orderID === orderID);

  // If the order is found, remove it from the array
  if (indexToDelete !== -1) {
      orders.splice(indexToDelete, 1);

      localStorage.setItem("bizTrackOrders", JSON.stringify(orders));

      renderOrders(orders);
  }
}

function updateOrder(orderID) {
    const indexToUpdate = orders.findIndex(order => order.orderID === orderID);

    if (indexToUpdate !== -1) {
        const updatedOrder = {
            orderID: document.getElementById("order-id").value,
            orderDate: document.getElementById("order-date").value,
            itemName: document.getElementById("item-name").value,
            itemPrice: parseFloat(document.getElementById("item-price").value),
            qtyBought: parseInt(document.getElementById("qty-bought").value),
            shipping: parseFloat(document.getElementById("shipping").value),
            taxes: parseFloat(document.getElementById("taxes").value),
            orderTotal: ((itemPrice * qtyBought) + shipping + taxes),
            orderStatus: document.getElementById("order-status").value,
        };

        // Check for duplicate order IDs
        if (isDuplicateID(updatedOrder.orderID, orderID)) {
            alert("Order ID already exists. Please use a unique ID.");
            return;
        }

        orders[indexToUpdate] = updatedOrder;

        localStorage.setItem("bizTrackOrders", JSON.stringify(orders));

        renderOrders(orders);

        // Reset the form and change the submit button back to add mode
        document.getElementById("order-form").reset();
        document.getElementById("submitBtn").textContent = "Done";
        document.getElementById("submitBtn").onsubmit = newOrder;
    }
}

function isDuplicateID(orderID, currentID) {
    // Check if the provided orderID already exists in the orders array, excluding the current ID
    return orders.some(order => order.orderID === orderID && order.orderID !== currentID);
}

function sortTable(column) {
    const tbody = document.getElementById("tableBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const isNumeric = column === "itemPrice" || column === "qtyBought" || column === "shipping"|| column === "taxes";

    const sortedRows = rows.sort((a, b) => {
        const aValue = isNumeric ? parseFloat(a.dataset[column]) : a.dataset[column];
        const bValue = isNumeric ? parseFloat(b.dataset[column]) : b.dataset[column];

        if (typeof aValue === "string" && typeof bValue === "string") {
            // Case-insensitive string comparison for text columns
            return aValue.localeCompare(bValue, undefined, { sensitivity: "base" });
        } else {
            return aValue - bValue;
        }
    });

    rows.forEach(row => tbody.removeChild(row));

    sortedRows.forEach(row => tbody.appendChild(row));
}

document.getElementById("searchInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        performSearch();
    }
});


function performSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll(".order-row");

    rows.forEach(row => {
        const visible = row.innerText.toLowerCase().includes(searchInput);
        row.style.display = visible ? "table-row" : "none";
    });
}

function exportToCSV() {
    const table = document.getElementById("order-table");
    const rows = table.querySelectorAll("tbody tr");

    const csvContent = [];
    
    // Header row
    const header = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent);
    // Exclude the last column from the header
    header.pop();
    csvContent.push(header.join(','));

    // Data rows
    rows.forEach(row => {
        const rowData = Array.from(row.children).map(cell => cell.textContent);
        // Exclude the last column from each data row
        rowData.pop();
        csvContent.push(rowData.join(','));
    });

    // Combine rows into a CSV string
    const csvString = csvContent.join('\n');

    // Create a Blob object and initiate a download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'biztrack_order_table.csv';
    link.click();
}

// Initialize the page
init();