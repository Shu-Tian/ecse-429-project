const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const { expect } = require('chai');
const utils = require("./storyUtils.js");

let response;
let responseCategory;
let url;

Given('todo with id {int} is part of category with id {string}', async function (todoId, cid) {
    url = utils.BASE_URL + '/' + todoId + '/categories';
    response =  await axios.get(url);
    responseCategory = response.data.categories[0].id;
    expect(responseCategory).to.equal(cid);
});

Given('todo with id {int} is not part of any categories', async function (todoId) {
    url = utils.BASE_URL + '/' + todoId + '/categories';
    response =  await axios.get(url);
    responseCategory = response.data.categories;
    expect(responseCategory).to.be.empty;
});

When('user queries category of a todo with id {int}', async function (todoId) {
    url = utils.BASE_URL + '/' + todoId + '/categories';
    response =  await axios.get(url);
    utils.utilsResponse.statusCode = response.status;
});

// BUG
// Expected status code 404
// Actual status code 200
When('user queries category of a todo with inexistant id {int}', async function (badId) {    
    try {
        response = await axios.get(utils.BASE_URL + '/' + badId + '/categories');
        utils.utilsResponse.statusCode = response.status;
    } catch (error) {
        response = error.response;
        utils.utilsResponse.statusCode = response.status;
    }
});

Then('the related category with id {string} is shown', function (cid) {
    responseCategory = response.data.categories[0].id;
    expect(responseCategory).to.equal(cid);
});

Then('no category is shown', function () {
    responseCategory = response.data.categories;
    expect(responseCategory).to.be.empty;
});