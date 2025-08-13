let bulktransactionid;
async function bulktransactionActive() {
    await fetchbulktransaction()
    // Initially populate membership data.
    displayMembershipData();

    console.log("Form html", document.getElementById("bulktransactionform"))
    console.log("View html", document.getElementById("viewbulktransactionform"))
  
    // Get references to our selects.
    const membershipSelect = document.getElementById('membershipSelect');
    const accountTypeSelect = document.getElementById('accountTypeSelect');
    const productSelect = document.getElementById('productSelect');

    productSelect.addEventListener('change', function(e) {
        const productId = e.target.value;
        // Perform actions based on the selected product
        if (productId) {
            console.log(`Selected product ID: ${productId}`);
            // You can add additional logic here, such as enabling/disabling other fields
        } else {
            console.log('No product selected');
            // Handle the case where no product is selected
        }
    });
  
    // When a membership is selected, populate the account type dropdown.
    membershipSelect.addEventListener('change', function(e) {
      const memberId = e.target.value;
      // Clear any previous product options
      productSelect.innerHTML = `<option value="">-- Select Product --</option>`;
      productSelect.disabled = true;
    
      if (memberId) {
        accountTypeSelect.disabled = false;
        accountTypeSelect.innerHTML = `
          <option value="">-- Select Account Type --</option>
          <option value="savings">Savings Account</option>
          <option value="loan">Loan Account</option>
          <option value="rotary">Rotary Account</option>
          <option value="property">Property Account</option>
        `;
      } else {
        accountTypeSelect.innerHTML = `<option value="">-- Select Account Type --</option>`;
        accountTypeSelect.disabled = true;
      }
    });
  
    // When an account type is selected, fetch the product data and populate the product dropdown.
    accountTypeSelect.addEventListener('change', accountTypeSelection);
  
    document.getElementById('eligibilityToggle').addEventListener('change', function() {
        const eligibilityFields = document.getElementById('eligibilityFields');
        eligibilityFields.style.display = this.checked ? 'grid' : 'none';
    });
    
    document.querySelectorAll('.transaction-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', updateButtonStates);
    });
    
    document.getElementById('actionamounttype').addEventListener('change', function() {
        const actionAmountPeriodMonthContainer = document.getElementById('actionamountperiodmonthContainer');
        actionAmountPeriodMonthContainer.style.display = this.value === 'PERCENTAGE' ? 'block' : 'none';
    });

    const form = document.querySelector('#bulktransactionform')
    const form2 = document.querySelector('#viewbulktransactionformfilter')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', bulktransactionFormSubmitHandler)
    if(form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', fetchbulktransaction)
}

async function fetchbulktransaction(id) {

  // Show loading state using SweetAlert
  const loadingAlert = Swal.fire({
      title: 'Please wait...',
      text: 'Fetching bulktransaction data, please wait.',
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading();
      }
  });
  let form = document.querySelector('#viewbulktransactionformfilter');
  let formData = new FormData(form);
  // formData.set('department', '');
  // formData.set('bulktransaction', '');
  let queryParams = new URLSearchParams(formData).toString();

  if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

  let request = await httpRequest2(`api/v1/transactions/viewbulk?${queryParams ? `${queryParams}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
  swal.close(); // Close the loading alert once the request is complete
  if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
  if(request.status) {
      
          if(request.data.length) {
              datasource = request.data
              resolvePagination(datasource, onbulktransactionTableDataSignal);
          }
      
  } else {
      return notification('No records retrieved');
  }
}

async function onbulktransactionTableDataSignal() {
  let rows = getSignaledDatasource().map((item, index) => `
  <tr>
      <td>${index + 1}</td>
      <td>${item.reference}</td>
      <td>${item.description}</td>
      <td>${formatDate(item.transactiondate)}</td>
      <td>${item.bulkaction}</td>
      <td class="flex items-center gap-3">
        <button title="View Row transactions" onclick="fetchTransactionDetails('${item.reference}')" class="material-symbols-outlined h-8 w-8 rounded-full bg-primary-g text-xs text-white drop-shadow-md" style="font-size: 18px;">visibility</button>
      </td>
  </tr>`
  )
  .join('')
  injectPaginatatedTable(rows)
}

