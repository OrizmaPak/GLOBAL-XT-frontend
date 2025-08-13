/* 
    Object key is the id of the  menu selector
    template: is the html template name.
    startingFunction: function to call when page opens 

*/

const routerTree = {
  // template: {
  //     template: 'template',
  //     startingFunction: 'templateActive',
  //     scriptName: `./js/template.js?q=${Math.random()}`
  // },
  profile: {
    template: "profile",
    startingFunction: "profileActive",
    scriptName: `./js/profile.js?q=${Math.random()}`,
  },
  changepassword: {
    template: "changepassword",
    startingFunction: "changepasswordActive",
    scriptName: `./js/changepassword.js?q=${Math.random()}`,
  },
  dashboard: {
    template: "dashboard",
    startingFunction: "dashboardActive",
    scriptName: `./js/dashboard.js?q=${Math.random()}`,
  },
  members: {
    template: "admindashboardmember",
    startingFunction: "admindashboardMemberActive",
    scriptName: `./js/admindashboardmember.js?q=${Math.random()}`,
  },
  glbalance: {
    template: "admindashboardglbalance",
    startingFunction: "admindashboardglbalanceActive",
    scriptName: `./js/admindashboardglbalance.js?q=${Math.random()}`,
  },
  glnetasset: {
    template: "admindashboardglnetasset",
    startingFunction: "admindashboardglnetassetActive",
    scriptName: `./js/admindashboardglnetasset.js?q=${Math.random()}`,
  },
  branchmanagement: {
    template: "branchmanagement",
    startingFunction: "branchActive",
    scriptName: `./js/branchmanagement.js?q=${Math.random()}`,
  },
  onlineusers: {
    template: "onlineusers",
    startingFunction: "onlineusersActive",
    scriptName: `./js/onlineusers.js?q=${Math.random()}`,
  },
  cashierlimit: {
    template: "cashierlimit",
    startingFunction: "cashierlimitActive",
    scriptName: `./js/cashierlimit.js?q=${Math.random()}`,
  },
  taskmanagement: {
    template: "taskmanagement",
    startingFunction: "taskmanagementActive",
    scriptName: `./js/taskmanagement.js?q=${Math.random()}`,
  },
  registrationpoint: {
    template: "registrationpoint",
    startingFunction: "registrationpointActive",
    scriptName: `./js/registrationpoint.js?q=${Math.random()}`,
  },
  rejecttransactiondate: {
    template: "rejecttransactiondate",
    startingFunction: "rejecttransactiondateActive",
    scriptName: `./js/rejecttransactiondate.js?q=${Math.random()}`,
  },
  permissionsettings: {
    template: "permissionsettings",
    startingFunction: "permissionsettingsActive",
    scriptName: `./js/permissionsettings.js?q=${Math.random()}`,
  },
  department: {
    template: "department",
    startingFunction: "departmentActive",
    scriptName: `./js/department.js?q=${Math.random()}`,
  },

  definemembership: {
    template: "definemembership",
    startingFunction: "definemembershipActive",
    scriptName: `./js/definemembership.js?q=${Math.random()}`,
  },
    definemembership: {
        template: 'definemembership',
        startingFunction: 'definemembershipActive',
        scriptName: `./js/definemembership.js?q=${Math.random()}`
    },
   
    positionmembership: {
        template: 'positionmembership',
        startingFunction: 'positionmembershipActive',
        scriptName: `./js/positionmembership.js?q=${Math.random()}`
    },
    account: {
        template: 'account',
        startingFunction: 'accountActive',
        scriptName: `./js/account.js?q=${Math.random()}`
    },
    activity: {
        template: 'activity',
        startingFunction: 'activityActive',
        scriptName: `./js/activity.js?q=${Math.random()}`
    },
    organizationsettings: {
        template: 'organizationsettings',
        startingFunction: 'organizationsettingsActive',
        scriptName: `./js/organizationsettings.js?q=${Math.random()}`
    },
    createinventory: {
        template: 'createinventory',
        startingFunction: 'createinventoryActive',
        scriptName: `./js/createinventory.js?q=${Math.random()}`
    },
    viewinventory: {
        template: 'viewinventory',
        startingFunction: 'viewinventoryActive',
        scriptName: `./js/viewinventory.js?q=${Math.random()}`
    },
    openingstock: {
        template: 'openingstock',
        startingFunction: 'openingstockActive',
        scriptName: `./js/openingstock.js?q=${Math.random()}`
    },
    updateinventory: {
        template: 'updateinventory',
        startingFunction: 'updateinventoryActive',
        scriptName: `./js/updateinventory.js?q=${Math.random()}`
    },
    requisition: {
        template: 'requisition',
        startingFunction: 'requisitionActive',
        scriptName: `./js/requisition.js?q=${Math.random()}`
    },
    viewrequisition: {
        template: 'viewrequisition',
        startingFunction: 'viewrequisitionActive',
        scriptName: `./js/viewrequisition.js?q=${Math.random()}`
    },
    approveinrequisition: {
        template: 'approveinrequisition',
        startingFunction: 'approveinrequisitionActive',
        scriptName: `./js/approveinrequisition.js?q=${Math.random()}`
    },
    inrequisition: {
        template: 'inrequisition',
        startingFunction: 'inrequisitionActive',
        scriptName: `./js/inrequisition.js?q=${Math.random()}`
    },
    viewinrequisition: {
        template: 'viewinrequisition',
        startingFunction: 'viewinrequisitionActive',
        scriptName: `./js/viewinrequisition.js?q=${Math.random()}`
    },
    approverequisition: {
        template: 'approverequisition',
        startingFunction: 'approverequisitionActive',
        scriptName: `./js/approverequisition.js?q=${Math.random()}`
    },
    issuetype: {
        template: 'issuetype',
        startingFunction: 'issuetypeActive',
        scriptName: `./js/issuetype.js?q=${Math.random()}`
    },
    issuelog: {
        template: 'issuelog',
        startingFunction: 'issuelogActive',
        scriptName: `./js/issuelog.js?q=${Math.random()}`
    },
    viewreturneditems: {
        template: 'viewreturneditems',
        startingFunction: 'viewreturneditemsActive',
        scriptName: `./js/viewreturneditems.js?q=${Math.random()}`
    },
    stockhistory: {
        template: 'stockhistory',
        startingFunction: 'stockhistoryActive',
        scriptName: `./js/stockhistory.js?q=${Math.random()}`
    },
    stockvaluation: {
        template: 'stockvaluation',
        startingFunction: 'stockvaluationActive',
        scriptName: `./js/stockvaluation.js?q=${Math.random()}`
    },
    addmember: {
        template: 'addmember',
        startingFunction: 'addmemberActive',
        scriptName: `./js/addmember.js?q=${Math.random()}`
    },
    yourreferrals: {
        template: 'yourreferrals',
        startingFunction: 'yourreferralsActive',
        scriptName: `./js/yourreferrals.js?q=${Math.random()}`
    },
    regpointreferrals: {
        template: 'regpointreferrals',
        startingFunction: 'regpointreferralsActive',
        scriptName: `./js/regpointreferrals.js?q=${Math.random()}`
    },
    viewmembers: {
        template: 'viewmembers',
        startingFunction: 'viewmembersActive',
        scriptName: `./js/viewmembers.js?q=${Math.random()}`
    },
    managemembership: {
        template: 'managemembership',
        startingFunction: 'managemembershipActive',
        scriptName: `./js/managemembership.js?q=${Math.random()}`
    },
    savingsproduct: {
        template: 'savingsproduct',
        startingFunction: 'savingsproductActive',
        scriptName: `./js/savingsproduct.js?q=${Math.random()}`
    },
    savingaccount: {
        template: 'savingaccount',
        startingFunction: 'savingaccountActive',
        scriptName: `./js/savingaccount.js?q=${Math.random()}`
    },
    loanfees: {
        template: 'loanfees',
        startingFunction: 'loanfeesActive',
        scriptName: `./js/loanfees.js?q=${Math.random()}`
    },
    loanproduct: {
        template: 'loanproduct',
        startingFunction: 'loanproductActive',
        scriptName: `./js/loanproduct.js?q=${Math.random()}`
    },
    loanaccount: {
        template: 'loanaccount',
        startingFunction: 'loanaccountActive',
        scriptName: `./js/loanaccount.js?q=${Math.random()}`
    },
  loancollateral: {
    template: "loancollateral",
    startingFunction: "loancollateralActive",
    scriptName: `./js/loancollateral.js?q=${Math.random()}`,
  },
  disbursement: {
    template: "disbursement",
    startingFunction: "disbursementActive",
    scriptName: `./js/disbursement.js?q=${Math.random()}`,
  },
  payment: {
    template: "payment",
    startingFunction: "paymentActive",
    scriptName: `./js/payment.js?q=${Math.random()}`,
  },
  managesupplier: {
    template: "managesupplier",
    startingFunction: "managesupplierActive",
    scriptName: `./js/managesupplier.js?q=${Math.random()}`,
  },
  purchaseorder: {
    template: "purchaseorder",
    startingFunction: "purchaseorderActive",
    scriptName: `./js/purchaseorder.js?q=${Math.random()}`,
  },
  receivepurchases: {
    template: "receivepurchases",
    startingFunction: "receivepurchasesActive",
    scriptName: `./js/receivepurchases.js?q=${Math.random()}`,
  },
  allocateexpenditure: {
    template: "allocateexpenditure",
    startingFunction: "allocateexpenditureActive",
    scriptName: `./js/allocateexpenditure.js?q=${Math.random()}`,
  },
  serviceorder: {
    template: "serviceorder",
    startingFunction: "serviceorderActive",
    scriptName: `./js/serviceorder.js?q=${Math.random()}`,
  },
  receiveservice: {
    template: "receiveservice",
    startingFunction: "receiveserviceActive",
    scriptName: `./js/receiveservice.js?q=${Math.random()}`},
  rejectedservice: {
    template: "rejectedservice",
    startingFunction: "rejectedserviceActive",
    scriptName: `./js/rejectedservice.js?q=${Math.random()}`},
  payables: {
    template: "payables",
    startingFunction: "payablesActive",
    scriptName: `./js/payables.js?q=${Math.random()}`,
  },
  allpayables: {
    template: "allpayables",
    startingFunction: "allpayablesActive",
    scriptName: `./js/allpayables.js?q=${Math.random()}`,
  },
  supplierpayout: {
    template: "supplierpayout",
    startingFunction: "supplierpayoutActive",
    scriptName: `./js/supplierpayout.js?q=${Math.random()}`,
  },
  reversals: {
    template: "reversals",
    startingFunction: "reversalsActive",
    scriptName: `./js/reversals.js?q=${Math.random()}`,
  },
  viewreversals: {
    template: "viewreversals",
    startingFunction: "viewreversalsActive",
    scriptName: `./js/viewreversals.js?q=${Math.random()}`,
  },
  viewdeletedtransaction: {
    template: "viewdeletedtransaction",
    startingFunction: "viewdeletedtransactionActive",
    scriptName: `./js/viewdeletedtransaction.js?q=${Math.random()}`,
  },
  statementofaccount: {
    template: "statementofaccount",
    startingFunction: "statementofaccountActive",
    scriptName: `./js/statementofaccount.js?q=${Math.random()}`,
  },
  bulktransaction: {
    template: "bulktransaction",
    startingFunction: "bulktransactionActive",
    scriptName: `./js/bulktransaction.js?q=${Math.random()}`,
  },
  collection: {
    template: "collection",
    startingFunction: "collectionActive",
    scriptName: `./js/collection.js?q=${Math.random()}`,
  },
  collectionview: {
    template: "collectionview",
    startingFunction: "collectionviewActive",
    scriptName: `./js/collectionview.js?q=${Math.random()}`,
  },
  buildpropertyitems: {
    template: "buildpropertyitems",
    startingFunction: "buildpropertyitemsActive",
    scriptName: `./js/buildpropertyitems.js?q=${Math.random()}`,
  },
  categoryvaluetimeline: {
    template: "categoryvaluetimeline",
    startingFunction: "categoryvaluetimelineActive",
    scriptName: `./js/categoryvaluetimeline.js?q=${Math.random()}`,
  },
  propertyaccount: {
    template: "propertyaccount",
    startingFunction: "propertyaccountActive",
    scriptName: `./js/propertyaccount.js?q=${Math.random()}`,
  },
  propertyproduct: {
    template: "propertyproduct",
    startingFunction: "propertyproductActive",
    scriptName: `./js/propertyproduct.js?q=${Math.random()}`,
  },
  viewcompositeitems: {
    template: "viewcompositeitems",
    startingFunction: "viewcompositeitemsActive",
    scriptName: `./js/viewcompositeitems.js?q=${Math.random()}`,
  },
  viewpropertyaccount: {
    template: "viewpropertyaccount",
    startingFunction: "viewpropertyaccountActive",
    scriptName: `./js/viewpropertyaccount.js?q=${Math.random()}`,
  },
  maturedpropertyaccounts: {
    template: "maturedpropertyaccounts",
    startingFunction: "maturedpropertyaccountsActive",
    scriptName: `./js/maturedpropertyaccounts.js?q=${Math.random()}`,
  },
  propertytransactionreport: {
    template: "propertytransactionreport",
    startingFunction: "propertytransactionreportActive",
    scriptName: `./js/propertytransactionreport.js?q=${Math.random()}`,
  },
  missedpropertymaturity: {
    template: "missedpropertymaturity",
    startingFunction: "missedpropertymaturityActive",
    scriptName: `./js/missedpropertymaturity.js?q=${Math.random()}`,},
  deposit: {
    template: "deposit",
    startingFunction: "depositActive",
    scriptName: `./js/deposit.js?q=${Math.random()}`,
  },
  managepin: {
    template: "managepin",
    startingFunction: "managepinActive",
    scriptName: `./js/managepin.js?q=${Math.random()}`,
  },
  withdrawal: {
    template: "withdrawal",
    startingFunction: "withdrawalActive",
    scriptName: `./js/withdrawal.js?q=${Math.random()}`,
  },
  cashdeposit: {
    template: "cashdeposit",
    startingFunction: "cashdepositActive",
    scriptName: `./js/cashdeposit.js?q=${Math.random()}`,
  },
  makesales: {
    template: "makesales",
    startingFunction: "makesalesActive",
    scriptName: `./js/makesales.js?q=${Math.random()}`,
  },
  viewmakesales: {
    template: "viewmakesales",
    startingFunction: "viewmakesalesActive",
    scriptName: `./js/viewmakesales.js?q=${Math.random()}`,
  },
  salesanalytics: {
    template: "salesanalytics",
    startingFunction: "salesanalyticsActive",
    scriptName: `./js/salesanalytics.js?q=${Math.random()}`,
  },
  rotaryproduct: {
    template: "rotaryproduct",
    startingFunction: "rotaryproductActive",
    scriptName: `./js/rotaryproduct.js?q=${Math.random()}`,
  },
  rotarysavings: {
    template: "rotarysavings",
    startingFunction: "rotarysavingsActive",
    scriptName: `./js/rotarysavings.js?q=${Math.random()}`,
  },
  addlevel: {
    template: "addlevel",
    startingFunction: "addlevelActive",
    scriptName: `./js/addlevel.js?q=${Math.random()}`,
  },
  guarantor: {
    template: "guarantor",
    startingFunction: "guarantorActive",
    scriptName: `./js/guarantor.js?q=${Math.random()}`,
  },
  employmentrecord: {
    template: "employmentrecord",
    startingFunction: "employmentrecordActive",
    scriptName: `./js/employmentrecord.js?q=${Math.random()}`,
  },
  referee: {
    template: "referee",
    startingFunction: "refereeActive",
    scriptName: `./js/referee.js?q=${Math.random()}`,
  },
  qualification: {
    template: "qualification",
    startingFunction: "qualificationActive",
    scriptName: `./js/qualification.js?q=${Math.random()}`,
  },
  parentguardians: {
    template: "parentguardians",
    startingFunction: "parentguardiansActive",
    scriptName: `./js/parentguardians.js?q=${Math.random()}`,
  },
  query: {
    template: "query",
    startingFunction: "queryActive",
    scriptName: `./js/query.js?q=${Math.random()}`,
  },
  promotiondemotion: {
    template: "promotiondemotion",
    startingFunction: "promotiondemotionActive",
    scriptName: `./js/promotiondemotion.js?q=${Math.random()}`,
  },
  terminationresignation: {
    template: "terminationresignation",
    startingFunction: "terminationresignationActive",
    scriptName: `./js/terminationresignation.js?q=${Math.random()}`,
  },
  suspension: {
    template: "suspension",
    startingFunction: "suspensionActive",
    scriptName: `./js/suspension.js?q=${Math.random()}`,
  },
  leave: {
    template: "leave",
    startingFunction: "leaveActive",
    scriptName: `./js/leave.js?q=${Math.random()}`,
  },
  warning: {
    template: "warning",
    startingFunction: "warningActive",
    scriptName: `./js/warning.js?q=${Math.random()}`,
  },
  monitoringevaluation: {
    template: "monitoringevaluation",
    startingFunction: "monitoringevaluationActive",
    scriptName: `./js/monitoringevaluation.js?q=${Math.random()}`,
  },
  history: {
    template: "history",
    startingFunction: "historyActive",
    scriptName: `./js/history.js?q=${Math.random()}`,
  },
  viewpersonnel: {
    template: "viewpersonnel",
    startingFunction: "viewpersonnelActive",
    scriptName: `./js/viewpersonnel.js?q=${Math.random()}`,
  },
  offlineboard: {
    template: "offlineboard",
    startingFunction: "offlineboardActive",
    scriptName: `./js/offlineboard.js?q=${Math.random()}`,
  },
  404: {
    template: "404",
    startingFunction: "NotFoundActive",
    scriptName: `./js/404.js?q=${Math.random()}`,
  },
  withdrawalrequest: {
    template: "withdrawalrequest",
    startingFunction: "withdrawalrequestActive",
    scriptName: `./js/withdrawalrequest.js?q=${Math.random()}`,
  },
  viewwithdrawalrequest: {
    template: "viewwithdrawalrequest",
    startingFunction: "viewwithdrawalrequestActive",
    scriptName: `./js/viewwithdrawalrequest.js?q=${Math.random()}`,
  },
  approvewithdrawalrequest: {
    template: "approvewithdrawalrequest",
    startingFunction: "approvewithdrawalrequestActive",
    scriptName: `./js/approvewithdrawalrequest.js?q=${Math.random()}`,
  },
  viewwithdrawallog: {
    template: "viewwithdrawallog",
    startingFunction: "viewwithdrawallogActive",
    scriptName: `./js/viewwithdrawallog.js?q=${Math.random()}`,
  },
  addgltransaction: {
    template: "addgltransaction",
    startingFunction: "addgltransactionActive",
    scriptName: `./js/addgltransaction.js?q=${Math.random()}`,
  },
  unauthorized: {
    template: "unauthorized",
    startingFunction: "unauthorizedActive",
    scriptName: `./js/unauthorized.js?q=${Math.random()}`,
  },
  events: {
    template: "events",
    startingFunction: "eventsActive",
    scriptName: `./js/events.js?q=${Math.random()}`,
  },
  meetingboard: {
    template: "meetingboard",
    startingFunction: "meetingboardActive",
    scriptName: `./js/meetingboard.js?q=${Math.random()}`,
  },
  adminboard: {
    template: "adminboard",
    startingFunction: "adminboardActive",
    scriptName: `./js/adminboard.js?q=${Math.random()}`,
  },
  changebranch: {
    template: "changebranch",
    startingFunction: "changebranchActive",
    scriptName: `./js/changebranch.js?q=${Math.random()}`,
  },
};

