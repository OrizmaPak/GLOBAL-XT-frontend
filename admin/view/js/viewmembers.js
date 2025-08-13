async function viewmembersActive() {
    datasource = []
    // await fetchviewmembers()
    const form = document.querySelector('#viewmembersform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', fetchviewmembers)
    await getAllUsers('createdby', 'staff',)
    await getregistrationpoint()
    await getallmembershipsinviewmembers()
    await getAllbranch()
    new TomSelect('#branch', {
        plugins: ['dropdown_input'],
        onInitialize: function() {
            console.log(checkpermission('FILTER BRANCH'))
            if(!checkpermission('FILTER BRANCH')) this.setValue(the_user.branch);
            if(!checkpermission('FILTER BRANCH')) this.disable();

        }
    });
    new TomSelect('#createdby', {
        plugins: ['dropdown_input'],
        onInitialize: function() {
            console.log(checkpermission('FILTER ALL USERS'))
            if(!checkpermission('FILTER ALL USERS')) this.setValue(the_user.id);
            if(!checkpermission('FILTER ALL USERS')) this.disable();
        }
    });
    new TomSelect('#registrationpointsearch', {
        plugins: ['dropdown_input'],
        onInitialize: function() {
            console.log(checkpermission('FILTER ALL REGISTRATION POINTS'))
            if(!checkpermission('FILTER ALL REGISTRATION POINTS')) this.setValue(the_user.registrationpoint);
            if(!checkpermission('FILTER ALL REGISTRATION POINTS')) this.disable();
        }
    });
    new TomSelect('#member', {
        plugins: ['dropdown_input'],
    });
    // await getAllUsers('useridlist', 'id')
}

async function getallmembershipsinviewmembers(id='') {
    let request = await httpRequest2(`api/v1/admin/organizationmembership`, null, null, 'json', 'GET');
    if (request.status) {
        if (id === '') {
            document.getElementById('member').innerHTML = `<option value="">--SELECT MEMBERSHIP--</option>`;
            document.getElementById('member').innerHTML += request.data.map(data => `<option value="${data.id}">${data.member}</option>`).join('');
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = `<option value="">--SELECT MEMBERSHIP--</option>`;
                element.innerHTML += request.data.map(data => `<option value="${data.id}">${data.member}</option>`).join('');
            }
        }
    } else {
        document.getElementById('member').innerHTML = `<option value="">No membership found</option>`;
        return notification('No registration points retrieved');
    }
}

async  function getregistrationpoint() {
    let request = await httpRequest2(`api/v1/admin/registrationpoints`, null, null, 'json', 'GET');
    if(request.status) {
            document.getElementById('registrationpointsearch').innerHTML = `<option value="">--SELECT REGISTRATION POINT--</option>`
            document.getElementById('registrationpointsearch').innerHTML += request.data.map(data => `<option value="${data.id}">${data.registrationpoint}</option>`).join('')
        } else {
            document.getElementById('registrationpointsearch').innerHTML = `<option value="">No registration points found</option>`
        return notification('No registration points retrieved')
    }
}

