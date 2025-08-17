// // globalxt/product.html?itemid=1000001
// // this is how the url looks like
// // get the itemid from the url
// let itemid = new URLSearchParams(window.location.search).get('itemid');

// // use it to fetch the product data from the api {
//     "status": true,
//     "message": "Inventory fetched successfully",
//     "statuscode": 200,
//     "data": [
//         {
//             "id": 4,
//             "itemid": 1000001,
//             "itemname": "Cowpea",
//             "department": "2",
//             "branch": 1,
//             "units": "LITRES",
//             "cost": 0,
//             "price": 0,
//             "pricetwo": 0,
//             "beginbalance": 1000,
//             "qty": 1000,
//             "minimumbalance": 0,
//             "group": "",
//             "applyto": "FOR SALES",
//             "itemclass": "STOCK-ITEM",
//             "composite": "NO",
//             "compositeid": null,
//             "description": "<p><strong class=\"ql-font-monospace ql-size-large\" style=\"color: rgb(0, 102, 204);\"><u>Fine grain that you will enjoy for any commercial production. </u></strong></p><p><br></p><p><span style=\"color: rgb(230, 0, 0);\">ne grain that you will enjoy for any commercial production. Fine grain that you will enjoy for any commercial production. Fine grain that you will enjoy for any commercial production. Fine grain that you will enj</span><span style=\"color: rgb(230, 0, 0); background-color: rgb(255, 255, 0);\">oy for any commercial production. Fine grain that you will enjoy for any com</span><span style=\"color: rgb(230, 0, 0);\">mercial production. Fine grain that you will enjoy for any commercial production. Fine grain that you will enjoy for any commercial production.</span></p>",
//             "imageone": "https://res.cloudinary.com/duoojkl6a/image/upload/v1753048974/ancient-grains-GettyImages-1134030813-eb17bcde30f74c69803a096dd4d21d3d.jpg",
//             "imagetwo": "https://res.cloudinary.com/duoojkl6a/image/upload/v1753048975/images%20%286%29.jpg",
//             "imagethree": "https://res.cloudinary.com/duoojkl6a/image/upload/v1753048976/images%20%285%29.jpg",
//             "sellingprice": null,
//             "reference": "1755169507052",
//             "transactiondate": "2025-08-14T12:05:07.052+01:00",
//             "transactiondesc": "Update details of the item",
//             "transactionref": "",
//             "reorderlevel": "",
//             "issue": null,
//             "issuetype": null,
//             "supplier": null,
//             "staff": "",
//             "returned": false,
//             "status": "ACTIVE",
//             "dateadded": "2025-08-14T11:05:07.052Z",
//             "createdby": 1,
//             "productdescription": "",
//             "tradeprocess": "",
//             "imageeight": "",
//             "imagefive": "",
//             "imagefour": "",
//             "imagenine": "",
//             "imageseven": "",
//             "imagesix": "",
//             "imageten": "",
//             "departmentname": "GRAINS",
//             "branchname": "HEAD OFFICE"
//         }
//     ],
//     "pagination": {
//         "total": 1,
//         "pages": 1,
//         "page": 1,
//         "limit": 1000000
//     },
//     "errors": []
// }

// above is how the data looks like

// the api is node/api/front/inventory/getinventory?itemid=1000001 please dont forget to add the baseurl

// then study the product.html and fill it up based on the data

// remember what we did in the shop.html and js put at the bottom like similar items in the same category and the url to get them is node/api/front/inventory/getinventory?department=2

// so you will use the department of the current product recall that department is wat i call category

