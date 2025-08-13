// let dashboardid
// let dashboardMembershipData
// let dashboardSavingsData
// let dashboardLoanData
// let dashboardRotaryData
// let dashboardPropertyData
// let dashboardPersonalData
// let lastTenTransactions; 
// let dashboardUserId;
// let dashboardAllUsers;

async function admindashboardMemberActive() {
  let userinfo;

  Swal.fire({
    title: 'Loading...',
    text: 'Please wait while we fetch the data.',
    allowOutsideClick: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });
  
  dashboardAllUsers = []
  await getAllUsers('userid', 'name', false, false, true);

  const userName = document.getElementById('userName');
  const userImage = document.getElementById('userImage');
        
  tomselect = new TomSelect('#userid', {
    plugins: ['dropdown_input'],
    valueField: 'id',
    labelField: 'fullname',
    searchField: ['fullname'],
    maxOptions: 100,
    preload: false,
    persist: false, // ✅ Don't keep old options
    loadThrottle: 0, // ✅ No throttling
    loadingClass: 'ts-loading',

    render: {
        loading: function () {
            return `
                <div class="ts-spinner-container">
                    <span class="ts-spinner"></span>
                    <span class="ts-spinner-text">Loading...</span>
                </div>
            `;
        }
    },

    shouldLoad: function (query) {
        return query.length > 0;
    },

    // ✅ Show all API results regardless of query match
    score: function () {
        return function () {
            return 1;
        };
    },

    load: async function (query, callback) {
        try {
            const request = await httpRequest2(`api/v1/members/userregistration?q=${encodeURIComponent(query)}`, null, null, 'json', 'GET');
            dashboardAllUsers = request.data;

            // ✅ Clear old options and cache before inserting new ones
            this.clearOptions();
            this.clearCache();

            const results = request.data.map(user => ({
                id: user.id,
                fullname: `${user.firstname} ${user.lastname}`
            }));

            callback(results);
        } catch (error) {
            console.error('Error loading options:', error);
            callback();
        }
    },

    onInitialize: function () {
        dashboardUserId = the_user.id;
        this.setValue(dashboardUserId);
    },

    onChange: function (value) {
        document.getElementById('personal-card').textContent = "Loading...";
        document.getElementById('personal-balance').textContent = "Loading...";
        document.getElementById('personalwe-card').textContent = "Loading...";
        document.getElementById('sendbankname').textContent = "Loading...";
        document.getElementById('balance-value').textContent = "";

        dashboardUserId = value;
        userinfo = dashboardAllUsers.find((item) => item.id == dashboardUserId);

        if (userinfo) {
            userName.innerText = `${userinfo.firstname} ${userinfo.lastname}`;
            userImage.src = userinfo.image || "./images/default-avatar.png";

            const personalweCardElement = document.getElementById('personalwe-card');
            if (userinfo.account_number && userinfo.account_number.trim() !== '') {
                personalweCardElement.innerHTML = `
                    ${userinfo.account_number}
                    <button title="Copy Account Number" 
                        onclick="copyText('${userinfo.account_number}', 'string')"
                        class="material-symbols-outlined ml-2 flex h-4 scale-[0.90] items-center justify-center pt-1 text-blue-400">
                        content_copy
                    </button>`;
                document.getElementById('sendbankname').textContent = userinfo.bank_name;
            } else {
                personalweCardElement.textContent = 'Error';
            }
        }
    }
});




  userinfo = dashboardAllUsers.find((item) => item.id == dashboardUserId);
  userName.innerText = `${userinfo.firstname} ${userinfo.lastname}`;

  dashboardUserId = tomselect.getValue();

    if (did("membership-details-cards")) {
        did("membership-details-cards").classList.add("hidden");
    }

    if (userinfo) {
        const personalweCardElement = document.getElementById('personalwe-card');
        if (userinfo.account_number && userinfo.account_number.trim() !== '') {
            if (personalweCardElement) {
                personalweCardElement.textContent = userinfo.account_number;

                personalweCardElement.innerHTML += `<button title="Copy Account Number" 
                onclick="copyText('${userinfo.account_number}', 'string')"
                class="material-symbols-outlined ml-2 flex h-4 scale-[0.90] items-center justify-center pt-1 text-blue-400">
                content_copy
            </button>`;

                did('sendbankname').textContent = userinfo.bank_name;
            }
        } else {
            personalweCardElement.textContent = 'Error';
        }
    }

    Swal.close();

    const personalBalance = document.getElementById('balance-value');
    const toggleButton = document.querySelector('.toggle-visibility-btn');
    const isBlurred = localStorage.getItem('balanceBlurred') == 'true';

    console.log("Balance Blurred in dashboard", personalBalance)

    if (personalBalance) {
        if (isBlurred) {
            personalBalance.classList.add('blur-sm');
            if (toggleButton) {
                toggleButton.textContent = 'visibility';
            }
        } else {
            personalBalance.classList.remove('blur-sm');
            if (toggleButton) {
                toggleButton.textContent = 'visibility_off';
            }
        }
    }

    datasource = [];
    entername();
    await updatePersonalCard();
    await displaydashboardMembershipData();

    const actionBtn = document.getElementById('action_btn');
    const actionOverlay = document.getElementById('action_overlay');
  
    // Toggle on button click
    actionBtn.addEventListener('click', (event) => {
      // Prevent the click from bubbling up (so it won't immediately close the menu)
      event.stopPropagation();
      // Toggle the hidden class
      actionOverlay.classList.toggle('hidden');
    });
  
    // Close if user clicks anywhere outside the dropdown
    document.addEventListener('click', (event) => {
      // If the dropdown is open and the click is outside both the button and the dropdown
      if (
        !actionOverlay.classList.contains('hidden') &&
        !actionOverlay.contains(event.target) &&
        !actionBtn.contains(event.target)
      ) {
        actionOverlay.classList.add('hidden');
      }
    });

    for (let i = 0; i < document.getElementsByClassName('val').length; i++) {
        if (did('your_role').value !== 'SUPERADMIN') {
            document.getElementsByClassName('val')[i].classList.add('hidden');
        } else {
            document.getElementsByClassName('val')[i].classList.remove('hidden');
        }
    }
}