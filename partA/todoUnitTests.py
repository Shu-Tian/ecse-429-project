import pytest
import requests
import subprocess
import os

BASE_URL = "http://localhost:4567"
TD_URL = BASE_URL + "/todos"
JAR_PATH = "../Application_Being_Tested/runTodoManagerRestAPI-1.5.5.jar"

#===== Setup ====================================================================

def start_server():
    print("Starting server on localhost:4567...")
    process = subprocess.Popen(["java", "-jar", JAR_PATH])
    return process

def stop_server(process):
    print("Stopping server...")
    process.kill()
    os.system("wmic process where \"name='java.exe'\" delete")


@pytest.fixture(scope="session", autouse=True)
def setup():
    # Ensure system is ready / program is running
    process = start_server()

    print("Saving system state...")

    yield  # Execute all tests

    print("Restoring system to initial state...")
    # Shut down program
    stop_server(process)

#===== /todos ====================================================================
class TestTodos:
    
    bodyGood = {"title": "print paperwork", "doneStatus": True, "description": "Print 3 copies"}
    bodyBad1 = {"title": "", "doneStatus": True, "description": "Print 3 copies"}
    bodyBad2 = {"title": "print paperwork", "doneStatus": 'true', "description": "Print 3 copies"}

    # Helper
    def getTodos(url):
        return requests.get(url)

    def test_getTodos(self):
        print("--- Testing GET /todos")
        response = TestTodos.getTodos(TD_URL)
        assert response.status_code == 200
        print(response.json())

    def test_getTodos_filter(self):
        print("--- Testing filtered GET /todos")
        response = TestTodos.getTodos(TD_URL + "?doneStatus=true")
        assert response.status_code == 200
        print(response.json())

    def test_headTodos(self):
        print("--- Testing HEAD /todos")
        response = requests.head(TD_URL)
        assert response.status_code == 200

    def test_optionsTodos(self):
        print("--- Testing OPTIONS /todos")
        response = requests.options(TD_URL)
        assert response.status_code == 200

    # Helper
    def postTodos(body):
        return requests.post(TD_URL, json = body)

    def test_postTodos_valid(self):
        print("--- Testing valid POST /todos")
        response = TestTodos.postTodos(TestTodos.bodyGood)
        assert response.status_code == 201

    def test_postTodos_invalid_title(self):
        print("--- Testing POST /todos with empty title")
        response = TestTodos.postTodos(TestTodos.bodyBad1)
        assert response.status_code == 400
        assert response.json() == {"errorMessages": ["Failed Validation: title : can not be empty"]}
        
    def test_postTodos_invalid_type(self):
        print("--- Testing POST /todos with invalid attribute type")
        response = TestTodos.postTodos(TestTodos.bodyBad2)
        assert response.status_code == 400
        assert response.json() == {"errorMessages":["Failed Validation: doneStatus should be BOOLEAN"]}

    def test_putTodos(self):
        print("--- Testing PUT /todos")
        response = requests.put(TD_URL, json = TestTodos.bodyGood)
        assert response.status_code == 405

    def test_patchTodos(self):
        print("--- Testing PATCH /todos")
        response = requests.patch(TD_URL, json = TestTodos.bodyGood)
        assert response.status_code == 405

    def test_deleteTodos(self):
        print("--- Testing DELETE /todos")
        response = requests.delete(TD_URL)
        assert response.status_code == 405