const ext = `.html?q=${Math.random()}`;

function routerEvent(route) {
  if (route) {
    let queryParams = `?r=${route}`;
    window.history.pushState(
      queryParams,
      undefined,
      `${window.origin.concat(window.location.pathname, queryParams)}`
    );
    resolveUrlPage();
    if (!isDeviceMobile()) toggleNavigation();
  }
}

function resolveUrlPage() {
  let searchParams = new URLSearchParams(window.location.search);
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user) {
    console.log('User not found, redirecting to login');
    window.location.href = './login.html';
    return;
  }

  // navitem-child text-[#292929] navitem-child-active

  let page = searchParams.get("r");
  //  let perm = document.getElementsByClassName('navitem-child-active')[0]?.textContent.trim().toLowerCase();
  //  console.log('perm', perm);
  //  console.log('perm', !checkpermission(perm));
  //  if (page && !checkpermission(perm) && page != 'unauthorized' && page != 'dashboard' ) {
  //   if(!perm)return;
  //   console.log(`User does not have permission to view ${page}, redirecting to unauthorized page`);
  //   did('unauthorized').click()
  //   return;
  // }

  
  if (searchParams.has("r")) {
    let page = routerTree[searchParams.get("r").trim()].template; 
    document.getElementsByTagName('title')[0].textContent = `GXT | ${page}`;
    openRoute(page + ext);
  } else {
    // open home default page
    let queryParams = `?r=profile`;
    window.history.pushState(
      queryParams,
      undefined,
      `${window.origin.concat(window.location.pathname, queryParams)}`
    );
    openRoute("profile" + ext);
  }
  showActiveRoute();
}

