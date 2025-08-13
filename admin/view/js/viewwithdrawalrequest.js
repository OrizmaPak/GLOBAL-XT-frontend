let viewwithdrawalrequestid
async function viewwithdrawalrequestActive() {
    viewwithdrawalrequestid = ''
    const form = document.querySelector('#viewwithdrawalrequestform')
    if(document.querySelector('#submitviewwithdrawalrequest')) document.querySelector('#submitviewwithdrawalrequest').addEventListener('click', fetchviewwithdrawalrequest)
    // if(form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', viewwithdrawalrequestFormSubmitHandler)
    datasource = []
    // await fetchviewwithdrawalrequest()
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

        if(document.querySelector('#submitviewwithdrawalrequest')) document.querySelector('#submitviewwithdrawalrequest').click()
}

async function fetchviewwithdrawalrequest() {
    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching view reversals data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#viewwithdrawalrequestform');
    let formData = new FormData(form);
    // formData.set('department', '');
    // formData.set('viewwithdrawalrequest', '');
    let queryParams = new URLSearchParams(formData).toString();

    document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    let request = await httpRequest2(`api/v1/transactions/withdrawalrequest?userid=${the_user.id}&${queryParams ? `${queryParams}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewwithdrawalrequestTableDataSignal);
            }
    } else {
        return notification('No records retrieved');
    }
}

async function onviewwithdrawalrequestTableDataSignal() {
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
        <td class="${item.requeststatus == 'APPROVED' ? 'text-green-600' : 'text-red-600'}">${item.requeststatus}</td>
        </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

        // <td class="flex items-center gap-3">
        //     <button title="Approve request" onclick="approveWithdrawalRequest('${item.id}')" class="material-symbols-outlined rounded-full bg-green-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">check_circle</button>
        //     <button title="Decline request" onclick="declineWithdrawalRequest('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">cancel</button>
        // </td>