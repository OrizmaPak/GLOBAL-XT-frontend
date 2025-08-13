let monitoringevaluationid
async function monitoringevaluationActive() {
    monitoringevaluationid = ''
    const form = document.querySelector('#monitoringevaluationform')
    const form2 = document.querySelector('#filterviewmonitoringevaluation')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', monitoringevaluationFormSubmitHandler)
    if(form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', fetchmonitoringevaluation)
    datasource = []
    
   
    await getAllUsers('userid', 'name'),
    await getAllUsers('filterusers', 'name'),

    new TomSelect('#userid', {
        plugins: ['dropdown_input'],
        onInitialize: function () {
            if (!checkpermission('FILTER ALL USERS')) this.setValue(the_user.id);
            if (!checkpermission('FILTER ALL USERS')) this.disable();
        }
    });

    new TomSelect('#filterusers', {
        plugins: ['dropdown_input'],
        onInitialize: function () {
            if (!checkpermission('FILTER ALL USERS')) this.setValue(the_user.id);
            if (!checkpermission('FILTER ALL USERS')) this.disable();
        }
    });

    await fetchmonitoringevaluation()
}

async function fetchmonitoringevaluation(id) {

    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching monitoringevaluation data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#filterviewmonitoringevaluation');
    let formData = new FormData(form);
    // formData.set('department', '');
    // formData.set('monitoringevaluation', '');
    let queryParams = new URLSearchParams(formData).toString();

    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    // let request = await httpRequest2(`api/v1/personnel/monitoringevaluation?${queryParams ? `${queryParams}` : ''}${id ? `&id=${id}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    let request = await httpRequest2(`api/v1/personnel/monitoringevaluation?${queryParams}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onmonitoringevaluationTableDataSignal);
            }
        } else {
            document.getElementsByClassName('updater')[0].click();
            monitoringevaluationid = id;
            const monitoringevaluationItem = request.data.find((item) => item.id == id)
            populateData(monitoringevaluationItem);
            if (monitoringevaluationItem && monitoringevaluationItem.image) {
                document.getElementById('imageFrame').src = monitoringevaluationItem.image;
            }
        }
    } else {
        return notification('No records retrieved');
    }
}

async function removemonitoringevaluation(id) {
    // Ask for confirmation using SweetAlert with async and loader
    const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            function getparamm() {
                let paramstr = new FormData();
                paramstr.append('id', id);
                return paramstr;
            }

            let request = await httpRequest2('api/v1/personnel/monitoringevaluation', id ? getparamm() : null, null, 'json', "DELETE");
            return request;
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    // Show notification based on the result
    if (confirmed.isConfirmed) {
        fetchmonitoringevaluation();
        return notification(confirmed.value.message);
    }
}

async function onmonitoringevaluationTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.personnelname}</td>
        <td>${item.title}</td>
        <td>${item.image ? `<img src="${item.image}" alt="Image" style="width: 100px; height: 100px;" />` : 'No Image'}</td>
        <td>${formatDate(item.dateadded.split("T")[0])}</td>
        <td class="flex gap-3 items-center">
            <button title="Edit row entry" onclick="fetchmonitoringevaluation('${item.id}')" class="w-8 h-8 text-xs text-white rounded-full drop-shadow-md material-symbols-outlined bg-primary-g" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="removemonitoringevaluation('${item.id}')" class="w-8 h-8 text-xs text-white bg-red-600 rounded-full drop-shadow-md material-symbols-outlined" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function monitoringevaluationFormSubmitHandler() {
    if(!validateForm('monitoringevaluationform', getIdFromCls('comp'))) return notification('Please fill all required fields', 0)
    
    let payload = getFormData2(document.querySelector('#monitoringevaluationform'), monitoringevaluationid ? [['id', monitoringevaluationid]] : null);

    const confirmed = await Swal.fire({
        title: monitoringevaluationid ? 'Updating...' : 'Submitting...',
        text: 'Please wait while we submit your data.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/personnel/monitoringevaluation', payload, document.querySelector('#monitoringevaluationform #submit'), 'json', 'POST');
            Swal.close();

            if (request.status) {
                notification('Success!', 1);
                const form = document.querySelector('#monitoringevaluationform');
                form.reset();
                if(monitoringevaluationid)form.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
                monitoringevaluationid = '';
                document.getElementsByClassName('viewer')[0].click();
                fetchmonitoringevaluation();
            } else {    
                notification(request.message, 0);
            }
        }
    });
}
