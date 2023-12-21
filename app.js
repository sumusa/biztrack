let orders = [];

// Calculate order for customer details
function calculateCustomerOrder() {
    const customerName = document.getElementById("customerName").value;
    const itemPrice = parseFloat(document.getElementById("itemPrice").value);
    const quantityBought = parseInt(document.getElementById("quantityBought").value);
    const orderDate = new Date().toISOString().slice(0, 10); // Current date

    const totalIncome = itemPrice * quantityBought;

    const order = {
        orderDate,
        customerName,
        itemPrice,
        quantityBought,
        totalIncome
    };

    orders.push(order);

    updateSummary();
    renderOrders();
}

// Calculate order for actual costs
function calculateActualCosts() {
    const customerName = document.getElementById("customerName").value;
    const itemName = document.getElementById("itemName").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const itemCost = parseFloat(document.getElementById("itemCost").value);
    const itemPrice = parseFloat(document.getElementById("itemPrice").value);
    const taxes = parseFloat(document.getElementById("taxes").value);
    const shipping = parseFloat(document.getElementById("shipping").value);
    const otherExpenses = parseFloat(document.getElementById("otherExpenses").value);
    const orderDate = new Date().toISOString().slice(0, 10); // Current date

    const totalExpenses = itemCost + (itemCost * quantity * (taxes / 100)) + shipping + otherExpenses;
    const totalIncome = itemPrice * quantity;

    const profit = totalIncome - totalExpenses;

    const order = {
        customerName,
        itemName,
        quantity,
        totalIncome,
        totalExpenses,
        profit,
        orderDate
    };

    orders.push(order);

    updateSummary();
    renderOrders();
}

function updateSummary() {
    const totalIncome = orders.reduce((total, order) => total + order.totalIncome, 0);
    const totalExpenses = orders.reduce((total, order) => total + order.totalExpenses, 0);
    const profitLoss = totalIncome - totalExpenses;

    document.getElementById("totalIncome").innerText = `$${totalIncome.toFixed(2)}`;
    document.getElementById("totalExpenses").innerText = `$${totalExpenses.toFixed(2)}`;
    document.getElementById("profitLoss").innerText = `$${profitLoss.toFixed(2)}`;
}

function renderOrders(filteredOrders) {
    const orderTableBody = document.querySelector("#ordersTable tbody");
    orderTableBody.innerHTML = "";

    const ordersToRender = filteredOrders || orders;

    ordersToRender.forEach(order => {
        const orderRow = document.createElement("tr");
        orderRow.innerHTML = `
            <td>${order.orderDate}</td>
            <td>${order.customerName}</td>
            <td>${order.itemName}</td>
            <td>${order.quantityBought || order.quantity}</td>
            <td>$${order.totalIncome.toFixed(2)}</td>
            <td>$${order.totalExpenses.toFixed(2)}</td>
            <td>$${order.profit.toFixed(2)}</td>
        `;
        orderTableBody.appendChild(orderRow);
    });

    updateSummary();
}

function saveOrders() {
    localStorage.setItem("bizTrackOrders", JSON.stringify(orders));
    alert("Orders saved!");
}

function loadOrders() {
    const savedOrders = JSON.parse(localStorage.getItem("bizTrackOrders")) || [];
    orders = savedOrders;
    renderOrders();
}

function filterOrdersByDate() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    const filteredOrders = orders.filter(order => order.orderDate >= startDate && order.orderDate <= endDate);

    updateSummary();
    renderOrders(filteredOrders);
}

function exportOrdersToCSV() {
    const ordersToExport = orders.map(order => {
        return {
            OrderDate: order.orderDate,
            CustomerName: order.customerName,
            itemName: order.itemName,
            Quantity: order.quantityBought || order.quantity,
            TotalIncome: order.totalIncome.toFixed(2),
            TotalExpenses: order.totalExpenses.toFixed(2),
            Profit: order.profit.toFixed(2),
        };
    });

    const csvContent = generateCSV(ordersToExport);

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a download link
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'bizTrackOrders.csv';

    // Append the link to the document and trigger a click event
    document.body.appendChild(link);
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
}

function generateCSV(data) {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(order => Object.values(order).join(','));

    return `${headers}\n${rows.join('\n')}`;
}

