let guarantorid
async function guarantorActive() {
    guarantorid = ''
    const form = document.querySelector('#guarantorform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', guarantorFormSubmitHandler)
        const form1 = document.querySelector('#filterviewguarantor');
    if (form1 && form1.querySelector('#querySubmit')) form1.querySelector('#querySubmit').addEventListener('click', () => fetchguarantor());
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
        fetchguarantor(viewPersonnelActionid); 
    } else{
        await fetchguarantor()
    }

    localStorage.removeItem('viewPersonnelActionid');
}

async function fetchguarantor(id) {

    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching guarantor data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#filterviewguarantor');
    let formData = new FormData(form);
    let queryParams = new URLSearchParams(formData).toString();

    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    // let request = await httpRequest2(`api/v1/personnel/guarantor?${queryParams ? `${queryParams}` : ''}${id ? `&id=${id}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    let request = await httpRequest2(`api/v1/personnel/guarantor?${queryParams}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onguarantorTableDataSignal);
            }
        } else {
            document.getElementsByClassName('updater')[0].click();
            guarantorid = id;
            const guarantorItem = request.data.find((item) => item.id == id);
            populateData(guarantorItem);
            if (guarantorItem && guarantorItem.imageone) {
                document.getElementById('imageOnePreview').src = guarantorItem.imageone;
            }
            if (guarantorItem && guarantorItem.imagetwo) {
                document.getElementById('imageTwoPreview').src = guarantorItem.imagetwo;
            }
        }
    } else {
        return notification('No records retrieved');
    }
}

async function removeguarantor(id) {
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

            let request = await httpRequest2('api/v1/personnel/guarantor', id ? getparamm() : null, null, 'json', "DELETE");
            return request;
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    // Show notification based on the result
    if (confirmed.isConfirmed) {
        fetchguarantor();
        return notification(confirmed.value.message);
    }
}


async function onguarantorTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.guarantorname}</td>
        <td>${item.guarantorofficeaddress}</td>
        <td>${item.guarantorresidentialaddress}</td>
        <td>${item.guarantoroccupation}</td>
        <td>${item.guarantorphone}</td>
        <td>${item.yearsknown}</td>
        <td class="flex gap-3 items-center">
            <button title="Edit row entry" onclick="fetchguarantor('${item.id}')" class="w-8 h-8 text-xs text-white rounded-full drop-shadow-md material-symbols-outlined bg-primary-g" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="removeguarantor('${item.id}')" class="w-8 h-8 text-xs text-white bg-red-600 rounded-full drop-shadow-md material-symbols-outlined" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function guarantorFormSubmitHandler() {
    if(!validateForm('guarantorform', getIdFromCls('comp'))) return notification('Please fill all required fields', 0)
    
    let payload = getFormData2(document.querySelector('#guarantorform'), guarantorid ? [['id', guarantorid]] : null);

    const confirmed = await Swal.fire({
        title: guarantorid ? 'Updating...' : 'Submitting...',
        text: 'Please wait while we submit your data.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/personnel/guarantor', payload, document.querySelector('#guarantorform #submit'), 'json', 'POST');
            Swal.close();

            if (request.status) {
                notification('Success!', 1);
                const form = document.querySelector('#guarantorform');
                form.reset();
                if(guarantorid)form.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
                guarantorid = '';
                document.getElementsByClassName('viewer')[0].click();
                fetchguarantor();
            } else {    
                notification(request.message, 0);
            }
        }
    });
}
