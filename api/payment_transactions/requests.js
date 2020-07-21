import request from 'request';
import config from '../../config';

const authorizationDefaults = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': config.getValidAuthToken()
}

export const sale_request = (params, headers) => {
    return postTransactionRequest(params, headers, 'sale')
};

export const void_request = (reference_id, headers) => {
    return postTransactionRequest({ reference_id }, headers, 'void')
};

export const postTransactionRequest = (params, headers, transactionType) => {
    return new Promise(function (resolve, reject) {
        request({
            'method': 'POST',
            'url': config.getUrl('payment_transactions'),
            body: JSON.stringify({
                "payment_transaction": {
                    ...params,
                    "transaction_type": transactionType
                }
            }),
            headers: ({
                ...authorizationDefaults,
                ...headers
            })
        }, function (error, response) {
            if (error) {
                reject(error);
                return;
            };
            resolve(response);
        })
    });
};

export const deleteTransactionRequest = (transactioId) => {
    return new Promise(function (resolve, reject) {
        resolve(transactioId)
        // Delete the transactions generated after the test is ru
    });
};