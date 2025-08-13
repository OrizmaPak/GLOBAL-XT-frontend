let the_user = JSON.parse(sessionStorage.getItem('user'))
let departmentsbybranch
let availroom
let availableroomlength
let occupiedroomlength
let receiveablelength
let payableslength
let saleslength
let userpermission
let allratecodes
let notificationcount
const default_department = 'Main Store'
const default_branch = 'Head Quarters'
let organisationSettings
let permission_switch = 'ON' // 'ON or OFF'



function formatCurrency(amount, dec=2) {
  // Use the Intl.NumberFormat object for currency formatting
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

  // Format the amount using the formatter
  const formattedCurrency = formatter.format(amount);

  return formattedCurrency;
}       

const userlistdata = {
    data: null,
    lastfetched: null
}

async function getAllUsers(id='user', value='email', state=false, disabled=false, me=false) {
    const currentTime = new Date().getTime();
    const twentyMinutes = 10 * 60 * 1000; // 20 minutes in milliseconds

    // Check if data exists and if it was fetched more than 20 minutes ago
    if (userlistdata.data && (currentTime - userlistdata.lastfetched < twentyMinutes) && !me && userlistdata.data.length > 1) {
        populateUserOptions(userlistdata.data, id, value, state, disabled);
        return;
    }

    try {
            let request = await httpRequest2(`api/v1/members/userregistration?${me ? `id=${the_user.id}` : ''}`, null, null, 'json', 'GET');
        if (request.status) {
            userlistdata.data = request.data; // Save data
            userlistdata.lastfetched = currentTime; // Record the time it was saved
            populateUserOptions(request.data, id, value, state, disabled);
        } else {
            notification(request.message, 0);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        notification('Failed to fetch users', 0);
    }
}

async function checkAndUpdateRegistrationFee() {
    const user = the_user;
    if (user.registrationfee === 'PAID') return showUnpaidRegistrationFeeModal(user, 0);

    if(!organisationSettings) return;

    // Fetch organisation settings
     const personalAccountPrefix = organisationSettings.personal_account_prefix;
     const request = await httpRequest2(`api/v1/admin/getregistrationfee?branch=${the_user.branch}`, null, null, 'json', 'GET');
     const newMemberRegistrationCharge = request.data.registrationfee;
    const defaultIncomeAccount = organisationSettings.default_income_account;

    // Generate personal account number
    const personalAccountNumber = personalAccountPrefix + user.phone;

    // Check transactions for NEW MEMBER FEE
    const transactions = await getTransactionsByRegistrationRef(personalAccountNumber, 'NEW MEMBER FEE');
    const totalPaid = transactions.reduce((sum, transaction) => sum + Number(transaction.debit), 0);

    if (totalPaid >= newMemberRegistrationCharge) {
        // Update registration fee to PAID
        await updateUserRegistrationFee(user.id, 'PAID');
        refreshprofile();
        return;
    }

    // Check balance of personal account
    const personalAccountBalance = await getAccountBalance(personalAccountNumber);

    if (personalAccountBalance > 0) {
        const amountToTransfer = Math.min(personalAccountBalance, newMemberRegistrationCharge - totalPaid);
        await transferFunds(personalAccountNumber, defaultIncomeAccount, amountToTransfer, 'NEW MEMBER FEE');
    }

    // Show modal if registration fee is not fully paid
    if (user.registrationfee !== 'PAID') {
        const remainingBalance = newMemberRegistrationCharge - totalPaid - personalAccountBalance;
        showUnpaidRegistrationFeeModal(user, remainingBalance, personalAccountNumber);
        setTimeout(() => checkAndUpdateRegistrationFee(user), 5000);
    }
}

async function transferFunds(fromAccount, toAccount, amount, transactionRef) {
    const formData = new FormData();
    formData.append('accountnumberfrom', fromAccount);
    formData.append('accountnumberto', toAccount);
    formData.append('amount', amount);
    formData.append('transactionref', transactionRef);

    try {
        Swal.fire({
            title: 'Processing',
            text: 'Registration fee payment in progress...',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            customClass: {
                popup: 'bg-white rounded-2xl p-6 shadow-2xl'
            }
        });
        // return
        const response = await httpRequest2('api/v1/transactions/internaltransfer', formData, null, 'json', 'POST');
        Swal.close(); // Close the loading modal once the request is complete

        if (response.status) {
            Swal.fire({
                title: 'Success',
                text: 'Transfer completed successfully.',
                icon: 'success',
                customClass: {
                    popup: 'bg-white rounded-2xl p-6 shadow-2xl',
                    confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: response.message || 'Transfer failed.',
                icon: 'error',
                customClass: {
                    popup: 'bg-white rounded-2xl p-6 shadow-2xl',
                    confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
                }
            });
        }
    } catch (error) {
        Swal.close();
        console.error('Error during fund transfer:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error during fund transfer',
            icon: 'error',
            customClass: {
                popup: 'bg-white rounded-2xl p-6 shadow-2xl',
                confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
            }
        });
    }
}



async function getTransactionsByRegistrationRef(personalAccountNumber, registrationRef) {
    const transactions = await httpRequest2(`api/v1/transactions?accountnumber=${personalAccountNumber}&transactionref=${registrationRef}`, null, null, 'json', 'GET');
    return transactions.data;
}

async function updateUserRegistrationFee(userId, registrationFee) {
    const formData = new FormData();
    formData.append('id', userId);
    formData.append('registrationfee', registrationFee);
    await httpRequest2('api/v1/auth/updateprofile', formData, null, 'json', 'POST');
}

async function getAccountBalance(accountNumber) {
    let request = await httpRequest2(`api/v1/transactions/balance?accountnumber=${accountNumber}`, null, null, 'json', 'GET');
    return request.data.balance;
}

let remainingBalanceForRegistrationFee;
function showUnpaidRegistrationFeeModal(user, remainingBalance, accountNumber) {
    
    
    if (remainingBalance === 0) {
        Swal.close();
        return;
    }
    
    if (remainingBalanceForRegistrationFee !== remainingBalance) {
        remainingBalanceForRegistrationFee = remainingBalance;
        Swal.fire({
            title: '<div class="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg> <h2 class="text-2xl font-bold text-gray-800">Complete Your Registration</h2></div>',
            html: `
                <div class="flex flex-col items-center text-center">
                    <div class="relative mb-6">
                            <img src="./images/logo.png" alt="Logo" class="w-[200px]" />
                    </div>
                    
                    <p class="text-lg mb-6 max-w-md mx-auto text-center leading-relaxed">
                        <span class="font-extrabold text-green-700">Welcome to Divine Help Farmers!</span> 
                        <br>
                        <span class="italic text-gray-700">Unlock the full potential of our platform by completing your registration.</span> 
                        <br>
                        Kindly settle your registration fee of 
                        <span class="font-bold text-indigo-600">NGN ${formatCurrency(remainingBalance)}</span> 
                        to access all the amazing features we offer.
                    </p>
                    
                    <div class="w-full max-w-md bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mb-6">
                        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                            <h3 class="text-white font-semibold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                                </svg>
                                Payment Details
                            </h3>
                        </div>
                        <div class="p-4">
                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p class="text-sm text-gray-500">Bank Name</p>
                                    <p class="font-medium">${user.bank_name}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Account Number</p>
                                    <p class="font-mono font-medium">${user.account_number}</p>
                                </div>
                                <div class="col-span-2">
                                    <p class="text-sm text-gray-500">Account Name</p>
                                    <p class="font-medium">${user.account_name}</p>
                                </div>
                            </div>
                            
                            <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg class="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm text-amber-700">
                                            Transfer to the account above. Activation occurs within 10 seconds post-payment. For help with other payment methods, use the chat widget at the bottom right to let us know.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button onclick="showPersonalAccountDepositModal('${accountNumber}')" class="hidden relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                        </svg>
                        Deposit Funds Now
                    </button>
                    
                    <p class="mt-1 text-sm text-gray-500 max-w-md mx-auto hidden">
                        After payment, your account will be activated within 10 seconds. 
                        <a href="#" class="text-blue-500 hover:underline">Contact support</a> if you need assistance.
                    </p>
                </div>
            `,
            customClass: {
                popup: 'rounded-none shadow-none w-full h-full',
                title: 'mb-0 pb-0',
                container: 'swal2-container'
            },
            allowOutsideClick: false,
            showConfirmButton: false,
            showCloseButton: false, // Disable close button
            background: '#f9fafb',
            width: '100%',
            padding: '0'
        });
    }
}

 function showPersonalAccountDepositModal(accountNumber) {
    if (!accountNumber) {
        console.error('Account number is required for personal account.');
        return;
    }

    // Create the modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg shadow-lg w-full max-w-lg p-6';

    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'flex items-center justify-between mb-4';
    modalHeader.innerHTML = `
        <h2 class="text-xl font-bold">Deposit Request</h2>
        <button class="text-gray-500 hover:text-gray-700" onclick="closeModal()">✖</button>
    `;

    // Modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'space-y-4';
    modalBody.innerHTML = `
        <div class="bg-gray-100 p-4 rounded-lg">
            <p class="text-lg">Account Number: <span class="font-semibold">${accountNumber}</span></p>
        </div>
        <input type="number" id="depositAmount" class="w-full border border-gray-300 rounded-md p-2" placeholder="Enter amount to deposit" />
        <p class="text-sm text-gray-500">Once approved, the account will be credited accordingly.</p>
    `;

    // Modal footer
    const modalFooter = document.createElement('div');
    modalFooter.className = 'flex justify-end space-x-2';
    modalFooter.innerHTML = `
        <button class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onclick="closeModal()">Cancel</button>
        <button class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onclick="submitDepositRequest()">Submit</button>
    `;

    // Append header, body, and footer to modal content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    // Append modal content to modal container
    modalContainer.appendChild(modalContent);

    // Append modal container to body
    document.body.appendChild(modalContainer);

    // Function to close the modal
    function closeModal() {
        document.body.removeChild(modalContainer);
    }

    // Function to handle deposit request submission
    async function submitDepositRequest() {
        const amount = parseFloat(document.getElementById('depositAmount').value);
        if (!amount || amount <= 0) {
            alert('Please enter a valid deposit amount.');
            return;
        }

        const formData = new FormData();
        formData.append('email', the_user.email);
        formData.append('accountnumber', accountNumber);
        formData.append('amount', amount);

        try {
            const response = await httpRequest2('api/v1/transactions/makedeposit', formData, null, 'json', 'POST');
            if (response.status) {
                alert('Deposit request submitted successfully.');

                // Create and display the iframe for paystackLink
                const paystackLink = response.data.paystackLink;
                const iframeContainer = document.createElement('div');
                iframeContainer.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
                const iframeContent = document.createElement('div');
                iframeContent.className = 'bg-white rounded-lg shadow-lg w-full max-w-3xl p-6';
                const iframe = document.createElement('iframe');
                iframe.src = paystackLink;
                iframe.style.width = '100%';
                iframe.style.height = '70vh';
                iframeContent.appendChild(iframe);
                iframeContainer.appendChild(iframeContent);
                document.body.appendChild(iframeContainer);

                // Close the modal
                closeModal();
            } else {
                alert(response.message || 'Failed to submit deposit request.');
            }
        } catch (error) {
            alert('An error occurred while processing your deposit request.');
        }
    }
}

function populateUserOptions(data, id, value, state, disabled) {
    dashboardAllUsers = data
    const element = document.getElementById(id);
    if (element) {
        if(state)element.disabled = true;
        element.innerHTML = `<option ${!state ? 'selected' : ''} value="">--SELECT USER--</option>`;
        if (value == 'email') {
            element.innerHTML += data.map(user => 
                `<option value="${user.email}" ${state ? user.id == the_user.id ? 'selected' : '' : ''} ${disabled ? 'disabled' : ''}>${user.lastname ?? ''} ${user.firstname ?? ''} ${user.othernames ?? ''}</option>`
            ).join('');
        }
        if (value == 'name') {
            element.innerHTML += data.map(user => 
                `<option value="${user.id}" ${state ? user.id == the_user.id ? 'selected' : '' : ''} ${disabled ? 'disabled' : ''}>${user.lastname ?? ''} ${user.firstname ?? ''} ${user.othernames ?? ''}</option>`
            ).join('');
        }
        if (value == 'staff') {
            element.innerHTML += data.filter(data=>data.role == 'STAFF' || data.role == 'SUPERADMIN').map(user =>
                `<option value="${user.id}" ${state ? user.id == the_user.id ? 'selected' : '' : ''} ${disabled ? 'disabled' : ''}>${user.lastname ?? ''} ${user.firstname ?? ''} ${user.othernames ?? ''}</option>`
            ).join('');
        }
        if (value == 'staffchat') {
            element.innerHTML += data.filter(data=>data.phone != the_user.phone).filter(data=>data.role == 'STAFF').map(user => 
                `<option value="${user.phone}" ${state ? user.id == the_user.id ? 'selected' : '' : ''} ${disabled ? 'disabled' : ''}>${user.lastname ?? ''} ${user.firstname ?? ''} ${user.othernames ?? ''}</option>`
            ).join('');
        }
        // setTimeout(() => {
            if(state)element.disabled = false;
        // },  300);
    }
}

const branchlistdata = {
    data: null,
    lastfetched: null
}

async function getAllbranch(state=false, id="branch", time=30) {
    const currentTime = new Date().getTime();
    const twentyMinutes = time * 60 * 1000; // 2 seconds in milliseconds

    // Check if data exists and if it was fetched more than 20 minutes ago
    if (branchlistdata.data && (currentTime - branchlistdata.lastfetched < twentyMinutes)) {
        populateBranchOptions(branchlistdata.data, state, id);
        return;
    }

    try {
        let request = await httpRequest2('api/v1/admin/branch', null, null, 'json', 'GET');
        if (request.status) {
            branchlistdata.data = request.data; // Save data
            branchlistdata.lastfetched = currentTime; // Record the time it was saved
            populateBranchOptions(request.data, state, id);
        } else {
            notification('No records retrieved');
        }
    } catch (error) {
        console.error('Error fetching branches:', error);
        notification('Failed to fetch branches', 0);
    }
}

function populateBranchOptions(data, state, id) {
    const element = document.getElementById(id);
    if (element) {
        if(state)element.disabled = true;
        element.innerHTML = `<option value="">--SELECT BRANCH--</option>`;
        element.innerHTML += data.map(branch => 
            `<option value="${branch.id}" ${state ? branch.id == the_user.branch ? 'selected' : '' : ''}>${branch.branch}</option>`
        ).join('');
        // setTimeout(() => {
            if(state)element.disabled = false;
        // }, 300);
    }
}


const savingsProductData = {
    data: null,
    lastfetched: null
};

async function getAllSavingsProducts(id="savingsproductid", time=30) {
    const currentTime = new Date().getTime();
    const cacheDuration = time * 60 * 1000; // Convert time to milliseconds

    // Check if data exists and if it was fetched more than the cache duration ago
    if (savingsProductData.data && (currentTime - savingsProductData.lastfetched < cacheDuration)) {
        populateSavingsProductOptions(savingsProductData.data, id);
        return;
    }

    try {
        let request = await httpRequest2('api/v1/savings/product', null, null, 'json', 'GET');
        if (request.status) {
            savingsProductData.data = request.data; // Save data
            savingsProductData.lastfetched = currentTime; // Record the time it was saved
            populateSavingsProductOptions(request.data, id);
        } else {
            notification('No records retrieved');
        }
    } catch (error) {
        console.error('Error fetching savings products:', error);
        notification('Failed to fetch savings products', 0);
    }
}

function populateSavingsProductOptions(data, id) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = `<option value="">--SELECT SAVINGS PRODUCT--</option>`;
        element.innerHTML += data.map(product => 
            `<option value="${product.id}">${product.productname}</option>`
        ).join('');
    }
}

