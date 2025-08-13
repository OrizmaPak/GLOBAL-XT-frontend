let admindashboardglnetassetid;
let accountTomSelect;

async function admindashboardglnetassetActive() {
    admindashboardglnetassetid = '';
    datasource = [];
    await fetchAccounts(); 

    if(document.querySelector('#accountSubmit')){
        document.querySelector('#accountSubmit').addEventListener('click', async () => {
            submitAccounts()
        });
    }

    accountTomSelect = new TomSelect('#accounts', {
        plugins: ['remove_button', 'dropdown_input'],
    });
}

async function fetchAccounts() {
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching accounts data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    let request = await httpRequest2('api/v1/dashboard/gllist', null, null, 'json', 'GET');
    Swal.close(); // Close the loading alert once the request is complete

    if (request.status) {
        const accountsSelect = document.querySelector('#accounts');
        accountsSelect.innerHTML = ''; // Clear existing options
        request.data.forEach(account => {
            const option = document.createElement('option');
            option.value = account.key; // Assuming account has an 'id' property
            option.textContent = account.accountName; // Assuming account has a 'name' property
            accountsSelect.appendChild(option);
        });
        // Re-initialize TomSelect to reflect the new options
       
    } else {
        notification('Failed to fetch accounts', 0);
    }
}

async function submitAccounts() {
    const resultContainer = document.getElementById('resultContainer'); // Container for all results
    resultContainer.innerHTML = ''; // Clear previous results

    const selectedAccounts = accountTomSelect.getValue(); // Get selected account keys

    if (selectedAccounts.length === 0) {
        Swal.fire({
            title: 'No Accounts Selected',
            text: 'Please select at least one account to proceed.',
            icon: 'warning',
            confirmButtonText: 'Close',
            customClass: {
                popup: 'bg-white rounded-2xl p-6 shadow-2xl',
            },
            confirmButtonColor: '#3085d6',
        });
        return; // Exit if no accounts are selected
    }

    const keys = selectedAccounts.join(','); // Concatenate keys with commas
    const currentYear = new Date().getFullYear(); // Get the current year

    // Build header HTML with the year select dropdown
    const headerHtml = `
        <div class="mb-4 flex justify-end">
            <select id="yearSelect" class="form-controls p-4">
                ${Array.from({ length: 11 }, (_, i) => {
                    const yearOption = currentYear - 5 + i; // Options for 5 years back and 5 years forward
                    return `<option value="${yearOption}" ${yearOption === currentYear ? 'selected' : ''}>${yearOption}</option>`;
                }).join('')}
            </select>
        </div>
    `;

    // Insert header HTML and a placeholder for the report
    resultContainer.innerHTML = headerHtml + `<div id="reportContent"></div>`;

    const yearSelect = document.getElementById('yearSelect');
    const reportContent = document.getElementById('reportContent');

    // Function to fetch and render the report for a given year
    async function fetchAndRenderReport(year) {
        const endpoint = `api/v1/dashboard/gltotalassets?keys=${keys}&year=${year}`;
        const loadingAlert = Swal.fire({
            title: 'Please wait...',
            text: 'Submitting selected accounts, please wait.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        let request = await httpRequest2(endpoint, null, null, 'json', 'GET');
        Swal.close(); // Close the loading alert once the request is complete

        if (request.status) {
            notification('Successfully submitted!', 1);
            const assetsData = request.data;

            // Build the report HTML with one column for Month
            let reportHtml = `
                <div class="table-content my-4">
                    <h3 class="bg-white py-4 text-center text-lg font-bold">Assets Data for ${assetsData.year}</h3>
                    <table class="w-full table-auto">
                        <thead>
                            <tr>
                                <!-- Single month column -->
                                <th rowSpan="2">Month</th>
                                <!-- One set of three sub-columns for each product -->
                                ${assetsData.details.map(account => `
                                    <th colSpan="3">${account.accountName}</th>
                                `).join('')}
                                <!-- And finally, three columns for Overall Monthly -->
                                <th colSpan="3">Overall Monthly</th>
                            </tr>
                            <tr>
                                <!-- Sub-headers for each product -->
                                ${assetsData.details.map(() => `
                                    <th>Credit</th>
                                    <th>Debit</th>
                                    <th>Balance</th>
                                `).join('')}
                                <!-- Sub-headers for Overall Monthly -->
                                <th>Credit</th>
                                <th>Debit</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            // Use overallMonthly as the source of month keys
            const months = Object.keys(assetsData.overallMonthly);
            months.forEach(month => {
                reportHtml += `
                    <tr>
                        <td>${month.charAt(0).toUpperCase() + month.slice(1)}</td>
                `;
                // For each account, output its monthly credit/debit/balance
                assetsData.details.forEach(account => {
                    const monthlyValues = account.monthlyData[month] || { credit: 0, debit: 0, balance: 0 };
                    reportHtml += `
                        <td class="text-green-400">${formatCurrency(monthlyValues.credit)}</td>
                        <td class="text-red-500">${formatCurrency(monthlyValues.debit)}</td>
                        <td class="text-black">${formatCurrency(monthlyValues.balance)}</td>
                    `;
                });
                // Output overall monthly totals for the month
                const totalValues = assetsData.overallMonthly[month];
                reportHtml += `
                        <td style="color: ${totalValues.credit < 0 ? 'red' : 'green'};">${formatCurrency(totalValues.credit)}</td>
                        <td style="color: ${totalValues.debit < 0 ? 'red' : 'green'};">${formatCurrency(totalValues.debit)}</td>
                        <td style="color: ${totalValues.balance < 0 ? 'red' : 'green'};">${formatCurrency(totalValues.balance)}</td>
                    </tr>
                `;
            });

            // Final Balance row
            reportHtml += `
                <tr class="border border-t border-[#2C2C2C]">
                    <td>Final Balance</td>
            `;
            assetsData.details.forEach(account => {
                reportHtml += `
                    <td colSpan="3" style="color: ${account.finalBalance < 0 ? 'red' : 'green'};">
                        ${formatCurrency(account.finalBalance)}
                    </td>
                `;
            });
            reportHtml += `<td colSpan="3"></td></tr>`;

            // Balance Brought Forward row
            reportHtml += `
                <tr>
                    <td>Balance Brought Forward</td>
            `;
            assetsData.details.forEach(account => {
                reportHtml += `
                    <td colSpan="3" style="color: ${account.balance_brought_forward < 0 ? 'red' : 'green'};">
                        ${formatCurrency(account.balance_brought_forward)}
                    </td>
                `;
            });
            reportHtml += `<td colSpan="3"></td></tr>`;

            // Close the table and display Grand Total Balance
            reportHtml += `
                        </tbody>
                    </table>
                    <p class="bg-white py-4 text-center font-bold">
                        Grand Total Balance: ${formatCurrency(assetsData.grandTotalBalance)}
                    </p>
                </div>
            `;

            // Update only the report content so that the header remains intact
            reportContent.innerHTML = reportHtml;
        } else {
            notification('Failed to submit accounts', 0);
        }
    }

    // Initial fetch for the default/current year
    await fetchAndRenderReport(yearSelect.value);

    // Attach event listener to the year select to re-run the endpoint call on change
    yearSelect.addEventListener("change", async () => {
        const selectedYear = yearSelect.value; // get the new selected year
        await fetchAndRenderReport(selectedYear);
    });
}

