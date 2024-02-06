
function openForm() {
    var form = document.getElementById("product-form")
    form.style.display = (form.style.display === "block") ? "none" : "block";
}

function closeForm() {
    document.getElementById("product-form").style.display = "none";
}

let products = [];

function init() {
  const storedProducts = localStorage.getItem("bizTrackProducts");
  if (storedProducts) {
      products = JSON.parse(storedProducts);
  } else {
      products = [
        {
          prodID: "PD001",
          prodName: "Baseball caps",
          prodDesc: "Peace embroidered cap",
          prodCat: "Hat",
          prodPrice: 25.00,
          prodStock: 20
        },
        {
          prodID: "PD002",
          prodName: "Water bottles",
          prodDesc: "Floral lotus printed bottle",
          prodCat: "Drinkware",
          prodPrice: 48.50,
          prodStock: 10
        },
        {
          prodID: "PD003",
          prodName: "Mugs",
          prodDesc: "Outdoor enamel mug",
          prodCat: "Drinkware",
          prodPrice: 17.50,
          prodStock: 70
        },
        {
          prodID: "PD004",
          prodName: "Posters",
          prodDesc: "Vibes printed poster",
          prodCat: "Home decor",
          prodPrice: 12.00,
          prodStock: 60
        },
        {
          prodID: "PD005",
          prodName: "Pillow cases",
          prodDesc: "Morrocan print pillow case",
          prodCat: "Accessories",
          prodPrice: 17.00,
          prodStock: 40
        },
      ];

      localStorage.setItem("bizTrackProducts", JSON.stringify(products));
    }

    renderProducts(products);
}


function newProduct(event) {
  event.preventDefault();
  const prodID = document.getElementById("product-id").value;
  const prodName = document.getElementById("product-name").value;
  const prodDesc = document.getElementById("product-desc").value;
  const prodCat = document.getElementById("product-cat").value;
  const prodPrice = parseFloat(document.getElementById("product-price").value);
  const prodStock = parseInt(document.getElementById("product-stock").value);

  if (isDuplicateID(prodID, null)) {
    alert("Product ID already exists. Please use a unique ID.");
    return;
  }

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
  localStorage.setItem("bizTrackProducts", JSON.stringify(products));

  document.getElementById("product-form").reset();
}

function renderProducts(products) {
  const prodTableBody = document.getElementById("tableBody");
  prodTableBody.innerHTML = "";

  const prodToRender = products;

  prodToRender.forEach(product => {
      const prodRow = document.createElement("tr");
      prodRow.className = "product-row";

      prodRow.dataset.prodID = product.prodID;
      prodRow.dataset.prodName = product.prodName;
      prodRow.dataset.prodDesc = product.prodDesc;
      prodRow.dataset.prodCat = product.prodCat;
      prodRow.dataset.prodPrice = product.prodPrice;
      prodRow.dataset.prodStock = product.prodStock;

      prodRow.innerHTML = `
          <td>${product.prodID}</td>
          <td>${product.prodName}</td>
          <td>${product.prodDesc}</td>
          <td>${product.prodCat}</td>
          <td>$${product.prodPrice.toFixed(2)}</td>
          <td>${product.prodStock}</td>
          <td class="action">
            <button class="edit-icon" onclick="editRow('${product.prodID}')">Edit</button>
            <i onclick="deleteProduct('${product.prodID}')" class="delete-icon fas fa-trash-alt"></i>
          </td>
      `;
      prodTableBody.appendChild(prodRow);
  });
  // updateSummary();
}

function editRow(prodID) {
  const productToEdit = products.find(product => product.prodID === prodID);

  // Pre-fill the form fields with the existing data for editing
  document.getElementById("product-id").value = productToEdit.prodID;
  document.getElementById("product-name").value = productToEdit.prodName;
  document.getElementById("product-desc").value = productToEdit.prodDesc;
  document.getElementById("product-cat").value = productToEdit.prodCat;
  document.getElementById("product-price").value = productToEdit.prodPrice;
  document.getElementById("product-stock").value = productToEdit.prodStock;

  // Change the submit button to update mode
  document.getElementById("submitBtn").textContent = "Update";
  document.getElementById("submitBtn").onclick = function() {
      updateProduct(prodID);
  };

  document.getElementById("product-form").style.display = "block";
}

function deleteProduct(prodID) {
  // Find the index of the product with the given prodID
  const indexToDelete = products.findIndex(product => product.prodID === prodID);

  // If the product is found, remove it from the array
  if (indexToDelete !== -1) {
      products.splice(indexToDelete, 1);

      localStorage.setItem("bizTrackProducts", JSON.stringify(products));

      renderProducts(products);
  }
}

function updateProduct(prodID) {
    const indexToUpdate = products.findIndex(product => product.prodID === prodID);

    if (indexToUpdate !== -1) {
        const updatedProduct = {
            prodID: document.getElementById("product-id").value,
            prodName: document.getElementById("product-name").value,
            prodDesc: document.getElementById("product-desc").value,
            prodCat: document.getElementById("product-cat").value,
            prodPrice: parseFloat(document.getElementById("product-price").value),
            prodStock: parseInt(document.getElementById("product-stock").value),
        };

        // Check for duplicate product IDs
        if (isDuplicateID(updatedProduct.prodID, prodID)) {
            alert("Product ID already exists. Please use a unique ID.");
            return;
        }

        products[indexToUpdate] = updatedProduct;

        localStorage.setItem("bizTrackProducts", JSON.stringify(products));

        renderProducts(products);

        // Reset the form and change the submit button back to add mode
        document.getElementById("product-form").reset();
        document.getElementById("submitBtn").textContent = "Done";
        document.getElementById("submitBtn").onsubmit = newProduct;
    }
}

function isDuplicateID(prodID, currentID) {
    // Check if the provided prodID already exists in the products array, excluding the current ID
    return products.some(product => product.prodID === prodID && product.prodID !== currentID);
}

function sortTable(column) {
    const tbody = document.getElementById("tableBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const isNumeric = column === "prodPrice" || column === "prodStock";

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
    const rows = document.querySelectorAll(".product-row");

    rows.forEach(row => {
        const visible = row.innerText.toLowerCase().includes(searchInput);
        row.style.display = visible ? "table-row" : "none";
    });
}

function exportToCSV() {
    const table = document.getElementById("product-table");
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
    link.download = 'biztrack_product_table.csv';
    link.click();
}

// Initialize the page
init();