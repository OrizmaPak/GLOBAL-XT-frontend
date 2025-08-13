  let meetingboardid
async function meetingboardActive() {
    meetingboardid = ''
    // const form = document.querySelector('#meetingboardform')
    const form2 = document.querySelector('#viewmeetingboardform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', meetingboardFormSubmitHandler)
    if (form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', fetchmeetingboard, false)
    datasource = []
    //await fetchmeetingboard()
    await getAllbranch(true)
    await getallmemberships("member")
    new TomSelect('#branch', {
        //plugins: ['remove_button', 'dropdown_input'],
        onInitialize: function () {
            console.log(checkpermission('FILTER BRANCH'))
            if (!checkpermission('FILTER BRANCH')) this.setValue(the_user.branch);
            if (!checkpermission('FILTER BRANCH')) this.disable();
        }
    });
    new TomSelect('#member', {
        plugins: ['dropdown_input'],
    });
    // await getAllUsers('useridlist', 'id')
}

async function fetchmeetingboard() {
    if (!validateForm('viewmeetingboardform', getIdFromCls('comp')))
        return notification('Please fill all required fields', 0);
    
    did('summary').innerHTML = '';  
    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching meetingboard data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    let form = document.querySelector('#viewmeetingboardform');
    let formData = new FormData(form);
    formData.set('branch', did('branch').tomselect.getValue());

    let queryParams = new URLSearchParams(formData).toString();

    // Show loading row in table
    document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70"> Loading... </td></tr>`;

    let request = await httpRequest2(
        `api/v1/meeting/meetingboard?${queryParams}`,
        null,
        document.querySelector('#viewrequisitionform #submit'),
        'json',
        'GET'
    );

    swal.close(); // Close loading alert
    const tableHeader = document.getElementById('tableheader');
    const tableBody = document.getElementById('tabledata');

    // Default fallback if no data
    tableHeader.innerHTML = `<tr><th class="w-10"></th></tr>`;
    tableBody.innerHTML = `<tr><td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td></tr>`;

    if (!request.status || !request.data.length) {
        return notification('No records retrieved');
    }

    const datasource = request.data;

    // Step 1: Extract unique product names
    const productSet = new Set();
    datasource.forEach(entry => {
        entry.product.forEach(p => {
            productSet.add(p.productname);
        });
    });
    const uniqueProducts = Array.from(productSet);

    // Step 2: Generate the table header
    let headerRow = '<tr>';
    headerRow += '<th class="w-10">S/N</th>';
    headerRow += '<th>Full Name</th>';
    headerRow += '<th>Phone</th>';
    uniqueProducts.forEach(product => {
        headerRow += `<th>${product}</th>`;
    });
    headerRow += '</tr>';
    tableHeader.innerHTML = headerRow;

    // Initialize productSummary with proper structure
    let productSummary = {};
    uniqueProducts.forEach(product => {
        if (product === 'Personal Account') {
            productSummary[product] = { 
                sufficient: 0, 
                insufficient: 0, 
                noFunds: 0, 
                total: 0 
            };
        } else {
            productSummary[product] = { 
                paid: 0, 
                partiallyPaid: 0, 
                notPaid: 0, 
                total: 0 
            };
        }
    });

    // Step 3: Populate the table body
    let bodyHTML = '';

    datasource.forEach((entry, index) => {
        let row = `<tr class="border-b hover:bg-gray-50">`;
        row += `<td class="p-3">${index + 1}</td>`;
        row += `<td class="p-3 font-medium">${entry.fullname}</td>`;
        row += `<td class="p-3">${entry.phone}</td>`;

        // Create a map of productname to payment for current user
        const productMap = {};
        entry.product.forEach(p => {
            productMap[p.productname] = p.payment;
        });

        // Add payment status for each unique product
        uniqueProducts.forEach(product => {
            const payment = productMap[product] || '';
            if (!payment) {
                row += `<td></td>`;
                return;
            }
            
            const paymentLower = payment.toLowerCase();
            let paymentClass = '';
            let statusValue = '';

            if (product === 'Personal Account') {
                // Enhanced Personal Account handling with account-specific coloring
                let accountInfo = '';
                let statusText = '';
                let icon = '';
                
                if (paymentLower.includes('sufficient funds to cover') || 
                    paymentLower.includes('sufficient to cover')) {
                    paymentClass = 'text-green-700 bg-green-50 border border-green-200';
                    statusValue = 'sufficient';
                    productSummary[product].sufficient++;
                    statusText = paymentLower.split('(')[0].toUpperCase();
                    icon = 'fa-check-circle text-green-500';
                    
                    // Extract account numbers
                    const accountMatch = payment.match(/\(([^)]+)\)/);
                    accountInfo = accountMatch ? accountMatch[1] : '';
                } 
                else if (paymentLower.includes('insufficient funds')) {
                    paymentClass = 'text-blue-700 bg-blue-50 border border-blue-200';
                    statusValue = 'insufficient';
                    productSummary[product].insufficient++;
                    statusText = 'INSUFFICIENT FUNDS';
                    icon = 'fa-info-circle text-blue-500';
                    
                    // Extract account numbers
                    const accountMatch = payment.match(/\(([^)]+)\)/);
                    accountInfo = accountMatch ? accountMatch[1] : '';
                } 
                else if (paymentLower.includes('no funds')) {
                    paymentClass = 'text-red-700 bg-red-50 border border-red-200';
                    statusValue = 'noFunds';
                    productSummary[product].noFunds++;
                    statusText = 'NO FUNDS';
                    icon = 'fa-exclamation-triangle text-red-500';
                    
                    // Extract account numbers
                    const accountMatch = payment.match(/\(([^)]+)\)/);
                    accountInfo = accountMatch ? accountMatch[1] : '';
                }
                else {
                    // Skip unknown statuses
                    row += `<td></td>`;
                    return;
                }
                
                // Create account info display
                row += `
                <td class="p-2">
                    <div class="${paymentClass} rounded-lg p-3 flex items-start">
                        <i class="fas ${icon} mt-1 mr-2"></i>
                        <div>
                            <span class="font-medium block">${statusText}</span>
                            ${accountInfo ? `<span class="text-xs opacity-80 block mt-1">${accountInfo}</span>` : ''}
                        </div>
                    </div>
                </td>`;
             } else {
                // Handle other products
                if (paymentLower.startsWith('paid')) {
                    paymentClass = 'text-green-600 bg-green-50';
                    statusValue = 'paid';
                    productSummary[product].paid++;
                } else if (paymentLower.startsWith('partially paid')) {
                    paymentClass = 'text-orange-600 bg-orange-50';
                    statusValue = 'partiallyPaid';
                    productSummary[product].partiallyPaid++;
                } else if (paymentLower.startsWith('not paid')) {
                    paymentClass = 'text-red-600 bg-red-50';
                    statusValue = 'notPaid';
                    productSummary[product].notPaid++;
                }

                // Extract the main status and the additional info
                const displayText = payment.toUpperCase();
                const [mainStatus, additionalInfo] = displayText.split(' (');
                const infoSpan = additionalInfo && statusValue !== 'paid'
                    ? `<span class="text-xs text-gray-600 block mt-1">${additionalInfo.replace(')', '')}</span>` 
                    : '';

                // Extract account numbers
                const accountMatch = payment.match(/\(([^)]+)\)/);
                const accountInfo = accountMatch ? accountMatch[1] : '';

                console.log('xxx',checkpermission('STAFF TEMPORARY PAY'));

                 row += `<td class="p-3 ${paymentClass} rounded relative">
                    <span class="font-medium">${mainStatus}</span>
                    ${infoSpan}
                      ${statusValue !== 'paid' ? `
                        <button class="text-[green] text-md bg-transparent flex justify-center items-center gap-1 font-medium" onclick="openPaystack('${entry.fullname}', '${entry.email}', '${product}', '${accountInfo}')">
                            <i class="material-symbols-outlined">payments</i> Pay Now
                        </button>` : ''}
                      ${checkpermission('STAFF TEMPORARY PAY') ? `
                        <button class="text-blue-400 text-md bg-transparent flex justify-center items-center gap-1 font-medium m-3 absolute top-0 right-0" onclick="openTemporaryPay('${entry.fullname}', '${entry.email}', '${product}', '${accountInfo}')">
                            <i class="material-symbols-outlined">account_balance_wallet</i> 
                        </button>` : ''}
                </td>`;
            }
            // Update total for this product
            productSummary[product].total++;
        });

        row += `</tr>`;
        bodyHTML += row;
    });

    tableBody.innerHTML = bodyHTML;

    // Generate Advanced Summary with Personal Account in multi-color theme
    let summaryHTML = `
    <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Meeting Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div class="summary-header bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg">
                <div class="flex items-center">
                    <i class="fas fa-users text-2xl mr-3"></i>
                    <div>
                        <p class="text-sm opacity-80">Total Members</p>
                        <p class="text-3xl font-bold">${datasource.length}</p>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-blue-500/30">
                    <p class="text-sm opacity-80">Products Tracked</p>
                    <p class="text-xl font-bold">${uniqueProducts.length - 1}</p>
                </div>
            </div>`;

    uniqueProducts.forEach(product => {
        const summary = productSummary[product];
        const isPersonal = product === 'Personal Account';
        const total = summary.total || datasource.length;

        // Determine status icon and color
        let statusIcon, statusColor, statusText;
        
        if (isPersonal) {
            statusIcon = 'fa-info-circle';
            
            if (summary.sufficient > 0 && summary.insufficient === 0 && summary.noFunds === 0) {
                statusColor = 'text-green-500 bg-green-100';
                statusText = 'All have sufficient funds';
            } else if (summary.noFunds > 0) {
                statusColor = 'text-red-500 bg-red-100';
                statusText = `${summary.noFunds} need funding attention`;
            } else if (summary.insufficient > 0) {
                statusColor = 'text-blue-500 bg-blue-100';
                statusText = `${summary.insufficient} have insufficient funds`;
            } else {
                statusColor = 'text-gray-500 bg-gray-100';
                statusText = 'No funding data available';
            }
        } else {
            if (summary.paid === total) {
                statusIcon = 'fa-check-circle';
                statusColor = 'text-green-500 bg-green-100';
                statusText = 'All payments complete';
            } else if (summary.notPaid > 0) {
                statusIcon = 'fa-exclamation-circle';
                statusColor = 'text-red-500 bg-red-100';
                statusText = `${summary.notPaid} unpaid`;
            } else {
                statusIcon = 'fa-info-circle';
                statusColor = 'text-blue-500 bg-blue-100';
                statusText = `${summary.partiallyPaid} partially paid`;
            }
        }

        // Generate metrics section with color-coded segments
        let metricsHTML = '';
        if (isPersonal) {
            metricsHTML = `
                <div class="funding-status-grid mt-3">
                    <div class="status-item bg-green-100 border border-green-300 rounded p-2 text-center">
                        <p class="text-lg font-bold text-green-700">${summary.sufficient}</p>
                        <p class="text-xs text-green-600 mt-1">Sufficient</p>
                    </div>
                    <div class="status-item bg-blue-100 border border-blue-300 rounded p-2 text-center">
                        <p class="text-lg font-bold text-blue-700">${summary.insufficient}</p>
                        <p class="text-xs text-blue-600 mt-1">Insufficient</p>
                    </div>
                    <div class="status-item bg-red-100 border border-red-300 rounded p-2 text-center">
                        <p class="text-lg font-bold text-red-700">${summary.noFunds}</p>
                        <p class="text-xs text-red-600 mt-1">No Funds</p>
                    </div>
                    <div class="status-total bg-gray-100 border border-gray-300 rounded p-2 text-center col-span-3">
                        <p class="text-sm font-medium text-gray-700">${summary.total} Accounts Tracked</p>
                    </div>
                </div>
                
                <style>
                    .funding-status-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 8px;
                    }
                    .status-item {
                        transition: all 0.3s ease;
                    }
                    .status-item:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                </style>`;
        } else {
            metricsHTML = `
                <div class="payment-status-bars mt-4">
                    <div class="status-bar mb-3">
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-green-600 font-medium">Paid</span>
                            <span>${summary.paid} <span class="opacity-70">(${Math.round((summary.paid/total)*100)}%)</span></span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-green-500 h-2.5 rounded-full" style="width: ${Math.round((summary.paid/total)*100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="status-bar mb-3">
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-orange-600 font-medium">Partial</span>
                            <span>${summary.partiallyPaid || 0} <span class="opacity-70">(${Math.round((summary.partiallyPaid/total)*100)}%)</span></span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-orange-500 h-2.5 rounded-full" style="width: ${Math.round((summary.partiallyPaid/total)*100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="status-bar">
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-red-600 font-medium">Unpaid</span>
                            <span>${summary.notPaid || 0} <span class="opacity-70">(${Math.round((summary.notPaid/total)*100)}%)</span></span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-red-500 h-2.5 rounded-full" style="width: ${Math.round((summary.notPaid/total)*100)}%"></div>
                        </div>
                    </div>
                </div>`;
        }

        summaryHTML += `
            <div class="summary-card bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all hover:shadow-xl ${
                isPersonal ? 'ring-1 ring-opacity-20 ' + 
                    (summary.sufficient ? 'ring-green-300' : 
                     summary.insufficient ? 'ring-blue-300' : 
                     summary.noFunds ? 'ring-red-300' : 'ring-gray-300') : ''
            }">
                <div class="p-5">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold ${
                            isPersonal ? 
                                (summary.sufficient ? 'text-green-700' : 
                                 summary.insufficient ? 'text-blue-700' : 
                                 summary.noFunds ? 'text-red-700' : 'text-gray-700') : 
                                'text-gray-800'
                        }">
                            ${product}
                        </h3>
                        <span class="status-icon ${statusColor} w-8 h-8 rounded-full flex items-center justify-center">
                            <i class="fas ${statusIcon}"></i>
                        </span>
                    </div>
                    ${metricsHTML}
                </div>
                
                <div class="status-footer px-5 py-3 ${
                    isPersonal ? 
                        (summary.sufficient ? 'bg-green-50 border-t border-green-100' : 
                         summary.insufficient ? 'bg-blue-50 border-t border-blue-100' : 
                         summary.noFunds ? 'bg-red-50 border-t border-red-100' : 'bg-gray-50 border-t border-gray-100') : 
                        'bg-gray-50 border-t border-gray-100'
                }">
                    <p class="text-sm ${
                        isPersonal ? 
                            (summary.sufficient ? 'text-green-700' : 
                             summary.insufficient ? 'text-blue-700' : 
                             summary.noFunds ? 'text-red-700' : 'text-gray-700') : 
                            'text-gray-600'
                    } flex items-center">
                        <i class="fas ${statusIcon} mr-2 ${
                            isPersonal ? 
                                (summary.sufficient ? 'text-green-500' : 
                                 summary.insufficient ? 'text-blue-500' : 
                                 summary.noFunds ? 'text-red-500' : 'text-gray-500') : 
                                statusColor.split(' ')[0]
                        }"></i>
                        ${statusText}
                    </p>
                </div>
            </div>`;
    });

    summaryHTML += `
        </div>
    </div>`;
    document.getElementById('summary').innerHTML = summaryHTML;
}

