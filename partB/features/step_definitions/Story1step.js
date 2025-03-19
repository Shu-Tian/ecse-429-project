const { When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const { expect } = require('chai');
const utils = require("./storyUtils.js");

let response;
let todosList;
let todoExists;

When('a new todo is created with title {string}', async function (title) {
    try {
        response = await axios.post(utils.BASE_URL, {
            title: title
        });
        utils.utilsResponse.statusCode = response.status;
    } catch (error) {
        response = error.response;
        utils.utilsResponse.statusCode = response.status;
        utils.utilsResponse.errorMsg = response.data.errorMessages[0];
    }
});

When('a new todo is created with title {string} and {string}', async function (title, description) { 
    response = await axios.post(utils.BASE_URL, {
        title: title,
        description: description
    });
    utils.utilsResponse.statusCode = response.status;
});


Then('a new todo exists in the database with title {string}', async function (title) { 
    todosList = await utils.getTodosList();
    todoExists = todosList.some(todo => todo.title === title);
    expect(todoExists).to.be.true;
});

Then('a new todo exists in the database with title {string} and {string}', async function (title, description) {
    todosList = await utils.getTodosList();
    todoExists = todosList.some(todo => todo.title === title && todo.description === description);
    expect(todoExists).to.be.true;
});
