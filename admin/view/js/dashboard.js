let dashboardid
let dashboardMembershipData
let dashboardSavingsData
let dashboardLoanData
let dashboardRotaryData
let dashboardPropertyData
let dashboardPersonalData
let lastTenTransactions; 
let dashboardUserId;
let dashboardAllUsers;
let normalDashboard = true

async function dashboardActive() {
  // Dummy data
  const products = [
    { name: "Organic Honey", category: "Groceries", price: 15.99, stock: 24 },
    { name: "Almond Milk", category: "Beverages", price: 4.49, stock: 10 },
    { name: "Steel Shovel", category: "Tools", price: 29.99, stock: 3 },
    { name: "Garden Hose", category: "Tools", price: 19.99, stock: 12 },
  ];

  const categories = [
    { name: "Groceries", count: 1 },
    { name: "Beverages", count: 1 },
    { name: "Tools", count: 2 },
  ];

  // Populate counts
  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalCategories").textContent = categories.length;
  document.getElementById("lowStockCount").textContent =
    products.filter((p) => p.stock < 5).length;
  document.getElementById("draftCount").textContent = 0;

  // Render product rows
  const productRows = document.getElementById("productRows");
  productRows.innerHTML = products
    .map(
      (p) => `
    <tr class="bg-white shadow rounded-lg">
      <td class="px-4 py-3">${p.name}</td>
      <td class="px-4 py-3">${p.category}</td>
      <td class="px-4 py-3">$${p.price.toFixed(2)}</td>
      <td class="px-4 py-3 ${p.stock < 5 ? "text-red-600 font-semibold" : ""}">${
        p.stock
      }</td>
    </tr>`
    )
    .join("");

  // Render category rows
  const categoryRows = document.getElementById("categoryRows");
  categoryRows.innerHTML = categories
    .map(
      (c) => `
    <tr class="bg-white shadow rounded-lg">
      <td class="px-4 py-3">${c.name}</td>
      <td class="px-4 py-3">${c.count}</td>
    </tr>`
    )
    .join("");

  // Tabs logic
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("text-primary", "border-primary");
        b.classList.add("text-gray-600", "border-transparent");
      });
      btn.classList.add("text-primary", "border-primary");
      // Show correct tab
      const tab = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.add("hidden"));
      document.getElementById(tab).classList.remove("hidden");
    });
  });

  // ChartJS – simple demo data
  const ctx = document.getElementById("salesChart");
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Sales ($)",
          data: [120, 90, 150, 110, 220, 80, 60],
          borderRadius: 4,
          backgroundColor: tailwindColors.primary.DEFAULT,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: { backdropPadding: 4 },
          grid: { color: "#f3f4f6" },
        },
        x: { grid: { display: false } },
      },
    },
  });

  // Search filter
  document.getElementById("globalSearch").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    Array.from(productRows.children).forEach((row) => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none";
    });
  });
}
