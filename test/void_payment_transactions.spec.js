'use strict';

import { expect } from "chai";
import "regenerator-runtime/runtime.js";
import { saleRequest, voidRequest } from "../api/payment-transation-requests";
import { saleTransactionDefaults } from './sale_payment_transactions.spec';
import { async } from "regenerator-runtime/runtime.js";

describe('Void payment transactions', function () {
  beforeEach(async function () {
    let saleResponse = await saleRequest(saleTransactionDefaults);
    let parsedResponse = JSON.parse(saleResponse.body);
    this.saleTransactionId = parsedResponse.unique_id;
  });

  it('should be sent and approved', async function () {
    // Act
    let voidResponse = await voidRequest(this.saleTransactionId)
    let voidParsedResponse = JSON.parse(voidResponse.body);

    //Assert
    expect(voidResponse.statusCode).to.be.equal(200);
    expect(voidParsedResponse.unique_id).not.to.be.null;
    expect(voidParsedResponse.status).to.be.equal('approved');
    expect(voidParsedResponse.usage).to.be.equal('Coffeemaker');
    expect(voidParsedResponse.amount).to.be.equal(500);
    expect(voidParsedResponse.transaction_time).not.to.be.null;
    expect(voidParsedResponse.message).to.be.equal('Your transaction has been voided successfully');
  });

  it('should not be processed - use seconed time valid sale unique_id', async function () {
    // Act
    await voidRequest(this.saleTransactionId);
    let voidResponse = await voidRequest(this.saleTransactionId);
    let voidParsedResponse = JSON.parse(voidResponse.body);

    //Assert
    expect(voidResponse.statusCode).to.be.equal(422);
    expect(voidParsedResponse.reference_id[0]).to.be.equal('Invalid reference transaction!');
  });

  it('should not be processed - use valid void unique_id', async function () {
    // Act
    let voidResponse = await voidRequest(this.saleTransactionId)
    let voidParsedResponse = JSON.parse(voidResponse.body);
    let voidTransactionId = voidParsedResponse.unique_id;
    let responseToExistingVoidTransaction = await voidRequest(voidTransactionId);
    let parsedResponseToExistingVoid = JSON.parse(responseToExistingVoidTransaction.body);

    //Assert
    expect(responseToExistingVoidTransaction.statusCode).to.be.equal(422);
    expect(parsedResponseToExistingVoid.reference_id[0]).to.be.contain('Invalid reference transaction!');
  });

  it('should not be processed - invalid void reference_id, async function', async function () {
    // Act
    let voidResponse = await voidRequest('invalid void reference_id');
    let voidParsedResponse = JSON.parse(voidResponse.body);

    //Assert
    expect(voidResponse.statusCode).to.be.equal(422);
    expect(voidParsedResponse.reference_id[0]).to.be.equal('Invalid reference transaction!');
  });
});

describe('Void payment transactions - declined sale transaction', function () {

  it('should not be processed - using unique_id from declined sale transaction', async function () {
    // Arrange
    let saleResponse = await saleRequest({
      ...saleTransactionDefaults,
      card_number: '7700000000000000'
    });
    let parsedResponse = JSON.parse(saleResponse.body);
    let saleTransactionId = parsedResponse.unique_id;

    // Act
    let voidResponse = await voidRequest(saleTransactionId)
    let voidParsedResponse = JSON.parse(voidResponse.body);

    //Assert
    expect(voidResponse.statusCode).to.be.equal(422);
    expect(voidParsedResponse.reference_id[0]).to.be.equal('Invalid reference transaction!');
  });
});