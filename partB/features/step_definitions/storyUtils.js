const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { spawn } = require("child_process");
const { expect } = require('chai');
const axios = require('axios');

const BASE_URL = 'http://localhost:4567/todos';

let utilsResponse = {
	statusCode: null,
	errorMsg: ''
};

async function getTodosList() {
    let response = await axios.get(BASE_URL);
    return response.data.todos;
}

async function getTodoIdByTitle(title) {
	try {
		let response = await axios.get(BASE_URL);
		let todo = response.data.todos.find(todo => todo.title === title);
		return todo.id;
	} catch (error) {
		return -1;
	}
}

// Start and Terminate server before and after each scenario

Before(async function () {
    spawn("java", ["-jar", "runTodoManagerRestAPI-1.5.5.jar"]);
    let serverReady = false;
    while (!serverReady) {
        try {
          await axios.get(BASE_URL);
          serverReady = true;
        } catch (error) {}
      }
});

After(async function () {
    try {
        await axios.get("http://localhost:4567/shutdown");
      } catch (error) {}
});


// Common steps

Given('the server is running', async function () {
    try {
      let response = await axios.get(BASE_URL);
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error('Server is not running.');
    }
  });

Given('the database contains the default todo objects', async function () {      
    const defaultTodos = [
        {
            id: "1",
            title: "scan paperwork",
            doneStatus: "false",
            description: "",
            categories: [{ id: "1" }],
            tasksof: [{ id: "1" }]
        },
        {
            id: "2",
            title: "file paperwork",
            doneStatus: "false",
            description: "",
            tasksof: [{ id: "1" }]
        }
    ];

    let response =  await axios.get(BASE_URL);
    let responseTodos = response.data.todos;
    expect(responseTodos).to.deep.include.members(defaultTodos);
});


// Status Codes
Then('status code 200 will be received', async function () {
	expect(utilsResponse.statusCode).to.equal(200);
});

Then('status code 201 will be received', async function () {
	expect(utilsResponse.statusCode).to.equal(201);
});

Then('status code 400 will be received', async function () {
	expect(utilsResponse.statusCode).to.equal(400);
});

Then('status code 404 will be received', async function () {
	expect(utilsResponse.statusCode).to.equal(404);
});


// Error Message
Then('the user is informed of the operation failure with message {string}', function (errorMsg) {    
    expect(utilsResponse.errorMsg).to.equal(errorMsg);
});


module.exports = {
    BASE_URL,
	utilsResponse,
    getTodosList,
	getTodoIdByTitle
}