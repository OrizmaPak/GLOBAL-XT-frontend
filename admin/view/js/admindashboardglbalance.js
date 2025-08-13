// Use this script to fetch GL data, build the UI, and display transaction modals.

let admindashboardglbalanceid; 
let GL_DATA = {}; // We'll store the fetched data globally here

async function admindashboardglbalanceActive() {
  admindashboardglbalanceid = '';
  await fetchadmindashboardglbalance();
  // Optionally: setInterval(fetchadmindashboardglbalance, 5000); 
}

async function fetchadmindashboardglbalance() {
  // Show loading state using SweetAlert
  Swal.fire({
    title: 'Please wait...',
    text: 'Fetching admin dashboard GL balance data. This might take a moment, please be patient.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    
    let request = await httpRequest2('api/v1/dashboard/glbalance', null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    Swal.close(); // Close the loading alert

    if (!request.status) {
      return handleError('No records retrieved');
    }

    if (!request.data || Object.keys(request.data).length === 0) {
      return handleEmptyData();
    }

    // Store data globally so we can reference it when user clicks "View Transactions"
    GL_DATA = request.data;

    // Build the UI
    updateStatsRow(GL_DATA);
    updateCards(GL_DATA);

  } catch (error) {
    Swal.close();
    handleError('Error fetching data: ' + error);
  }
}

// Build the quick "stats row" at the top (optional)
function updateStatsRow(data) {
  const statsRow = document.getElementById('statsRow');
  if (!statsRow) return;

  statsRow.innerHTML = '';

  // Example: pick out some interesting accounts to highlight
  const highlightAccounts = [
    'default_cash_account',
    'default_personal_account',
    'default_savings_account',
    'default_property_account',
    'default_rotary_account',
    'default_loan_account',
    'default_excess_account',
    'default_income_account',
  ];

  highlightAccounts.forEach(accKey => {
    const account = data[accKey];
    if (!account) return;

    const card = document.createElement('div');
    card.className = `
      rounded-lg shadow-md p-6 text-center 
      bg-gradient-to-br from-blue-50 to-blue-100
      hover:from-blue-100 hover:to-blue-200
      transition duration-300
    `;

    card.innerHTML = `
      <h3 class="text-md font-semibold text-gray-700">
        ${account.accountName || 'Account'}
      </h3>
      <p class="text-xl font-bold text-gray-800 mt-2">
        ${formatCurrency(account.balance || 0)}
      </p>
    `;
    statsRow.appendChild(card);
  });
}

// Build the main card grid
function updateCards(data) {
  const container = document.getElementById('cardsContainer');
  if (!container) return;

  container.innerHTML = '';

  Object.keys(data).forEach(key => {
    const account = data[key];

    // Card outer wrapper
    const card = document.createElement('div');
    card.className = `
      bg-white rounded-lg shadow-md p-6 
      transition duration-300
      hover:-translate-y-1 hover:shadow-xl
    `;

    // Card content
    card.innerHTML = `
      <div class="mb-2">
        <h2 class="text-xl font-semibold text-gray-800">${account.accountName || 'No Name'}</h2>
        <p class="text-sm text-gray-500">Acct #: ${account.accountNumber || 'N/A'}</p>
      </div>
      <div class="mt-4">
        <p class="text-gray-700"><strong>Balance:</strong> ${formatCurrency(account.balance)}</p>
        <p class="text-gray-700"><strong>Total Credit:</strong> ${formatCurrency(account.totalCredit)}</p>
        <p class="text-gray-700"><strong>Total Debit:</strong> ${formatCurrency(account.totalDebit)}</p>
      </div>
      <button 
        class="mt-5 inline-flex items-center px-3 py-2 bg-indigo-100 hover:bg-indigo-200 
               text-indigo-700 text-sm font-medium rounded 
               transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onclick="showTransactions('${key}')"
      >
        <!-- Eye icon -->
        <svg class="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2C6.13 2 2.48 4.79 1 9c1.48 4.21 5.13 7 9 7s7.52-2.79 9-7c-1.48-4.21-5.13-7-9-7zm0 
                   12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
        </svg>
        View Transactions
      </button>
    `;

    container.appendChild(card);
  });
}

// Show transaction history in a SweetAlert2 modal
function showTransactions(accountKey) {
  const account = GL_DATA[accountKey];
  if (!account) {
    return Swal.fire('Not Found', 'No data found for this account', 'warning');
  }

  const transactions = account.last30DaysTransactions || [];
  if (transactions.length === 0) {
    return Swal.fire({
      title: 'No Transactions',
      text: 'This account has no recent transactions.',
      icon: 'info',
      confirmButtonText: 'Close',
      customClass: {
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
      }
    });
  }

  // Build a table of transactions
  let tableHTML = `
    <div class="overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b bg-gray-50">
          <tr>
            <th class="py-2 px-4 font-semibold">ID</th>
            <th class="py-2 px-4 font-semibold">Date</th>
            <th class="py-2 px-4 font-semibold">Description</th>
            <th class="py-2 px-4 font-semibold">Credit</th>
            <th class="py-2 px-4 font-semibold">Debit</th>
          </tr>
        </thead>
        <tbody>
  `;

  transactions.forEach(tx => {
    tableHTML += `
      <tr class="border-b">
        <td class="py-2 px-4">${tx.id}</td>
        <td class="py-2 px-4">
          ${new Date(tx.transactiondate).toLocaleDateString()}
        </td>
        <td class="py-2 px-4">
          ${tx.description || '-'}
        </td>
        <td class="py-2 px-4">${formatCurrency(tx.credit)}</td>
        <td class="py-2 px-4">${formatCurrency(tx.debit)}</td>
      </tr>
    `;
  });

  tableHTML += `
        </tbody>
      </table>
    </div>
  `;

  Swal.fire({
    title: `Transactions - ${account.accountName}`,
    html: tableHTML,
    width: '80%',
    confirmButtonText: 'Close',
    customClass: { popup: 'text-left' }
  });
}

function handleError(message) {
  Swal.fire('Error', message, 'error');
  const container = document.getElementById('cardsContainer');
  if (container) container.innerHTML = `<div class="text-red-600">${message}</div>`;
}

function handleEmptyData() {
  Swal.fire('No Data', 'No GL balances found.', 'info');
  const container = document.getElementById('cardsContainer');
  if (container) container.innerHTML = `<div class="text-gray-600">No data available.</div>`;
}

// Simple currency formatter (NGN example)
function formatCurrency(value) {
  if (isNaN(value)) return 'N/A';
  return `₦${Number(value).toLocaleString()}`;
}
