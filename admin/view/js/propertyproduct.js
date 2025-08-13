let propertyproductid;
async function propertyproductActive() {
    propertyproductid = '';
    const form = document.querySelector('#propertyproductform');
    const form2 = document.querySelector('#filterviewpropertyproduct');
    if (form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', propertyproductFormSubmitHandler);
    if (form2 && form2.querySelector('#querySubmit')) form2.querySelector('#querySubmit').addEventListener('click', () => fetchpropertyproduct());

    datasource = [];
    await fetchpropertyproduct();
    Promise.all([
        getallmemberships("membership"),
        getAllUsers("productofficer", "name"),
    ])
    .then(() => {
        // All promises resolved
        new TomSelect("#membership", {
            plugins: ["dropdown_input", "remove_button"],
        });
        new TomSelect("#productofficer", {
            plugins: ["dropdown_input"],
        });
    })
    .catch((error) => {
        console.error("Error in fetching data:", error);
    });
}

async function fetchpropertyproduct(id = null) {
    // Show loading state using SweetAlert
    const loadingAlert = Swal.fire({
        title: 'Please wait...',
        text: 'Fetching propertyproduct data, please wait.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    let form = document.querySelector('#filterviewpropertyproduct');
    let formData = new FormData(form);
    let queryParams = new URLSearchParams(formData).toString();

    if (!id) document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`;

    console.log("ID", id);
    let request = await httpRequest2(`api/v1/property/product?${queryParams}${id ? `&id=${id}` : ''}`, null, document.querySelector('#viewrequisitionform #submit'), 'json', 'GET');
    swal.close(); // Close the loading alert once the request is complete
    if (!id) document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`;
    if (request.status) {
        if (!id) {
            if (request.data.length) {
                datasource = request.data;
                resolvePagination(datasource, onpropertyproductTableDataSignal);
            }
        } else {
            document.getElementsByClassName('updater')[0].click();
            propertyproductid = request.data[0].id;
            populateData(request.data[0]);
        }
    } else {
        return notification('No records retrieved');
    }
}

async function removepropertyproduct(id) {
    // Ask for confirmation using SweetAlert with async and loader
    const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            function getparamm() {
                let paramstr = new FormData();
                paramstr.append('id', id);
                return paramstr;
            }

            let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json');
            return request;
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    // Show notification based on the result
    if (confirmed.isConfirmed) {
        fetchpropertyproduct();
        return notification(confirmed.value.message);
    }
}

async function onpropertyproductTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.product}</td>
        <td>${item.description}</td>
        <td>
        <ul>
        ${item.membername && item.membername.split(',').map(name => `<li>${name.trim()}</li>`).join('')}
        </ul>
        </td>
        <td>${item.status}</td>
        <td>${formatDate(item.dateadded.split("T")[0])}</td>
        <td>${item.productofficername}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchpropertyproduct('${item.id}')" class="material-symbols-outlined h-8 w-8 rounded-full bg-primary-g text-xs text-white drop-shadow-md" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="removepropertyproduct('${item.id}')" class="material-symbols-outlined hidden h-8 w-8 rounded-full bg-red-600 text-xs text-white drop-shadow-md" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('');
    injectPaginatatedTable(rows);
}

async function propertyproductFormSubmitHandler() {
    if (!validateForm('propertyproductform', getIdFromCls('comp'))) return;

    let payload = getFormData2(
        document.querySelector("#propertyproductform"),
        propertyproductid
            ? [
                ["id", propertyproductid],
                ["member", getmultivalues("membership", "||")],
            ]
            : [
                ["member", getmultivalues("membership", "||")],
            ]
    );

    const confirmed = await Swal.fire({
        title: propertyproductid ? "Updating..." : "Submitting...",
        text: "Please wait while we submit your data.",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let request = await httpRequest2(
                "api/v1/property/product",
                payload,
                document.querySelector("#propertyproductform #submit"),
                "json",
                "POST"
            );
            Swal.close();

            if (request.status) {
                notification("Success!", 1);
                const form = document.querySelector("#propertyproductform");
                form.reset();
                if (propertyproductid)
                    form
                        .querySelectorAll("input, select, textarea")
                        .forEach((input) => (input.value = ""));
                propertyproductid = "";
                document.getElementsByClassName("viewer")[0].click();
                fetchpropertyproduct();
            } else {
                notification(request.message, 0);
            }
        },
    });
}