const supplierData = {
    data: null,
    lastfetched: null
};

async function getAllSuppliers(id="supplierid", state="id", time=0) {
    const currentTime = new Date().getTime();
    const cacheDuration = time * 60 * 1000; // Convert time to milliseconds

    // Check if data exists and if it was fetched more than the cache duration ago
    if (supplierData.data && (currentTime - supplierData.lastfetched < cacheDuration)) {
        populateSupplierOptions(supplierData.data, id);
        return;
    }

    try {
        let request = await httpRequest2('api/v1/purchases/supplier', null, null, 'json', 'GET');
        if (request.status) {
            supplierData.data = request.data; // Save data
            supplierData.lastfetched = currentTime; // Record the time it was saved
            populateSupplierOptions(request.data, state, id);
        } else {
            notification('No records retrieved');
        }
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        notification('Failed to fetch suppliers', 0);
    }
}

function populateSupplierOptions(data, state, id) {
    const element = document.getElementById(id);
    if (element) {
       if(state=="id"){ element.innerHTML = `<option value="">--SELECT SUPPLIER--</option>`;
        element.innerHTML += data.map(supplier => 
            `<option value="${supplier.id}">${supplier.supplier}</option>`
        ).join('')};
        if(state == "phone"){
            element.innerHTML = `<option value="">--SELECT SUPPLIER--</option>`;
            element.innerHTML += data.map(supplier => 
                `<option value="${organisationSettings.personal_account_prefix}${supplier.contactpersonphone}">${supplier.supplier}</option>`
            ).join('');
        }
    }
}

function copyText(element, type=text) {
    const text = type == 'text' ? element.innerText : element;
    navigator.clipboard.writeText(text).then(() => {
        notification('Copied to clipboard: ' + text);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

async function getAndVerifyOTP() {
    const methods = [
        { value: 'email', image: 'images/email.png', label: 'Email', color: 'bg-white border border-indigo-100 text-indigo-700' },
        { value: 'phone', image: 'images/phone.png', label: 'Phone', color: 'bg-white border border-teal-100 text-teal-700' },
        { value: 'both', image: 'images/both.png', label: 'Both', color: 'bg-white border border-orange-100 text-amber-700' },
    ];

    const cardsHtml = methods.map(m => `
        <div class="delivery-card group" data-value="${m.value}">
            <div class="card-inner ${m.color}">
                <img src="${m.image}" alt="${m.label}" class="w-12 h-12 mb-3 rounded-md shadow-sm">
                <span class="font-semibold text-sm">${m.label}</span>
            </div>
            <div class="selection-indicator">
                <svg class="flat-icon w-4 h-4 text-white">
                    <use href="#check"></use>
                </svg>
            </div>
        </div>
    `).join('');

    const { value: otpOption } = await Swal.fire({
        title: '<span class="text-slate-800 font-bold">Choose Delivery Method</span>',
        html: `
            <div class="text-center text-slate-600 mb-6 text-sm">
                How would you like to receive your verification code?
            </div>
            <div class="delivery-grid">${cardsHtml}</div>
            <style>
                .delivery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 1rem;
                    margin: 1.5rem 0;
                }
                .delivery-card {
                    position: relative;
                    cursor: pointer;
                    height: 120px;
                }
                .card-inner {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 16px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 0.5rem;
                    transition: all 0.3s ease;
                }
                .delivery-card:hover .card-inner {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }
                .selection-indicator {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 26px;
                    height: 26px;
                    background: #4f46e5;
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transform: scale(0.8);
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 6px rgba(79,70,229,0.4);
                }
                .delivery-card.selected .selection-indicator {
                    opacity: 1;
                    transform: scale(1);
                }
                .delivery-card.selected .card-inner {
                    transform: translateY(-6px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    border-width: 2px;
                }
                .flat-icon {
                    fill: currentColor;
                    transition: all 0.2s ease;
                }
            </style>
        `,
        showCancelButton: true,
        confirmButtonText: 'Send Code',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        reverseButtons: true,
        allowOutsideClick: false,
        customClass: {
            popup: 'rounded-2xl border border-white/10 shadow-xl',
            title: 'text-xl mb-1',
            confirmButton: 'bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-300',
            cancelButton: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 px-6 py-2.5 rounded-xl font-medium'
        },
        didOpen: () => {
            const cards = Swal.getHtmlContainer().querySelectorAll('.delivery-card');
            Swal.getConfirmButton().disabled = true;

            cards.forEach(card => {
                card.addEventListener('click', () => {
                    cards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    Swal.getConfirmButton().disabled = false;
                    Swal.getPopup().dataset.selected = card.dataset.value;
                });
            });
        },
        preConfirm: () => {
            const sel = Swal.getPopup().dataset.selected;
            if (!sel) {
                Swal.showValidationMessage('Please select a delivery method');
                return false;
            }
            return sel;
        }
    });

    if (!otpOption) return false;

    const { status } = await httpRequest2(`api/v1/auth/sendotp?method=${otpOption}`, null, null, 'json', 'GET');
    if (!status) return false;

    const { value: otpResult } = await Swal.fire({
        title: '<div class="flex flex-col items-center"><svg class="flat-icon w-12 h-12 text-indigo-600 mb-2"><use href="#lock"></use></svg><span class="text-slate-800 font-bold">Enter Verification Code</span></div>',
        html: `
            <div class="text-center text-slate-600 mb-6">
                We sent a 6-digit code to your ${otpOption === 'email' ? 'email' : otpOption === 'phone' ? 'phone' : 'email and phone'}.
            </div>
            <div class="otp-container">
                ${Array.from({ length: 6 }, (_, i) => `
                    <input type="tel" 
                           inputmode="numeric" 
                           pattern="[0-9]*" 
                           maxlength="1" 
                           class="otp-digit" 
                           autocomplete="one-time-code"
                           data-index="${i}"
                           ${i === 0 ? 'autofocus' : ''}>
                `).join('')}
            </div>
            <div class="text-center mt-6">
                <button type="button" class="resend-button text-indigo-600 hover:text-indigo-800 font-medium text-sm inline-flex items-center">
                    <svg class="flat-icon w-4 h-4 mr-1"><use href="#reload"></use></svg>
                    Resend Code
                </button>
            </div>
            <style>
                .otp-container {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin: 0 auto;
                    max-width: 300px;
                }
                .otp-digit {
                    width: 40px;
                    height: 50px;
                    text-align: center;
                    font-size: 20px;
                    font-weight: 600;
                    color: #4f46e5;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    transition: all 0.2s ease;
                    caret-color: transparent;
                }
                .otp-digit:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
                    outline: none;
                }
                .otp-digit.filled {
                    background-color: #f5f3ff;
                    border-color: #c7d2fe;
                }
                .resend-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: color 0.2s;
                    display: inline-flex;
                    align-items: center;
                }
                .resend-button:hover svg {
                    transform: rotate(90deg);
                }
            </style>
        `,
        showCancelButton: true,
        confirmButtonText: 'Verify',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        focusConfirm: false,
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'bg-indigo-600 hover:bg-indigo-700 px-8 py-2.5 rounded-xl font-semibold text-white shadow-lg',
            cancelButton: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 px-8 py-2.5 rounded-xl font-medium'
        },
        didOpen: () => {
            const digits = Swal.getHtmlContainer().querySelectorAll('.otp-digit');
            const resendBtn = Swal.getHtmlContainer().querySelector('.resend-button');

            digits.forEach(digit => {
                digit.addEventListener('input', () => {
                    if (digit.value.length === 1) {
                        digit.classList.add('filled');
                        const nextIndex = parseInt(digit.dataset.index) + 1;
                        if (nextIndex < 6) digits[nextIndex].focus();
                    } else {
                        digit.classList.remove('filled');
                    }
                });

                digit.addEventListener('keydown', e => {
                    if (e.key === 'Backspace' && digit.value === '') {
                        const prevIndex = parseInt(digit.dataset.index) - 1;
                        if (prevIndex >= 0) digits[prevIndex].focus();
                    }
                });
            });

            resendBtn.addEventListener('click', async () => {
                Swal.getConfirmButton().disabled = true;
                Swal.showLoading();
                await httpRequest2(`api/v1/auth/sendotp?method=${otpOption}`, null, null, 'json', 'GET');
                Swal.hideLoading();
                Swal.getConfirmButton().disabled = false;
                Swal.showValidationMessage('New code sent successfully');
                setTimeout(() => Swal.resetValidationMessage(), 2000);
                digits[0].focus();
            });
        },
        preConfirm: async () => {
            const digits = Swal.getHtmlContainer().querySelectorAll('.otp-digit');
            const otp = Array.from(digits).map(d => d.value).join('');

            if (otp.length !== 6) {
                Swal.showValidationMessage('Please enter all 6 digits');
                return false;
            }

            try {
                const params = new FormData();
                params.append('otp', otp);
                const { status } = await httpRequest2(`api/v1/auth/verifyotp`, params, null, 'json', 'POST');
                if (!status) throw new Error('Invalid OTP');
                return true;
            } catch (error) {
                Swal.showValidationMessage(error.message || 'Invalid code. Please try again.');
                digits.forEach(d => {
                    d.value = '';
                    d.classList.remove('filled');
                });
                digits[0].focus();
                return false;
            }
        }
    });

    return otpResult === true;
}

async function getAndVerifyPin() {
    const result = await Swal.fire({
        html: `
            <section id="pinSection" class="atm-interface mx-auto max-w-md overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-gray-400 shadow-2xl">
                <div class="atm-screen rounded-t-lg bg-gradient-to-br from-gray-900 to-gray-700 px-6 py-8 text-center text-white">
                    <h2 id="pinheader" class="text-3xl font-bold">Enter PIN</h2>
                    <p id="redwarning" class="mt-2 hidden text-sm text-red-400">Enter Current PIN to change your pin</p>
                    <p id="lostpin" class="mt-2 hidden text-sm text-gray-400">If you have lost your PIN, <a href="#" class="text-blue-500 underline">Click here</a></p>
                    <input 
                        type="password" 
                        id="pinInput" 
                        class="mt-6 w-3/4 rounded-lg border border-gray-600 bg-gray-800 p-3 text-center text-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-500" 
                        maxlength="4" 
                        placeholder="****" 
                        readonly
                    >
                </div>
                <div class="atm-keypad grid grid-cols-3 gap-4 bg-white p-6">
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-gray-300 to-gray-100 py-4 font-bold text-gray-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400 active:shadow-md" onclick="enterDigit(1)">1<br><span class="text-xs">.</span></button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-gray-300 to-gray-100 py-4 font-bold text-gray-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400 active:shadow-md" onclick="enterDigit(2)">2<br><span class="text-xs">ABC</span></button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-gray-300 to-gray-100 py-4 font-bold text-gray-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400 active:shadow-md" onclick="enterDigit(3)">3<br><span class="text-xs">DEF</span></button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-gray-300 to-gray-100 py-4 font-bold text-gray-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400 active:shadow-md" onclick="enterDigit(4)">4<br><span class="text-xs">GHI</span></button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-gray-300 to-gray-100 py-4 font-bold text-gray-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400 active:shadow-md" onclick="enterDigit(5)">5<br><span class="text-xs">JKL</span></button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-gray-300 to-gray-100 py-4 font-bold text-gray-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400 active:shadow-md" onclick="enterDigit(6)">6<br><span class="text-xs">MNO</span></button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-gray-300 to-gray-100 py-4 font-bold text-gray-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400 active:shadow-md" onclick="enterDigit(7)">7<br><span class="text-xs">PQRS</span></button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-gray-300 to-gray-100 py-4 font-bold text-gray-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400 active:shadow-md" onclick="enterDigit(8)">8<br><span class="text-xs">TUV</span></button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-gray-300 to-gray-100 py-4 font-bold text-gray-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400 active:shadow-md" onclick="enterDigit(9)">9<br><span class="text-xs">WXYZ</span></button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-red-600 to-red-400 py-4 font-bold text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-400 active:shadow-md" onclick="clearPin()">C</button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-gray-300 to-gray-100 py-4 font-bold text-gray-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400 active:shadow-md" onclick="enterDigit(0)">0<br><span class="text-xs"> </span></button>
                    <button class="keypad-button rounded-lg bg-gradient-to-t from-green-600 to-green-400 py-4 font-bold text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-400 active:shadow-md" onclick="Swal.clickConfirm()">OK</button>
                </div>
            </section>
        `,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        cancelButtonColor: '#d33',
        background: 'rgba(0, 0, 0, 0)',
        preConfirm: async () => {
            const pinInput = document.getElementById('pinInput');
            if (pinInput.value.length === 4) {
                Swal.fire({
                    title: 'Verifying PIN...',
                    text: 'Please wait while we verify your PIN.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const params = new FormData();
                params.append('pin', pinInput.value);
                params.append('id', the_user.id);
                const request = await httpRequest2(`api/v1/admin/verifypin`, params, null, 'json', 'POST');

                Swal.close();

                if (request.status) {
                    notification('PIN submitted successfully!', 1);
                    notification('Authorized', 1);
                    sessionStorage.removeItem('pinTrialCount');
                    return true;
                } else {
                    if(request.message.includes('blocked')){
                        notification(request.message, 0);
                        return false;
                    }
                    let pinTrialCount = parseInt(sessionStorage.getItem('pinTrialCount') || '0', 10);
                    pinTrialCount += 1;
                    sessionStorage.setItem('pinTrialCount', pinTrialCount);

                    if (pinTrialCount >= 3) {
                        await httpRequest2(`api/v1/admin/blockpin`, params, null, 'json', 'POST');
                        notification('PIN blocked due to multiple failed attempts.', 0);
                        sessionStorage.removeItem('pinTrialCount');
                    } else {
                        notification(`Invalid PIN. You have ${3 - pinTrialCount} attempts left.`, 0);
                    }
                    return false;
                }
            } else {
                notification('Please enter a 4-digit PIN.', 0);
                return false;
            }
        }
    });

    if (result.dismiss) {
        return false;
    }

    return result.isConfirmed ? result.value : false;
}



async function returnAllbranch(time=30) {
    const currentTime = new Date().getTime();
    const twentyMinutes = time * 60 * 1000; // 2 seconds in milliseconds

    // Check if data exists and if it was fetched more than 20 minutes ago
    if (branchlistdata.data && (currentTime - branchlistdata.lastfetched < twentyMinutes)) {
        return branchlistdata.data;
    }

    try {
        let request = await httpRequest2('api/v1/admin/branch', null, null, 'json', 'GET');
        if (request.status) {
            branchlistdata.data = request.data; // Save data
            branchlistdata.lastfetched = currentTime; // Record the time it was saved
            return request.data;
        } else {
            return []
        }
    } catch (error) {
        console.error('Error fetching branches:', error);
        notification('Failed to fetch branches', 0);
        return []
    }
}

async function handleBranchChange(branch, department = 'departmentsearch', value='') {
    // Initialize cache if it doesn't exist
    if (!handleBranchChange.cache) {
        handleBranchChange.cache = {};
    }

    const cacheDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
    const currentTime = Date.now();

    // Check if departments for the branch are cached and still valid
    if (
        handleBranchChange.cache[branch] &&
        currentTime - handleBranchChange.cache[branch].lastFetched < cacheDuration
    ) {
        populateDepartments(handleBranchChange.cache[branch].data, department, value);
        return;
    }

    try {
        let request = await httpRequest2(
            `api/v1/admin/department${branch ? `?branch=${branch}` : ''}`,
            null,
            null,
            'json',
            'GET'
        );
        if (request.status) {
            if (request.data.length) {
                // Store fetched departments in cache
                handleBranchChange.cache[branch] = {
                    data: request.data,
                    lastFetched: currentTime
                };
                populateDepartments(request.data, department, value);
            } else {
                document.getElementById(department).innerHTML = `<option value="">No departments found</option>`;
            }
        } else {
            return notification('No records retrieved');
        }
    } catch (error) {
        console.error('Error fetching departments:', error);
        notification('Failed to fetch departments', 0);
    }
}

function populateDepartments(data, department, value = '') {
    const departmentElement = document.getElementById(department);
    if (departmentElement) {
        departmentElement.innerHTML = `<option value="">-- SEARCH DEPARTMENT --</option>`;
        departmentElement.innerHTML += data
            .map(item => `<option value="${item.id}" ${item.id === value ? 'selected' : ''}>${item.department}</option>`)
            .join('');
    }
}


function getmultivalues(id, pattern=',') {
    const assignedToSelect = document.getElementById(id);
    const selectedOptions = Array.from(assignedToSelect.selectedOptions);
    const assignedToValues = selectedOptions.map(option => option.value);
    // console.log(assignedToValues);
    return assignedToValues.join(pattern);
}

async function getAllmembership(id="member"){
    let request = await httpRequest2('api/v1/admin/organizationmembership', null, null, 'json', 'GET')
    if(request.status) {
        if(request.data.length) {
            document.getElementById(id).innerHTML = `<option value="">SELECT MEMBER</option>`
            document.getElementById(id).innerHTML += request.data.map(data => `<option value="${data.id}">${data.member}</option>`).join('')
        } else {
            document.getElementById(id).innerHTML = `<option value="">No Membership found</option>`
        }
    } else {
        return notification('No records retrieved')
    }
}

async function getAllcompanyAccounts(id="member", cls=""){
    let request = await httpRequest2('api/v1/admin/organizationmembership', null, null, 'json', 'GET')
    if(request.status) {
        if(id){if(request.data.length) {
            document.getElementById(id).innerHTML += request.data.map(data => `<option value="${data.id}">${data.member}</option>`).join('')
        } else {
            document.getElementById(id).innerHTML = `<option value="">No Membership found</option>`
        }}
        if(cls){
            for(let i=0;i<document.getElementsByClassName(cls).length;i++){
                document.getElementsByClassName(cls)[i].innerHTML = `<option value="">--SELECT ACCOUNT--</option>`
                document.getElementsByClassName(cls)[i].innerHTML += request.data.map(data => `<option value="${data.accountnumber}">${data.accounttype}</option>`).join('')
            }
        }
    } else {
        return notification('No records retrieved')
    }
}

function toggleBalance(event, id, permission="VIEW COMPANY BALANCE", state=true) {
    const element = document.getElementById(id);
    if (!state || (checkpermission(permission) && state)) {
        element.classList.toggle('blur-sm');
    } else {
        notification('You do not have permission to view the amount.');
    }
}

function checkpermission(permission){
    let result = false;
    if(the_user.role == 'SUPERADMIN')return true
    if (the_user.permissions) {
        if (the_user.permissions.includes('|')) {
            the_user.permissions.split('|').forEach(perm => {
                if (perm == permission) result = true;
            });
        } else {
            if (the_user.permissions == permission) result = true;
        }
    }
    return result
}

function designName(name, state="") {
    if(!name)name=document.getElementById('your_companyname').value
    // Calculate half length while considering spaces
    const half = Math.ceil(name.length / 2);

    // Split the string into two parts without removing spaces
    const firstHalf = name.slice(0, half);
    const secondHalf = name.slice(half);

    // Return the formatted result with both parts styled correctly
    let result 
    if(!state)result = `
    <span class="font-heebo block py-3 pl-5 text-base font-bold uppercase text-primary-g selection:bg-white xl:w-[250px]">
        ${firstHalf}<span class="text-gray-400">${secondHalf}</span>
    </span>
    `;
    if(state == 'big')result = `
        <span class="font-heebo block flex pb-10 text-right text-2xl text-base font-bold uppercase text-primary-g selection:bg-white">
                ${firstHalf}
                <span class="text-gray-400">
                    ${secondHalf}
                </span>
        </span>
    `
    
    return result;
}

async function indexbranch(branch) {
    let request = await httpRequest2('api/v1/admin/branch', null, null, 'json', 'GET')
    if(request.status) {
        if(request.data.length) {
            console.log('branch', request.data)
            let elements = document.getElementsByName('branch1');
            for(let i = 0; i < elements.length; i++) {
                elements[i].innerHTML = request.data.map(data => 
                    `<option class="text-center ${the_user.role == 'SUPERADMIN' ? '' : `${data.id == branch ? '' : 'hidden'}`}" value="${data.id}" ${data.id == branch ? 'selected' : ''}>${data.branch}</option>`
                ).join('');
            }
        } else {
            let elements = document.getElementsByName('branch1');
            for(let i = 0; i < elements.length; i++) {
                elements[i].innerHTML = `<option class="text-center" value="">No branches found</option>`;
            }
        }
    } else {
        return notification('No records retrieved')
    }
}

async function resolvepermission(){
    let user = JSON.parse(sessionStorage.getItem('user'));
    if(!user)return windows.location.href = '/login.html';
    if(user.role == 'SUPERADMIN')return;
    let request = await httpRequest2(`api/v1/admin/manageroles?role=${user.role}`, null, null, 'json', 'GET')
    if(request.status){
        user.permissions = user.permissions+'|'+request.data.permissions;
        sessionStorage.setItem('user', JSON.stringify(user));
    }
    // Start Generation Here
    if (user.userpermissions) {
        let permissionsArray = user.permissions ? (user.permissions.includes('|') ? user.permissions.split('|') : [user.permissions]) : [];
        let userPermissionsArray = user.userpermissions ? (user.userpermissions.includes('|') ? user.userpermissions.split('|') : [user.userpermissions]) : [];

        userPermissionsArray.forEach(permission => {
            if (permission.startsWith('__')) {
                let permName = permission.slice(2);
                let index = permissionsArray.indexOf(permName);
                if (index !== -1) {
                    permissionsArray.splice(index, 1);
                }
            } else {
                if (!permissionsArray.includes(permission)) {
                    permissionsArray.push(permission);
                }
            }
        });

        user.permissions = permissionsArray.join('|');
        sessionStorage.setItem('user', JSON.stringify(user));
    }

}

async function refreshprofile(data) {
    await entername()
    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('email', JSON.parse(sessionStorage.getItem('user')).email);
        return paramstr;
    }

        if(!data){ 
            let request = await httpRequest2('api/v1/auth/profile', getparamm(), null, 'json', 'GET');
            if (request.status) {
                if (request) {
                    sessionStorage.setItem('user', JSON.stringify(request.data))
                    await resolvepermission() //this is to resolve permission with user specific permissions 
                    the_user = JSON.parse(sessionStorage.getItem('user'))
                    entername()
                }
            } else {
                notification('No records retrieved', 0);
            }
        }else{
            sessionStorage.setItem('user', JSON.stringify(data));
            await resolvepermission() //this is to resolve permission with user specific permissions 
            entername();
        }
}

async function updateuserlocation(branch){
        
        let payload
    
        payload = getFormData2(document.querySelector('#changelocationfly'), [['id', the_user.id], ['branch', branch]])
        let request = await httpRequest2('api/v1/auth/updateprofile', payload, document.querySelector('#profilesform #submit'), 'json')
        if(request.status) {
            notification('You have successfully changed your location', 1);
            the_user.branch = branch;
            if(document.getElementById('profilesform')){fetchprofile()}else{refreshprofile()} 
            return resolveUrlPage()
        }
        refreshprofile();
        return notification(request.message, 0);
}

async function loadChat() {
    console.log("Initializing chat...");

    await getAllUsers('staff-select', 'staffchat');
    const staffSelect = new TomSelect('#staff-select', {
        plugins: ['dropdown_input']
    });

    /* ----------  CONFIG   ---------- */
    const firebaseConfig = {
        apiKey: "AIzaSyCNg5De3MlLsIZtczR-4I70zJrsUBSBhNA",
        authDomain: "GXT-chat.firebaseapp.com",
        databaseURL: "https://GXT-chat-default-rtdb.firebaseio.com",
        projectId: "GXT-chat",
        storageBucket: "GXT-chat.appspot.com",
        messagingSenderId: "678337165925",
        appId: "1:678337165925:web:760ccb9e9d34af46c3e48c"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();
    console.log("Firebase initialized.");

    /* ----------  GLOBALS   ---------- */
    const currentUserId = the_user.phone;
    let currentChatId = null;

    /* ----------  DOM SHORTCUTS   ---------- */
    const chatList = document.getElementById('chat-list');
    const chatView = document.getElementById('chat-view');
    const chatHeader = document.getElementById('chat-header');
    const msgContainer = document.getElementById('message-container');
    const inputEl = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-button');
    const emojiBtn = document.getElementById('emoji-button');
    const fileInput = document.getElementById('file-input');
    const emojiPanel = document.getElementById('emoji-panel');

    /* ----------  START-UP   ---------- */
    bootstrap();

    async function bootstrap() {
        console.log("Bootstrapping chat...");
        try {
            await ensureUserNode();
            await loadChatList();
        } catch (err) {
            console.error("Bootstrap failed:", err);
        }
    }

    /* ----------  ENSURE USER RECORD EXIST   ---------- */
    async function ensureUserNode() {
        console.log("Ensuring user node exists...");
        const snap = await db.ref(`users/${currentUserId}`).once('value');
        if (!snap.exists()) {
            console.log("Creating user node...");
            await db.ref(`users/${currentUserId}`).set({ lastSeen: Date.now(), chats: {} });
        }
        console.log("User node exists.");
    }

    /* ----------  CHAT LIST   ---------- */
    async function loadChatList() {
        console.log("Loading chat list...");
        db.ref(`users/${currentUserId}/chats`).on('value', snap => {
            const chatIds = snap.val() || {};
            renderChatList(Object.keys(chatIds));
        });
    }

    function renderChatList(ids) {
        console.log("Rendering chat list...");
        const ul = chatList.querySelector('ul');
        ul.innerHTML = '';
        if (!ids.length) {
            ul.innerHTML = '<li class="p-4 text-gray-500">No chat yet.</li>';
            return;
        }
        ids.forEach(chatId => {
            db.ref(`chats/${chatId}`).once('value').then(csnap => {
                const chat = csnap.val();
                if (!chat) return;
                let displayName = chat.name || 'Unnamed';
                let avatar = 'https://placehold.co/32x32';
                const preview = chat.lastMessage?.text || '';
                if (chat.type === 'direct') {
                    const otherId = Object.keys(chat.participants).find(uid => uid !== currentUserId);
                    db.ref(`users/${otherId}`).once('value').then(osnap => {
                        const other = osnap.val() || {};
                        displayName = other.displayName || displayName;
                        avatar = other.profileImage || avatar;
                        addChatRow(chatId, displayName, avatar, preview);
                    });
                } else {
                    addChatRow(chatId, displayName, avatar, preview);
                }
            });
        });
    }

    function addChatRow(chatId, name, avatar, preview) {
        console.log("Adding chat row for chatId:", chatId);
        const li = document.createElement('li');
        li.className = 'p-3 hover:bg-gray-50 cursor-pointer flex items-center';
        li.innerHTML = `
            <img src="${avatar}" alt="${name}" class="w-8 h-8 rounded-full mr-3">
            <div>
                <span class="font-medium">${name}</span>
                <p class="text-xs text-gray-500 truncate max-w-[180px]">${escapeHtml(preview)}</p>
            </div>`;
        li.onclick = () => openChat(chatId, name);
        chatList.querySelector('ul').appendChild(li);
    }

    /* ----------  OPEN CHAT & MESSAGES   ---------- */
    function openChat(chatId, name) {
        console.log("Opening chat:", chatId);
        currentChatId = chatId;
        chatHeader.textContent = name;
        chatList.classList.add('hidden');
        chatView.classList.remove('hidden');
        msgContainer.innerHTML = '';

        // Listen for both existing and new messages
        db.ref(`messages/${chatId}`)
            .orderByChild('timestamp')
            .on('child_added', snap => {
                const msg = snap.val();
                renderMessage(msg);
                scrollBottom();
            });
    }

    function renderMessage(msg) {
        console.log("Rendering message:", msg);
        const self = msg.senderId === currentUserId;
        // find existing placeholder or create new
        let wrapper = msgContainer.querySelector(`[data-id="${msg.id}"]`);
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.dataset.id = msg.id;
            wrapper.className = self ? 'text-right' : 'text-left';
            msgContainer.appendChild(wrapper);
        }
        // always show a sent checkmark
        wrapper.innerHTML = `
            <span class="inline-block ${self ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
                        px-3 py-1 rounded-lg max-w-xs break-words">
                ${escapeHtml(msg.text || '[file]')}
            </span>
            <span class="text-xs text-gray-500">✔️ ${new Date(msg.timestamp).toLocaleTimeString()}</span>`;
    }

    function scrollBottom() {
        console.log("Scrolling to bottom...");
        setTimeout(() => {
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }, 50);
    }

    /* ----------  SEND MESSAGE   ---------- */
    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keyup', e => {
        if (e.key === 'Enter') sendMessage();
    });

    async function sendMessage() {
        console.log("Sending message...");
        const text = inputEl.value.trim();
        if (!text || !currentChatId) {
            console.log("No text to send or no chat selected.");
            return;
        }
        // push a new message ref
        const newRef = db.ref(`messages/${currentChatId}`).push();
        const msgId = newRef.key;
        const msgData = { id: msgId, senderId: currentUserId, text, timestamp: Date.now() };

        // render a pending placeholder
        const wrapper = document.createElement('div');
        wrapper.dataset.id = msgId;
        wrapper.className = 'text-right';
        wrapper.innerHTML = `
            <span class="inline-block bg-blue-500 text-white
                        px-3 py-1 rounded-lg max-w-xs break-words">
                ${escapeHtml(text)}
            </span>
            <span class="text-xs text-gray-500">⌛</span>`;
        msgContainer.appendChild(wrapper);
        scrollBottom();
        inputEl.value = '';
        autoGrow();

        // save to database
        try {
            await newRef.set(msgData);
            console.log("Message saved to DB:", msgData);
            await db.ref(`chats/${currentChatId}/lastMessage`).set(msgData);
            await db.ref(`users/${currentUserId}/chats/${currentChatId}`).set(true);
        } catch (error) {
            console.error("Error saving message:", error);
            const statusEl = wrapper.querySelector('.text-xs');
            if (statusEl) statusEl.textContent = '❗';
        }
    }

    /* ----------  SMALL HELPERS   ---------- */
    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, s =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[s])
        );
    }

    /* ----------  FILE & EMOJI (unchanged) ---------- */
    /* keep your existing handlers – they still work,
       just call sendMessageWithFile() if pushing file metadata */

    /* ----------  TEXTAREA AUTOGROW LOGIC   ---------- */
    const initialHeight = inputEl.clientHeight;
    const maxHeight = 150;
    inputEl.addEventListener('input', autoGrow);
    function autoGrow() {
        if (!inputEl.value.trim()) {
            inputEl.style.height = initialHeight + 'px';
            inputEl.style.overflowY = 'hidden';
        } else {
            inputEl.style.height = 'auto';
            const newH = Math.min(inputEl.scrollHeight, maxHeight);
            inputEl.style.height = newH + 'px';
            inputEl.style.overflowY = inputEl.scrollHeight > maxHeight ? 'scroll' : 'hidden';
        }
    }

    /* ----------  MENU/HAMBURGER TOGGLE   ---------- */
    function toggleChatView() {
        console.log("Toggling chat view...");
        chatView.classList.toggle('hidden');
        chatList.classList.toggle('hidden');
    }

    /* ----------  EMOJI PANEL ----------- */
    emojiBtn.addEventListener('click', () => {
        console.log("Toggling emoji panel...");
        emojiPanel.classList.toggle('hidden');
    });
    emojiPanel.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            const emoji = e.target.textContent;
            inputEl.setRangeText(emoji, inputEl.selectionStart, inputEl.selectionEnd, 'end');
            inputEl.focus();
            autoGrow();
        }
    });

    /* ----------  STAFF SELECTION & CHAT CREATION   ---------- */
    staffSelect.on('change', async (value) => {
        const selectedStaffId = value;
        console.log("Selected staff ID:", selectedStaffId);

        const chatExists = await db.ref(`users/${currentUserId}/chats`)
            .orderByKey()
            .equalTo(selectedStaffId)
            .once('value');
        if (chatExists.exists()) {
            openChat(selectedStaffId, "Chat with Staff");
        } else {
            const newChatRef = db.ref('chats').push();
            const newChatId = newChatRef.key;
            const chatData = {
                type: 'direct',
                participants: { [currentUserId]: true, [selectedStaffId]: true },
                lastMessage: {}
            };
            await newChatRef.set(chatData);
            await db.ref(`users/${currentUserId}/chats/${newChatId}`).set(true);
            await db.ref(`users/${selectedStaffId}/chats/${newChatId}`).set(true);
            openChat(newChatId, "Chat with Staff");
        }
    });
}

