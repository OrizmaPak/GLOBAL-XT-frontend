let addgltransactionid
let glAccountDropdownData
async function addgltransactionActive() {
    addgltransactionid = ''

    datasource = []

    const form = document.querySelector('#addgltransactionform');
    if (form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', addgltransactionFormSubmitHandler);

    glAccountDropdownData = JSON.parse(sessionStorage.getItem('glAccountDropdownData')) || await populateAcctDropdown();
    sessionStorage.setItem('glAccountDropdownData', JSON.stringify(glAccountDropdownData));

    const debitlist = document.querySelector('#debitAcct-list');
    const creditlist = document.querySelector('#creditAcct-list');
    const customerlist = document.querySelector('#customerEntry-list');
    
    // Automatically populate account number dropdowns
    if (creditlist.querySelector('#cglaccountnumber')){
        const creditAccountDropdown = document.getElementById('cglaccountnumber');

        if (glAccountDropdownData) {
            glAccountDropdownData.data.forEach(account => {
                const option = document.createElement('option');
                option.value = account.accountnumber;
                option.text = `${account.accountnumber} ${account.groupname}`;
                creditAccountDropdown.appendChild(option);
            });
        } 
    } 

    if (debitlist.querySelector('#dglaccountnumber')){
        const debitAccountDropdown = document.getElementById('dglaccountnumber');
        
        if (glAccountDropdownData) {
            glAccountDropdownData.data.forEach(account => {
                const option = document.createElement('option');
                option.value = account.accountnumber;
                option.text = `${account.accountnumber} ${account.groupname}`;
                debitAccountDropdown.appendChild(option);
            });
        } 
    }

    if (customerlist.querySelector('#cusaccountnumber')){
        const customerAccountDropdown = document.getElementById('cusaccountnumber');
        
        if (glAccountDropdownData) {
            glAccountDropdownData.data.forEach(account => {
                const option = document.createElement('option');
                option.value = account.accountnumber;
                option.text = `${account.accountnumber} ${account.groupname}`;
                customerAccountDropdown.appendChild(option);
            });
        } 
    }

    // Event listeners for recalculating totals
    document.querySelectorAll('input[name="cglamount"]').forEach(input => {
        input.addEventListener('change', () => calculateTotal('input[name="cglamount"]', 'totalCredit'));
    });

    document.querySelectorAll('input[name="dglamount"]').forEach(input => {
        input.addEventListener('change', () => calculateTotal('input[name="dglamount"]', 'totalDebit'));
    });

    document.querySelectorAll('input[name="cusamount"]').forEach(input => {
        input.addEventListener('change', () => calculateTotal('input[name="cusamount"]', 'customerTotal'));
    });
    
}

async function addgltransactionFormSubmitHandler() {
    // if(!validateForm('addgltransactionform', getIdFromCls('comp'))) return notification('Please fill all required fields', 0)
    let customerRows = document.querySelectorAll('#addgltransactionform .customer-item').length;
    
    givenamebyclass('cglamount');
    givenamebyclass('cglaccountnumber');
    givenamebyclass('dglamount');
    givenamebyclass('dglaccountnumber');
    givenamebyclass('accounttype');
    givenamebyclass('cusaccountnumber');
    givenamebyclass('cusamount');


    let creditRows = document.querySelectorAll('#addgltransactionform .credit-item').length;
    let debitRows = document.querySelectorAll('#addgltransactionform .debit-item').length;
    let additionalData = [['creditglrow', creditRows], ['debitglrow', debitRows]];

    const customertype = document.querySelector('#customertype').value;
    const totalDebit = parseFloat(document.getElementById('totalDebit').value) || 0;
    const totalCustomer = parseFloat(document.getElementById('customerTotal').value) || 0;
    const totalCredit = parseFloat(document.getElementById('totalCredit').value) || 0;
    const bypassBalance = document.getElementById('bypassbalance').checked;

    if (customertype === 'DEBIT' && totalDebit + totalCustomer !== totalCredit) {
        return notification('Total Debit plus Total Customer must equal Total Credit', 0);
    } else if (customertype === 'CREDIT' && totalCredit + totalCustomer !== totalDebit) {
        return notification('Total Credit plus Total Customer must equal Total Debit', 0);
    } else if (!customertype && totalCredit !== totalDebit) {
        return notification('Total Credit must equal Total Debit', 0);
    }
    
    let formElement = document.querySelector('#addgltransactionform');
    let payload = getFormData2(formElement, addgltransactionid ? [['id', addgltransactionid], ...additionalData] : additionalData);
    payload.delete('bypassbalance'); 
    payload.delete('customerToGL'); 

    if (!document.getElementById("customerToGL").checked) {
        console.log("I ran")
        payload.delete('customerrow');
        payload.delete('customertype');
        for (const key of Array.from(payload.keys())) {
            if (key.startsWith('cusaccountnumber') || key.startsWith('cusamount')  || key.startsWith('accounttype')) {
                payload.delete(key);
            }
        }
    } else {
        payload.append('customerrow', customerRows);
    }
    
    if (!bypassBalance) {
        payload.append('bypassbalance', 'NO');
    } else {
        payload.append('bypassbalance', 'YES');
    }

    const confirmed = await Swal.fire({
        title: addgltransactionid ? 'Updating...' : 'Submitting...',
        text: 'Please wait while we submit your data.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/transactions/addgltransaction', payload, document.querySelector('#addgltransactionform #submit'), 'json', 'POST');
            Swal.close();

            if (request.status) {
                notification('Success!', 1);
                const form = document.querySelector('#addgltransactionform');
                form.reset();
                location.reload(); // Refresh the page
                if(addgltransactionid)form.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
                addgltransactionid = '';
                document.getElementsByClassName('viewer')[0].click();
                fetchaddgltransaction();
            } else {    
                notification(request.message, 0);
            }
        }
    });
}

async function addCustomerEntry() {
    let customersList = document.getElementById("customerEntry-list");

    let div = document.createElement("div");
    div.classList.add("flex", "customer-item", "gap-3", "my-4");

    div.innerHTML = `
     <div class="form-group flex w-full flex-row">
         <div>
            <label for="accounttype" class="mb-1 font-medium">Account Type</label>
            <select id="accounttype" name="accounttype" class="w-full rounded border p-2">
                <option value="">-- Select a type --</option>
                <option value="SAVINGS">Savings</option>
                <option value="PERSONAL">Personal</option>
                <option value="LOAN">Loan</option>
                <option value="ROTARY">Rotary</option>
                <option value="PROPERTY">Property</option>
            </select>
        </div>
        <div>
            <label for="cusaccountnumber" class="mb-1 font-medium">Customer Account Number</label>
            <select
                id="cusaccountnumber"
                name="cusaccountnumber"
                class="cusaccountnumber w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="" selected disabled>Select Account</option>
                <!-- Add your dropdown options here -->
            </select>
        </div> 
        <div>
            <label for="cusamount" class="mb-1 font-medium">Amount</label>
            <input type="text" name="cusamount" placeholder="Amount" class="cusamount w-full rounded border p-2" />
        </div>    
        <div class="flex items-end">
            <button type="button" onclick="removeField(this.parentElement.parentElement, 'cusamount', 'customerTotal')" class="rounded-md bg-red-500 px-3 py-2 text-white">Remove</button>
        </div>
      </div>       
    `;

    customersList.appendChild(div);
    // givenamebyclass('cusaccountnumber');
    // givenamebyclass('cusamount');

    const customerAccountDropdown = document.querySelectorAll('select[name="cusaccountnumber"]');
    console.log(customerAccountDropdown)
            
    if (glAccountDropdownData) {
        glAccountDropdownData.data.forEach(account => {
            const option = document.createElement('option');
            option.value = account.accountnumber;
            option.text = `${account.accountnumber} ${account.groupname}`;
            customerAccountDropdown.forEach(element => {
                element.appendChild(option.cloneNode(true));
            });
        });
    } 

    document.querySelectorAll('input[name="cusamount"]').forEach(input => {
        input.addEventListener('change', () => calculateTotal('input[name="cusamount"]', 'customerTotal'));
    });
}

async function addGLDebitEntry() {
    let accountsList = document.getElementById("debitAcct-list");

    let div = document.createElement("div");
    div.classList.add("grid", "grid-cols-3", "debit-item", "gap-3", "my-4");

    div.innerHTML = `
        <div class="form-group">
            <label for="dglaccountnumber" class="font-semibold text-gray-700">Debit Account</label>
            <select name="dglaccountnumber" class="comp account dglaccountnumber w-full rounded-md border border-gray-300 p-2">
                <option value="">-- Select an account --</option>
                <!-- Populate options dynamically -->
            </select>
        </div>
        <div class="form-group">
            <label for="dglamount" class="font-semibold text-gray-700">Debit Amount</label>
            <input type="number" name="dglamount" placeholder="Value" class="comp dglamount w-full rounded-md border border-gray-300 p-2">
        </div>
        <div class="flex w-full items-end">
            <button type="button" onclick="removeField(this.parentElement.parentElement, 'dglamount', 'totalDebit')" class="rounded-md bg-red-500 px-3 py-2 text-white">Remove</button>
        </div>
    `;

    accountsList.appendChild(div);
    // givenamebyclass('dglaccountnumber');
    // givenamebyclass('dglamount');

    const debitDropdown = document.querySelectorAll('select[name="dglaccountnumber"]');
    
    if (glAccountDropdownData) {
        glAccountDropdownData.data.forEach(account => {
            const option = document.createElement('option');
            option.value = account.accountnumber;
            option.text = `${account.accountnumber} ${account.groupname}`;
            debitDropdown.forEach(element => {
                element.appendChild(option.cloneNode(true));
            });
        });
    } 

    document.querySelectorAll('input[name="dglamount"]').forEach(input => {
        input.addEventListener('change', () => calculateTotal('input[name="dglamount"]', 'totalDebit'));
    });
}

async function addGLCreditEntry() {
    let accountsList = document.getElementById("creditAcct-list");

    let div = document.createElement("div");
    div.classList.add("grid", "grid-cols-3", "credit-item", "gap-3", "my-4");

    div.innerHTML = `
        <div class="form-group">
            <label for="cglaccountnumber" class="font-semibold text-gray-700">Credit Account</label>
            <select name="cglaccountnumber" class="account cglaccountnumber w-full rounded-md border border-gray-300 p-2">
                <option value="">-- Select an account --</option>
                <!-- Populate options dynamically -->
            </select>
        </div>
        <div class="form-group">
            <label for="cglamount" class="font-semibold text-gray-700">Credit Amount</label>
            <input type="number" name="cglamount" placeholder="Value" class="amount cglamount w-full rounded-md border border-gray-300 p-2">
        </div>
        <div class="flex w-full items-end">
            <button type="button" onclick="removeField(this.parentElement.parentElement, 'cglamount', 'totalCredit')" class="rounded-md bg-red-500 px-3 py-2 text-white">Remove</button>
        </div>
    `;

    accountsList.appendChild(div);
    // givenamebyclass('cglaccountnumber');
    // givenamebyclass('cglamount');

    const creditDropdown = document.querySelectorAll('select[name="cglaccountnumber"]');
            
    if (glAccountDropdownData) {
        glAccountDropdownData.data.forEach(account => {
            const option = document.createElement('option');
            option.value = account.accountnumber;
            option.text = `${account.accountnumber} ${account.groupname}`;
            creditDropdown.forEach(element => {
                element.appendChild(option.cloneNode(true));
            });
        });
    } 

    document.querySelectorAll('input[name="cglamount"]').forEach(input => {
        input.addEventListener('change', () => calculateTotal('input[name="cglamount"]', 'totalCredit'));
    });
}

async function populateAcctDropdown() {
    try {
        const response = await httpRequest2(`api/v1/glaccounts/manageglaccounts`, null, null, 'json', 'GET');
        return response;
    } catch (error) {
        console.error('Error in fetching account list:', error);
        return { status: false, message: 'An error occurred while fetching GL accounts data.' };
    }
}

function toggleCustomerSection() {
    const checkbox = document.getElementById("customerToGL");
    const section = document.getElementById("customerSection");

    if (checkbox.checked) {
      section.classList.remove("hidden");
      return true
    } else {
      section.classList.add("hidden");
      return false
    }
}

// Calculate and display totals (credit, debit, customer)
function calculateTotal(inputsSelector, totalFieldId) {
    const inputs = document.querySelectorAll(inputsSelector);
    const totalField = document.getElementById(totalFieldId);
    let totalAmount = 0;
    inputs.forEach(input => {
        totalAmount += parseFloat(input.value) || 0;
    });
    totalField.value = totalAmount;

    console.log(`Total value for ${inputsSelector}`, totalAmount)
}

function removeField(element, elementName, totalFieldId) {
    // Calculate the amount to be deducted
    const amountInput = element.querySelector(`input[name=${elementName}]`);
    const amountToDeduct = parseFloat(amountInput.value) || 0;

    // Update the total by deducting the amount
    const totalField = document.getElementById(totalFieldId);
    const currentTotal = parseFloat(totalField.value) || 0;
    totalField.value = currentTotal - amountToDeduct;

    // Remove the element
    element.remove();
}