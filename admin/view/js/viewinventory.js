let viewinventoryid
let initialinventoryload
let quill1
let quill2
let quill3
async function viewinventoryActive() {
    quill1 = new Quill('#description-editor', {
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
            ]
        },
        placeholder: 'Compose an epic...',
        bounds: '#description-editor',
        scrollingContainer: '#description-editor'
    });

    quill1.on('text-change', function() {
        document.querySelector('input[name=description]').value = quill1.root.innerHTML;
    });

    quill2 = new Quill('#productdescription-editor', {
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
            ]
        },
        placeholder: 'Compose an epic...',
        bounds: '#productdescription-editor',
        scrollingContainer: '#productdescription-editor'
    });

    quill2.on('text-change', function() {
        document.querySelector('input[name=productdescription]').value = quill2.root.innerHTML;
    });

    quill3 = new Quill('#tradeprocess-editor', {
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
            ]
        },
        placeholder: 'Compose an epic...',
        bounds: '#tradeprocess-editor',
        scrollingContainer: '#tradeprocess-editor'
    });

    quill3.on('text-change', function() {
        document.querySelector('input[name=tradeprocess]').value = quill3.root.innerHTML;
    });
    initialinventoryload = ''
    const form = document.querySelector('#viewinventoryform')
    const form2 = document.querySelector('#createinventoryform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>fetchviewinventorys())
    if(document.querySelector('#submitedit')) document.querySelector('#submitedit').addEventListener('click', e=>viewinventoryFormEditHandler())
    // form.querySelector('#submit').click()
    datasource = []
    let x= 
    await getAllbranch(!checkpermission('FILTER BRANCH'), 'branchsearch')
    await new TomSelect('#branchsearch', {
        plugins: ['dropdown_input'],
        onInitialize: function() {
            console.log(checkpermission('FILTER BRANCH'))
            if(!checkpermission('FILTER BRANCH')) this.setValue(the_user.branch);
            if(!checkpermission('FILTER BRANCH')) this.disable();
            handleBranchChange(this.getValue());
        },
        onChange: function() {
            handleBranchChange(this.getValue());
        }
    });
    new TomSelect('#itemidsearch', {
        plugins: ['dropdown_input']
    })
    await fetchviewinventorys()
}

