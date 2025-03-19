Feature: View projects related to a todo task
    As a user, I want to view the projects a todo belongs to

Background:
    Given the server is running
    And the database contains the default todo objects

Scenario Outline: View projects related to a todo (Normal Flow)
    Given todo with id <todoId> is part of project with id <projectId>
    When user queries project of todo with id <todoId>
    Then status code 200 will be received
    And the related project with id <projectId> is shown

    Examples:
        | todoId | projectId |
        | 1      | "1"       |
        | 2      | "1"       |

Scenario Outline: View projects related to a todo that is not part of any projects (Alternate Flow)
    Given todo with title <title> is not part of any projects
    When user queries project of todo with title <title>
    Then status code 200 will be received
    And no project is shown

    Examples:
        | title             |
        | "print paperwork" |

Scenario Outline: View projects related to an inexistant todo (Error Flow)
    When user queries project of a todo with inexistant id <badId>
    Then status code 404 will be received

    Examples:
        | badId |
        | 99    |