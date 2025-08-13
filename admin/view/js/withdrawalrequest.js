let withdrawalrequestid
async function withdrawalrequestActive() {
    dynamiccomma(true)
    withdrawalrequestid = ''
    const form = document.querySelector('#withdrawalrequestform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', withdrawalrequestFormSubmitHandler)
    if(document.querySelector('#accountnumber')) document.querySelector('#accountnumber').addEventListener('change', fetchwithdrawalrequestaccountdetails)
    datasource = []
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('#transactionDate').value = today;
    document.querySelector('#valueDate').value = today;
    await getAllUsers('withdrawalrequestor', 'name')
    new TomSelect('#withdrawalrequestor', {
        plugins: ['dropdown_input'],
        onInitialize: function() {
            this.setValue(the_user.id);
            this.disable();
        }
    });
    // await fetchwithdrawalrequest()
    // await getAllwithdrawalrequest(true)
    // new TomSelect('#withdrawalrequest', {
    //     // plugins: ['remove_button'],
    //     onInitialize: function() {
    //         console.log(checkpermission('FILTER withdrawalrequest'))
    //         if(!checkpermission('FILTER withdrawalrequest')) this.setValue(the_user.withdrawalrequest);
            // if(!checkpermission('FILTER withdrawalrequest')) this.disable();
    //     }
    // });
}
let accountownerid
let accountownertype
async function fetchwithdrawalrequestaccountdetails() {
    notification('Fetching account details, please wait...');
    did('detail_profilepic').src = '';
    did('detail_accountnumber').value = '';
    did('detail_accountname').value = '';
    did('detail_accounttype').value = '';
    did('detail_paymentmethod').value = '';
    did('detail_mobilenumber').value = '';
    did('detail_domiciledbranch').value = '';
    did('detail_age').value = '';
    did('detail_gender').value = '';
    did('detail_role').value = '';
    did('detail_dateopened').value = '';
    if(did('accountnumber').value == '') return notification('Please enter the account number', 0);
    let request = await httpRequest2(`api/v1/transactions/getaccounttypefull?accountnumber=${did('accountnumber').value}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    if(request.status) {
        notification(request.message, 1);
            if(request.data) {
                datasource = request.data;
                accountownerid = request.data.person.id;
                accountownertype = request.data.accounttype;
                    did('detail_profilepic').setAttribute('src', request.data.person.image);
                    did('detail_accountnumber').value = request.data.accountnumber;
                    did('accountnumber').value = request.data.accountnumber;    
                    did('detail_accountname').value = request.data.accountname;
                    did('detail_accounttype').value = request.data.accounttype;
                    did('detail_paymentmethod').value = "BANK";
                    did('detail_mobilenumber').value = request.data.person.phone;
                    did('detail_domiciledbranch').value = request.data.person.branchname;
                    did('detail_age').value = request.data.person.age;
                    did('detail_gender').value = request.data.person.gender;
                    did('detail_role').value = request.data.person.role;
                    did('detail_dateopened').value = formatDate(request.data.person.dateofbirth);
        }
    } else {
        did('accountnumber').value = '';
        return notification('No records retrieved');
    }
}

async function withdrawalrequestFormSubmitHandler() {
    if (document.querySelector('#withdrawalrequestlocationCheckbox').checked) {
        if (did('detail_accounttype').value != 'Personal') {
            return notification('Account type must be Personal when Withdraw Allocation is checked', 0);
        }
    }
    dynamiccomma(false)
    if(did('accountnumber').value != did('detail_accountnumber').value) return notification('Account number does not match', 0);
    if(!did('amountPaid').value)return notification('Please enter the amount paid', 0);
    if(!did('withdrawalrequestor').value)return notification('Please reset the page, cant find the withdrawalrequestor', 0);

    
    
    
    let payload = getFormData2(did('withdrawalrequestform'), [
        ['branch', the_user.branch],
        ['userid', accountownerid],
        ['accounttype', accountownertype],
        ['rowsize', 1],
        ['accountnumber', did('accountnumber').value],
        ['amount', did('amountPaid').value],
        ['location', 'BRANCH'],
        // ['allocation', document.querySelector('#withdrawalrequestlocationCheckbox').checked ? 1 : 0],
        // ['cashref', did('depositCode').value]
    ]);

    if (did('depositCode').value) {
        const confirmed = await Swal.fire({
            title: 'Warning',
            text: 'The cashier should ensure it\'s an excess the marketer is withdrawing, else he would be held responsible for it.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Cancel'
        });

        if (!confirmed.isConfirmed) {
            return;
        }
    }
    
    const pinStatus = await getAndVerifyPin();
    if(!pinStatus) return;

    if (did('depositCode').value) {
        const otpStatus = await getAndVerifyOTP();
        if(!otpStatus) return;
    }
    
    if(Number(did('amountPaid').value) > 100000){
        alert('Please enter a valid account number')
        const otpStatus = await getAndVerifyOTP();
        if(!otpStatus) return;
    }
    // return
    const confirmed = await Swal.fire({
        title: withdrawalrequestid ? 'Withdrawing...' : 'Withdrawing...',
        text: 'Please wait while the withdrawal request is been made.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2('api/v1/transactions/withdrawalrequest', payload, document.querySelector('#withdrawalrequestform #submit'), 'json', 'POST');
            Swal.close();

            if (request.status) {
                notification('withdrawalrequest Successful', 1);
                did('withdrawalrequest').click()
            } else {    
                notification(request.message, 0);
            }
        }
    });
}