async function fetchviewinventorys(id) {
    
    let form = document.querySelector('#viewinventoryform');
    let formData = new FormData(form);
    let queryParams = new URLSearchParams(formData).toString();

    document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> Loading... </td>`

    let request = await httpRequest2(`api/v1/inventory/getinventory?${queryParams ? `${queryParams}` : ''}${id ? `&id=${id}` : ''}`, null, document.querySelector('#viewinventoryform #submit'), 'json', 'GET');
    if(!id)document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                if(!initialinventoryload){
                    initialinventoryload = datasource; 
                    document.getElementById('itemidsearch').innerHTML = `<option value="">-- SEARCH ITEM --</option>`                   
                    document.getElementById('itemidsearch').innerHTML += initialinventoryload.map(data=>`<option value="${data.itemid}">${data.itemname}</option>`).join('')
                }
                resolvePagination(datasource, onviewinventoryTableDataSignal)
            }
        }else{
             viewinventoryid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeviewinventory(id) {
    // Ask for confirmation using SweetAlert
    const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to remove this item?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
    });

    // If not confirmed, do nothing
    if (!confirmed.isConfirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('api/v1/inventory/delete', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchviewinventorys()
    return notification(request.message);
}


async function onviewinventoryTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.itemname}</td>
        <td>${item.departmentname}</td>
        <td>${item.units}</td>
        <td>${item.applyto}</td>
        <td>${item.group}</td>
        <td>${item.description.substring(0, 200)}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="viewinventoryFormSubmitHandler('${item.itemid}', '${JSON.stringify(item).replaceAll("'", '').replaceAll('"', '~~~')}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeviewinventory('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function viewinventoryFormSubmitHandler(itemid=document.getElementById('itemid').value, itemdata=null) {
    did('imagePreview').innerHTML = '';
    did('imagePreviewtwo').innerHTML = '';
    did('imagePreviewthree').innerHTML = '';
    did('imageone').value = '';
    did('imagetwo').value = ''; 
    did('imagethree').value = '';

    // Show SweetAlert loading
    if(itemid)Swal.fire({
        title: 'Loading',
        text: 'Please wait while we retrieve the inventory data...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    if(itemid){
        did('modalform').classList.remove('hidden');
    }
    
    let request
    

    request = await httpRequest2(`api/v1/inventory/getinventory?itemid=${itemid}&branch=${did('branchsearch').value}&department=${did('departmentsearch').value}`, null, document.querySelector('#viewinventoryform #submit'), 'json', 'GET');
    console.log(request)
    Swal.close();
    
    if(!itemid) {
        document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`;
    }
    
    if(request.status) {
        if(!itemid){
            // if(request.data.length) {
            //     datasource = request.data
            //     resolvePagination(datasource, onviewinventoryTableDataSignal)
            //     did('modalform').classList.add('hidden')
            //     return notification(request.message, 1);
            // }
        } else {
            viewinventoryid = itemid;
            await getinventorydepartment(false);
            await populateData(request.data[0], ['imageone', 'imagetwo', 'imagethree', 'imagefour', 'imagefive', 'imagesix', 'imageseven', 'imageeight', 'imagenine', 'imageten'], [], 'createinventoryform', true);
            quill1.root.innerHTML = request.data[0].description || '';
            console.log('quill', quill1.root.innerHTML, request.data[0].description);
        const productDescriptionEditor = document.querySelector('#productdescription-editor').__quill;
        if (productDescriptionEditor) {
            productDescriptionEditor.root.innerHTML = request.data[0].productdescription || '';
        }

        const serviceDescriptionEditor = document.querySelector('#description-editor').__quill;
        if (serviceDescriptionEditor) {
            serviceDescriptionEditor.root.innerHTML = request.data[0].description || '';
        }

        const tradeProcessEditor = document.querySelector('#tradeprocess-editor').__quill;
        if (tradeProcessEditor) {
            tradeProcessEditor.root.innerHTML = request.data[0].tradeprocess || '';
        }
            // let container = document.querySelector('#departmt');
            // request.data[0].department.split('||').map(data => {
            //     container.querySelector(`${data.id}`)[0].checked = true;
            // });
        }

    } else {
        notification('No records retrieved');
    }

    // Close SweetAlert loading
}


async function viewinventoryFormEditHandler(id='') {
    // Show SweetAlert processing
    Swal.fire({
        title: 'Processing',
        text: 'Please wait while we update the inventory data...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    let x = document.getElementsByName('itemname')[0].parentElement.parentElement.children[2];
    let y = '';
    for (let j = 0; j < x.children.length; j++) {
        if (x.children[j].children[0].checked && y) y = y + '||' + x.children[j].children[0].getAttribute('name');
        if (x.children[j].children[0].checked && !y) y = x.children[j].children[0].getAttribute('name');
    }
    let b = '';
            for (let j = 0; j < x.children.length; j++) {
                if (x.children[j].children[0].checked && b) b = b + '||' + x.children[j].children[1].getAttribute('name');
                if (x.children[j].children[0].checked && !b) b = x.children[j].children[1].getAttribute('name');
            }

    let payload = getFormData2(document.querySelector('#viewinventoryeditform'), [['department', y], ['branch', b]]);
    let request = await httpRequest2('api/v1/inventory/update', payload, document.querySelector('#viewinventoryeditform #submit'), 'json', 'POST');
    
    Swal.close(); // Close SweetAlert processing
 
    if (!id) document.getElementById('tabledata').innerHTML = `<td colspan="100%" class="text-center opacity-70"> No Records Retrieved </td>`;
    viewinventoryFormSubmitHandler();
    if (request.status) {
        if (!id) {
            if (request.data.length) { 
                document.getElementById('modalform').classList.remove('hidden');
                viewinventoryActive();
                return notification(request.message, 1);
            }
        } else {
            notification(request.message, 1);
            viewinventoryid = request.data[0].itemid;
        }
    } else {
        return notification('No records retrieved');
    }
}


// function runAdviewinventoryFormValidations() {
//     let form = document.getElementById('viewinventoryform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewinventoryname'))  controls.push([form.querySelector('#viewinventoryname'), 'viewinventory name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }