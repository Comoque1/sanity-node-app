'use strict';

import { expect } from "chai";
import "regenerator-runtime/runtime.js";
import { deleteTransactionRequest, saleRequest, voidRequest } from "../api/payment-transation-requests";
import { saleTransactionDefaults } from './sale_payment_transactions.spec';

describe('Void payment transactions', function () {
  before(async function () {
    let response = await saleRequest(saleTransactionDefaults);
    let parsedResponse = JSON.parse(response.body);
    this.saleTransactionId = parsedResponse.unique_id;
  })

  after(async function () {
    await deleteTransactionRequest(this.transactionId)
  });

  it('should be sent and approved', async function () {
    // Act
    let response = await voidRequest(this.saleTransactionId)
    let parsedResponse = JSON.parse(response.body);

    //Assert
    expect(response.statusCode).to.be.equal(200);
    expect(parsedResponse.status).to.be.equal('approved');
    expect(parsedResponse.message).to.be.equal('Your transaction has been voided successfully');
  });

  it('should be invalid - void transition using void valid reference_id', async function () {
    // Act
    let response = await voidRequest(this.saleTransactionId)
    let parsedResponse = JSON.parse(response.body);
    let voidTransactionId = parsedResponse.unique_id;
    let responseToExistingVoidTransaction = await voidRequest(voidTransactionId);
    let parsedResponseToExistingVoid = JSON.parse(responseToExistingVoidTransaction.body);

    //Assert
    expect(response.statusCode).to.be.equal(422);
    expect(parsedResponseToExistingVoid.reference_id[0]).to.be.equal('Invalid reference transaction!');
  });

  it('should be invalid - void transition using invalid reference_id', async function () {
    // Act
    let response = await voidRequest('invalid reference_id')
    let parsedResponse = JSON.parse(response.body);

    //Assert
    expect(response.statusCode).to.be.equal(422);
    expect(parsedResponse.reference_id[0]).to.be.equal('Invalid reference transaction!');
  });


});