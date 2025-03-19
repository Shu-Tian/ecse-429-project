const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const { expect } = require('chai');
const utils = require("./storyUtils.js");

let response;
let responseProj;
let url;

Given('todo with id {int} is part of project with id {string}', async function (todoId, projId) {
    url = utils.BASE_URL + '/' + todoId + '/tasksof';
    response =  await axios.get(url);
    responseProj = response.data.projects[0].id;
    expect(responseProj).to.equal(projId);
});

Given('todo with title {string} is not part of any projects', async function (title) {
    await axios.post(utils.BASE_URL, {title: title});
    let todoId = await utils.getTodoIdByTitle(title);

    url = utils.BASE_URL + '/' + todoId + '/tasksof';
    response =  await axios.get(url);
    responseProj = response.data.projects;
    expect(responseProj).to.be.empty;
});

When('user queries project of todo with id {int}', async function (todoId) {
    url = utils.BASE_URL + '/' + todoId + '/tasksof';
    response =  await axios.get(url);
    utils.utilsResponse.statusCode = response.status;
});

When('user queries project of todo with title {string}', async function (title) {
    let todoId = await utils.getTodoIdByTitle(title);
    url = utils.BASE_URL + '/' + todoId + '/tasksof';
    response =  await axios.get(url);
  });

// BUG
// Expected status code 404
// Actual status code 200
When('user queries project of a todo with inexistant id {int}', async function (badId) {    
    try {
        response = await axios.get(utils.BASE_URL + '/' + badId + '/tasksof');
        utils.utilsResponse.statusCode = response.status;
    } catch (error) {
        response = error.response;
        utils.utilsResponse.statusCode = response.status;
    }
});

Then('the related project with id {string} is shown', function (projId) {
    responseProj = response.data.projects[0].id;
    expect(responseProj).to.equal(projId);
});

Then('no project is shown', function () {
    responseProj = response.data.projects;
    expect(responseProj).to.be.empty;
});