function openPaystack(name, email, product, accountNumber) {
    if (!email) {
        Swal.fire({
            title: 'Error',
            text: 'Email is required to proceed with the payment.',
            icon: 'error',
            customClass: {
                popup: 'bg-white rounded-2xl p-6 shadow-2xl',
                confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
            }
        });
        return;
    }
    if (!accountNumber) {
        Swal.fire({
            title: 'Error',
            text: `Account number not found for ${product} account.`,
            icon: 'error',
            customClass: {
                popup: 'bg-white rounded-2xl p-6 shadow-2xl',
                confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
            }
        });
        return;
    }

    Swal.fire({
        title: `<div class="flex items-center justify-center">
                  <span class="material-symbols-outlined text-white lg:text-5xl">account_balance_wallet</span>
                  <h2 class="ml-4 font-extrabold text-white lg:text-3xl">Paystack Payment</h2>
                </div>`,
        html: `
          <div class="space-y-6">
            <div class="rounded-lg bg-[#0F1B2C] bg-opacity-20 p-4 shadow-lg backdrop-blur-md">
              <p class="text-lg text-gray-100">
                Account Number: <span class="font-semibold">${accountNumber}</span>
              </p>
              <p class="text-lg text-gray-100">
                Name: <span class="font-semibold">${name}</span>
              </p>
              <p class="text-lg text-gray-100">
                Product: <span class="font-semibold">${product}</span>
              </p>
            </div>
            <input type="number" id="paymentAmount" class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Enter amount to pay" />
            <p class="text-center text-xs text-gray-300">
              You will be redirected to Paystack to complete your payment.
            </p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl py-4 lg:p-8 shadow-2xl',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105',
            cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
        },
        preConfirm: () => {
            const amount = parseFloat(document.getElementById('paymentAmount').value);
            if (!amount || amount <= 0) {
                Swal.showValidationMessage('Please enter a valid payment amount.');
                return false;
            }
            return { amount: amount, accountNumber: accountNumber };
        }
     }).then(async (result) => {
         if (result.isConfirmed) {
            const { amount, accountNumber } = result.value;
            const formData = new FormData();
            formData.append('email', email);
            formData.append('accountnumber', accountNumber);
            formData.append('amount', amount);

             try {
                const response = await httpRequest2('api/v1/transactions/makedeposit', formData, null, 'json', 'POST');
                if (response.status) {
                  Swal.fire({
                    title: 'Success',
                    text: 'Deposit request submitted successfully.',
                    icon: 'success',
                    customClass: {
                      popup: 'bg-white rounded-2xl p-6 shadow-2xl',
                      confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
                    }
                  });

                  // Open paystackLink in an iframe
                  const paystackLink = response.data.paystackLink;
                  const iframe = document.createElement('iframe');
                  iframe.src = paystackLink;
                  iframe.style.width = '100%';
                  iframe.style.maxWidth = '1000px';
                  iframe.style.height = '70vh'; // Making the iframe height responsive
                  iframe.style.maxHeight = '500px'; // Limiting the maximum height for larger screens
                  Swal.fire({
                    html: iframe.outerHTML,
                    showConfirmButton: false
                  }).then(() => {
                    // Click the querySubmit button when the iframe modal closes
                    document.getElementById('querySubmit').click();
                  });
                } else {
                  Swal.fire({
                    title: 'Error',
                    text: response.message || 'Failed to submit deposit request.',
                    icon: 'error',
                    customClass: {
                      popup: 'bg-white rounded-2xl p-6 shadow-2xl',
                      confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
                    }
                  });
                }
              } catch (error) {
                Swal.fire({
                  title: 'Error',
                  text: 'An error occurred while processing your deposit request.',
                  icon: 'error',
                  customClass: {
                    popup: 'bg-white rounded-2xl p-6 shadow-2xl',
                    confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
                  }
                });
              }
        }
    });
}

async function openTemporaryPay(name, email, product, accountNumber) {
    const { value: formValues } = await Swal.fire({
        title: '<span class="text-xl font-semibold text-white">Payment Processing</span>',
        html: `
            <div class="space-y-4 text-left mb-6">
                <div class="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p class="text-sm font-medium text-gray-100">${name}</p>
                    <p class="text-xs text-gray-300 mt-1">${product}</p>
                    <p class="text-xs text-gray-300 mt-1">${accountNumber}</p>
                </div>

                <div class="relative">
                    <input 
                        id="swal-input1" 
                        class="w-full p-3 pl-10 text-sm rounded-lg bg-white/20 backdrop-blur-sm 
                               border-2 border-emerald-400/30 focus:border-emerald-300 
                               text-white placeholder-gray-300 focus:ring-0" 
                        placeholder="Amount"
                        type="number"
                        step="0.01"
                    >
                    <svg class="w-5 h-5 absolute left-3 top-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>

                <div class="relative">
                    <textarea
                        id="swal-input2"
                        class="w-full p-3 pl-10 text-sm rounded-lg bg-white/20 backdrop-blur-sm 
                              border-2 border-purple-400/30 focus:border-purple-300 
                              text-white placeholder-gray-300 focus:ring-0 h-24"
                        placeholder="Description (optional)"
                    ></textarea>
                    <svg class="w-5 h-5 absolute left-3 top-3.5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                    </svg>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Credit Account',
        customClass: {
            popup: 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 backdrop-blur-lg',
            container: 'flex items-center justify-center',
            closeButton: 'text-white/50 hover:text-white/80',
            confirmButton: 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300',
            cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
        },
        preConfirm: async () => {
            const amount = document.getElementById('swal-input1').value;
            const description = document.getElementById('swal-input2').value;
            
            if (!amount || Number(amount) <= 0) {
                Swal.showValidationMessage('Please enter a valid amount');
                return false;
            }

            const pinStatus = await getAndVerifyPin();
            if(!pinStatus) return;

            // Call getAndVerifyPin and OTP functions here
            // const otpStatus = await getAndVerifyOTP();
            // if(!otpStatus) return;
            
            return { 
                amount: parseFloat(amount).toFixed(2),
                description: description.trim()
            };
        }
    });

    if (formValues) {
        const formData = new FormData();
        formData.append('accountnumber', accountNumber);
        formData.append('ttype', 'CREDIT');
        formData.append('transactiondate', new Date().toISOString());
        formData.append('currency', 'NGN');
        formData.append('tfrom', 'BANK');
        formData.append('tax', false);
        formData.append('description', formValues.description || 'General transaction');
        formData.append('reference', '');
        formData.append('transactiondesc', formValues.description || '');
        formData.append('credit', parseFloat(formValues.amount));
        formData.append('debit', 0);

        try {

            const confirmed = await Swal.fire({
                title: 'Submitting...',
                text: 'Please wait while we submit your data.',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: async () => {
                    Swal.showLoading();

                    let request = await httpRequest2(
                        'api/v1/payment/',
                        formData,
                        null,
                        'json',
                        'POST'
                    );

                    Swal.close();

                    if (request && request.status) {
                        notification('Success!', 1);
                    } else {
                        notification(request ? request.message : 'Request failed', 0);
                    }

                    // Click the querySubmit button after payment attempt
                    document.getElementById('querySubmit').click();
                }
            });
        } catch (error) {
            console.error('Error submitting payment form:', error);
            notification('An error occurred while submitting the form. Please try again.', 0);

            // Click the querySubmit button if an error occurs
            document.getElementById('querySubmit').click();
        }
    }
}