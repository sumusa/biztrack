
function openSidebar() {
  var side = document.getElementById('sidebar');
  side.style.display = (side.style.display === "block") ? "none" : "block";
}

function closeSidebar() {
  document.getElementById('sidebar').style.display = 'none';
}


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
          prodCat: "Hats",
          prodPrice: 25.00,
          prodSold: 20
        },
        {
          prodID: "PD002",
          prodName: "Water bottles",
          prodDesc: "Floral lotus printed bottle",
          prodCat: "Drinkware",
          prodPrice: 48.50,
          prodSold: 10
        },
        {
          prodID: "PD003",
          prodName: "Sweatshirt",
          prodDesc: "Palestine sweater",
          prodCat: "Clothing",
          prodPrice: 17.50,
          prodSold: 70
        },
        {
          prodID: "PD004",
          prodName: "Posters",
          prodDesc: "Vibes printed poster",
          prodCat: "Home decor",
          prodPrice: 12.00,
          prodSold: 60
        },
        {
          prodID: "PD005",
          prodName: "Pillow cases",
          prodDesc: "Morrocan print pillow case",
          prodCat: "Accessories",
          prodPrice: 17.00,
          prodSold: 40
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
  const prodSold = parseInt(document.getElementById("product-sold").value);

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
    prodSold,
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
      prodRow.dataset.prodSold = product.prodSold;

      prodRow.innerHTML = `
          <td>${product.prodID}</td>
          <td>${product.prodName}</td>
          <td>${product.prodDesc}</td>
          <td>${product.prodCat}</td>
          <td>$${product.prodPrice.toFixed(2)}</td>
          <td>${product.prodSold}</td>
          <td class="action">
            <i title="Edit" onclick="editRow('${product.prodID}')" class="edit-icon fa-solid fa-pen-to-square"></i>
            <i onclick="deleteProduct('${product.prodID}')" class="delete-icon fas fa-trash-alt"></i>
          </td>
      `;
      prodTableBody.appendChild(prodRow);
  });
}

function editRow(prodID) {
  const productToEdit = products.find(product => product.prodID === prodID);

  document.getElementById("product-id").value = productToEdit.prodID;
  document.getElementById("product-name").value = productToEdit.prodName;
  document.getElementById("product-desc").value = productToEdit.prodDesc;
  document.getElementById("product-cat").value = productToEdit.prodCat;
  document.getElementById("product-price").value = productToEdit.prodPrice;
  document.getElementById("product-sold").value = productToEdit.prodSold;

  document.getElementById("submitBtn").textContent = "Update";
  document.getElementById("submitBtn").onclick = function() {
      updateProduct(prodID);
  };

  document.getElementById("product-form").style.display = "block";
}

function deleteProduct(prodID) {
  const indexToDelete = products.findIndex(product => product.prodID === prodID);

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
            prodSold: parseInt(document.getElementById("product-sold").value),
        };

        if (isDuplicateID(updatedProduct.prodID, prodID)) {
            alert("Product ID already exists. Please use a unique ID.");
            return;
        }

        products[indexToUpdate] = updatedProduct;

        localStorage.setItem("bizTrackProducts", JSON.stringify(products));

        renderProducts(products);

        document.getElementById("product-form").reset();
        document.getElementById("submitBtn").textContent = "Done";
        document.getElementById("submitBtn").onsubmit = newProduct;
    }
}

function isDuplicateID(prodID, currentID) {
    return products.some(product => product.prodID === prodID && product.prodID !== currentID);
}

function sortTable(column) {
    const tbody = document.getElementById("tableBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const isNumeric = column === "prodPrice" || column === "prodSold";

    const sortedRows = rows.sort((a, b) => {
        const aValue = isNumeric ? parseFloat(a.dataset[column]) : a.dataset[column];
        const bValue = isNumeric ? parseFloat(b.dataset[column]) : b.dataset[column];

        if (typeof aValue === "string" && typeof bValue === "string") {
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
    const header = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent);
  
    header.pop();
    csvContent.push(header.join(','));

    rows.forEach(row => {
        const rowData = Array.from(row.children).map(cell => cell.textContent);
        // Exclude the last column from each data row
        rowData.pop();
        csvContent.push(rowData.join(','));
    });

    const csvString = csvContent.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'biztrack_product_table.csv';
    link.click();
}

init();