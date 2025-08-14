document.addEventListener('DOMContentLoaded', function() {
    fetch(`${baseurl}/api/front/inventory/getinventory`)
        .then(response => response.json())
        .then(data => {
            console.log('Inventory Data:', data);
        })
        .catch(() => console.log('There was a problem with the fetch operation:'));
});
