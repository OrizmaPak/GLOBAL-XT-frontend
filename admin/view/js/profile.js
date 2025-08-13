// const plugin = require("@tailwindcss/forms")

let profileid
async function profileActive() {
    // await profiledepartment()
    await getAllbranch()
    // await getRealBankList()
    await fetchprofile()
    const form = document.querySelector('#profilesform')
    entername()
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', profileFormSubmitHandler)
        // await profileuserlist()
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submit');
    const contentContainer = document.getElementById('contentcontainer');
    
    // Array of tab IDs in order, including the bank info tab
    const tabsOrder = ['personal-info-tab', 'contact-info-tab', 'address-details-tab', 'nextofkin-tab', 'additional-info-tab', 'bank-info-tab'];
    let currentTabIndex = 0;
    
    // Function to show a specific tab by index
    function showTab(index) {
        if (index < 0 || index >= tabsOrder.length) return; // Ensure index is within bounds

        // Hide all panels
        tabPanels.forEach(panel => panel.classList.add('hidden'));
        // Remove active styling from all tabs
        tabButtons.forEach(btn => {
            btn.classList.remove('text-blue-600', 'border-blue-600');
            btn.classList.add('text-gray-700');
        });
  
        const targetTabId = tabsOrder[index];
        const targetPanel = document.getElementById(targetTabId);
        if (targetPanel) {
            targetPanel.classList.remove('hidden');
        }
  
        // Highlight the corresponding tab button
        const targetButton = [...tabButtons].find(btn => btn.getAttribute('data-target') === targetTabId);
        if (targetButton) {
            targetButton.classList.remove('text-gray-700');
            targetButton.classList.add('text-blue-600', 'border-blue-600');
        }

        // Show or hide navigation buttons based on the current tab
        prevBtn.style.display = currentTabIndex > 0 ? 'inline-block' : 'none';
        nextBtn.style.display = currentTabIndex < tabsOrder.length - 1 ? 'inline-block' : 'none';
        submitBtn.style.display = currentTabIndex === tabsOrder.length - 1 ? 'inline-block' : 'none';
    }
    // Initialize the first tab
    showTab(currentTabIndex);

    // Event listeners for tab buttons to make them clickable
    tabButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentTabIndex = index;
            showTab(currentTabIndex);
        });
    });

    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', () => {
        if (currentTabIndex < tabsOrder.length - 1) {
            currentTabIndex++;
            showTab(currentTabIndex);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentTabIndex > 0) {
            currentTabIndex--;
            showTab(currentTabIndex);
        }
    });
}

async function getRealBankList() {
    let request = await httpRequest2('api/v1/paystack/banklist', null, null, 'json', 'GET');
    if(request.status) {
        const bankElements = document.querySelectorAll('.realbank');
        if(request.data.length) {
            bankElements.forEach(element => {
                const tomSelectInstance = new TomSelect(element, {
                    options: request.data.map(data => ({ value: data.code, text: data.name })),
                    plugins: ['dropdown_input'],
                    placeholder: 'Select Bank',
                    allowEmptyOption: true,
                    maxOptions: 1000
                });
            });
        } else {
            bankElements.forEach(element => {
                element.innerHTML = `<option value="">No banks found</option>`;
            });
        }
    } else {
        return notification('No records retrieved');
    }
}

async function resolveAccountDetails(bankSelector, accountNumberSelector, accountNameSelector) {
    if (!bankSelector || !accountNumberSelector || !accountNameSelector) return;

    const bankAccountNumber = document.querySelector(accountNumberSelector).value;
    if (bankAccountNumber.length !== 10) {
        return;
    }

    const bank = document.querySelector(bankSelector).tomselect.getValue();
    if (bank) {
        const bankAccountNameElement = document.querySelector(accountNameSelector);
        bankAccountNameElement.value = 'Loading...';

        const request = await httpRequest2(`api/v1/paystack/resolveaccount?bank_code=${bank}&account_number=${bankAccountNumber}`, null, null, 'json', 'GET');
        if (request.status) {
            bankAccountNameElement.value = request.data.account_name;
        } else {
            notification(request.message, 0);
        }
    }
}

async function profileFormSubmitHandler(){
    const form = document.querySelector('#profilesform');
    const phoneInput = form.querySelector('input[name="phone"]');
    const currentPhone = the_user.phone;

    if (phoneInput && phoneInput.value !== currentPhone) {
        await Swal.fire({
            title: 'Phone Number Change Not Allowed',
            text: 'Changing of phone number is not allowed. Please contact support.',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6' // Blue color for the OK button
        });
        return; // Exit the function to prevent form submission
    }
    if(!validateForm('profilesform', [`email`, 'dateofbirth'])) return
    
    let payload

    payload = getFormData2(document.querySelector('#profilesform'), profileid ? [['id', profileid]] : [['id', the_user.id]])
    let request = await httpRequest2('api/v1/auth/updateprofile', payload, document.querySelector('#profilesform #submit'), 'json')
    if(request.status) {
        notification('Success!', 1);
        // document.querySelector('#profilesform').reset();
        
        return fetchprofile();
    }
    document.querySelector('#profilesform').reset();
    fetchprofile();
    return notification(request.message, 0);
}


async function profileuserlist() {
    let request = await httpRequest('../controllers/fetchusers')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            document.getElementById('supervisorid').innerHTML += request.data.map(data=>`<option value="${data.id}">${data.firstname} ${data.lastname}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}

async function profiledepartment() {
    if (departmentsbybranch) {
        document.getElementById('department').innerHTML += departmentsbybranch.map(data => `<option value="${data.id}">${data.department}</option>`).join('');
    }

    let branchValue = JSON.parse(sessionStorage.getItem('user')).branch;
    let request = await httpRequest2(`api/v1/admin/department?branch=${branchValue}`, null, null, 'json', 'GET')
    if(request.status) {
        departmentsbybranch = request.data
        if(request.data.length) {
            document.getElementById('department').innerHTML += request.data.map(data=>`<option value="${data.id}">${data.department}</option>`).join('')
        }else{
            document.getElementById('department').innerHTML = `<option value="">No departments found</option>`
        }
    }
    else return notification('No records retrieved')
}




async function fetchprofile() {
    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('email', JSON.parse(sessionStorage.getItem('user')).email);
        return paramstr;
    }

    const confirmed = await Swal.fire({
        title: 'Fetching Profile...',
        text: 'Please wait while we retrieve your profile data.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/auth/profile', getparamm(), null, 'json', 'GET');
            Swal.close();

            if (request.status) {
                if (request) {
                    refreshprofile(request.data)
                    populateData(request.data);
                    if(request.data.image != '-')did('logoFrame').src = `${request.data.image}`;
                }
            } else {
                notification('No records retrieved', 0);
            }
        }
    });
}