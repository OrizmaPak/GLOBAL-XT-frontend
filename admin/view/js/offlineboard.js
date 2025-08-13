async function offlineboardActive() {
    fetchofflineboard();
    entername();
}

async function fetchofflineboard() {
    const request = await httpRequest2(`api/v1/offline/offlinecodeandpin`, null, null, 'json', 'GET');
    if(request.status) {
        did('dailycode').innerHTML = request.data.dailyCode;
        did('pinpasscode').innerHTML = request.data.pin;
    }else{
        notification('No records retrieved');
        return;
    }
}

async function togglePinVisibilityoffline() {
    const pinElement = document.getElementById('pinpasscode');
    const isVisible = await getAndVerifyPin();
    if (isVisible) {
        pinElement.classList.remove('blur-sm');
    }
}