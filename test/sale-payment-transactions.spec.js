'use strict';

import { expect } from "chai";
import "regenerator-runtime/runtime.js";
import { saleRequest, undefinedRequest } from "../api/payment-transation-requests";
import config from '../config';

export const saleTransactionDefaults = ({
  "card_number": "4200000000000000",
  "cvv": "123",
  "expiration_date": "08/2040",
  "amount": "500",
  "usage": "Coffeemaker",
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
    let response = await saleRequest(saleTransactionDefaults);
    let parsedResponse = JSON.parse(response.body);

    //Assert
    expect(response.statusCode).to.be.equal(200);
    expect(parsedResponse.unique_id).not.to.be.null;
    expect(parsedResponse.status).to.be.equal('approved');
    expect(parsedResponse.usage).to.be.equal('Coffeemaker');
    expect(parsedResponse.amount).to.be.equal(500);
    expect(parsedResponse.transaction_time).not.to.be.null
    expect(parsedResponse.message).to.be.equal('Your transaction has been approved.');
  });

  it('should be sent and declined', async function () {
    // Act
    let response = await saleRequest({
      ...saleTransactionDefaults,
      card_number: '7700000000000000'
    });
    let parsedResponse = JSON.parse(response.body);

    //Assert
    expect(response.statusCode).to.be.equal(406);
    expect(parsedResponse.status).to.be.equal('declined');
    expect(parsedResponse.message).to.be.equal('Your transaction has been declined.');
  });

  it('should not be processed - invalid transaction_type', async function () {
    // Act
    let response = await undefinedRequest();
    let parsedResponse = JSON.parse(response.body);

    //Assert
    expect(response.statusCode).to.be.equal(422);
    expect(parsedResponse.transaction_type[0]).to.be.equal('is not included in the list');
  });

  it('should not be processed - invalid expiration_date', async function () {
    // Act
    let response = await saleRequest({
      ...saleTransactionDefaults,
      expiration_date: '07/1777'
    });
    let parsedResponse = JSON.parse(response.body);

    //Assert
    expect(response.statusCode).to.be.equal(406);
    expect(parsedResponse.status).to.be.equal('declined');
    expect(parsedResponse.message).to.be.equal('Your transaction has been declined.');
  });

  it('should not be authorized', async function () {
    // Act
    let response = await saleRequest({ saleTransactionDefaults }, auth);

    //Assert
    expect(response.statusCode).to.be.equal(401);
  });
});

describe('Card number: Data Driven tests', function () {
  let params = [
    { 'cardNumberValue': '42.0000000000000', 'errorMessage': 'is invalid' },
    { 'cardNumberValue': '420000000000', 'errorMessage': 'is invalid' },
    { 'cardNumberValue': 'test', 'errorMessage': 'is invalid' },
    { 'cardNumberValue': '', 'errorMessage': 'can\'t be blank' }
  ];

  params.forEach(({ cardNumberValue, errorMessage }) => {
    it(`should return error '${errorMessage}' for card_number '${cardNumberValue}' `, async function () {
      // Act
      let response = await saleRequest({
        ...saleTransactionDefaults,
        card_number: cardNumberValue
      });
      let parsedResponse = JSON.parse(response.body);

      //Assert
      expect(response.statusCode).to.be.equal(422);
      expect(parsedResponse.card_number[0]).to.be.equal(errorMessage);
    });
  });
});

describe('CVV: Data Driven tests', function () {
  let params = [
    { 'cvvValue': '12', 'errorMessage': 'is invalid' },
    { 'cvvValue': '12345', 'errorMessage': 'is invalid' },
    { 'cvvValue': 'test', 'errorMessage': 'is invalid' },
    { 'cvvValue': '1.2', 'errorMessage': 'is invalid' },
    { 'cvvValue': '', 'errorMessage': 'can\'t be blank' }
  ];

  params.forEach(({ cvvValue, errorMessage }) => {
    it(`should return error '${errorMessage}' for cvv '${cvvValue}' `, async function () {
      // Act
      let response = await saleRequest({
        ...saleTransactionDefaults,
        cvv: cvvValue
      });
      let parsedResponse = JSON.parse(response.body);

      //Assert
      expect(response.statusCode).to.be.equal(422);
      expect(parsedResponse.cvv[0]).to.be.equal(errorMessage);
    });
  });
});

describe('Amount: Data Driven tests', function () {
  let params = [
    { 'amountValue': '-1', 'errorMessage': 'must be greater than 0' },
    { 'amountValue': '0', 'errorMessage': 'must be greater than 0' },
    { 'amountValue': 'test', 'errorMessage': 'is not a number' },
    { 'amountValue': ' ', 'errorMessage': 'can\'t be blank' },
  ];

  params.forEach(({ amountValue, errorMessage }) => {
    it(`should return error '${errorMessage}' for amount '${amountValue}' `, async function () {
      // Act
      let response = await saleRequest({
        ...saleTransactionDefaults,
        amount: amountValue
      });
      let parsedResponse = JSON.parse(response.body);

      //Assert
      expect(response.statusCode).to.be.equal(422);
      expect(parsedResponse.amount[0]).to.be.equal(errorMessage);
    });
  });

  it(`should return error 'statusCode: 422' for amount '2147483648' `, async function () {
    // Arrange
    let amountValue = '2147483648'; // the value is equal to the intMax

    // Act
    let response = await saleRequest({
      ...saleTransactionDefaults,
      amount: amountValue
    });

    //Assert
    expect(response.statusCode).to.be.equal(422);
  });
});

describe('Email: Data Driven tests', function () {
  let params = [
    { 'emailValue': 'panda@example', 'errorMessage': 'is invalid' },
    { 'emailValue': 'panda@.com', 'errorMessage': 'is invalid' },
    { 'emailValue': 'pandaexample.com', 'errorMessage': 'is invalid' },
    { 'emailValue': '', 'errorMessage': 'can\'t be blank' }
  ];

  params.forEach(({ emailValue, errorMessage }) => {
    it(`should return error '${errorMessage}' for email '${emailValue}' `, async function () {
      // Act
      let response = await saleRequest({
        ...saleTransactionDefaults,
        email: emailValue
      });
      let parsedResponse = JSON.parse(response.body);

      //Assert
      expect(response.statusCode).to.be.equal(422);
      expect(parsedResponse.email[0]).to.be.equal(errorMessage);
    });
  });
});

describe('Empty fields', function () {
  it(`should return error for empty: card_holder, usage, address`, async function () {
    // Arrange
    let errorMessage = 'can\'t be blank';

    // Act
    let response = await saleRequest({
      ...saleTransactionDefaults,
      card_holder: '',
      usage: '',
      address: '',
    });
    let parsedResponse = JSON.parse(response.body);

    //Assert
    expect(response.statusCode).to.be.equal(422);
    expect(parsedResponse.card_holder[0]).to.be.equal(errorMessage);
    expect(parsedResponse.usage[0]).to.be.equal(errorMessage);
    expect(parsedResponse.address[0]).to.be.equal(errorMessage);
  });
});