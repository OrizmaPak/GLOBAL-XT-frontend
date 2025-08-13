let refereeid
async function refereeActive() {
    refereeid = ''
    const form = document.querySelector('#refereeform')
    const form2 = document.querySelector('#filterviewreferee')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', refereeFormSubmitHandler)
    if(form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', fetchreferee)
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
        fetchreferee(viewPersonnelActionid); 
    } else{
        await fetchreferee()
    }

    localStorage.removeItem('viewPersonnelActionid');
}

async function fetchreferee(id) {

    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching referee data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#filterviewreferee');
    let formData = new FormData(form);
    let queryParams = new URLSearchParams(formData).toString();

    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    // let request = await httpRequest2(`api/v1/personnel/referee?${queryParams ? `${queryParams}` : ''}${id ? `&id=${id}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    let request = await httpRequest2(`api/v1/personnel/referee?${queryParams}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onrefereeTableDataSignal);
            }
        } else {
            document.getElementsByClassName('updater')[0].click();
            refereeid = id;
            const refereeItem = request.data.find((item) => item.id == id)
            populateData(refereeItem);
            if (refereeItem && refereeItem.imageone) {
                document.getElementById('imageOnePreview').src = refereeItem.imageone;
            }
            if (refereeItem && refereeItem.imagetwo) {
                document.getElementById('imageTwoPreview').src = refereeItem.imagetwo;
            }
        }
    } else {
        return notification('No records retrieved');
    }
}

async function removereferee(id) {
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

            let request = await httpRequest2('api/v1/personnel/referee', id ? getparamm() : null, null, 'json', "DELETE");
            return request;
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    // Show notification based on the result
    if (confirmed.isConfirmed) {
        fetchreferee();
        return notification(confirmed.value.message);
    }
}


async function onrefereeTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.refereename}</td>
        <td>${item.refereeofficeaddress}</td>
        <td>${item.refereeresidentialaddress}</td>
        <td>${item.refereeoccupation}</td>
        <td>${item.relationship}</td>
        <td>${item.refereephone}</td>
        <td>${item.refereeyearsknown}</td>
        <td class="flex gap-3 items-center">
            <button title="Edit row entry" onclick="fetchreferee('${item.id}')" class="w-8 h-8 text-xs text-white rounded-full drop-shadow-md material-symbols-outlined bg-primary-g" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="removereferee('${item.id}')" class="w-8 h-8 text-xs text-white bg-red-600 rounded-full drop-shadow-md material-symbols-outlined" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function refereeFormSubmitHandler() {
    if(!validateForm('refereeform', getIdFromCls('comp'))) return notification('Please fill all required fields', 0)
    
    let payload = getFormData2(document.querySelector('#refereeform'), refereeid ? [['id', refereeid]] : null);

    const confirmed = await Swal.fire({
        title: refereeid ? 'Updating...' : 'Submitting...',
        text: 'Please wait while we submit your data.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/personnel/referee', payload, document.querySelector('#refereeform #submit'), 'json', 'POST');
            Swal.close();

            if (request.status) {
                notification('Success!', 1);
                const form = document.querySelector('#refereeform');
                form.reset();
                if(refereeid)form.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
                refereeid = '';
                document.getElementsByClassName('viewer')[0].click();
                fetchreferee();
            } else {    
                notification(request.message, 0);
            }
        }
    });
}
