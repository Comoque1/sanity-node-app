// //var request = require('request');
// import request from 'request';

// const options = {
//     'method': 'POST',
//     'url': 'http://localhost:3001/payment_transactions',
//     'headers': {
//         'Content-Type': 'application/json;charset=UTF-8',
//         'Authorization': 'Basic Y29kZW1vbnN0ZXI6bXk1ZWNyZXQta2V5Mm8ybw=='
//     },
//     body: JSON.stringify({
//         "payment_transaction": {
//             "card_number": "4200000000000000",
//             "cvv": "123",
//             "expiration_date": "06/2019",
//             "amount": "500",
//             "usage": "Coffeemaker",
//             "transaction_type": "sale",
//             "card_holder": "Panda Panda",
//             "email": "panda@example.com",
//             "address": "Panda Street, China"
//         }
//     })
// };

// request(options, function (error, response) {
//     if (error) throw new Error(error);
//     console.log(response.statusCode)
//     console.log(response.body.amount)
//     console.log(response.body);

// });
