const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const { expect } = require('chai');
const utils = require("./storyUtils.js");

let response;

Given('a todo with title {string} is marked with doneStatus <doneStatus>', async function (title, doneStatus) {
    let todoId = await utils.getTodoIdByTitle(title);
    todoUrl = utils.BASE_URL + '/' + todoId;
    response = await axios.put(todoUrl, {
        title: title,
        doneStatus: doneStatus === 'true'
    });
    utils.utilsResponse.statusCode = response.status;
});

When('a todo with id {int} is deleted', async function (id) {
    try {
        response = await axios.delete(utils.BASE_URL + '/' + id);
        utils.utilsResponse.statusCode = response.status;
    } catch (error) {
        response = error.response;
        utils.utilsResponse.statusCode = response.status;
    }
});

Then('a the todo with id {int} no longer exists in the database', async function (id) {
    todosList = await utils.getTodosList();
    todoExists = todosList.some(todo => todo.id === id);
    expect(todoExists).to.be.false;
});