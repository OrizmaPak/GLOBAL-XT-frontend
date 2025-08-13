let viewwithdrawallogid
async function viewwithdrawallogActive() {
    viewwithdrawallogid = ''
    const form = document.querySelector('#viewwithdrawallogform')
    if(document.querySelector('#submitviewwithdrawallog')) document.querySelector('#submitviewwithdrawallog').addEventListener('click', fetchviewwithdrawallog)
    // if(form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', viewwithdrawallogFormSubmitHandler)
    datasource = []
    // await fetchviewwithdrawallog()
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

        await getAllUsers('userid', 'name')

        new TomSelect('#userid', {
            plugins: ['dropdown_input'],
            onInitialize: function() {
                console.log(checkpermission('FILTER ALL USERS'))
                if(!checkpermission('FILTER ALL USERS')) this.setValue(the_user.id);
                if(!checkpermission('FILTER ALL USERS')) this.disable();
            }
        })

        if(document.querySelector('#submitviewwithdrawallog')) document.querySelector('#submitviewwithdrawallog').click()
}

async function fetchviewwithdrawallog() {
    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching view reversals data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#viewwithdrawallogform');
    let formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
        if (!value) {
            formData.delete(key);
        }
    }
    let queryParams = new URLSearchParams(formData).toString();

    document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    let request = await httpRequest2(`api/v1/transactions/withdrawalrequest?${queryParams ? `${queryParams}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewwithdrawallogTableDataSignal);
            }
    } else {
        return notification('No records retrieved');
    }
}

async function onviewwithdrawallogTableDataSignal() {
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