async function fetchviewmembers() {

    // Show loading state using SweetAlert
    // const loadingAlert = Swal.fire({
    //     title: 'Please wait...',
    //     text: 'Fetching viewmembers data, please wait.',
    //     allowOutsideClick: false,
    //     didOpen: () => {
    //         Swal.showLoading();
    //     }
    // });

    const params = new URLSearchParams();
    const createdBy = did('createdby').tomselect.getValue();
    const status = did('status').value;
    const registrationPoint = did('registrationpointsearch').tomselect.getValue() == 0 ? null : did('registrationpointsearch').tomselect.getValue() == '' ? null : did('registrationpointsearch').tomselect.getValue();
    const q = did('search').value;
    const branch = did('branch').tomselect.getValue();
    const member = did('member').tomselect.getValue();
    const gender = did('gender').value;
    const maritalStatus = did('maritalstatus').value;
    const startDate = did('startdate').value;
    const endDate = did('enddate').value;
    const role = did('role').value;

    if (createdBy) params.append('createdby', createdBy);
    if(role) params.append('role', role);
    if (status) params.append('status', status);
    if (registrationPoint) params.append('registrationpoint', registrationPoint);
    if (q) params.append('q', q);
    if (branch) params.append('branch', branch);
    if (member) params.append('member', member);
    if (gender) params.append('gender', gender);
    if (maritalStatus) params.append('maritalstatus', maritalStatus);
    if (startDate) params.append('startdate', startDate);
    if (endDate) params.append('enddate', endDate);

    let request = await httpRequest2(`api/v1/members/finduser?${params.toString()}`, null, document.querySelector('#viewmembersform #submit'), 'json', 'GET');
    Swal.close(); // Close the loading alert once the request is complete

     document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`;
    if (request.status) {
                datasource = request.data;
                resolvePagination(datasource, onviewmembersTableDataSignal);
    } else {
        return notification('No records retrieved');
    }
}

function selectAllCheckboxesviewmembers(checkboxx) {
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checkboxx.checked;
    });
}   

function checkallselectviewmembers() {
    did('selectAllCheckbox').checked = false;
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function deselectAllCheckboxesviewmembers() {
    did('selectAllCheckbox').checked = false;
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}


async function onviewmembersTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td><input onchange="did('selectAllCheckbox').checked = false" type="checkbox" class="checkbox" id="${item.id}" name="checkbox${index}" value="${item.id}"></td>
        <td>${formatDate(item.dateadded.split('T')[0])}</td>
        <td>${item.lastname} ${item.firstname} ${item.othernames}</td>
        <td>${item.branchname??item.branch}</td>
        <td>${item.country}</td>
        <td>${item.state}</td>
        <td>${item.address}</td>
        <td class="flex items-center gap-3 ">
            <button title="Edit row entry" onclick="fetchviewmembersview('${item.id}')" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
            <button title="Delete row entry" onclick="removeviewmembers('${item.id}')" class="hidden material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function fetchviewmembersview(id) {
    const user = datasource.find(item => item.id == id);
    
    if (!user) {
        return notification('User not found', 0);
    }

    // Function to format date
    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, options);
    }

    const content = `
    <div class="flex flex-col space-y-4">
        <!-- Profile Header -->
        <div class="flex flex-col items-center space-y-3">
            <div class="relative">
                <img src="${user.image || './images/default-avatar.png'}" alt="Profile Image" class="w-32 h-32 rounded-full object-cover shadow-lg" />
                <input type="file" name="image" id="image" class="hidden" accept="image/*" onchange="updateImage(event)">
            </div>
            <div class="text-center">
                <h2 class="text-2xl font-bold text-gray-800">${user.firstname} ${user.lastname} ${user.othernames ? user.othernames : ''}</h2>
                <p class="text-sm font-medium text-gray-500 capitalize">${user.role || 'N/A'}</p>
            </div>
        </div>
        
        <!-- Tabs Navigation -->
        <div>
            <nav class="flex border-b">
                <button class="tab-link px-4 py-2 -mb-px text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none" data-tab="basic">Basic Details</button>
                <button class="tab-link px-4 py-2 -mb-px text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none" data-tab="address">Address Details</button>
                <button class="tab-link px-4 py-2 -mb-px text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none" data-tab="kin">Next of Kin</button>
                <button class="tab-link px-4 py-2 -mb-px text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none" data-tab="additional">Additional Info</button>
            </nav>
        </div>
        
        <!-- Tabs Content -->
        <div class="tab-content mt-4">
            <!-- Basic Details Tab -->
            <div id="basic" class="tab-pane">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Basic Details</h3>
                    <table class="min-w-full divide-y divide-gray-200">
                        <tbody class="bg-white">
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.email || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Email Verified</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.emailverified ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Phone</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.phone || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Gender</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.gender || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Date of Birth</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.dateofbirth ? formatDate(user.dateofbirth.split('T')[0]) : 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Marital Status</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.maritalstatus || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Spouse Name</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.spousename || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Occupation</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.occupation || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Role</th>
                                <td class="px-6 py-4 !text-lg text-gray-600 capitalize">${user.role || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                                <td class="px-6 py-4 !text-lg text-gray-600 capitalize">${user.status || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Address Details Tab -->
            <div id="address" class="tab-pane hidden">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Address Details</h3>
                    <table class="min-w-full divide-y divide-gray-200">
                        <tbody class="bg-white">
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Country</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.country || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">State</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.state || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Town</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.town || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">LGA</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.lga || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Address</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.address || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">State of Residence</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.stateofresidence || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">LGA of Residence</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.lgaofresidence || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Office Address</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.officeaddress || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Next of Kin Information Tab -->
            <div id="kin" class="tab-pane hidden">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Next of Kin Information</h3>
                    <table class="min-w-full divide-y divide-gray-200">
                        <tbody class="bg-white">
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Full Name</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.nextofkinfullname || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Relationship</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.nextofkinrelationship || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Phone</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.nextofkinphone || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Occupation</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.nextofkinoccupation || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Address</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.nextofkinaddress || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Office Address</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.nextofkinofficeaddress || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Additional Information Tab -->
            <div id="additional" class="tab-pane hidden">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                    <table class="min-w-full divide-y divide-gray-200">
                        <tbody class="bg-white">
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Registration Point</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.registrationpoint !== null ? user.registrationpoint : 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Permissions</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.permissions || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">User Permissions</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.userpermissions || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Last Updated</th>
                                <td class="px-6 py-4 !text-lg text-gray-600">${user.lastupdated ? formatDate(user.lastupdated.split('T')[0]) : 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `;

    Swal.fire({
        title: 'User Details',
        html: content,
        showCloseButton: true,
        focusConfirm: false,
        width: '80%',
        customClass: {
            popup: 'bg-white rounded-lg overflow-auto shadow-xl',
            title: 'text-2xl font-bold text-gray-800 pb-2 border-b',
            content: 'p-4'
        },
        confirmButtonColor: '#3085d6', // Set the OK button color to blue
        didOpen: () => {
            // Tab Switching Logic
            const tabs = Swal.getPopup().querySelectorAll('.tab-link');
            const panes = Swal.getPopup().querySelectorAll('.tab-pane');

            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active classes from all tabs
                    tabs.forEach(t => {
                        t.classList.remove('border-b-2', 'border-blue-500', 'text-gray-800');
                        t.classList.add('text-gray-600');
                    });

                    // Hide all panes
                    panes.forEach(p => p.classList.add('hidden'));

                    // Add active classes to clicked tab
                    this.classList.add('border-b-2', 'border-blue-500', 'text-gray-800');
                    this.classList.remove('text-gray-600');

                    // Show corresponding pane
                    const tabName = this.getAttribute('data-tab');
                    const activePane = Swal.getPopup().querySelector(`#${tabName}`);
                    if (activePane) {
                        activePane.classList.remove('hidden');
                    }
                });
            });

            // Activate the first tab by default
            if (tabs.length > 0) {
                tabs[0].click();
            }
        }
    });
}