window.onload = async function() {
    
    if (!sessionStorage.getItem('user') || !JSON.parse(sessionStorage.getItem('user')).firstname) {
        console.log('redirecting to login', JSON.parse(sessionStorage.getItem('user')))
        window.location.href = './login.html';
    }
    // rundashboard()
    // runavailablerooms()
    // we first refresh the profile to get the user permissions
    refreshprofile()
    // we then run the permissions
    runPermissions()
    // we then index the branch
    await indexbranch(the_user.branch)
    // we then enter the user name and details
    // entername()
    // we then resolve the url page
    resolveUrlPage() 
    // recalldatalist()
    // load the chat
    //loadChat()
    // checkAccountForVerification()
    checkAndUpdateRegistrationFee()
    // runpermissioncheck('state')
    window.addEventListener('popstate', resolveUrlPage);

    if(document.getElementById('branch1'))document.getElementById('branch1').addEventListener('change', e=>{
        the_user.role == 'SUPERADMIN' ? updateuserlocation(e.target.value) : notification('You do not have the required permissions to view this page.');
        did('branch1').value = the_user.branch;
    })

    // Load notifications on page load
    await loadNotifications();

    const toggler = document.getElementById('toggler')
    if(toggler) toggler.addEventListener('click', toggleNavigation)

    if(!isDeviceMobile()) {
        const navigation =  document.getElementById('navigation')
        navigation.classList.add('show')
    }

    Array.from(document.querySelectorAll('#navigation .nav-item > span')).forEach( nav => {
        nav.addEventListener('click', () => {
            // Close any open nav items
            document.querySelectorAll('#navigation .nav-item.expand').forEach(openNav => {
                if (openNav !== nav.parentElement) {
                    openNav.style.maxHeight = '36px';
                    openNav.classList.remove('expand');
                    openNav.querySelectorAll('.material-symbols-outlined')[1].style.transform = 'rotate(0deg)';
                }
            });

            // Toggle the clicked nav item
            if(nav.nextElementSibling?.tagName.toLocaleLowerCase() == 'ul') {
                if(nav.parentElement.classList.contains('expand')) {
                    nav.parentElement.style.maxHeight = '36px';
                    nav.parentElement.classList.remove('expand');
                    nav.querySelectorAll('.material-symbols-outlined')[1].style.transform = 'rotate(0deg)';
                }
                else {
                    nav.parentElement.style.maxHeight = '1000px';
                    nav.parentElement.classList.add('expand');
                    nav.querySelectorAll('.material-symbols-outlined')[1].style.transform = 'rotate(90deg)';
                }
            }
        });
    });

    Object.keys(routerTree).forEach( route => {
        if(route && !!document.getElementById(route)) {
            document.getElementById(route)?.addEventListener('click', () => {
                routerEvent(route)
                showActiveRoute()
            })
        }
    })

    const scriptsResource = Object.keys(routerTree).map( route => {
        return { url: routerTree[route].scriptName, controller: routerTree[route].startingFunction}
    })

    scriptsResource.filter( item => item.url !== '').forEach( resource => {
        loadScript(resource)
    })
    
    // NOTIFICATION FUNCTION
    // approverequisitionActive()
    
    document.getElementById('searchavailableroom').addEventListener('keyup', e=>{for (var i = 0; i < document.getElementById('availableroomcontainer').children.length; i++) {
        var label = document.getElementById('availableroomcontainer').children[i].querySelector('label');
        var email = label.textContent.trim().toLowerCase();
        if (email.includes(document.getElementById('searchavailableroom').value.toLowerCase())) {
            document.getElementById('availableroomcontainer').children[i].style.display = 'block'; // Show the matching child
        } else {
            document.getElementById('availableroomcontainer').children[i].style.display = 'none'; // Hide non-matching children
        }
    }})
    
   runcompanyname()

}

