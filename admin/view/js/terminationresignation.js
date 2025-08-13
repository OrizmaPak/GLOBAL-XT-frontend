let terminationresignationid
async function terminationresignationActive() {
    terminationresignationid = ''
    const form = document.querySelector('#terminationresignationform')
    const form2 = document.querySelector('#filterviewterminationresignation')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', terminationresignationFormSubmitHandler)
    if(form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', fetchterminationresignation)
    datasource = []
   
    await getAllUsers('userid', 'name'),
    await getAllUsers('filterusers', 'name'),

    new TomSelect('#userid', {
        plugins: ['dropdown_input'],
        onInitialize: function () {
            if (!checkpermission('FILTER ALL USERS')) this.setValue(the_user.id);
            if (!checkpermission('FILTER ALL USERS')) this.disable();
            if (viewPersonnelActionid) this.setValue(viewPersonnelActionid);
            if (viewPersonnelActionid) this.disable();
        }
    });

    new TomSelect('#filterusers', {
        plugins: ['dropdown_input'],
        onInitialize: function() {
            console.log(checkpermission('FILTER USERS'))
            if(!checkpermission('FILTER USERS')) this.setValue(the_user.id);
            if(!checkpermission('FILTER USERS')) this.disable();
        }
    });

    if (viewPersonnelActionid) {
        fetchterminationresignation(viewPersonnelActionid); 
    } else{
        await fetchterminationresignation()
    }

    localStorage.removeItem('viewPersonnelActionid');
}

async function fetchterminationresignation(id) {

    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching terminationresignation data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#filterviewterminationresignation');
    let formData = new FormData(form);
    // formData.set('department', '');
    // formData.set('terminationresignation', '');
    let queryParams = new URLSearchParams(formData).toString();

    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    // let request = await httpRequest2(`api/v1/personnel/terminationresignation?${queryParams ? `${queryParams}` : ''}${id ? `&id=${id}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    let request = await httpRequest2(`api/v1/personnel/terminationresignation?${queryParams}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onterminationresignationTableDataSignal);
            }
        } else {
            document.getElementsByClassName('updater')[0].click();
            terminationresignationid = id;
            const terminationresignationItem = request.data.find((item) => item.id == id)
            populateData(terminationresignationItem);
            if (terminationresignationItem && terminationresignationItem.image) {
                document.getElementById('imageFrame').src = terminationresignationItem.image;
            }
        }
    } else {
        return notification('No records retrieved');
    }
}

async function onterminationresignationTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.personnelname}</td>
        <td>${item.title}</td>
        <td>${item.image ? `<img src="${item.image}" alt="Image" style="width: 100px; height: 100px;" />` : 'No Image'}</td>
        <td>${item.type}</td>
        <td>${formatDate(item.dateadded.split("T")[0])}</td>
        <td class="flex gap-3 items-center">
            <button title="Edit row entry" onclick="fetchterminationresignation('${item.id}')" class="w-8 h-8 text-xs text-white rounded-full drop-shadow-md material-symbols-outlined bg-primary-g" style="font-size: 18px;">edit</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function terminationresignationFormSubmitHandler() {
    if(!validateForm('terminationresignationform', getIdFromCls('comp'))) return notification('Please fill all required fields', 0)
    
    let payload = getFormData2(document.querySelector('#terminationresignationform'), terminationresignationid ? [['id', terminationresignationid]] : null);

    const confirmed = await Swal.fire({
        title: terminationresignationid ? 'Updating...' : 'Submitting...',
        text: 'Please wait while we submit your data.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/personnel/terminationresignation', payload, document.querySelector('#terminationresignationform #submit'), 'json', 'POST');
            Swal.close();

            if (request.status) {
                notification('Success!', 1);
                const form = document.querySelector('#terminationresignationform');
                form.reset();
                if(terminationresignationid)form.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
                terminationresignationid = '';
                document.getElementsByClassName('viewer')[0].click();
                fetchterminationresignation();
            } else {    
                notification(request.message, 0);
            }
        }
    });
}
