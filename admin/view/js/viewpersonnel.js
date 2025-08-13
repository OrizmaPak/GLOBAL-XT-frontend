let viewpersonnelid
async function viewpersonnelActive() {
    viewpersonnelid = ''
    const form2 = document.querySelector('#filterviewviewpersonnel')
    if(form2.querySelector('#viewpersonnelSubmit')) form2.querySelector('#viewpersonnelSubmit').addEventListener('click', fetchviewpersonnel)
    datasource = []

    await getAllUsers('filterusers', 'name'),
    
    new TomSelect('#filterusers', {
        plugins: ['dropdown_input'],
        onInitialize: function () {
            if (!checkpermission('FILTER ALL USERS')) this.setValue(the_user.id);
            if (!checkpermission('FILTER ALL USERS')) this.disable();
        }
    });

    await fetchviewpersonnel()
}

async function fetchviewpersonnel(id) {

    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching viewpersonnel data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#filterviewviewpersonnel');
    let formData = new FormData(form);
    // formData.set('department', '');
    // formData.set('viewpersonnel', '');
    let viewpersonnelParams = new URLSearchParams(formData).toString();

    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    // let request = await httpRequest2(`api/v1/personnel/viewpersonnel?${viewpersonnelParams ? `${viewpersonnelParams}` : ''}${id ? `&id=${id}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    let request = await httpRequest2(`api/v1/members/userregistration?role=STAFF&${viewpersonnelParams}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewpersonnelTableDataSignal);
            }
        }
    } else {
        return notification('No records retrieved');
    }
}

async function onviewpersonnelTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.firstname || 'N/A'} ${item.lastname || ''} ${item.othernames || ''}</td>
        <td>
            ${item.image ? `<img src="${item.image}" alt="Image" class="w-32 h-32">` : 'No Image Available'}
        </td>
        <td>${item.email || 'N/A'}</td>
        <td>${item.phone || 'N/A'}</td>
        <td>${item.country || 'N/A'}</td>
        <td>${item.state || 'N/A'}</td>
        <td>${item.address || 'N/A'}</td>
        <td>${item.gender || 'N/A'}</td>
        <td>${item.occupation || 'N/A'}</td>
        <td>${item.maritalstatus || 'N/A'}</td>
        <td>${item.branchname || 'N/A'}</td>
        <td>
            <button onclick="showActions('${item.id}')" class="w-8 h-8 text-white bg-gray-600 rounded-full drop-shadow-md">
                &#x22EE; <!-- Vertical ellipsis icon -->
            </button>
        </td>

    </tr>`
    )
    .join('');
    injectPaginatatedTable(rows);
}

function showActions(id) {
    Swal.fire({
        title: '<h2 class="text-lg font-semibold text-gray-800">Select an Action</h2>',
        html: `
            <div class="grid grid-cols-1 gap-3 text-sm font-medium">
                <!-- Personnel Actions -->
                <button onclick="performAction('${id}', 'history')" class="flex items-center justify-center gap-2 rounded bg-[#3E90EA] px-4 py-2 text-white shadow-md transition">
                    <i class="fas fa-eye"></i> View
                </button>
                <button onclick="performAction('${id}', 'guarantor')" class="flex items-center justify-center gap-2 rounded bg-[#3E90EA] px-4 py-2 text-white shadow-md transition">
                    <i class="fas fa-user-shield"></i> Add Guarantor
                </button>
                <button onclick="performAction('${id}', 'referee')" class="flex items-center justify-center gap-2 rounded bg-[#3E90EA] px-4 py-2 text-white shadow-md transition">
                    <i class="fas fa-user-check"></i> Add Referee
                </button>
                <button onclick="performAction('${id}', 'qualification')" class="flex items-center justify-center gap-2 rounded bg-[#3E90EA] px-4 py-2 text-white shadow-md transition">
                    <i class="fas fa-graduation-cap"></i> Add Qualifications
                </button>
                <button onclick="performAction('${id}', 'employmentrecord')" class="flex items-center justify-center gap-2 rounded bg-[#3E90EA] px-4 py-2 text-white shadow-md transition">
                    <i class="fas fa-building"></i> Add Employer Record
                </button>

                <!-- Administrative Actions -->
                <button onclick="performAction('${id}', 'query')" class="flex gap-2 justify-center items-center px-4 py-2 text-white bg-red-500 rounded shadow-md transition">
                    <i class="fas fa-exclamation-circle"></i> Query
                </button>
                <button onclick="performAction('${id}', 'terminationresignation')" class="flex gap-2 justify-center items-center px-4 py-2 text-white bg-red-500 rounded shadow-md transition">
                    <i class="fas fa-user-slash"></i> Terminate
                </button>
                <button onclick="performAction('${id}', 'suspension')" class="flex gap-2 justify-center items-center px-4 py-2 text-white bg-red-500 rounded shadow-md transition">
                    <i class="fas fa-pause-circle"></i> Suspend
                </button>
                <button onclick="performAction('${id}', 'warning')" class="flex gap-2 justify-center items-center px-4 py-2 text-white bg-red-500 rounded shadow-md transition">
                    <i class="fas fa-exclamation-triangle"></i> Warn
                </button>

                <!-- Status Updates -->
                <button onclick="performAction('${id}', 'promotiondemotion')" class="flex gap-2 justify-center items-center px-4 py-2 text-white bg-green-500 rounded shadow-md transition">
                    <i class="fas fa-arrow-up"></i> Promote
                </button>
                <button onclick="performAction('${id}', 'leave')" class="flex gap-2 justify-center items-center px-4 py-2 text-white bg-green-500 rounded shadow-md transition">
                    <i class="fas fa-door-open"></i> Leave
                </button>
            </div>
        `,
        showCancelButton: true,
        cancelButtonColor: '#d33',
        showConfirmButton: false,
        customClass: {
            popup: 'swal-wide'
        }
    });
}

function performAction(id, route){
    localStorage.setItem('viewPersonnelActionid', id);
    window.location.href = `/view/index.html?r=${route}`;
}

const viewPersonnelActionid = localStorage.getItem('viewPersonnelActionid');




