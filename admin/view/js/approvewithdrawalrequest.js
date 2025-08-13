let approvewithdrawalrequestid
let amountinaccount
async function approvewithdrawalrequestActive() {
    approvewithdrawalrequestid = '';
    const form = document.querySelector('#approvewithdrawalrequestform');
    const submitButton = document.querySelector('#submitapprovewithdrawalrequest');
    
    if (submitButton) {
        submitButton.addEventListener('click', fetchapprovewithdrawalrequest);
    }

    datasource = [];
    const startDateInput = document.querySelector('#startdate');
    const endDateInput = document.querySelector('#enddate');
    
    if (startDateInput && endDateInput) {
        // Set default date range to one week
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        
        startDateInput.valueAsDate = oneWeekAgo;
        endDateInput.valueAsDate = new Date(today.setDate(today.getDate() + 1));
    } else {
        console.error('Start date or end date input not found.');
    }

    await fetchavailablewithdrawalbalance();

    if (submitButton) {
        submitButton.click();
    }
}

async function fetchavailablewithdrawalbalance() {
    try {
        const response = await httpRequest2('api/v1/paystack/getbalance', null, null, 'json', 'GET');
        if (response.status) {
            const balanceElement = document.getElementById('paybalance');
            if (balanceElement) {
                let lastUpdatedElement = balanceElement.querySelector('.last-updated');
                if (!lastUpdatedElement) {
                    lastUpdatedElement = document.createElement('span');
                    lastUpdatedElement.className = 'last-updated text-red-100';
                    lastUpdatedElement.style.fontSize = '0.6em'; // Make it very tiny
                    // lastUpdatedElement.style.color = 'red'; // Make it red
                    lastUpdatedElement.style.display = 'block'; // Display it as a block to be under the amount
                    lastUpdatedElement.style.marginTop = '2px'; // Add a small margin on top
                    balanceElement.appendChild(lastUpdatedElement);
                }

                console.log(response);

                amountinaccount = response.data[0].balance;

                balanceElement.textContent = response.data[0].currency + ' ' + formatNumber(response.data[0].balance);
                balanceElement.appendChild(lastUpdatedElement);

                let secondsSinceUpdate = 0;
                const countdownInterval = setInterval(() => {
                    lastUpdatedElement.textContent = `last updated ${secondsSinceUpdate++}s ago`;
                }, 1000);

                setTimeout(() => {
                    clearInterval(countdownInterval); // Clear the interval before refetching
                    fetchavailablewithdrawalbalance(); // Refetch after a certain period
                }, 15000); // Refetch after 5 seconds
            } else {
                console.error('Balance element not found.');
            }
        } else {
            console.error('Failed to fetch available balance:', response.message);
        }
    } catch (error) {
        console.error('Error fetching available balance:', error);
    }
}

async function fetchapprovewithdrawalrequest() {
    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching view reversals data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#approvewithdrawalrequestform');
    let formData = new FormData(form);
    // formData.set('department', '');
    // formData.set('approvewithdrawalrequest', '');
    let queryParams = new URLSearchParams(formData).toString();

    document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    let request = await httpRequest2(`api/v1/transactions/withdrawalrequest?requeststatus=PENDING&${queryParams ? `${queryParams}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onapprovewithdrawalrequestTableDataSignal);
            }
    } else {
        return notification('No records retrieved');
    }
}

async function onapprovewithdrawalrequestTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${formatDate(item.dateadded)}</td>
        <td>${item.accountnumber}</td>
        <td>${item.useridname}</td>
        <td>${item.accounttype}</td>
        <td>${item.description}</td>
        <td>${item.createdbyname}</td>
        <td>${item.reason}</td>
        <td>${formatNumber(item.amount)}</td>
        <td class="flex items-center gap-3">
            <button title="Approve request" onclick="approveWithdrawalRequest('${item.id}', '${item.amount}')" class="material-symbols-outlined rounded-full bg-green-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">check_circle</button>
            <button title="Decline request" onclick="declineWithdrawalRequest('${item.id}', '${item.amount}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">cancel</button>
        </td>
        </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function approveWithdrawalRequest(requestId, amount) {
    if(parseInt(amountinaccount) < parseInt(amount)) {
        return notification('Insufficient balance in account', 0);
    }

    const pinStatus = await getAndVerifyPin();
    if(!pinStatus) return;
    
    try {
        // Ask for confirmation before approving the request
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to approve this withdrawal request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        });

        if (confirmation.isConfirmed) {
            // Show loading state using SweetAlert
            const loadingAlert = Swal.fire({
                title: 'Please wait...',
                text: 'Approving withdrawal request, please wait.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            let param = new FormData();
            param.set('id', requestId);

            // Make the API call to approve the withdrawal request
            let response = await httpRequest2(`api/v1/transactions/approvewithdrawalrequest`, param, null, 'json', 'POST');
            swal.close(); // Close the loading alert once the request is complete

            if (response.status) {
                notification('Withdrawal request approved successfully', 1);
                // Refresh the table data to reflect the changes
                await fetchapprovewithdrawalrequest();
            } else {
                notification(response.message, 0);
            }
        } else {
            notification('Approval cancelled', 'info');
        }
    } catch (error) {
        swal.close();
        console.error('Error approving withdrawal request:', error);
        notification('An error occurred while approving the request', 0);
    }
}

async function declineWithdrawalRequest(requestId) {
    try {
        // Ask for the reason for declining the request
        const { value: reason } = await Swal.fire({
            title: 'Decline Withdrawal Request',
            input: 'textarea',
            inputLabel: 'Reason for declining',
            inputPlaceholder: 'Enter your reason here...',
            inputAttributes: {
                'aria-label': 'Enter your reason here'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        });

        if (reason) {
            // Show loading state using SweetAlert
            const loadingAlert = Swal.fire({
                title: 'Please wait...',
                text: 'Declining withdrawal request, please wait.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Make the API call to decline the withdrawal request
            const formData = new FormData();
            formData.append("id", requestId);
            formData.append("reason", reason);
            formData.append("requeststatus", "DECLINED");
            let response = await httpRequest2(`api/v1/transactions/withdrawalrequest`, formData, null, 'json', 'POST');
            swal.close(); // Close the loading alert once the request is complete

            if (response.status) {
                notification('Withdrawal request declined successfully', 'success');
                // Refresh the table data to reflect the changes
                await fetchapprovewithdrawalrequest();
            } else {
                notification('Failed to decline withdrawal request', 'error');
            }
        } else {
            notification('Decline action cancelled', 'info');
        }
    } catch (error) {
        swal.close();
        console.error('Error declining withdrawal request:', error);
        notification('An error occurred while declining the request', 'error');
    }
}
