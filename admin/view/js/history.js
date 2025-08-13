let historyid;
async function historyActive() {
  historyid = '';
  datasource = [];

  const viewPersonnelActionid = localStorage.getItem('viewPersonnelActionid');

  if (viewPersonnelActionid) {
    await fetchhistory(viewPersonnelActionid); 
  }

  const form = document.querySelector('#viewhistory');
  const userIdInput = document.querySelector('#userid');
  
  if (form.querySelector('#submit')) {
    form.querySelector('#submit').addEventListener('click', () => {
      const userIdValue = userIdInput.value;
      if (userIdValue) {
         fetchhistory(userIdValue);
      } else {
        notification('Please select a user', 0);
      }
    });
  }
  
  await getAllUsers('userid', 'name');

  await new TomSelect('#userid', {
    plugins: ['dropdown_input'],
    onInitialize: function () {
      if (!checkpermission('FILTER ALL USERS')) this.setValue(the_user.id);
      if (!checkpermission('FILTER ALL USERS')) this.disable();
      if (viewPersonnelActionid) this.setValue(viewPersonnelActionid);
      if (viewPersonnelActionid) this.disable();
    }
  });

  localStorage.clear()
}

async function fetchhistory(id) {
  // Show loading state using SweetAlert
  const loadingAlert = Swal.fire({
    title: 'Please wait...',
    text: 'Fetching history data, please wait.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  let request = await httpRequest2(`api/v1/personnel/history?${id ? `userid=${id}` : ""}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
  swal.close(); // Close the loading alert once the request is complete
  
  if (request.status) {
    if (Object.keys(request.data).length) {
      datasource = request.data;
      displayUserHistory();
    }
  } else {
    return notification('No records retrieved');
  }
}

function displayUserHistory() {
  const userHistoryDiv = document.querySelector('#userHistory');
  
  if (datasource.length === 0) {
    userHistoryDiv.innerHTML = "<p>No history found for this user.</p>";
    return;
  }

  // Constructing HTML for user information
  let userHistoryHTML = '';

  const fieldLabels = {
    id: "User ID",
    firstname: "First Name",
    lastname: "Last Name",
    othernames: "Other Names",
    image: "Profile Picture",
    email: "Email",
    phone: "Phone Number",
    country: "Country",
    state: "State",
    emailverified: "Email Verified",
    address: "Home Address",
    role: "User Role",
    permissions: "Permissions",
    userpermissions: "User Permissions",
    officeaddress: "Office Address",
    gender: "Gender",
    occupation: "Occupation",
    lga: "Local Government Area",
    town: "Town/City",
    maritalstatus: "Marital Status",
    spousename: "Spouse Name",
    stateofresidence: "State of Residence",
    lgaofresidence: "LGA of Residence",
    nextofkinfullname: "Next of Kin Full Name",
    nextofkinphone: "Next of Kin Phone",
    nextofkinrelationship: "Next of Kin Relationship",
    nextofkinaddress: "Next of Kin Address",
    nextofkinofficeaddress: "Next of Kin Office Address",
    nextofkinoccupation: "Next of Kin Occupation",
    dateofbirth: "Date of Birth",
    branch: "Branch",
    registrationpoint: "Registration Point",
    dateadded: "Date Added",
    lastupdated: "Last Updated",
    status: "Account Status",
    createdby: "Created By",
    level: "User Level",
    levelname: "Level Name",
    image2: "Image 2"
  };

  userHistoryHTML += `
      <h3 class="font-bold text-lg mb-4">User Information</h3>
      <div class="table-content">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th class="text-left p-2 border-b">Field</th>
              <th class="text-left p-2 border-b">Value</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(datasource.user).map(([key, value]) => {
                // Use the mapped field name if available, otherwise format dynamically
                let formattedKey = fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
                formattedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1); // Capitalize first letter

                // Special handling for date fields
                if (key.includes("date") && value) {
                    value = formatDate(value.split("T")[0]);
                }

                // Special handling for image fields
                if (key.includes("image") && value) {
                    return `
                        <tr>
                            <td class="p-2 border-b font-medium">${formattedKey}</td>
                            <td class="p-2 border-b">
                                <img src="${value}" alt="${formattedKey}" class="w-32 h-32 rounded-md">
                            </td>
                        </tr>
                    `;
                }

                return `<tr><td class="p-2 border-b font-medium">${formattedKey}</td><td class="p-2 border-b">${value || 'N/A'}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
  `;


  const fieldLabels2 = {
      // Guarantor Fields
      guarantorname: "Guarantor Name",
      guarantoroccupation: "Guarantor Occupation",
      guarantorphone: "Guarantor Phone",
      yearsknown: "Years Known",
      guarantorofficeaddress: "Guarantor Office Address",
      guarantorresidentialaddress: "Guarantor Residential Address",
      imageone: "Guarantor Image 1",
      imagetwo: "Guarantor Image 2",

      // Employment Record Fields
      employer: "Employer",
      position: "Job Position",
      years: "Years Worked",
      reasonofleaving: "Reason for Leaving",
      doc: "Employment Document",

      // Referee Fields
      refereename: "Referee Name",
      refereeoccupation: "Referee Occupation",
      refereephone: "Referee Phone",
      refereeyearsknown: "Years Known",
      relationship: "Relationship",
      refereeofficeaddress: "Referee Office Address",
      refereeresidentialaddress: "Referee Residential Address",
      imageone: "Referee Image 1",
      imagetwo: "Referee Image 2",

      // Qualification Fields
      institution: "Institution",
      qualification: "Degree/Qualification",
      certificationdate: "Certification Date",
      imageone: "Certificate Image 1",
      imagetwo: "Certificate Image 2",

      // General Fields
      dateadded: "Date Added",
      status: "Status",

      // Parent/Guardian Fields
      parentonename: "Guardian 1 Name",
      parentoneoccupation: "Guardian 1 Occupation",
      parentonestate: "Guardian 1 State",
      parentoneofficeaddress: "Guardian 1 Office Address",
      parentonephone: "Guardian 1 Phone",
      parenttwoname: "Guardian 2 Name",
      parenttwooccupation: "Guardian 2 Occupation",
      parenttwoofficeaddress: "Guardian 2 Office Address",
      parenttwostate: "Guardian 2 State",
      parenttwophone: "Guardian 2 Phone",
      homeaddress: "Home Address",
      parentoneimage: "Guardian 1 Image",
      parenttwoimage: "Guardian 2 Image",

      // Query Fields
      query: "Query Description",
      imageone: "Query Image",

      // Promotion/Demotion Fields
      title: "Title",
      level: "Level",
      type: "Type",
      image: "Image",
      startdate: "Start Date",
      enddate: "End Date",
      level: "User Level",
      description: "Description",
      basicsalary: "Base Salary",
      
      // Allowances and Deductions
      allowances: "Allowances",
      allowance: "Allowance Amount",
      allowancetype: "Allowance Type",
      deductions: "Deductions",
      deduction: "Deduction Amount",
      deductiontype: "Deduction Type",

      // General Fields
      dateadded: "Date Added",
      createdby: "Created By",
      status: "Status"
  };

  // Function to generate HTML for sections
  const generateSectionHTML = (title, data, fields) => {
    if (data && data.length > 0) {
        let sectionHTML = `
            <h3 class="font-bold text-lg mt-8 mb-4">${title}</h3>
            <div class="table-content">
              <table class="table-auto w-full">
              <thead><tr><th class="text-left p-2 border-b">Field</th><th class="text-left p-2 border-b">Value</th></tr></thead>
              <tbody>`;

        data.forEach(item => {
            fields.forEach(field => {
                let fieldValue = item[field];

                // Use readable label, or format field dynamically if not found
                let formattedKey = fieldLabels2[field] || field.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
                formattedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);

                // Format dates properly
                if (field.includes('date') && fieldValue) {
                    fieldValue = formatDate(fieldValue.split("T")[0]);
                }

                // Display images with labels
                if ((field.includes('image') || field.includes('doc')) && fieldValue) {
                    sectionHTML += `
                        <tr>
                            <td class="p-2 border-b font-medium">${formattedKey}</td>
                            <td class="p-2 border-b">
                                <img src="${fieldValue}" class="w-32 h-32 rounded-md shadow-md" alt="${formattedKey}">
                            </td>
                        </tr>
                    `;
                }  else {
                    sectionHTML += `
                        <tr>
                            <td class="p-2 border-b font-medium">${formattedKey}</td>
                            <td class="p-2 border-b">${fieldValue || 'N/A'}</td>
                        </tr>
                    `;
                }
            });
        });

        sectionHTML += `</tbody></table></div>`;
        return sectionHTML;
    }
    return '';
  };

   // Function to format field names for better readability
   function formatFieldName(field) {
    return fieldLabels2[field] || field.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
  }

   // Function to generate tables dynamically based on API response for the tables that have multiple titles
   function generateDynamicTable(title, data) {
    if (!data || data.length === 0) return '';

    // Extract unique keys from the first data object
    const headers = Object.keys(data[0]);

    let sectionHTML = `
      <h3 class="font-bold text-lg mt-8 mb-4">${title}</h3>
      <div class="table-content">
        <table class="table-auto w-full">
          <thead>
            <tr>
              ${headers.map(header => `<th class="text-left p-2 border-b">${formatFieldName(header)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                ${headers.map(header => {
                  let value = item[header] || 'N/A';
                  
                  // Format date fields
                  if (header.includes("date")) {
                    value = formatDate(value.split("T")[0]);
                  }

                  // Display images properly
                  if (header.includes("image") && value !== 'N/A') {
                    return `<td class="p-2 border-b"><img src="${value}" class="w-32 h-32 rounded-md shadow-md" alt="${formatFieldName(header)}"></td>`;
                  }

                  return `<td class="p-2 border-b">${value}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    return sectionHTML;
  }

  userHistoryHTML += generateSectionHTML('Guarantor Information', datasource.guarantor, ['guarantorname', 'guarantoroccupation', 'guarantorphone', 'yearsknown', 'guarantorofficeaddress', 'guarantorresidentialaddress', 'imageone', 'imagetwo']);
  userHistoryHTML += generateSectionHTML('Employment Record', datasource.employmentrecord, ['employer', 'position', 'years', 'reasonofleaving', 'doc']);
  userHistoryHTML += generateSectionHTML('Referee Information', datasource.referee, ['refereename', 'refereeoccupation', 'refereephone', 'refereeyearsknown', 'relationship', 'refereeofficeaddress', 'refereeresidentialaddress', 'imageone', 'imagetwo']);
  userHistoryHTML += generateSectionHTML('Qualification Information', datasource.qualification, ['institution', 'qualification', 'certificationdate', 'imageone', 'imagetwo']);
  userHistoryHTML += generateSectionHTML('Parent/Guardian Information', datasource.parentguardians, ['parentonename', 'parentoneoccupation', 'parentonestate', 'parentoneofficeaddress', 'parentonephone', 'parenttwoname', 'parenttwooccupation', 'parenttwoofficeaddress', 'parenttwostate', 'parenttwophone', 'homeaddress', 'parentoneimage', 'parenttwoimage']);

  userHistoryHTML += generateDynamicTable('Query Information', datasource.query);
  userHistoryHTML += generateDynamicTable('Promotion/Demotion Information', datasource.promotiondemotion);
  userHistoryHTML += generateDynamicTable('Termination/Resignation Information', datasource.terminationresignation);
  userHistoryHTML += generateDynamicTable('Suspension Information', datasource.suspension);
  userHistoryHTML += generateDynamicTable('Leave Information', datasource.leave);
  userHistoryHTML += generateDynamicTable('Warning Information', datasource.warning);
  userHistoryHTML += generateDynamicTable('Monitoring & Evaluation Information', datasource.monitoringevaluation);

  if (datasource.level && datasource.level.length > 0) {
    datasource.level.forEach(level => {
      userHistoryHTML += `<h3 class="font-bold text-lg mb-4 mt-8">Level Information</h3><div class="table-content"><table class="table-auto w-full"><thead><tr><th class="text-left p-2 border-b">Field</th><th class="text-left p-2 border-b">Value</th></tr></thead><tbody>`;
      userHistoryHTML += `
        <tr><td class="p-2 border-b font-medium">Level</td><td class="p-2 border-b">${level.level || 'N/A'}</td></tr>
        <tr><td class="p-2 border-b font-medium">Description</td><td class="p-2 border-b">${level.description || 'N/A'}</td></tr>
        <tr><td class="p-2 border-b font-medium">Basic Salary</td><td class="p-2 border-b">${formatCurrency(level.basicsalary) || 'N/A'}</td></tr>
      `;
      if (level.allowances && level.allowances.length > 0) {
        userHistoryHTML += `<tr><td class="p-2 border-b font-medium">Allowances</td><td class="p-2 border-b">`;
        level.allowances.forEach(allowance => {
          userHistoryHTML += `${allowance.allowancetype == 'PERCENTAGE' ? allowance.allowance + '%' : formatCurrency(allowance.allowance)} (${allowance.allowancetype}), `;
        });
        userHistoryHTML = userHistoryHTML.slice(0, -2); // Remove trailing comma and space
        userHistoryHTML += `</td></tr>`;
      }
      if (level.deductions && level.deductions.length > 0) {
        userHistoryHTML += `<tr><td class="p-2 border-b font-medium">Deductions</td><td class="p-2 border-b">`;
        level.deductions.forEach(deduction => {
          userHistoryHTML += `${formatCurrency(deduction.deduction)} (${deduction.deductiontype}), `;
          userHistoryHTML += `${deduction.deductiontype == 'PERCENTAGE' ? deduction.deduction + '%' : formatCurrency(deduction.deduction)} (${deduction.deductiontype}), `;
        });
        userHistoryHTML = userHistoryHTML.slice(0, -2); // Remove trailing comma and space
        userHistoryHTML += `</td></tr>`;
      }
      userHistoryHTML += `</tbody></table></div>`;
    });
  }

  // Display the HTML content
  userHistoryDiv.innerHTML = userHistoryHTML;
}