Feature: Delete a Todo
    As a user, I want to remove a todo task from my list

Background:
    Given the server is running
    And the database contains the default todo objects

Scenario Outline: Delete a todo with specified id (Normal Flow)
    When a todo with id <id> is deleted
    Then status code 200 will be received
    And a the todo with id <id> no longer exists in the database

    Examples:
        | id |
        | 1  |

Scenario Outline: Delete a todo with specified id after marking it as done (Alternate Flow)
    Given a todo with title <title> is marked with doneStatus <doneStatus>
    When a todo with id <id> is deleted
    Then status code 200 will be received
    And a the todo with id <id> no longer exists in the database

    Examples:
        | title             | id | doneStatus |
        | "file paperwork"  | 2  | "true"     |

Scenario Outline: Delete a todo with specified inexistant id (Error Flow)
    When a todo with id <id> is deleted
    Then status code 404 will be received

    Examples:
        | id    |
        | 99    |