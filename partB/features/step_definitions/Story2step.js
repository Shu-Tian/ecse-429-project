const { When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const { expect } = require('chai');
const utils = require("./storyUtils.js");

let response;
let todoId;
let todoUrl;

When('a todo with title {string} is marked with doneStatus {string}', async function (title, doneStatus) {  
    todoId = await utils.getTodoIdByTitle(title);
    try {
        todoUrl = utils.BASE_URL + '/' + todoId;
        response = await axios.put(todoUrl, {
            title: title,
            doneStatus: doneStatus === 'true'
        });
        utils.utilsResponse.statusCode = response.status;
    } catch (error) {
        response = error.response;
        utils.utilsResponse.statusCode = response.status;
        utils.utilsResponse.errorMsg = response.data.errorMessages[0];
    }
});

When('a todo with title {string} is marked with doneStatus {string} and additional description {string}', async function (title, doneStatus, description) {
    todoId = await utils.getTodoIdByTitle(title);
    try {
        todoUrl = utils.BASE_URL + '/' + todoId;
        response = await axios.put(todoUrl, {
            title: title,
            doneStatus: doneStatus === 'true',
            description: description
        });
        utils.utilsResponse.statusCode = response.status;
    } catch (error) {
        response = error.response;
        utils.utilsResponse.statusCode = response.status;
        utils.utilsResponse.errorMsg = response.data.errorMessages[0];
    }
});

When('an inexistant todo with id {int} is selected', async function (badId) {
    try {
        response = await axios.get(utils.BASE_URL + '/' + badId);
    } catch (error) {
        response = error.response;
        utils.utilsResponse.statusCode = response.status;
    }
});

Then('the completed task {string} now has doneStatus {string}', async function (title, doneStatus) {
    todoId = await utils.getTodoIdByTitle(title);
    response = await axios.get(utils.BASE_URL + '/' + todoId);
    expect(response.data.todos[0].doneStatus).to.equal(doneStatus)
});

Then('the completed task {string} now has doneStatus {string} and description {string}', async function (title, doneStatus, description) {
    todoId = await utils.getTodoIdByTitle(title);
    response = await axios.get(utils.BASE_URL + '/' + todoId);
    expect(response.data.todos[0].doneStatus).to.equal(doneStatus)
    expect(response.data.todos[0].description).to.equal(description)
});