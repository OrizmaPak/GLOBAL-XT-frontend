let eventsid
async function eventsActive() {
    eventsid = ''
    // const form = document.querySelector('#eventsform')
    // const form2 = document.querySelector('#vieweventsform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', eventsFormSubmitHandler)
    // if(form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', eventsFormSubmitHandler)
    datasource = []
    await getAllUsers('users', 'name')
    await getAllbranch()
    new TomSelect('#users', {
        plugins: ['remove_button', 'dropdown_input']
    });
    new TomSelect('#branch', {
        plugins: ['remove_button', 'dropdown_input']
    });
    //await fetchevents()
    // await getAllevents(true)
    // new TomSelect('#events', {
    //     // plugins: ['remove_button', 'dropdown_input'],
    //     onInitialize: function() {
    //         console.log(checkpermission('FILTER events'))
    //         if(!checkpermission('FILTER events')) this.setValue(the_user.events);
    //         if(!checkpermission('FILTER events')) this.disable();
    //     }
    // });
    // await getAllUsers('useridlist', 'id')
}

async function fetchevents(id) {

    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching events data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#vieweventsform');
    let formData = new FormData(form);
    // formData.set('department', '');
    // formData.set('events', '');
    let queryParams = new URLSearchParams(formData).toString();

    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    let request = await httpRequest2(`api/v1/inventory/requisition/view?${queryParams ? `${queryParams}` : ''}${id ? `&id=${id}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, oneventsTableDataSignal);
            }
        } else {
            document.getElementsByClassName('updater')[0].click();
            eventsid = request.data[0].id;
            populateData(request.data[0]);
        }
    } else {
        return notification('No records retrieved');
    }
}

async function removeevents(id) {
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

            let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json', "DELETE");
            return request;
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    // Show notification based on the result
    if (confirmed.isConfirmed) {
        fetchevents();
        return notification(confirmed.value.message);
    }
}


async function oneventsTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.events}</td>
        <td>${item.useridname??item.userid}</td>
        <td>${item.country}</td>
        <td>${item.state}</td>
        <td>${item.lga}</td>
        <td>${item.address}</td>
        <td class="flex items-center gap-3 ${item.events == default_events ? 'hidden' : ''}">
            <button title="Edit row entry" onclick="fetchevents('${item.id}')" class="material-symbols-outlined h-8 w-8 rounded-full bg-primary-g text-xs text-white drop-shadow-md" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="removeevents('${item.id}')" class="material-symbols-outlined hidden h-8 w-8 rounded-full bg-red-600 text-xs text-white drop-shadow-md" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function eventsFormSubmitHandler() {
    if(!validateForm('eventsform', getIdFromCls('comp'))) return notification('Please fill all required fields', 0)
    
    let payload = getFormData2(document.querySelector('#eventsform'), eventsid ? [['id', eventsid]] : null);

    const confirmed = await Swal.fire({
        title: eventsid ? 'Updating...' : 'Submitting...',
        text: 'Please wait while we submit your data.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/admin/events', payload, document.querySelector('#eventsform #submit'), 'json', 'POST');
            Swal.close();

            if (request.status) {
                notification('Success!', 1);
                const form = document.querySelector('#eventsform');
                form.reset();
                if(eventsid)form.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
                eventsid = '';
                document.getElementsByClassName('viewer')[0].click();
                fetchevents();
            } else {    
                notification(request.message, 0);
            }
        }
    });
}