setInterval(async () => {
    await loadNotifications();
}, 60000); 

async function loadNotifications() {
    try {
        let notifications = await fetchNotifications();
        const notificationHolder = document.getElementById('notification_content_holder');
        notificationHolder.innerHTML = '';

        // Retrieve stored notification IDs from local storage or initialize an empty array
        let storedNotificationIds = JSON.parse(localStorage.getItem('notificationIds')) || [];
        let newNotification = false;

        if (notifications && notifications.length) {
            const notificationBadge = document.getElementById('notification_badge_count');
            
            // Check for new notifications
            notifications.forEach(notification => {
                if (!storedNotificationIds.includes(notification.id)) {
                    newNotification = true;
                    localStorage.setItem('notificationsRead', 'false');
                    storedNotificationIds.push(notification.id);
                }
            });

            // Play sound if there are new notifications
            if (newNotification && notificationBadge) {
                const notificationSound = new Audio('sounds/notification-sound.wav');
                notificationSound.play().catch(error => console.error('Error playing sound:', error));
            }

            // Update notification badge
            if (notificationBadge && localStorage.getItem('notificationsRead') === 'false') {
                notificationBadge.classList.remove('hidden');
                notificationBadge.textContent = notifications.length;
            }

            // Store updated notification IDs
            localStorage.setItem('notificationIds', JSON.stringify(storedNotificationIds));

            notifications.forEach(notification => {
                const isDepartmentNull = notification.userid && !notification.department;
                const isDepartmentNotNull = !notification.userid && notification.department;

                const notificationDiv = document.createElement('div');
                
                notificationDiv.addEventListener('click', () => {
                    notificationDiv.style.backgroundColor = isDepartmentNotNull ? 'bg-gray-100' : 'bg-white';
                });

                notificationDiv.className = `mb-2 flex justify-between rounded-md border bg-white p-2 shadow-sm hover:bg-gray-50`;
                notificationDiv.innerHTML = `
                <div class="flex cursor-pointer flex-col gap-3 rounded-lg p-4 transition duration-200 ease-in-out">
                    <div class="flex flex-col gap-1 text-left">
                        <p class="text-lg font-semibold text-gray-800">${notification.title}</p>
                        <p class="text-sm font-normal text-gray-600">${notification.description}</p>
                        <div class="flex flex-col items-start gap-2">
                            <p class="text-xs text-gray-500">Location: <button class="inline font-semibold text-gray-700 underline" onclick="document.getElementById('${notification.location}').click()">${notification.location}</button></p>
                            <p class="text-xs text-gray-500">Date: <span class="font-semibold text-gray-700">${formatDate(notification.dateadded)}</span></p>
                        </div>
                    </div>
                </div>
            `;            

                // Event Listener for Notification Click
                notificationDiv.addEventListener('click', async () => {
                    if (isDepartmentNull) {
                        // Delete the notification
                        await deleteNotification(notification.id);
                        notificationDiv.remove();
                    }
                });

                notificationHolder.appendChild(notificationDiv);
            });
        } else {
            notificationHolder.innerHTML = '<p class="text-center text-gray-500">No notifications available</p>';
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function notificationpanel(action){
    const notificationBadge = document.getElementById('notification_badge_count');
    if(!action) {
        document.getElementById('notificationpanel').classList.toggle('!h-[0px]');
        if (notificationBadge) {
            notificationBadge.classList.add('hidden');
        }
        // Mark notifications as read in local storage
        localStorage.setItem('notificationsRead', 'true');
    }
    if(action == 'OPEN')document.getElementById('notificationpanel').classList.remove('!h-[0px]')
    if(action == 'CLOSE')document.getElementById('notificationpanel').classList.add('!h-[0px]')
}

window.addEventListener('click', e=>{
    if(!e.target.classList.contains('qq'))notificationpanel('CLOSE')
})

async function fetchNotifications() {
    try {
        let request = await httpRequest2('api/v1/notification/getnotifications', null, null, 'json', 'GET');
        if (request.status) {
            return request.data; 
        } else {
            return null; 
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return null;
    }
}

async function deleteNotification(notificationId) {
    try {
        const formData = new FormData();
        formData.append('id', notificationId);

        let request = await httpRequest2('api/v1/notification/delete', formData, null, 'json', 'DELETE');
        if (request.status) {
            console.log('Notification deleted successfully');
        } else {
            console.log('Failed to delete notification');
        }
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
}

function runcompanyname(name="hemsname", state=""){
     if(document.getElementById('your_companyname').value){
        for(let i=0;i<document.getElementsByClassName(name).length;i++){
            document.getElementsByClassName(name)[i].innerHTML = designName(document.getElementById('your_companyname').value, state)
        }
    }
}

async function runPermissions(){
    document.getElementById('navigationcontainer').style.visibility = 'hidden';
    let request = the_user
    if(request.status) {
        userpermission = request.permissions
        let subitems = document.getElementsByClassName('navitem-child')
        console.log('request', request)
        if(request.role == 'SUPERADMIN'){ 
            for(i=0; i<subitems.length; i++){
                    subitems[i].classList.remove('hidden');
            }}
        if(userpermission == null || userpermission == ''){
            userpermission = 'NONE'
        }
        if(request.role != 'SUPERADMIN' && userpermission){ 
            for(i=0; i<subitems.length; i++){
              if(userpermission && userpermission.includes('|') ? userpermission.split('|').includes(subitems[i].textContent.toUpperCase().trim()) : userpermission.includes(subitems[i].textContent.toUpperCase().trim())){
                    if(permission_switch === 'ON')subitems[i].classList.remove('hidden');
                }else{
                    if(permission_switch === 'ON')subitems[i].classList.add('hidden');
                }  
                    if(permission_switch === 'OFF')subitems[i].classList.remove('hidden');
            }
            let x =  document.getElementsByClassName('navitem-title')
            for(let i=0;i<x.length;i++){
                if(x[i].nextElementSibling){
                    let y = x[i].nextElementSibling.children
                    let m = false
                    for(let j=0;j<y.length;j++){
                        if(!y[j].classList.contains('hidden'))m = true
                    }
                    if(!m)x[i].classList.add('hidden')
                    if(m)x[i].classList.remove('hidden')
                }
            }
        }
        document.getElementById('navigationcontainer').style.visibility = 'visible';
    }
    else return notification('No records retrieved')
}


function rundashboard(){
    getoccupiedroom()
    gettotalsales()
    getreceiveable()
    getinventory()
    getpayabless()
}


async function gettotalsales() {
    let request = await httpRequest2('../controllers/gettotalsalesfortheday', null, null, 'json')
    if(request.status) {
        saleslength = formatCurrency(request.totalsalesfortoday)
        if(document.getElementById('dashsales'))document.getElementById('dashsales').textContent = saleslength
    }
    else return notification('No records retrieved')
}

async function getpayabless() {
    let request = await httpRequest2('../controllers/getpayables', null, null, 'json')
    if(request.status) {
        payableslength = formatNumber(request.data.length)
        if(document.getElementById('dashpayables'))document.getElementById('dashpayables').textContent = payableslength
    }
    else return notification('No records retrieved')
}

async function getinventory() {
    let request = await httpRequest2('../controllers/fetchinventorylist', null, null, 'json')
    if(request.status) {
        receiveablelength = formatNumber(request.data.length)
        if(document.getElementById('dashinventory'))document.getElementById('dashinventory').textContent = receiveablelength
    }
    else return notification('No records retrieved')
}

async function getreceiveable() {
    let request = await httpRequest2('../controllers/fetchreceivablesbyrooms', null, null, 'json')
    if(request.status) {
        receiveablelength = formatCurrency(request.data.reduce((accumulator, currentValue) => accumulator + (Number(currentValue.debit) - Number(currentValue.credit)), 0))
        if(document.getElementById('dashreceiveable'))document.getElementById('dashreceiveable').textContent = receiveablelength
    }
    else return notification('No records retrieved')
}

async function getoccupiedroom(){
    function param(){
        let par = new FormData()
        par.append('roomstatus', 'OCCUPIED')
        return par
    }
     let request = await httpRequest2('../controllers/getallroomstatus', param(), null, 'json')
    // request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) { 
            occupiedroomlength = request.data.length
            if(document.getElementById('dashoccupiedrooms'))document.getElementById('dashoccupiedrooms').textContent = request.data.length
           
        }
    }
    else return notification('No records for available rooms retrieved')
}

document.getElementById('aropener').addEventListener('click', e=>{document.getElementById('arcontainer').classList.add('!left-[0%]');})
document.getElementById('arremover').addEventListener('click', e=>document.getElementById('arcontainer').classList.remove('!left-[0%]'))
document.getElementById('arcontainer').addEventListener('click', e=>{e.stopPropagation();if(e.target.id === 'arcontainer')document.getElementById('arcontainer').classList.remove('!left-[0%]')})

function recalldatalist(stock=''){
    hemsuserlist()
    hemsdepartment(stock)
    hemsroomcategories()
    hemsroomnumber()
    hemsavailableroomnumber()
    hemsitemslist()
    hemscostcenter()
    hemsratecode()
}

async function runavailablerooms(){
     let request = await httpRequest('../controllers/getallroomstatus')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) { 
            availableroomlength = request.data.length
            if(document.getElementById('dashavailablerooms'))document.getElementById('dashavailablerooms').textContent = request.data.length
            did('availableroomcontainer').innerHTML = request.data.map((data, i)=>`
                <div x-data="{ open: false }" class="relative my-1 flex min-h-fit flex-col items-center justify-center overflow-hidden bg-transparent">
                  <div  @click="open = ! open" class="cp flex w-full items-center justify-between rounded rounded-b-none !bg-[#64748b] p-2">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[white]">meeting_room</span>
                        <h4 class="text-xs font-normal text-white">${data.roomnumber} ${data.roomname}</h4>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div x-show="open" @click.outside="open = false"  x-transition:enter="transition ease-out duration-300"
                        x-transition:enter-start="opacity-0 translate-y-0"
                        x-transition:enter-end="opacity-100 translate-y-0"
                        x-transition:leave="transition ease-in duration-300"
                        x-transition:leave-start="opacity-100 translate-y-10"
                        x-transition:leave-end="opacity-0 translate-y-0" class="w-full">
                    <h4 class="text-sm text-slate-400">
                         <div class="table-content !w-full">
                                    <label class="hidden">${data.roomname} ${data.roomnumber} ${data.roomcategory} ${data.roomstatus} ${data.building}</label>
                                    <table class="flex">
                                        <tbody id="">
                                           <tr class="flex flex-col items-start !bg-[#64748b] text-white">
                                                <td class="opacity-90"> Room&nbsp;Name</td>
                                                <td class="opacity-90"> Room&nbsp;Number</td>
                                                <td class="opacity-90"> Building</td>
                                                <td class="opacity-90"> Room&nbsp;Category</td>
                                                <td class="opacity-90"> Room&nbsp;Status</td>
                                                <td class="opacity-90"> Status&nbsp;Desc.</td>
                                            </tr>
                                        </tbody>
                                        <tbody id="">
                                           <tr class="flex w-[135%] flex-col bg-white text-black">
                                                <td class="opacity-90"> ${data.roomname.toUpperCase()} </td>
                                                <td class="opacity-90"> ${data.roomnumber} </td>
                                                <td class="opacity-90"> ${data.building} </td>
                                                <td class="opacity-90"> ${data.roomcategory} </td>
                                                <td class="opacity-90"> ${data.roomstatus} </td>
                                                <td class="opacity-90"> ${data.roomstatusdescription} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <img class="w-full" src="../images/${data.imageurl1}" />
                                    <img class="w-full" src="../images/${data.imageurl1}" />
                                    <button class="mt-4 hidden rounded !bg-[#64748b] p-1 text-xs text-white">More Info</button>
                                </div>
                    </h4>
                    
                  </div>
                </div>
            `).join('')
        }
    }
    else return notification('No records for available rooms retrieved')
}

function checkotherbankdetails(comp='comp'){
    if(document.getElementById('paymentmethod')){
        if(document.getElementById('paymentmethod').value == 'TRANSFER' || document.getElementById('paymentmethod').value == 'POS'){
            document.getElementById('bankdetails').innerHTML = `<div class="form-group mt-2">
                                                     <label for="logoname" class="control-label">Bank Name</label>
                                                    <input type="number" name="bankname" id="bankname" placeholder="Enter bank name" class="form-control ${comp} bg-white" >
                                                </div>
                                                <div class="form-group mt-2">
                                                    <label for="logoname" class="control-label">Other Details</label>
                                                    <textarea type="number" name="otherdetails" id="otherdetails" placeholder="Enter account name, transaction reference and other relevant details" class="form-control ${comp} bg-white"></textarea>
                                                </div>`
        }else{
            document.getElementById('bankdetails').innerHTML = '';
        }
    }
    
}

async function hemscostcenter(id="") {
    let request = await httpRequest('../controllers/fetchcostcenter')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
                document.getElementById('hems_cost_center').innerHTML = request.data.map(data=>`<option value="${data.costcenter}">${data.id}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}
async function hemsratecode(id="") {
    let request = await httpRequest('../controllers/fetchratecode')
    request = JSON.parse(request)
    if(request.status) {
            allratecodes = request.data;
        if(request.data.length) {
                document.getElementById('hems_rate_code').innerHTML = request.data.map(data=>`<option value="${data.ratecode}"></option>`).join('')
                document.getElementById('hems_rate_code_id').innerHTML = request.data.map(data=>`<option value="${data.ratecode}">${data.id}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}
async function hemsroomnumber(id="") {
    let request = await httpRequest('../controllers/fetchrooms')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            if(id){
                document.getElementById('hems_roomnumber').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
            }else{
                document.getElementById('hems_roomnumber').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
            }
        }
    }
    else return notification('No records retrieved')
}
async function hemsavailableroomnumber(id="") {
    let request = await httpRequest('../controllers/getallroomstatus')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            availroom = request.data
            if(id){
                document.getElementById('hems_roomnumber').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
                document.getElementById('hems_available_roomnumber').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_available_roomnumber_id').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
            }else{
                document.getElementById('hems_roomnumber').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
                document.getElementById('hems_available_roomnumber').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_available_roomnumber_id').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
            }
        }
    }
    else return notification('No records retrieved')
}
async function hemsuserlist() {
    let request = await httpRequest('../controllers/fetchusers')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            document.getElementById('hems_userlist_id').innerHTML = request.data.map(data=>`<option>${data.firstname} ${data.lastname} || ${data.id}</option>`).join('')
            document.getElementById('hems_userlist_email').innerHTML = request.data.map(data=>`<option>${data.firstname} ${data.lastname} || ${data.email}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}

// async function hemsdepartment() {
//     let request = await httpRequest('../controllers/fetchlocation')
//     request = JSON.parse(request)
//     if(request.status) {
//         if(request.data.length) {
//             document.getElementById('hems_departmentlist').innerHTML = request.data.filter(data=>data.locationtype == 'DEPARTMENT').map(data=>`<option>${data.location} || ${data.id}</option>`).join('')
//         }
//     }
//     else return notification('No records retrieved')
// }
async function hemsroomcategories() {
    let request = await httpRequest('../controllers/fetchroomcategories')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            rumcat = request.data
            document.getElementById('hems_roomcategories').innerHTML = request.data.map(data=>`<option>${data.category} || ${data.id}</option>`).join('')
            for(let i=0;i<document.getElementsByClassName('roomcategory').length;i++){
                // console.log(document.getElementsByClassName('roomcategory')[i], document.getElementsByClassName('room-type')[i])
                if(document.getElementsByClassName('roomcategory')[i] && document.getElementsByClassName('roomcategory')[i].children.length < 2){
                    if(document.getElementsByClassName('roomcategory')[i])document.getElementsByClassName('roomcategory')[i].innerHTML = `<option value="">-- Select Room Type --</option>`
                    if(document.getElementsByClassName('roomcategory')[i])document.getElementsByClassName('roomcategory')[i].innerHTML += request.data.map(data=>`<option value="${data.id}">${data.category}</option>`).join('')
                }
                if(document.getElementsByClassName('room-type')[i] && document.getElementsByClassName('room-type')[i].children.length < 2){
                    if(document.getElementsByClassName('room-type')[i])document.getElementsByClassName('room-type')[i].innerHTML = `<option value="">-- Select Room Type --</option>`
                    if(document.getElementsByClassName('room-type')[i])document.getElementsByClassName('room-type')[i].innerHTML += request.data.map(data=>`<option value="${data.id}">${data.category}</option>`).join('')
                }
            }
        }
    }
    else return notification('No records retrieved')
}
async function hemsitemslist() {
    let request = await httpRequest('../controllers/fetchinventorylist')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            // rumcat = request.data
            document.getElementById('hems_itemslist').innerHTML = request.data.map(data=>`<option>${data.itemname.trim()}</option>`).join('')
            document.getElementById('hems_itemslist_getid').innerHTML = request.data.map(data=>`<option value="${data.itemname.trim()}">${data.itemid.trim()}</option>`).join('')
            document.getElementById('hems_itemslist_getname').innerHTML = request.data.map(data=>`<option value="${data.itemid.trim()}">${data.itemname.trim()}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}
async function hemsdepartment(stock='stock') {
    let request = await httpRequest('../controllers/fetchdepartments')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            // rumcat = request.data
            let res
            // if(stock)res= request.data.filter(dat=>dat.applyforsales == 'STOCK' || dat.applysales == 'NON STOCK')
            // if(!stock)res= request.data 
            res= request.data
            document.getElementById('hems_department').innerHTML = res.map(data=>`<option value="${data.department}">${data.id}</option>`).join('')
            if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML = `<option value="">-- Select Sales Point --</option>`
            if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML += res.filter(dat=>dat.applyforsales == 'NON STOCK' || dat.applyforsales == 'STOCK').map(data=>`<option ${data.department == default_department ? 'selected' : ''}>${data.department == 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : data.department}</option>`).join('')
            if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML = `<option value="">-- Select Sales Point --</option>`
            if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML += res.filter(dat=>dat.applyforsales == 'NON STOCK' || dat.applyforsales == 'STOCK').map(data=>`<option>${data.department == 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : data.department}</option>`).join('')
            if(document.getElementById('salespointname2'))document.getElementById('salespointname2').innerHTML = `<option value="">-- Select Sales Point --</option><option>ALL</option><option>Booking/Reservation</option>`
            if(document.getElementById('salespointname2'))document.getElementById('salespointname2').innerHTML += res.filter(dat=>dat.applyforsales == 'NON STOCK' || dat.applyforsales == 'STOCK').map(data=>`<option>${data.department == 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : data.department}</option>`).join('')
            if(document.getElementById('salespointnamemainstore'))document.getElementById('salespointnamemainstore').innerHTML = res.filter(dat=>dat.department == default_department).map(data=>`<option>${data.department == 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : data.department}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}
async function hemsdepartment2(stock='') {
    let request = await httpRequest('../controllers/fetchdepartments')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            // rumcat = request.data
            let res
            // if(stock)res= request.data.filter(dat=>dat.applyforsales == 'STOCK' || dat.applysales == 'NON STOCK')
            // if(!stock)res= request.data 
            res= request.data
            document.getElementById('hems_department').innerHTML = res.map(data=>`<option value="${data.department}">${data.id}</option>`).join('')
            if(stock == 'STOCK'){
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML += res.filter(dat=>dat.applyforsales == 'STOCK').map(data=>`<option ${data.department == default_department ? 'selected' : ''}>${data.department}</option>`).join('')
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML += res.filter(dat=>dat.applyforsales == 'STOCK').map(data=>`<option>${data.department}</option>`).join('')
            }
            if(stock == 'NON STOCK'){
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML += res.filter(dat=>dat.applyforsales == 'NON STOCK').map(data=>`<option ${data.department == default_department ? 'selected' : ''}>${data.department}</option>`).join('')
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML += res.filter(dat=>dat.applyforsales == 'NON STOCK').map(data=>`<option>${data.department}</option>`).join('')
            }
            if(stock == ''){
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML += res.map(data=>`<option ${data.department == default_department ? 'selected' : ''}>${data.department}</option>`).join('')
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML += res.map(data=>`<option>${data.department}</option>`).join('')
            }
        }
    }
    else return notification('No records retrieved')
}


async function entername(){
    // if(!sessionStorage.getItem('user'))return window.location.href = './login.html'
    let x = JSON.parse(sessionStorage.getItem('user'))
    for(let i=0;i<document.getElementsByName('user_name').length;i++){
        if(document.getElementsByName('user_name')[i])document.getElementsByName('user_name')[i].innerHTML = `<span class="capitalize">${x.firstname}&nbsp;${x.lastname}</span>`
    }
    for(let i=0;i<document.getElementsByName('user_role').length;i++){
        if(document.getElementsByName('user_role')[i])document.getElementsByName('user_role')[i].innerHTML = `<span>${x.role}</span>`
    }
    for(let i=0;i<document.getElementsByName('user_email').length;i++){
        if(document.getElementsByName('user_email')[i])document.getElementsByName('user_email')[i].innerHTML = `<span class="capitalize">${x.email}</span>`
    }
    for(let i=0;i<document.getElementsByName('user_image').length;i++){
        if(document.getElementsByName('user_image')[i] && x.image)document.getElementsByName('user_image')[i].src = x.image
    }
    async function fetchOrganisationData() {
        let request = await httpRequest2('api/v1/admin/organizationsettings', null, null, 'json', 'GET');
        if (request.status) {
            let data = request.data[0];
            organisationSettings = data;
            document.getElementById('your_companyname').value = data.company_name;
            document.getElementById('your_companyphone').value = data.phone;
            document.getElementById('your_companyaddress').value = data.address;
            document.getElementById('your_companylogo').value = data.logo;
            document.getElementById('your_companyemail').value = data.email;
        } else {
            notification('Failed to fetch organisation data', 0);
        }
    }

    async function fetchProfileData() {
        let request = await httpRequest2('api/v1/auth/profile', null, null, 'json', 'GET');
        if (request.status) {
            let data = request.data;
            if(document.getElementById('branch'))document.getElementById('branch').value = data.branch;
            if(document.getElementById('your_role'))document.getElementById('your_role').value = data.role;
        } else {
            notification('Failed to fetch profile data', 0);
        }
    }

    fetchOrganisationData();
    fetchProfileData();
}

async function verifyemail() {
    let request = await httpRequest2('../../framework/controllers/verifyemail', null, null, 'json')
    if(request.status) {
        return notification('Email sent!', 1);
        
    }
    return notification(request.message, 0);
}

function getLabelFromValue(selectedValue, id) {
  const datalist = document.getElementById(id);
  const options = datalist.querySelectorAll('option');
  
  for (const option of options) {
    if (option.value == selectedValue) {
        console.log('value option', option.textContent)
      return option.textContent;
    }
  }
  
  return ''; // Return null if value not found
}


function checkAccountForVerification() {
    let user = JSON.parse(sessionStorage.getItem('user'))
    if(user?.status === 'NOT VERIFIED') {
        let div = document.createElement('div')
        div.className = 'font-heebo animate__animated animate__fadeInDown flex items-center gap-3 bg-rose-400 p-1.5 px-5 text-xs text-white/90'
        div.innerHTML = `<span>Your account is not verified.</span><button onclick="verifyemail()" class="cursor-pointer underline underline-offset-4 hover:no-underline">Click to verify</button>`
        
        let domElement = document.querySelector('main')
        domElement.firstElementChild.insertBefore(div, domElement.firstElementChild.firstElementChild)
    }
}

function toggleNavigation() {
    const navigation =  document.getElementById('navigation')
    if(navigation){
        if(navigation.classList.contains('show')) {
            navigation.style.width = isDeviceMobile() ? '250px' : (80/100 * screen.availWidth ) + 'px'
            navigation.classList.remove('show')
        }
        else {
            navigation.style.width = '0'
            navigation.classList.add('show')
        }
    }
}

function isDeviceMobile() {
    let matches = window.matchMedia('(min-width: 1280px)').matches
    return matches
}

async function getdatecode(sentence) {
    let request = await httpRequest2(`api/v1/inventory/requisition/view?${queryParams ? `${queryParams}` : ''}`, null, null, 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onsavingsproductTableDataSignal);
            }
        } else {
            document.getElementsByClassName('updater')[0].click();
            savingsproductid = request.data[0].id;
            populateData(request.data[0]);
        }
    } else {
        return notification('No records retrieved');
    }
}


// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('../service-worker.js')
//         .then((registration) => {
//           console.log('Service Worker registered with scope:', registration.scope);
//         })
//         .catch((error) => {
//           console.error('Service Worker registration failed:', error);
//         });
//     });
//   }