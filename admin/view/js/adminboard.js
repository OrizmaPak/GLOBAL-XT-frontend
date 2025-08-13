let adminboardid
async function adminboardActive() {
    adminboardid = ''
    // const form = document.querySelector('#adminboardform')
    const form2 = document.querySelector('#viewadminboardform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', adminboardFormSubmitHandler)
    if (form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', fetchadminboard, false)
    datasource = []
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('asofdate').value = today;
    //await fetchadminboard()
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



// Helper function to format numbers with commas
function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to show transactions in a modal
function showTransactionsadminboard(memberName, productName, transactionsJSON) {
    try {
        // Decode the transactions JSON string
        const decodedTransactionsJSON = decodeString(transactionsJSON);
        const transactions = JSON.parse(decodedTransactionsJSON);

        if (!transactions || transactions.length === 0) {
            Swal.fire({
                title: `No Transactions Found`,
                text: `${memberName} has no transactions for ${productName}`,
                icon: 'info',
                customClass: {
                    popup: 'swal-wide'
                }
            });
            return;
        }

        let tableHTML = `
            <div class="overflow-x-auto max-h-96 p-4 bg-white rounded-lg shadow-md">
                <table class="w-full text-sm text-left text-gray-700">
                    <thead class="text-xs text-gray-700 uppercase bg-blue-100 sticky top-0">
                        <tr>
                            <th class="px-4 py-2">Date</th>
                            <th class="px-4 py-2">Description</th>
                            <th class="px-4 py-2">Credit</th>
                            <th class="px-4 py-2">Debit</th>
                            <th class="px-4 py-2">Reference</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        transactions.forEach(t => {
            const date = new Date(t.transactiondate || t.valuedate).toLocaleString();
            tableHTML += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-4 py-2">${date}</td>
                    <td class="px-4 py-2">${t.description || t.transactiondesc || ''}</td>
                    <td class="px-4 py-2 text-green-600">${t.credit ? '₦' + formatNumber(t.credit) : ''}</td>
                    <td class="px-4 py-2 text-red-600">${t.debit ? '₦' + formatNumber(t.debit) : ''}</td>
                    <td class="px-4 py-2">${t.transactionref || t.reference || ''}</td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        Swal.fire({
            title: `<h2 class="text-lg font-semibold">${memberName} - ${productName} Transactions</h2>`,
            html: tableHTML,
            width: '80%',
            customClass: {
                popup: 'swal-wide',
                container: 'rounded-lg shadow-lg',
                title: 'text-blue-600'
            },
            showCloseButton: true,
            showConfirmButton: false
        });
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Failed to load transactions data',
            icon: 'error',
            customClass: {
                popup: 'swal-wide'
            }
        });
        console.error('Transaction parsing error:', error);
    }
}

function encodeString(input) {
    // Convert the input to a base64 encoded string
    return btoa(input);
}

function decodeString(encoded) {
    // Decode the base64 encoded string back to its original form
    return atob(encoded);
}


async function fetchadminboard() {
    if (!validateForm('viewadminboardform', getIdFromCls('comp')))
        return notification('Please fill all required fields', 0);

    did('summary').innerHTML = '';
    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching adminboard data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    let form = document.querySelector('#viewadminboardform');
    let formData = new FormData(form);
    formData.set('branch', did('branch').tomselect.getValue());

    let queryParams = new URLSearchParams(formData).toString();

    // Show loading row in table
    document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70"> Loading... </td></tr>`;

    let request = await httpRequest2(
        `api/v1/dashboard/adminboardreport?${queryParams}`,
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
            productMap[p.productname] = p;
        });

        // Add payment status for each unique product
        uniqueProducts.forEach(product => {
            const productData = productMap[product];
            if (!productData) {
                row += `<td></td>`;
                return;
            }

            const payment = productData.payment || '';
            const balance = productData.balance || 0;
            const paymentLower = payment.toLowerCase();
            let paymentClass = '';
            let statusValue = '';

            // Prepare transaction icon
            const transactions = JSON.stringify(productData.transactions || []);
            const encodedTransactions = encodeString(transactions);
            const transactionIcon = `
                <i 
                    title="View transactions" 
                    onclick="showTransactionsadminboard('${entry.fullname.replace(/'/g, "\\\\'")}', '${product.replace(/'/g, "\\\\'")}', '${encodedTransactions}')"
                    class="material-symbols-outlined text-primary-g text-xs cursor-pointer mx-2" 
                    style="font-size: 12px;">
                    visibility
                </i>
            `;

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
                            <div class="flex items-center mt-1">
                                <span class="text-sm">₦${formatNumber(balance)}</span>
                                ${transactionIcon}
                            </div>
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
                const infoSpan = additionalInfo
                    ? `<span class="text-xs text-gray-600 block mt-1">${additionalInfo.replace(')', '')}</span>`
                    : '';

                row += `<td class="p-3 ${paymentClass} rounded">
                    <div class="font-medium">${mainStatus}</div>
                    ${infoSpan}
                    <div class="flex items-center">
                        <span class="text-sm">₦${formatNumber(balance)}</span>
                        ${transactionIcon}
                    </div>
                </td>`;
            }
            // Update total for this product
            productSummary[product].total++;
        });

        row += `</tr>`;
        bodyHTML += row;
    });

    tableBody.innerHTML = bodyHTML;

    // Calculate total realized from the branch
    let totalRealized = 0;
    datasource.forEach(entry => {
        entry.product.forEach(p => {
            if (p.payment && (p.payment.toLowerCase().startsWith('paid') || p.payment.toLowerCase().startsWith('partially paid'))) {
                totalRealized += p.balance || 0;
            }
        });
    });

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
                <div class="mt-4 pt-4 border-t border-blue-500/30">
                    <p class="text-sm opacity-80">Total Realized</p>
                    <p class="text-xl font-bold">₦${formatNumber(totalRealized)}</p>
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
                            <span>${summary.paid} <span class="opacity-70">(${Math.round((summary.paid / total) * 100)}%)</span></span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-green-500 h-2.5 rounded-full" style="width: ${Math.round((summary.paid / total) * 100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="status-bar mb-3">
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-orange-600 font-medium">Partial</span>
                            <span>${summary.partiallyPaid || 0} <span class="opacity-70">(${Math.round((summary.partiallyPaid / total) * 100)}%)</span></span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-orange-500 h-2.5 rounded-full" style="width: ${Math.round((summary.partiallyPaid / total) * 100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="status-bar">
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-red-600 font-medium">Unpaid</span>
                            <span>${summary.notPaid || 0} <span class="opacity-70">(${Math.round((summary.notPaid / total) * 100)}%)</span></span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-red-500 h-2.5 rounded-full" style="width: ${Math.round((summary.notPaid / total) * 100)}%"></div>
                        </div>
                    </div>
                </div>`;
        }

        summaryHTML += `
            <div class="summary-card bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all hover:shadow-xl ${isPersonal ? 'ring-1 ring-opacity-20 ' +
                (summary.sufficient ? 'ring-green-300' :
                    summary.insufficient ? 'ring-blue-300' :
                        summary.noFunds ? 'ring-red-300' : 'ring-gray-300') : ''
            }">
                <div class="p-5">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold ${isPersonal ?
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
                
                <div class="status-footer px-5 py-3 ${isPersonal ?
                (summary.sufficient ? 'bg-green-50 border-t border-green-100' :
                    summary.insufficient ? 'bg-blue-50 border-t border-blue-100' :
                        summary.noFunds ? 'bg-red-50 border-t border-red-100' : 'bg-gray-50 border-t border-gray-100') :
                'bg-gray-50 border-t border-gray-100'
            }">
                    <p class="text-sm ${isPersonal ?
                (summary.sufficient ? 'text-green-700' :
                    summary.insufficient ? 'text-blue-700' :
                        summary.noFunds ? 'text-red-700' : 'text-gray-700') :
                'text-gray-600'
            } flex items-center">
                        <i class="fas ${statusIcon} mr-2 ${isPersonal ?
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