function showActiveRoute() {
  let searchParams = new URLSearchParams(window.location.search);
  let page = searchParams.get("r");
  let menu = document.getElementById(page);
  document
    .querySelectorAll("#navigation .active")
    .forEach((item) => item.classList.remove("active"));
    document
    .querySelectorAll("#navigation .navitem-child-active")
    .forEach((item) => item.classList.remove("navitem-child-active"));
  if (menu?.classList.contains("navitem-child")) {
    menu.classList.add("navitem-child-active");
    menu.parentElement.previousElementSibling.classList.add("active");
  } else menu?.classList.add("active");
}

function showVideo(videoUrl) {
  if(videoUrl == 'null') return notification('Video not ready yet', 0);
  Swal.fire({
    html: `<div id='video-container' style='position:fixed; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center;'>
             <div class='loader'></div>
           </div>`,
    showCloseButton: true,
    showConfirmButton: false,
    width: '100%',
    height: '100%',
    customClass: { 
      popup: 'fullscreen-modal',
      closeButton: 'swal2-close-button-red'
    },
    allowOutsideClick: false,
    didOpen: () => {
      const iframe = document.createElement('iframe');
      iframe.src = videoUrl;
      iframe.frameBorder = '0';
      iframe.allowFullscreen = true;
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.display = 'none'; // Initially hide the iframe
      iframe.onload = () => {
        document.querySelector('.loader').style.display = 'none'; // Hide loader
        iframe.style.display = 'block'; // Show iframe
      };
      document.getElementById('video-container').appendChild(iframe);
    }
  });
}

