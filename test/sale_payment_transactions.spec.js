'use strict';

import { expect } from "chai";
import "regenerator-runtime/runtime.js";
import { sale_request } from "../api/payment-transation-requests";
import config from '../config';

export const saleTransactionDefaults = ({
  "card_number": "4200000000000000",
  "cvv": "123",
  "expiration_date": "06/2019",
  "amount": "500",
  "usage": "test",
  "transaction_type": "sale",
  "card_holder": "Panda Panda",
  "email": "panda@example.com",
  "address": "Panda Street, China"
});

const auth = ({
  'Content-Type': 'application/json;charset=UTF-8',
  "Authorization": config.getInvalidAuthToken()
});

describe('Sale payment transaction', function () {
  it('should be sent and approved', async function () {
    // Act
    let response = await sale_request(saleTransactionDefaults);
    let parsedResponse = JSON.parse(response.body);

    //Assert
    expect(response.statusCode).to.be.equal(200);
    expect(parsedResponse.status).to.be.equal('approved');
    expect(parsedResponse.message).to.be.equal('Your transaction has been approved.');
  });

  it('should not be authorized', async function () {
    // Act
    let response = await sale_request({ saleTransactionDefaults }, auth);

    //Assert
    expect(response.statusCode).to.be.equal(401);
  });

});