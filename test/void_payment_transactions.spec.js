'use strict';

import { expect } from "chai";
import "regenerator-runtime/runtime.js";
import { deleteTransactionRequest, sale_request, void_request } from "../api/payment_transactions/requests";
import { saleTransactionDefaults } from './sale_payment_transactions.spec';

describe('Void payment transactions', function () {
  before(async function () {
    let response = await sale_request(saleTransactionDefaults);
    let parsedResponse = JSON.parse(response.body);
    this.transactionId = parsedResponse.unique_id;
  })

  after(async function () {
    await deleteTransactionRequest(this.transactionId)
  })

  it('should be sent and approved', async function () {
    // Act
    let response = await void_request(this.transactionId)
    let parsedResponse = JSON.parse(response.body);

    //Assert
    expect(response.statusCode).to.be.equal(200);
    expect(parsedResponse.status).to.be.equal('approved');
  })


});