#===== /todos/:id ====================================================================
class TestId:

    id_body = {"title": "scan paperwork"}
    id_body2 = {"title": "scan paperwork", "doneStatus": True}
    test_id = 1
    test_id2 = 2

    def url_id(id):
        return f"{TD_URL}/{id}"

    # Helper
    def getTodoId(id):
        return requests.get(TestId.url_id(id))

    def test_getTodoId(self):
        print("--- Testing GET /todos/:id with valid id")
        id = 1
        response = TestId.getTodoId(TestId.url_id(id))
        assert response.status_code == 200

    def test_getTodoId(self):
        print("--- Testing GET /todos/:id with invalid id")
        id = 99
        response = TestId.getTodoId(id)
        assert response.status_code == 404

    def test_headTodoId(self):
        print("--- Testing HEAD /todos/:id")
        response = requests.head(TestId.url_id(TestId.test_id))
        assert response.status_code == 200

    def test_optionsTodoId(self):
        print("--- Testing OPTIONS /todos/:id")
        response = requests.options(TestId.url_id(TestId.test_id))
        assert response.status_code == 200

    def test_postTodoId(self):
        print("--- Testing POST /todos/:id")
        response = requests.post(TestId.url_id(TestId.test_id), json = TestId.id_body2)
        assert response.status_code == 200

    def test_putTodoId(self):
        print("--- Testing PUT /todos/:id")
        response = requests.put(TestId.url_id(TestId.test_id), json = TestId.id_body)
        assert response.status_code == 200

    def test_patchTodos(self):
        print("--- Testing PATCH /todos/:id")
        response = requests.patch(TestId.url_id(TestId.test_id), json = TestId.id_body2)
        assert response.status_code == 405

    def test_deleteTodoId(self):
        print("--- Testing DELETE /todos/:id")
        response = requests.delete(TestId.url_id(TestId.test_id2))
        assert response.status_code == 200


#===== /todos/:id/tasksof ====================================================================
class TestTasksof:

    test_id = 1
    body = {"id": "1", "title": "Office Work", "completed": "false", "active": "false", "description": "", "tasks": [{"id": "2"}, {"id": "1"}]}

    def url(id):
        return f"{TD_URL}/{id}/tasksof"

    def test_getTodoTasksof(self):
        print("--- Testing GET /todos/:id/tasksof")
        response = requests.get(TestTasksof.url(TestTasksof.test_id))
        assert response.status_code == 200

    def test_headTodoTasksof(self):
        print("--- Testing HEAD /todos/:id/tasksof")
        response = requests.head(TestTasksof.url(TestTasksof.test_id))
        assert response.status_code == 200

    def test_optionsTodoTasksof(self):
        print("--- Testing OPTIONS /todos/:id/tasksof")
        response = requests.options(TestTasksof.url(TestTasksof.test_id))
        assert response.status_code == 200

    def test_postTodoTasksof(self):
        print("--- Testing POST /todos/:id/tasksof")
        response = requests.post(TestTasksof.url(TestTasksof.test_id), json = TestTasksof.body)
        assert response.status_code == 201

    def test_deleteTasksof(self):
        print("--- Testing DELETE /todos/:id/tasksof/:id")
        response = requests.delete(f"{TD_URL}/{TestTasksof.test_id}/tasksof/{TestTasksof.test_id}")
        assert response.status_code == 200


#===== /todos/:id/categories ====================================================================
class TestCategories:

    test_id = 1
    body = {"id": "1", "title": "Office"}

    def url(id):
        return f"{TD_URL}/{id}/categories"
    
    def test_getTodoCategories(self):
        print("--- Testing GET /todos/:id/categories")
        response = requests.get(TestCategories.url(TestCategories.test_id))
        assert response.status_code == 200

    def test_headTodoCategories(self):
        print("--- Testing HEAD /todos/:id/categories")
        response = requests.head(TestCategories.url(TestCategories.test_id))
        assert response.status_code == 200

    def test_optionsCategories(self):
        print("--- Testing OPTIONS /todos/:id/categories")
        response = requests.options(TestCategories.url(TestCategories.test_id))
        assert response.status_code == 200

    def test_postCategories(self):
        print("--- Testing POST /todos/:id/categories")
        response = requests.post(TestCategories.url(TestCategories.test_id), json = TestCategories.body)
        assert response.status_code == 201

    def test_deleteCategories(self):
        print("--- Testing DELETE /todos/:id/categories/:id")
        response = requests.delete(f"{TD_URL}/{TestCategories.test_id}/categories/{TestCategories.test_id}")
        assert response.status_code == 200