async function bulktransactionFormSubmitHandler() {
    if(!validateForm('bulktransactionform', getIdFromCls('comp'))) return notification('Please fill all required fields', 0)
    
    
      document.getElementById('submit').addEventListener('click', async function() {
        const membership = document.getElementById('membershipSelect').value;
        const accountType = document.getElementById('accountTypeSelect').value;
        const product = document.getElementById('productSelect').value;
        const eligibility = document.getElementById('eligibilityToggle').checked ? 'YES' : 'NO';
        const eligibilityminimumbalance = document.getElementById('eligibilityminimumbalance').value;
        const eligibilityminagemonths = document.getElementById('eligibilityminagemonths').value;
        const eligibilityperiodbalance = document.getElementById('eligibilityperiodbalance').value;
        const eligibilityperiodmonth = document.getElementById('eligibilityperiodmonth').value;
        const actiontype = document.getElementById('actiontype').value;
        const actionamount = document.getElementById('actionamount').value;
        const actionamounttype = document.getElementById('actionamounttype').value;
        const actionamountperiodmonth = document.getElementById('actionamountperiodmonth').value;
        const description = document.getElementById('description').value;

        const formData = new FormData();
        formData.append('definmember', membership);
        formData.append('accounttype', accountType);
        formData.append('product', product);
        formData.append('eligibility', eligibility);
        if (eligibilityminimumbalance) {
            formData.append('eligibilityminimumbalance', eligibilityminimumbalance);
        }
        if (eligibilityminagemonths) {
            formData.append('eligibilityminagemonths', eligibilityminagemonths);
        }
        if (eligibilityperiodbalance) {
            formData.append('eligibilityperiodbalance', eligibilityperiodbalance);
        }
        if (eligibilityperiodmonth) {
            formData.append('eligibilityperiodmonth', eligibilityperiodmonth);
        }
        formData.append('actiontype', actiontype);
        formData.append('actionamount', actionamount);
        formData.append('actionamounttype', actionamounttype);
        if (actionamounttype === 'PERCENTAGE' && actionamountperiodmonth) {
            formData.append('actionamountperiodmonth', actionamountperiodmonth);
        }
        formData.append('description', description);

        // Show loading state using SweetAlert
        const loadingAlert = Swal.fire({
            title: 'Please wait...',
            text: 'Submitting your data, please wait.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        let response;

        try {
            response = await httpRequest2('api/v1/transactions/bulktransaction', formData, null, 'json', 'POST');
            Swal.close(); // Close the loading alert

            if (response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Transaction completed successfully.',
                    icon: 'success',
                    html: `
                       <div class="max-w-md mx-auto rounded-lg mb-4 p-6">
                          <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">Transaction Summary</h3>
                          
                          <div class="space-y-3">
                            <p class="flex justify-between">
                              <span class="font-semibold text-gray-700">Status:</span>
                              <span class="text-blue-600">${response.message}</span>
                            </p>
                            <p class="flex justify-between">
                              <span class="font-semibold text-gray-700">Total Transactions:</span>
                              <span class="text-blue-600">${response.summary.totalTransactions}</span>
                            </p>
                            <p class="flex justify-between">
                              <span class="font-semibold text-gray-700">Total Credit:</span>
                              <span class="text-green-600">${response.summary.totalCredit} ${response.data[0].currency}</span>
                            </p>
                            <p class="flex justify-between">
                              <span class="font-semibold text-gray-700">Total Debit:</span>
                              <span class="text-red-600">${response.summary.totalDebit} ${response.data[0].currency}</span>
                            </p>
                            <div class="pt-4 border-t border-gray-200 mt-4">
                              <p class="font-semibold text-gray-700 mb-1">Description:</p>
                              <p class="text-gray-600">${response.summary.description}</p>
                            </div>
                          </div>
                        </div>

                        <h3>Transaction Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid #ddd; padding: 8px;">ID</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Account Number</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Credit</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Debit</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Reference</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${response.data.map(transaction => `
                                    <tr>
                                        <td style="border: 1px solid #ddd; padding: 8px;">${transaction.id}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px;">${transaction.accountnumber}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px;">${transaction.credit} ${transaction.currency}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px;">${transaction.debit} ${transaction.currency}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px;">${transaction.reference}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px;">${transaction.status}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px;">${transaction.transactiondesc}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `,
                    confirmButtonText: 'Close',
                    customClass: {
                        popup: 'max-w-[800px] w-[90%]'
                    },
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.message || 'Transaction failed.',
                    icon: 'error',
                    confirmButtonClass: 'bg-red-500 text-white', // Give button color
                });
            }
        } catch (error) {
            Swal.close(); // Close the loading alert
             if (response && response.message) {
                Swal.fire({
                    title: 'Error',
                    text: response.message,
                    icon: 'error',
                    confirmButtonClass: 'bg-blue-500 text-white', 
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while processing your request.',
                    icon: 'error',
                    confirmButtonClass: 'bg-blue-500 text-white',
                });
            }
        }
    });
}

// Fetch membership data for the dashboard
async function fetchbulkMembershipData() {
  let request = await httpRequest2(`api/v1/dashboard/membership?userid=${the_user.id}`, null, null, 'json', 'GET');
  if (request.status) {
    return request.data; // Return the membership data
  } else {
    return [];
  }
}

async function accountTypeSelection (e) {
  const accountType = e.target.value;
  const memberId = membershipSelect.value;
  productSelect.innerHTML = `<option value="">-- Select Product --</option>`;
  productSelect.disabled = true;

  if (accountType && memberId) {
     // Show loading state using SweetAlert
     const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching product data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    let accountData = null;
    if (accountType === 'savings') {
      accountData = await fetchbulkSavingsData(memberId);
    } else if (accountType === 'loan') {
      accountData = await fetchbulkLoanData(memberId);
    } else if (accountType === 'rotary') {
      accountData = await fetchbulkRotaryData(memberId);
    } else if (accountType === 'property') {
      accountData = await fetchbulkPropertyData(memberId);
    }

    Swal.close();
    
    // Assuming the API may return an array or an object:
    if (accountData) {
        console.log("Account data", accountData);
        // Normalize to an array if a single object is returned.
        const products = Array.isArray(accountData) ? accountData : [accountData];
        productSelect.innerHTML = ''; // Clear previous options
        if (products.length > 0) {
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id; 
                option.textContent = product.productname || 'Unnamed Product';
                productSelect.appendChild(option);
            });
            productSelect.disabled = false; // Enable the select if products are found
        } else {
            productSelect.innerHTML = `<option value="">No products found</option>`;
            productSelect.disabled = true; // Disable if no products are found
        }
    } else {
        productSelect.innerHTML = `<option value="">No products found</option>`;
        productSelect.disabled = true; // Disable if accountData is null
    }
  }
}
// Your existing functions for fetching account details:
async function fetchbulkSavingsData(memberId) {
  let request = await httpRequest2(`api/v1/transactions/getproducts?accounttype=savings&membership=${memberId}`, null, null, 'json', 'GET');
  if (request.status) {
    return request.data ? request.data : null;
  } else {
    return null;
  }
}

async function fetchbulkLoanData(memberId) {
  let request = await httpRequest2(`api/v1/transactions/getproducts?accounttype=loan&membership=${memberId}`, null, null, 'json', 'GET');
  if (request.status) {
    return request.data ? request.data : null;
  } else {
    return null;
  }
}

async function fetchbulkRotaryData(memberId) {
  let request = await httpRequest2(`api/v1/transactions/getproducts?accounttype=rotary&membership=${memberId}`, null, null, 'json', 'GET');
  if (request.status) {
    return request.data ? request.data : null;
  } else {
    return null;
  }
}

async function fetchbulkPropertyData(memberId) {
  let request = await httpRequest2(`api/v1/transactions/getproducts?accounttype=property&membership=${memberId}`, null, null, 'json', 'GET');
  if (request.status) {
    return request.data;
  } else {
    return null;
  }
}

// Function to populate the membership dropdown
async function displayMembershipData() {
  try {
    const membershipSelect = document.getElementById('membershipSelect');
    const membershipData = await fetchbulkMembershipData();
    // Clear existing options (if any) leaving placeholder intact
    membershipSelect.innerHTML = `<option value="">-- Select Membership --</option>`;

    if (membershipData.length === 0) {
      membershipSelect.disabled = true;
    } else {
      membershipData.forEach(member => {
        const option = document.createElement('option');
        option.value = member.member; // adapt this as needed
        option.textContent = member.membername;
        membershipSelect.appendChild(option);
      });
      membershipSelect.disabled = false;
    }
  } catch (error) {
    console.error('Error displaying membership data:', error);
  }
}

async function fetchTransactionDetails(reference) {
  const request = await httpRequest2(`api/v1/transactions?reference=${reference}`, null, null, 'json', 'GET');
  
  if (request.status) {
      displayTransactionModal(request.data);
  } else {
      notification('Failed to fetch transaction details', 0);
  }
}

function displayTransactionModal(transactions) {
  const rows = transactions.map((transaction, index) => `
      <tr>
          <td><input type="checkbox" class="transaction-checkbox" data-id="${transaction.id}" data-credit="${transaction.credit}" data-debit="${transaction.debit}" data-status="${transaction.status}"></td>
          <td>${transaction.accountnumber}</td>
          <td>${transaction.description}</td>
          <td>${transaction.credit}</td>
          <td>${transaction.debit}</td>
          <td>${transaction.status === 'ACTIVE' || transaction.status === 'APPROVED' ? '<span class="text-green-600">Approved</span>' : `<span class="text-amber-500">${transaction.status}</span>`}</td>
          <td class="flex items-center gap-2">
              ${transaction.status !== 'ACTIVE' && transaction.status !== 'APPROVED' ? `
                  <button onclick="approveTransaction(${transaction.id}, ${transaction.debit}, ${transaction.credit}, ${index})" class="rounded bg-green-500 px-2 py-1 font-semibold text-white transition duration-200 hover:bg-green-600" title="Approve">
                      <span class="material-icons">check_circle</span>
                  </button>
                  <button onclick="declineTransaction(${transaction.id}, ${transaction.debit}, ${transaction.credit}, ${index})" class="rounded bg-red-500 px-2 py-1 font-semibold text-white transition duration-200 hover:bg-red-600" title="Decline">
                      <span class="material-icons">cancel</span>
                  </button>
              ` : ''}
          </td>
      </tr>
  `).join('');

  const modalContent = `
      <div class="table-content">
          <table class="table-auto">
              <thead>
                  <tr>
                      <th><input type="checkbox" id="selectAll" onclick="toggleSelectAll(this)"></th>
                      <th style="white-space: nowrap; width: 100%;">Account Number</th>
                      <th style="white-space: nowrap; width: 100%;">Description</th>
                      <th style="white-space: nowrap; width: 100%;">Credit</th>
                      <th style="white-space: nowrap; width: 100%;">Debit</th>
                      <th style="white-space: nowrap; width: 100%;">Status</th>
                      <th style="white-space: nowrap; width: 100%;">Action</th>
                  </tr>
              </thead>
              <tbody>
                  ${rows}
              </tbody>
          </table>
          
          <div class="my-4">
            <button onclick="approveSelected()" class="rounded bg-green-500 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-green-600">Approve Selected</button>
            <button onclick="declineSelected()" class="rounded bg-red-500 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-red-600">Decline Selected</button>
          </div>
      </div>
  `;

  Swal.fire({
      title: 'Transaction Details',
      html: modalContent,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      customClass: {
          popup: 'max-w-[700px] w-[80%]' 
      },
      onOpen: () => {
          // Add event listeners for the buttons inside the SweetAlert
          document.querySelectorAll('.transaction-checkbox').forEach(checkbox => {
              checkbox.addEventListener('change', function() {
                  // Handle checkbox change if needed
              });
          });
      }
  });
}

function updateButtonStates() {
  const selectedCheckboxes = document.querySelectorAll('.transaction-checkbox:checked');
  const approveButton = document.getElementById('approveButton');
  const declineButton = document.getElementById('declineButton');

  const hasSelected = selectedCheckboxes.length > 0;
  approveButton.disabled = !hasSelected;
  declineButton.disabled = !hasSelected;
}

async function approveTransaction(id, debit, credit, index) {
  const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this transaction?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
      buttonsStyling: false, 
      customClass: {
          confirmButton: 'bg-[#3085d6] text-white mr-2 p-2', 
          cancelButton: 'bg-[#d33] text-white p-2' 
      }
  });

  if (confirmation.isConfirmed) {
      const formData = new FormData();
      formData.append('rowsize', 1);
      formData.append(`id${index + 1}`, id);
      formData.append(`debit${index + 1}`, debit);
      formData.append(`credit${index + 1}`, credit);
      formData.append(`status${index + 1}`, 'ACTIVE');

      const request = await httpRequest2('api/v1/transactions/approvedeclinebulk', formData, null, 'json', 'POST');
      
      if (request.status) {
          notification('Transaction approved successfully', 1);
          closeModal();
      } else {
          notification('Failed to approve transaction', 0);
      }
  }
}

async function declineTransaction(id, debit, credit, index) {
  const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to decline this transaction?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, decline it!',
      buttonsStyling: false, 
      customClass: {
          confirmButton: 'bg-[#3085d6] text-white mr-2 p-2', 
          cancelButton: 'bg-[#d33] text-white p-2' 
      }
  });

  if (confirmation.isConfirmed) {
      const formData = new FormData();
      formData.append('rowsize', 1);
      formData.append(`id${index + 1}`, id);
      formData.append(`debit${index + 1}`, debit);
      formData.append(`credit${index + 1}`, credit);
      formData.append(`status${index + 1}`, 'DECLINED');

      const request = await httpRequest2('api/v1/transactions/approvedeclinebulk', formData, null, 'json', 'POST');
      
      if (request.status) {
          notification('Transaction declined successfully', 1);
          closeModal();
      } else {
          notification('Failed to decline transaction', 0);
      }
  }
}

function toggleSelectAll(selectAllCheckbox) {
  const checkboxes = document.querySelectorAll('.transaction-checkbox');
  checkboxes.forEach(checkbox => {
      checkbox.checked = selectAllCheckbox.checked;
  });
}

async function approveSelected() {
  const selectedCheckboxes = document.querySelectorAll('.transaction-checkbox:checked');
  const formData = new FormData();
  let rowSize = 0;

  selectedCheckboxes.forEach(checkbox => {
      rowSize++;
      formData.append(`id${rowSize}`, checkbox.getAttribute('data-id'));
      formData.append(`credit${rowSize}`, checkbox.getAttribute('data-credit'));
      formData.append(`debit${rowSize}`, checkbox.getAttribute('data-debit'));
      formData.append(`status${rowSize}`, 'ACTIVE');
  });

  formData.append('rowsize', rowSize);

  const request = await httpRequest2('api/v1/transactions/approvedeclinebulk', formData, null, 'json', 'POST');
  
  if (request.status) {
    closeModal();
      notification('Selected transactions approved successfully', 1);
  } else {
    closeModal();
      notification('Failed to approve selected transactions', 0);
  }
}

async function declineSelected() {
  const selectedCheckboxes = document.querySelectorAll('.transaction-checkbox:checked');
  const formData = new FormData();
  let rowSize = 0;

  selectedCheckboxes.forEach(checkbox => {
      rowSize++;
      formData.append(`id${rowSize}`, checkbox.getAttribute('data-id'));
      formData.append(`credit${rowSize}`, checkbox.getAttribute('data-credit'));
      formData.append(`debit${rowSize}`, checkbox.getAttribute('data-debit'));
      formData.append(`status${rowSize}`, 'DECLINED');
  });

  formData.append('rowsize', rowSize);

  const request = await httpRequest2('api/v1/transactions/approvedeclinebulk', formData, null, 'json', 'POST');
  
  if (request.status) {
    closeModal();
      notification('Selected transactions declined successfully', 1);
  } else {
    closeModal();
      notification('Failed to decline selected transactions', 0);
  }
}

function closeModal() {
  Swal.close();
}