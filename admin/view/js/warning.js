let warningid
async function warningActive() {
    warningid = ''
    const form = document.querySelector('#warningform')
    const form2 = document.querySelector('#filterviewwarning')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', warningFormSubmitHandler)
    if(form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', fetchwarning)
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
        onInitialize: function () {
            if (!checkpermission('FILTER ALL USERS')) this.setValue(the_user.id);
            if (!checkpermission('FILTER ALL USERS')) this.disable();
        }
    });

    if (viewPersonnelActionid) {
        fetchwarning(viewPersonnelActionid); 
    } else{
        await fetchwarning()
    }

    localStorage.removeItem('viewPersonnelActionid');
}

async function fetchwarning(id) {

    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching warning data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#filterviewwarning');
    let formData = new FormData(form);
    // formData.set('department', '');
    // formData.set('warning', '');
    let queryParams = new URLSearchParams(formData).toString();

    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    // let request = await httpRequest2(`api/v1/personnel/warning?${queryParams ? `${queryParams}` : ''}${id ? `&id=${id}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    let request = await httpRequest2(`api/v1/personnel/warning?${queryParams}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onwarningTableDataSignal);
            }
        } else {
            document.getElementsByClassName('updater')[0].click();
            warningid = id;
            const warningItem = request.data.find((item) => item.id == id)
            populateData(warningItem);
            if (warningItem && warningItem.image) {
                document.getElementById('imageFrame').src = warningItem.image;
            }
        }
    } else {
        return notification('No records retrieved');
    }
}

async function removewarning(id) {
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

            let request = await httpRequest2('api/v1/personnel/warning', id ? getparamm() : null, null, 'json', "DELETE");
            return request;
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    // Show notification based on the result
    if (confirmed.isConfirmed) {
        fetchwarning();
        return notification(confirmed.value.message);
    }
}

async function onwarningTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.personnelname}</td>
        <td>${item.title}</td>
        <td>${item.image ? `<img src="${item.image}" alt="Image" style="width: 100px; height: 100px;" />` : 'No Image'}</td>
        <td>${formatDate(item.dateadded.split("T")[0])}</td>
        <td class="flex gap-3 items-center">
            <button title="Edit row entry" onclick="fetchwarning('${item.id}')" class="w-8 h-8 text-xs text-white rounded-full drop-shadow-md material-symbols-outlined bg-primary-g" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="removewarning('${item.id}')" class="w-8 h-8 text-xs text-white bg-red-600 rounded-full drop-shadow-md material-symbols-outlined" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function warningFormSubmitHandler() {
    if(!validateForm('warningform', getIdFromCls('comp'))) return notification('Please fill all required fields', 0)
    
    let payload = getFormData2(document.querySelector('#warningform'), warningid ? [['id', warningid]] : null);

    const confirmed = await Swal.fire({
        title: warningid ? 'Updating...' : 'Submitting...',
        text: 'Please wait while we submit your data.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/personnel/warning', payload, document.querySelector('#warningform #submit'), 'json', 'POST');
            Swal.close();

            if (request.status) {
                notification('Success!', 1);
                const form = document.querySelector('#warningform');
                form.reset();
                if(warningid)form.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
                warningid = '';
                document.getElementsByClassName('viewer')[0].click();
                fetchwarning();
            } else {    
                notification(request.message, 0);
            }
        }
    });
}