// Add custom CSS for the red close button
const style = document.createElement('style');
style.innerHTML = `
  .swal2-close-button-red {
    color: white;
    background-color: red;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
`;
document.head.appendChild(style);

function showFullDescription(title) {
  Swal.fire({
    title: 'Full Description',
    text: title,
    icon: 'info',
    confirmButtonColor: '#3085d6'
  });
}

function showMissingTitleAlert() {
  Swal.fire({
    title: 'Missing Title',
    text: 'Unable to display specific information as the title attribute is missing.',
    icon: 'warning',
    confirmButtonColor: '#3085d6'
  });
}

function showSettings(title, video, page) {
  console.log('Title:', title);
  console.log('Video URL:', video);
  console.log('Page:', page);
  if(!checkpermission('UPDATE INFO')){
    Swal.fire({
      title: 'Missing Permissions',
      text: 'You do not have the required permissions to view this page.',
      icon: 'warning',
      confirmButtonColor: '#3085d6'
    });
    return;
  }
  Swal.fire({
    title: 'Settings',
    html: `
      <form id="settingsForm" class="mx-auto max-w-lg space-y-6">
        <div class="space-y-4">
          <label for="titleInput" class="block text-xl font-semibold text-gray-800">Title</label>
          <textarea id="titleInput" class="sm:text-md block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Title">${title??''}</textarea>
        </div>
        <div class="space-y-4">
          <label for="videoInput" class="block text-xl font-semibold text-gray-800">Video Link</label>
          <textarea id="videoInput" class="sm:text-md block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Video Link">${video=='undefined'? '' : video}</textarea>
        </div>
      </form>
    `,
    confirmButtonText: 'Update Settings',
    preConfirm: async () => {
      const updatedTitle = document.getElementById('titleInput').value;
      const updatedVideo = document.getElementById('videoInput').value;
      const formData = new FormData(); 
      formData.append('description', updatedTitle);
      formData.append('link', updatedVideo);
      formData.append('location', page);

      Swal.showLoading(); // Show loading state

      try {
        const result = await httpRequest2('api/v1/video', formData, null, 'json', 'POST');
        console.log('result', result)
        if (!result.status) {
          throw new Error(result.message || 'Failed to update settings');
        }
        Swal.fire({
          title: 'Success',
          text: 'Settings updated successfully!',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
        console.log('Settings updated successfully:', result);
        getVideoDescription(page, 'force');
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
      }
    },
    confirmButtonColor: '#1D72B8',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    cancelButtonColor: '#B0B0B0',
    width: '500px',
    padding: '20px'
  });
}

const videoCache = {};

async function getVideoDescription(location, force=false) {
  const currentTime = new Date().getTime();

  // Reset the cache if force is true
  if (force) {
    delete videoCache[location];
  }

  // Check if the location is in the cache and if it's not older than 30 minutes
  if (videoCache[location] && (currentTime - videoCache[location].timestamp < 30 * 60 * 1000)) {
    return videoCache[location].data;
  }

  try {
    const result = await httpRequest2('api/v1/video?location=' + location, null, null, 'json', 'GET');
    if (!result.data.length) {
      videoCache[location] = {
        data: { link: '', description: '' },
        timestamp: currentTime
      };
    }else{
      // Store the result in the cache with the current timestamp
      videoCache[location] = {
        data: { link: result.data[0].link??'', description: result.data[0].description??'' },
        timestamp: currentTime
      };
    }


    if(force)document.getElementById(location).click();

    return videoCache[location].data;
  } catch (error) {
    console.error('Error fetching video data:', error);
  }
}

async function openRoute(url) {
  try {
    // Show skeleton loading
    document.getElementById("workspace").innerHTML = `
      <div class="skeleton-loader">
        <div class="skeleton-header"></div>
        <div class="skeleton-content"></div>
        <div class="skeleton-footer"></div>
      </div>
    `;
    
    document.getElementById("workspace").innerHTML = await httpRequest(url);
    // Get the search parameters from the URL
    let searchParams = new URLSearchParams(window.location.search);
    let page = searchParams.get("r");
    let alldesc = await getVideoDescription(page);

    console.log('alldesc', alldesc);

    // Ensure `page` is not null and the element exists
    if (page) {
      let pageElement = document.getElementById(page);
      if (pageElement) {
        // Create a new div element for the alert
        let el = document.createElement("div");
        el.classList.add(
          "p-4",
          "my-4",
          "text-sm",
          "text-blue-800",
          "rounded-lg",
          "bg-blue-50"
        );
        el.setAttribute("role", "alert");

        // Get the title attribute of the page element, if it exists
        let title = alldesc.description;
        let video = alldesc.link??"";

        console.log('inserting, title: ', title, 'video: ', video);

        if (title) {
          const truncatedTitle = title.split(" ").slice(0, 10).join(" ") + (title.split(" ").length > 10 ? "..." : "");
          el.innerHTML = `
            <div class="flex flex-col items-center gap-2 md:flex-row">
              <p class="text-center font-medium md:text-left">Description: <br/></p> 
              <div class="flex-1 text-center md:text-left">
                <p class="cursor-pointer text-gray-600" onclick="showFullDescription('${title}')">${truncatedTitle}</p>
              </div>
              <div class="mt-2 flex gap-2 md:mt-0 md:flex-row">
                <button onclick="document.getElementById('${page}').click()" type="button" class="btn flex scale-[0.88] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-700 px-4 py-2 text-white shadow-md transition duration-300 ease-in-out hover:from-red-600 hover:to-red-800 hover:shadow-lg">
                  <span class="material-icons">refresh</span>
                  <span class="hidden md:inline">Reset</span> 
                </button>
                <button type="button" class="flex scale-[0.88] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-white shadow-md transition duration-300 ease-in-out hover:from-blue-600 hover:to-blue-800 hover:shadow-lg" onclick="showVideo('${video}')">
                  <span class="material-icons">play_circle_filled</span>
                  <span class="hidden md:inline">Watch Tutorial</span>
                </button>
                <button type="button" class="${!checkpermission('UPDATE INFO') ? 'hidden' : ''} scale-[0.88] bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-800 transition duration-300 ease-in-out flex items-center justify-center gap-2 px-4 py-2" onclick="showSettings('${title}', '${video}', '${page}')">
                  <span class="material-icons">settings</span>
                  <span class="hidden md:inline">Settings</span>
                </button>
              </div>
            </div>`;
        } else {
          el.innerHTML = `
            <div class="flex flex-col items-center gap-2 md:flex-row">
              <p class="text-center font-medium md:text-left">Note!<br/></p> 
              <div class="flex-1 text-center md:text-left">
                <p class="cursor-pointer text-gray-600" onclick="showMissingTitleAlert()">Title attribute is missing.</p>
              </div>
              <div class="mt-2 flex gap-2 md:mt-0 md:flex-row">
                <button onclick="document.getElementById('${page}').click()" type="button" class="btn flex scale-[0.88] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-700 px-4 py-2 text-white shadow-md transition duration-300 ease-in-out hover:from-red-600 hover:to-red-800 hover:shadow-lg">
                  <span class="material-icons">refresh</span>
                  <span class="hidden md:inline">Reset</span> 
                </button>
                <button type="button" class="flex scale-[0.88] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-white shadow-md transition duration-300 ease-in-out hover:from-blue-600 hover:to-blue-800 hover:shadow-lg" onclick="showVideo('${video}')">
                  <span class="material-icons">play_circle_filled</span>
                  <span class="hidden md:inline">Watch Tutorial</span>
                </button>
                <button type="button" class="${!checkpermission('UPDATE INFO') ? 'hidden' : ''} scale-[0.88] bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-800 transition duration-300 ease-in-out flex items-center justify-center gap-2 px-4 py-2" onclick="showSettings('', '${video}', '${page}')">
                  <span class="material-icons">settings</span>
                  <span class="hidden md:inline">Settings</span>
                </button>
              </div>
            </div>`;
        }

        // Prepend the alert element to the workspace
        document.getElementById("workspace").prepend(el);
      } else {
        console.error(`Element with ID '${page}' not found.`);
      }
    } else {
      console.error('Parameter "r" is missing from the URL.');
    }

    intializePageJavascript();
  } catch (error) {
    console.log(error);
  }
}

let timer;

function intializePageJavascript() {
  let searchParams = new URLSearchParams(window.location.search);
  let startingFunction =
    routerTree[searchParams.get("r").trim()].startingFunction;
  try {
    clearInterval(timer);
    timer = null;
    timer = setTimeout(() => window?.[startingFunction]?.(), 1000);
  } catch (e) {}
}

Object.freeze(routerTree);
