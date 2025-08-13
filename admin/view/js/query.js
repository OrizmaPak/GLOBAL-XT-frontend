let queryid
async function queryActive() {
    queryid = ''
    const form = document.querySelector('#queryform')
    const form2 = document.querySelector('#filterviewquery')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', queryFormSubmitHandler)
    if(form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', fetchquery)
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
        fetchquery(viewPersonnelActionid); 
    } else{
        await fetchquery()
    }

    localStorage.removeItem('viewPersonnelActionid');
}

async function fetchquery(id) {

    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching query data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#filterviewquery');
    let formData = new FormData(form);
    // formData.set('department', '');
    // formData.set('query', '');
    let queryParams = new URLSearchParams(formData).toString();

    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    // let request = await httpRequest2(`api/v1/personnel/query?${queryParams ? `${queryParams}` : ''}${id ? `&id=${id}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    let request = await httpRequest2(`api/v1/personnel/query?${queryParams}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onqueryTableDataSignal);
            }
        } else {
            document.getElementsByClassName('updater')[0].click();
            queryid = id;
            queryItem = request.data.find((item) => item.id == id)
            populateData(queryItem);
            if (queryItem && queryItem.imageone) {
                document.getElementById('imageOnePreview').src = queryItem.imageone;
            }
        }
    } else {
        return notification('No records retrieved');
    }
}

async function removequery(id) {
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

            let request = await httpRequest2('api/v1/personnel/query', id ? getparamm() : null, null, 'json', "DELETE");
            return request;
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    // Show notification based on the result
    if (confirmed.isConfirmed) {
        fetchquery();
        return notification(confirmed.value.message);
    }
}


async function onqueryTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.personnelname}</td>
        <td>${item.query}</td>
        <td>
            ${item.imageone ? `<img src="${item.imageone}" alt="Image One" class="w-32 h-32">` : 'No Image Available'}
        </td>
       <td>
         <div class="flex gap-3 items-center">
            <button title="Edit row entry" onclick="fetchquery('${item.id}')" class="w-8 h-8 text-xs text-white rounded-full drop-shadow-md material-symbols-outlined bg-primary-g" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="removequery('${item.id}')" class="w-8 h-8 text-xs text-white bg-red-600 rounded-full drop-shadow-md material-symbols-outlined" style="font-size: 18px;">delete</button>
        </div>
       </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function queryFormSubmitHandler() {
    if(!validateForm('queryform', getIdFromCls('comp'))) return notification('Please fill all required fields', 0)
    
    let payload = getFormData2(document.querySelector('#queryform'), queryid ? [['id', queryid]] : null);

    const confirmed = await Swal.fire({
        title: queryid ? 'Updating...' : 'Submitting...',
        text: 'Please wait while we submit your data.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/personnel/query', payload, document.querySelector('#queryform #submit'), 'json', 'POST');
            Swal.close();

            if (request.status) {
                notification('Success!', 1);
                const form = document.querySelector('#queryform');
                form.reset();
                if(queryid)form.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
                queryid = '';
                document.getElementsByClassName('viewer')[0].click();
                fetchquery();
            } else {    
                notification(request.message, 0);
            }
        }
    });
}