function openMessageModal() {
    /* 1 ▸ Inject once‑per‑page CSS  */
    if (!document.getElementById('mature‑msg‑modal‑style')) {
        const s = document.createElement('style');
        s.id = 'mature‑msg‑modal‑style';
        s.textContent = `
        /* ====== Mature Message Modal ====== */
        .m‑modal__header   {display:flex;align-items:center;gap:.5rem;
                            background:#ffffff;border-bottom:1px solid #e5e7eb;
                            padding:.75rem 1rem .5rem}
        .m‑modal__title    {font-weight:600;font-size:1.125rem;color:#374151}
        .m‑tab             {padding:.25rem .875rem;font-size:.875rem;font-weight:500;
                            border-bottom:2px solid transparent;cursor:pointer;
                            color:#6b7280;transition:border-color .15s,color .15s}
        .m‑tab.is‑active   {color:#1d4ed8;border-color:#1d4ed8}
        .m‑pane            {margin-top:1rem}
        .m‑textarea        {width:100%;height:8rem;resize:vertical;
                            border:1px solid #d1d5db;border-radius:.375rem;
                            padding:.75rem;font-size:.875rem;color:#111827;
                            box-shadow:inset 0 1px 2px rgba(0,0,0,.05)}
        .m‑stats           {font-size:.75rem;color:#6b7280;margin-top:.25rem}
        .m‑progress‑rail   {height:.25rem;background:#e5e7eb;border-radius:.125rem;
                            overflow:hidden}
        .m‑progress‑bar    {height:100%;background:#3b82f6;width:0%;transition:width .3s}
        .m‑fade‑in         {animation:m‑fade .25s ease-out}
        @keyframes m‑fade  {from{opacity:0;transform:translateY(.25rem)}
                            to{opacity:1;transform:translateY(0)}}
      `;
        document.head.appendChild(s);
    }

    /* 2 ▸ Guard‑clause for selection */
    const checked = document.querySelectorAll('.checkbox:checked');
    if (!checked.length) return notification('No member/staff selected', 0);
    notification(`${checked.length} member(s)/staff selected`, 1);

    /* 3 ▸ Modal markup & logic */
    Swal.fire({
        title: `
        <div class="m‑modal__header">
          <span class="m‑modal__title">Send Message</span>
          <span class="ml-auto text-sm text-gray-500">${checked.length} selected</span>
        </div>`,
        html: `
        <nav class="flex gap-2 px-4 pt-3">
          <button class="m‑tab" data-tab="email">Email</button>
          <button class="m‑tab" data-tab="sms">SMS</button>
        </nav>
  
        <div class="px-4 pb-5">
          <div id="email" class="m‑pane">
            <input type="text" id="emailSubject" class="m‑textarea" placeholder="Subject" style="height: auto; margin-bottom: 0.5rem;">
            <div id="emailEditor" class="m‑textarea" style="height: 20rem;"></div>
          </div>
  
          <div id="sms"  class="m‑pane hidden">
            <textarea id="smsMessage"  class="m‑textarea"
                      placeholder="Type your SMS…"></textarea>
            <div class="m‑stats flex items-center gap-2">
              <span id="smsInfo"></span>
            </div>
            <div class="m‑progress‑rail"><div id="smsBar" class="m‑progress‑bar"></div></div>
          </div>
        </div>`,
        width: '100%', // Make the modal fullscreen
        heightAuto: false, // Ensure the modal takes full height
        showCloseButton: true,
        customClass: { popup: 'rounded-lg shadow-xl', title: 'p-0', content: 'p-0' },
        confirmButtonText: 'Send',
        confirmButtonColor: '#1d4ed8',
        focusConfirm: false,
        allowOutsideClick: false, // Prevent modal from closing when clicking outside

        didOpen: () => {
            const pop = Swal.getPopup(),
                tabs = [...pop.querySelectorAll('.m‑tab')],
                panes = [...pop.querySelectorAll('.m‑pane')];

            /* Initialize Quill editor with finer settings */
            const quill = new Quill('#emailEditor', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'font': [] }, { 'size': [] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        ['blockquote', 'code-block'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ],
                    clipboard: {
                        matchVisual: false
                    }
                },
                placeholder: 'Compose an epic...',
                readOnly: false
            });

            /* tab switcher */
            const activate = btn => {
                tabs.forEach(t => t.classList.toggle('is‑active', t === btn));
                panes.forEach(p => p.classList.toggle('hidden',
                    p.id !== btn.dataset.tab));
                panes.forEach(p => p.classList.add('m‑fade‑in'));
            };
            tabs.forEach(t => t.addEventListener('click', () => activate(t)));
            activate(tabs[0]);                               // default

            /* SMS counter */
            const smsArea = pop.querySelector('#smsMessage'),
                info = pop.querySelector('#smsInfo'),
                bar = pop.querySelector('#smsBar'),
                limit = 160;
            smsArea.addEventListener('input', () => {
                const len = smsArea.value.length,
                    page = Math.ceil(len / limit) || 1,
                    left = limit - (len % limit || limit);
                info.textContent = `page ${page} · ${left} characters left`;
                bar.style.width = `${(len % limit) / limit * 100}%`;
            });
        },

        preConfirm: () => {
            const active = Swal.getPopup().querySelector('.m‑tab.is‑active'),
                kind = active.dataset.tab;
            let value;
            if (kind === 'email') {
                const subject = Swal.getPopup().querySelector('#emailSubject').value.trim();
                let message;
                try {
                    message = document.querySelector('#emailEditor .ql-editor').innerHTML.trim();
                } catch (error) {
                    console.error('Error retrieving message from Quill:', error);
                    Swal.showValidationMessage('Failed to retrieve the message. Please try again.');
                    return false;
                }
                if (!subject || !message) {
                    Swal.showValidationMessage('Please provide both a subject and a message.');
                    return false;
                }
                value = { subject, message };
            } else {
                const field = Swal.getPopup().querySelector(`#${kind}Message`);
                value = field.value.trim();
                if (!value) {
                    Swal.showValidationMessage('Please type a message first.');
                    return false;
                }
            }
            return { kind, value };
        }
    }).then(({ isConfirmed, value }) => {
        if (!isConfirmed) return;

        const ids = Array.from(checked).map(cb => cb.value).join('||');
        const formData = new FormData();
        formData.append('ids', ids);
        if (value.kind === 'email') {
            formData.append('subject', value.value.subject);
            formData.append('message', value.value.message);
        } else {
            formData.append('message', value.value);
        }
        formData.append('channel', value.kind.toUpperCase());

        httpRequest2('api/v1/notification/sendmessage', formData, null, 'json', 'POST')
            .then(response => {
                if (response.status) {
                    notification('Message sent successfully', 1);
                } else {
                    notification('Failed to send message', 0);
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                notification('An error occurred while sending the message', 0);
            });
    });
}




