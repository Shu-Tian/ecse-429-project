Feature: Modify Todo
    As a user, I want to mark a todo task as done

Background:
    Given the server is running
    And the database contains the default todo objects

Scenario Outline: Mark a todo task as done (Normal Flow)
    When a todo with title <title> is marked with doneStatus <doneStatus>
    Then status code 200 will be received
    And the completed task <title> now has doneStatus <doneStatus>

    Examples:
        | title             | doneStatus   |
        | "scan paperwork"  | "true"       |
        | "file paperwork"  | "true"       |

Scenario Outline: Set an existing todo as done and add a description (Alternative Flow)
    When a todo with title <title> is marked with doneStatus <doneStatus> and additional description <description>
    Then status code 200 will be received
    And the completed task <title> now has doneStatus <doneStatus> and description <description>

    Examples:
        | title             | doneStatus   | description          |
        | "scan paperwork"  | "true"       | "papers in folder"   |
        | "file paperwork"  | "true"       | "it's done"          |

Scenario Outline: Attempt to modify an inexistant todo task (Error Flow)
    When an inexistant todo with id <badId> is selected
    Then status code 404 will be received

    Examples:
        | badId    |
        | 99       |