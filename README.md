# Sanity node app

The project's goal is to provide API test coverage for the eMerchantPay ruby app.

## Environment setup

- Operation system: [Ubuntu 20.04 LTS](https://releases.ubuntu.com/20.04/)
- Node.js: v10.19.0
```bash
$ sudo apt-get install nodejs npm
```

## Tested application
 - Ruby on Rails application 
	 - [installation instructions](https://github.com/eMerchantPay/codemonsters_api_full)

## Project structure
 - config.json: parameter storage - 'port', 'token', etc.
 - config.js: provider for the parameters defined in config.json.
- api [folder]: mirrors the tested application API, as specific request files.
	- payment-transaction-requests.js<sup>note</sup>: contains functions that wrap the request logic for sale, void transactions.
- test/sale-payment-transaction.spec.js: tests, that exam 'sale' transactions
- test/void-payment-transaction.spec.js: tests, that exam 'void' transactions
- test-design/test-design.xlsx - file with defined scenarious to be automated

## Technologies
- mocha: test runner
- chai: assertion framework
- request: simplifies HTTP calls
- babel<sup>note</sup>: enables ES6 syntax (import vs require, etc.)

## Run
To run the tests do `npm i` and `npm test`

<sup>note</sup> - got external help for the marked areas
