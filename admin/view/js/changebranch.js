let changebranchid
async function changebranchActive() {
    changebranchid = ''
    const form = document.querySelector('#changebranchform')
    const form2 = document.querySelector('#viewchangebranchform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', changebranchFormSubmitHandler)
    if(form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', fetchchangebranch)
    datasource = []
 const today = new Date();
const startdate = new Date(today.getFullYear(), today.getMonth(), 1);
const enddate = new Date(today);
enddate.setDate(enddate.getDate() + 1);

document.getElementById('startdate').value = startdate.toISOString().split('T')[0];
document.getElementById('enddate').value = enddate.toISOString().split('T')[0];
    await fetchchangebranch()
    // await getAllUsers('useridd', 'name', false, false, false);
    await getAllbranch(false, 'branch');
          
    tomselect = new TomSelect('#userid', {
        plugins: ['dropdown_input'],
        valueField: 'id',
        labelField: 'fullname',
        searchField: ['fullname'],
        maxOptions: 100,
        preload: false,
        persist: false,           // ✅ Don't keep old options
        loadThrottle: 0,          // ✅ Prevent delayed reloading
        loadingClass: 'ts-loading',
    
        render: {
            loading: function() {
                return `
                    <div class="ts-spinner-container">
                        <span class="ts-spinner"></span>
                        <span class="ts-spinner-text">Loading...</span>
                    </div>
                `;
            }
        },
    
        shouldLoad: function(query) {
            return query.length > 0;
        },
    
        // ✅ Force display of all returned results, ignore fuzzy matching
        score: function() {
            return function() {
                return 1;
            };
        },
    
        load: async function(query, callback) {
            try {
                const request = await httpRequest2(`api/v1/members/userregistration?q=${encodeURIComponent(query)}`, null, null, 'json', 'GET');
                dashboardAllUsers = request.data;
    
                // ✅ Fully clear old options and cache
                this.clearOptions();
                this.clearCache();
    
                const results = request.data.map(user => ({
                    id: user.id,
                    fullname: `${user.firstname} ${user.lastname} - (${user.branchname})`
                }));
    
                callback(results);
            } catch (error) {
                console.error('Error loading options:', error);
                callback(); // Empty list on error
            }
        },
    
        onInitialize: function() {
            dashboardUserId = the_user.id;
            this.setValue(dashboardUserId);
        },
    
        onChange: function(value) {
            const selectBranchElement = document.getElementById('selectbranch');
            const submitContainerElement = document.getElementById('submitcontainer');
            const reasonContainerElement = document.getElementById('reasoncontainer');
    
            if (value) {
                selectBranchElement.classList.remove('hidden');
                submitContainerElement.classList.remove('hidden');
                reasonContainerElement.classList.remove('hidden');
            } else {
                selectBranchElement.classList.add('hidden');
                submitContainerElement.classList.add('hidden');
                reasonContainerElement.classList.add('hidden');
            }
        }
    });
    

  
  
    new TomSelect('#branch', {
        plugins: ['remove_button', 'dropdown_input'],
        onInitialize: function() {
            console.log(checkpermission('FILTER BRANCH'))
            if(!checkpermission('FILTER BRANCH')) this.setValue(the_user.branch);
            if(!checkpermission('FILTER BRANCH')) this.disable();
        }
    });
}

async function fetchchangebranch() {

    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching changebranch data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let form = document.querySelector('#viewchangebranchform');
    let formData = new FormData(form);
    // formData.set('department', '');
    // formData.set('changebranch', '');
    let queryParams = new URLSearchParams(formData).toString();

    document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    let request = await httpRequest2(`api/v1/admin/getchangedbranch?${queryParams ? `${queryParams}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onchangebranchTableDataSignal);
            }
    } else {
        return notification('No records retrieved');
    }
}


 
async function onchangebranchTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${formatDate(item.dateadded)}</td>
        <td>${item.fullname}</td>
        <td>${item.current_branch}</td>
        <td>${item.previous_branch}</td>
        <td>${item.reason}</td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function changebranchFormSubmitHandler() {
    if(!validateForm('changebranchform', getIdFromCls('comp'))) return notification('Please fill all required fields', 0)
    
    let payload = getFormData2(document.querySelector('#changebranchform'));

    const confirmed = await Swal.fire({
        title: 'Updating...',
        text: 'Please wait while we submit your data.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/admin/changebranch', payload, document.querySelector('#changebranchform #submit'), 'json', 'POST');
            Swal.close();

            if (request.status) {
                notification('Success!', 1);
                const form = document.querySelector('#changebranchform');
                form.reset();
                if(changebranchid)form.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
                changebranchid = '';
                document.getElementById('changebranch').click();
            } else {    
                notification(request.message, 0);
            }
        }
    });
}
